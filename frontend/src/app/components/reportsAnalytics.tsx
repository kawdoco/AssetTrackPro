import { useState } from "react";
import {FileDown,FileSpreadsheet,Calendar,}
from "lucide-react";
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
    <div className="p-6 space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg">Reports & Analytics</h2>

        <div className="flex gap-3">
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl text-sm hover:bg-green-700 transition"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Export CSV
          </button>

          <button
            onClick={exportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700 transition"
          >
            <FileDown className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Date Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-4">
        <Calendar className="w-5 h-5 text-gray-400" />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        />
        <span className="text-gray-400">to</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-2xl shadow-sm">
          <h3 className="text-sm mb-3">Weekly Asset Movements</h3>
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

        <div className="bg-white p-4 rounded-2xl shadow-sm">
          <h3 className="text-sm mb-3">Zone Activity</h3>
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
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <h3 className="px-6 py-4 text-sm border-b">Asset Movement Report</h3>

        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-6 py-3 text-left">Asset</th>
              <th className="px-6 py-3 text-left">Employee</th>
              <th className="px-6 py-3 text-left">Zone</th>
              <th className="px-6 py-3 text-left">Date</th>
            </tr>
          </thead>

          <tbody>
            {movementData.map((m) => (
              <tr key={m.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4">{m.asset}</td>
                <td className="px-6 py-4">{m.employee}</td>
                <td className="px-6 py-4">{m.zone}</td>
                <td className="px-6 py-4">{m.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Overdue Assets Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <h3 className="px-6 py-4 text-sm border-b">Overdue Assets</h3>

        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-6 py-3 text-left">Asset</th>
              <th className="px-6 py-3 text-left">Assigned To</th>
              <th className="px-6 py-3 text-left">Due Date</th>
              <th className="px-6 py-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {overdueAssets.map((o) => (
              <tr key={o.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4">{o.asset}</td>
                <td className="px-6 py-4">{o.assignedTo}</td>
                <td className="px-6 py-4">{o.dueDate}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs">
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