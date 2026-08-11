import { useEffect, useMemo, useState } from "react";
import { getSearchData } from "../services/searchService";

export default function useGlobalSearch(searchTerm) {
  const [data, setData] = useState({
    endpoints: [],
    collections: [],
    environments: [],
    scenarios: [],
    requestHistory: [],
  });

  useEffect(() => {
    async function loadData() {
      const result = await getSearchData();
      setData(result);
    }

    loadData();
  }, []);

  const results = useMemo(() => {
    if (!searchTerm.trim()) {
      return {
        endpoints: [],
        collections: [],
        environments: [],
        scenarios: [],
        requestHistory: [],
      };
    }

    const keyword = searchTerm.toLowerCase().trim();

    return {
      endpoints: data.endpoints
        .filter((item) =>
          [
            item.name,
            item.path,
            item.method,
            String(item.statusCode),
            item.responseBody,
            item.isEnabled ? "enabled" : "disabled",
          ]
            .join(" ")
            .toLowerCase()
            .includes(keyword)
        )
        .slice(0, 5),

      collections: data.collections
        .filter((item) =>
          [
            item.name,
            item.description,
          ]
            .join(" ")
            .toLowerCase()
            .includes(keyword)
        )
        .slice(0, 5),

      environments: data.environments
        .filter((item) =>
          [
            item.name,
            item.baseUrl,
            item.description,
            item.isActive ? "active" : "inactive",
          ]
            .join(" ")
            .toLowerCase()
            .includes(keyword)
        )
        .slice(0, 5),

      scenarios: data.scenarios
        .filter((item) =>
          [
            item.scenarioName,
            String(item.statusCode),
            item.responseBody,
            String(item.delay),
            String(item.timeoutDelay),
            item.enableTimeout ? "timeout" : "",
            item.enableRandomFailure ? "failure" : "",
            item.isActive ? "active" : "inactive",
          ]
            .join(" ")
            .toLowerCase()
            .includes(keyword)
        )
        .slice(0, 5),

      requestHistory: data.requestHistory
        .filter((item) =>
          [
            item.method,
            item.path,
            String(item.statusCode),
            String(item.responseTimeMs),
            item.endpointName ?? "",
            item.scenarioName ?? "",
          ]
            .join(" ")
            .toLowerCase()
            .includes(keyword)
        )
        .slice(0, 5),
    };
  }, [searchTerm, data]);

  return results;
}