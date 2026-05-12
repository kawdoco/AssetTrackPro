import React, { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { Sidebar } from "../components/sidebar";
import { TopBar } from "../components/top-bar";
import { ActionModal } from "../components/modals";
import type { TabId, ModalType } from "../../utils/routes";

export const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    type: ModalType;
  }>({
    isOpen: false,
    title: "",
    type: "asset",
  });

  const activeTab: TabId = (() => {
    const pathname = location.pathname;
    if (pathname === "/" || pathname === "") return "dashboard";
    if (pathname.startsWith("/assets")) return "assets";
    if (pathname.startsWith("/employees")) return "employees";
    if (pathname.startsWith("/organizations")) return "organizations";
    if (pathname.startsWith("/branches")) return "branches";
    if (pathname.startsWith("/zones")) return "zones";
    if (pathname.startsWith("/alerts")) return "alerts";
    if (pathname.startsWith("/reports")) return "reports";
    return "settings";
  })();

  const handleTabChange = (tab: TabId) => {
    navigate(tab === "dashboard" ? "/" : `/${tab}`);
  };

  const handleOpenModal = (type: ModalType) => {
    const titles: Record<ModalType, string> = {
      asset: "Register New Asset",
      employee: "Onboard Employee",
      event: "Trigger Manual Event",
    };

    setModalConfig({
      isOpen: true,
      title: titles[type],
      type,
    });
  };

  return (
    <div className="min-h-screen flex font-sans text-[var(--text-primary)] bg-[var(--surface-0)]">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        onLogout={() => {
          navigate("/login");
        }}
      />

      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-200 ${
          isSidebarCollapsed ? "ml-[72px]" : "ml-64"
        }`}
      >
        <TopBar activeTab={activeTab} />
        <main className="flex-1 p-8 overflow-y-auto bg-[var(--surface-1)]">
          <Outlet />
        </main>
      </div>

      <ActionModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig((prev) => ({ ...prev, isOpen: false }))}
        title={modalConfig.title}
        type={modalConfig.type}
      />
    </div>
  );
};
