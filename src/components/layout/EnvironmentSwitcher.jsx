import { useEffect, useRef, useState } from "react";
import {
  Globe,
  ChevronDown,
  Check,
} from "lucide-react";

import {
  getEnvironments,
  activateEnvironment,
} from "../../services/environmentService";

function EnvironmentSwitcher() {
  const [environments, setEnvironments] = useState([]);
  const [activeEnvironment, setActiveEnvironment] = useState(null);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    loadEnvironments();

    const handleRefresh = () => {
      loadEnvironments();
    };

    window.addEventListener("environmentChanged", handleRefresh);

    return () => {
      window.removeEventListener("environmentChanged", handleRefresh);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const loadEnvironments = async () => {
    try {
      const data = await getEnvironments();

      setEnvironments(data);

      const active = data.find(
        (env) => env.isActive
      );

      setActiveEnvironment(active);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSwitch = async (id) => {
    if (id === activeEnvironment?.id) {
      setOpen(false);
      return;
    }

    try {
      setLoading(true);

      await activateEnvironment(id);

      await loadEnvironments();

      setOpen(false);

      window.dispatchEvent(
        new Event("environmentChanged")
      );

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative"
      ref={dropdownRef}
    >
      {/* Trigger */}

      <button
        onClick={() => setOpen(!open)}
        className="
          flex
          w-[320px]
          h-[72px]
          items-center
          justify-between
          rounded-xl
          border
          border-slate-200
          bg-white
          px-4
          shadow-sm
          transition-all
          hover:border-blue-400
          hover:shadow-md
        "
      >
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100">
          <Globe
            size={18}
            className="text-blue-600"
          />
        </div>

        <div className="min-w-0 flex-1 text-left overflow-hidden">
          <p className="text-xs text-slate-500">
            Active Environment
          </p>

          <p
            className="truncate font-semibold text-slate-800"
            title={activeEnvironment?.name}
          >
            {activeEnvironment?.name || "No Environment"}
          </p>

          <p
            className="truncate text-xs text-slate-500"
            title={activeEnvironment?.baseUrl}
          >
            {activeEnvironment?.baseUrl || "No Base URL"}
          </p>
        </div>

        <ChevronDown
          size={18}
          className={`ml-3 flex-shrink-0 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}

      {open && (
        <div
          className="
            absolute
            right-0
            mt-3
            w-80
            overflow-hidden
            rounded-2xl
            border
            border-slate-200
            bg-white
            shadow-2xl
            z-50
          "
        >
          <div className="border-b bg-slate-50 px-5 py-4">
            <h3 className="font-semibold text-slate-800">
              Switch Environment
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Choose the active environment
            </p>
          </div>

          {environments.map((env) => (
            <button
              key={env.id}
              onClick={() =>
                handleSwitch(env.id)
              }
              disabled={loading}
              className="
                flex
                w-full
                items-center
                justify-between
                px-5
                py-4
                transition
                hover:bg-slate-50
              "
            >
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      env.isActive
                        ? "bg-green-500"
                        : "bg-slate-300"
                    }`}
                  />

                  <span className="font-medium">
                    {env.name}
                  </span>
                </div>

                <p className="mt-1 text-xs text-slate-500">
                  {env.baseUrl}
                </p>
              </div>

              {env.isActive && (
                <Check
                  size={18}
                  className="text-green-600"
                />
              )}
            </button>
          ))}

          {loading && (
            <div className="border-t bg-slate-50 px-5 py-3 text-sm text-blue-600">
              Switching environment...
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default EnvironmentSwitcher;