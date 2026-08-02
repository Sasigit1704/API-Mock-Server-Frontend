import api from "../api/api";

export async function getSearchData() {
  try {
    const [
      endpoints,
      collections,
      environments,
      scenarios,
    ] = await Promise.all([
      api.get("/MockEndpoints"),
      api.get("/Collections"),
      api.get("/Environment"),
      api.get("/MockScenarios"),
    ]);

    return {
      endpoints: endpoints.data,
      collections: collections.data,
      environments: environments.data,
      scenarios: scenarios.data,
    };
  } catch (error) {
    console.error("Failed to fetch search data:", error);

    return {
      endpoints: [],
      collections: [],
      environments: [],
      scenarios: [],
    };
  }
}

export async function refreshSearchData() {
    return getSearchData();
}