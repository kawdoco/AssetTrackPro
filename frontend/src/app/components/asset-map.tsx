import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, ZoomIn, ZoomOut, Maximize, MousePointer2, Info } from 'lucide-react';

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
    <div className="bg-white p-6 rounded-[16px] border border-gray-100 shadow-sm h-full flex flex-col relative overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-bold text-[#395A8F] text-lg">Zone Activity</h3>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Interactive Live Tracking</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
          <button onClick={() => setZoom(Math.min(2, zoom + 0.2))} className="p-1.5 hover:bg-white rounded-lg transition-all text-gray-500 hover:text-[#248AFF]">
            <ZoomIn className="w-4 h-4" />
          </button>
          <button onClick={() => setZoom(Math.max(0.5, zoom - 0.2))} className="p-1.5 hover:bg-white rounded-lg transition-all text-gray-500 hover:text-[#248AFF]">
            <ZoomOut className="w-4 h-4" />
          </button>
          <div className="w-[1px] h-4 bg-gray-200 mx-1"></div>
          <button className="p-1.5 hover:bg-white rounded-lg transition-all text-gray-500">
            <Maximize className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 relative bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden cursor-crosshair">
        <motion.div
          animate={{ scale: zoom }}
          className="w-full h-full relative origin-center"
        >
          {/* Map Grid */}
          <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-30 pointer-events-none">
            {Array.from({ length: 144 }).map((_, i) => (
              <div key={i} className="border-[0.5px] border-gray-300"></div>
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
              <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-gray-100 shadow-sm transition-transform group-hover:scale-110">
                <span className="text-[10px] font-black text-[#395A8F] uppercase tracking-widest">{zone.name}</span>
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
              className="absolute bottom-6 left-6 bg-white p-4 rounded-2xl border border-gray-100 shadow-xl z-20 pointer-events-none"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-2 h-2 rounded-full ${hoveredAsset.status === 'warning' ? 'bg-amber-500' : 'bg-[#248AFF]'}`}></div>
                <span className="text-sm font-bold text-[#395A8F]">{hoveredAsset.tag}</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase">
                  <MapPin className="w-3 h-3" />
                  <span>Moving to Sector 4</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase">
                  <MousePointer2 className="w-3 h-3" />
                  <span>Click to investigate</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#248AFF]"></div>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Asset Active</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-500"></div>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Maintenance</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-rose-500"></div>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Restricted Zone</span>
        </div>
      </div>
    </div>
  );
};
