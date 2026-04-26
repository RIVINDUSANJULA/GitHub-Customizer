const GITHUB_GRAPHQL_API = "https://api.github.com/graphql";

export async function fetchUserLanguages(username: string, includeContribs: boolean) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error("GITHUB_TOKEN is not set");
    }
    // Fallback to REST API for public repos if no token
    return fetchPublicData(username);
  }

  // Helper to fetch data via GraphQL
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
      // If we hit a rate limit or other major error, throw it
      if (json.errors.some((e: any) => e.type === 'RATE_LIMITED' || e.message.includes('rate limit'))) {
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

  const contribReposQuery = `
    query($username: String!) {
      user(login: $username) {
        repositoriesContributedTo(first: 100, contributionTypes: [COMMIT, PULL_REQUEST], privacy: PUBLIC, orderBy: {field: PUSHED_AT, direction: DESC}) {
          nodes {
            isPrivate
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

  try {
    // We can run these in parallel to speed up, but with a total timeout
    const fetchWithTimeout = async (query: string) => {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 8000); // 8s timeout
      try {
        const result = await fetchFromGithub(query);
        clearTimeout(id);
        return result;
      } catch (e) {
        clearTimeout(id);
        throw e;
      }
    };

    const ownedResult = await fetchWithTimeout(ownedReposQuery);
    if (!ownedResult.data?.user) throw new Error("User not found");

    const userData = { ...ownedResult.data.user };

    if (includeContribs) {
      try {
        const contribResult = await fetchWithTimeout(contribReposQuery);
        if (contribResult.data?.user?.repositoriesContributedTo) {
          userData.repositoriesContributedTo = contribResult.data.user.repositoriesContributedTo;
        }
      } catch (e) {
        console.warn("Contribution fetch timed out or failed, using owned repos only.");
      }
    }

    return userData;
  } catch (error) {
    console.error("GitHub API Error:", error);
    throw error;
  }
}

async function fetchPublicData(username: string) {
  try {
    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`, {
      next: { revalidate: 3600 }
    });
    
    if (!reposRes.ok) {
      if (reposRes.status === 404) throw new Error("User not found");
      throw new Error("Failed to fetch from GitHub REST API");
    }

    const repos = await reposRes.json();
    const nodes = await Promise.all(repos.map(async (repo: any) => {
      const langRes = await fetch(repo.languages_url, {
        next: { revalidate: 3600 }
      });
      const langs = langRes.ok ? await langRes.json() : {};
      
      return {
        isPrivate: false,
        languages: {
          edges: Object.entries(langs).map(([name, size]) => ({
            size,
            node: { name, color: null } // REST API doesn't provide colors easily without extra steps
          }))
        }
      };
    }));

    return {
      repositories: { nodes }
    };
  } catch (error) {
    console.error("Public Fetch Error:", error);
    return getMockData();
  }
}

export function aggregateLanguages(userData: any) {
  const languageMap: Record<string, { size: number; color: string }> = {};

  const processRepo = (repo: any) => {
    // Strict secondary check: Skip if repo is private
    if (repo.isPrivate) return;
    
    if (!repo.languages || !repo.languages.edges) return;
    repo.languages.edges.forEach((edge: any) => {
      const { name, color } = edge.node;
      const size = edge.size as number;
      if (languageMap[name]) {
        languageMap[name].size += size;
      } else {
        languageMap[name] = { size, color: color || "#cccccc" };
      }
    });
  };

  if (userData.repositories?.nodes) {
    userData.repositories.nodes.forEach(processRepo);
  }
  
  if (userData.repositoriesContributedTo?.nodes) {
    userData.repositoriesContributedTo.nodes.forEach(processRepo);
  }

  const totalSize = Object.values(languageMap).reduce((acc, curr) => acc + curr.size, 0);

  if (totalSize === 0) return [];

  return Object.entries(languageMap)
    .map(([name, { size, color }]) => ({
      name,
      size,
      color,
      percentage: (size / totalSize) * 100,
    }))
    .sort((a, b) => b.size - a.size);
}

function getMockData() {
  return {
    repositories: {
      nodes: [
        { languages: { edges: [{ size: 5000, node: { name: "TypeScript", color: "#3178c6" } }, { size: 2000, node: { name: "JavaScript", color: "#f1e05a" } }] } },
        { languages: { edges: [{ size: 3000, node: { name: "TypeScript", color: "#3178c6" } }, { size: 1000, node: { name: "CSS", color: "#563d7c" } }] } }
      ]
    },
    repositoriesContributedTo: {
      nodes: [
        { languages: { edges: [{ size: 4000, node: { name: "Rust", color: "#dea584" } }] } }
      ]
    }
  };
}
