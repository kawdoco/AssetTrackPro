import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

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
    description:
      "RFID tag detected outside assigned operational zone.",
  },
  {
    id: "a-03",
    title: "Tag Signal Lost",
    asset: "Scanner Unit #8",
    location: "Warehouse",
    time: "2026-02-11 04:30 PM",
    priority: "Low",
    status: "Acknowledged",
    description:
      "RFID signal not detected for more than 10 minutes.",
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
  const [alerts, setAlerts] = useState(initialAlerts);
  const [expanded, setExpanded] = useState<string | null>(null);

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

  return (
    <div className="p-6">
      <h2 className="text-lg mb-4">Alerts & Incidents</h2>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
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
            {alerts.map((alert) => {
              const isExpanded = expanded === alert.id;

              return (
                <>
                  <tr
                    key={alert.id}
                    className="border-t hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">{alert.title}</td>
                    <td className="px-6 py-4">{alert.asset}</td>
                    <td className="px-6 py-4">{alert.location}</td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${getPriorityStyle(
                          alert.priority
                        )}`}
                      >
                        {alert.priority}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${getStatusStyle(
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
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </td>
                  </tr>

                  {isExpanded && (
                    <tr className="bg-gray-50">
                      <td colSpan={6} className="px-6 py-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm text-gray-600 mb-2">
                              {alert.description}
                            </p>
                            <p className="text-xs text-gray-400">
                              Reported at: {alert.time}
                            </p>
                          </div>

                          <div className="flex gap-2">
                            {alert.status === "Open" && (
                              <>
                                <button
                                  onClick={() =>
                                    updateStatus(alert.id, "Acknowledged")
                                  }
                                  className="px-3 py-2 bg-blue-500 text-white rounded-xl text-xs hover:bg-blue-600 transition-colors"
                                >
                                  Acknowledge
                                </button>

                                <button
                                  onClick={() =>
                                    updateStatus(alert.id, "Resolved")
                                  }
                                  className="px-3 py-2 bg-green-500 text-white rounded-xl text-xs hover:bg-green-600 transition-colors"
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
                                className="px-3 py-2 bg-green-500 text-white rounded-xl text-xs hover:bg-green-600 transition-colors"
                              >
                                Resolve
                              </button>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}