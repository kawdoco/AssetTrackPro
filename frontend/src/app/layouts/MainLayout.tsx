import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { Sidebar } from "../components/sidebar";
import { TopBar } from "../components/top-bar";
import { ActionModal } from "../components/modals";
import LoginPage from "../../auth/LoginPage";
import { TabId, ModalType } from "../../utils/routes";

export const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthed, setIsAuthed] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    type: ModalType;
  }>({
    isOpen: false,
    title: "",
    type: "asset",
  });

  // Show login page until authenticated
  if (!isAuthed) {
    return <LoginPage onLogin={() => setIsAuthed(true)} />;
  }

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
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
    <div className="min-h-screen bg-white flex font-sans text-[#395A8F]">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onLogout={() => {
          setIsAuthed(false);
          setActiveTab("dashboard");
          navigate("/");
        }}
      />

      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <TopBar />
        <main className="flex-1 p-8 bg-gray-50/30 overflow-y-auto">
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
