import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';

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

export const StatsCard = ({ title, value, subtext, trend, trendType, icon: Icon, statusColor = "#248AFF", onClick }: StatsCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)' }}
      onClick={onClick}
      className="bg-white p-5 rounded-[16px] border border-gray-100 cursor-pointer transition-all flex flex-col justify-between group"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="p-2.5 bg-gray-50 rounded-xl group-hover:bg-[#248AFF]/5 transition-colors">
          <Icon className="w-5 h-5 text-gray-400 group-hover:text-[#248AFF] transition-colors" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg ${
            trendType === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
          }`}>
            {trendType === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend}
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: statusColor }}></div>
          <h3 className="text-3xl font-bold text-[#395A8F] tracking-tight">{value}</h3>
        </div>
        <p className="text-sm font-bold text-[#395A8F]/70 mb-0.5">{title}</p>
        <p className="text-xs text-gray-400 font-medium">{subtext}</p>
      </div>
    </motion.div>
  );
};
