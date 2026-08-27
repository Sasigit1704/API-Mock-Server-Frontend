import { Menu } from "lucide-react";
import GlobalSearch from "../search/GlobalSearch";
import EnvironmentSwitcher from "./EnvironmentSwitcher";

function TopNavbar({ onMenuClick }) {
  return (
    <header
      className="
        min-h-[72px]
        border-b
        border-slate-200
        bg-white
        px-3
        py-3
        shadow-sm
        sm:px-6
        lg:px-8
      "
    >
      <div
        className="
          flex
          flex-col
          gap-3
          xl:flex-row
          xl:items-center
          xl:justify-between
        "
      >
        {/* Top Row: Menu, Brand, and Search */}
        <div className="flex w-full items-center gap-2 sm:gap-3 xl:flex-1">
          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={onMenuClick}
            className="
              flex
              h-10
              w-10
              flex-shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-slate-200
              bg-white
              text-slate-600
              shadow-sm
              transition
              hover:bg-slate-50
              hover:text-blue-600
              lg:hidden
            "
            title="Open navigation"
          >
            <Menu size={20} />
          </button>

          {/* Mobile Brand Icon */}
          <div className="flex flex-shrink-0 items-center lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">
              API
            </div>
          </div>

          {/* Global Search Component */}
          <div className="min-w-0 flex-1">
            <GlobalSearch />
          </div>
        </div>

        {/* Right Section: Environment Switcher & User Profile */}
        <div
          className="
            flex
            w-full
            flex-col
            gap-3
            sm:flex-row
            sm:items-center
            sm:justify-between
            xl:w-auto
          "
        >
          {/* Environment Switcher */}
          <div className="w-full sm:w-auto">
            <EnvironmentSwitcher />
          </div>

          {/* User Profile */}
          <div
            className="
              flex
              items-center
              gap-3
              border-t
              border-slate-100
              pt-3
              sm:border-l
              sm:border-t-0
              sm:pl-4
              sm:pt-0
              w-full
              sm:w-auto
            "
          >
            <div
              className="
                flex
                h-10
                w-10
                flex-shrink-0
                items-center
                justify-center
                rounded-full
                bg-blue-600
                font-semibold
                text-white
                sm:h-11
                sm:w-11
              "
            >
              SK
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900 sm:text-base">
                Sasi Kaladhar
              </p>
              <p className="text-xs text-slate-500 sm:text-sm">
                Administrator
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default TopNavbar;