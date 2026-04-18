import { useState } from "react";
import {FileDown,FileSpreadsheet,Calendar,}
from "@/icons/lucideMuiAdapter";
import {LineChart,Line,XAxis,YAxis,Tooltip,CartesianGrid,ResponsiveContainer,BarChart,Bar,}
from "recharts";

type Movement = {
  id: string;
  asset: string;
  employee: string;
  zone: string;
  date: string;
};

type Overdue = {
  id: string;
  asset: string;
  assignedTo: string;
  dueDate: string;
  status: string;
};

const movementData: Movement[] = [
  { id: "m1", asset: "Forklift #12", employee: "John Lee", zone: "Zone A", date: "2026-02-01" },
  { id: "m2", asset: "Scanner #4", employee: "Sarah Kim", zone: "Zone B", date: "2026-02-02" },
  { id: "m3", asset: "Pallet #442", employee: "David Park", zone: "Zone C", date: "2026-02-03" },
];

const overdueAssets: Overdue[] = [
  { id: "o1", asset: "Forklift #3", assignedTo: "Michael Tan", dueDate: "2026-02-10", status: "Overdue" },
  { id: "o2", asset: "Scanner #7", assignedTo: "Emily Wong", dueDate: "2026-02-11", status: "Overdue" },
];

const chartData = [
  { name: "Mon", movements: 12 },
  { name: "Tue", movements: 18 },
  { name: "Wed", movements: 9 },
  { name: "Thu", movements: 22 },
  { name: "Fri", movements: 15 },
];

export default function ReportsAnalytics() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const exportCSV = () => {
    const rows = [
      ["Asset", "Employee", "Zone", "Date"],
      ...movementData.map((m) => [m.asset, m.employee, m.zone, m.date]),
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," +
      rows.map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "asset_report.csv");
    document.body.appendChild(link);
    link.click();
  };

  const exportPDF = () => {
    window.print();
  };

  return (
    <div className="p-0 space-y-4">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-base font-semibold text-[var(--text-primary)]">Reports & Analytics</h2>

        <div className="flex gap-3">
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-3 py-2 bg-[var(--success-500)] text-white rounded-md text-sm font-semibold hover:opacity-90 transition"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Export CSV
          </button>

          <button
            onClick={exportPDF}
            className="flex items-center gap-2 px-3 py-2 bg-[var(--brand-600)] text-white rounded-md text-sm font-semibold hover:bg-[var(--brand-700)] transition"
          >
            <FileDown className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Date Filters */}
      <div className="bg-[var(--surface-0)] p-3 rounded-lg border border-[var(--surface-border)] shadow-sm flex items-center gap-3">
        <Calendar className="w-5 h-5 text-[var(--text-muted)]" />
        <input
          type="date"
          title="Start date"
          aria-label="Start date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border border-[var(--surface-border)] bg-[var(--surface-1)] rounded-md px-3 py-2 text-sm text-[var(--text-primary)]"
        />
        <span className="text-[var(--text-muted)] text-sm">to</span>
        <input
          type="date"
          title="End date"
          aria-label="End date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border border-[var(--surface-border)] bg-[var(--surface-1)] rounded-md px-3 py-2 text-sm text-[var(--text-primary)]"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="bg-[var(--surface-0)] p-4 rounded-lg border border-[var(--surface-border)] shadow-sm">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Weekly Asset Movements</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="movements" stroke="#248AFF" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[var(--surface-0)] p-4 rounded-lg border border-[var(--surface-border)] shadow-sm">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Zone Activity</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="movements" fill="#248AFF" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Asset Movement Report Table */}
      <div className="bg-[var(--surface-0)] rounded-lg border border-[var(--surface-border)] shadow-sm overflow-hidden">
        <h3 className="px-4 py-3 text-sm font-semibold text-[var(--text-primary)] border-b border-[var(--surface-border)]">Asset Movement Report</h3>

        <table className="w-full text-sm">
          <thead className="bg-[var(--surface-1)] text-[var(--text-muted)] text-[11px] uppercase tracking-wide">
            <tr>
              <th className="px-4 py-3 text-left">Asset</th>
              <th className="px-4 py-3 text-left">Employee</th>
              <th className="px-4 py-3 text-left">Zone</th>
              <th className="px-4 py-3 text-left">Date</th>
            </tr>
          </thead>

          <tbody>
            {movementData.map((m) => (
              <tr key={m.id} className="border-t border-[var(--surface-border)] hover:bg-[var(--surface-2)]">
                <td className="px-4 py-3 text-[var(--text-primary)]">{m.asset}</td>
                <td className="px-4 py-3 text-[var(--text-secondary)]">{m.employee}</td>
                <td className="px-4 py-3 text-[var(--text-secondary)]">{m.zone}</td>
                <td className="px-4 py-3 text-[var(--text-muted)]">{m.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Overdue Assets Table */}
      <div className="bg-[var(--surface-0)] rounded-lg border border-[var(--surface-border)] shadow-sm overflow-hidden">
        <h3 className="px-4 py-3 text-sm font-semibold text-[var(--text-primary)] border-b border-[var(--surface-border)]">Overdue Assets</h3>

        <table className="w-full text-sm">
          <thead className="bg-[var(--surface-1)] text-[var(--text-muted)] text-[11px] uppercase tracking-wide">
            <tr>
              <th className="px-4 py-3 text-left">Asset</th>
              <th className="px-4 py-3 text-left">Assigned To</th>
              <th className="px-4 py-3 text-left">Due Date</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {overdueAssets.map((o) => (
              <tr key={o.id} className="border-t border-[var(--surface-border)] hover:bg-[var(--surface-2)]">
                <td className="px-4 py-3 text-[var(--text-primary)]">{o.asset}</td>
                <td className="px-4 py-3 text-[var(--text-secondary)]">{o.assignedTo}</td>
                <td className="px-4 py-3 text-[var(--text-muted)]">{o.dueDate}</td>
                <td className="px-4 py-3">
                  <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-[11px] font-semibold">
                    {o.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
