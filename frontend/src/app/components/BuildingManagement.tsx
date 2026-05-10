import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Building2, Edit, Plus, RefreshCw, Save, Trash2, X } from '@/icons/lucideMuiAdapter';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '@/store';
import {
  createBuilding,
  deleteBuilding,
  fetchBuildings,
  selectAllBuildings,
  selectBuildingsError,
  selectBuildingsLoading,
  selectBuildingsPagination,
  updateBuilding,
} from '@/store/slices/buildingSlice';
import { getBranches, type Branch } from '@/services/branchService';
import type { Building } from '@/services/buildingService';
import { SetupWorkflowGuide } from './setup-workflow-guide';

const emptyForm = {
  branch_id: 0,
  name: '',
};

const getErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message;
  }
  return error instanceof Error ? error.message : 'Something went wrong';
};

export const BuildingManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const buildings = useSelector(selectAllBuildings);
  const loading = useSelector(selectBuildingsLoading);
  const apiError = useSelector(selectBuildingsError);
  const pagination = useSelector(selectBuildingsPagination);

  const [branches, setBranches] = useState<Branch[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState(0);
  const [page, setPage] = useState(1);
  const [form, setForm] = useState(emptyForm);
  const [editingBuilding, setEditingBuilding] = useState<Building | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [localError, setLocalError] = useState('');
  const [message, setMessage] = useState('');

  const error = localError || apiError || '';

  const branchOptions = useMemo(
    () => branches.filter((branch) => branch.status !== 'INACTIVE'),
    [branches]
  );

  const loadBuildings = (nextPage = page, search = searchTerm, branchId = branchFilter) => {
    void dispatch(
      fetchBuildings({
        page: nextPage,
        limit: 10,
        search,
        branch_id: branchId || undefined,
      })
    );
  };

  useEffect(() => {
    const loadBranches = async () => {
      try {
        const response = await getBranches(1, 200, '', undefined, true);
        setBranches(Array.isArray(response.data) ? response.data : []);
      } catch (branchError) {
        setLocalError(getErrorMessage(branchError));
      }
    };

    void loadBranches();
  }, []);

  useEffect(() => {
    loadBuildings(page, searchTerm, branchFilter);
  }, [page, branchFilter]);

  const openCreateForm = () => {
    setEditingBuilding(null);
    setForm({
      branch_id: branchOptions[0]?.id || 0,
      name: '',
    });
    setShowForm(true);
    setLocalError('');
    setMessage('');
  };

  const openEditForm = (building: Building) => {
    setEditingBuilding(building);
    setForm({
      branch_id: building.branch_id || building.branch?.id || 0,
      name: building.name,
    });
    setShowForm(true);
    setLocalError('');
    setMessage('');
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1);
    loadBuildings(1, value, branchFilter);
  };

  const handleSubmit = async () => {
    if (!form.branch_id || !form.name.trim()) {
      setLocalError('Select a branch and enter a building name.');
      return;
    }

    try {
      setLocalError('');
      setMessage('');

      if (editingBuilding) {
        await dispatch(
          updateBuilding({
            id: editingBuilding.id,
            data: {
              branch_id: form.branch_id,
              name: form.name.trim(),
            },
          })
        ).unwrap();
        setMessage('Building updated.');
      } else {
        await dispatch(
          createBuilding({
            branch_id: form.branch_id,
            name: form.name.trim(),
          })
        ).unwrap();
        setMessage('Building created.');
      }

      setShowForm(false);
      setEditingBuilding(null);
      setForm(emptyForm);
      loadBuildings(1);
    } catch (submitError) {
      setLocalError(String(submitError));
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setLocalError('');
      setMessage('');
      await dispatch(deleteBuilding(id)).unwrap();
      setMessage('Building deleted.');
    } catch (deleteError) {
      setLocalError(String(deleteError));
    }
  };

  return (
    <div className="space-y-6">
      <SetupWorkflowGuide
        activeStep="buildings"
        counts={{
          branches: branches.length,
          buildings: buildings.length,
        }}
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-base font-semibold text-[var(--text-primary)]">Buildings</h2>
          <p className="text-sm text-[var(--text-muted)]">
            Add the structures inside a branch. Zones are created inside buildings, and gates are created inside zones.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => loadBuildings()}
            className="inline-flex items-center gap-2 rounded-md border border-[var(--surface-border)] bg-[var(--surface-0)] px-3 py-2 text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-2)]"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <button
            onClick={openCreateForm}
            title="Create a building inside a branch before creating zones."
            className="inline-flex items-center gap-2 rounded-md bg-[var(--brand-600)] px-3 py-2 text-sm font-semibold text-white hover:bg-[var(--brand-700)]"
          >
            <Plus className="h-4 w-4" />
            Add Building
          </button>
        </div>
      </div>

      {(error || message) && (
        <div
          className={`rounded-md border px-4 py-3 text-sm ${
            error
              ? 'border-rose-200 bg-rose-50 text-rose-700'
              : 'border-emerald-200 bg-emerald-50 text-emerald-700'
          }`}
        >
          {error || message}
        </div>
      )}

      <div className="flex flex-col gap-3 rounded-lg border border-[var(--surface-border)] bg-[var(--surface-0)] p-4 shadow-sm md:flex-row">
        <input
          value={searchTerm}
          onChange={(event) => handleSearch(event.target.value)}
          placeholder="Search buildings..."
          className="flex-1 rounded-md border border-[var(--surface-border)] bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:ring-1 focus:ring-[var(--brand-600)]"
        />
        <select
          value={branchFilter}
          onChange={(event) => {
            setBranchFilter(Number(event.target.value));
            setPage(1);
          }}
          className="rounded-md border border-[var(--surface-border)] bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:ring-1 focus:ring-[var(--brand-600)] md:w-72"
        >
          <option value={0}>All branches</option>
          {branches.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.name} / {branch.city}
            </option>
          ))}
        </select>
      </div>

      {showForm && (
        <section className="rounded-lg border border-[var(--surface-border)] bg-[var(--surface-0)] p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-[var(--brand-600)]" />
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                {editingBuilding ? 'Edit Building' : 'Create Building'}
              </h3>
            </div>
            <button
              onClick={() => setShowForm(false)}
              className="rounded-md p-2 text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)]"
              title="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <label className="space-y-1">
              <span className="text-xs font-semibold text-[var(--text-muted)]">Branch</span>
              <select
                value={form.branch_id}
                onChange={(event) => setForm((current) => ({ ...current, branch_id: Number(event.target.value) }))}
                className="w-full rounded-md border border-[var(--surface-border)] bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none"
              >
                <option value={0}>Select branch</option>
                {branchOptions.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name} / {branch.city}
                  </option>
                ))}
              </select>
              <p className="text-xs text-[var(--text-muted)]">
                Pick the site where this building physically exists.
              </p>
            </label>

            <label className="space-y-1">
              <span className="text-xs font-semibold text-[var(--text-muted)]">Building Name</span>
              <input
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                placeholder="Warehouse A"
                className="w-full rounded-md border border-[var(--surface-border)] bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none"
              />
              <p className="text-xs text-[var(--text-muted)]">
                Use an operational name such as Warehouse A, Admin Block, or Main Store.
              </p>
            </label>
          </div>

          <button
            onClick={() => void handleSubmit()}
            disabled={loading}
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-[var(--brand-600)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--brand-700)] disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {loading ? 'Saving...' : editingBuilding ? 'Save Changes' : 'Create Building'}
          </button>
        </section>
      )}

      <section className="overflow-hidden rounded-lg border border-[var(--surface-border)] bg-[var(--surface-0)] shadow-sm">
        <table className="w-full text-left">
          <thead className="border-b border-[var(--surface-border)] bg-[var(--surface-0)]">
            <tr>
              <th className="px-4 py-3 text-[10px] uppercase tracking-widest text-[var(--text-muted)]">Building</th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-widest text-[var(--text-muted)]">Branch</th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-widest text-[var(--text-muted)]">Created</th>
              <th className="px-4 py-3 text-right text-[10px] uppercase tracking-widest text-[var(--text-muted)]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--surface-border)]">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-sm text-[var(--text-muted)]">
                  Loading buildings...
                </td>
              </tr>
            ) : buildings.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-sm text-[var(--text-muted)]">
                  No buildings found.
                </td>
              </tr>
            ) : (
              buildings.map((building) => (
                <tr key={building.id} className="hover:bg-[var(--surface-2)]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md border border-[var(--surface-border)] bg-[var(--surface-1)]">
                        <Building2 className="h-4 w-4 text-[var(--text-muted)]" />
                      </div>
                      <p className="text-sm font-semibold text-[var(--text-primary)]">{building.name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--text-muted)]">
                    {building.branch?.name || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--text-muted)]">
                    {building.created_at ? new Date(building.created_at).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEditForm(building)}
                        className="rounded-md p-2 text-[var(--text-muted)] hover:bg-blue-50 hover:text-blue-600"
                        title="Edit building"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => void handleDelete(building.id)}
                        className="rounded-md p-2 text-[var(--text-muted)] hover:bg-rose-50 hover:text-rose-600"
                        title="Delete building"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
        <span>
          Page {pagination.page} of {Math.max(1, pagination.totalPages)} / {pagination.total} buildings
        </span>
        <div className="flex gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            className="rounded-md border border-[var(--surface-border)] px-3 py-2 font-semibold disabled:opacity-50"
          >
            Previous
          </button>
          <button
            disabled={page >= Math.max(1, pagination.totalPages)}
            onClick={() => setPage((current) => current + 1)}
            className="rounded-md border border-[var(--surface-border)] px-3 py-2 font-semibold disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuildingManagement;
