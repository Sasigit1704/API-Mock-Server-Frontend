import api from "../api/api";

export const getEndpoints = async () => {
  const { data } = await api.get("/MockEndpoints");
  return data;
};

export const testEndpoint = async (
  method,
  path,
  body,
  token
) => {
  const response = await api({
    url: `/mock${path}`,
    method,
    data: body,
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  });

  return response;
};