//import { Search, Bell } from "lucide-react";
import GlobalSearch from "../search/GlobalSearch";

function TopNavbar() {

  return (
    <header className="h-[72px] bg-white border-b flex items-center shadow-sm justify-between px-8">
      <div className="flex items-center gap-4">
        <GlobalSearch/>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative">
          {/*
          <Bell size={22} />
          <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
          </span>
          */}
        </button>

        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
            SK
          </div>
          <div>
            <p className="font-semibold">
              Sasi Kaladhar
            </p>
            <p className="text-sm text-slate-500">
              Administrator
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default TopNavbar;