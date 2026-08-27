import { Pencil, Trash2 } from "lucide-react";

import Table from "../../components/ui/Table";
import EmptyState from "../../components/ui/EmptyState";

function CollectionTable({
  collections,
  highlightedId,
  onEdit,
  onDelete,
  onCreate,
}) {
  if (collections.length === 0) {
    return (
      <EmptyState
        title="No Collections Found"
        description="Create your first collection."
        buttonText="Create Collection"
        onClick={onCreate}
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <Table headers={["Name", "Description", "Edit | Delete"]}>
        {collections.map((collection) => (
          <tr
            key={collection.id}
            className={`border-t transition-all duration-500 hover:bg-slate-50 ${
              highlightedId === collection.id
                ? "bg-blue-100 ring-2 ring-blue-300"
                : ""
            }`}
          >
            <td className="px-6 py-4 font-medium">
              {collection.name}
            </td>

            <td className="px-6 py-4 text-slate-600">
              {collection.description || "-"}
            </td>

            <td className="px-6 py-4">
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => onEdit(collection)}
                  className="rounded-lg p-2 hover:bg-blue-100"
                  aria-label={`Edit ${collection.name}`}
                >
                  <Pencil size={18} className="text-blue-600" />
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(collection)}
                  className="rounded-lg p-2 hover:bg-red-100"
                  aria-label={`Delete ${collection.name}`}
                >
                  <Trash2 size={18} className="text-red-600" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
}

export default CollectionTable;