import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, ZoomIn, ZoomOut, Maximize, MousePointer2 } from '@/icons/lucideMuiAdapter';

const zones = [
  { id: 'A', name: 'Warehouse A', x: 15, y: 20, w: 35, h: 45, color: '#248AFF' },
  { id: 'B', name: 'Shipping Bay', x: 60, y: 15, w: 25, h: 30, color: '#395A8F' },
  { id: 'C', name: 'Restricted C', x: 55, y: 60, w: 35, h: 25, color: '#F43F5E' },
];

export const AssetMap = () => {
  const [zoom, setZoom] = useState(1);
  const [dots, setDots] = useState<{ id: number; x: number; y: number; status: string; tag: string }[]>([]);
  const [hoveredAsset, setHoveredAsset] = useState<any>(null);

  useEffect(() => {
    const initialDots = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80,
      status: Math.random() > 0.8 ? 'warning' : 'active',
      tag: `RF-${1000 + i}`
    }));
    setDots(initialDots);

    const interval = setInterval(() => {
      setDots(prev => prev.map(dot => ({
        ...dot,
        x: Math.max(5, Math.min(95, dot.x + (Math.random() - 0.5) * 1.5)),
        y: Math.max(5, Math.min(95, dot.y + (Math.random() - 0.5) * 1.5)),
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[var(--surface-0)] p-4 rounded-lg border border-[var(--surface-border)] shadow-sm h-full flex flex-col relative overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="font-semibold text-[var(--text-primary)] text-base">Zone Activity</h3>
          <p className="text-[11px] text-[var(--text-muted)] font-semibold uppercase tracking-wide">Interactive Live Tracking</p>
        </div>
        <div className="flex items-center gap-2 bg-[var(--surface-1)] p-1.5 rounded-md border border-[var(--surface-border)]">
          <button title="Zoom in" aria-label="Zoom in" onClick={() => setZoom(Math.min(2, zoom + 0.2))} className="p-1.5 hover:bg-[var(--surface-0)] rounded-md transition-all text-[var(--text-secondary)] hover:text-[var(--brand-600)]">
            <ZoomIn className="w-4 h-4" />
          </button>
          <button title="Zoom out" aria-label="Zoom out" onClick={() => setZoom(Math.max(0.5, zoom - 0.2))} className="p-1.5 hover:bg-[var(--surface-0)] rounded-md transition-all text-[var(--text-secondary)] hover:text-[var(--brand-600)]">
            <ZoomOut className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-[var(--surface-border)] mx-1"></div>
          <button title="Fullscreen" aria-label="Fullscreen" className="p-1.5 hover:bg-[var(--surface-0)] rounded-md transition-all text-[var(--text-secondary)]">
            <Maximize className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 relative bg-[var(--surface-1)] rounded-lg border border-[var(--surface-border)] overflow-hidden cursor-crosshair">
        <motion.div
          animate={{ scale: zoom }}
          className="w-full h-full relative origin-center"
        >
          {/* Map Grid */}
          <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-30 pointer-events-none">
            {Array.from({ length: 144 }).map((_, i) => (
              <div key={i} className="border-[0.5px] border-[var(--surface-border)]"></div>
            ))}
          </div>

          {/* Zones */}
          {zones.map(zone => (
            <motion.div
              key={zone.id}
              className="absolute rounded-2xl border-2 cursor-pointer transition-all hover:bg-opacity-20 flex flex-col items-center justify-center group"
              style={{
                left: `${zone.x}%`,
                top: `${zone.y}%`,
                width: `${zone.w}%`,
                height: `${zone.h}%`,
                backgroundColor: `${zone.color}10`,
                borderColor: `${zone.color}30`,
              }}
            >
              <div className="bg-[var(--surface-0)]/90 backdrop-blur-sm px-3 py-1.5 rounded-md border border-[var(--surface-border)] shadow-sm transition-transform group-hover:scale-105">
                <span className="text-[10px] font-semibold text-[var(--text-primary)] uppercase tracking-widest">{zone.name}</span>
              </div>
            </motion.div>
          ))}

          {/* Moving Assets */}
          {dots.map(dot => (
            <motion.div
              key={dot.id}
              initial={false}
              animate={{ left: `${dot.x}%`, top: `${dot.y}%` }}
              transition={{ duration: 3, ease: "linear" }}
              onMouseEnter={() => setHoveredAsset(dot)}
              onMouseLeave={() => setHoveredAsset(null)}
              className={`absolute w-3 h-3 rounded-full cursor-pointer z-10 transition-all ${
                dot.status === 'warning' ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.6)]' : 'bg-[#248AFF] shadow-[0_0_10px_rgba(36,138,255,0.6)]'
              }`}
            >
              <div className={`absolute -inset-1 bg-current rounded-full opacity-20 animate-ping`}></div>
            </motion.div>
          ))}
        </motion.div>

        {/* Hover Tooltip */}
        <AnimatePresence>
          {hoveredAsset && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-4 left-4 bg-[var(--surface-0)] p-3 rounded-md border border-[var(--surface-border)] shadow-lg z-20 pointer-events-none"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-2 h-2 rounded-full ${hoveredAsset.status === 'warning' ? 'bg-amber-500' : 'bg-[#248AFF]'}`}></div>
                <span className="text-sm font-semibold text-[var(--text-primary)]">{hoveredAsset.tag}</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[10px] font-semibold text-[var(--text-muted)] uppercase">
                  <MapPin className="w-3 h-3" />
                  <span>Moving to Sector 4</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-semibold text-[var(--text-muted)] uppercase">
                  <MousePointer2 className="w-3 h-3" />
                  <span>Click to investigate</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-3 flex items-center gap-5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#248AFF]"></div>
          <span className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">Asset Active</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-500"></div>
          <span className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">Maintenance</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-rose-500"></div>
          <span className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">Restricted Zone</span>
        </div>
      </div>
    </div>
  );
};


