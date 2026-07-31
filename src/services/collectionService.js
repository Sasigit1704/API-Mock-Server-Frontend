import api from "../api/api";

// Get all collections
export const getCollections = async () => {
  const { data } = await api.get("/Collections");
  return data;
};

// Get collection by ID
export const getCollectionById = async (id) => {
  const { data } = await api.get(`/Collections/${id}`);
  return data;
};

// Create collection
export const createCollection = async (collection) => {
  const { data } = await api.post("/Collections", collection);
  return data;
};

// Update collection
export const updateCollection = async (id, collection) => {
  const { data } = await api.put(`/Collections/${id}`, collection);
  return data;
};

// Delete collection
export const deleteCollection = async (id) => {
  const { data } = await api.delete(`/Collections/${id}`);
  return data;
};