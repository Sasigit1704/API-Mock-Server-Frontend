import SearchBar from "../../components/ui/SearchBar";
import Select from "../../components/ui/Select";

function EndpointToolbar({
  search,
  setSearch,
  methodFilter,
  setMethodFilter,
  collectionFilter,
  setCollectionFilter,
  collections,
}) {
  return (
    <div className="grid grid-cols-12 gap-4 items-center">

      {/* Search */}

      <div className="col-span-7">

        <SearchBar
          placeholder="Search by path..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

      {/* Method */}

      <div className="col-span-2">

        <Select
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value)}
        >
          <option value="">All methods</option>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="PATCH">PATCH</option>
          <option value="DELETE">DELETE</option>
        </Select>

      </div>

      {/* Collection */}

      <div className="col-span-3">

        <Select
          value={collectionFilter}
          onChange={(e) => setCollectionFilter(e.target.value)}
        >
          <option value="">All collections</option>

          {collections.map((collection) => (
            <option
              key={collection.id}
              value={collection.id}
            >
              {collection.name}
            </option>
          ))}

        </Select>

      </div>

    </div>
  );
}

export default EndpointToolbar;