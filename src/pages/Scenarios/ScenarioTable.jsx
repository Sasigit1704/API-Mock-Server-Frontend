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
    <Table
      headers={[
        "Active",
        "Scenario",
        "Status",
        "Delay",
        "Timeout",
        "Failure",
        "Actions",
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
          {/* Active */}

          <td className="px-8 py-5">
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

          {/* Scenario */}

          <td className="px-8 py-5 font-medium text-slate-900">
            {scenario.scenarioName}
          </td>

          {/* Status */}

          <td className="px-8 py-5">
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

          {/* Delay */}

          <td className="px-8 py-5">
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

          {/* Timeout */}

          <td className="px-8 py-5">
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

          {/* Random Failure */}

          <td className="px-8 py-5">
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

          {/* Actions */}

          <td className="px-8 py-5">
            <div className="flex items-center gap-2">

              <button
                onClick={() => onEdit(scenario)}
                className="rounded-full p-2 transition hover:bg-blue-100"
              >
                <Pencil
                  size={18}
                  className="text-blue-600"
                />
              </button>

              <button
                disabled={scenario.isActive}
                onClick={() => onActivate(scenario)}
                className={`rounded-full p-2 transition ${
                  scenario.isActive
                    ? "cursor-not-allowed opacity-40"
                    : "hover:bg-yellow-100"
                }`}
                title={
                  scenario.isActive
                    ? "Already Active"
                    : "Set Active"
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
                onClick={() => onDelete(scenario)}
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

export default ScenarioTable;