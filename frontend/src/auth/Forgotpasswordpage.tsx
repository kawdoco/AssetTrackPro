import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, ArrowLeft } from 'lucide-react';

// ─── Props ────────────────────────────────────────────────────────────────────

interface ForgotPasswordPageProps {
  accent: string;
  onBack: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ForgotPasswordPage({ accent, onBack }: ForgotPasswordPageProps) {
  const [resetEmail, setResetEmail] = useState('');
  const [isLoading, setIsLoading]   = useState(false);
  const [resetSent, setResetSent]   = useState(false);

  // Light mode tokens
  const cardBg      = '#FFFFFF';
  const cardBorder  = '#E2E8F0';
  const textPrim    = '#0F172A';
  const textSec     = '#64748B';
  const inputBg     = '#F8FAFC';
  const inputBorder = '#E2E8F0';

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => { setIsLoading(false); setResetSent(true); }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
      className="w-full max-w-[550px]"
    >
      <div
        className="rounded-[20px] border p-8"
        style={{ background: cardBg, borderColor: cardBorder, boxShadow: '0 4px 24px rgba(15,23,42,0.06)' }}
      >
        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold mb-6 hover:opacity-70 transition-opacity"
          style={{ color: textSec }}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to sign in
        </button>

        <AnimatePresence mode="wait">

          {/* ── Form state ──────────────────────────────────────────────── */}
          {!resetSent ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="mb-7">
                <h2 className="text-2xl font-bold tracking-tight mb-1" style={{ color: textPrim }}>
                  Reset your password
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
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl text-white font-bold text-sm
                             active:scale-[0.98] transition-all disabled:opacity-70
                             disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ backgroundColor: accent }}
                >
                  {isLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending…
                    </>
                  ) : 'Send Reset Link'}
                </button>
              </form>
            </motion.div>

          ) : (

            /* ── Success state ────────────────────────────────────────── */
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
                onClick={onBack}
                className="mt-8 w-full py-3 rounded-xl text-white font-bold text-sm transition-all active:scale-[0.98]"
                style={{ backgroundColor: accent }}
              >
                Back to Sign In
              </button>
            </motion.div>
          )}

        </AnimatePresence>

        {/* Footer */}
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
      </div>
    </motion.div>
  );
}