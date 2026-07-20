import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";

function MainLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">

      <Sidebar isCollapsed={isSidebarCollapsed} />

      <div className="flex flex-1 flex-col overflow-hidden">

        <TopNavbar
          isCollapsed={isSidebarCollapsed}
          toggleSidebar={() =>
            setIsSidebarCollapsed((prev) => !prev)
          }
        />

        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default MainLayout;