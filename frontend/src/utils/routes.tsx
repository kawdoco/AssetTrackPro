import React from "react";
import { Package, Truck, AlertCircle, RefreshCw } from "lucide-react";

import { AssetManagement } from "../app/components/asset-management";
import { EmployeeManagement } from "../app/components/EmployeeManagement";
import ReportsAnalytics from "../app/components/reportsAnalytics";
import Settings from "../app/components/settings";
import AlertsIncidents from "../app/components/AlertsIncidents";
import { OrganizationManagement } from "../app/components/OrganizationManagement";
import { StatsCard } from "../app/components/stats-card";
import { AssetMap } from "../app/components/asset-map";
import { QuickActions } from "../app/components/quick-actions";
import { AlertsPanel } from "../app/components/alerts-panel";
import { MainLayout } from "../app/layouts/MainLayout";

export type TabId =
  | "dashboard"
  | "assets"
  | "employees"
  | "organizations"
  | "alerts"
  | "reports"
  | "settings";

export type ModalType = "asset" | "employee" | "event";

// Dashboard Component
const Dashboard = () => {
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
          onClick={() => {}}
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
          onClick={() => {}}
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
          <QuickActions onAction={() => {}} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12 h-[500px]">
          <AlertsPanel />
        </div>
      </div>
    </div>
  );
};

// Route Configuration
export const routes = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "",
        element: <Dashboard />,
      },
      {
        path: "assets",
        element: <AssetManagement />,
      },
      {
        path: "employees",
        element: <EmployeeManagement />,
      },
      {
        path: "organizations",
        element: <OrganizationManagement />,
      },
      {
        path: "alerts",
        element: <AlertsIncidents />,
      },
      {
        path: "reports",
        element: <ReportsAnalytics />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
];

export default routes;