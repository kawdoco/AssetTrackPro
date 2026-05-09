import { Fragment, useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "@/icons/lucideMuiAdapter";
import {
  getAlerts,
  acknowledgeAlert,
  resolveAlert,
  type AlertRecord,
} from "@/services/alertService";

type Alert = {
  id: string;
  title: string;
  asset: string;
  location: string;
  time: string;
  priority: "High" | "Medium" | "Low";
  status: "Open" | "Acknowledged" | "Resolved";
  description: string;
  rawId: number;
};

const mapApiAlert = (alert: AlertRecord): Alert => {
  const priority =
    alert.severity === "CRITICAL"
      ? "High"
      : alert.severity === "HIGH"
      ? "High"
      : alert.severity === "MEDIUM"
      ? "Medium"
      : "Low";

  const assetLabel = alert.asset.asset_type
    ? `${alert.asset.asset_type} ${alert.asset.asset_tag_uid}`
    : alert.asset.asset_tag_uid;

  const location = alert.movement_event
    ? `Zone ${alert.movement_event.zone_from_id} → ${alert.movement_event.zone_to_id}`
    : "Unknown";

  const title = alert.alert_type
    .split("_")
    .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  return {
    id: alert.id.toString(),
    title,
    asset: assetLabel,
    location,
    time: new Date(alert.created_at).toLocaleString(),
    priority,
    status: alert.status as Alert["status"],
    description: alert.message,
    rawId: alert.id,
  };
};

export default function AlertsIncidents() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"All" | Alert["status"]>("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAlerts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getAlerts({
        status: statusFilter === "All" ? undefined : statusFilter,
        search: search.trim() || undefined,
        limit: 50,
      });

      setAlerts(response.data.map(mapApiAlert));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load alerts from the server"
      );
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, [statusFilter, search]);

  const updateStatus = async (id: string, newStatus: Alert["status"]) => {
    const alert = alerts.find((item) => item.id === id);
    if (!alert) return;

    try {
      if (newStatus === "Acknowledged") {
        await acknowledgeAlert(alert.rawId);
      } else if (newStatus === "Resolved") {
        await resolveAlert(alert.rawId);
      }

      await loadAlerts();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update alert status"
      );
    }
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

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

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
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-[var(--text-muted)]">
                  Loading alerts...
                </td>
              </tr>
            ) : filteredAlerts.length === 0 ? (
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

