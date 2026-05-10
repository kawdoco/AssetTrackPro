import React, { useEffect, useMemo, useRef, useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Search, User, Building2, X } from "@/icons/lucideMuiAdapter";
import {
  createEmployee,
  deleteEmployee,
  fetchEmployeeOrganizations,
  fetchEmployees,
  updateEmployee,
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
  const [showSaveConfirmPopup, setShowSaveConfirmPopup] = useState(false);
  const [showDeleteConfirmPopup, setShowDeleteConfirmPopup] = useState(false);
  const [selectedEmployee, setSelectedEmployee] =
    useState<EmployeeRecord | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<EmployeeRecord | null>(
    null,
  );
  const [employeeToDelete, setEmployeeToDelete] =
    useState<EmployeeRecord | null>(null);
  const saveConfirmResolverRef = useRef<((value: boolean) => void) | null>(
    null,
  );

  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const initialFormValues: EmployeeCreatePayload = useMemo(
    () => ({
      organization_id: editingEmployee
        ? String(editingEmployee.organization_id)
        : organizations[0]
          ? String(organizations[0].id)
          : "",
      employee_code: editingEmployee?.employee_code || "",
      name: editingEmployee?.name || "",
      email: editingEmployee?.email || "",
      status: editingEmployee?.status || "ACTIVE",
      is_active: editingEmployee?.is_active ?? true,
    }),
    [editingEmployee, organizations],
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

  const requestSaveConfirmation = () =>
    new Promise<boolean>((resolve) => {
      saveConfirmResolverRef.current = resolve;
      setShowSaveConfirmPopup(true);
    });

  const handleSaveConfirm = () => {
    setShowSaveConfirmPopup(false);
    saveConfirmResolverRef.current?.(true);
    saveConfirmResolverRef.current = null;
  };

  const handleSaveCancel = () => {
    setShowSaveConfirmPopup(false);
    saveConfirmResolverRef.current?.(false);
    saveConfirmResolverRef.current = null;
  };

  const handleOpenAddPanel = () => {
    setSelectedEmployee(null);
    setEditingEmployee(null);
    setShowAddEmployeePanel(true);
  };

  const handleOpenEditPanel = (employee: EmployeeRecord) => {
    setEditingEmployee(employee);
    setSelectedEmployee(employee);
    setShowAddEmployeePanel(true);
  };

  const handlePromptDelete = (employee: EmployeeRecord) => {
    setEmployeeToDelete(employee);
    setShowDeleteConfirmPopup(true);
  };

  const handleDeleteConfirm = async () => {
    if (!employeeToDelete) return;

    try {
      await deleteEmployee(employeeToDelete.id);
      toast.success("Employee deactivated successfully");
      await loadEmployees(search);

      if (selectedEmployee?.id === employeeToDelete.id) {
        setSelectedEmployee({
          ...selectedEmployee,
          is_active: false,
          status: "INACTIVE",
        });
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to delete employee",
      );
    } finally {
      setShowDeleteConfirmPopup(false);
      setEmployeeToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirmPopup(false);
    setEmployeeToDelete(null);
  };

  return (
    <div className="flex h-full gap-4 overflow-hidden">
      {/* LEFT TABLE SECTION */}
      <div
        className={`flex-1 flex flex-col transition-all duration-500 ${
          selectedEmployee || showAddEmployeePanel ? "w-2/3" : "w-full"
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
                onClick={handleOpenAddPanel}
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
                  <th className="px-4 py-3">Employee Code</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Organization</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[var(--surface-border)]">
                {loading && (
                  <tr>
                    <td
                      colSpan={7}
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
                      className={`hover:bg-[var(--surface-2)] cursor-pointer transition ${!emp.is_active ? "opacity-70" : ""}`}
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

                      <td className="px-4 py-3">
                        <div
                          className="flex items-center gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => setSelectedEmployee(emp)}
                            className="px-2.5 py-1.5 rounded-md border border-[var(--surface-border)] text-[10px] font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-2)]"
                          >
                            View
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEditPanel(emp)}
                            className="px-2.5 py-1.5 rounded-md border border-[var(--surface-border)] text-[10px] font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-2)]"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handlePromptDelete(emp)}
                            disabled={!emp.is_active}
                            className="px-2.5 py-1.5 rounded-md bg-[var(--danger-500)] text-white text-[10px] font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                {!loading && employeesData.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
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
              <button
                type="button"
                onClick={() => handleOpenEditPanel(selectedEmployee)}
                className="py-2 rounded-md border border-[var(--surface-border)] text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-2)]"
              >
                Edit Employee
              </button>
              <button className="py-2 rounded-md border border-[var(--surface-border)] text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-2)]">
                {selectedEmployee.employee_code}
              </button>
              <button
                type="button"
                onClick={() => handlePromptDelete(selectedEmployee)}
                disabled={!selectedEmployee.is_active}
                className="col-span-2 py-2 rounded-md bg-[var(--danger-500)] text-white text-xs font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {selectedEmployee.is_active
                  ? "Delete (Soft Deactivate)"
                  : "Already Inactive - Use Edit to Reactivate"}
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
                onClick={() => {
                  setShowAddEmployeePanel(false);
                  setEditingEmployee(null);
                }}
                title="Close add employee panel"
                aria-label="Close add employee panel"
                className="absolute top-4 right-4 p-1.5 hover:bg-[var(--surface-2)] rounded-full"
              >
                <X className="w-4 h-4 text-[var(--text-muted)]" />
              </button>

              <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                {editingEmployee ? "Edit Employee" : "Add Employee"}
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                {editingEmployee
                  ? "Update employee details and active state"
                  : "Create a new employee record"}
              </p>
            </div>

            <Formik
              enableReinitialize
              initialValues={initialFormValues}
              validationSchema={employeeSchema}
              onSubmit={async (values, helpers) => {
                const confirmed = await requestSaveConfirmation();

                if (!confirmed) {
                  helpers.setSubmitting(false);
                  return;
                }

                try {
                  if (editingEmployee) {
                    await updateEmployee(editingEmployee.id, values);
                    toast.success("Employee updated successfully");
                  } else {
                    await createEmployee(values);
                    toast.success("Employee created successfully");
                  }

                  helpers.resetForm({ values: initialFormValues });
                  await loadEmployees(search);
                  setShowAddEmployeePanel(false);
                  setEditingEmployee(null);
                } catch (error: any) {
                  toast.error(
                    error?.response?.data?.message ||
                      `Failed to ${editingEmployee ? "update" : "create"} employee`,
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
                setFieldValue,
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
                        title='org'
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
                      title="status"
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

                  <div className="flex items-center justify-between rounded-md border border-[var(--surface-border)] bg-[var(--surface-1)] px-3 py-2">
                    <label className="text-xs text-[var(--text-primary)] font-semibold">
                      Is Active
                    </label>
                    <input
                      title=""
                      type="checkbox"
                      checked={Boolean(values.is_active)}
                      onChange={(e) =>
                        setFieldValue("is_active", e.target.checked)
                      }
                      className="h-4 w-4 accent-[var(--brand-600)]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2 rounded-md bg-[var(--brand-600)] text-white text-xs font-semibold hover:bg-[var(--brand-700)] disabled:opacity-60"
                  >
                    {isSubmitting
                      ? "Saving..."
                      : editingEmployee
                        ? "Update Employee"
                        : "Save Employee"}
                  </button>
                </Form>
              )}
            </Formik>
          </motion.div>
        )}

        {showSaveConfirmPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[1px] flex items-center justify-center px-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-[360px] rounded-lg border border-[var(--surface-border)] bg-[var(--surface-0)] shadow-2xl"
            >
              <div className="px-5 py-4 border-b border-[var(--surface-border)]">
                <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                  Confirm Save
                </h4>
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  Are you sure you want to save this employee?
                </p>
              </div>

              <div className="p-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleSaveCancel}
                  className="py-2 rounded-md border border-[var(--surface-border)] text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-2)]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveConfirm}
                  className="py-2 rounded-md bg-[var(--brand-600)] text-white text-xs font-semibold hover:bg-[var(--brand-700)]"
                >
                  Yes, Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showDeleteConfirmPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[1px] flex items-center justify-center px-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-[360px] rounded-lg border border-[var(--surface-border)] bg-[var(--surface-0)] shadow-2xl"
            >
              <div className="px-5 py-4 border-b border-[var(--surface-border)]">
                <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                  Confirm Delete
                </h4>
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  This will set employee as inactive. Continue?
                </p>
              </div>

              <div className="p-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleDeleteCancel}
                  className="py-2 rounded-md border border-[var(--surface-border)] text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-2)]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => void handleDeleteConfirm()}
                  className="py-2 rounded-md bg-[var(--danger-500)] text-white text-xs font-semibold hover:opacity-90"
                >
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
