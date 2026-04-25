const GITHUB_GRAPHQL_API = "https://api.github.com/graphql";

export async function fetchUserLanguages(username: string, includeContribs: boolean) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    // Return a mock or empty if token is missing during dev, but throw in production
    if (process.env.NODE_ENV === 'production') {
      throw new Error("GITHUB_TOKEN is not set");
    }
    console.warn("GITHUB_TOKEN is missing. Returning mock data.");
    return getMockData();
  }

  const query = `
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
        ${includeContribs ? `
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
        ` : ""}
      }
    }
  `;

  try {
    const response = await fetch(GITHUB_GRAPHQL_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables: { username } }),
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    const json = await response.json();
    if (json.errors) {
      throw new Error(json.errors[0].message);
    }

    if (!json.data || !json.data.user) {
      throw new Error("User not found or data missing");
    }

    return json.data.user;
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
