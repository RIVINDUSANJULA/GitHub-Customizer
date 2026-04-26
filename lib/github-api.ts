const GITHUB_GRAPHQL_API = "https://api.github.com/graphql";

// Simple in-memory cache for "Zero-Key" optimization
const cache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_TTL = 60 * 60 * 1000; // 60 minutes

export async function fetchUserLanguages(username: string, includeContribs: boolean, forceRefresh = false) {
  const cacheKey = `${username}-${includeContribs}`;
  
  // 1. Try to serve from cache first (if not force refresh)
  if (!forceRefresh && cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < CACHE_TTL) {
    return cache[cacheKey].data;
  }

  const token = process.env.GITHUB_TOKEN;
  
  try {
    // If no token, use the Pro REST Aggregator (Zero-Key)
    if (!token) {
      const data = await fetchResilientPublicData(username);
      cache[cacheKey] = { data, timestamp: Date.now() };
      return data;
    }

    // GraphQL path (preserved for token users)
    const fetchFromGithub = async (query: string) => {
      const response = await fetch(GITHUB_GRAPHQL_API, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, variables: { username } }),
        next: { revalidate: 3600 } 
      });

      const json = await response.json();
      if (json.errors) {
        if (json.errors.some((e: any) => e.type === 'RATE_LIMITED' || e.message.includes('rate limit'))) {
          // Failure-Proof: Return stale cache on rate limit
          if (cache[cacheKey]) return cache[cacheKey].data;
          throw new Error("GitHub Rate Limit Exceeded");
        }
        return { data: json.data, errors: json.errors };
      }
      return { data: json.data };
    };

    const ownedReposQuery = `
      query($username: String!) {
        user(login: $username) {
          repositories(first: 100, ownerAffiliations: OWNER, privacy: PUBLIC, orderBy: {field: PUSHED_AT, direction: DESC}) {
            nodes {
              isPrivate
              stargazerCount
              languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
                edges {
                  size
                  node {
                    name
                    color
                  }
                }
              }
            }
          }
        }
      }
    `;

    const ownedResult = await fetchFromGithub(ownedReposQuery);
    if (!ownedResult.data?.user) throw new Error("User not found");
    const userData = { ...ownedResult.data.user };
    cache[cacheKey] = { data: userData, timestamp: Date.now() };
    return userData;
  } catch (error) {
    console.error("GitHub API Error:", error);
    // Failure-Proof: Return stale cache on any error
    if (cache[cacheKey]) return cache[cacheKey].data;
    throw error;
  }
}

/**
 * Resilient Aggregator (Nuclear Mode)
 * Implements Module G: Failure-Proof fetching & deep byte-precise analysis.
 */
async function fetchResilientPublicData(username: string) {
  try {
    // 1. Fetch recent public repos (up to 50 for speed and rate limit safety)
    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=50&sort=updated`, {
      next: { revalidate: 3600 }
    });
    
    if (!reposRes.ok) {
      if (reposRes.status === 403) {
        console.warn("Rate limit hit, attempting to serve from stale cache...");
        throw new Error("RATE_LIMIT");
      }
      if (reposRes.status === 404) throw new Error("User not found");
      throw new Error("Failed to fetch repositories");
    }

    const repos = await reposRes.json();
    if (repos.length === 0) return { repositories: { nodes: [] }, status: 'no_public_data' };

    // Strategy: Deep-dive into top 3 repos for byte-precision, use primary data for rest
    const deepDiveCount = 3;
    const topRepos = repos.slice(0, deepDiveCount);
    const otherRepos = repos.slice(deepDiveCount);

    const topNodes = await Promise.all(topRepos.map(async (repo: any) => {
      try {
        const langRes = await fetch(repo.languages_url, { next: { revalidate: 3600 } });
        const langs = langRes.ok ? await langRes.json() : {};
        
        // Weighting: Stars boost the "impact" weight
        const weight = 1 + (repo.stargazers_count / 10);
        
        return {
          isPrivate: false,
          languages: {
            edges: Object.entries(langs).map(([name, size]) => ({
              size: (size as number) * weight,
              node: { name, color: null }
            }))
          }
        };
      } catch (e) {
        return null;
      }
    }));

    // 3. Fallback for the rest of the repos
    const otherNodes = otherRepos
      .filter((repo: any) => repo.language)
      .map((repo: any) => ({
        isPrivate: false,
        languages: {
          edges: [
            {
              size: repo.size || 1000,
              node: { name: repo.language, color: null }
            }
          ]
        }
      }));

    const allNodes = [...topNodes.filter(Boolean), ...otherNodes];

    // Extract topics from all repos for Skill Badges
    const topics = repos.flatMap((repo: any) => repo.topics || []);
    
    return {
      repositories: { nodes: allNodes },
      topics
    };
  } catch (error: any) {
    if (error.message === 'RATE_LIMIT') throw error;
    console.error("Resilient Fetch Error:", error);
    return { repositories: { nodes: [] }, topics: [] };
  }
}

export function aggregateSkills(userData: any) {
  const skillCount: Record<string, number> = {};
  
  // 1. Process topics (from REST API path)
  if (userData.topics) {
    userData.topics.forEach((topic: string) => {
      skillCount[topic] = (skillCount[topic] || 0) + 1;
    });
  }

  // 2. Process languages (as secondary skills)
  const langs = aggregateLanguages(userData);
  langs.forEach(l => {
    const name = l.name.toLowerCase();
    skillCount[name] = (skillCount[name] || 0) + 2; // Weight languages slightly higher
  });

  return Object.entries(skillCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15); // Top 15 skills
}

export function aggregateLanguages(userData: any) {
  const languageMap: Record<string, { size: number; color: string }> = {};

  const processRepo = (repo: any) => {
    if (repo.isPrivate || !repo.languages?.edges) return;
    
    repo.languages.edges.forEach((edge: any) => {
      const { name, color } = edge.node;
      const size = edge.size as number;
      if (languageMap[name]) {
        languageMap[name].size += size;
      } else {
        languageMap[name] = { size, color: color || getLanguageColor(name) };
      }
    });
  };

  if (userData.repositories?.nodes) {
    userData.repositories.nodes.forEach(processRepo);
  }
  
  if (userData.repositoriesContributedTo?.nodes) {
    userData.repositoriesContributedTo.nodes.forEach(processRepo);
  }

  const totalBytes = Object.values(languageMap).reduce((acc, curr) => acc + curr.size, 0);
  if (totalBytes === 0) return [];

  // Group < 1% into "Others"
  const aggregated = Object.entries(languageMap)
    .map(([name, { size, color }]) => ({
      name,
      size,
      color,
      percentage: (size / totalBytes) * 100,
    }))
    .sort((a, b) => b.size - a.size);

  const mainLangs = aggregated.filter(l => l.percentage >= 1);
  const otherLangs = aggregated.filter(l => l.percentage < 1);

  if (otherLangs.length > 0) {
    const otherSize = otherLangs.reduce((acc, l) => acc + l.size, 0);
    mainLangs.push({
      name: "Others",
      size: otherSize,
      color: "#8e8e8e",
      percentage: (otherSize / totalBytes) * 100
    });
  }

  return mainLangs;
}

function getLanguageColor(name: string): string {
  const colors: Record<string, string> = {
    'TypeScript': '#3178c6',
    'JavaScript': '#f1e05a',
    'Java': '#b07219',
    'Python': '#3572A5',
    'HTML': '#e34c26',
    'CSS': '#563d7c',
    'Rust': '#dea584',
    'Go': '#00ADD8',
    'C++': '#f34b7d',
    'PHP': '#4F5D95',
    'Ruby': '#701516',
    'Swift': '#F05138',
    'Kotlin': '#A97BFF',
    'Dart': '#00B4AB',
  };
  return colors[name] || '#cccccc';
}

function getMockData() {
  return {
    repositories: {
      nodes: [
        { languages: { edges: [{ size: 5000, node: { name: "TypeScript", color: "#3178c6" } }, { size: 2000, node: { name: "JavaScript", color: "#f1e05a" } }] } },
        { languages: { edges: [{ size: 3000, node: { name: "TypeScript", color: "#3178c6" } }, { size: 1000, node: { name: "CSS", color: "#563d7c" } }] } }
      ]
    }
  };
}
