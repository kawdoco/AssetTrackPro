import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, Plus, Edit, Trash2, AlertCircle, RefreshCw, ChevronDown, ChevronUp } from '@/icons/lucideMuiAdapter';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '@/store';
import { buildingService } from '../../services/buildingService';
import type { Building } from '../../services/buildingService';
import { ZoneForm } from './zone-form';
import { SetupWorkflowGuide } from './setup-workflow-guide';
import {
  createZone,
  deleteZone,
  fetchZones,
  selectZones,
  selectZonesError,
  selectZonesLoading,
  updateZone,
} from '@/store/slices/zoneSlice';
import type { Zone } from '@/services/zoneService';

export const ZoneManagement = () => {
  const dispatch = useDispatch<AppDispatch>();
  const zones = useSelector(selectZones);
  const loading = useSelector(selectZonesLoading);
  const storeError = useSelector(selectZonesError);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [expandedZone, setExpandedZone] = useState<number | null>(null);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [zoneTypeFilter, setZoneTypeFilter] = useState<string>('');

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [editingZone, setEditingZone] = useState<Zone | undefined>();

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const getErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
      return error.response?.data?.message || error.message;
    }
    return error instanceof Error ? error.message : 'An unknown error occurred';
  };

  // Fetch buildings for dropdown
  const fetchBuildings = async () => {
    try {
      const response = await buildingService.getBuildings(1, 100, '');
      if (response.success && Array.isArray(response.data)) {
        setBuildings(response.data as Building[]);
      }
    } catch (err) {
      console.error('Error fetching buildings:', err);
    }
  };

  useEffect(() => {
    fetchBuildings();
  }, []);

  useEffect(() => {
    void dispatch(fetchZones({ page, limit: 10, search: searchTerm, zone_type: zoneTypeFilter || undefined }));
  }, [dispatch, page, zoneTypeFilter]);

  // Handle search
  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    setPage(1);
    await dispatch(fetchZones({ page: 1, limit: 10, search: term, zone_type: zoneTypeFilter || undefined }));
  };

  // Handle create/edit
  const handleOpenForm = (zone?: Zone) => {
    setEditingZone(zone);
    setShowForm(true);
  };

  const handleSubmitForm = async (data: { building_id: number; zone_name: string; zone_type: string; description?: string }) => {
    try {
      setFormLoading(true);

      if (editingZone) {
        await dispatch(
          updateZone({
            id: editingZone.id,
            data: {
              zone_name: data.zone_name,
              zone_type: data.zone_type,
              description: data.description,
            },
          }),
        ).unwrap();
      } else {
        await dispatch(createZone(data)).unwrap();
      }

      setShowForm(false);
      setEditingZone(undefined);
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
      await dispatch(deleteZone(id)).unwrap();
      setDeleteConfirm(null);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setFormLoading(false);
    }
  };

  const getZoneTypeColor = (zoneType: string) => {
    switch (zoneType) {
      case 'STORAGE':
        return 'bg-blue-100 text-blue-700';
      case 'OFFICE':
        return 'bg-green-100 text-green-700';
      case 'EXIT':
        return 'bg-red-100 text-red-700';
      case 'SECURE':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="flex h-full gap-4 relative">
      <div className="flex-1 flex flex-col gap-4">
        <SetupWorkflowGuide
          activeStep="zones"
          counts={{
            buildings: buildings.length,
            zones: zones.length,
          }}
        />

        {/* Header */}
        <div className="flex justify-between items-center mb-1">
          <div>
            <h2 className="text-base font-semibold text-[var(--text-primary)]">Zones</h2>
            <p className="text-xs text-[var(--text-muted)]">
              Define rooms or areas inside buildings. Gates attach to zones, so create zones before gates.
            </p>
          </div>
          <button
            onClick={() => handleOpenForm()}
            title="Create a trackable area inside a building."
            className="flex items-center gap-2 px-3 py-2 bg-[var(--brand-600)] text-white rounded-md text-sm font-semibold hover:bg-[var(--brand-700)] transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Zone
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search zones by name or description..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="flex-1 px-3 py-2 border border-[var(--surface-border)] bg-[var(--surface-1)] rounded-md text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-600)]"
          />
          <select
            value={zoneTypeFilter}
            title="Filter by the operational role of the zone."
            onChange={(e) => {
              setZoneTypeFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 border border-[var(--surface-border)] bg-[var(--surface-1)] rounded-md text-sm text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-600)]"
          >
            <option value="">All Types</option>
            <option value="STORAGE">Storage</option>
            <option value="OFFICE">Office</option>
            <option value="EXIT">Exit</option>
            <option value="SECURE">Secure</option>
          </select>
        </div>

        {/* Error Message */}
        {(error || storeError) && (
          <div className="flex gap-2 p-3 bg-red-100/10 border border-red-500/20 rounded-md">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600">{error || storeError}</p>
          </div>
        )}

        {/* Table */}
        <div className="bg-[var(--surface-0)] rounded-lg border border-[var(--surface-border)] shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-[var(--surface-0)]/95 backdrop-blur-sm border-b border-[var(--surface-border)]">
              <tr>
                <th className="px-4 py-3 text-[10px] text-[var(--text-muted)] uppercase tracking-widest">Zone</th>
                <th className="px-4 py-3 text-[10px] text-[var(--text-muted)] uppercase tracking-widest">Building</th>
                <th className="px-4 py-3 text-[10px] text-[var(--text-muted)] uppercase tracking-widest">Type</th>
                <th className="px-4 py-3 text-[10px] text-[var(--text-muted)] uppercase tracking-widest">Description</th>
                <th className="px-4 py-3 text-[10px] text-[var(--text-muted)] uppercase tracking-widest">Gates</th>
                <th className="px-4 py-3 text-[10px] text-[var(--text-muted)] uppercase tracking-widest">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[var(--surface-border)]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center">
                    <p className="text-sm text-[var(--text-muted)]">Loading zones...</p>
                  </td>
                </tr>
              ) : zones.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center">
                    <p className="text-sm text-[var(--text-muted)]">No zones found. Create one to get started.</p>
                  </td>
                </tr>
              ) : (
                zones.map((zone) => (
                  <motion.tr
                    key={zone.id}
                    whileHover={{ backgroundColor: 'var(--surface-2)' }}
                    className={`transition-colors ${expandedZone === zone.id ? 'bg-[var(--brand-200)]/30' : ''}`}
                  >
                    <td className="px-4 py-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-md bg-[var(--surface-2)] border border-[var(--surface-border)] flex items-center justify-center flex-shrink-0">
                        <Globe className="w-4 h-4 text-[var(--text-muted)]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--text-primary)]">{zone.zone_name}</p>
                        <p className="text-[10px] text-[var(--text-muted)]">
                          {new Date(zone.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-xs text-[var(--text-muted)]">
                      <div>
                        <p className="font-medium">{zone.building?.name || '-'}</p>
                        {zone.building?.branch && (
                          <p className="text-[10px]">{zone.building.branch.name}</p>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getZoneTypeColor(zone.zone_type)}`}>
                        {zone.zone_type}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-xs text-[var(--text-muted)] max-w-xs truncate">
                      {zone.description || '-'}
                    </td>

                    <td className="px-4 py-3">
                      <span className="bg-[var(--surface-2)] px-2 py-1 rounded text-xs text-[var(--text-primary)]">
                        {zone._count?.gates || 0} Gates
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenForm(zone)}
                          title="Edit"
                          className="p-2 rounded-md text-[var(--text-muted)] hover:bg-blue-500/10 hover:text-blue-600 transition-all"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setDeleteConfirm(zone.id)}
                          title="Delete"
                          className="p-2 rounded-md text-[var(--text-muted)] hover:bg-red-500/10 hover:text-red-600 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setExpandedZone(expandedZone === zone.id ? null : zone.id)}
                          className="p-2 rounded-md text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)] transition-all"
                        >
                          {expandedZone === zone.id ? (
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

      {/* Zone Form Modal */}
      <ZoneForm
        isOpen={showForm}
        isLoading={formLoading}
        buildings={buildings}
        initialData={editingZone}
        onSubmit={handleSubmitForm}
        onClose={() => {
          setShowForm(false);
          setEditingZone(undefined);
        }}
        title={editingZone ? 'Edit Zone' : 'Create Zone'}
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
                Delete Zone?
              </h3>
              <p className="text-sm text-[var(--text-muted)] mb-6">
                This action will permanently delete the zone and all associated gates. This cannot be undone.
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
                  {formLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ZoneManagement;