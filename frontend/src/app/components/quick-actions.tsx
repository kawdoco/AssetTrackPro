import React from 'react';
import { motion } from 'motion/react';
import { Box, UserPlus, Zap, ArrowRight, Activity, Globe } from '@/icons/lucideMuiAdapter';

interface QuickActionsProps {
  onAction: (type: 'asset' | 'employee' | 'event') => void;
}

export const QuickActions = ({ onAction }: QuickActionsProps) => {
  return (
    <div className="bg-[var(--surface-0)] p-4 rounded-lg border border-[var(--surface-border)] shadow-sm h-full flex flex-col">
      <div className="mb-4">
        <h3 className="font-semibold text-[var(--text-primary)] text-base">Quick Operations</h3>
        <p className="text-[11px] text-[var(--text-muted)] font-semibold uppercase tracking-wide">Common Workflows</p>
      </div>

      <div className="space-y-3 flex-1">
        <motion.button
          whileHover={{ scale: 1.01, x: 2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onAction('asset')}
          className="w-full bg-[var(--brand-600)] hover:bg-[var(--brand-700)] text-white py-3 px-4 rounded-md font-semibold text-sm flex items-center justify-between transition-all group"
        >
          <div className="flex items-center gap-3">
            <Box className="w-4 h-4 opacity-90" />
            <span>Register New Asset</span>
          </div>
          <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.01, x: 2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onAction('employee')}
          className="w-full bg-[var(--surface-0)] border border-[var(--surface-border)] hover:border-[var(--brand-300)] hover:bg-[var(--surface-2)] text-[var(--text-primary)] py-3 px-4 rounded-md font-semibold text-sm flex items-center justify-between transition-all group"
        >
          <div className="flex items-center gap-3">
            <UserPlus className="w-4 h-4 text-[var(--brand-600)]" />
            <span>Onboard Employee</span>
          </div>
          <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-[var(--text-muted)]" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.01, x: 2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onAction('event')}
          className="w-full bg-[var(--text-secondary)] hover:bg-[var(--text-primary)] text-white py-3 px-4 rounded-md font-semibold text-sm flex items-center justify-between transition-all group"
        >
          <div className="flex items-center gap-3">
            <Zap className="w-4 h-4 text-[var(--brand-400)]" />
            <span>Manual Event Trigger</span>
          </div>
          <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.button>
      </div>

      <div className="mt-5 space-y-3">
        <div className="p-3 rounded-md bg-[var(--surface-1)] border border-[var(--surface-border)]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-semibold text-[var(--text-primary)]">Network Health</span>
            </div>
            <span className="text-xs font-semibold text-emerald-600">99.9%</span>
          </div>
          <div className="h-1.5 w-full bg-[var(--surface-border)] rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 w-[99.9%]"></div>
          </div>
        </div>

        <div className="p-3 rounded-md bg-[var(--surface-1)] border border-[var(--surface-border)]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[var(--brand-600)]" />
              <span className="text-xs font-semibold text-[var(--text-primary)]">Global Sync</span>
            </div>
            <span className="text-xs font-semibold text-[var(--text-muted)]">2ms latency</span>
          </div>
          <div className="h-1.5 w-full bg-[var(--surface-border)] rounded-full overflow-hidden">
            <div className="h-full bg-[var(--brand-600)] w-[85%]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

