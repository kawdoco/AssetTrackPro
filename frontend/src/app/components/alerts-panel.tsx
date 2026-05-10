import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, CheckCircle2, AlertTriangle, ChevronRight, X, Clock, MapPin, Tag } from '@/icons/lucideMuiAdapter';

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

const alertAccentClassMap = {
  critical: {
    container: 'bg-rose-500/15',
    icon: 'text-rose-500',
  },
  warning: {
    container: 'bg-amber-500/15',
    icon: 'text-amber-500',
  },
  normal: {
    container: 'bg-blue-500/15',
    icon: 'text-blue-500',
  },
} as const;

export const AlertsPanel = () => {
  const [selectedAlert, setSelectedAlert] = useState<typeof alerts[0] | null>(null);

  return (
    <div className="h-full flex gap-4">
      <div className="bg-[var(--surface-0)] p-4 rounded-lg border border-[var(--surface-border)] flex-1 flex flex-col shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-semibold text-[var(--text-primary)] text-base">System Alerts</h3>
            <p className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide font-semibold">Real-time status</p>
          </div>
          <button className="text-[var(--brand-600)] text-sm font-semibold hover:underline px-2 py-1">View History</button>
        </div>

        <div className="space-y-3 flex-1 overflow-y-auto pr-1">
          {alerts.map((alert) => (
            <motion.div
              key={alert.id}
              whileHover={{ x: 2, backgroundColor: 'var(--surface-2)' }}
              onClick={() => setSelectedAlert(alert)}
              className={`group flex gap-4 p-3 rounded-md border border-[var(--surface-border)] cursor-pointer transition-all ${
                selectedAlert?.id === alert.id ? 'bg-[var(--brand-200)]/30 border-[var(--brand-300)]' : 'bg-[var(--surface-0)]'
              }`}
            >
              <div className="mt-0.5">
                {alert.type === 'critical' && <AlertCircle className="w-5 h-5 text-rose-500" />}
                {alert.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-500" />}
                {alert.type === 'normal' && <CheckCircle2 className="w-5 h-5 text-blue-500" />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="text-sm font-semibold text-[var(--text-primary)]">{alert.title}</h4>
                  <span className="text-[10px] font-semibold text-[var(--text-muted)]">{alert.time}</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-1">{alert.desc}</p>
              </div>
              <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
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
            className="bg-[var(--surface-0)] border border-[var(--surface-border)] rounded-lg overflow-hidden shadow-lg"
          >
            <div className="p-4 h-full flex flex-col">
              {/** Use semantic classes instead of inline style for lint compliance */}
              {(() => {
                const accent = alertAccentClassMap[selectedAlert.type];

                return (
                  <>
              <div className="flex justify-between items-start mb-4">
                <div
                  className={`w-10 h-10 rounded-md flex items-center justify-center border border-[var(--surface-border)] ${accent.container}`}
                >
                  <AlertCircle className={`w-6 h-6 ${accent.icon}`} />
                </div>
                <button
                  onClick={() => setSelectedAlert(null)}
                  title="Close details"
                  aria-label="Close details"
                  className="p-1.5 hover:bg-[var(--surface-2)] rounded-full text-[var(--text-muted)] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <h3 className="font-semibold text-[var(--text-primary)] text-base mb-2">{selectedAlert.title}</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">{selectedAlert.desc}</p>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-md bg-[var(--surface-1)] border border-[var(--surface-border)] flex items-center justify-center">
                    <Clock className="w-4 h-4 text-[var(--text-muted)]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wide">Timestamp</p>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">Today, {selectedAlert.time}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-md bg-[var(--surface-1)] border border-[var(--surface-border)] flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-[var(--text-muted)]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wide">Location</p>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{selectedAlert.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-md bg-[var(--surface-1)] border border-[var(--surface-border)] flex items-center justify-center">
                    <Tag className="w-4 h-4 text-[var(--text-muted)]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wide">Asset ID</p>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{selectedAlert.asset}</p>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-[var(--surface-border)] flex gap-3">
                <button className="flex-1 py-2.5 rounded-md bg-[var(--brand-600)] text-white font-semibold text-xs hover:bg-[var(--brand-700)] transition-colors">
                  Acknowledge
                </button>
                <button className="flex-1 py-2.5 rounded-md border border-[var(--surface-border)] text-[var(--text-primary)] font-semibold text-xs hover:bg-[var(--surface-2)] transition-colors">
                  Investigate
                </button>
              </div>
                  </>
                );
              })()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

