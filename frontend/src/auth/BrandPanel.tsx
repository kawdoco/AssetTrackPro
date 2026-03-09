import React from "react";
import { Truck, MapPin, ShieldCheck } from "lucide-react";
import forklift from "../assets/forklift.jpg";
import logo from "../assets/logo.png";

interface FeatureIconProps {
  icon: React.ReactNode;
  label: string;
  sublabel: string;
}

const FeatureIcon: React.FC<FeatureIconProps> = ({ icon, label, sublabel }) => (
  <div className="flex flex-col items-center gap-2">
    <div className="w-11 h-11 flex items-center justify-center bg-white/15 rounded-xl">
      {icon}
    </div>
    <div className="text-center">
      <div className="text-white text-xs font-bold leading-tight">{label}</div>
      <div className="text-white/50 text-[10px]">{sublabel}</div>
    </div>
  </div>
);

export const BrandPanel: React.FC = () => {
  return (
    <div className="w-[745px] h-full p-5 pl-5">
      <div className="relative w-full h-full overflow-hidden rounded-2xl">
        {/* Background image */}
        <img
          src={forklift}
          alt="Forklift / Warehouse"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Softer blue overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/70 via-blue-600/65 to-blue-900/80" />

        {/* Dot-grid texture */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative z-10 flex flex-col h-full p-10">

          {/* TOP — Logo */}
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="TrackPro"
              className="w-10 h-10 rounded-xl object-contain shrink-0"
            />
            <div className="leading-none">
              <div className="font-extrabold tracking-tight text-2xl">
                <span className="text-white">Track</span>
                <span className="text-blue-600">Pro</span>
              </div>
              <div className="text-[10px] font-semibold tracking-wider uppercase text-white/50 mt-1">
                Asset Intelligence Console
              </div>
            </div>
          </div>

          {/* MIDDLE — Headline centered */}
          <div className="flex-1 flex items-center">
            <h1 className="font-black leading-[1.15]">
              <span className="block text-white text-5xl">Visibility,</span>
              <span className="block text-white text-5xl">Efficiency,</span>
              <span
                className="block text-5xl"
                style={{
                  WebkitTextStroke: "2px rgba(255,255,255,0.65)",
                  color: "transparent",
                }}
              >
                Sustainability
              </span>
            </h1>
          </div>

          {/* BOTTOM — Divider + icons */}
          <div>
            <div className="w-full h-px bg-white/15 mb-6" />
            <div className="flex justify-between px-2">
              <FeatureIcon
                icon={<Truck className="w-5 h-5 text-white" />}
                label="Fleet Tracking"
                sublabel="Live GPS"
              />
              <FeatureIcon
                icon={<MapPin className="w-5 h-5 text-white" />}
                label="Route Optimizer"
                sublabel="AI paths"
              />
              <FeatureIcon
                icon={<ShieldCheck className="w-5 h-5 text-white" />}
                label="Secure Access"
                sublabel="Role-based"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};