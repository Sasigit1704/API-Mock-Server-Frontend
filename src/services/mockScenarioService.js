import api from "../api/api";

// Get all scenarios
export const getMockScenarios = async () => {
  const { data } = await api.get("/MockScenarios");
  return data;
};

// Get scenario by ID
export const getMockScenarioById = async (id) => {
  const { data } = await api.get(`/MockScenarios/${id}`);
  return data;
};

// Get scenarios for an endpoint
export const getScenariosByEndpoint = async (endpointId) => {
  const { data } = await api.get(`/MockScenarios/endpoint/${endpointId}`);
  return data;
};

// Get active scenario
export const getActiveScenario = async (endpointId) => {
  const { data } = await api.get(`/MockScenarios/active/${endpointId}`);
  return data;
};

// Create scenario
export const createMockScenario = async (scenario) => {
  const { data } = await api.post("/MockScenarios", scenario);
  return data;
};

// Update scenario
export const updateMockScenario = async (id, scenario) => {
  const { data } = await api.put(`/MockScenarios/${id}`, scenario);
  return data;
};

// Patch scenario
export const patchMockScenario = async (id, patchData) => {
  const { data } = await api.patch(`/MockScenarios/${id}`, patchData);
  return data;
};

// Delete scenario
export const deleteMockScenario = async (id) => {
  const { data } = await api.delete(`/MockScenarios/${id}`);
  return data;
};