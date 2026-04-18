import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Filter, Download, MoreHorizontal, 
  ChevronRight, Box, Clock, MapPin, History,
  ArrowUpRight, ArrowDownRight, User, AlertTriangle,
  X
} from '@/icons/lucideMuiAdapter';

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
    <div className="flex h-full gap-4 overflow-hidden">
      {/* List Section */}
      <div className={`flex-1 flex flex-col transition-all duration-500 ${selectedAsset ? 'w-2/3' : 'w-full'}`}>
        <div className="bg-[var(--surface-0)] rounded-lg border border-[var(--surface-border)] shadow-sm flex-1 flex flex-col overflow-hidden">
          {/* Header Controls */}
          <div className="p-4 border-b border-[var(--surface-border)] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <h2 className="text-base font-semibold text-[var(--text-primary)]">Asset Inventory</h2>
              <div className="flex bg-[var(--surface-2)] p-1 rounded-md border border-[var(--surface-border)]">
                <button className="px-3 py-1.5 text-xs font-semibold bg-[var(--surface-0)] text-[var(--brand-600)] rounded-md shadow-sm border border-[var(--surface-border)]">All Assets</button>
                <button className="px-3 py-1.5 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">By Zone</button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type="text"
                  placeholder="Filter by ID, name..."
                  className="bg-[var(--surface-1)] border border-[var(--surface-border)] rounded-md py-2 pl-9 pr-4 text-xs text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--brand-200)] transition-all outline-none"
                />
              </div>
              <button title="Filter assets" aria-label="Filter assets" className="p-2 bg-[var(--surface-0)] border border-[var(--surface-border)] rounded-md hover:bg-[var(--surface-2)] transition-colors text-[var(--text-secondary)]">
                <Filter className="w-4 h-4" />
              </button>
              <button title="Export assets" aria-label="Export assets" className="p-2 bg-[var(--surface-0)] border border-[var(--surface-border)] rounded-md hover:bg-[var(--surface-2)] transition-colors text-[var(--text-secondary)]">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-[var(--surface-0)]/95 backdrop-blur-sm z-10 border-b border-[var(--surface-border)]">
                <tr>
                  <th className="px-4 py-3 text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest">Asset ID</th>
                  <th className="px-4 py-3 text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest">Description</th>
                  <th className="px-4 py-3 text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest">Current Zone</th>
                  <th className="px-4 py-3 text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest">Status</th>
                  <th className="px-4 py-3 text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest">Last Movement</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--surface-border)]">
                {assetsData.map((asset) => (
                  <motion.tr
                    key={asset.id}
                    whileHover={{ backgroundColor: 'var(--surface-2)' }}
                    onClick={() => setSelectedAsset(asset)}
                    className={`cursor-pointer group transition-colors ${selectedAsset?.id === asset.id ? 'bg-[var(--brand-200)]/30' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <span className="text-sm font-semibold text-[var(--text-primary)]">{asset.id}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-[var(--surface-2)] flex items-center justify-center border border-[var(--surface-border)]">
                          <Box className="w-4 h-4 text-[var(--text-muted)]" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[var(--text-primary)]">{asset.name}</p>
                          <p className="text-[10px] font-semibold text-[var(--text-muted)]">{asset.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                        <span className="text-xs font-medium text-[var(--text-secondary)]">{asset.location}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${statusStyles[asset.status as keyof typeof statusStyles].bg} ${statusStyles[asset.status as keyof typeof statusStyles].text}`}>
                        {statusStyles[asset.status as keyof typeof statusStyles].label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium text-[var(--text-muted)]">{asset.lastSeen}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button title="More actions" aria-label="More actions" className="p-1.5 rounded-md hover:bg-[var(--surface-0)] text-[var(--text-muted)] transition-colors opacity-0 group-hover:opacity-100">
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
            className="w-[320px] bg-[var(--surface-0)] rounded-lg border border-[var(--surface-border)] shadow-lg overflow-hidden flex flex-col"
          >
            <div className="p-5 border-b border-[var(--surface-border)] relative">
              <button 
                onClick={() => setSelectedAsset(null)}
                title="Close details"
                aria-label="Close details"
                className="absolute top-4 right-4 p-1.5 hover:bg-[var(--surface-2)] rounded-full text-[var(--text-muted)] transition-colors"
              >
              <X className="w-5 h-5" />
              </button>

              <div className="w-14 h-14 bg-[var(--brand-200)]/30 rounded-lg flex items-center justify-center mb-4 border border-[var(--surface-border)]">
                <Box className="w-7 h-7 text-[var(--brand-600)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">{selectedAsset.name}</h3>
              <p className="text-xs font-semibold text-[var(--text-muted)] mb-4">{selectedAsset.id} • {selectedAsset.category}</p>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[var(--surface-2)] p-3 rounded-md border border-[var(--surface-border)]">
                  <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1">Current Holder</p>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-[var(--brand-700)] rounded-full flex items-center justify-center text-[8px] text-white font-semibold">
                      {selectedAsset.holder !== 'None' ? selectedAsset.holder[0] : 'N'}
                    </div>
                    <span className="text-xs font-semibold text-[var(--text-primary)]">{selectedAsset.holder}</span>
                  </div>
                </div>
                <div className="bg-[var(--surface-2)] p-3 rounded-md border border-[var(--surface-border)]">
                  <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1">Status</p>
                  <span className={`text-xs font-semibold ${statusStyles[selectedAsset.status as keyof typeof statusStyles].text}`}>
                    {statusStyles[selectedAsset.status as keyof typeof statusStyles].label}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1 p-5 overflow-y-auto scrollbar-hide">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold text-[var(--text-primary)] flex items-center gap-2">
                    <History className="w-4 h-4" />
                    Movement History
                  </h4>
                  <button className="text-[10px] font-semibold text-[var(--brand-600)] uppercase">Full Report</button>
                </div>

                <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1.5px] before:bg-[var(--surface-border)]">
                  {[
                    { type: 'entry', zone: 'Warehouse A', time: 'Today, 10:42 AM', icon: ArrowDownRight, color: 'text-emerald-500' },
                    { type: 'exit', zone: 'Section B', time: 'Today, 09:15 AM', icon: ArrowUpRight, color: 'text-rose-500' },
                    { type: 'entry', zone: 'Section B', time: 'Yesterday, 04:30 PM', icon: ArrowDownRight, color: 'text-emerald-500' },
                  ].map((event, i) => (
                    <div key={i} className="relative flex gap-5 pl-8">
                      <div className={`absolute left-0 top-1 w-6 h-6 rounded-md bg-[var(--surface-0)] border border-[var(--surface-border)] flex items-center justify-center z-10 shadow-sm`}>
                        <event.icon className={`w-3 h-3 ${event.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-[var(--text-primary)] mb-0.5">
                          {event.type === 'entry' ? 'Entered' : 'Exited'} {event.zone}
                        </p>
                        <p className="text-[10px] font-medium text-[var(--text-muted)]">{event.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[var(--brand-700)] rounded-lg p-4 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  <p className="text-xs font-semibold">Action Required</p>
                </div>
                <p className="text-xs text-blue-100 mb-4 leading-relaxed">
                  Asset has been in Warehouse A for more than 48 hours without update. Perform physical audit or re-assign.
                </p>
                <button className="w-full py-2.5 bg-white text-[var(--brand-700)] rounded-md font-semibold text-xs hover:bg-[var(--surface-2)] transition-colors">
                  Assign to Employee
                </button>
              </div>
            </div>

            <div className="p-5 border-t border-[var(--surface-border)] grid grid-cols-2 gap-3">
              <button className="py-2.5 px-4 bg-[var(--surface-0)] border border-[var(--surface-border)] rounded-md font-semibold text-xs text-[var(--text-primary)] hover:bg-[var(--surface-2)] transition-colors">
                Recover Asset
              </button>
              <button className="py-2.5 px-4 bg-[var(--brand-600)] text-white rounded-md font-semibold text-xs hover:bg-[var(--brand-700)] transition-colors">
                Update Status
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


