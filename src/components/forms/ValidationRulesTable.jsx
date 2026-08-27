import { Pencil, Trash2 } from "lucide-react";
import EmptyState from "../ui/EmptyState";
import Badge from "../ui/Badge";
import Table from "../ui/Table";

function ValidationRulesTable({
  rules,
  onEdit,
  onDelete,
}) {
  if (rules.length === 0) {
    return (
      <EmptyState
        title="No Validation Rules"
        description="Add validation rules for this endpoint."
      />
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <Table
        headers={[
          "Field",
          "Type",
          "Required",
          "Validation",
          "Custom Errors",
          "Action",
        ]}
      >
        {rules.map((rule, index) => {
          const errorResponses = rule.errorResponses || [];
          const enabledErrors = errorResponses.filter(
            (error) => error.isEnabled && error.responseBody
          );

          return (
            <tr
              key={index}
              className="border-t hover:bg-slate-50"
            >
              <td className="px-6 py-4 font-mono text-sm whitespace-nowrap">
                {rule.fieldPath}
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <Badge variant="info">
                  {rule.dataType}
                </Badge>
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <Badge
                  variant={
                    rule.isRequired
                      ? "success"
                      : "secondary"
                  }
                >
                  {rule.isRequired ? "Yes" : "No"}
                </Badge>
              </td>

              <td className="px-6 py-4 text-sm text-slate-600 min-w-[180px]">
                {rule.minLength != null && (
                  <div>Min Length: {rule.minLength}</div>
                )}
                {rule.maxLength != null && (
                  <div>Max Length: {rule.maxLength}</div>
                )}
                {rule.minValue != null && (
                  <div>Min Value: {rule.minValue}</div>
                )}
                {rule.maxValue != null && (
                  <div>Max Value: {rule.maxValue}</div>
                )}
                {rule.pattern && (
                  <div>Pattern: {rule.pattern}</div>
                )}
                {!rule.minLength &&
                  !rule.maxLength &&
                  !rule.minValue &&
                  !rule.maxValue &&
                  !rule.pattern && (
                    <span className="text-slate-400">
                      Type only
                    </span>
                  )}
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                {enabledErrors.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {enabledErrors.map((error) => (
                      <Badge
                        key={error.validationType}
                        variant="warning"
                      >
                        {error.validationType}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm text-slate-400">
                    Default errors
                  </span>
                )}
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(index)}
                    className="rounded-full p-2 hover:bg-blue-100 transition"
                    title="Edit validation rule"
                  >
                    <Pencil
                      size={18}
                      className="text-blue-600"
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(index)}
                    className="rounded-full p-2 hover:bg-red-100 transition"
                    title="Delete validation rule"
                  >
                    <Trash2
                      size={18}
                      className="text-red-600"
                    />
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </Table>
    </div>
  );
}

export default ValidationRulesTable;