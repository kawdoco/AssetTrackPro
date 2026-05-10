import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Plus, Edit, Trash2, AlertCircle, RefreshCw, ChevronDown, ChevronUp } from '@/icons/lucideMuiAdapter';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { type AppDispatch, type RootState } from '../../store';
import {
  createBranch,
  deactivateBranch,
  fetchBranches,
  reactivateBranch,
  selectBranches,
  selectBranchesError,
  selectBranchesLoading,
  selectBranchesPagination,
  updateBranch,
} from '../../store/slices/branchSlice';
import * as organizationAPI from '@/services/organizationService';
import type { Branch } from '../../services/branchService';
import { BranchForm } from './branch-form';
import { SetupWorkflowGuide } from './setup-workflow-guide';

interface Organization {
  id: number;
  name: string;
}

export const BranchManagement = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const branches = useSelector((state: RootState) => selectBranches(state));
  const loading = useSelector((state: RootState) => selectBranchesLoading(state));
  const error = useSelector((state: RootState) => selectBranchesError(state));
  const pagination = useSelector((state: RootState) => selectBranchesPagination(state));
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [expandedBranch, setExpandedBranch] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [includeInactive, setIncludeInactive] = useState(false);

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | undefined>();

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const getErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
      return error.response?.data?.message || error.message;
    }
    return error instanceof Error ? error.message : 'An unknown error occurred';
  };

  // Fetch organizations for dropdown
  const fetchOrganizations = async () => {
    try {
      const response = await organizationAPI.getOrganizations(1, 100, '', false);
      if (response.success && Array.isArray(response.data)) {
        setOrganizations(response.data as Organization[]);
      }
    } catch (err) {
      console.error('Error fetching organizations:', err);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  useEffect(() => {
    dispatch(
      fetchBranches({
        page,
        limit: 10,
        search: searchTerm.trim(),
        includeInactive,
      }),
    );
  }, [dispatch, page, searchTerm, includeInactive]);

  // Handle create/edit
  const handleOpenForm = (branch?: Branch) => {
    setEditingBranch(branch);
    setShowForm(true);
  };

  const handleSubmitForm = async (data: { organization_id: number; name: string; city: string }) => {
    try {
      if (editingBranch) {
        await dispatch(
          updateBranch({
            id: editingBranch.id,
            data: {
              name: data.name,
              city: data.city,
            },
          }),
        ).unwrap();
      } else {
        await dispatch(createBranch(data)).unwrap();
      }

      setShowForm(false);
      setEditingBranch(undefined);
    } catch (err) {
      throw err;
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    try {
      await dispatch(deactivateBranch(id)).unwrap();
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Error deactivating branch:', getErrorMessage(err));
    }
  };

  // Handle reactivate
  const handleReactivate = async (id: number) => {
    try {
      await dispatch(reactivateBranch(id)).unwrap();
    } catch (err) {
      console.error('Error reactivating branch:', getErrorMessage(err));
    }
  };

  return (
    <div className="flex h-full gap-4 relative">
      <div className="flex-1 flex flex-col gap-4">
        <SetupWorkflowGuide
          activeStep="branches"
          counts={{
            organizations: organizations.length,
            branches: branches.length,
          }}
        />

        {/* Header */}
        <div className="flex justify-between items-center mb-1">
          <div>
            <h2 className="text-base font-semibold text-[var(--text-primary)]">Branches</h2>
            <p className="text-xs text-[var(--text-muted)]">
              Create each physical site under an organization before adding buildings or drawing the branch map.
            </p>
          </div>
          <button
            onClick={() => handleOpenForm()}
            title="Add a physical site or campus under an existing organization."
            className="flex items-center gap-2 px-3 py-2 bg-[var(--brand-600)] text-white rounded-md text-sm font-semibold hover:bg-[var(--brand-700)] transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Branch
          </button>
        </div>

        {/* Search */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search branches by name or city..."
            value={searchTerm}
            onChange={(e) => {
              setPage(1);
              setSearchTerm(e.target.value);
            }}
            className="flex-1 px-3 py-2 border border-[var(--surface-border)] bg-[var(--surface-1)] rounded-md text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-600)]"
          />
          <button
            onClick={() => {
              setPage(1);
              setIncludeInactive((current) => !current);
            }}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${includeInactive
              ? 'bg-[var(--brand-600)] text-white'
              : 'bg-[var(--surface-1)] border border-[var(--surface-border)] text-[var(--text-primary)] hover:bg-[var(--surface-2)]'
              }`}
          >
            {includeInactive ? 'Hide Inactive' : 'Show Inactive'}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex gap-2 p-3 bg-red-100/10 border border-red-500/20 rounded-md">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Table */}
        <div className="bg-[var(--surface-0)] rounded-lg border border-[var(--surface-border)] shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-[var(--surface-0)]/95 backdrop-blur-sm border-b border-[var(--surface-border)]">
              <tr>
                <th className="px-4 py-3 text-[10px] text-[var(--text-muted)] uppercase tracking-widest">Branch</th>
                <th className="px-4 py-3 text-[10px] text-[var(--text-muted)] uppercase tracking-widest">Organization</th>
                <th className="px-4 py-3 text-[10px] text-[var(--text-muted)] uppercase tracking-widest">City</th>
                <th className="px-4 py-3 text-[10px] text-[var(--text-muted)] uppercase tracking-widest">Status</th>
                <th className="px-4 py-3 text-[10px] text-[var(--text-muted)] uppercase tracking-widest">Buildings</th>
                <th className="px-4 py-3 text-[10px] text-[var(--text-muted)] uppercase tracking-widest">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[var(--surface-border)]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center">
                    <p className="text-sm text-[var(--text-muted)]">Loading branches...</p>
                  </td>
                </tr>
              ) : branches.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center">
                    <p className="text-sm text-[var(--text-muted)]">No branches found. Create one to get started.</p>
                  </td>
                </tr>
              ) : (
                branches.map((branch) => (
                  <motion.tr
                    key={branch.id}
                    whileHover={{ backgroundColor: 'var(--surface-2)' }}
                    className={`transition-colors ${expandedBranch === branch.id ? 'bg-[var(--brand-200)]/30' : ''}`}
                  >
                    <td className="px-4 py-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-md bg-[var(--surface-2)] border border-[var(--surface-border)] flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-4 h-4 text-[var(--text-muted)]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--text-primary)]">{branch.name}</p>
                        <p className="text-[10px] text-[var(--text-muted)]">
                          {new Date(branch.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-xs text-[var(--text-muted)]">
                      {branch.organization?.name || '-'}
                    </td>

                    <td className="px-4 py-3 text-xs text-[var(--text-muted)] font-medium">
                      {branch.city}
                    </td>

                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${branch.status === 'ACTIVE'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                        }`}>
                        {branch.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span className="bg-[var(--surface-2)] px-2 py-1 rounded text-xs text-[var(--text-primary)]">
                        {branch._count?.buildings || 0} Buildings
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/branches/${branch.id}/map`)}
                          title="Open the Map Editor to draw branch boundaries and place gate markers."
                          className="rounded-md border border-[var(--surface-border)] px-3 py-2 text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-2)] transition-all"
                        >
                          Map
                        </button>
                        <button
                          onClick={() => handleOpenForm(branch)}
                          title="Edit"
                          className="p-2 rounded-md text-[var(--text-muted)] hover:bg-blue-500/10 hover:text-blue-600 transition-all"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {branch.status === 'ACTIVE' ? (
                          <button
                            onClick={() => setDeleteConfirm(branch.id)}
                            title="Deactivate"
                            className="p-2 rounded-md text-[var(--text-muted)] hover:bg-red-500/10 hover:text-red-600 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleReactivate(branch.id)}
                            title="Reactivate"
                            className="p-2 rounded-md text-[var(--text-muted)] hover:bg-green-500/10 hover:text-green-600 transition-all"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => setExpandedBranch(expandedBranch === branch.id ? null : branch.id)}
                          className="p-2 rounded-md text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)] transition-all"
                        >
                          {expandedBranch === branch.id ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between gap-3 text-xs text-[var(--text-muted)]">
          <span>
            Page {pagination.page} of {pagination.totalPages} · {pagination.total} branch(es)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page <= 1 || loading}
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

      {/* Branch Form Modal */}
      <BranchForm
        isOpen={showForm}
        isLoading={loading}
        organizations={organizations}
        initialData={editingBranch}
        onSubmit={handleSubmitForm}
        onClose={() => {
          setShowForm(false);
          setEditingBranch(undefined);
        }}
        title={editingBranch ? 'Edit Branch' : 'Create Branch'}
      />

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm !== null && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[var(--surface-0)] rounded-lg shadow-lg max-w-sm w-full mx-4 p-6"
            >
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                Deactivate Branch?
              </h3>
              <p className="text-sm text-[var(--text-muted)] mb-6">
                This action will deactivate the branch. You can reactivate it later if needed.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  disabled={loading}
                  className="flex-1 px-4 py-2 border border-[var(--surface-border)] rounded-md text-[var(--text-primary)] font-medium hover:bg-[var(--surface-1)] disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 disabled:opacity-50"
                >
                  {loading ? 'Deactivating...' : 'Deactivate'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BranchManagement;