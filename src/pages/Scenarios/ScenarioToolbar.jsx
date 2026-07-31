import SearchBar from "../../components/ui/SearchBar";
import Select from "../../components/ui/Select";

function ScenarioToolbar({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
}) {
  return (
    <div className="grid grid-cols-12 gap-4 items-center">

      {/* Search */}

      <div className="col-span-8">

        <SearchBar
          placeholder="Search by scenario name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

      {/* Status Code Filter */}

      <div className="col-span-4">

        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status Codes</option>
          <option value="200">200 - OK</option>
          <option value="201">201 - Created</option>
          <option value="204">204 - No Content</option>
          <option value="400">400 - Bad Request</option>
          <option value="401">401 - Unauthorized</option>
          <option value="403">403 - Forbidden</option>
          <option value="404">404 - Not Found</option>
          <option value="408">408 - Request Timeout</option>
          <option value="429">429 - Too Many Requests</option>
          <option value="500">500 - Internal Server Error</option>
        </Select>

      </div>

    </div>
  );
}

export default ScenarioToolbar;