import { Plus } from "lucide-react";

import Button from "../../components/ui/Button";
import SearchBar from "../../components/ui/SearchBar";

function CollectionToolbar({
  search,
  setSearch,
  totalCollections,
  onCreate,
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">

      <div className="w-full max-w-md">
        <SearchBar
          placeholder="Search collections..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex items-center justify-between gap-4 lg:justify-end">

        <span className="text-sm text-slate-500 whitespace-nowrap">
          {totalCollections} Collection(s)
        </span>

        <Button onClick={onCreate}>
          <Plus size={18} />
          Create Collection
        </Button>

      </div>

    </div>
  );
}

export default CollectionToolbar;