import { Search } from "lucide-react";

function SearchBar({
  placeholder = "Search...",
  className = "",
  ...props
}) {
  return (
    <div className={`relative w-full ${className}`}>
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
      />

      <input
        {...props}
        placeholder={placeholder}
        className="
          h-12
          w-full
          rounded-xl
          border
          border-slate-300
          bg-white
          pl-12
          pr-4
          text-sm
          text-slate-700
          placeholder:text-slate-400
          shadow-sm
          transition-all
          focus:border-blue-500
          focus:outline-none
          focus:ring-4
          focus:ring-blue-100
          hover:border-slate-400
        "
      />
    </div>
  );
}

export default SearchBar;