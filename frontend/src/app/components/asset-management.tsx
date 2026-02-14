import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Filter, Download, MoreHorizontal, 
  ChevronRight, Box, Clock, MapPin, History,
  ArrowUpRight, ArrowDownRight, User, AlertTriangle,
  X
} from 'lucide-react';

const assetsData = [
  { id: 'RF-8829', name: 'Industrial Drill P-20', category: 'Heavy Machinery', location: 'Warehouse A', status: 'normal', lastSeen: '2 mins ago', holder: 'Mike Chen' },
  { id: 'RF-4421', name: 'Mobile Gateway v2', category: 'IT Equipment', location: 'Section B', status: 'overdue', lastSeen: '4 hours ago', holder: 'Sarah Jenkins' },
  { id: 'RF-9902', name: 'Storage Container B-09', category: 'Logistics', location: 'Dock 4', status: 'missing', lastSeen: 'Yesterday', holder: 'None' },
  { id: 'RF-1283', name: 'Calibrator Tool S-5', category: 'Precision Tools', location: 'Lab 1', status: 'normal', lastSeen: '15 mins ago', holder: 'David Miller' },
  { id: 'RF-3391', name: 'Loading Palette 44', category: 'Logistics', location: 'Warehouse A', status: 'normal', lastSeen: '1 hour ago', holder: 'Mike Chen' },
  { id: 'RF-5562', name: 'Safety Kit 09', category: 'Emergency', location: 'Exit G', status: 'overdue', lastSeen: '12 hours ago', holder: 'Emma Wilson' },
];

const statusStyles = {
  normal: { bg: 'bg-blue-50', text: 'text-[#248AFF]', label: 'Normal' },
  overdue: { bg: 'bg-amber-50', text: 'text-amber-600', label: 'Overdue' },
  missing: { bg: 'bg-rose-50', text: 'text-rose-600', label: 'Missing' },
};

export const AssetManagement = () => {
  const [selectedAsset, setSelectedAsset] = useState<typeof assetsData[0] | null>(null);

  return (
    <div className="flex h-full gap-8 overflow-hidden">
      {/* List Section */}
      <div className={`flex-1 flex flex-col transition-all duration-500 ${selectedAsset ? 'w-2/3' : 'w-full'}`}>
        <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm flex-1 flex flex-col overflow-hidden">
          {/* Header Controls */}
          <div className="p-6 border-b border-gray-50 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <h2 className="text-lg font-bold text-[#395A8F]">Asset Inventory</h2>
              <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
                <button className="px-4 py-1.5 text-xs font-bold bg-white text-[#248AFF] rounded-lg shadow-sm border border-gray-100">All Assets</button>
                <button className="px-4 py-1.5 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors">By Zone</button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Filter by ID, name..."
                  className="bg-gray-50 border-none rounded-xl py-2 pl-9 pr-4 text-xs focus:ring-2 focus:ring-[#248AFF]/10 transition-all outline-none"
                />
              </div>
              <button className="p-2 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors text-gray-500">
                <Filter className="w-4 h-4" />
              </button>
              <button className="p-2 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors text-gray-500">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 border-b border-gray-50">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Asset ID</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Description</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Current Zone</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Last Movement</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {assetsData.map((asset) => (
                  <motion.tr
                    key={asset.id}
                    whileHover={{ backgroundColor: 'rgb(249 250 251)' }}
                    onClick={() => setSelectedAsset(asset)}
                    className={`cursor-pointer group transition-colors ${selectedAsset?.id === asset.id ? 'bg-blue-50/30' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-[#395A8F]">{asset.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                          <Box className="w-4 h-4 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#395A8F]">{asset.name}</p>
                          <p className="text-[10px] font-bold text-gray-400">{asset.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-gray-300" />
                        <span className="text-xs font-semibold text-gray-600">{asset.location}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${statusStyles[asset.status as keyof typeof statusStyles].bg} ${statusStyles[asset.status as keyof typeof statusStyles].text}`}>
                        {statusStyles[asset.status as keyof typeof statusStyles].label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-gray-400">{asset.lastSeen}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1.5 rounded-lg hover:bg-white text-gray-300 transition-colors opacity-0 group-hover:opacity-100">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail Side Panel */}
      <AnimatePresence>
        {selectedAsset && (
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            className="w-[320px] bg-white rounded-[24px] border border-gray-100 shadow-xl overflow-hidden flex flex-col"
          >
            <div className="p-8 border-b border-gray-50 relative">
              <button 
                onClick={() => setSelectedAsset(null)}
                className="absolute top-8 right-8 p-1.5 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
              >
              <X className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                <Box className="w-8 h-8 text-[#248AFF]" />
              </div>
              <h3 className="text-xl font-bold text-[#395A8F] mb-1">{selectedAsset.name}</h3>
              <p className="text-sm font-bold text-gray-400 mb-6">{selectedAsset.id} • {selectedAsset.category}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Current Holder</p>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-[#395A8F] rounded-full flex items-center justify-center text-[8px] text-white font-bold">
                      {selectedAsset.holder !== 'None' ? selectedAsset.holder[0] : 'N'}
                    </div>
                    <span className="text-xs font-bold text-[#395A8F]">{selectedAsset.holder}</span>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Status</p>
                  <span className={`text-xs font-bold ${statusStyles[selectedAsset.status as keyof typeof statusStyles].text}`}>
                    {statusStyles[selectedAsset.status as keyof typeof statusStyles].label}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1 p-8 overflow-y-auto scrollbar-hide">
              <div className="mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="font-bold text-[#395A8F] flex items-center gap-2">
                    <History className="w-4 h-4" />
                    Movement History
                  </h4>
                  <button className="text-[10px] font-bold text-[#248AFF] uppercase">Full Report</button>
                </div>

                <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1.5px] before:bg-gray-100">
                  {[
                    { type: 'entry', zone: 'Warehouse A', time: 'Today, 10:42 AM', icon: ArrowDownRight, color: 'text-emerald-500' },
                    { type: 'exit', zone: 'Section B', time: 'Today, 09:15 AM', icon: ArrowUpRight, color: 'text-rose-500' },
                    { type: 'entry', zone: 'Section B', time: 'Yesterday, 04:30 PM', icon: ArrowDownRight, color: 'text-emerald-500' },
                  ].map((event, i) => (
                    <div key={i} className="relative flex gap-6 pl-8">
                      <div className={`absolute left-0 top-1 w-6 h-6 rounded-lg bg-white border border-gray-100 flex items-center justify-center z-10 shadow-sm`}>
                        <event.icon className={`w-3 h-3 ${event.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-[#395A8F] mb-0.5">
                          {event.type === 'entry' ? 'Entered' : 'Exited'} {event.zone}
                        </p>
                        <p className="text-[10px] font-medium text-gray-400">{event.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#395A8F] rounded-2xl p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  <p className="text-xs font-bold">Action Required</p>
                </div>
                <p className="text-xs text-blue-100 mb-6 leading-relaxed">
                  Asset has been in Warehouse A for more than 48 hours without update. Perform physical audit or re-assign.
                </p>
                <button className="w-full py-2.5 bg-white text-[#395A8F] rounded-xl font-bold text-xs hover:bg-blue-50 transition-colors">
                  Assign to Employee
                </button>
              </div>
            </div>

            <div className="p-8 border-t border-gray-50 grid grid-cols-2 gap-4">
              <button className="py-3 px-4 bg-white border border-gray-100 rounded-xl font-bold text-xs text-[#395A8F] hover:bg-gray-50 transition-colors">
                Recover Asset
              </button>
              <button className="py-3 px-4 bg-[#248AFF] text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-100 hover:bg-[#1c7ae6] transition-colors">
                Update Status
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
