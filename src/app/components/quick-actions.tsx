import React from 'react';
import { motion } from 'motion/react';
import { Box, UserPlus, Zap, ArrowRight, Activity, Globe } from 'lucide-react';

interface QuickActionsProps {
  onAction: (type: 'asset' | 'employee' | 'event') => void;
}

export const QuickActions = ({ onAction }: QuickActionsProps) => {
  return (
    <div className="bg-white p-6 rounded-[16px] border border-gray-100 shadow-sm h-full flex flex-col">
      <div className="mb-6">
        <h3 className="font-bold text-[#395A8F] text-lg">Quick Operations</h3>
        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Common Workflows</p>
      </div>

      <div className="space-y-4 flex-1">
        <motion.button
          whileHover={{ scale: 1.02, x: 4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onAction('asset')}
          className="w-full bg-[#248AFF] hover:bg-[#1c7ae6] text-white py-4 px-6 rounded-2xl font-bold text-sm flex items-center justify-between transition-all shadow-lg shadow-blue-100 group"
        >
          <div className="flex items-center gap-3">
            <Box className="w-5 h-5 opacity-80" />
            <span>Register New Asset</span>
          </div>
          <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02, x: 4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onAction('employee')}
          className="w-full bg-white border border-gray-100 hover:border-[#248AFF]/30 hover:bg-gray-50 text-[#395A8F] py-4 px-6 rounded-2xl font-bold text-sm flex items-center justify-between transition-all group"
        >
          <div className="flex items-center gap-3">
            <UserPlus className="w-5 h-5 text-[#248AFF]" />
            <span>Onboard Employee</span>
          </div>
          <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-gray-300" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02, x: 4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onAction('event')}
          className="w-full bg-[#395A8F] hover:bg-[#2d4771] text-white py-4 px-6 rounded-2xl font-bold text-sm flex items-center justify-between transition-all group shadow-lg shadow-blue-100/10"
        >
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-[#248AFF]" />
            <span>Manual Event Trigger</span>
          </div>
          <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.button>
      </div>

      <div className="mt-8 space-y-4">
        <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-bold text-[#395A8F]">Network Health</span>
            </div>
            <span className="text-xs font-bold text-emerald-600">99.9%</span>
          </div>
          <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 w-[99.9%]"></div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#248AFF]" />
              <span className="text-xs font-bold text-[#395A8F]">Global Sync</span>
            </div>
            <span className="text-xs font-bold text-gray-500">2ms latency</span>
          </div>
          <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-[#248AFF] w-[85%]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
