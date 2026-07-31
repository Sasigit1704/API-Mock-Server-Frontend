import api from "../api/api";

// Get all endpoints
export const getMockEndpoints = async () => {
  const { data } = await api.get("/MockEndpoints");
  return data;
};

// Get endpoint by ID
export const getMockEndpointById = async (id) => {
  const { data } = await api.get(`/MockEndpoints/${id}`);
  return data;
};

// Create endpoint
export const createMockEndpoint = async (endpoint) => {
  const { data } = await api.post("/MockEndpoints", endpoint);
  return data;
};

// Update endpoint
export const updateMockEndpoint = async (id, endpoint) => {
  const { data } = await api.put(`/MockEndpoints/${id}`, endpoint);
  return data;
};

// Delete endpoint
export const deleteMockEndpoint = async (id) => {
  const { data } = await api.delete(`/MockEndpoints/${id}`);
  return data;
};