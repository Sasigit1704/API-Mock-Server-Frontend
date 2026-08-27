import {
  Eye,
  Trash2,
} from "lucide-react";

import Table from "../../components/ui/Table";
import Badge from "../../components/ui/Badge";
import EmptyState from "../../components/ui/EmptyState";

function RequestHistoryTable({
  logs,
  onView,
  onDelete,
}) {
  if (logs.length === 0) {
    return (
      <EmptyState
        title="No Request History"
        description="No requests match your current search or filters."
      />
    );
  }

  const getStatusVariant = (
    status
  ) => {
    if (status >= 500) return "error";
    if (status >= 400) return "warning";
    if (status >= 300) return "info";

    return "success";
  };

  const getTimeVariant = (
    time
  ) => {
    if (time > 500) return "error";
    if (time > 100) return "warning";

    return "success";
  };

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-slate-200">
    <Table
      headers={[
        "Method",
        "Path",
        "Endpoint",
        "Scenario",
        "Status",
        "Response Time",
        "Date",
        "View | Delete",
      ]}
    >
      {logs.map((log) => (
        <tr
          key={log.id}
          className="border-t transition hover:bg-slate-50"
        >

          {/* Method */}

          <td className="px-8 py-5">
            <Badge
              variant={
                log.method.toLowerCase()
              }
            >
              {log.method}
            </Badge>
          </td>

          {/* Path */}

          <td className="max-w-xs px-8 py-5">
            <p
              className="truncate font-mono text-sm text-slate-700"
              title={log.path}
            >
              {log.path}
            </p>
          </td>

          {/* Endpoint */}

          <td className="px-8 py-5">
            <span className="font-medium text-slate-700">
              {log.endpointName || "-"}
            </span>
          </td>

          {/* Scenario */}

          <td className="px-8 py-5">
            {log.scenarioName ? (
              <Badge
                variant={getStatusVariant(
                  log.statusCode
                )}
              >
                {log.scenarioName}
              </Badge>
            ) : (
              <Badge variant="secondary">
                Default
              </Badge>
            )}
          </td>

          {/* Status */}

          <td className="px-8 py-5">
            <Badge
              variant={getStatusVariant(
                log.statusCode
              )}
            >
              {log.statusCode}
            </Badge>
          </td>

          {/* Response Time */}

          <td className="px-8 py-5">
            <Badge
              variant={getTimeVariant(
                log.responseTimeMs
              )}
            >
              {log.responseTimeMs} ms
            </Badge>
          </td>

          {/* Date */}

          <td className="whitespace-nowrap px-8 py-5 text-slate-600">
            {new Date(
              log.requestTime
            ).toLocaleString(
              "en-IN",
              {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }
            )}
          </td>

          {/* Actions */}

          <td className="px-8 py-5">
            <div className="flex items-center gap-4">

              <button
                type="button"
                onClick={() =>
                  onView(log)
                }
                className="rounded-full p-2 transition hover:bg-blue-100"
                title="View Details"
              >
                <Eye
                  size={18}
                  className="text-blue-600"
                />
              </button>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onDelete(log);
                }}
                className="rounded-full p-2 transition hover:bg-red-100"
                title="Delete Request"
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
  );
}

export default RequestHistoryTable;