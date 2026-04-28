import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'motion/react';
import { Building2, ChevronDown, ChevronUp, Plus, Edit, Trash2, AlertCircle, RefreshCw } from '@/icons/lucideMuiAdapter';
import * as organizationAPI from '@/services/organizationService';
import { OrganizationForm } from './organization-form';

interface Organization {
  id: number;
  name: string;
  industry_type?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  _count?: {
    branches: number;
    employees: number;
    assets: number;
  };
}

export const OrganizationManagement = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [expandedOrg, setExpandedOrg] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [includeInactive, setIncludeInactive] = useState(false);
  
  // Form states
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | undefined>();
  
  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const getErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
      return error.response?.data?.message || error.message;
    }
    return error instanceof Error ? error.message : 'An unknown error occurred';
  };

  // Fetch organizations
  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await organizationAPI.getOrganizations(page, 10, searchTerm, includeInactive);
      if (response.success && Array.isArray(response.data)) {
        setOrganizations(response.data);
      }
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      console.error('Error fetching organizations:', message, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, [page, includeInactive]);

  // Handle search
  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    setPage(1);
    try {
      setLoading(true);
      const response = await organizationAPI.getOrganizations(1, 10, term, includeInactive);
      if (response.success && Array.isArray(response.data)) {
        setOrganizations(response.data);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Handle create/edit
  const handleOpenForm = (org?: Organization) => {
    setEditingOrg(org);
    setShowForm(true);
  };

  const handleSubmitForm = async (data: { name: string; industry_type?: string }) => {
    try {
      setFormLoading(true);
      
      if (editingOrg) {
        // Update
        const response = await organizationAPI.updateOrganization(editingOrg.id, data);
        if (response.success) {
          setOrganizations(orgs =>
            orgs.map(org => org.id === editingOrg.id ? (response.data as Organization) : org)
          );
        }
      } else {
        // Create
        const response = await organizationAPI.createOrganization(data);
        if (response.success) {
          setOrganizations(orgs => [(response.data as Organization), ...orgs]);
        }
      }
      
      setShowForm(false);
      setEditingOrg(undefined);
    } catch (err) {
      throw err;
    } finally {
      setFormLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    try {
      setFormLoading(true);
      await organizationAPI.deactivateOrganization(id);
      // Update the organization to show as inactive instead of removing
      setOrganizations(orgs =>
        orgs.map(org => org.id === id ? { ...org, is_active: false } : org)
      );
      setDeleteConfirm(null);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setFormLoading(false);
    }
  };

  // Handle reactivate
  const handleReactivate = async (id: number) => {
    try {
      setFormLoading(true);
      await organizationAPI.reactivateOrganization(id);
      // Update the organization to show as active
      setOrganizations(orgs =>
        orgs.map(org => org.id === id ? { ...org, is_active: true } : org)
      );
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="flex h-full gap-4 relative">
      <div className="flex-1 flex flex-col gap-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-1">
          <h2 className="text-base font-semibold text-[var(--text-primary)]">Organizations</h2>
          <button
            onClick={() => handleOpenForm()}
            className="flex items-center gap-2 px-3 py-2 bg-[var(--brand-600)] text-white rounded-md text-sm font-semibold hover:bg-[var(--brand-700)] transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Organization
          </button>
        </div>

        {/* Search */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search organizations..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="flex-1 px-3 py-2 border border-[var(--surface-border)] bg-[var(--surface-1)] rounded-md text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-600)]"
          />
          <button
            onClick={() => setIncludeInactive(!includeInactive)}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
              includeInactive
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
                <th className="px-4 py-3 text-[10px] text-[var(--text-muted)] uppercase tracking-widest">Organization</th>
                <th className="px-4 py-3 text-[10px] text-[var(--text-muted)] uppercase tracking-widest">Industry</th>
                <th className="px-4 py-3 text-[10px] text-[var(--text-muted)] uppercase tracking-widest">Status</th>
                <th className="px-4 py-3 text-[10px] text-[var(--text-muted)] uppercase tracking-widest">Assets</th>
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
                    <p className="text-sm text-[var(--text-muted)]">No organizations found. Create one to get started.</p>
                  </td>
                </tr>
              ) : (
                organizations.map((org) => (
                  <motion.tr
                    key={org.id}
                    whileHover={{ backgroundColor: 'var(--surface-2)' }}
                    className={`transition-colors ${expandedOrg === org.id ? 'bg-[var(--brand-200)]/30' : ''}`}
                  >
                    <td className="px-4 py-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-md bg-[var(--surface-2)] border border-[var(--surface-border)] flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-4 h-4 text-[var(--text-muted)]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--text-primary)]">{org.name}</p>
                        <p className="text-[10px] text-[var(--text-muted)]">
                          {new Date(org.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-xs text-[var(--text-muted)]">
                      {org.industry_type || '-'}
                    </td>

                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        org.is_active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {org.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex gap-3 text-xs">
                        <span className="bg-[var(--surface-2)] px-2 py-1 rounded text-[var(--text-primary)]">
                          {org._count?.assets || 0} Assets
                        </span>
                        <span className="bg-[var(--surface-2)] px-2 py-1 rounded text-[var(--text-primary)]">
                          {org._count?.employees || 0} Employees
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenForm(org)}
                          title="Edit"
                          className="p-2 rounded-md text-[var(--text-muted)] hover:bg-blue-500/10 hover:text-blue-600 transition-all"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        
                        {org.is_active ? (
                          <button
                            onClick={() => setDeleteConfirm(org.id)}
                            title="Deactivate"
                            className="p-2 rounded-md text-[var(--text-muted)] hover:bg-red-500/10 hover:text-red-600 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleReactivate(org.id)}
                            title="Reactivate"
                            className="p-2 rounded-md text-[var(--text-muted)] hover:bg-green-500/10 hover:text-green-600 transition-all"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => setExpandedOrg(expandedOrg === org.id ? null : org.id)}
                          className="p-2 rounded-md text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)] transition-all"
                        >
                          {expandedOrg === org.id ? (
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
      </div>

      {/* Organization Form Modal */}
      <OrganizationForm
        isOpen={showForm}
        isLoading={formLoading}
        initialData={editingOrg}
        onSubmit={handleSubmitForm}
        onClose={() => {
          setShowForm(false);
          setEditingOrg(undefined);
        }}
        title={editingOrg ? 'Edit Organization' : 'Create Organization'}
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
                Deactivate Organization?
              </h3>
              <p className="text-sm text-[var(--text-muted)] mb-6">
                This action will deactivate the organization. You can reactivate it later if needed.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  disabled={formLoading}
                  className="flex-1 px-4 py-2 border border-[var(--surface-border)] rounded-md text-[var(--text-primary)] font-medium hover:bg-[var(--surface-1)] disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  disabled={formLoading}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 disabled:opacity-50"
                >
                  {formLoading ? 'Deactivating...' : 'Deactivate'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

