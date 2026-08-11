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

// Export CSV
export const exportRequestHistoryCsv = async () => {
  const response = await api.get(
    "/RequestHistory/export/csv",
    {
      responseType: "blob",
    }
  );

  const url = window.URL.createObjectURL(
    new Blob([response.data])
  );

  const link = document.createElement("a");

  link.href = url;
  link.download = "RequestHistory.csv";

  document.body.appendChild(link);

  link.click();

  link.remove();

  window.URL.revokeObjectURL(url);
};

// Export JSON
export const exportRequestHistoryJson = async () => {
  const logs = await getRequestHistory();

  const blob = new Blob(
    [JSON.stringify(logs, null, 2)],
    {
      type: "application/json",
    }
  );

  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = "RequestHistory.json";

  document.body.appendChild(link);

  link.click();

  link.remove();

  window.URL.revokeObjectURL(url);
};