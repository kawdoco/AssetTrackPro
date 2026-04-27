import React, { useEffect, useMemo, useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Search, User, Building2, X } from "@/icons/lucideMuiAdapter";
import {
  createEmployee,
  fetchEmployeeOrganizations,
  fetchEmployees,
  type EmployeeCreatePayload,
  type EmployeeRecord,
  type OrganizationOption,
} from "@/services/employeeService";

const statusStyles = {
  ACTIVE: "bg-emerald-50 text-emerald-600",
  INACTIVE: "bg-gray-100 text-gray-500",
};

const employeeSchema = Yup.object({
  organization_id: Yup.string().required("Organization is required"),
  employee_code: Yup.string().trim().required("Employee code is required"),
  name: Yup.string().trim().required("Name is required"),
  email: Yup.string().trim().email("Invalid email").nullable(),
  status: Yup.string()
    .oneOf(["ACTIVE", "INACTIVE"])
    .required("Status is required"),
});

export const EmployeeManagement = () => {
  const [employeesData, setEmployeesData] = useState<EmployeeRecord[]>([]);
  const [organizations, setOrganizations] = useState<OrganizationOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [showAddEmployeePanel, setShowAddEmployeePanel] = useState(false);
  const [selectedEmployee, setSelectedEmployee] =
    useState<EmployeeRecord | null>(null);

  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const initialFormValues: EmployeeCreatePayload = useMemo(
    () => ({
      organization_id: organizations[0] ? String(organizations[0].id) : "",
      employee_code: "",
      name: "",
      email: "",
      status: "ACTIVE",
    }),
    [organizations],
  );

  const loadEmployees = async (searchTerm = "") => {
    try {
      setLoading(true);
      const rows = await fetchEmployees(searchTerm);
      setEmployeesData(rows);
    } catch (error) {
      toast.error("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  const loadOrganizations = async () => {
    try {
      const rows = await fetchEmployeeOrganizations();
      setOrganizations(rows);
    } catch (error) {
      toast.error("Failed to load organizations");
    }
  };

  useEffect(() => {
    void Promise.all([loadEmployees(), loadOrganizations()]);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      void loadEmployees(search);
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  const toggleRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((row) => row !== id) : [...prev, id],
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

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedEmployee(null);
                  setShowAddEmployeePanel(true);
                }}
                className="flex items-center gap-2 px-3 py-2 bg-[var(--brand-600)] text-white rounded-md text-sm font-semibold hover:bg-[var(--brand-700)] transition-all"
              >
                <Plus className="w-4 h-4" />
                Add Employee
              </button>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search employees..."
                  className="bg-[var(--surface-1)] border border-[var(--surface-border)] rounded-md py-2 pl-9 pr-4 text-xs text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[var(--brand-200)]"
                />
              </div>
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
                {loading && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-sm text-[var(--text-muted)]"
                    >
                      Loading employees...
                    </td>
                  </tr>
                )}

                {!loading &&
                  employeesData.map((emp) => (
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
                          checked={selectedRows.includes(String(emp.id))}
                          onChange={() => toggleRow(String(emp.id))}
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
                              {emp.email || "No email"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-xs font-medium text-[var(--text-secondary)]">
                        {emp.employee_code}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase ${statusStyles[emp.status as keyof typeof statusStyles]}`}
                        >
                          {emp.status}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-xs text-[var(--text-muted)]">
                        {emp.organization?.name || "-"}
                      </td>

                      <td className="px-4 py-3 text-xs font-semibold text-[var(--text-primary)]">
                        {new Date(emp.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}

                {!loading && employeesData.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-sm text-[var(--text-muted)]"
                    >
                      No employees found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* RIGHT DETAIL PANEL */}
      <AnimatePresence>
        {selectedEmployee && !showAddEmployeePanel && (
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
                {selectedEmployee.employee_code} •{" "}
                {selectedEmployee.organization?.name || "-"}
              </p>

              <div className="space-y-4 text-xs">
                <div>
                  <p className="font-semibold text-[var(--text-muted)] uppercase tracking-wide">
                    Contact
                  </p>
                  <p className="text-[var(--text-muted)] mt-2">
                    {selectedEmployee.email || "No email provided"}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 grid grid-cols-2 gap-3 border-t border-[var(--surface-border)]">
              <button className="py-2 rounded-md border border-[var(--surface-border)] text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-2)]">
                Employee Code
              </button>
              <button className="py-2 rounded-md border border-[var(--surface-border)] text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-2)]">
                {selectedEmployee.employee_code}
              </button>
              <button className="col-span-2 py-2 rounded-md bg-[var(--brand-600)] text-white text-xs font-semibold hover:opacity-90">
                Status: {selectedEmployee.status}
              </button>
            </div>
          </motion.div>
        )}

        {showAddEmployeePanel && (
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            className="w-[360px] bg-[var(--surface-0)] rounded-lg border border-[var(--surface-border)] shadow-lg flex flex-col"
          >
            <div className="p-5 border-b border-[var(--surface-border)] relative">
              <button
                onClick={() => setShowAddEmployeePanel(false)}
                title="Close add employee panel"
                aria-label="Close add employee panel"
                className="absolute top-4 right-4 p-1.5 hover:bg-[var(--surface-2)] rounded-full"
              >
                <X className="w-4 h-4 text-[var(--text-muted)]" />
              </button>

              <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                Add Employee
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Create a new employee record
              </p>
            </div>

            <Formik
              enableReinitialize
              initialValues={initialFormValues}
              validationSchema={employeeSchema}
              onSubmit={async (values, helpers) => {
                try {
                  await createEmployee(values);
                  toast.success("Employee created successfully");
                  helpers.resetForm({ values: initialFormValues });
                  await loadEmployees(search);
                  setShowAddEmployeePanel(false);
                } catch (error: any) {
                  toast.error(
                    error?.response?.data?.message ||
                      "Failed to create employee",
                  );
                } finally {
                  helpers.setSubmitting(false);
                }
              }}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                isSubmitting,
              }) => (
                <Form className="p-5 space-y-4">
                  <div>
                    <label className="block text-xs text-[var(--text-muted)] mb-1">
                      Organization
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                      <select
                        name="organization_id"
                        value={values.organization_id}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full bg-[var(--surface-1)] border border-[var(--surface-border)] rounded-md py-2 pl-9 pr-3 text-xs text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[var(--brand-200)]"
                      >
                        <option value="">Select organization</option>
                        {organizations.map((org) => (
                          <option key={org.id} value={org.id}>
                            {org.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    {touched.organization_id && errors.organization_id && (
                      <p className="text-[10px] text-[var(--danger-500)] mt-1">
                        {errors.organization_id}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs text-[var(--text-muted)] mb-1">
                      Employee Code
                    </label>
                    <input
                      name="employee_code"
                      value={values.employee_code}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="EMP-001"
                      className="w-full bg-[var(--surface-1)] border border-[var(--surface-border)] rounded-md py-2 px-3 text-xs text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[var(--brand-200)]"
                    />
                    {touched.employee_code && errors.employee_code && (
                      <p className="text-[10px] text-[var(--danger-500)] mt-1">
                        {errors.employee_code}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs text-[var(--text-muted)] mb-1">
                      Name
                    </label>
                    <input
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Employee name"
                      className="w-full bg-[var(--surface-1)] border border-[var(--surface-border)] rounded-md py-2 px-3 text-xs text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[var(--brand-200)]"
                    />
                    {touched.name && errors.name && (
                      <p className="text-[10px] text-[var(--danger-500)] mt-1">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs text-[var(--text-muted)] mb-1">
                      Email
                    </label>
                    <input
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="name@company.com"
                      className="w-full bg-[var(--surface-1)] border border-[var(--surface-border)] rounded-md py-2 px-3 text-xs text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[var(--brand-200)]"
                    />
                    {touched.email && errors.email && (
                      <p className="text-[10px] text-[var(--danger-500)] mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs text-[var(--text-muted)] mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={values.status}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-full bg-[var(--surface-1)] border border-[var(--surface-border)] rounded-md py-2 px-3 text-xs text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[var(--brand-200)]"
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="INACTIVE">INACTIVE</option>
                    </select>
                    {touched.status && errors.status && (
                      <p className="text-[10px] text-[var(--danger-500)] mt-1">
                        {errors.status}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2 rounded-md bg-[var(--brand-600)] text-white text-xs font-semibold hover:bg-[var(--brand-700)] disabled:opacity-60"
                  >
                    {isSubmitting ? "Saving..." : "Save Employee"}
                  </button>
                </Form>
              )}
            </Formik>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
