import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  MoreHorizontal,
  User,
  Shield,
  Laptop,
  ArrowRightLeft,
  AlertTriangle,
  X,
} from "lucide-react";

const employeesData = [
  {
    id: "EMP-001",
    name: "Sarah Jenkins",
    role: "Warehouse Supervisor",
    department: "Logistics",
    status: "active",
    lastSeen: "2 mins ago",
    assets: ["RF-8829", "RF-3391"],
  },
  {
    id: "EMP-002",
    name: "Mike Chen",
    role: "IT Technician",
    department: "IT",
    status: "inactive",
    lastSeen: "Yesterday",
    assets: ["RF-4421"],
  },
  {
    id: "EMP-003",
    name: "Emma Wilson",
    role: "Safety Officer",
    department: "Operations",
    status: "active",
    lastSeen: "10 mins ago",
    assets: [],
  },
];

const statusStyles = {
  active: "bg-emerald-50 text-emerald-600",
  inactive: "bg-gray-100 text-gray-500",
};

export const EmployeeManagement = () => {
  const [selectedEmployee, setSelectedEmployee] =
    useState<typeof employeesData[0] | null>(null);

  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const toggleRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((row) => row !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex h-full gap-8 overflow-hidden">
      {/* LEFT TABLE SECTION */}
      <div
        className={`flex-1 flex flex-col transition-all duration-500 ${
          selectedEmployee ? "w-2/3" : "w-full"
        }`}
      >
        <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-[#395A8F]">
                Employee Management
              </h2>
              <p className="text-xs text-gray-400">
                Register and track employees
              </p>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                placeholder="Search employees..."
                className="bg-gray-50 rounded-xl py-2 pl-9 pr-4 text-xs outline-none focus:ring-2 focus:ring-[#248AFF]/10"
              />
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedRows.length > 0 && (
            <div className="px-6 py-3 bg-blue-50 flex justify-between items-center text-xs font-semibold text-[#395A8F]">
              <span>{selectedRows.length} selected</span>
              <div className="flex gap-3">
                <button className="hover:text-[#248AFF]">
                  Assign Assets
                </button>
                <button className="text-rose-500 hover:text-rose-600">
                  Offboard
                </button>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead className="border-b border-gray-50 text-[10px] uppercase tracking-wider text-gray-400">
                <tr>
                  <th className="px-6 py-4"></th>
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Last Seen</th>
                  <th className="px-6 py-4">Assets</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {employeesData.map((emp) => (
                  <tr
                    key={emp.id}
                    className="hover:bg-gray-50 cursor-pointer transition"
                    onClick={() => setSelectedEmployee(emp)}
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(emp.id)}
                        onChange={() => toggleRow(emp.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
                          <User className="w-4 h-4 text-[#248AFF]" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#395A8F]">
                            {emp.name}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            {emp.role}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-xs font-semibold text-gray-600">
                      {emp.department}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${statusStyles[emp.status as keyof typeof statusStyles]}`}
                      >
                        {emp.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-xs text-gray-400">
                      {emp.lastSeen}
                    </td>

                    <td className="px-6 py-4 text-xs font-semibold text-[#395A8F]">
                      {emp.assets.length} Assigned
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* RIGHT DETAIL PANEL */}
      <AnimatePresence>
        {selectedEmployee && (
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            className="w-[320px] bg-white rounded-[24px] border border-gray-100 shadow-xl flex flex-col"
          >
            <div className="p-8 border-b border-gray-50 relative">
              <button
                onClick={() => setSelectedEmployee(null)}
                className="absolute top-6 right-6 p-1.5 hover:bg-gray-100 rounded-full"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>

              <h3 className="text-xl font-bold text-[#395A8F]">
                {selectedEmployee.name}
              </h3>
              <p className="text-xs text-gray-400 mb-6">
                {selectedEmployee.role} • {selectedEmployee.department}
              </p>

              <div className="space-y-4 text-xs">
                <div>
                  <p className="font-bold text-gray-400 uppercase">
                    Assigned Assets
                  </p>
                  {selectedEmployee.assets.length > 0 ? (
                    <ul className="mt-2 space-y-1 text-[#395A8F] font-semibold">
                      {selectedEmployee.assets.map((asset) => (
                        <li key={asset}>{asset}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400 mt-2">
                      No assets assigned
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 grid grid-cols-2 gap-4 border-t border-gray-50">
              <button className="py-2 rounded-xl border border-gray-200 text-xs font-bold hover:bg-gray-50">
                Assign Asset
              </button>
              <button className="py-2 rounded-xl border border-gray-200 text-xs font-bold hover:bg-gray-50">
                Unassign
              </button>
              <button className="col-span-2 py-2 rounded-xl bg-rose-500 text-white text-xs font-bold hover:bg-rose-600">
                Offboard Employee
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};