import {
  ChevronRight,
  ChevronDown,
  Pencil,
  Trash2,
  Workflow,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import Table from "../../components/ui/Table";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";

function EndpointTable({
  endpoints,
  collectionMap,
  onEdit,
  onDelete,
  onCreate,
  expandedEndpointId,
  onToggleExpand,
}) {
  const navigate = useNavigate();

  if (endpoints.length === 0) {
    return (
      <EmptyState
        title="No Endpoints Found"
        description="Create your first mock endpoint to get started."
        buttonText="Create Endpoint"
        onClick={onCreate}
      />
    );
  }

  return (
    <Table
      headers={[
        "",
        "Method",
        "Endpoint",
        "Status",
        "Collection",
        "Edit | Manage Scenario | Delete",
      ]}
    >
      {endpoints.map((endpoint) => (
        <>
          {/* Main Row */}

          <tr
            key={endpoint.id}
            onClick={() => onToggleExpand(endpoint.id)}
            className={`cursor-pointer border-t transition-all duration-300
              ${
                expandedEndpointId === endpoint.id ? "bg-blue-50 ring-2 ring-blue-300" : "hover:bg-slate-50"
              }`}
            id={`endpoint-${endpoint.id}`}
          >
   
            {/* Expand Icon */}

            <td className="px-4 py-5">
              {expandedEndpointId === endpoint.id ? (
                <ChevronDown size={18} />
              ) : (
                <ChevronRight size={18} />
              )}

            </td>

            {/* Method */}

            <td className="px-8 py-5">
              <Badge variant={endpoint.method.toLowerCase()}>
                {endpoint.method}
              </Badge>

            </td>

            {/* Path */}

            <td className="px-8 py-5 font-medium">
              {endpoint.path}
            </td>

            {/* Status */}

            <td className="px-8 py-5">
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

            {/* Collection */}

            <td className="px-8 py-5">
              {collectionMap[endpoint.collectionId] ??
                "Uncategorized"}
            </td>

            {/* Actions */}

            <td className="px-8 py-5">
              <div className="flex items-center gap-2">

                {/* Edit */}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(endpoint);
                  }}
                  className="rounded-full p-2 hover:bg-blue-100"
                >
                  <Pencil
                    size={18}
                    className="text-blue-600"
                  />
                </button>

                {/* Manage Scenario */}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(
                      `/scenarios?endpoint=${endpoint.id}`
                    );
                  }}
                >
                  <Workflow size={16} />
                  Manage Scenarios
                </Button>
                {/* Delete */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(endpoint);
                  }}
                  className="rounded-full p-2 hover:bg-red-100"
                >
                  <Trash2
                    size={18}
                    className="text-red-600"
                  />
                </button>
              </div>
            </td>
          </tr>

          {/* Expanded Row */}

          {expandedEndpointId === endpoint.id && (
            <tr>
              <td
                colSpan={6}
                className="bg-slate-50 px-8 py-8"
              >
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                  <h3 className="mb-6 text-xl font-semibold">
                    Endpoint Details
                  </h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-slate-500">
                        Name
                      </p>
                      <p className="font-semibold">
                        {endpoint.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">
                        Method
                      </p>
                      <Badge
                        variant={endpoint.method.toLowerCase()}
                      >
                        {endpoint.method}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">
                        Path
                      </p>
                      <p className="font-mono">
                        {endpoint.path}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">
                        Collection
                      </p>
                      <p>
                        {collectionMap[
                          endpoint.collectionId
                        ] ?? "Uncategorized"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">
                        Status
                      </p>
                      <Badge variant="success">
                        {endpoint.statusCode}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">
                        Enabled
                      </p>
                      <Badge
                        variant={
                          endpoint.isEnabled
                            ? "success"
                            : "secondary"
                        }
                      >
                        {endpoint.isEnabled
                          ? "Yes"
                          : "No"}
                      </Badge>
                    </div>
                  </div>

                  {/* Response */}

                  <div className="mt-8">
                    <div className="mb-2 flex items-center justify-between">
                      <h4 className="font-semibold">
                        Default Response
                      </h4>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          navigator.clipboard.writeText(
                            endpoint.responseBody
                          )
                        }
                      >
                        Copy Response
                      </Button>
                    </div>
                    <pre className="overflow-auto rounded-xl bg-slate-900 p-5 text-sm text-green-400">
{endpoint.responseBody}
                    </pre>
                  </div>
                </div>
              </td>
            </tr>
          )}
        </>
      ))}
    </Table>
  );
}

export default EndpointTable;