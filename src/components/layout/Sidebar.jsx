import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Server,
  Terminal,
  FolderKanban,
  Workflow,
  Globe,
  History,
  FileCode2,
  Clock3,
  ChevronLeft,
  ChevronRight,
  X,
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
    title: "API Tester",
    path: "/api-tester",
    icon: Terminal,
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
  {
    title: "Scenarios",
    path: "/scenarios",
    icon: Workflow,
  },
  {
    title: "Request History",
    path: "/history",
    icon: History,
  },
  {
    title: "OpenAPI Import",
    path: "/openapi",
    icon: FileCode2,
  },
];

function Sidebar({
  isCollapsed,
  onToggle,
  isMobileOpen,
  onMobileClose,
}) {
  return (
    <>
      {/* Mobile Overlay */}

      {isMobileOpen && (
        <div
          className="
            fixed
            inset-0
            z-40
            bg-slate-900/40
            backdrop-blur-[1px]
            lg:hidden
          "
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}

      <aside
        className={`
          fixed
          inset-y-0
          left-0
          z-50
          flex
          w-72
          flex-col
          border-r
          border-slate-200
          bg-white
          shadow-xl
          transition-transform
          duration-300
          ease-in-out

          ${
            isMobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }

          lg:relative
          lg:z-auto
          lg:translate-x-0
          lg:shadow-none

          ${
            isCollapsed
              ? "lg:w-20"
              : "lg:w-72"
          }
        `}
      >

        {/* Mobile Header */}

        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5 lg:hidden">

          <div>
            <h1 className="text-xl font-bold text-blue-600">
              API Mock Server
            </h1>

            <p className="mt-1 text-xs text-slate-500">
              Enterprise Edition
            </p>
          </div>

          <button
            type="button"
            onClick={onMobileClose}
            className="
              rounded-lg
              p-2
              text-slate-500
              transition
              hover:bg-slate-100
              hover:text-slate-800
            "
            title="Close menu"
          >
            <X size={21} />
          </button>

        </div>

        {/* Desktop Logo */}

        <div className="hidden lg:block">

          {isCollapsed ? (
            <div className="flex justify-center py-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold text-white">
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

        </div>

        {/* Desktop Collapse Button */}

        <button
          type="button"
          onClick={onToggle}
          className="
            absolute
            right-[-16px]
            top-8
            z-50
            hidden
            h-8
            w-8
            items-center
            justify-center
            rounded-full
            border
            border-slate-200
            bg-white
            shadow-md
            transition
            hover:bg-slate-100
            lg:flex
          "
          title={
            isCollapsed
              ? "Expand sidebar"
              : "Collapse sidebar"
          }
        >
          {isCollapsed ? (
            <ChevronRight size={18} />
          ) : (
            <ChevronLeft size={18} />
          )}
        </button>

        {/* Navigation */}

        <nav className="flex-1 overflow-y-auto px-4 py-6">

          <p
            className={`
              mb-3
              px-3
              text-xs
              font-semibold
              uppercase
              tracking-wider
              text-slate-400
              ${
                isCollapsed
                  ? "lg:hidden"
                  : ""
              }
            `}
          >
            Workspace
          </p>

          <div className="space-y-2">

            {activePages.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onMobileClose}
                  className={({ isActive }) =>
                    `
                    flex
                    items-center
                    rounded-xl
                    px-4
                    py-4
                    transition-all
                    duration-200

                    ${
                      isCollapsed
                        ? "lg:justify-center"
                        : "justify-start"
                    }

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

                    <span
                      className={`
                        font-medium
                        ${
                          isCollapsed
                            ? "lg:hidden"
                            : ""
                        }
                      `}
                    >
                      {item.title}
                    </span>

                  </div>
                </NavLink>
              );
            })}

          </div>

        </nav>

        {/* Footer */}

        <div className="border-t border-slate-200 px-6 py-5">

          <div
            className={`
              flex
              items-center
              ${
                isCollapsed
                  ? "lg:justify-center"
                  : "gap-3"
              }
            `}
          >

            <Clock3
              size={18}
              className="flex-shrink-0 text-blue-600"
            />

            <div
              className={
                isCollapsed
                  ? "lg:hidden"
                  : ""
              }
            >
              <p className="text-sm font-semibold text-slate-800">
                Version 1.0.0
              </p>
            </div>

          </div>

        </div>

      </aside>
    </>
  );
}

export default Sidebar;