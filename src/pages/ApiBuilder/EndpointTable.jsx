import { Pencil, Trash2 } from "lucide-react";

import Table from "../../components/ui/Table";
import Badge from "../../components/ui/Badge";
import EmptyState from "../../components/ui/EmptyState";

function EndpointTable({
  endpoints,
  collectionMap,
  onEdit,
  onDelete,
  onCreate,
  selectedEndpointId,
}) {
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
        "Method",
        "Endpoint",
        "Status",
        "Collection",
        "Actions",
      ]}
    >
      {endpoints.map((endpoint) => (
        <tr
          key={endpoint.id}
          className={`"border-t border-slate-200 transition-colors hover:bg-slate-50"
            ${ endpoint.id === selectedEndpointId ? "bg-blue-50 ring-2 ring-blue-500" : "" }`}
        >
          {/* Method */}

          <td className="px-8 py-5">

            <Badge variant={endpoint.method.toLowerCase()}>
              {endpoint.method}
            </Badge>

          </td>

          {/* Endpoint */}

          <td className="px-8 py-5 font-medium text-slate-900">

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

          <td className="px-8 py-5 text-slate-600">

            {collectionMap[endpoint.collectionId] ??
              "Uncategorized"}

          </td>

          {/* Actions */}

          <td className="px-8 py-5">

            <div className="flex items-center gap-2">

              <button
                onClick={() => onEdit(endpoint)}
                className="rounded-full p-2 transition hover:bg-blue-100"
              >
                <Pencil
                  size={18}
                  className="text-blue-600"
                />
              </button>

              <button
                onClick={() => onDelete(endpoint)}
                className="rounded-full p-2 transition hover:bg-red-100"
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
  );
}

export default EndpointTable;