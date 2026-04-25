const GITHUB_GRAPHQL_API = "https://api.github.com/graphql";

export async function fetchUserLanguages(username: string, includeContribs: boolean) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error("GITHUB_TOKEN is not set");
    }
    return getMockData();
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
        repositories(first: 100, ownerAffiliations: OWNER, orderBy: {field: PUSHED_AT, direction: DESC}) {
          nodes {
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
        repositoriesContributedTo(first: 100, contributionTypes: [COMMIT, PULL_REQUEST, REPOSITORY], orderBy: {field: PUSHED_AT, direction: DESC}) {
          nodes {
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
    const ownedResult = await fetchFromGithub(ownedReposQuery);
    if (!ownedResult.data?.user) throw new Error("User not found");

    const userData = { ...ownedResult.data.user };

    if (includeContribs) {
      try {
        const contribResult = await fetchFromGithub(contribReposQuery);
        if (contribResult.data?.user?.repositoriesContributedTo) {
          userData.repositoriesContributedTo = contribResult.data.user.repositoriesContributedTo;
        }
      } catch (e) {
        console.warn("Failed to fetch contributions, falling back to owned repos only", e);
      }
    }

    return userData;
  } catch (error) {
    console.error("GitHub API Error:", error);
    throw error;
  }
}

export function aggregateLanguages(userData: any) {
  const languageMap: Record<string, { size: number; color: string }> = {};

  const processRepo = (repo: any) => {
    if (!repo.languages || !repo.languages.edges) return;
    repo.languages.edges.forEach((edge: any) => {
      const { name, color } = edge.node;
      const size = edge.size;
      if (languageMap[name]) {
        languageMap[name].size += size;
      } else {
        languageMap[name] = { size, color: color || "#cccccc" };
      }
    });
  };

  userData.repositories.nodes.forEach(processRepo);
  if (userData.repositoriesContributedTo) {
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
