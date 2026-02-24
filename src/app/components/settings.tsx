import { useState } from "react";
import {User,Lock,Bell,Building2,Save,}
from "lucide-react";

export default function Settings() {
  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@rfid.com",
  });

  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    criticalOnly: false,
  });

  const [preferences, setPreferences] = useState({
    timezone: "UTC",
    theme: "Light",
  });

  const handleSave = () => {
    alert("Settings saved successfully.");
  };

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg">Settings</h2>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-[#248AFF] text-white rounded-xl text-sm hover:bg-[#1c7ae6] transition"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      {/* Profile Section */}
      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-4 h-4 text-gray-400" />
          <h3 className="text-sm">User Profile</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            value={profile.name}
            onChange={(e) =>
              setProfile({ ...profile, name: e.target.value })
            }
            placeholder="Full Name"
            className="border rounded-lg px-3 py-2 text-sm"
          />

          <input
            type="email"
            value={profile.email}
            onChange={(e) =>
              setProfile({ ...profile, email: e.target.value })
            }
            placeholder="Email"
            className="border rounded-lg px-3 py-2 text-sm"
          />
        </div>
      </div>

      {/* Password Section */}
      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="w-4 h-4 text-gray-400" />
          <h3 className="text-sm">Change Password</h3>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <input
            type="password"
            placeholder="Current Password"
            value={password.current}
            onChange={(e) =>
              setPassword({ ...password, current: e.target.value })
            }
            className="border rounded-lg px-3 py-2 text-sm"
          />

          <input
            type="password"
            placeholder="New Password"
            value={password.new}
            onChange={(e) =>
              setPassword({ ...password, new: e.target.value })
            }
            className="border rounded-lg px-3 py-2 text-sm"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={password.confirm}
            onChange={(e) =>
              setPassword({ ...password, confirm: e.target.value })
            }
            className="border rounded-lg px-3 py-2 text-sm"
          />
        </div>
      </div>

      {/* Organization Preferences */}
      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="w-4 h-4 text-gray-400" />
          <h3 className="text-sm">Organization Preferences</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <select
            value={preferences.timezone}
            onChange={(e) =>
              setPreferences({ ...preferences, timezone: e.target.value })
            }
            className="border rounded-lg px-3 py-2 text-sm"
          >
            <option>UTC</option>
            <option>GMT+1</option>
            <option>GMT+8</option>
            <option>GMT-5</option>
          </select>

          <select
            value={preferences.theme}
            onChange={(e) =>
              setPreferences({ ...preferences, theme: e.target.value })
            }
            className="border rounded-lg px-3 py-2 text-sm"
          >
            <option>Light</option>
            <option>Dark</option>
          </select>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-4 h-4 text-gray-400" />
          <h3 className="text-sm">Notifications</h3>
        </div>

        <div className="space-y-3">
          <label className="flex items-center justify-between text-sm">
            Email Alerts
            <input
              type="checkbox"
              checked={notifications.emailAlerts}
              onChange={(e) =>
                setNotifications({
                  ...notifications,
                  emailAlerts: e.target.checked,
                })
              }
            />
          </label>

          <label className="flex items-center justify-between text-sm">
            SMS Alerts
            <input
              type="checkbox"
              checked={notifications.smsAlerts}
              onChange={(e) =>
                setNotifications({
                  ...notifications,
                  smsAlerts: e.target.checked,
                })
              }
            />
          </label>

          <label className="flex items-center justify-between text-sm">
            Critical Alerts Only
            <input
              type="checkbox"
              checked={notifications.criticalOnly}
              onChange={(e) =>
                setNotifications({
                  ...notifications,
                  criticalOnly: e.target.checked,
                })
              }
            />
          </label>
        </div>
      </div>
    </div>
  );
}