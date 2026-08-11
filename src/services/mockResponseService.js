import api from "../api/api";

export const getResponsesByEndpoint = async (endpointId) => {
  const response = await api.get(
    `/mock-responses/endpoint/${endpointId}`
  );

  return response.data;
};

export const getResponseById = async (id) => {
  const response = await api.get(
    `/mock-responses/${id}`
  );

  return response.data;
};

export const createResponse = async (data) => {
  const response = await api.post(
    "/mock-responses",
    data
  );

  return response.data;
};

export const updateResponse = async (id, data) => {
  const response = await api.put(
    `/mock-responses/${id}`,
    data
  );

  return response.data;
};

export const activateResponse = async (id) => {
  const response = await api.patch(
    `/mock-responses/${id}/activate`
  );

  return response.data;
};

export const deleteResponse = async (id) => {
  const response = await api.delete(
    `/mock-responses/${id}`
  );

  return response.data;
};