import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'motion/react';
import {
  AlertCircle,
  Building2,
  ChevronDown,
  ChevronUp,
  Edit,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from '@/icons/lucideMuiAdapter';
import type { Organization } from '@/services/organizationService';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../store';
import {
  fetchOrganizations,
  createOrganization as createOrganizationThunk,
  updateOrganization as updateOrganizationThunk,
  deactivateOrganization as deactivateOrganizationThunk,
  reactivateOrganization as reactivateOrganizationThunk,
  selectOrganizations,
  selectOrganizationsLoading,
  selectOrganizationsError,
  selectOrganizationsPagination,
} from '../../store/slices/organizationSlice';
import { SetupWorkflowGuide } from './setup-workflow-guide';

interface OrganizationFormState {
  name: string;
  industry_type: string;
}

const initialFormState: OrganizationFormState = {
  name: '',
  industry_type: '',
};

export const OrganizationManagement = () => {
  const dispatch = useDispatch<AppDispatch>();
  const organizations = useSelector((state: RootState) => selectOrganizations(state));
  const loading = useSelector((state: RootState) => selectOrganizationsLoading(state));
  const globalError = useSelector((state: RootState) => selectOrganizationsError(state));
  const pagination = useSelector((state: RootState) => selectOrganizationsPagination(state));
  const [expandedOrg, setExpandedOrg] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [includeInactive, setIncludeInactive] = useState(false);
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingOrganization, setEditingOrganization] = useState<Organization | null>(null);
  const [formData, setFormData] = useState<OrganizationFormState>(initialFormState);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const getErrorMessage = (value: unknown): string => {
    if (axios.isAxiosError(value)) {
      return value.response?.data?.message || value.message;
    }

    return value instanceof Error ? value.message : 'An unknown error occurred';
  };

  useEffect(() => {
    void dispatch(
      fetchOrganizations({ page, limit: 10, search: searchTerm.trim(), includeInactive }),
    );
  }, [dispatch, page, searchTerm, includeInactive]);

  const openForm = (organization?: Organization) => {
    setEditingOrganization(organization ?? null);
    setFormData(
      organization
        ? {
            name: organization.name,
            industry_type: organization.industry_type || '',
          }
        : initialFormState,
    );
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingOrganization(null);
    setFormData(initialFormState);
  };

  const handleSaveOrganization = async () => {
    if (!formData.name.trim()) {
      setError('Organization name is required');
      return;
    }

    try {
      setSaving(true);
      setError('');

      if (editingOrganization) {
        await dispatch(
          updateOrganizationThunk({
            id: editingOrganization.id,
            data: {
              name: formData.name.trim(),
              industry_type: formData.industry_type.trim() || undefined,
            },
          }),
        ).unwrap();
      } else {
        await dispatch(
          createOrganizationThunk({ name: formData.name.trim(), industry_type: formData.industry_type.trim() || undefined }),
        ).unwrap();
      }

      await dispatch(fetchOrganizations({ page: 1, limit: 10, search: '', includeInactive }));
      closeForm();
    } catch (saveError) {
      setError(getErrorMessage(saveError));
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async (id: number) => {
    try {
      setSaving(true);
      await dispatch(deactivateOrganizationThunk(id)).unwrap();
      await dispatch(fetchOrganizations({ page, limit: 10, search: searchTerm.trim(), includeInactive }));
      setDeleteConfirm(null);
    } catch (deleteError) {
      setError(getErrorMessage(deleteError));
    } finally {
      setSaving(false);
    }
  };

  const handleReactivate = async (id: number) => {
    try {
      setSaving(true);
      await dispatch(reactivateOrganizationThunk(id)).unwrap();
      await dispatch(fetchOrganizations({ page, limit: 10, search: searchTerm.trim(), includeInactive }));
    } catch (reactivateError) {
      setError(getErrorMessage(reactivateError));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-full gap-4 relative">
      <div className="flex-1 flex flex-col gap-4">
        <SetupWorkflowGuide
          activeStep="organizations"
          counts={{ organizations: organizations.length }}
        />

        <div className="flex justify-between items-center gap-4 mb-1">
          <div>
            <h2 className="text-base font-semibold text-[var(--text-primary)]">Organizations</h2>
            <p className="text-xs text-[var(--text-muted)]">
              Start here. One organization owns the branches, buildings, zones, gates, readers, employees, and assets below it.
            </p>
          </div>

          <button
            onClick={() => openForm()}
            title="Create the top-level company or tenant before adding branches."
            className="flex items-center gap-2 px-3 py-2 bg-[var(--brand-600)] text-white rounded-md text-sm font-semibold hover:bg-[var(--brand-700)] transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Organization
          </button>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => {
                setPage(1);
                setSearchTerm(event.target.value);
              }}
              placeholder="Search organizations by name..."
              className="w-full rounded-md border border-[var(--surface-border)] bg-[var(--surface-1)] py-2 pl-10 pr-3 text-sm text-[var(--text-primary)] outline-none focus:ring-1 focus:ring-[var(--brand-600)]"
            />
          </div>

          <button
            onClick={() => {
              setPage(1);
              setIncludeInactive((current) => !current);
            }}
            className={`rounded-md px-3 py-2 text-sm font-semibold transition-all ${
              includeInactive
                ? 'bg-[var(--brand-600)] text-white'
                : 'border border-[var(--surface-border)] bg-[var(--surface-1)] text-[var(--text-primary)] hover:bg-[var(--surface-2)]'
            }`}
          >
            {includeInactive ? 'Hide Inactive' : 'Show Inactive'}
          </button>

          <button
            onClick={() => void dispatch(fetchOrganizations({ page, limit: 10, search: searchTerm.trim(), includeInactive }))}
            className="rounded-md border border-[var(--surface-border)] bg-[var(--surface-1)] px-3 py-2 text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-2)]"
          >
            <RefreshCw className="inline-block w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>

        {(globalError || error) && (
          <div className="flex gap-2 rounded-md border border-red-500/20 bg-red-100/10 p-3">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
            <p className="text-sm text-red-600">{globalError || error}</p>
          </div>
        )}

        <div className="bg-[var(--surface-0)] rounded-lg border border-[var(--surface-border)] shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-[var(--surface-0)]/95 backdrop-blur-sm border-b border-[var(--surface-border)]">
              <tr>
                <th className="px-4 py-3 text-[10px] text-[var(--text-muted)] uppercase tracking-widest">Organization</th>
                <th className="px-4 py-3 text-[10px] text-[var(--text-muted)] uppercase tracking-widest">Industry</th>
                <th className="px-4 py-3 text-[10px] text-[var(--text-muted)] uppercase tracking-widest">Branches</th>
                <th className="px-4 py-3 text-[10px] text-[var(--text-muted)] uppercase tracking-widest">Status</th>
                <th className="px-4 py-3 text-[10px] text-[var(--text-muted)] uppercase tracking-widest">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[var(--surface-border)]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center">
                    <p className="text-sm text-[var(--text-muted)]">Loading organizations...</p>
                  </td>
                </tr>
              ) : organizations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center">
                    <p className="text-sm text-[var(--text-muted)]">No organizations found.</p>
                  </td>
                </tr>
              ) : (
                organizations.map((organization) => {
                  const isExpanded = expandedOrg === organization.id;

                  return (
                    <React.Fragment key={organization.id}>
                      <motion.tr
                        whileHover={{ backgroundColor: 'var(--surface-2)' }}
                        className={`transition-colors ${isExpanded ? 'bg-[var(--brand-200)]/30' : ''}`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-md border border-[var(--surface-border)] bg-[var(--surface-2)]">
                              <Building2 className="h-4 w-4 text-[var(--text-muted)]" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-[var(--text-primary)]">{organization.name}</p>
                              <p className="text-[10px] text-[var(--text-muted)]">ID {organization.id}</p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3 text-xs text-[var(--text-muted)]">
                          {organization.industry_type || 'Not set'}
                        </td>

                        <td className="px-4 py-3 text-xs text-[var(--text-muted)]">
                          {organization._count?.branches ?? 0} branch(es)
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={`inline-block rounded px-2 py-1 text-xs font-medium ${
                              organization.is_active
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {organization.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openForm(organization)}
                              title="Edit organization"
                              className="rounded-md p-2 text-[var(--text-muted)] transition-all hover:bg-blue-500/10 hover:text-blue-600"
                            >
                              <Edit className="h-4 w-4" />
                            </button>

                            {organization.is_active ? (
                              <button
                                onClick={() => setDeleteConfirm(organization.id)}
                                title="Deactivate"
                                className="rounded-md p-2 text-[var(--text-muted)] transition-all hover:bg-red-500/10 hover:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() => void handleReactivate(organization.id)}
                                title="Reactivate"
                                className="rounded-md p-2 text-[var(--text-muted)] transition-all hover:bg-green-500/10 hover:text-green-600"
                              >
                                <RefreshCw className="h-4 w-4" />
                              </button>
                            )}

                            <button
                              onClick={() => setExpandedOrg(isExpanded ? null : organization.id)}
                              className="rounded-md p-2 text-[var(--text-muted)] transition-all hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)]"
                            >
                              {isExpanded ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </motion.tr>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.tr
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-[var(--surface-1)]"
                          >
                            <td colSpan={5} className="px-4 py-3">
                              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-sm">
                                <div className="rounded-md border border-[var(--surface-border)] bg-[var(--surface-0)] p-3">
                                  <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">Branches</p>
                                  <p className="mt-1 text-[var(--text-primary)]">{organization._count?.branches ?? 0}</p>
                                </div>
                                <div className="rounded-md border border-[var(--surface-border)] bg-[var(--surface-0)] p-3">
                                  <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">Employees</p>
                                  <p className="mt-1 text-[var(--text-primary)]">{organization._count?.employees ?? 0}</p>
                                </div>
                                <div className="rounded-md border border-[var(--surface-border)] bg-[var(--surface-0)] p-3">
                                  <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">Assets</p>
                                  <p className="mt-1 text-[var(--text-primary)]">{organization._count?.assets ?? 0}</p>
                                </div>
                              </div>
                            </td>
                          </motion.tr>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>

          <div className="flex items-center justify-between gap-3 border-t border-[var(--surface-border)] px-4 py-3 text-xs text-[var(--text-muted)]">
            <span>
              Page {pagination.page} of {pagination.totalPages} · {pagination.total} organization(s)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={loading || page <= 1}
                className="rounded-md border border-[var(--surface-border)] bg-[var(--surface-1)] px-3 py-2 font-semibold text-[var(--text-primary)] disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((current) => Math.min(pagination.totalPages || current + 1, current + 1))}
                disabled={loading || page >= (pagination.totalPages || 1)}
                className="rounded-md border border-[var(--surface-border)] bg-[var(--surface-1)] px-3 py-2 font-semibold text-[var(--text-primary)] disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 360, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="overflow-hidden rounded-lg border border-[var(--surface-border)] bg-[var(--surface-0)] shadow-lg"
          >
            <div className="flex h-full flex-col p-6">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                  {editingOrganization ? 'Edit Organization' : 'New Organization'}
                </h3>
                <button
                  onClick={closeForm}
                  title="Close panel"
                  aria-label="Close panel"
                  className="rounded-full p-2 text-[var(--text-muted)] transition hover:bg-[var(--surface-2)]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                    Organization Name
                  </label>
                  <input
                    value={formData.name}
                    onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
                    placeholder="Organization Name"
                    className="w-full rounded-md border border-[var(--surface-border)] bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:ring-1 focus:ring-[var(--brand-600)]"
                  />
                  <p className="mt-1 text-xs text-[var(--text-muted)]">
                    Example: the customer, company, or tenant that owns all sites.
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                    Industry
                  </label>
                  <input
                    value={formData.industry_type}
                    onChange={(event) =>
                      setFormData((current) => ({ ...current, industry_type: event.target.value }))
                    }
                    placeholder="e.g. Logistics, Healthcare, IT"
                    className="w-full rounded-md border border-[var(--surface-border)] bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:ring-1 focus:ring-[var(--brand-600)]"
                  />
                  <p className="mt-1 text-xs text-[var(--text-muted)]">
                    Optional. This helps classify the account in reports and admin views.
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeForm}
                    disabled={saving}
                    className="flex-1 rounded-md border border-[var(--surface-border)] px-4 py-2 text-[var(--text-primary)] transition hover:bg-[var(--surface-1)] disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleSaveOrganization()}
                    disabled={saving}
                    className="flex-1 rounded-md bg-[var(--brand-600)] px-4 py-2 text-white transition hover:bg-[var(--brand-700)] disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteConfirm !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mx-4 w-full max-w-sm rounded-lg bg-[var(--surface-0)] p-6 shadow-lg"
            >
              <h3 className="mb-2 text-lg font-semibold text-[var(--text-primary)]">Deactivate Organization?</h3>
              <p className="mb-6 text-sm text-[var(--text-muted)]">
                This will hide the organization from active views. You can reactivate it later.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  disabled={saving}
                  className="flex-1 rounded-md border border-[var(--surface-border)] px-4 py-2 font-medium text-[var(--text-primary)] hover:bg-[var(--surface-1)] disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => void handleDeactivate(deleteConfirm)}
                  disabled={saving}
                  className="flex-1 rounded-md bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {saving ? 'Deactivating...' : 'Deactivate'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrganizationManagement;
