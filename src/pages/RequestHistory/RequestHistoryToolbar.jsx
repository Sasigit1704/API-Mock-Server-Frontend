import { Search } from "lucide-react";

function RequestHistoryToolbar({
  search,
  setSearch,
  methodFilter,
  setMethodFilter,
  statusFilter,
  setStatusFilter,
}) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      {/* Search */}
      <div className="relative w-full lg:max-w-md">
        <Search
          size={18}
          className="absolute left-4 top-3.5 text-slate-400"
        />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search requests..."
          className="
            h-11
            w-full
            rounded-xl
            border
            border-slate-300
            bg-white
            pl-11
            pr-4
            text-sm
            shadow-sm
            focus:border-blue-500
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
          "
        />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full lg:w-auto">
        <select
          value={methodFilter}
          onChange={(e) =>
            setMethodFilter(e.target.value)
          }
          className="
            rounded-xl
            border
            border-slate-300
            bg-white
            px-4
            py-2.5
            text-sm
            shadow-sm
            focus:border-blue-500
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
          "
        >
          <option value="">All Methods</option>
          <option>GET</option>
          <option>POST</option>
          <option>PUT</option>
          <option>PATCH</option>
          <option>DELETE</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
          className="
            rounded-xl
            border
            border-slate-300
            bg-white
            px-4
            py-2.5
            text-sm
            shadow-sm
            focus:border-blue-500
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
          "
        >
          <option value="">All Status</option>
          <option>200</option>
          <option>201</option>
          <option>202</option>
          <option>204</option>
          <option>206</option>
          <option>400</option>
          <option>401</option>
          <option>402</option>
          <option>403</option>
          <option>404</option>
          <option>405</option>
          <option>406</option>
          <option>408</option>
          <option>409</option>
          <option>422</option>
          <option>423</option>
          <option>429</option>
          <option>500</option>
          <option>502</option>
          <option>503</option>
          <option>504</option>
        </select>
      </div>
    </div>
  );
}

export default RequestHistoryToolbar;