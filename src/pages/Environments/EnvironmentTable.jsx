import { useRef } from "react";
import { Pencil, Trash2, Star } from "lucide-react";
import Table from "../../components/ui/Table";
import Badge from "../../components/ui/Badge";
import EmptyState from "../../components/ui/EmptyState";

function EnvironmentTable({
  environments,
  highlightedId,
  onEdit,
  onDelete,
  onActivate,
  onCreate,
}) {

  const rowRefs= useRef({});

  if (environments.length === 0) {
    return (
      <EmptyState
        title="No Environments Found"
        description="Create your first environment to start configuring your mock server."
        buttonText="Create Environment"
        onClick={onCreate}
      />
    );
  }

  return (
    <Table
      headers={[
        "Environment",
        "Base URL",
        "Description",
        "Status",
        "Actions",
      ]}
    >
      {environments.map((environment) => (
        <tr
          ref={(el)=>{
            if(el){
              rowRefs.current[environment.id]=el;
            }
          }}
            key={environment.id}
            className={`border-t border-slate-200 transition-colors hover:bg-slate-50
              ${
                environment.isActive ? "bg-blue-50" : ""
              }
              ${
                highlightedId===environment.id ?"bg-blue-100 ring-2 ring-blue-300" :""
              }
            `}
        >
          {/* Environment */}

          <td className="px-8 py-5">

            <div className="space-y-1">

              <p className="font-semibold text-slate-900">

                {environment.name}

              </p>

            </div>

          </td>

          {/* Base URL */}

          <td className="px-8 py-5">

            <span className="font-mono text-sm text-slate-700">

              {environment.baseUrl}

            </span>

          </td>

          {/* Description */}

          <td className="px-8 py-5 text-slate-600">

            {environment.description || "-"}

          </td>

          {/* Status */}

          <td className="px-8 py-5">

            {environment.isActive ? (
              <Badge variant="active">
                Active
              </Badge>
            ) : (
              <Badge variant="inactive">
                Inactive
              </Badge>
            )}

          </td>

          {/* Actions */}

          <td className="px-8 py-5">

            <div className="flex items-center gap-2">

              <button
                onClick={() => onEdit(environment)}
                className="rounded-full p-2 transition hover:bg-blue-100"
              >
                <Pencil
                  size={18}
                  className="text-blue-600"
                />
              </button>

              {/* Activate */}

              <button
                  disabled={environment.isActive}
                  onClick={() => onActivate(environment)}
                  className={`rounded-full p-2 transition ${
                      environment.isActive
                          ? "cursor-not-allowed opacity-40"
                          : "hover:bg-yellow-100"
                  }`}
                  title={
                      environment.isActive
                          ? "Already Active"
                          : "Set Active"
                  }
              >
                <Star
                  size={18}
                  className={
                    environment.isActive
                      ? "fill-yellow-400 text-yellow-500"
                      : "text-yellow-500"
                  }
                />
              </button>

              <button
                onClick={() => onDelete(environment)}
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

export default EnvironmentTable;