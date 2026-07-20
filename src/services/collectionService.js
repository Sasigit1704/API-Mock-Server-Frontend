import api from "../api/api";

export const getCollections = async () => {
    const response = await api.get("/Collections");
    return response.data;
};

export const createCollection = async (collection) => {
    const response = await api.post("/Collections", collection);
    return response.data;
};

export const updateCollection = async (id, collection) => {
    const response = await api.put(`/Collections/${id}`, collection);
    return response.data;
};

export const deleteCollection = async (id) => {
    const response = await api.delete(`/Collections/${id}`);
    return response.data;
};