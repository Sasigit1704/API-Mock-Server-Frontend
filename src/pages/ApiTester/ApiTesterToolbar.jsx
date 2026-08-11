import { useMemo, useState } from "react";
import { RefreshCw, Search, X } from "lucide-react";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";

function ApiTesterToolbar({
  endpoints,
  selectedEndpoint,
  setSelectedEndpoint,
  onRefresh,
  loading,
}) {
  const [search, setSearch] = useState("");

  const filteredEndpoints = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return endpoints;
    }

    return endpoints.filter((endpoint) =>
      [
        endpoint.name,
        endpoint.path,
        endpoint.method,
        endpoint.collectionId,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(value)
    );
  }, [endpoints, search]);

  const handleSelect = (id) => {
    const endpoint = endpoints.find(
      (item) => item.id === id
    );

    setSelectedEndpoint(endpoint || null);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Endpoint Selection
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Search and select any endpoint to test its actual mock behavior.
          </p>
        </div>

        <Button
          variant="secondary"
          type="button"
          onClick={onRefresh}
          disabled={loading}
        >
          <RefreshCw
            size={18}
            className={`mr-2 ${loading ? "animate-spin" : ""}`}
          />
          {loading ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr]">
        {/* Search */}

        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-3.5 text-slate-400"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, method, or endpoint path..."
            className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-10 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-3 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Endpoint */}

        <select
          value={selectedEndpoint?.id || ""}
          onChange={(e) => handleSelect(e.target.value)}
          className="rounded-xl border border-slate-300 bg-white px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
        >
          <option value="">
            Select Endpoint
          </option>

          {filteredEndpoints.map((endpoint) => (
            <option
              key={endpoint.id}
              value={endpoint.id}
            >
              {endpoint.method} • {endpoint.name} • {endpoint.path}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
        <span>
          {filteredEndpoints.length} endpoint
          {filteredEndpoints.length === 1 ? "" : "s"} found
        </span>

        {selectedEndpoint && (
          <div className="flex items-center gap-2">
            <Badge
              variant={
                selectedEndpoint.isEnabled
                  ? "success"
                  : "secondary"
              }
            >
              {selectedEndpoint.isEnabled
                ? "Enabled"
                : "Disabled"}
            </Badge>

            <span>
              {selectedEndpoint.method}{" "}
              {selectedEndpoint.path}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ApiTesterToolbar;