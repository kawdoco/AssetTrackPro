import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, CheckCircle2, AlertTriangle, ChevronRight, X, Clock, MapPin, Tag } from 'lucide-react';

const alerts = [
  {
    id: 1,
    type: 'critical',
    title: 'Zone Breach: Restricted Area C',
    time: '2 mins ago',
    desc: 'Unidentified asset tag #RF-8829 detected in high-security zone.',
    color: '#F43F5E',
    location: 'North Warehouse - Section C',
    asset: 'RF-8829',
  },
  {
    id: 2,
    type: 'warning',
    title: 'Low Battery: Sensor Node 04',
    time: '15 mins ago',
    desc: 'Gateway battery at 5%. Replacement required within 24 hours.',
    color: '#F59E0B',
    location: 'External Dock B',
    asset: 'GW-04',
  },
  {
    id: 3,
    type: 'normal',
    title: 'Audit Complete: North Wing',
    time: '1 hour ago',
    desc: '482 assets verified. 0 discrepancies found.',
    color: '#248AFF',
    location: 'North Wing',
    asset: 'Multiple',
  },
  {
    id: 4,
    type: 'warning',
    title: 'Asset Delayed: Batch-099',
    time: '3 hours ago',
    desc: 'Transit time from A to B exceeded threshold by 12 minutes.',
    color: '#F59E0B',
    location: 'Transit Path 02',
    asset: 'Batch-099',
  },
];

export const AlertsPanel = () => {
  const [selectedAlert, setSelectedAlert] = useState<typeof alerts[0] | null>(null);

  return (
    <div className="h-full flex gap-6">
      <div className="bg-white p-6 rounded-[16px] border border-gray-100 flex-1 flex flex-col shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-bold text-[#395A8F] text-lg">System Alerts</h3>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Real-time status</p>
          </div>
          <button className="text-[#248AFF] text-sm font-bold hover:underline px-2 py-1">View History</button>
        </div>

        <div className="space-y-3 flex-1 overflow-y-auto pr-1">
          {alerts.map((alert) => (
            <motion.div
              key={alert.id}
              whileHover={{ x: 4, backgroundColor: 'rgb(249 250 251)' }}
              onClick={() => setSelectedAlert(alert)}
              className={`group flex gap-4 p-4 rounded-xl border border-gray-50 cursor-pointer transition-all ${
                selectedAlert?.id === alert.id ? 'bg-gray-50 border-[#248AFF]/20' : 'bg-white'
              }`}
            >
              <div className="mt-0.5">
                {alert.type === 'critical' && <AlertCircle className="w-5 h-5 text-rose-500" />}
                {alert.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-500" />}
                {alert.type === 'normal' && <CheckCircle2 className="w-5 h-5 text-blue-500" />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="text-sm font-bold text-[#395A8F]">{alert.title}</h4>
                  <span className="text-[10px] font-bold text-gray-400">{alert.time}</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-1">{alert.desc}</p>
              </div>
              <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedAlert && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="bg-white border border-gray-100 rounded-[16px] overflow-hidden shadow-xl"
          >
            <div className="p-6 h-full flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${selectedAlert.color}15` }}
                >
                  <AlertCircle className="w-6 h-6" style={{ color: selectedAlert.color }} />
                </div>
                <button
                  onClick={() => setSelectedAlert(null)}
                  className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <h3 className="font-bold text-[#395A8F] text-lg mb-2">{selectedAlert.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-8">{selectedAlert.desc}</p>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Timestamp</p>
                    <p className="text-sm font-bold text-[#395A8F]">Today, {selectedAlert.time}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Location</p>
                    <p className="text-sm font-bold text-[#395A8F]">{selectedAlert.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                    <Tag className="w-4 h-4 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Asset ID</p>
                    <p className="text-sm font-bold text-[#395A8F]">{selectedAlert.asset}</p>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-gray-100 flex gap-3">
                <button className="flex-1 py-3 rounded-xl bg-[#248AFF] text-white font-bold text-xs hover:bg-[#1c7ae6] transition-colors">
                  Acknowledge
                </button>
                <button className="flex-1 py-3 rounded-xl border border-gray-100 text-[#395A8F] font-bold text-xs hover:bg-gray-50 transition-colors">
                  Investigate
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};