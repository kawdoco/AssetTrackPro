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
import { Toaster } from "sonner";

import {
  Package,
  Truck,
  AlertCircle,
  RefreshCw,
} from "@/icons/lucideMuiAdapter";

import LoginPage from "../auth/LoginPage";
import { useAuth } from "../hooks/useAuth";
import { useUiTheme } from "../hooks/useUiTheme";

type ModalType = "asset" | "employee" | "event";

export type TabId =
  | "dashboard"
  | "assets"
  | "employees"
  | "organizations"
  | "alerts"
  | "reports"
  | "settings";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import routes from "../utils/routes";

export default function App() {
  const {
    isAuthenticated,
    user,
    token,
    loading,
    login,
    logout,
    getCurrentUser,
  } = useAuth();
  const {
    themeMode,
    setThemeMode,
    densityMode,
    setDensityMode,
    resolvedTheme,
  } = useUiTheme();
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
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
        return (
          <Settings
            themeMode={themeMode}
            setThemeMode={setThemeMode}
            densityMode={densityMode}
            setDensityMode={setDensityMode}
            resolvedTheme={resolvedTheme}
          />
        );
      case "dashboard":
      default:
        return (
          <div className="max-w-[1600px] mx-auto space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
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

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 h-[540px]">
              <div className="lg:col-span-8">
                <AssetMap />
              </div>
              <div className="lg:col-span-4">
                <QuickActions onAction={handleOpenModal} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
              <div className="lg:col-span-12 h-[460px]">
                <AlertsPanel />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex font-sans text-[var(--text-primary)] bg-[var(--surface-0)]">
      <Toaster
        position="top-right"
        richColors
        theme={resolvedTheme === "dark" ? "dark" : "light"}
      />
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        onLogout={() => {
          logout();
          setActiveTab("dashboard");
        }}
      />

      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-200 ${
          isSidebarCollapsed ? "ml-[72px]" : "ml-64"
        }`}
      >
        <TopBar activeTab={activeTab} />
        <main
          className={`flex-1 overflow-y-auto ${
            densityMode === "compact" ? "p-4" : "p-6"
          } bg-[var(--surface-1)]`}
        >
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
    <BrowserRouter>
      <Routes>
        {routes.map((route, i) => {
          if (route.children && route.children.length > 0) {
            return (
              <Route key={i} path={route.path} element={route.element}>
                {route.children.map((child, j) => (
                  <Route key={j} path={child.path} element={child.element} />
                ))}
              </Route>
            );
          }
          return <Route key={i} path={route.path} element={route.element} />;
        })}
        {/* Catch-all redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
