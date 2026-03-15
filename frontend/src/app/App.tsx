import React, { useEffect, useState } from "react";

import { Sidebar } from "./components/sidebar";
import { TopBar } from "./components/top-bar";
import { StatsCard } from "./components/stats-card";
import { AssetMap } from "./components/asset-map";
import { AlertsPanel } from "./components/alerts-panel";
import { QuickActions } from "./components/quick-actions";
import { ActionModal } from "./components/modals";

import { AssetManagement } from "./components/asset-management";
import { EmployeeManagement } from "./components/EmployeeManagement";
import ReportsAnalytics from "./components/reportsAnalytics";
import Settings from "./components/settings";
import AlertsIncidents from "./components/AlertsIncidents";
import { OrganizationManagement } from "./components/OrganizationManagement";

import { Package, Truck, AlertCircle, RefreshCw } from "lucide-react";

import LoginPage from "../auth/LoginPage";
import { useAuth } from "../hooks/useAuth";

type ModalType = "asset" | "employee" | "event";

export type TabId =
  | "dashboard"
  | "assets"
  | "employees"
  | "organizations"
  | "alerts"
  | "reports"
  | "settings";

export default function App() {
  const { isAuthenticated, user, token, loading, login, logout, getCurrentUser } = useAuth();
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

  useEffect(() => {
    if (token && !user) {
      getCurrentUser();
    }
  }, [token, user]);

  // Show login page until authenticated
  if (!isAuthenticated) {
    return (
      <LoginPage
        onLogin={async (email: string, password: string) => {
          try {
            await login(email, password).unwrap();
            return true;
          } catch {
            return false;
          }
        }}
      />
    );
  }

  if (loading && !user) {
    return <div className="p-8 text-sm text-gray-600">Loading account...</div>;
  }

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

  const renderContent = () => {
    switch (activeTab) {
      case "assets":
        return <AssetManagement />;
      case "employees":
        return <EmployeeManagement />;
      case "organizations":
        return <OrganizationManagement />;
      case "alerts":
        return <AlertsIncidents />;
      case "reports":
        return <ReportsAnalytics />;
      case "settings":
        return <Settings />;
      case "dashboard":
      default:
        return (
          <div className="max-w-[1600px] mx-auto space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Active Assets"
                value="14,292"
                subtext="Currently operational in all zones"
                trend="+12.5%"
                trendType="up"
                icon={Package}
                statusColor="#10B981"
                onClick={() => setActiveTab("assets")}
              />
              <StatsCard
                title="Assets in Transit"
                value="842"
                subtext="Moving between regional facilities"
                trend="-3.2%"
                trendType="down"
                icon={Truck}
                statusColor="#248AFF"
                onClick={() => {}}
              />
              <StatsCard
                title="Pending Alerts"
                value="06"
                subtext="Requires supervisor review"
                trend="2 Critical"
                trendType="down"
                icon={AlertCircle}
                statusColor="#F43F5E"
                onClick={() => setActiveTab("alerts")}
              />
              <StatsCard
                title="Sync Status"
                value="99.9%"
                subtext="System latency: 2ms"
                trend="Stable"
                trendType="up"
                icon={RefreshCw}
                statusColor="#248AFF"
                onClick={() => {}}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[600px]">
              <div className="lg:col-span-8">
                <AssetMap />
              </div>
              <div className="lg:col-span-4">
                <QuickActions onAction={handleOpenModal} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-12 h-[500px]">
                <AlertsPanel />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white flex font-sans text-[#395A8F]">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={() => {
          logout();
          setActiveTab("dashboard");
        }}
      />

      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <TopBar />
        <main className="flex-1 p-8 bg-gray-50/30 overflow-y-auto">
          {renderContent()}
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
}