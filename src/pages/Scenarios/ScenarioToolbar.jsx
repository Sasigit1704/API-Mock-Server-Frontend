import SearchBar from "../../components/ui/SearchBar";
import Select from "../../components/ui/Select";

function ScenarioToolbar({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* Search */}
      <div className="w-full sm:flex-1">
        <SearchBar
          placeholder="Search by scenario name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Status Code Filter */}
      <div className="w-full sm:w-64">
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status Codes</option>
          <option value="200">200 - OK</option>
          <option value="201">201 - Created</option>
          <option value="202">202 - Accepted</option>
          <option value="204">204 - No Content</option>
          <option value="206">206 - Partial Content</option>
          <option value="400">400 - Bad Request</option>
          <option value="401">401 - Unauthorized</option>
          <option value="402">402 - Payment Required</option>
          <option value="403">403 - Forbidden</option>
          <option value="404">404 - Not Found</option>
          <option value="405">405 - Method Not Allowed</option>
          <option value="406">406 - Not Acceptable</option>
          <option value="408">408 - Request Timeout</option>
          <option value="409">409 - Conflict</option>
          <option value="410">410 - Gone</option>
          <option value="415">415 - Unsupported Media Type</option>
          <option value="422">422 - Unprocessable Entity</option>
          <option value="423">423 - Locked</option>
          <option value="429">429 - Too Many Requests</option>
          <option value="500">500 - Internal Server Error</option>
          <option value="502">502 - Bad Gateway</option>
          <option value="503">503 - Service Unavailable</option>
          <option value="504">504 - Gateway Timeout</option>
        </Select>
      </div>
    </div>
  );
}

export default ScenarioToolbar;