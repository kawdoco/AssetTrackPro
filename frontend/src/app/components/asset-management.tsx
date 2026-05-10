import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Filter, Download, MoreHorizontal,
  Box, MapPin, History,
  ArrowUpRight, ArrowDownRight, AlertTriangle,
  Plus,
  X
} from '@/icons/lucideMuiAdapter';

import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store';
import {
  fetchAssetAssignments,
  fetchAssets,
  createAsset,
  selectAllAssets,
  selectAssetsError,
  selectAssetsLoading,
  selectAssetAssignments,
  selectSelectedAsset,
  setSelectedAsset,
  type Asset,
} from '@/store/slices/assetSlice';

import axios from 'axios';

const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
  ACTIVE: { bg: 'bg-blue-50', text: 'text-[#248AFF]', label: 'Active' },
  LOST: { bg: 'bg-rose-50', text: 'text-rose-600', label: 'Lost' },
  RECOVERED: { bg: 'bg-blue-50', text: 'text-[#248AFF]', label: 'Recovered' },
  RETIRED: { bg: 'bg-amber-50', text: 'text-amber-600', label: 'Retired' },
  UNKNOWN: { bg: 'bg-amber-50', text: 'text-amber-600', label: 'Unknown' },
};

const formatLastSeen = (iso: string | null) => {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString();
};

const generateAssetTagUid = () => {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
  } catch {
    // ignore
  }

  // Fallback: not a true UUID, but good enough for local uniqueness.
  return `asset-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const AssetManagement = () => {
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector(selectAssetsLoading);
  const error = useSelector(selectAssetsError);
  const assets = useSelector(selectAllAssets);
  const selectedAsset = useSelector(selectSelectedAsset);

  const [search, setSearch] = useState('');

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [assetTagMode, setAssetTagMode] = useState<'auto' | 'manual'>('auto');
  const [generatedAssetTagUid, setGeneratedAssetTagUid] = useState(generateAssetTagUid());
  const [formData, setFormData] = useState({
    asset_tag_uid: '',
    asset_type: '',
    model: '',
    serial_number: '',
    status: 'ACTIVE',
  });

  const getErrorMessage = (value: unknown): string => {
    if (axios.isAxiosError(value)) {
      return value.response?.data?.message || value.message;
    }

    if (typeof value === 'string') return value;
    return value instanceof Error ? value.message : 'An unknown error occurred';
  };

  useEffect(() => {
    dispatch(fetchAssets({}));
  }, [dispatch]);

  useEffect(() => {
    if (!selectedAsset) return;
    dispatch(fetchAssetAssignments({ assetId: selectedAsset.id, active: true }));
  }, [dispatch, selectedAsset]);

  const selectedAssetAssignments = useSelector((state: RootState) =>
    selectedAsset ? selectAssetAssignments(state, selectedAsset.id) : []
  );

  const currentHolder = useMemo(() => {
    const active = selectedAssetAssignments.find((assignment) => assignment.returned_at === null);
    return active?.employee?.name || null;
  }, [selectedAssetAssignments]);

  const filteredAssets = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return assets;
    return assets.filter((asset: Asset) => {
      const haystack = [
        asset.asset_tag_uid,
        asset.asset_type,
        asset.model || '',
        asset.serial_number || '',
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(term);
    });
  }, [assets, search]);

  const openCreateForm = () => {
    setFormError('');
    setAssetTagMode('auto');
    setGeneratedAssetTagUid(generateAssetTagUid());
    setFormData({
      asset_tag_uid: '',
      asset_type: '',
      model: '',
      serial_number: '',
      status: 'ACTIVE',
    });
    dispatch(setSelectedAsset(null));
    setShowCreateForm(true);
  };

  const closeCreateForm = () => {
    setShowCreateForm(false);
    setFormError('');
  };

  const handleCreateAsset = async () => {
    const assetTagUid =
      assetTagMode === 'auto' ? generatedAssetTagUid : formData.asset_tag_uid.trim();

    if (!assetTagUid || !formData.asset_type.trim()) {
      setFormError('Asset Tag UID and Asset Type are required');
      return;
    }

    try {
      setSaving(true);
      setFormError('');

      await dispatch(
        createAsset({
          asset_tag_uid: assetTagUid,
          asset_type: formData.asset_type.trim(),
          model: formData.model.trim() || undefined,
          serial_number: formData.serial_number.trim() || undefined,
          status: formData.status,
        })
      ).unwrap();

      await dispatch(fetchAssets({}));
      closeCreateForm();
    } catch (createError) {
      setFormError(getErrorMessage(createError));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-full gap-4 overflow-hidden">
      {/* List Section */}
      <div className={`flex-1 flex flex-col transition-all duration-500 ${selectedAsset ? 'w-2/3' : 'w-full'}`}>
        <div className="bg-[var(--surface-0)] rounded-lg border border-[var(--surface-border)] shadow-sm flex-1 flex flex-col overflow-hidden">
          {/* Header Controls */}
          <div className="p-4 border-b border-[var(--surface-border)] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <h2 className="text-base font-semibold text-[var(--text-primary)]">Asset Inventory</h2>
              <div className="flex bg-[var(--surface-2)] p-1 rounded-md border border-[var(--surface-border)]">
                <button className="px-3 py-1.5 text-xs font-semibold bg-[var(--surface-0)] text-[var(--brand-600)] rounded-md shadow-sm border border-[var(--surface-border)]">All Assets</button>
                <button className="px-3 py-1.5 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">By Zone</button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={openCreateForm}
                className="flex items-center gap-2 px-3 py-2 bg-[var(--brand-600)] text-white rounded-md text-xs font-semibold hover:bg-[var(--brand-700)] transition-all"
              >
                <Plus className="w-4 h-4" />
                Add Asset
              </button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type="text"
                  placeholder="Filter by ID, name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-[var(--surface-1)] border border-[var(--surface-border)] rounded-md py-2 pl-9 pr-4 text-xs text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--brand-200)] transition-all outline-none"
                />
              </div>
              <button title="Filter assets" aria-label="Filter assets" className="p-2 bg-[var(--surface-0)] border border-[var(--surface-border)] rounded-md hover:bg-[var(--surface-2)] transition-colors text-[var(--text-secondary)]">
                <Filter className="w-4 h-4" />
              </button>
              <button title="Export assets" aria-label="Export assets" className="p-2 bg-[var(--surface-0)] border border-[var(--surface-border)] rounded-md hover:bg-[var(--surface-2)] transition-colors text-[var(--text-secondary)]">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-[var(--surface-0)]/95 backdrop-blur-sm z-10 border-b border-[var(--surface-border)]">
                <tr>
                  <th className="px-4 py-3 text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest">Asset ID</th>
                  <th className="px-4 py-3 text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest">Description</th>
                  <th className="px-4 py-3 text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest">Current Zone</th>
                  <th className="px-4 py-3 text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest">Status</th>
                  <th className="px-4 py-3 text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest">Last Movement</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--surface-border)]">
                {loading && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-6 text-xs font-medium text-[var(--text-muted)]"
                    >
                      Loading assets...
                    </td>
                  </tr>
                )}

                {!loading && error && (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-xs font-medium text-rose-600">
                      {error}
                    </td>
                  </tr>
                )}

                {!loading && !error && filteredAssets.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-6 text-xs font-medium text-[var(--text-muted)]"
                    >
                      No assets found.
                    </td>
                  </tr>
                )}

                {!loading &&
                  !error &&
                  filteredAssets.map((asset) => (
                  <motion.tr
                    key={asset.id}
                    whileHover={{ backgroundColor: 'var(--surface-2)' }}
                    onClick={() => {
                      setShowCreateForm(false);
                      dispatch(setSelectedAsset(asset));
                    }}
                    className={`cursor-pointer group transition-colors ${selectedAsset?.id === asset.id ? 'bg-[var(--brand-200)]/30' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <span className="text-sm font-semibold text-[var(--text-primary)]">{asset.asset_tag_uid}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-[var(--surface-2)] flex items-center justify-center border border-[var(--surface-border)]">
                          <Box className="w-4 h-4 text-[var(--text-muted)]" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[var(--text-primary)]">{asset.model || asset.asset_type}</p>
                          <p className="text-[10px] font-semibold text-[var(--text-muted)]">{asset.asset_type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                        <span className="text-xs font-medium text-[var(--text-secondary)]">
                          {asset.last_seen_zone?.zone_name || '—'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          (statusStyles[asset.status] || statusStyles.UNKNOWN).bg
                        } ${(statusStyles[asset.status] || statusStyles.UNKNOWN).text}`}
                      >
                        {(statusStyles[asset.status] || statusStyles.UNKNOWN).label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium text-[var(--text-muted)]">
                        {formatLastSeen(asset.last_seen_time)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button title="More actions" aria-label="More actions" className="p-1.5 rounded-md hover:bg-[var(--surface-0)] text-[var(--text-muted)] transition-colors opacity-0 group-hover:opacity-100">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail Side Panel */}
      <AnimatePresence>
        {selectedAsset && !showCreateForm && (
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            className="w-[320px] bg-[var(--surface-0)] rounded-lg border border-[var(--surface-border)] shadow-lg overflow-hidden flex flex-col"
          >
            <div className="p-5 border-b border-[var(--surface-border)] relative">
              <button 
                onClick={() => dispatch(setSelectedAsset(null))}
                title="Close details"
                aria-label="Close details"
                className="absolute top-4 right-4 p-1.5 hover:bg-[var(--surface-2)] rounded-full text-[var(--text-muted)] transition-colors"
              >
              <X className="w-5 h-5" />
              </button>

              <div className="w-14 h-14 bg-[var(--brand-200)]/30 rounded-lg flex items-center justify-center mb-4 border border-[var(--surface-border)]">
                <Box className="w-7 h-7 text-[var(--brand-600)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">
                {selectedAsset.model || selectedAsset.asset_type}
              </h3>
              <p className="text-xs font-semibold text-[var(--text-muted)] mb-4">
                {selectedAsset.asset_tag_uid} • {selectedAsset.asset_type}
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[var(--surface-2)] p-3 rounded-md border border-[var(--surface-border)]">
                  <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1">Current Holder</p>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-[var(--brand-700)] rounded-full flex items-center justify-center text-[8px] text-white font-semibold">
                      {currentHolder ? currentHolder[0] : '—'}
                    </div>
                    <span className="text-xs font-semibold text-[var(--text-primary)]">
                      {currentHolder || 'Unassigned'}
                    </span>
                  </div>
                </div>
                <div className="bg-[var(--surface-2)] p-3 rounded-md border border-[var(--surface-border)]">
                  <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1">Status</p>
                  <span
                    className={`text-xs font-semibold ${
                      (statusStyles[selectedAsset.status] || statusStyles.UNKNOWN).text
                    }`}
                  >
                    {(statusStyles[selectedAsset.status] || statusStyles.UNKNOWN).label}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1 p-5 overflow-y-auto scrollbar-hide">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold text-[var(--text-primary)] flex items-center gap-2">
                    <History className="w-4 h-4" />
                    Movement History
                  </h4>
                  <button className="text-[10px] font-semibold text-[var(--brand-600)] uppercase">Full Report</button>
                </div>

                <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1.5px] before:bg-[var(--surface-border)]">
                  {[
                    { type: 'entry', zone: 'Warehouse A', time: 'Today, 10:42 AM', icon: ArrowDownRight, color: 'text-emerald-500' },
                    { type: 'exit', zone: 'Section B', time: 'Today, 09:15 AM', icon: ArrowUpRight, color: 'text-rose-500' },
                    { type: 'entry', zone: 'Section B', time: 'Yesterday, 04:30 PM', icon: ArrowDownRight, color: 'text-emerald-500' },
                  ].map((event, i) => (
                    <div key={i} className="relative flex gap-5 pl-8">
                      <div className={`absolute left-0 top-1 w-6 h-6 rounded-md bg-[var(--surface-0)] border border-[var(--surface-border)] flex items-center justify-center z-10 shadow-sm`}>
                        <event.icon className={`w-3 h-3 ${event.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-[var(--text-primary)] mb-0.5">
                          {event.type === 'entry' ? 'Entered' : 'Exited'} {event.zone}
                        </p>
                        <p className="text-[10px] font-medium text-[var(--text-muted)]">{event.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[var(--brand-700)] rounded-lg p-4 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  <p className="text-xs font-semibold">Action Required</p>
                </div>
                <p className="text-xs text-blue-100 mb-4 leading-relaxed">
                  Asset has been in Warehouse A for more than 48 hours without update. Perform physical audit or re-assign.
                </p>
                <button className="w-full py-2.5 bg-white text-[var(--brand-700)] rounded-md font-semibold text-xs hover:bg-[var(--surface-2)] transition-colors">
                  Assign to Employee
                </button>
              </div>
            </div>

            <div className="p-5 border-t border-[var(--surface-border)] grid grid-cols-2 gap-3">
              <button className="py-2.5 px-4 bg-[var(--surface-0)] border border-[var(--surface-border)] rounded-md font-semibold text-xs text-[var(--text-primary)] hover:bg-[var(--surface-2)] transition-colors">
                Recover Asset
              </button>
              <button className="py-2.5 px-4 bg-[var(--brand-600)] text-white rounded-md font-semibold text-xs hover:bg-[var(--brand-700)] transition-colors">
                Update Status
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Side Panel */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            className="w-[360px] bg-[var(--surface-0)] rounded-lg border border-[var(--surface-border)] shadow-lg overflow-hidden flex flex-col"
          >
            <div className="p-5 border-b border-[var(--surface-border)] relative">
              <button
                onClick={closeCreateForm}
                title="Close create"
                aria-label="Close create"
                className="absolute top-4 right-4 p-1.5 hover:bg-[var(--surface-2)] rounded-full text-[var(--text-muted)] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">New Asset</h3>
              <p className="text-xs font-semibold text-[var(--text-muted)]">Create a new asset in inventory</p>
            </div>

            <div className="flex-1 p-5 overflow-y-auto">
              {formError && (
                <div className="mb-4 rounded-md border border-red-500/20 bg-red-100/10 p-3 text-xs text-red-600">
                  {formError}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-xs font-semibold text-[var(--text-primary)]">
                    Asset Tag UID
                  </label>
                  <div className="flex items-center gap-3 mb-2">
                    <button
                      type="button"
                      onClick={() => setAssetTagMode('auto')}
                      className={`rounded-md px-3 py-2 text-xs font-semibold transition-all ${
                        assetTagMode === 'auto'
                          ? 'bg-[var(--brand-600)] text-white'
                          : 'border border-[var(--surface-border)] bg-[var(--surface-1)] text-[var(--text-primary)] hover:bg-[var(--surface-2)]'
                      }`}
                    >
                      Auto-generate
                    </button>
                    <button
                      type="button"
                      onClick={() => setAssetTagMode('manual')}
                      className={`rounded-md px-3 py-2 text-xs font-semibold transition-all ${
                        assetTagMode === 'manual'
                          ? 'bg-[var(--brand-600)] text-white'
                          : 'border border-[var(--surface-border)] bg-[var(--surface-1)] text-[var(--text-primary)] hover:bg-[var(--surface-2)]'
                      }`}
                    >
                      Manual
                    </button>
                  </div>

                  {assetTagMode === 'auto' ? (
                    <div className="flex gap-2">
                      <input
                        value={generatedAssetTagUid}
                        readOnly
                        className="flex-1 rounded-md border border-[var(--surface-border)] bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setGeneratedAssetTagUid(generateAssetTagUid())}
                        className="rounded-md border border-[var(--surface-border)] bg-[var(--surface-1)] px-3 py-2 text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-2)] transition-all"
                      >
                        Regenerate
                      </button>
                    </div>
                  ) : (
                    <input
                      value={formData.asset_tag_uid}
                      onChange={(e) => setFormData((c) => ({ ...c, asset_tag_uid: e.target.value }))}
                      placeholder="EPC Gen2 RFID or UUID"
                      className="w-full rounded-md border border-[var(--surface-border)] bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:ring-1 focus:ring-[var(--brand-600)]"
                    />
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-[var(--text-primary)]">
                    Asset Type
                  </label>
                  <input
                    value={formData.asset_type}
                    onChange={(e) => setFormData((c) => ({ ...c, asset_type: e.target.value }))}
                    placeholder="LAPTOP, TABLET, PHONE, ..."
                    className="w-full rounded-md border border-[var(--surface-border)] bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:ring-1 focus:ring-[var(--brand-600)]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-[var(--text-primary)]">Model</label>
                  <input
                    value={formData.model}
                    onChange={(e) => setFormData((c) => ({ ...c, model: e.target.value }))}
                    placeholder="Optional"
                    className="w-full rounded-md border border-[var(--surface-border)] bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:ring-1 focus:ring-[var(--brand-600)]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-[var(--text-primary)]">
                    Serial Number
                  </label>
                  <input
                    value={formData.serial_number}
                    onChange={(e) => setFormData((c) => ({ ...c, serial_number: e.target.value }))}
                    placeholder="Optional"
                    className="w-full rounded-md border border-[var(--surface-border)] bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:ring-1 focus:ring-[var(--brand-600)]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-[var(--text-primary)]">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData((c) => ({ ...c, status: e.target.value }))}
                    className="w-full rounded-md border border-[var(--surface-border)] bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:ring-1 focus:ring-[var(--brand-600)]"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="LOST">LOST</option>
                    <option value="RECOVERED">RECOVERED</option>
                    <option value="RETIRED">RETIRED</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-[var(--surface-border)] grid grid-cols-2 gap-3">
              <button
                onClick={closeCreateForm}
                disabled={saving}
                className="py-2.5 px-4 bg-[var(--surface-0)] border border-[var(--surface-border)] rounded-md font-semibold text-xs text-[var(--text-primary)] hover:bg-[var(--surface-2)] transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => void handleCreateAsset()}
                disabled={saving}
                className="py-2.5 px-4 bg-[var(--brand-600)] text-white rounded-md font-semibold text-xs hover:bg-[var(--brand-700)] transition-colors disabled:opacity-50"
              >
                {saving ? 'Creating...' : 'Create'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


