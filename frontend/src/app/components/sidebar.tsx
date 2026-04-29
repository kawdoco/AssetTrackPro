/// <reference types="vite/client" />
import React from "react";
import {
  LayoutDashboard,
  Package,
  Users,
  Building2,
  Bell,
  FileText,
  Settings,
  ChevronRight,
  PanelLeftIcon,
} from "@/icons/lucideMuiAdapter";

import type { TabId } from "../../utils/routes";
import logo from "../../assets/logo.png";

interface SidebarProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onLogout: () => void;
}

const navItems: Array<{
  id: TabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "assets", label: "Assets", icon: Package },
  { id: "employees", label: "Employees", icon: Users },
  { id: "organizations", label: "Organizations", icon: Building2 },
  { id: "alerts", label: "Alerts", icon: Bell },
  { id: "reports", label: "Reports", icon: FileText },
  { id: "settings", label: "Settings", icon: Settings },
];

export const Sidebar = ({
  activeTab,
  setActiveTab,
  isCollapsed,
  onToggleCollapse,
  onLogout,
}: SidebarProps) => {
  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-[var(--surface-0)] border-r border-[var(--surface-border)] flex flex-col z-50 transition-all duration-200 ${
        isCollapsed ? "w-[72px]" : "w-64"
      }`}
    >
      <div className="p-4 flex flex-col h-full">
        {/* Logo */}
        <div className={`flex items-center mb-6 ${isCollapsed ? "flex-col gap-2" : "justify-between gap-3"}`}>
          <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"}`}>
            <img
              src={logo}
              alt="TrackPro"
              className="w-8 h-8 rounded-md object-contain"
            />
            {!isCollapsed && (
              <span className="font-semibold text-lg tracking-tight">
                <span className="text-[var(--text-primary)]">Track</span>
                <span className="text-[var(--brand-600)]">Pro</span>
              </span>
            )}
          </div>

          {!isCollapsed && (
            <button
              onClick={onToggleCollapse}
              className="h-8 w-8 rounded-md border border-[var(--surface-border)] hover:bg-[var(--surface-2)] inline-flex items-center justify-center text-[var(--text-secondary)]"
              aria-label="Collapse sidebar"
              title="Collapse sidebar"
            >
              <PanelLeftIcon className="w-4 h-4" />
            </button>
          )}

          {isCollapsed && (
            <button
              onClick={onToggleCollapse}
              className="h-8 w-8 rounded-md border border-[var(--surface-border)] hover:bg-[var(--surface-2)] inline-flex items-center justify-center text-[var(--text-secondary)]"
              aria-label="Expand sidebar"
              title="Expand sidebar"
            >
              <PanelLeftIcon className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation items */}
        <nav className="flex-1 flex flex-col space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center px-3 py-2 rounded-md transition-all duration-200 group relative text-left ${
                  isCollapsed ? "justify-center" : "gap-3"
                } ${
                  isActive
                    ? "bg-[var(--brand-600)] text-white shadow-sm"
                    : "text-[var(--text-secondary)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)]"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive
                      ? "text-white"
                      : "text-[var(--text-muted)] group-hover:text-[var(--brand-600)]"
                  }`}
                />
                {!isCollapsed && <span className="font-medium text-sm">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Sign Out */}
        <div className="mt-auto mb-1">
          <button
            onClick={onLogout}
            title={isCollapsed ? "Sign Out" : undefined}
            className={`w-full flex items-center px-3 py-2 rounded-md text-[var(--text-secondary)] hover:bg-[var(--surface-2)] hover:text-[var(--danger-500)] transition-all duration-200 ${
              isCollapsed ? "justify-center" : "gap-3"
            }`}
          >
            <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
            {!isCollapsed && <span className="font-medium text-sm">Sign Out</span>}
          </button>
        </div>

        {/* System Status */}
        <div className="border-t border-[var(--surface-border)] pt-3">
          <div
            className={`bg-[var(--surface-2)] rounded-md border border-[var(--surface-border)] ${
              isCollapsed ? "p-2" : "p-3"
            }`}
            title={isCollapsed ? "All Systems Operational" : undefined}
          >
            {!isCollapsed && (
              <p className="text-[10px] font-semibold text-[var(--brand-600)] uppercase mb-1 tracking-wide">
                System Status
              </p>
            )}
            <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-2"}`}>
              <div className="w-2 h-2 bg-[var(--success-500)] rounded-full animate-pulse"></div>
              {!isCollapsed && (
                <span className="text-xs font-semibold text-[var(--text-primary)]">
                All Systems Operational
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

