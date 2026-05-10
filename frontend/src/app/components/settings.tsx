import { useState, type ReactNode } from "react";
import {
  User,
  Lock,
  Bell,
  Building2,
  Save,
  Laptop,
  Activity,
  Globe,
  GripVerticalIcon,
  Maximize,
} from "@/icons/lucideMuiAdapter";
import type { DensityMode, ThemeMode } from "../../hooks/useUiTheme";

interface SettingsProps {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  densityMode: DensityMode;
  setDensityMode: (mode: DensityMode) => void;
  resolvedTheme: "light" | "dark";
}

const cardClass =
  "bg-[var(--surface-0)] border border-[var(--surface-border)] rounded-lg p-4 space-y-4";

export default function Settings({
  themeMode,
  setThemeMode,
  densityMode,
  setDensityMode,
  resolvedTheme,
}: SettingsProps) {
  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@assettrackpro.local",
  });

  const [password, setPassword] = useState({
    current: "",
    next: "",
    confirm: "",
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    criticalOnly: true,
  });

  const [timezone, setTimezone] = useState("UTC");

  const handleSave = () => {
    alert("Settings saved successfully.");
  };

  return (
    <section className="max-w-[1320px] mx-auto space-y-4">
      <header className="flex items-center justify-between bg-[var(--surface-0)] border border-[var(--surface-border)] rounded-lg px-4 py-3">
        <div>
          <h2 className="text-base font-semibold text-[var(--text-primary)]">Settings</h2>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Configure user preferences, security, and interface behavior.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-3 py-2 bg-[var(--brand-600)] text-white rounded-md text-sm hover:bg-[var(--brand-700)] transition"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 space-y-4">
          <div className={cardClass}>
            <div className="flex items-center gap-2 mb-1">
              <User className="w-4 h-4 text-[var(--text-muted)]" />
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">User Profile</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="space-y-1">
                <span className="text-xs font-medium text-[var(--text-muted)]">Full name</span>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full border border-[var(--surface-border)] bg-[var(--surface-1)] rounded-md px-3 py-2 text-sm text-[var(--text-primary)]"
                />
              </label>

              <label className="space-y-1">
                <span className="text-xs font-medium text-[var(--text-muted)]">Email</span>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full border border-[var(--surface-border)] bg-[var(--surface-1)] rounded-md px-3 py-2 text-sm text-[var(--text-primary)]"
                />
              </label>
            </div>
          </div>

          <div className={cardClass}>
            <div className="flex items-center gap-2 mb-1">
              <Lock className="w-4 h-4 text-[var(--text-muted)]" />
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">Security</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <label className="space-y-1">
                <span className="text-xs font-medium text-[var(--text-muted)]">Current password</span>
                <input
                  type="password"
                  value={password.current}
                  onChange={(e) => setPassword({ ...password, current: e.target.value })}
                  className="w-full border border-[var(--surface-border)] bg-[var(--surface-1)] rounded-md px-3 py-2 text-sm text-[var(--text-primary)]"
                />
              </label>

              <label className="space-y-1">
                <span className="text-xs font-medium text-[var(--text-muted)]">New password</span>
                <input
                  type="password"
                  value={password.next}
                  onChange={(e) => setPassword({ ...password, next: e.target.value })}
                  className="w-full border border-[var(--surface-border)] bg-[var(--surface-1)] rounded-md px-3 py-2 text-sm text-[var(--text-primary)]"
                />
              </label>

              <label className="space-y-1">
                <span className="text-xs font-medium text-[var(--text-muted)]">Confirm password</span>
                <input
                  type="password"
                  value={password.confirm}
                  onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
                  className="w-full border border-[var(--surface-border)] bg-[var(--surface-1)] rounded-md px-3 py-2 text-sm text-[var(--text-primary)]"
                />
              </label>
            </div>
          </div>

          <div className={cardClass}>
            <div className="flex items-center gap-2 mb-1">
              <Bell className="w-4 h-4 text-[var(--text-muted)]" />
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">Notifications</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <ToggleRow
                label="Email alerts"
                checked={notifications.emailAlerts}
                onChange={(value) =>
                  setNotifications((prev) => ({ ...prev, emailAlerts: value }))
                }
              />
              <ToggleRow
                label="SMS alerts"
                checked={notifications.smsAlerts}
                onChange={(value) =>
                  setNotifications((prev) => ({ ...prev, smsAlerts: value }))
                }
              />
              <ToggleRow
                label="Critical only"
                checked={notifications.criticalOnly}
                onChange={(value) =>
                  setNotifications((prev) => ({ ...prev, criticalOnly: value }))
                }
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className={cardClass}>
            <div className="flex items-center gap-2 mb-1">
              <Globe className="w-4 h-4 text-[var(--text-muted)]" />
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">Theme Mode</h3>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <SegmentButton
                active={themeMode === "auto"}
                onClick={() => setThemeMode("auto")}
                label="Auto"
                icon={<Laptop className="w-4 h-4" />}
              />
              <SegmentButton
                active={themeMode === "light"}
                onClick={() => setThemeMode("light")}
                label="Light"
                icon={<Globe className="w-4 h-4" />}
              />
              <SegmentButton
                active={themeMode === "dark"}
                onClick={() => setThemeMode("dark")}
                label="Dark"
                icon={<Activity className="w-4 h-4" />}
              />
            </div>

            <p className="text-xs text-[var(--text-muted)]">
              Active theme: <span className="font-medium text-[var(--text-secondary)]">{resolvedTheme}</span>
            </p>
          </div>

          <div className={cardClass}>
            <div className="flex items-center gap-2 mb-1">
              <GripVerticalIcon className="w-4 h-4 text-[var(--text-muted)]" />
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">Density</h3>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <SegmentButton
                active={densityMode === "compact"}
                onClick={() => setDensityMode("compact")}
                label="Compact"
                icon={<GripVerticalIcon className="w-4 h-4" />}
              />
              <SegmentButton
                active={densityMode === "comfortable"}
                onClick={() => setDensityMode("comfortable")}
                label="Comfortable"
                icon={<Maximize className="w-4 h-4" />}
              />
            </div>
          </div>

          <div className={cardClass}>
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="w-4 h-4 text-[var(--text-muted)]" />
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">Organization</h3>
            </div>

            <label className="space-y-1 block">
              <span className="text-xs font-medium text-[var(--text-muted)]">Timezone</span>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full border border-[var(--surface-border)] bg-[var(--surface-1)] rounded-md px-3 py-2 text-sm text-[var(--text-primary)]"
              >
                <option value="UTC">UTC</option>
                <option value="GMT+1">GMT+1</option>
                <option value="GMT+8">GMT+8</option>
                <option value="GMT-5">GMT-5</option>
              </select>
            </label>
          </div>
        </div>
      </div>
    </section>
  );
}

interface SegmentButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: ReactNode;
}

function SegmentButton({ active, onClick, label, icon }: SegmentButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 rounded-md px-2 py-2 text-xs border transition ${
        active
          ? "bg-[var(--brand-600)] border-[var(--brand-600)] text-white"
          : "bg-[var(--surface-1)] border-[var(--surface-border)] text-[var(--text-secondary)] hover:border-[var(--brand-300)]"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

interface ToggleRowProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function ToggleRow({ label, checked, onChange }: ToggleRowProps) {
  return (
    <label className="flex items-center justify-between gap-3 border border-[var(--surface-border)] bg-[var(--surface-1)] rounded-md px-3 py-2 text-xs font-medium text-[var(--text-secondary)]">
      {label}
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-[var(--brand-600)]"
      />
    </label>
  );
}
