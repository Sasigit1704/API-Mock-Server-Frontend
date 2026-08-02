import { useEffect, useMemo, useState } from "react";
import { getSearchData } from "../services/searchService";

export default function useGlobalSearch(searchTerm) {
  const [data, setData] = useState({
    endpoints: [],
    collections: [],
    environments: [],
    scenarios: [],
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
      };
    }

    const keyword = searchTerm.toLowerCase();

    return {
      endpoints: data.endpoints.filter((item) =>
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
      ),

      collections: data.collections.filter((item) =>
        [
          item.name,
          item.description,
        ]
          .join(" ")
          .toLowerCase()
          .includes(keyword)
      ),

      environments: data.environments.filter((item) =>
        [
          item.name,
          item.baseUrl,
          item.description,
          item.isActive ? "active" : "inactive",
        ]
          .join(" ")
          .toLowerCase()
          .includes(keyword)
      ),

      scenarios: data.scenarios.filter((item) => {
        const searchableText = [
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
        return searchableText.includes(keyword);
      }),
    };
  }, [searchTerm, data]);

  return results;
}