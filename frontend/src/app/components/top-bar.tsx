import React from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';

export const TopBar = () => {
  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex flex-col">
        <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
          <span>Pages</span>
          <span>/</span>
          <span className="text-gray-600">Dashboard</span>
        </div>
        <h1 className="text-xl font-bold text-[#395A8F]">Main Dashboard</h1>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#248AFF] transition-colors" />
          <input
            type="text"
            placeholder="Search assets, employees..."
            className="w-72 bg-gray-50 border border-transparent rounded-xl py-2.5 pl-10 pr-4 text-sm focus:bg-white focus:border-[#248AFF]/20 focus:ring-4 focus:ring-[#248AFF]/5 outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2.5 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 hover:border-gray-200 transition-all cursor-pointer"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
          </motion.button>

          <div className="h-8 w-[1px] bg-gray-100 mx-2"></div>

          <motion.div
            whileHover={{ backgroundColor: 'rgb(249 250 251)' }}
            className="flex items-center gap-3 p-1.5 pr-3 rounded-xl cursor-pointer transition-colors"
          >
            <div className="w-9 h-9 bg-[#395A8F] rounded-lg flex items-center justify-center text-white font-bold text-sm">
              JD
            </div>
            <div className="hidden xl:block">
              <p className="text-sm font-bold text-[#395A8F] leading-tight">John Doe</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Fleet Manager</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </motion.div>
        </div>
      </div>
    </header>
  );
};
