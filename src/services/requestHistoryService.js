import api from "../api/api";

// Get all request history
export const getRequestHistory = async () => {
  const { data } = await api.get("/RequestHistory");
  return data;
};

// Get request by ID
export const getRequestHistoryById = async (id) => {
  const { data } = await api.get(`/RequestHistory/${id}`);
  return data;
};

// Delete request
export const deleteRequestHistory = async (id) => {
  await api.delete(`/RequestHistory/${id}`);
};

// Clear all history
export const clearRequestHistory = async () => {
  await api.delete("/RequestHistory");
};