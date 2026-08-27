function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage = 10,
  onPageChange,
}) {
  if (totalItems === 0) {
    return null;
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    pages.push(1);
    if (currentPage > 4) pages.push("...");

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 3) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-5 sm:flex-row sm:items-center sm:justify-between">
      {/* Result Count */}
      <p className="text-xs sm:text-sm text-slate-500 text-center sm:text-left">
        Showing{" "}
        <span className="font-medium text-slate-700">
          {startItem}-{endItem}
        </span>{" "}
        of{" "}
        <span className="font-medium text-slate-700">{totalItems}</span>
      </p>

      {/* Pagination Controls with Smooth Mobile Scrolling */}
      <div className="flex items-center justify-center sm:justify-end gap-1 overflow-x-auto py-1">
        {/* Previous */}
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className={`rounded-lg border px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-medium transition flex-shrink-0 ${
            currentPage === 1
              ? "cursor-not-allowed border-slate-200 text-slate-300"
              : "border-slate-300 text-slate-700 hover:bg-slate-50"
          }`}
        >
          Previous
        </button>

        {/* Page Numbers */}
        {getPageNumbers().map((page, index) =>
          page === "..." ? (
            <span key={`ellipsis-${index}`} className="px-1 text-slate-400 flex-shrink-0">
              ...
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={`min-w-[36px] sm:min-w-[40px] rounded-lg border px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-medium transition flex-shrink-0 ${
                currentPage === page
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-slate-300 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {page}
            </button>
          )
        )}

        {/* Next */}
        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className={`rounded-lg border px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-medium transition flex-shrink-0 ${
            currentPage === totalPages
              ? "cursor-not-allowed border-slate-200 text-slate-300"
              : "border-slate-300 text-slate-700 hover:bg-slate-50"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Pagination;