import { Eye } from "lucide-react";
import Table from "../../components/ui/Table";
import Badge from "../../components/ui/Badge";
import EmptyState from "../../components/ui/EmptyState";

function RequestHistoryTable({ logs }) {
  if (logs.length === 0) {
    return (
      <EmptyState
        title="No Request History"
        description="No requests have been executed yet."
      />
    );
  }

  const getMethodVariant = (method) => {
    switch (method) {
      case "GET":
        return "info";
      case "POST":
        return "success";
      case "PUT":
        return "warning";
      case "PATCH":
        return "secondary";
      case "DELETE":
        return "error";
      default:
        return "secondary";
    }
  };

  const getStatusVariant = (status) => {
    if (status >= 500) return "error";
    if (status >= 400) return "warning";
    if (status >= 300) return "info";
    return "success";
  };

  const getTimeVariant = (time) => {
    if (time > 500) return "error";
    if (time > 100) return "warning";
    return "success";
  };

  return (
    <Table
      headers={[
        "Method",
        "Path",
        "Endpoint",
        "Scenario",
        "Status",
        "Response Time",
        "Date",
        "Action",
      ]}
    >
      {logs.map((log) => (
        <tr
          key={log.id}
          className="border-t transition hover:bg-slate-50"
        >
          {/* Method */}

          <td className="px-8 py-5">
            <Badge variant={getMethodVariant(log.method)}>
              {log.method}
            </Badge>
          </td>

          {/* Path */}

          <td className="px-8 py-5">
            <span className="font-mono text-sm text-slate-700">
              {log.path}
            </span>
          </td>

          {/* Endpoint */}

          <td className="px-8 py-5">
            <span className="font-medium text-slate-700">
              {log.endpointName || "-"}
            </span>
          </td>

          {/* Scenario */}

          <td className="px-8 py-5">
            <span className="text-slate-600">
              {log.scenarioName || "Default Response"}
            </span>
          </td>

          {/* Status */}

          <td className="px-8 py-5">
            <Badge variant={getStatusVariant(log.statusCode)}>
              {log.statusCode}
            </Badge>
          </td>

          {/* Response Time */}

          <td className="px-8 py-5">
            <Badge variant={getTimeVariant(log.responseTimeMs)}>
              {log.responseTimeMs} ms
            </Badge>
          </td>

          {/* Date */}

          <td className="px-8 py-5 text-slate-600 whitespace-nowrap">
            {new Date(log.requestTime).toLocaleString()}
          </td>

          {/* Action */}

          <td className="px-8 py-5">
            <button
              className="rounded-full p-2 transition hover:bg-blue-100"
              title="View Details"
            >
              <Eye
                size={18}
                className="text-blue-600"
              />
            </button>
          </td>
        </tr>
      ))}
    </Table>
  );
}

export default RequestHistoryTable;