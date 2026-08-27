import {
  Pencil,
  Trash2,
  Workflow,
  X,
} from "lucide-react";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Table from "../../components/ui/Table";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import ResponseList from "../../components/forms/ResponseList";

function EndpointTable({
  endpoints,
  highlightedId,
  collectionMap,
  onEdit,
  onDelete,
  onCreate,
  expandedEndpointId,
  onToggleExpand,
  onCloseDetails,
}) {
  const navigate = useNavigate();

  const selectedEndpoint =
    endpoints.find(
      (endpoint) =>
        endpoint.id ===
        expandedEndpointId
    ) || null;

  useEffect(() => {
    if (!selectedEndpoint) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onCloseDetails();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    selectedEndpoint,
    onCloseDetails,
  ]);

  if (endpoints.length === 0) {
    return (
      <EmptyState
        title="No Endpoints Found"
        description="No endpoints match your current search or filters."
        buttonText="Create Endpoint"
        onClick={onCreate}
      />
    );
  }

  return (
    <>
      <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <Table
          headers={[
            "Name",
            "Method",
            "Endpoint",
            "Status",
            "Collection",
            "Edit | Manage Scenario | Delete",
          ]}
        >
          {endpoints.map((endpoint) => (
            <tr
              key={endpoint.id}
              onClick={() =>
                onToggleExpand(endpoint.id)
              }
              className={`cursor-pointer border-t transition hover:bg-slate-50 ${
                highlightedId === endpoint.id
                  ? "bg-blue-100 ring-2 ring-blue-300"
                  : ""
              }`}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="font-medium text-slate-900">
                  {endpoint.name}
                </span>
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <Badge
                  variant={
                    endpoint.method.toLowerCase()
                  }
                >
                  {endpoint.method}
                </Badge>
              </td>

              <td className="px-6 py-4 font-mono text-sm font-medium text-slate-700">
                {endpoint.path}
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <Badge
                  variant={
                    endpoint.statusCode >= 500
                      ? "error"
                      : endpoint.statusCode >= 400
                      ? "warning"
                      : "success"
                  }
                >
                  {endpoint.statusCode}
                </Badge>
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                {collectionMap[
                  endpoint.collectionId
                ] ?? "Uncategorized"}
              </td>

              <td
                className="px-6 py-4 whitespace-nowrap"
                onClick={(event) =>
                  event.stopPropagation()
                }
              >
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      onEdit(endpoint)
                    }
                    className="rounded-full p-2 hover:bg-blue-100 transition"
                    title="Edit Endpoint"
                  >
                    <Pencil
                      size={18}
                      className="text-blue-600"
                    />
                  </button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      navigate(
                        `/scenarios?endpoint=${endpoint.id}`
                      )
                    }
                  >
                    <Workflow size={16} />
                    Manage Scenarios
                  </Button>

                  <button
                    type="button"
                    onClick={() =>
                      onDelete(endpoint)
                    }
                    className="rounded-full p-2 hover:bg-red-100 transition"
                    title="Delete Endpoint"
                  >
                    <Trash2
                      size={18}
                      className="text-red-600"
                    />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </div>

      {selectedEndpoint && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-3 sm:p-6 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              onCloseDetails();
            }
          }}
        >
          <div
            className="max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Endpoint Details
                </h2>

                <p className="mt-1 font-mono text-xs sm:text-sm text-slate-500 break-all">
                  {selectedEndpoint.method}{" "}
                  {selectedEndpoint.path}
                </p>
              </div>

              <button
                type="button"
                onClick={onCloseDetails}
                className="rounded-full p-2 transition hover:bg-slate-100"
                title="Close"
              >
                <X
                  size={22}
                  className="text-slate-600"
                />
              </button>
            </div>

            <div className="space-y-6 sm:space-y-8 p-4 sm:p-6">
              <div>
                <h3 className="mb-4 text-lg font-semibold text-slate-900">
                  Endpoint Information
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <p className="text-sm text-slate-500">
                      Name
                    </p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {selectedEndpoint.name}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Method
                    </p>
                    <div className="mt-1">
                      <Badge
                        variant={
                          selectedEndpoint.method.toLowerCase()
                        }
                      >
                        {selectedEndpoint.method}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Path
                    </p>
                    <p className="mt-1 font-mono text-sm text-slate-900 break-all">
                      {selectedEndpoint.path}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Collection
                    </p>
                    <p className="mt-1 text-slate-900">
                      {collectionMap[
                        selectedEndpoint
                          .collectionId
                      ] ??
                        "Uncategorized"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Status
                    </p>
                    <div className="mt-1">
                      <Badge
                        variant={
                          selectedEndpoint.statusCode >=
                          500
                            ? "error"
                            : selectedEndpoint.statusCode >=
                              400
                            ? "warning"
                            : "success"
                        }
                      >
                        {
                          selectedEndpoint.statusCode
                        }
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Enabled
                    </p>
                    <div className="mt-1">
                      <Badge
                        variant={
                          selectedEndpoint.isEnabled
                            ? "success"
                            : "secondary"
                        }
                      >
                        {selectedEndpoint.isEnabled
                          ? "Yes"
                          : "No"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Default Response
                  </h3>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      navigator.clipboard.writeText(
                        selectedEndpoint.responseBody
                      )
                    }
                  >
                    Copy Response
                  </Button>
                </div>

                <pre className="max-h-[300px] overflow-auto rounded-xl bg-slate-900 p-4 sm:p-5 font-mono text-xs sm:text-sm text-green-400">
                  {
                    selectedEndpoint.responseBody
                  }
                </pre>
              </div>

              <ResponseList
                endpointId={
                  selectedEndpoint.id
                }
                enablePercentageBasedResponses={
                  selectedEndpoint
                    .enablePercentageBasedResponses ??
                  false
                }
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default EndpointTable;