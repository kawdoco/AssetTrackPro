import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mail, Lock, Eye, EyeOff, Shield, ChevronRight,
  ArrowLeft, ShieldCheck, Building2, UserCog,
} from 'lucide-react';
import logo from '../assets/logo.png';
import rfidBg from '../assets/Supply.jpg';
import ForgotPasswordPage from './Forgotpasswordpage';

// ─── Types ────────────────────────────────────────────────────────────────────

type Role = 'super_admin' | 'org_admin' | 'security_officer';

interface RoleConfig {
  label: string;
  description: string;
  icon: React.ReactNode;
  accent: string;
  accentDark: string;
  badge: string;
}

// ─── Role config ──────────────────────────────────────────────────────────────

const ROLES: Record<Role, RoleConfig> = {
  super_admin: {
    label: 'Super Admin',
    description: 'Full system access & configuration',
    icon: <ShieldCheck className="w-5 h-5" />,
    accent: '#2563EB',
    accentDark: '#1D4ED8',
    badge: 'bg-blue-100 text-blue-700',
  },
  org_admin: {
    label: 'Org Admin',
    description: 'Organisation-level management',
    icon: <Building2 className="w-5 h-5" />,
    accent: '#0891B2',
    accentDark: '#0E7490',
    badge: 'bg-cyan-100 text-cyan-700',
  },
  security_officer: {
    label: 'Security Officer',
    description: 'Monitoring, alerts & zone control',
    icon: <UserCog className="w-5 h-5" />,
    accent: '#7C3AED',
    accentDark: '#6D28D9',
    badge: 'bg-violet-100 text-violet-700',
  },
};

const stats = [
  { trend: '↑ +12.5%', trendUp: true,  value: '14,292', label: 'Active Assets' },
  { trend: '↓ -3.2%',  trendUp: false, value: '842',    label: 'In Transit'    },
  { trend: '~ Stable', trendUp: true,  value: '99.9%',  label: 'Sync Status'   },
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface LoginPageProps {
  onLogin: () => void;
}

// ─── Left Panel — extracted so it never unmounts ──────────────────────────────

function LeftPanel({ accent }: { accent: string }) {
  return (
    <div
      className="relative flex items-center justify-center overflow-hidden h-screen"
      style={{
        backgroundImage: `url(${rfidBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        width: '690px', minWidth: '690px',
      }}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(145deg, rgba(0,0,0,0.40) 0%, rgba(0,0,0,0.30) 50%, ${accent}99 100%)`,
          transition: 'background 0.4s ease',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center text-white px-12">

        {/* Logo pill */}
        <div
          className="flex items-center gap-3 px-5 py-3 rounded-xl mb-8"
          style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)' }}
        >
          <img src={logo} alt="TrackPro" className="w-7 h-7 object-contain" />
          <span className="text-xl font-bold tracking-tight">TrackPro</span>
        </div>

        <h1 className="text-4xl font-bold leading-tight tracking-tight mb-4">
          Real-Time Asset<br />Intelligence Platform
        </h1>
        <p className="text-base leading-relaxed mb-8 opacity-80">
          Monitor, manage, and mobilize your entire fleet<br />
          from a single operational command center.
        </p>

        {/* Stat cards */}
        <div className="flex gap-3 mb-8 flex-wrap justify-center">
          {stats.map((s, i) => (
            <div
              key={i}
              className="flex flex-col items-start px-5 py-4 rounded-2xl min-w-[110px]"
              style={{
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.2)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <span
                className="text-[11px] font-semibold mb-1 font-mono"
                style={{ color: s.trendUp ? '#86EFAC' : '#FCA5A5' }}
              >
                {s.trend}
              </span>
              <span className="text-2xl font-bold tracking-tight leading-none">{s.value}</span>
              <span className="text-[11px] mt-1 opacity-75">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Status pill */}
        <div
          className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium"
          style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}
        >
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          All Systems Operational
        </div>
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [step, setStep]                 = useState<'role' | 'login' | 'forgot'>('role');
  const [role, setRole]                 = useState<Role | null>(null);
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe]     = useState(false);
  const [isLoading, setIsLoading]       = useState(false);
  const [resetEmail, setResetEmail]     = useState('');
  const [resetSent, setResetSent]       = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const selectedRole = role ? ROLES[role] : null;
  const accent       = selectedRole?.accent ?? '#2563EB';
  const accentDark   = selectedRole?.accentDark ?? '#1D4ED8';

  // Light mode tokens
  const bg          = '#F8FAFC';
  const cardBg      = '#FFFFFF';
  const cardBorder  = '#E2E8F0';
  const textPrim    = '#0F172A';
  const textSec     = '#64748B';
  const inputBg     = '#F8FAFC';
  const inputBorder = '#E2E8F0';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => { setIsLoading(false); onLogin(); }, 1200);
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    setTimeout(() => { setResetLoading(false); setResetSent(true); }, 1000);
  };

  return (
    <div className="flex h-screen overflow-hidden font-sans" style={{ backgroundColor: bg }}>

      {/* ── Left Panel — always mounted, never re-renders ─────────────────── */}
      <LeftPanel accent={accent} />

      {/* ── Right Panel ───────────────────────────────────────────────────── */}
      <div
        className="flex flex-1 flex-col items-center justify-center px-10 py-8 overflow-y-auto"
        style={{ backgroundColor: bg }}
      >
        <div className="w-full max-w-[550px]">
          <AnimatePresence mode="wait">

            {/* ── STEP 1: Role Selection ──────────────────────────────────── */}
            {step === 'role' && (
              <motion.div
                key="role"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <div
                  className="rounded-[20px] border p-8"
                  style={{ background: cardBg, borderColor: cardBorder, boxShadow: '0 4px 24px rgba(15,23,42,0.06)' }}
                >
                  <div className="mb-7">
                    <h2 className="text-2xl font-bold tracking-tight mb-1" style={{ color: textPrim }}>
                      Select your role
                    </h2>
                    <p className="text-sm" style={{ color: textSec }}>
                      Choose how you're accessing TrackPro
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    {(Object.entries(ROLES) as [Role, RoleConfig][]).map(([key, cfg]) => (
                      <button
                        key={key}
                        onClick={() => { setRole(key); setStep('login'); }}
                        className="flex items-center gap-4 px-5 py-4 rounded-xl border text-left
                                   hover:scale-[1.01] active:scale-[0.99] transition-all group"
                        style={{ background: inputBg, borderColor: inputBorder }}
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${cfg.accent}18`, color: cfg.accent }}
                        >
                          {cfg.icon}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-bold" style={{ color: textPrim }}>{cfg.label}</div>
                          <div className="text-xs mt-0.5" style={{ color: textSec }}>{cfg.description}</div>
                        </div>
                        <ChevronRight
                          className="w-4 h-4 opacity-30 group-hover:opacity-70 transition-opacity"
                          style={{ color: textSec }}
                        />
                      </button>
                    ))}
                  </div>

                  <Footer textSec={textSec} />
                </div>
              </motion.div>
            )}

            {/* ── STEP 2: Login Form ──────────────────────────────────────── */}
            {step === 'login' && selectedRole && (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <div
                  className="rounded-[20px] border p-8"
                  style={{ background: cardBg, borderColor: cardBorder, boxShadow: '0 4px 24px rgba(15,23,42,0.06)' }}
                >
                  {/* Back + role badge */}
                  <div className="flex items-center justify-between mb-6">
                    <button
                      onClick={() => setStep('role')}
                      className="flex items-center gap-1.5 text-xs font-semibold hover:opacity-70 transition-opacity"
                      style={{ color: textSec }}
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      Back
                    </button>
                    <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${selectedRole.badge}`}>
                      {selectedRole.icon}
                      {selectedRole.label}
                    </span>
                  </div>

                  <div className="mb-7">
                    <h2 className="text-2xl font-bold tracking-tight mb-1" style={{ color: textPrim }}>
                      Welcome back
                    </h2>
                    <p className="text-sm" style={{ color: textSec }}>
                      Sign in to your {selectedRole.label} account
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                    {/* Email */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[13px] font-semibold" style={{ color: '#374151' }}>
                        Email address
                      </label>
                      <div
                        className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all focus-within:ring-2"
                        style={{
                          background: inputBg,
                          borderColor: inputBorder,
                          // @ts-ignore
                          '--tw-ring-color': `${accent}20`,
                        }}
                      >
                        <Mail className="w-4 h-4 shrink-0" style={{ color: textSec }} />
                        <input
                          type="email"
                          placeholder="you@company.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="flex-1 text-sm bg-transparent outline-none placeholder:text-gray-400"
                          style={{ color: textPrim }}
                          required
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[13px] font-semibold" style={{ color: '#374151' }}>
                        Password
                      </label>
                      <div
                        className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all focus-within:ring-2"
                        style={{ background: inputBg, borderColor: inputBorder }}
                      >
                        <Lock className="w-4 h-4 shrink-0" style={{ color: textSec }} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="flex-1 text-sm bg-transparent outline-none placeholder:text-gray-400"
                          style={{ color: textPrim }}
                          required
                        />
                        <button
                          type="button"
                          tabIndex={-1}
                          onClick={() => setShowPassword(!showPassword)}
                          className="hover:opacity-70 transition-opacity"
                          style={{ color: textSec }}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Remember me + Forgot */}
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-4 h-4 cursor-pointer"
                          style={{ accentColor: accent }}
                        />
                        <span className="text-[13px]" style={{ color: textSec }}>Remember me</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => { setStep('forgot'); setResetSent(false); setResetEmail(''); }}
                        className="text-[13px] font-semibold hover:underline"
                        style={{ color: accent }}
                      >
                        Forgot password?
                      </button>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 rounded-xl text-white font-bold text-sm mt-1
                                 active:scale-[0.98] transition-all disabled:opacity-70
                                 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      style={{ backgroundColor: isLoading ? accentDark : accent }}
                    >
                      {isLoading ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Signing in…
                        </>
                      ) : (
                        <>
                          Sign In
                          <ChevronRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Security note */}
                  <div className="flex items-center justify-center gap-1.5 mt-6 text-[12px]" style={{ color: textSec }}>
                    <Shield className="w-3.5 h-3.5" />
                    Secured with 256-bit TLS encryption
                  </div>

                  <Footer textSec={textSec} />
                </div>
              </motion.div>
            )}

            {/* ── STEP 3: Forgot Password ─────────────────────────────────── */}
            {step === 'forgot' && (
              <motion.div
                key="forgot"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <div
                  className="rounded-[20px] border p-8"
                  style={{ background: cardBg, borderColor: cardBorder, boxShadow: '0 4px 24px rgba(15,23,42,0.06)' }}
                >
                  <button
                    onClick={() => setStep('login')}
                    className="flex items-center gap-1.5 text-xs font-semibold mb-6 hover:opacity-70 transition-opacity"
                    style={{ color: textSec }}
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back to sign in
                  </button>

                  <AnimatePresence mode="wait">
                    {!resetSent ? (
                      <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <div className="mb-7">
                          <h2 className="text-2xl font-bold tracking-tight mb-1" style={{ color: textPrim }}>
                            Reset password
                          </h2>
                          <p className="text-sm" style={{ color: textSec }}>
                            Enter your email and we'll send a reset link.
                          </p>
                        </div>

                        <form onSubmit={handleReset} className="flex flex-col gap-5">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[13px] font-semibold" style={{ color: '#374151' }}>
                              Email address
                            </label>
                            <div
                              className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all"
                              style={{ background: inputBg, borderColor: inputBorder }}
                            >
                              <Mail className="w-4 h-4 shrink-0" style={{ color: textSec }} />
                              <input
                                type="email"
                                placeholder="you@company.com"
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                                className="flex-1 text-sm bg-transparent outline-none placeholder:text-gray-400"
                                style={{ color: textPrim }}
                                required
                              />
                            </div>
                          </div>

                          <button
                            type="submit"
                            disabled={resetLoading}
                            className="w-full py-3 rounded-xl text-white font-bold text-sm
                                       active:scale-[0.98] transition-all disabled:opacity-70
                                       disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            style={{ backgroundColor: accent }}
                          >
                            {resetLoading ? (
                              <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Sending…
                              </>
                            ) : 'Send Reset Link'}
                          </button>
                        </form>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="sent"
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center text-center py-6"
                      >
                        <div
                          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                          style={{ backgroundColor: `${accent}18` }}
                        >
                          <Mail className="w-7 h-7" style={{ color: accent }} />
                        </div>
                        <h3 className="text-lg font-bold mb-2" style={{ color: textPrim }}>Check your inbox</h3>
                        <p className="text-sm leading-relaxed" style={{ color: textSec }}>
                          A password reset link has been sent to<br />
                          <span className="font-semibold" style={{ color: textPrim }}>{resetEmail}</span>
                        </p>
                        <button
                          onClick={() => setStep('login')}
                          className="mt-8 w-full py-3 rounded-xl text-white font-bold text-sm transition-all active:scale-[0.98]"
                          style={{ backgroundColor: accent }}
                        >
                          Back to Sign In
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Footer textSec={textSec} />
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer({ textSec }: { textSec: string }) {
  return (
    <div
      className="flex items-center justify-center gap-2 mt-6 pt-5 border-t text-[12px]"
      style={{ color: textSec, borderColor: '#E2E8F0' }}
    >
      <span>© 2026 TrackPro · Fleet Intelligence</span>
      <span>·</span>
      <a href="#" className="font-medium hover:underline" style={{ color: textSec }}>Privacy</a>
      <span>·</span>
      <a href="#" className="font-medium hover:underline" style={{ color: textSec }}>Terms</a>
    </div>
  );
}