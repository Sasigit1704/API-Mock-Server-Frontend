import { useEffect, useRef } from "react";
import { Pencil, Trash2, Star } from "lucide-react";

import Table from "../../components/ui/Table";
import Badge from "../../components/ui/Badge";
import EmptyState from "../../components/ui/EmptyState";

function ScenarioTable({
  scenarios,
  highlightedId,
  onEdit,
  onDelete,
  onActivate,
  onCreate,
}) {
  const rowRefs = useRef({});

  useEffect(() => {
    if (!highlightedId) return;

    const row = rowRefs.current[highlightedId];

    if (row) {
      row.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [highlightedId]);

  if (scenarios.length === 0) {
    return (
      <EmptyState
        title="No Scenarios Found"
        description="Create your first scenario to simulate API behavior."
        buttonText="Create Scenario"
        onClick={onCreate}
      />
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <Table
        headers={[
          "Active",
          "Scenario",
          "Status",
          "Delay",
          "Timeout",
          "Failure",
          "Edit | Activate | Delete",
        ]}
      >
        {scenarios.map((scenario) => (
          <tr
            key={scenario.id}
            ref={(el) => {
              if (el) {
                rowRefs.current[scenario.id] = el;
              }
            }}
            className={`
              border-t
              transition-all
              duration-500
              hover:bg-slate-50
              ${
                highlightedId === scenario.id
                  ? "bg-blue-100 ring-2 ring-blue-300"
                  : scenario.isActive
                  ? "bg-green-50"
                  : ""
              }
            `}
          >
            <td className="px-6 py-4 whitespace-nowrap">
              <Badge
                variant={
                  scenario.isActive
                    ? "success"
                    : "secondary"
                }
              >
                {scenario.isActive
                  ? "Active"
                  : "Inactive"}
              </Badge>
            </td>

            <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">
              {scenario.scenarioName}
            </td>

            <td className="px-6 py-4 whitespace-nowrap">
              <Badge
                variant={
                  scenario.statusCode >= 500
                    ? "error"
                    : scenario.statusCode >= 400
                    ? "warning"
                    : "success"
                }
              >
                {scenario.statusCode}
              </Badge>
            </td>

            <td className="px-6 py-4 whitespace-nowrap">
              <Badge
                variant={
                  scenario.delay > 0
                    ? "info"
                    : "secondary"
                }
              >
                {scenario.delay} ms
              </Badge>
            </td>

            <td className="px-6 py-4 whitespace-nowrap">
              <Badge
                variant={
                  scenario.enableTimeout
                    ? "warning"
                    : "secondary"
                }
              >
                {scenario.enableTimeout
                  ? `${scenario.timeoutDelay} ms`
                  : "Disabled"}
              </Badge>
            </td>

            <td className="px-6 py-4 whitespace-nowrap">
              <Badge
                variant={
                  scenario.enableRandomFailure
                    ? "error"
                    : "secondary"
                }
              >
                {scenario.enableRandomFailure
                  ? `${scenario.failureRate}%`
                  : "Disabled"}
              </Badge>
            </td>

            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => onEdit(scenario)}
                  className="rounded-full p-2 transition hover:bg-blue-100"
                  title="Edit Scenario"
                >
                  <Pencil
                    size={18}
                    className="text-blue-600"
                  />
                </button>

                <button
                  type="button"
                  onClick={() => onActivate(scenario)}
                  className={`rounded-full p-2 transition ${
                    scenario.isActive
                      ? "hover:bg-red-100"
                      : "hover:bg-yellow-100"
                  }`}
                  title={
                    scenario.isActive
                      ? "Deactivate Scenario"
                      : "Activate Scenario"
                  }
                >
                  <Star
                    size={18}
                    className={
                      scenario.isActive
                        ? "fill-yellow-400 text-yellow-500"
                        : "text-yellow-500"
                    }
                  />
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(scenario)}
                  className="rounded-full p-2 transition hover:bg-red-100"
                  title="Delete Scenario"
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

export default ScenarioTable;