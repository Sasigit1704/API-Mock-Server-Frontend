import api from "../api/api";

// Get all environments
export const getEnvironments = async () => {
  const { data } = await api.get("/Environment");
  return data;
};

// Get environment by ID
export const getEnvironmentById = async (id) => {
  const { data } = await api.get(`/Environment/${id}`);
  return data;
};

// Create environment
export const createEnvironment = async (environment) => {
  const { data } = await api.post("/Environment", environment);
  return data;
};

// Update environment
export const updateEnvironment = async (id, environment) => {
  const { data } = await api.put(`/Environment/${id}`, environment);
  return data;
};

// Patch environment
export const patchEnvironment = async (id, patchData) => {
    const { data } = await api.patch(`/Environment/${id}`, patchData);
    return data;
};

// Delete environment
export const deleteEnvironment = async (id) => {
  const { data } = await api.delete(`/Environment/${id}`);
  return data;
};