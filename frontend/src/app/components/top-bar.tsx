import React from 'react';
import { Search, Bell, ChevronDown } from '@/icons/lucideMuiAdapter';
import { motion } from 'motion/react';
import type { TabId } from '../../utils/routes';

interface TopBarProps {
  activeTab: TabId;
}

const tabLabel: Record<TabId, string> = {
  dashboard: 'Dashboard',
  assets: 'Assets',
  employees: 'Employees',
  organizations: 'Organizations',
  branches: 'Branches',
  alerts: 'Alerts',
  reports: 'Reports',
  settings: 'Settings',
};

export const TopBar = ({ activeTab }: TopBarProps) => {
  return (
    <header className="h-14 bg-[var(--surface-0)] border-b border-[var(--surface-border)] flex items-center justify-between px-4 sticky top-0 z-40">
      <div className="flex flex-col">
        <div className="flex items-center gap-2 text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wide">
          <span>Pages</span>
          <span>/</span>
          <span className="text-[var(--text-secondary)] normal-case tracking-normal">{tabLabel[activeTab]}</span>
        </div>
        <h1 className="text-base font-semibold text-[var(--text-primary)] leading-tight">{tabLabel[activeTab]}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] group-focus-within:text-[var(--brand-600)] transition-colors" />
          <input
            type="text"
            placeholder="Search assets, employees..."
            className="w-72 bg-[var(--surface-2)] border border-[var(--surface-border)] rounded-md py-2 pl-10 pr-4 text-sm focus:bg-[var(--surface-0)] focus:border-[var(--brand-400)] focus:ring-2 focus:ring-[var(--brand-200)] outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 bg-[var(--surface-0)] border border-[var(--surface-border)] rounded-md hover:bg-[var(--surface-2)] transition-all cursor-pointer"
          >
            <Bell className="w-4 h-4 text-[var(--text-secondary)]" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[var(--danger-500)] rounded-full ring-2 ring-[var(--surface-0)]"></span>
          </motion.button>

          <div className="h-7 w-px bg-[var(--surface-border)]"></div>

          <motion.div
            whileHover={{ backgroundColor: 'var(--surface-2)' }}
            className="flex items-center gap-2 p-1 pr-2 rounded-md cursor-pointer transition-colors"
          >
            <div className="w-8 h-8 bg-[var(--brand-700)] rounded-md flex items-center justify-center text-white font-semibold text-xs">
              JD
            </div>
            <div className="hidden xl:block">
              <p className="text-sm font-semibold text-[var(--text-primary)] leading-tight">John Doe</p>
              <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">Fleet Manager</p>
            </div>
            <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />
          </motion.div>
        </div>
      </div>
    </header>
  );
};


