import api from "../api/api";

export const getEnvironments = async () => {
    const response = await api.get("/Environment");
    return response.data;
};

export const createEnvironment = async (environment) => {
    const response = await api.post("/Environment", environment);
    return response.data;
};

export const updateEnvironment = async (id, environment) => {
    const response = await api.put(`/Environment/${id}`, environment);
    return response.data;
};

export const deleteEnvironment = async (id) => {
    const response = await api.delete(`/Environment/${id}`);
    return response.data;
};
