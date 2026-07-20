import { Search, Bell } from "lucide-react";
import { Menu } from "lucide-react";

function TopNavbar({
  toggleSidebar,
}) {

  return (
    <header className="h-[72px] bg-white border-b flex items-center shadow-sm justify-between px-8">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="
          rounded-lg
          p-2
          hover:bg-slate-100
          transition"
        >
          <Menu size={22}/>
        </button>
        <div className="relative">
        <Search
          size={18}
          className="absolute left-4 top-3.5 text-slate-400"
        />
        <input
          type="text"
          placeholder="Search is in development"
          disabled
          className="
            width: 420px
            height: 48px
            shadow-sm
            pl-11
            pr-4
            py-2.5
            border
            rounded-xl
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500"
        />
      </div>
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