import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, LucideIcon } from '@/icons/lucideMuiAdapter';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtext: string;
  trend?: string;
  trendType?: 'up' | 'down';
  icon: LucideIcon;
  statusColor?: string;
  onClick?: () => void;
}

const statusColorClassMap: Record<string, string> = {
  '#10b981': 'bg-emerald-500',
  '#248aff': 'bg-[var(--brand-600)]',
  '#f43f5e': 'bg-rose-500',
};

export const StatsCard = ({ title, value, subtext, trend, trendType, icon: Icon, statusColor = "#248AFF", onClick }: StatsCardProps) => {
  const normalizedStatusColor = statusColor.toLowerCase();
  const statusDotClass = statusColorClassMap[normalizedStatusColor] ?? 'bg-[var(--brand-600)]';

  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: '0 8px 18px -8px rgba(15, 23, 42, 0.24)' }}
      onClick={onClick}
      className="bg-[var(--surface-0)] p-4 rounded-lg border border-[var(--surface-border)] cursor-pointer transition-all flex flex-col justify-between group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-[var(--surface-2)] border border-[var(--surface-border)] rounded-md group-hover:bg-[var(--brand-200)]/30 transition-colors">
          <Icon className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--brand-600)] transition-colors" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-md ${
            trendType === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
          }`}>
            {trendType === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend}
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className={`w-2 h-2 rounded-full ${statusDotClass}`}></div>
          <h3 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight">{value}</h3>
        </div>
        <p className="text-sm font-semibold text-[var(--text-secondary)] mb-0.5">{title}</p>
        <p className="text-xs text-[var(--text-muted)] font-medium">{subtext}</p>
      </div>
    </motion.div>
  );
};


