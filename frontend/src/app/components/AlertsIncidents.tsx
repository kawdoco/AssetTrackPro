import { Fragment, useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "@/icons/lucideMuiAdapter";

type Alert = {
  id: string;
  title: string;
  asset: string;
  location: string;
  time: string;
  priority: "High" | "Medium" | "Low";
  status: "Open" | "Acknowledged" | "Resolved";
  description: string;
};

const STORAGE_KEY = "assettrackpro-alerts";

const initialAlerts: Alert[] = [
  {
    id: "a-01",
    title: "Unauthorized Gate Entry",
    asset: "Forklift #12",
    location: "Zone B - Gate 3",
    time: "2026-02-12 09:42 AM",
    priority: "High",
    status: "Open",
    description:
      "Asset attempted to exit through restricted gate without clearance.",
  },
  {
    id: "a-02",
    title: "Asset Movement Outside Zone",
    asset: "Pallet #442",
    location: "Zone A",
    time: "2026-02-12 11:10 AM",
    priority: "Medium",
    status: "Open",
    description: "RFID tag detected outside assigned operational zone.",
  },
  {
    id: "a-03",
    title: "Tag Signal Lost",
    asset: "Scanner Unit #8",
    location: "Warehouse",
    time: "2026-02-11 04:30 PM",
    priority: "Low",
    status: "Acknowledged",
    description: "RFID signal not detected for more than 10 minutes.",
  },
  {
    id: "a-04",
    title: "Restricted Area Access",
    asset: "Delivery Truck #7",
    location: "Zone D - Loading Dock",
    time: "2026-02-13 08:15 AM",
    priority: "High",
    status: "Open",
    description:
      "Vehicle entered a restricted loading dock area without scheduled approval.",
  },
  {
    id: "a-05",
    title: "Excessive Idle Time",
    asset: "Forklift #3",
    location: "Zone C",
    time: "2026-02-13 10:22 AM",
    priority: "Medium",
    status: "Resolved",
    description:
      "Asset remained idle beyond permitted operational time threshold.",
  },
];

export default function AlertsIncidents() {
  const [alerts, setAlerts] = useState<Alert[]>(() => {
    if (typeof window === "undefined") return initialAlerts;
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      return saved ? (JSON.parse(saved) as Alert[]) : initialAlerts;
    } catch {
      return initialAlerts;
    }
  });

  const [expanded, setExpanded] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"All" | Alert["status"]>("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
  }, [alerts]);

  const updateStatus = (id: string, newStatus: Alert["status"]) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id ? { ...alert, status: newStatus } : alert
      )
    );
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-600";
      case "Medium":
        return "bg-yellow-100 text-yellow-600";
      case "Low":
        return "bg-green-100 text-green-600";
      default:
        return "";
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-gray-100 text-gray-600";
      case "Acknowledged":
        return "bg-blue-100 text-blue-600";
      case "Resolved":
        return "bg-green-100 text-green-600";
      default:
        return "";
    }
  };

  const filteredAlerts = alerts.filter((alert) => {
    const matchesStatus =
      statusFilter === "All" ? true : alert.status === statusFilter;
    const matchesSearch =
      search.trim() === "" ||
      alert.title.toLowerCase().includes(search.toLowerCase()) ||
      alert.asset.toLowerCase().includes(search.toLowerCase()) ||
      alert.location.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const openCount = alerts.filter((alert) => alert.status === "Open").length;
  const ackCount = alerts.filter(
    (alert) => alert.status === "Acknowledged"
  ).length;
  const resolvedCount = alerts.filter(
    (alert) => alert.status === "Resolved"
  ).length;

  return (
    <div className="p-0">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-1">
            Alerts & Incidents
          </h2>
          <p className="text-sm text-[var(--text-muted)]">
            Manage alerts, acknowledge incidents, and resolve issues from the
            system.
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
            <span className="px-3 py-1 rounded-full bg-red-100 text-red-600">
              Open: {openCount}
            </span>
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-600">
              Acknowledged: {ackCount}
            </span>
            <span className="px-3 py-1 rounded-full bg-green-100 text-green-600">
              Resolved: {resolvedCount}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search alerts..."
            className="w-full min-w-[220px] rounded-md border border-[var(--surface-border)] bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--text-primary)] focus:border-[var(--brand-600)] outline-none"
          />
          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as "All" | Alert["status"])
            }
            className="w-full min-w-[160px] rounded-md border border-[var(--surface-border)] bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--text-primary)] focus:border-[var(--brand-600)] outline-none"
          >
            <option value="All">All statuses</option>
            <option value="Open">Open</option>
            <option value="Acknowledged">Acknowledged</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      <div className="bg-[var(--surface-0)] rounded-lg border border-[var(--surface-border)] shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--surface-1)] text-[var(--text-muted)] text-[11px] uppercase tracking-wide">
            <tr>
              <th className="px-6 py-3 text-left">Alert</th>
              <th className="px-6 py-3 text-left">Asset</th>
              <th className="px-6 py-3 text-left">Location</th>
              <th className="px-6 py-3 text-left">Priority</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-right">Details</th>
            </tr>
          </thead>

          <tbody>
            {filteredAlerts.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-[var(--text-muted)]"
                >
                  No alerts match the current search or filter.
                </td>
              </tr>
            ) : (
              filteredAlerts.map((alert) => {
                const isExpanded = expanded === alert.id;

                return (
                  <Fragment key={alert.id}>
                    <tr className="border-t border-[var(--surface-border)] hover:bg-[var(--surface-2)] transition-colors">
                      <td className="px-6 py-3 text-[var(--text-primary)] font-medium">
                        {alert.title}
                      </td>
                      <td className="px-6 py-3 text-[var(--text-secondary)]">
                        {alert.asset}
                      </td>
                      <td className="px-6 py-3 text-[var(--text-secondary)]">
                        {alert.location}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-[11px] font-semibold ${getPriorityStyle(
                            alert.priority
                          )}`}
                        >
                          {alert.priority}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-[11px] font-semibold ${getStatusStyle(
                            alert.status
                          )}`}
                        >
                          {alert.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() =>
                            setExpanded(isExpanded ? null : alert.id)
                          }
                          className="p-1.5 rounded-md hover:bg-[var(--surface-1)] transition-colors"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-[var(--text-muted)]" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />
                          )}
                        </button>
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr className="bg-[var(--surface-1)] border-t border-[var(--surface-border)]">
                        <td colSpan={6} className="px-6 py-4">
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <p className="text-sm text-[var(--text-secondary)] mb-2">
                                {alert.description}
                              </p>
                              <p className="text-xs text-[var(--text-muted)]">
                                Reported at: {alert.time}
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {alert.status === "Open" && (
                                <>
                                  <button
                                    onClick={() =>
                                      updateStatus(alert.id, "Acknowledged")
                                    }
                                    className="px-3 py-2 bg-[var(--brand-600)] text-white rounded-md text-xs font-semibold hover:bg-[var(--brand-700)] transition-colors"
                                  >
                                    Acknowledge
                                  </button>

                                  <button
                                    onClick={() =>
                                      updateStatus(alert.id, "Resolved")
                                    }
                                    className="px-3 py-2 bg-[var(--success-500)] text-white rounded-md text-xs font-semibold hover:opacity-90 transition-colors"
                                  >
                                    Resolve
                                  </button>
                                </>
                              )}

                              {alert.status === "Acknowledged" && (
                                <button
                                  onClick={() =>
                                    updateStatus(alert.id, "Resolved")
                                  }
                                  className="px-3 py-2 bg-[var(--success-500)] text-white rounded-md text-xs font-semibold hover:opacity-90 transition-colors"
                                >
                                  Resolve
                                </button>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

