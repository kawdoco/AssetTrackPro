import React from 'react';
import { LayoutDashboard, Package, Users, Building2, Bell, FileText, Settings, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'assets', label: 'Assets', icon: Package },
  { id: 'employees', label: 'Employees', icon: Users },
  { id: 'organizations', label: 'Organizations', icon: Building2 },
  { id: 'alerts', label: 'Alerts', icon: Bell },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-100 flex flex-col z-50">
      <div className="p-6 flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-8 h-8 bg-[#248AFF] rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white rounded-full"></div>
          </div>
          <span className="font-bold text-lg tracking-tight">
            <span className="text-[#395A8F]">Track</span>
            <span className="text-[#248AFF]">Pro</span>
          </span>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 flex flex-col space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-[#248AFF] text-white shadow-md shadow-blue-100'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-[#395A8F]'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-[#248AFF]'}`} />
                <span className="font-semibold text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sign Out button*/}
        <div className="mt-auto mb-1">
          <button
            onClick={() => console.log('Signing out...')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-[#FF3B30] transition-all duration-200"
          >
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#FF3B30]" />
            <span className="font-semibold text-sm">Sign Out</span>
          </button>
        </div>

        {/* System Status */}
        <div className="border-t border-gray-50 pt-4">
          <div className="bg-blue-50 p-4 rounded-2xl">
            <p className="text-[10px] font-bold text-[#248AFF] uppercase mb-1">System Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-bold text-[#395A8F]">All Systems Operational</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};