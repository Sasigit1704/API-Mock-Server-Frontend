import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Server,
  FolderKanban,
  Workflow,
  Globe,
  History,
  FileCode2,
  Clock3,
} from "lucide-react";

const activePages = [
  {
    title: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    title: "API Builder",
    path: "/builder",
    icon: Server,
  },
  {
    title: "Collections",
    path: "/collections",
    icon: FolderKanban,
  },
  {
    title: "Environments",
    path: "/environment",
    icon: Globe,
  },
];

const upcomingPages = [
  {
    title: "Scenarios",
    //week: "Week 2",
    icon: Workflow,
  },
  {
    title: "Request History",
    //week: "Week 3",
    icon: History,
  },
  {
    title: "OpenAPI Import",
    //week: "Week 4",
    icon: FileCode2,
  },
];

function Sidebar({ isCollapsed }) {
  return (
    <aside
      className={`
        flex
        flex-col
        bg-white
        border-r
        border-slate-200
        transition-all
        duration-300
        ${isCollapsed ? "w-20" : "w-72"}
      `}
    >

      {/* Logo */}
      {isCollapsed ? (
          <div className="flex justify-center py-8">
              <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  API
              </div>
          </div>
      ) : (
      <div className="border-b border-slate-200 px-6 py-8">
        <h1 className="text-2xl font-bold text-blue-600">
          API Mock Server
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Enterprise Edition
        </p>
      </div>
      )}

      {/* Active Pages */}
      <nav className="flex-1 px-4 py-6">
        {!isCollapsed && (
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Workspace
          </p>
        )}
        <div className="space-y-2">
          {activePages.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `
                  flex
                  items-center
                  ${isCollapsed ? "justify-center" : "justify-between"}
                  rounded-xl
                  px-4
                  py-4
                  transition-all
                  duration-200
                  ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-slate-700 hover:bg-slate-100"
                  }
              `
                }
              >

              <div className="flex items-center gap-3">

              <Icon size={20} />

              {!isCollapsed && (

              <span className="font-medium">

              {item.title}

              </span>

              )}

              </div>

              </NavLink>
            );
          })}
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-slate-200" />
        {!isCollapsed && (
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Upcoming Modules
          </p>
        )}
        <div className="space-y-2">
          {upcomingPages.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.title}
                disabled
                className="
                  flex
                  w-full
                  items-center
                  justify-between
                  rounded-xl
                  px-4
                  py-4
                  text-left
                  opacity-60
                  transition
                  hover:bg-slate-100
                "
              >
                <div className="flex items-center gap-3">
                  <Icon size={20} />
                  {!isCollapsed && (
                      <span className="font-medium">
                          {item.title}
                      </span>
                  )}
                </div>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">
                  {item.week}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-200 px-6 py-5">
        <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"}`}>
          <Clock3
            size={18}
            className="text-blue-600"
          />
          {!isCollapsed && (
            <div>
              <p className="text-sm font-semibold text-slate-800">
                Version 1.0.0
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;