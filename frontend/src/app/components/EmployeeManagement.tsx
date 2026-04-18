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
} from "@/icons/lucideMuiAdapter";

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
    <div className="flex h-full gap-4 overflow-hidden">
      {/* LEFT TABLE SECTION */}
      <div
        className={`flex-1 flex flex-col transition-all duration-500 ${
          selectedEmployee ? "w-2/3" : "w-full"
        }`}
      >
        <div className="bg-[var(--surface-0)] rounded-lg border border-[var(--surface-border)] shadow-sm flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-[var(--surface-border)] flex justify-between items-center gap-3">
            <div>
              <h2 className="text-base font-semibold text-[var(--text-primary)]">
                Employee Management
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Register and track employees
              </p>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input
                placeholder="Search employees..."
                className="bg-[var(--surface-1)] border border-[var(--surface-border)] rounded-md py-2 pl-9 pr-4 text-xs text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[var(--brand-200)]"
              />
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedRows.length > 0 && (
            <div className="px-4 py-2 bg-[var(--brand-200)]/35 border-b border-[var(--surface-border)] flex justify-between items-center text-xs font-semibold text-[var(--text-primary)]">
              <span>{selectedRows.length} selected</span>
              <div className="flex gap-3">
                <button className="hover:text-[var(--brand-600)]">
                  Assign Assets
                </button>
                <button className="text-[var(--danger-500)] hover:opacity-90">
                  Offboard
                </button>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead className="border-b border-[var(--surface-border)] text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                <tr>
                  <th className="px-4 py-3"></th>
                  <th className="px-4 py-3">Employee</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Last Seen</th>
                  <th className="px-4 py-3">Assets</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[var(--surface-border)]">
                {employeesData.map((emp) => (
                  <tr
                    key={emp.id}
                    className="hover:bg-[var(--surface-2)] cursor-pointer transition"
                    onClick={() => setSelectedEmployee(emp)}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        title={`Select ${emp.name}`}
                        aria-label={`Select ${emp.name}`}
                        checked={selectedRows.includes(emp.id)}
                        onChange={() => toggleRow(emp.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="accent-[var(--brand-600)]"
                      />
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[var(--brand-200)]/30 rounded-md border border-[var(--surface-border)] flex items-center justify-center">
                          <User className="w-4 h-4 text-[var(--brand-600)]" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[var(--text-primary)]">
                            {emp.name}
                          </p>
                          <p className="text-[10px] text-[var(--text-muted)]">
                            {emp.role}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-xs font-medium text-[var(--text-secondary)]">
                      {emp.department}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase ${statusStyles[emp.status as keyof typeof statusStyles]}`}
                      >
                        {emp.status}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-xs text-[var(--text-muted)]">
                      {emp.lastSeen}
                    </td>

                    <td className="px-4 py-3 text-xs font-semibold text-[var(--text-primary)]">
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
            className="w-[320px] bg-[var(--surface-0)] rounded-lg border border-[var(--surface-border)] shadow-lg flex flex-col"
          >
            <div className="p-5 border-b border-[var(--surface-border)] relative">
              <button
                onClick={() => setSelectedEmployee(null)}
                title="Close details"
                aria-label="Close details"
                className="absolute top-4 right-4 p-1.5 hover:bg-[var(--surface-2)] rounded-full"
              >
                <X className="w-4 h-4 text-[var(--text-muted)]" />
              </button>

              <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                {selectedEmployee.name}
              </h3>
              <p className="text-xs text-[var(--text-muted)] mb-5">
                {selectedEmployee.role} • {selectedEmployee.department}
              </p>

              <div className="space-y-4 text-xs">
                <div>
                  <p className="font-semibold text-[var(--text-muted)] uppercase tracking-wide">
                    Assigned Assets
                  </p>
                  {selectedEmployee.assets.length > 0 ? (
                    <ul className="mt-2 space-y-1 text-[var(--text-primary)] font-semibold">
                      {selectedEmployee.assets.map((asset) => (
                        <li key={asset}>{asset}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[var(--text-muted)] mt-2">
                      No assets assigned
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 grid grid-cols-2 gap-3 border-t border-[var(--surface-border)]">
              <button className="py-2 rounded-md border border-[var(--surface-border)] text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-2)]">
                Assign Asset
              </button>
              <button className="py-2 rounded-md border border-[var(--surface-border)] text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-2)]">
                Unassign
              </button>
              <button className="col-span-2 py-2 rounded-md bg-[var(--danger-500)] text-white text-xs font-semibold hover:opacity-90">
                Offboard Employee
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

