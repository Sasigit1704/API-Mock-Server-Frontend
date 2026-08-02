import { useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useGlobalSearch from "../../hooks/useGlobalSearch";

function GlobalSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const {
    endpoints,
    collections,
    environments,
    scenarios,
  } = useGlobalSearch(searchTerm);

  const totalResults =
    endpoints.length +
    collections.length +
    environments.length +
    scenarios.length;

  return (
    <div className="relative w-[420px]">

      <Search
        size={18}
        className="absolute left-4 top-3.5 text-slate-400"
      />

      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search endpoints, collections..."
        className="
          w-full
          h-12
          pl-11
          pr-4
          rounded-xl
          border
          shadow-sm
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
        "
      />

      {searchTerm && (
        <div
          className="
            absolute
            mt-2
            w-full
            rounded-xl
            border
            bg-white
            shadow-xl
            z-50
            max-h-[450px]
            overflow-y-auto
          "
        >
          {totalResults === 0 && (
            <p className="p-4 text-slate-500">
              No results found.
            </p>
          )}

          {endpoints.length > 0 && (
            <>
              <div className="px-4 pt-4 pb-2 text-xs font-bold uppercase text-slate-400">
                Endpoints
              </div>

              {endpoints.map((item) => (
                <div
                  key={item.id}
                  className="cursor-pointer border-b border-slate-100 px-4 py-3 transition hover:bg-slate-50"
                  onClick={() => {
                    navigate("/builder", {
                      state: {
                        highlightEndpointId: item.id,
                      },
                    });

                    setSearchTerm("");
                  }}
                >
                  <div className="flex items-center gap-2">

                    <span
                      className={`rounded px-2 py-0.5 text-xs font-bold text-white
                        ${
                          item.method === "GET"
                            ? "bg-green-500"
                            : item.method === "POST"
                            ? "bg-blue-500"
                            : item.method === "PUT"
                            ? "bg-yellow-500"
                            : item.method === "PATCH"
                            ? "bg-purple-500"
                            : "bg-red-500"
                        }`}
                    >
                      {item.method}
                    </span>

                    <span className="font-semibold">
                      {item.name}
                    </span>

                  </div>

                  <p className="mt-1 font-mono text-sm text-slate-500">
                    {item.path}
                  </p>

                  <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                    <span>Status {item.statusCode}</span>

                    <span>•</span>

                    <span>
                      {item.isEnabled ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                </div>
              ))}
            </>
          )}

          {collections.length > 0 && (
            <>
              <div className="px-4 pt-4 pb-2 text-xs font-bold uppercase text-slate-400">
                Collections
              </div>

              {collections.map((item) => (
                <div
                  key={item.id}
                  className="cursor-pointer border-b border-slate-100 px-4 py-3 transition hover:bg-slate-50"
                  onClick={() => {
                    navigate("/collections", {
                      state: {
                        highlightCollectionId: item.id,
                      },
                    });

                    setSearchTerm("");
                  }}
                >
                  <p className="font-semibold">
                    {item.name}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {item.description}
                  </p>
                </div>
              ))}
            </>
          )}

          {environments.length > 0 && (
            <>
              <div className="px-4 pt-4 pb-2 text-xs font-bold uppercase text-slate-400">
                Environments
              </div>

              {environments.map((item) => (
                <div
                  key={item.id}
                  className="cursor-pointer border-b border-slate-100 px-4 py-3 transition hover:bg-slate-50"
                  onClick={() => {
                    navigate("/environment", {
                      state: {
                        highlightEnvironmentId: item.id,
                      },
                    });

                    setSearchTerm("");
                  }}
                >
                  <p className="font-semibold">
                    {item.name}
                  </p>

                  <p className="mt-1 font-mono text-sm text-slate-500">
                    {item.baseUrl}
                  </p>

                  <div className="mt-2 text-xs text-slate-500">
                    {item.isActive ? "Active" : "Inactive"}
                  </div>
                </div>
              ))}
            </>
          )}

          {scenarios.length > 0 && (
            <>
              <div className="px-4 pt-4 pb-2 text-xs font-bold uppercase text-slate-400">
                Scenarios
              </div>

              {scenarios.map((item) => (
                <div
                  key={item.id}
                  className="cursor-pointer border-b border-slate-100 px-4 py-3 transition hover:bg-slate-50"
                  onClick={() => {
                    navigate(
                      `/scenarios?endpoint=${item.mockEndpointId}`,
                      {
                        state: {
                          highlightScenarioId: item.id,
                        },
                      }
                    );

                    setSearchTerm("");
                  }}
                >
                  <p className="font-semibold">
                    {item.scenarioName}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">

                    <span>Status {item.statusCode}</span>

                    <span>•</span>

                    <span>{item.delay} ms</span>

                    {item.enableTimeout && (
                      <>
                        <span>•</span>
                        <span>Timeout</span>
                      </>
                    )}

                    {item.enableRandomFailure && (
                      <>
                        <span>•</span>
                        <span>{item.failureRate}% Failure</span>
                      </>
                    )}

                    <span>•</span>

                    <span>
                      {item.isActive ? "Active" : "Inactive"}
                    </span>

                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default GlobalSearch;