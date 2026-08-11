import GlobalSearch from "../search/GlobalSearch";
import EnvironmentSwitcher from "./EnvironmentSwitcher"

function TopNavbar() {

  return (
    <header className="flex h-[72px] items-center justify-between border-b bg-white px-8 shadow-sm">
      {/* Left */}

      <div className="flex items-center gap-6">
        <GlobalSearch />
      </div>

      {/* Right */}

      <div className="flex items-center gap-6">

        <EnvironmentSwitcher />

        {/* User */}

        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
            SK
          </div>

          <div>
            <p className="font-semibold text-slate-900">
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