import api from "../api/api";

export const getEndpoints = async () => {
  const { data } = await api.get("/MockEndpoints");
  return data;
};

const buildRequestPath = (path, pathParams = {}, queryParams = []) => {
  let resolvedPath = path || "";

  Object.entries(pathParams).forEach(([name, value]) => {
    resolvedPath = resolvedPath.replace(
      `{${name}}`,
      encodeURIComponent(value ?? "")
    );
  });

  const query = queryParams
    .filter((item) => item.name?.trim())
    .map(
      (item) =>
        `${encodeURIComponent(item.name.trim())}=${encodeURIComponent(
          item.value ?? ""
        )}`
    )
    .join("&");

  return `/mock${resolvedPath}${query ? `?${query}` : ""}`;
};

export const testEndpoint = async (
  method,
  path,
  body,
  token,
  pathParams = {},
  queryParams = []
) => {
  const response = await api({
    url: buildRequestPath(path, pathParams, queryParams),
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