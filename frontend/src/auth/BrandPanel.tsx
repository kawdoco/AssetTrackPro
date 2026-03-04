import React from "react";
import { Package, Move, ShieldCheck } from "lucide-react";
import forklift from "../assets/forklift.jpg";
import logo from "../assets/logo.png";

interface FeatureIconProps {
  icon: React.ReactNode;
  label: React.ReactNode;
}

const FeatureIcon: React.FC<FeatureIconProps> = ({ icon, label }) => (
  <div className="flex flex-col items-start">
    <div className="w-14 h-14 flex items-center justify-center bg-white/10 rounded-xl backdrop-blur-sm">
      {icon}
    </div>
    <span className="mt-3 text-xs font-medium tracking-wide uppercase leading-tight text-white/90">
      {label}
    </span>
  </div>
);

export const BrandPanel: React.FC = () => {
  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col p-12">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={forklift}
          alt="Forklift / Warehouse"
          className="w-full h-full object-cover blur-[2px] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-slate-900/80 to-transparent" />
      </div>

      {/* ONE aligned block: Logo + Headline + Icons */}
      <div className="relative z-10 max-w-lg px-2 mt-auto mb-16">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <img
            src={logo}
            alt="TrackPro"
            className="w-12 h-12 rounded-xl object-contain shrink-0"
          />
          <div className="leading-none">
            <div className="font-extrabold tracking-tight text-2xl">
              <span className="text-white">Track</span>
              <span className="text-blue-500">Pro</span>
            </div>
            <div className="text-xs font-semibold tracking-wider uppercase text-white/60 mt-1">
              Asset Intelligence Console
            </div>
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-6xl font-extrabold text-white leading-[1.1] mb-6">
          Precision Asset <br />
          <span className="text-blue-500">Intelligence</span>
        </h1>

        <p className="text-white/80 text-lg leading-relaxed mb-10">
          Enterprise-grade RFID tracking for real-time movement monitoring and
          inventory optimization across your global supply chain.
        </p>

        {/* Feature Icons (aligned with same block) */}
        <div className="grid grid-cols-3 gap-12">
          <FeatureIcon icon={<Package className="w-6 h-6 text-white" />} label={<>Asset <br />Tracking</>} />
          <FeatureIcon icon={<Move className="w-6 h-6 text-white" />} label={<>Movement <br />Flow</>} />
          <FeatureIcon icon={<ShieldCheck className="w-6 h-6 text-white" />} label={<>Security <br />Protocols</>} />
        </div>
      </div>
    </div>
  );
};