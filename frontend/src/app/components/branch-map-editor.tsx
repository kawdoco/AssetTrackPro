import React, { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  CheckIcon,
  MapPin,
  MousePointer2,
  Plus,
  Save,
  Trash2,
} from '@/icons/lucideMuiAdapter';
import {
  getBranchMap,
  updateBranchMap,
  type Branch,
  type BranchGateMarker,
  type MapPoint,
} from '@/services/branchService';
import { loadGoogleMaps } from '@/services/googleMapsLoader';

const DEFAULT_CENTER = { lat: 6.9271, lng: 79.8612 };
const DEFAULT_ZOOM = 17;

type EditorMode = 'pan' | 'draw-boundary' | 'edit-boundary' | 'add-gate';

const buildGateId = () =>
  `gate-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message;
  }

  return error instanceof Error ? error.message : 'An unexpected error occurred.';
};

export const BranchMapEditor: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const branchId = Number.parseInt(id || '', 10);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const polygonRef = useRef<any>(null);
  const polylineRef = useRef<any>(null);
  const mapClickListenerRef = useRef<any>(null);
  const overlayListenersRef = useRef<any[]>([]);
  const gateMarkersRef = useRef<any[]>([]);

  const [branch, setBranch] = useState<Branch | null>(null);
  const [boundaryPoints, setBoundaryPoints] = useState<MapPoint[]>([]);
  const [gateMarkers, setGateMarkers] = useState<BranchGateMarker[]>([]);
  const [mapCenter, setMapCenter] = useState<MapPoint>(DEFAULT_CENTER);
  const [mapZoom, setMapZoom] = useState<number>(DEFAULT_ZOOM);
  const [selectedGateId, setSelectedGateId] = useState<string | null>(null);
  const [mode, setMode] = useState<EditorMode>('pan');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saveMessage, setSaveMessage] = useState('');

  const selectedGate = useMemo(
    () => gateMarkers.find((gate) => gate.id === selectedGateId) ?? null,
    [gateMarkers, selectedGateId]
  );

  useEffect(() => {
    let active = true;

    const bootstrap = async () => {
      if (!Number.isInteger(branchId)) {
        setError('Invalid branch id.');
        setLoading(false);
        return;
      }

      try {
        const [maps, response] = await Promise.all([loadGoogleMaps(), getBranchMap(branchId)]);

        if (!active || !containerRef.current) {
          return;
        }

        const branchData = response.data as Branch;
        setBranch(branchData);

        const nextCenter =
          typeof branchData.map_center_lat === 'number' &&
          typeof branchData.map_center_lng === 'number'
            ? { lat: branchData.map_center_lat, lng: branchData.map_center_lng }
            : DEFAULT_CENTER;

        const nextBoundary = Array.isArray(branchData.boundary_points)
          ? branchData.boundary_points
          : [];
        const nextGates = Array.isArray(branchData.gate_markers)
          ? branchData.gate_markers
          : [];

        setBoundaryPoints(nextBoundary);
        setGateMarkers(nextGates);
        setMapCenter(nextCenter);
        setMapZoom(branchData.map_zoom || DEFAULT_ZOOM);
        setSelectedGateId(nextGates[0]?.id ?? null);

        mapRef.current = new maps.Map(containerRef.current, {
          center: nextCenter,
          zoom: branchData.map_zoom || DEFAULT_ZOOM,
          mapTypeControl: true,
          streetViewControl: false,
          fullscreenControl: true,
        });

        maps.event.addListener(mapRef.current, 'idle', () => {
          const center = mapRef.current?.getCenter?.();
          if (!center) {
            return;
          }

          setMapCenter({ lat: center.lat(), lng: center.lng() });
          setMapZoom(mapRef.current.getZoom() || DEFAULT_ZOOM);
        });
      } catch (bootstrapError) {
        if (!active) {
          return;
        }

        setError(getErrorMessage(bootstrapError));
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    bootstrap();

    return () => {
      active = false;
      if (window.google?.maps) {
        overlayListenersRef.current.forEach((listener) => window.google.maps.event.removeListener(listener));
        if (mapClickListenerRef.current) {
          window.google.maps.event.removeListener(mapClickListenerRef.current);
        }
      }
    };
  }, [branchId]);

  useEffect(() => {
    if (!mapRef.current || !window.google?.maps) {
      return;
    }

    const maps = window.google.maps;

    if (mapClickListenerRef.current) {
      maps.event.removeListener(mapClickListenerRef.current);
    }

    mapClickListenerRef.current = mapRef.current.addListener('click', (event: any) => {
      if (!event.latLng) {
        return;
      }

      const point = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };

      if (mode === 'draw-boundary') {
        setBoundaryPoints((prev) => [...prev, point]);
      }

      if (mode === 'add-gate') {
        const nextGate: BranchGateMarker = {
          id: buildGateId(),
          name: `Gate ${gateMarkers.length + 1}`,
          type: 'BOTH',
          ...point,
        };

        setGateMarkers((prev) => [...prev, nextGate]);
        setSelectedGateId(nextGate.id);
        setMode('pan');
      }
    });
  }, [gateMarkers.length, mode]);

  useEffect(() => {
    if (!mapRef.current || !window.google?.maps) {
      return;
    }

    const maps = window.google.maps;

    overlayListenersRef.current.forEach((listener) => maps.event.removeListener(listener));
    overlayListenersRef.current = [];

    if (polygonRef.current?.setMap) {
      polygonRef.current.setMap(null);
      polygonRef.current = null;
    }

    if (polylineRef.current?.setMap) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }

    if (mode !== 'draw-boundary' && boundaryPoints.length >= 3) {
      const polygon = new maps.Polygon({
        paths: boundaryPoints,
        editable: mode === 'edit-boundary',
        strokeColor: '#2563EB',
        strokeOpacity: 0.95,
        strokeWeight: 2,
        fillColor: '#60A5FA',
        fillOpacity: 0.18,
        map: mapRef.current,
      });

      const syncPath = () => {
        const path = polygon.getPath();
        const nextPoints: MapPoint[] = [];
        for (let index = 0; index < path.getLength(); index += 1) {
          const point = path.getAt(index);
          nextPoints.push({ lat: point.lat(), lng: point.lng() });
        }
        setBoundaryPoints(nextPoints);
      };

      if (mode === 'edit-boundary') {
        overlayListenersRef.current.push(polygon.addListener('mouseup', syncPath));
      }

      polygonRef.current = polygon;
    } else if (boundaryPoints.length > 0) {
      polylineRef.current = new maps.Polyline({
        path: boundaryPoints,
        strokeColor: '#2563EB',
        strokeOpacity: 0.9,
        strokeWeight: 2,
        map: mapRef.current,
      });
    }
  }, [boundaryPoints, mode]);

  useEffect(() => {
    if (!mapRef.current || !window.google?.maps) {
      return;
    }

    const maps = window.google.maps;

    gateMarkersRef.current.forEach((marker) => {
      marker.setMap(null);
    });
    gateMarkersRef.current = [];

    gateMarkers.forEach((gate) => {
      const marker = new maps.Marker({
        position: { lat: gate.lat, lng: gate.lng },
        map: mapRef.current,
        draggable: true,
        title: gate.name,
        label: {
          text: gate.name.slice(0, 1).toUpperCase(),
          color: '#FFFFFF',
          fontWeight: '700',
        },
        icon: {
          path: maps.SymbolPath.BACKWARD_CLOSED_ARROW,
          scale: selectedGateId === gate.id ? 7 : 6,
          fillColor: selectedGateId === gate.id ? '#DC2626' : '#0F172A',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 1.5,
        },
      });

      marker.addListener('click', () => {
        setSelectedGateId(gate.id);
      });

      marker.addListener('dragend', (event: any) => {
        if (!event.latLng) {
          return;
        }

        setGateMarkers((prev) =>
          prev.map((currentGate) =>
            currentGate.id === gate.id
              ? {
                  ...currentGate,
                  lat: event.latLng.lat(),
                  lng: event.latLng.lng(),
                }
              : currentGate
          )
        );
      });

      gateMarkersRef.current.push(marker);
    });
  }, [gateMarkers, selectedGateId]);

  const handleSave = async () => {
    if (!branch) {
      return;
    }

    try {
      setSaving(true);
      setSaveMessage('');
      setError('');

      const response = await updateBranchMap(branch.id, {
        map_center_lat: mapCenter.lat,
        map_center_lng: mapCenter.lng,
        map_zoom: mapZoom,
        boundary_points: boundaryPoints.length >= 3 ? boundaryPoints : null,
        gate_markers: gateMarkers,
      });

      setBranch(response.data as Branch);
      setSaveMessage(response.message || 'Branch map saved.');
      setMode('pan');
    } catch (saveError) {
      setError(getErrorMessage(saveError));
    } finally {
      setSaving(false);
    }
  };

  const handleResetBoundary = () => {
    setBoundaryPoints([]);
    setMode('draw-boundary');
  };

  const handleFinishBoundary = () => {
    if (boundaryPoints.length < 3) {
      setError('Add at least three points to close the branch boundary.');
      return;
    }

    setError('');
    setMode('edit-boundary');
  };

  const handleUpdateSelectedGate = (updates: Partial<BranchGateMarker>) => {
    if (!selectedGateId) {
      return;
    }

    setGateMarkers((prev) =>
      prev.map((gate) => (gate.id === selectedGateId ? { ...gate, ...updates } : gate))
    );
  };

  const handleRemoveSelectedGate = () => {
    if (!selectedGateId) {
      return;
    }

    const nextGateMarkers = gateMarkers.filter((gate) => gate.id !== selectedGateId);
    setGateMarkers(nextGateMarkers);
    setSelectedGateId(nextGateMarkers[0]?.id ?? null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/branches')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--brand-600)] hover:text-[var(--brand-700)]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to branches
          </button>
          <h2 className="mt-2 text-2xl font-semibold text-[var(--text-primary)]">
            {branch?.name || 'Branch'} Map Editor
          </h2>
          <p className="text-sm text-[var(--text-muted)]">
            Draw the branch boundary, place gate markers, and save the map used by the dashboard.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving || !branch}
          className="inline-flex items-center gap-2 rounded-md bg-[var(--brand-600)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--brand-700)] disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Map'}
        </button>
      </div>

      {(error || saveMessage) && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            error
              ? 'border-rose-200 bg-rose-50 text-rose-700'
              : 'border-emerald-200 bg-emerald-50 text-emerald-700'
          }`}
        >
          <div className="flex items-center gap-2">
            {error ? <AlertCircle className="w-4 h-4" /> : <CheckIcon className="w-4 h-4" />}
            <span>{error || saveMessage}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-lg border border-[var(--surface-border)] bg-[var(--surface-0)] p-4 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <button
              onClick={() => setMode('pan')}
              className={editorButtonClass(mode === 'pan')}
            >
              <MousePointer2 className="w-4 h-4" />
              Pan
            </button>
            <button
              onClick={() => {
                setError('');
                setMode('draw-boundary');
              }}
              className={editorButtonClass(mode === 'draw-boundary')}
            >
              <MapPin className="w-4 h-4" />
              Draw Boundary
            </button>
            <button
              onClick={() => setMode('edit-boundary')}
              disabled={boundaryPoints.length < 3}
              className={editorButtonClass(mode === 'edit-boundary')}
            >
              <CheckIcon className="w-4 h-4" />
              Edit Boundary
            </button>
            <button
              onClick={handleFinishBoundary}
              disabled={boundaryPoints.length < 3}
              className={editorSecondaryButtonClass}
            >
              Finish Boundary
            </button>
            <button
              onClick={handleResetBoundary}
              className={editorDangerButtonClass}
            >
              <Trash2 className="w-4 h-4" />
              Clear Boundary
            </button>
            <button
              onClick={() => setMode('add-gate')}
              className={editorButtonClass(mode === 'add-gate')}
            >
              <Plus className="w-4 h-4" />
              Add Gate
            </button>
          </div>

          <div className="mb-3 flex flex-wrap items-center gap-4 text-xs text-[var(--text-muted)]">
            <span>Mode: {mode.replace('-', ' ')}</span>
            <span>Boundary points: {boundaryPoints.length}</span>
            <span>Gates: {gateMarkers.length}</span>
            <span>Zoom: {mapZoom}</span>
          </div>

          <div className="relative h-[700px] overflow-hidden rounded-lg border border-[var(--surface-border)] bg-[var(--surface-1)]">
            <div ref={containerRef} className="absolute inset-0" />
            {loading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-[var(--surface-1)]/85 backdrop-blur-sm">
                <p className="text-sm text-[var(--text-muted)]">Loading branch map editor...</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-[var(--surface-border)] bg-[var(--surface-0)] p-4 shadow-sm">
            <h3 className="text-base font-semibold text-[var(--text-primary)]">Editor Notes</h3>
            <div className="mt-3 space-y-2 text-sm text-[var(--text-muted)]">
              <p>Use `Draw Boundary`, then click the map to place each boundary point.</p>
              <p>Use `Edit Boundary` to drag polygon handles after the boundary exists.</p>
              <p>Use `Add Gate`, then click the map once to place a draggable gate marker.</p>
              <p>The current map center and zoom are saved with the branch.</p>
            </div>
          </div>

          <div className="rounded-lg border border-[var(--surface-border)] bg-[var(--surface-0)] p-4 shadow-sm">
            <h3 className="text-base font-semibold text-[var(--text-primary)]">Selected Gate</h3>
            {selectedGate ? (
              <div className="mt-4 space-y-4">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                    Gate Name
                  </label>
                  <input
                    type="text"
                    value={selectedGate.name}
                    onChange={(event) => handleUpdateSelectedGate({ name: event.target.value })}
                    className="w-full rounded-md border border-[var(--surface-border)] bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-600)]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                    Gate Type
                  </label>
                  <select
                    value={selectedGate.type}
                    onChange={(event) => handleUpdateSelectedGate({ type: event.target.value })}
                    className="w-full rounded-md border border-[var(--surface-border)] bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-600)]"
                  >
                    <option value="ENTRY">ENTRY</option>
                    <option value="EXIT">EXIT</option>
                    <option value="BOTH">BOTH</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm text-[var(--text-muted)]">
                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wide">Latitude</span>
                    <span>{selectedGate.lat.toFixed(6)}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wide">Longitude</span>
                    <span>{selectedGate.lng.toFixed(6)}</span>
                  </div>
                </div>

                <button
                  onClick={handleRemoveSelectedGate}
                  className="inline-flex items-center gap-2 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove Gate
                </button>
              </div>
            ) : (
              <p className="mt-3 text-sm text-[var(--text-muted)]">
                Select a gate marker on the map to rename it or change its type.
              </p>
            )}
          </div>

          <div className="rounded-lg border border-[var(--surface-border)] bg-[var(--surface-0)] p-4 shadow-sm">
            <h3 className="text-base font-semibold text-[var(--text-primary)]">Saved View</h3>
            <div className="mt-3 space-y-2 text-sm text-[var(--text-muted)]">
              <p>Center latitude: {mapCenter.lat.toFixed(6)}</p>
              <p>Center longitude: {mapCenter.lng.toFixed(6)}</p>
              <p>Zoom level: {mapZoom}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const editorButtonClass = (active: boolean) =>
  `inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
    active
      ? 'bg-[var(--brand-600)] text-white'
      : 'border border-[var(--surface-border)] bg-[var(--surface-1)] text-[var(--text-primary)] hover:bg-[var(--surface-2)]'
  }`;

const editorSecondaryButtonClass =
  'inline-flex items-center gap-2 rounded-md border border-[var(--surface-border)] bg-[var(--surface-1)] px-3 py-2 text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-2)] disabled:opacity-50';

const editorDangerButtonClass =
  'inline-flex items-center gap-2 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100';

export default BranchMapEditor;
