import React, { useState } from "react";
import { ChevronDown, EyeOff } from "lucide-react";

type Role = "admin" | "manager" | "operator" | "viewer" | "";

interface AuthPanelProps {
  onLogin: () => void;
}

export const AuthPanel: React.FC<AuthPanelProps> = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("");

  return (
    <div className="w-full h-full bg-white flex flex-col justify-center px-16 lg:px-24">
      <div className="max-w-md w-full mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-[#395A8F] mb-2">System Login</h2>
          <p className="text-slate-500">Enter your credentials to access the tracking terminal.</p>
        </div>

        {/* Form */}
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            // ✅ For now: go to dashboard on click (no validation)
            onLogin();
          }}
        >
          {/* Username/Email */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 block">Username or Email</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="E.g. admin@tracksync.com"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50 placeholder:text-slate-400"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-slate-700 block">Password</label>
              <button
                type="button"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                Forgot password?
              </button>
            </div>

            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50 placeholder:text-slate-400"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                <EyeOff className="w-5 h-5 cursor-pointer" />
              </div>
            </div>
          </div>

          {/* Access Role */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 block">Access Role</label>
            <div className="relative">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50 appearance-none text-slate-700 cursor-pointer"
              >
                <option value="admin">System Administrator</option>
                <option value="manager">Logistics Manager</option>
                <option value="operator">Terminal Operator</option>
                <option value="viewer">Guest Viewer</option>
              </select>

              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <ChevronDown className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Primary CTA */}
          <button
            type="submit"
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
          >
            Login to Console
          </button>
        </form>
      </div>
    </div>
  );
};