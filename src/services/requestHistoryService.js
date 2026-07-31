import api from "../api/api";
import { API_ROUTES } from "../constants/apiRoutes";

export const getMockEndpoints = async () => {
  const { data } = await api.get(API_ROUTES.ENDPOINTS);
  return data;
};