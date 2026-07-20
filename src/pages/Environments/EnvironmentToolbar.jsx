import SearchBar from "../../components/ui/SearchBar";

function EnvironmentToolbar({
  search,
  setSearch,
}) {
  return (
    <div className="flex items-center">

      <div className="w-full">

        <SearchBar
          placeholder="Search by environment name or base URL..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

    </div>
  );
}

export default EnvironmentToolbar;