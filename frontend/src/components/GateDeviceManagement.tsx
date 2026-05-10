import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
  Activity,
  ArrowRightLeft,
  MapPin,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  Zap,
} from '@/icons/lucideMuiAdapter';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '@/store';
import type { Gate, GatePayload } from '@/services/gateService';
import type { ReaderDevice, ReaderDevicePayload } from '@/services/readerDeviceService';
import { SetupWorkflowGuide } from './setup-workflow-guide';
import { fetchZones, selectZones } from '@/store/slices/zoneSlice';
import {
  createGate,
  deleteGate,
  fetchGates,
  selectGates,
  selectGatesError,
  selectGatesLoading,
  updateGate,
} from '@/store/slices/gateSlice';
import {
  createReaderDevice,
  deleteReaderDevice,
  fetchReaderDevices,
  selectReaderDevices,
  selectReaderDevicesError,
  selectReaderDevicesLoading,
  updateReaderDevice,
} from '@/store/slices/readerDeviceSlice';

const getErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message;
  }
  return error instanceof Error ? error.message : 'Something went wrong';
};

const emptyGateForm: GatePayload = {
  zone_id: 0,
  gate_name: '',
  direction: 'BOTH',
  reader_model: '',
  latitude: null,
  longitude: null,
  radius_m: 5,
  is_active: true,
};

const emptyDeviceForm: ReaderDevicePayload = {
  gate_id: null,
  device_key: '',
  name: '',
  esp32_mac: '',
  reader_model: 'ESP32_RC522',
  firmware_version: '',
  status: 'ACTIVE',
};

const formatDateTime = (value: string | null) => {
  if (!value) return 'Never';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Never' : date.toLocaleString();
};

export const GateDeviceManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const zones = useSelector(selectZones);
  const gates = useSelector(selectGates);
  const devices = useSelector(selectReaderDevices);
  const gatesLoading = useSelector(selectGatesLoading);
  const readerDevicesLoading = useSelector(selectReaderDevicesLoading);
  const gatesError = useSelector(selectGatesError);
  const readerDevicesError = useSelector(selectReaderDevicesError);
  const loading = gatesLoading || readerDevicesLoading;
  const storeError = gatesError || readerDevicesError;
  const [gateForm, setGateForm] = useState<GatePayload>(emptyGateForm);
  const [deviceForm, setDeviceForm] = useState<ReaderDevicePayload>(emptyDeviceForm);
  const [savingGate, setSavingGate] = useState(false);
  const [savingDevice, setSavingDevice] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [editingGate, setEditingGate] = useState<Gate | null>(null);
  const [editingDevice, setEditingDevice] = useState<ReaderDevice | null>(null);

  const zoneOptions = useMemo(() => zones.filter((zone) => zone.id), [zones]);

  const loadData = async () => {
    try {
      setError('');
      await Promise.all([
        dispatch(fetchZones({ page: 1, limit: 200 })).unwrap(),
        dispatch(fetchGates()).unwrap(),
        dispatch(fetchReaderDevices()).unwrap(),
      ]);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const resetGateForm = () => {
    setGateForm(emptyGateForm);
    setEditingGate(null);
  };

  const resetDeviceForm = () => {
    setDeviceForm(emptyDeviceForm);
    setEditingDevice(null);
  };

  const handleSaveGate = async () => {
    if (!gateForm.zone_id || !gateForm.gate_name.trim()) {
      setError('Select a zone and enter a gate name.');
      return;
    }

    try {
      setSavingGate(true);
      setError('');
      setMessage('');
      const payload = {
        ...gateForm,
        gate_name: gateForm.gate_name.trim(),
        reader_model: gateForm.reader_model || null,
        latitude: gateForm.latitude === null ? null : Number(gateForm.latitude),
        longitude: gateForm.longitude === null ? null : Number(gateForm.longitude),
        radius_m: gateForm.radius_m === null ? null : Number(gateForm.radius_m),
      };

      if (editingGate) {
        await dispatch(updateGate({ id: editingGate.id, data: payload })).unwrap();
        setMessage('Gate updated.');
      } else {
        await dispatch(createGate(payload)).unwrap();
        setMessage('Gate created.');
      }

      resetGateForm();
      await loadData();
    } catch (createError) {
      setError(getErrorMessage(createError));
    } finally {
      setSavingGate(false);
    }
  };

  const handleSaveDevice = async () => {
    if (!deviceForm.device_key.trim() || !deviceForm.name.trim()) {
      setError('Enter a device key and device name.');
      return;
    }

    try {
      setSavingDevice(true);
      setError('');
      setMessage('');
      const payload = {
        ...deviceForm,
        gate_id: deviceForm.gate_id || null,
        device_key: deviceForm.device_key.trim(),
        name: deviceForm.name.trim(),
        esp32_mac: deviceForm.esp32_mac || null,
        reader_model: deviceForm.reader_model || null,
        firmware_version: deviceForm.firmware_version || null,
      };

      if (editingDevice) {
        await dispatch(updateReaderDevice({ id: editingDevice.id, data: payload })).unwrap();
        setMessage('Reader device updated.');
      } else {
        await dispatch(createReaderDevice(payload)).unwrap();
        setMessage('Reader device registered.');
      }

      resetDeviceForm();
      await loadData();
    } catch (createError) {
      setError(getErrorMessage(createError));
    } finally {
      setSavingDevice(false);
    }
  };

  const handleDeleteGate = async (id: number) => {
    try {
      setError('');
      await dispatch(deleteGate(id)).unwrap();
      await loadData();
    } catch (deleteError) {
      setError(getErrorMessage(deleteError));
    }
  };

  const handleDeleteDevice = async (id: number) => {
    try {
      setError('');
      await dispatch(deleteReaderDevice(id)).unwrap();
      await loadData();
    } catch (deleteError) {
      setError(getErrorMessage(deleteError));
    }
  };

  const handleEditGate = (gate: Gate) => {
    setEditingGate(gate);
    setGateForm({
      zone_id: gate.zone_id,
      gate_name: gate.gate_name,
      direction: gate.direction,
      reader_model: gate.reader_model || '',
      latitude: gate.latitude,
      longitude: gate.longitude,
      radius_m: gate.radius_m ?? 5,
      is_active: gate.is_active,
    });
    setMessage('');
    setError('');
  };

  const handleEditDevice = (device: ReaderDevice) => {
    setEditingDevice(device);
    setDeviceForm({
      gate_id: device.gate_id,
      device_key: device.device_key,
      name: device.name,
      esp32_mac: device.esp32_mac || '',
      reader_model: device.reader_model || 'ESP32_RC522',
      firmware_version: device.firmware_version || '',
      status: device.status,
    });
    setMessage('');
    setError('');
  };

  const handleToggleGateActive = async (gate: Gate) => {
    try {
      setError('');
      await dispatch(updateGate({ id: gate.id, data: { is_active: !gate.is_active } })).unwrap();
      setMessage(gate.is_active ? 'Gate deactivated.' : 'Gate activated.');
      await loadData();
    } catch (toggleError) {
      setError(getErrorMessage(toggleError));
    }
  };

  const handleToggleDeviceActive = async (device: ReaderDevice) => {
    try {
      setError('');
      const nextStatus = device.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      await dispatch(updateReaderDevice({ id: device.id, data: { status: nextStatus } })).unwrap();
      setMessage(nextStatus === 'ACTIVE' ? 'Reader activated.' : 'Reader deactivated.');
      await loadData();
    } catch (toggleError) {
      setError(getErrorMessage(toggleError));
    }
  };

  return (
    <div className="space-y-6">
      <SetupWorkflowGuide
        activeStep="gates"
        counts={{
          zones: zones.length,
          gates: gates.length,
        }}
      />

      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-[var(--text-primary)]">Gates & RFID Readers</h2>
          <p className="text-sm text-[var(--text-muted)]">
            Create the physical gate record first, then bind each ESP32/RFID reader to the gate where it is installed.
          </p>
        </div>
        <button
          onClick={() => void loadData()}
          className="inline-flex items-center gap-2 rounded-md border border-[var(--surface-border)] bg-[var(--surface-0)] px-3 py-2 text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-2)]"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {(error || storeError || message) && (
        <div
          className={`rounded-md border px-4 py-3 text-sm ${
            error || storeError
              ? 'border-rose-200 bg-rose-50 text-rose-700'
              : 'border-emerald-200 bg-emerald-50 text-emerald-700'
          }`}
        >
          {error || storeError || message}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section className="rounded-lg border border-[var(--surface-border)] bg-[var(--surface-0)] p-4 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-[var(--brand-600)]" />
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">
              {editingGate ? 'Update Gate' : 'Create Gate'}
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <label className="space-y-1">
              <span className="text-xs font-semibold text-[var(--text-muted)]">Zone</span>
              <select
                value={gateForm.zone_id}
                onChange={(event) => setGateForm((current) => ({ ...current, zone_id: Number(event.target.value) }))}
                className="w-full rounded-md border border-[var(--surface-border)] bg-[var(--surface-1)] px-3 py-2 text-sm outline-none"
              >
                <option value={0}>Select zone</option>
                {zoneOptions.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.zone_name} / {zone.building?.name || 'Building'}
                  </option>
                ))}
              </select>
              <p className="text-xs text-[var(--text-muted)]">
                The gate belongs to this zone. Create buildings and zones first if this list is empty.
              </p>
            </label>

            <label className="space-y-1">
              <span className="text-xs font-semibold text-[var(--text-muted)]">Gate Name</span>
              <input
                value={gateForm.gate_name}
                onChange={(event) => setGateForm((current) => ({ ...current, gate_name: event.target.value }))}
                className="w-full rounded-md border border-[var(--surface-border)] bg-[var(--surface-1)] px-3 py-2 text-sm outline-none"
                placeholder="Main Entrance"
              />
            </label>

            <label className="space-y-1">
              <span className="text-xs font-semibold text-[var(--text-muted)]">Direction</span>
              <select
                value={gateForm.direction}
                onChange={(event) =>
                  setGateForm((current) => ({ ...current, direction: event.target.value as GatePayload['direction'] }))
                }
                className="w-full rounded-md border border-[var(--surface-border)] bg-[var(--surface-1)] px-3 py-2 text-sm outline-none"
              >
                <option value="BOTH">Both</option>
                <option value="ENTRY">Entry</option>
                <option value="EXIT">Exit</option>
              </select>
              <p className="text-xs text-[var(--text-muted)]">
                Use Both for one reader area handling entry and exit events.
              </p>
            </label>

            <label className="space-y-1">
              <span className="text-xs font-semibold text-[var(--text-muted)]">Reader Model</span>
              <input
                value={gateForm.reader_model || ''}
                onChange={(event) => setGateForm((current) => ({ ...current, reader_model: event.target.value }))}
                className="w-full rounded-md border border-[var(--surface-border)] bg-[var(--surface-1)] px-3 py-2 text-sm outline-none"
                placeholder="ESP32_RC522"
              />
            </label>

            <label className="space-y-1">
              <span className="text-xs font-semibold text-[var(--text-muted)]">Latitude</span>
              <input
                type="number"
                value={gateForm.latitude ?? ''}
                onChange={(event) =>
                  setGateForm((current) => ({
                    ...current,
                    latitude: event.target.value ? Number(event.target.value) : null,
                  }))
                }
                className="w-full rounded-md border border-[var(--surface-border)] bg-[var(--surface-1)] px-3 py-2 text-sm outline-none"
              />
            </label>

            <label className="space-y-1">
              <span className="text-xs font-semibold text-[var(--text-muted)]">Longitude</span>
              <input
                type="number"
                value={gateForm.longitude ?? ''}
                onChange={(event) =>
                  setGateForm((current) => ({
                    ...current,
                    longitude: event.target.value ? Number(event.target.value) : null,
                  }))
                }
                className="w-full rounded-md border border-[var(--surface-border)] bg-[var(--surface-1)] px-3 py-2 text-sm outline-none"
              />
            </label>
          </div>

          <button
            onClick={() => void handleSaveGate()}
            disabled={savingGate}
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-[var(--brand-600)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--brand-700)] disabled:opacity-60"
          >
            <Plus className="h-4 w-4" />
            {savingGate ? 'Saving...' : editingGate ? 'Update Gate' : 'Create Gate'}
          </button>
          {editingGate && (
            <button
              onClick={resetGateForm}
              className="ml-2 mt-4 inline-flex items-center gap-2 rounded-md border border-[var(--surface-border)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-2)]"
            >
              Cancel Edit
            </button>
          )}
        </section>

        <section className="rounded-lg border border-[var(--surface-border)] bg-[var(--surface-0)] p-4 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5 text-[var(--brand-600)]" />
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">
              {editingDevice ? 'Update Reader' : 'Register Reader'}
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <label className="space-y-1">
              <span className="text-xs font-semibold text-[var(--text-muted)]">Device Key</span>
              <input
                value={deviceForm.device_key}
                onChange={(event) => setDeviceForm((current) => ({ ...current, device_key: event.target.value }))}
                className="w-full rounded-md border border-[var(--surface-border)] bg-[var(--surface-1)] px-3 py-2 text-sm outline-none"
                placeholder="ESP32-GATE-001"
              />
            </label>

            <label className="space-y-1">
              <span className="text-xs font-semibold text-[var(--text-muted)]">Name</span>
              <input
                value={deviceForm.name}
                onChange={(event) => setDeviceForm((current) => ({ ...current, name: event.target.value }))}
                className="w-full rounded-md border border-[var(--surface-border)] bg-[var(--surface-1)] px-3 py-2 text-sm outline-none"
                placeholder="Main Entrance Reader"
              />
            </label>

            <label className="space-y-1">
              <span className="text-xs font-semibold text-[var(--text-muted)]">Linked Gate</span>
              <select
                value={deviceForm.gate_id ?? ''}
                onChange={(event) =>
                  setDeviceForm((current) => ({
                    ...current,
                    gate_id: event.target.value ? Number(event.target.value) : null,
                  }))
                }
                className="w-full rounded-md border border-[var(--surface-border)] bg-[var(--surface-1)] px-3 py-2 text-sm outline-none"
              >
                <option value="">Unassigned</option>
                {gates.map((gate) => (
                  <option key={gate.id} value={gate.id}>
                    {gate.gate_name} / {gate.zone?.zone_name || 'Zone'}
                  </option>
                ))}
              </select>
              <p className="text-xs text-[var(--text-muted)]">
                Select the gate where this hardware is physically installed.
              </p>
            </label>

            <label className="space-y-1">
              <span className="text-xs font-semibold text-[var(--text-muted)]">ESP32 MAC</span>
              <input
                value={deviceForm.esp32_mac || ''}
                onChange={(event) => setDeviceForm((current) => ({ ...current, esp32_mac: event.target.value }))}
                className="w-full rounded-md border border-[var(--surface-border)] bg-[var(--surface-1)] px-3 py-2 text-sm outline-none"
                placeholder="Optional"
              />
            </label>
          </div>

          <button
            onClick={() => void handleSaveDevice()}
            disabled={savingDevice}
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-[var(--brand-600)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--brand-700)] disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {savingDevice ? 'Saving...' : editingDevice ? 'Update Reader' : 'Register Reader'}
          </button>
          {editingDevice && (
            <button
              onClick={resetDeviceForm}
              className="ml-2 mt-4 inline-flex items-center gap-2 rounded-md border border-[var(--surface-border)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-2)]"
            >
              Cancel Edit
            </button>
          )}
        </section>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section className="rounded-lg border border-[var(--surface-border)] bg-[var(--surface-0)] shadow-sm">
          <div className="border-b border-[var(--surface-border)] p-4">
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">System Gates</h3>
          </div>
          <div className="divide-y divide-[var(--surface-border)]">
            {loading ? (
              <p className="p-4 text-sm text-[var(--text-muted)]">Loading gates...</p>
            ) : gates.length === 0 ? (
              <p className="p-4 text-sm text-[var(--text-muted)]">No gates created yet.</p>
            ) : (
              gates.map((gate) => (
                <div key={gate.id} className="flex items-start justify-between gap-4 p-4">
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{gate.gate_name}</p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {gate.direction} / {gate.zone?.zone_name || 'No zone'} / {gate.zone?.building?.branch?.name || 'No branch'}
                    </p>
                    <p className="mt-1 text-xs text-[var(--text-muted)]">
                      Readers: {gate.reader_devices?.length || 0}
                    </p>
                    <p className={`mt-1 text-xs font-semibold ${gate.is_active ? 'text-emerald-600' : 'text-gray-500'}`}>
                      {gate.is_active ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEditGate(gate)}
                      className="rounded-md px-2 py-1 text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-2)]"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => void handleToggleGateActive(gate)}
                      className="rounded-md px-2 py-1 text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-2)]"
                    >
                      {gate.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => void handleDeleteGate(gate.id)}
                      className="rounded-md p-2 text-[var(--text-muted)] hover:bg-rose-50 hover:text-rose-600"
                      title="Delete gate"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-lg border border-[var(--surface-border)] bg-[var(--surface-0)] shadow-sm">
          <div className="border-b border-[var(--surface-border)] p-4">
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Registered Readers</h3>
          </div>
          <div className="divide-y divide-[var(--surface-border)]">
            {loading ? (
              <p className="p-4 text-sm text-[var(--text-muted)]">Loading readers...</p>
            ) : devices.length === 0 ? (
              <p className="p-4 text-sm text-[var(--text-muted)]">No readers registered yet.</p>
            ) : (
              devices.map((device) => (
                <div key={device.id} className="flex items-start justify-between gap-4 p-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-[var(--brand-600)]" />
                      <p className="text-sm font-semibold text-[var(--text-primary)]">{device.name}</p>
                    </div>
                    <p className="mt-1 text-xs font-semibold text-[var(--text-muted)]">{device.device_key}</p>
                    <p className="text-xs text-[var(--text-muted)]">
                      <ArrowRightLeft className="mr-1 inline h-3 w-3" />
                      {device.gate?.gate_name || 'Unassigned'} / Last seen: {formatDateTime(device.last_seen_at)}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-[var(--brand-600)]">{device.status}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEditDevice(device)}
                      className="rounded-md px-2 py-1 text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-2)]"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => void handleToggleDeviceActive(device)}
                      className="rounded-md px-2 py-1 text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-2)]"
                    >
                      {device.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => void handleDeleteDevice(device.id)}
                      className="rounded-md p-2 text-[var(--text-muted)] hover:bg-rose-50 hover:text-rose-600"
                      title="Delete reader"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default GateDeviceManagement;