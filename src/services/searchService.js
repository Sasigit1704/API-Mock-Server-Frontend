import api from "../api/api";

export async function getSearchData() {
  try {
    const [
      endpoints,
      collections,
      environments,
      scenarios,
      requestHistory,
    ] = await Promise.all([
      api.get("/MockEndpoints"),
      api.get("/Collections"),
      api.get("/Environment"),
      api.get("/MockScenarios"),
      api.get("/RequestHistory"),
    ]);

    return {
      endpoints: endpoints.data,
      collections: collections.data,
      environments: environments.data,
      scenarios: scenarios.data,
      requestHistory: requestHistory.data,
    };
  } catch (error) {
    console.error("Failed to fetch search data:", error);

    return {
      endpoints: [],
      collections: [],
      environments: [],
      scenarios: [],
      requestHistory: [],
    };
  }
}

export async function refreshSearchData() {
  return getSearchData();
}