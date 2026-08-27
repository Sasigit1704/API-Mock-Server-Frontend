import api from "../api/api";

export const importOpenApi = async ({
  specification,
  collectionId,
  skipExisting = true,
}) => {
  const { data } = await api.post("/import/import", {
    specification,
    collectionId,
    skipExisting,
  });

  return data;
};