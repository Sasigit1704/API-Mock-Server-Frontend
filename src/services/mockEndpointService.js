import api from "../api/api";

export const getMockEndpoints = async () => {
    const response = await api.get("/MockEndpoints");
    return response.data;
};

export const createMockEndpoint = async (endpoint) => {
    const response = await api.post("/MockEndpoints", endpoint);
    return response.data;
};

export const updateMockEndpoint = async (id, endpoint) => {
    const response = await api.put(`/MockEndpoints/${id}`, endpoint);
    return response.data;
};

export const deleteMockEndpoint = async (id) => {
    const response = await api.delete(`/MockEndpoints/${id}`);
    return response.data;
};