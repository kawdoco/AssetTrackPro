import React, { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  AlertCircle,
  ArrowLeft,
  CheckIcon,
  MapPin,
  MousePointer2,
  Plus,
  Save,
  Search,
  Trash2,
} from '@/icons/lucideMuiAdapter';
import {
  getBranchMap,
  normalizeBranchBoundaryPayload,
  updateBranchMap,
  type Branch,
  type BranchBoundary,
  type BranchGateMarker,
  type MapPoint,
} from '@/services/branchService';
import { loadGoogleMaps } from '@/services/googleMapsLoader';
import type { Zone } from '@/services/zoneService';
import { SetupWorkflowGuide } from './setup-workflow-guide';
import type { AppDispatch } from '@/store';
import { createGate as createGateThunk } from '@/store/slices/gateSlice';
import { fetchZones as fetchZonesThunk } from '@/store/slices/zoneSlice';

const DEFAULT_CENTER = { lat: 6.9271, lng: 79.8612 };
const DEFAULT_ZOOM = 17;
const DEFAULT_GATE_RADIUS = 5;
const DEFAULT_CIRCLE_RADIUS = 60;
const DEFAULT_SQUARE_SIZE = 80;

type EditorMode =
  | 'pan'
  | 'draw-points'
  | 'edit-boundary'
  | 'add-gate'
  | 'add-square'
  | 'add-circle';

const buildGateId = () =>
  `gate-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const clampGateRadius = (value: number) => {
  const normalized = Number(value);
  if (!Number.isFinite(normalized) || normalized <= 0) {
    return DEFAULT_GATE_RADIUS;
  }

  return Math.max(1, Math.min(100, normalized));
};

const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message;
  }

  return error instanceof Error ? error.message : 'An unexpected error occurred.';
};

const getBoundaryTypeLabel = (boundary: BranchBoundary | null) => {
  if (!boundary) return 'None';
  if (boundary.type === 'polygon') return 'Points';
  if (boundary.type === 'rectangle') return 'Square';
  return 'Circle';
};

const getPolygonPointCount = (boundary: BranchBoundary | null) =>
  boundary?.type === 'polygon' ? boundary.points.length : 0;

const computeSquareBoundary = (maps: any, center: MapPoint, sizeMeters: number): BranchBoundary => {
  const half = Math.max(10, sizeMeters) / 2;
  const north = maps.geometry.spherical.computeOffset(center, half, 0);
  const south = maps.geometry.spherical.computeOffset(center, half, 180);
  const east = maps.geometry.spherical.computeOffset(center, half, 90);
  const west = maps.geometry.spherical.computeOffset(center, half, 270);

  return {
    type: 'rectangle',
    bounds: {
      north: north.lat(),
      south: south.lat(),
      east: east.lng(),
      west: west.lng(),
    },
  };
};

const geocodeAddress = (geocoder: any, address: string) =>
  new Promise<any[]>((resolve, reject) => {
    geocoder.geocode({ address }, (results: any[], status: string) => {
      if (status === 'OK' && results?.length) {
        resolve(results);
        return;
      }

      reject(new Error(`Could not find "${address}".`));
    });
  });

type PlaceSuggestion = {
  place_id: string;
  description: string;
};

export const BranchMapEditor: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const branchId = Number.parseInt(id || '', 10);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const geocoderRef = useRef<any>(null);
  const polygonRef = useRef<any>(null);
  const polylineRef = useRef<any>(null);
  const rectangleRef = useRef<any>(null);
  const circleRef = useRef<any>(null);
  const searchMarkerRef = useRef<any>(null);
  const autocompleteServiceRef = useRef<any>(null);
  const placesServiceRef = useRef<any>(null);
  const mapClickListenerRef = useRef<any>(null);
  const overlayListenersRef = useRef<any[]>([]);
  const gateMarkersRef = useRef<any[]>([]);
  const gateCirclesRef = useRef<any[]>([]);

  const [branch, setBranch] = useState<Branch | null>(null);
  const [zones, setZones] = useState<Zone[]>([]);
  const [boundary, setBoundary] = useState<BranchBoundary | null>(null);
  const [gateMarkers, setGateMarkers] = useState<BranchGateMarker[]>([]);
  const [gateZoneByMarkerId, setGateZoneByMarkerId] = useState<Record<string, number>>({});
  const [mapCenter, setMapCenter] = useState<MapPoint>(DEFAULT_CENTER);
  const [mapZoom, setMapZoom] = useState<number>(DEFAULT_ZOOM);
  const [selectedGateId, setSelectedGateId] = useState<string | null>(null);
  const [mode, setMode] = useState<EditorMode>('pan');
  const [searchQuery, setSearchQuery] = useState('');
  const [placeSuggestions, setPlaceSuggestions] = useState<PlaceSuggestion[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [squareSizeMeters, setSquareSizeMeters] = useState(DEFAULT_SQUARE_SIZE);
  const [circleRadiusMeters, setCircleRadiusMeters] = useState(DEFAULT_CIRCLE_RADIUS);
  const [defaultGateRadiusMeters, setDefaultGateRadiusMeters] = useState(DEFAULT_GATE_RADIUS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saveMessage, setSaveMessage] = useState('');

  const selectedGate = useMemo(
    () => gateMarkers.find((gate) => gate.id === selectedGateId) ?? null,
    [gateMarkers, selectedGateId]
  );

  const jumpMapTo = (point: MapPoint, zoom = 18) => {
    if (!mapRef.current) {
      return;
    }

    mapRef.current.panTo(point);
    mapRef.current.setZoom(zoom);
    setMapCenter(point);
    setMapZoom(zoom);
  };

  const showSearchMarker = (maps: any, point: MapPoint) => {
    if (!mapRef.current) {
      return;
    }

    if (searchMarkerRef.current?.setMap) {
      searchMarkerRef.current.setMap(null);
      searchMarkerRef.current = null;
    }

    searchMarkerRef.current = new maps.Marker({
      position: point,
      map: mapRef.current,
      title: 'Search result',
      animation: maps.Animation?.DROP,
    });
  };

  const resolvePlaceSuggestion = async (suggestion: PlaceSuggestion) => {
    if (!placesServiceRef.current) {
      throw new Error('Places service is not available.');
    }

    return new Promise<MapPoint>((resolve, reject) => {
      placesServiceRef.current.getDetails(
        {
          placeId: suggestion.place_id,
          fields: ['geometry', 'name', 'formatted_address'],
        },
        (place: any, status: string) => {
          if (status !== 'OK' || !place?.geometry?.location) {
            reject(new Error('Could not load place details.'));
            return;
          }

          const location = place.geometry.location;
          resolve({ lat: location.lat(), lng: location.lng() });
        }
      );
    });
  };

  useEffect(() => {
    let active = true;

    const bootstrap = async () => {
      if (!Number.isInteger(branchId)) {
        setError('Invalid branch id.');
        setLoading(false);
        return;
      }

      try {
        const [maps, response, zoneResponse] = await Promise.all([
          loadGoogleMaps(),
          getBranchMap(branchId),
          dispatch(fetchZonesThunk({ page: 1, limit: 500 })).unwrap(),
        ]);

        if (!active || !containerRef.current) {
          return;
        }

        const branchData = response.data as Branch;
        const nextCenter =
          typeof branchData.map_center_lat === 'number' &&
          typeof branchData.map_center_lng === 'number'
            ? { lat: branchData.map_center_lat, lng: branchData.map_center_lng }
            : DEFAULT_CENTER;
        const nextGates = (Array.isArray(branchData.gate_markers) ? branchData.gate_markers : []).map((gate) => ({
          ...gate,
          radius_m: clampGateRadius(gate.radius_m ?? DEFAULT_GATE_RADIUS),
        }));

        setBranch(branchData);
        setZones(
          Array.isArray(zoneResponse.data)
            ? zoneResponse.data.filter((zone) => zone.building?.branch?.id === branchId)
            : []
        );
        setBoundary(normalizeBranchBoundaryPayload(branchData.boundary_points));
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
        geocoderRef.current = new maps.Geocoder();

        // Places helpers for autocomplete
        if (maps.places) {
          autocompleteServiceRef.current = new maps.places.AutocompleteService();
          placesServiceRef.current = new maps.places.PlacesService(mapRef.current);
        }

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

        if (searchMarkerRef.current?.setMap) {
          searchMarkerRef.current.setMap(null);
          searchMarkerRef.current = null;
        }
      }
    };
  }, [branchId, dispatch]);

  // Autocomplete suggestions as the user types.
  useEffect(() => {
    if (!autocompleteServiceRef.current) {
      setPlaceSuggestions([]);
      return;
    }

    const input = searchQuery.trim();
    if (!input) {
      setPlaceSuggestions([]);
      return;
    }

    setIsSuggesting(true);
    const handle = window.setTimeout(() => {
      autocompleteServiceRef.current.getPlacePredictions(
        { input },
        (predictions: any[], status: string) => {
          setIsSuggesting(false);
          if (status !== 'OK' || !Array.isArray(predictions)) {
            setPlaceSuggestions([]);
            return;
          }

          setPlaceSuggestions(
            predictions.slice(0, 6).map((prediction) => ({
              place_id: prediction.place_id,
              description: prediction.description,
            }))
          );
        }
      );
    }, 250);

    return () => window.clearTimeout(handle);
  }, [searchQuery]);

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

      setError('');

      if (mode === 'draw-points') {
        setBoundary((prev) => ({
          type: 'polygon',
          points: prev?.type === 'polygon' ? [...prev.points, point] : [point],
        }));
      }

      if (mode === 'add-square') {
        setBoundary(computeSquareBoundary(maps, point, squareSizeMeters));
        setMode('edit-boundary');
      }

      if (mode === 'add-circle') {
        setBoundary({
          type: 'circle',
          center: point,
          radius_m: circleRadiusMeters,
        });
        setMode('edit-boundary');
      }

      if (mode === 'add-gate') {
        const nextGate: BranchGateMarker = {
          id: buildGateId(),
          name: `Gate ${gateMarkers.length + 1}`,
          type: 'BOTH',
          lat: point.lat,
          lng: point.lng,
          radius_m: clampGateRadius(defaultGateRadiusMeters),
        };

        setGateMarkers((prev) => [...prev, nextGate]);
        setGateZoneByMarkerId((prev) => ({
          ...prev,
          [nextGate.id]: zones[0]?.id || 0,
        }));
        setSelectedGateId(nextGate.id);
        setMode('pan');
      }
    });
  }, [circleRadiusMeters, defaultGateRadiusMeters, gateMarkers.length, mode, squareSizeMeters, zones]);

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

    if (rectangleRef.current?.setMap) {
      rectangleRef.current.setMap(null);
      rectangleRef.current = null;
    }

    if (circleRef.current?.setMap) {
      circleRef.current.setMap(null);
      circleRef.current = null;
    }

    if (!boundary) {
      return;
    }

    if (boundary.type === 'polygon') {
      if (mode === 'draw-points') {
        polylineRef.current = new maps.Polyline({
          path: boundary.points,
          strokeColor: '#2563EB',
          strokeOpacity: 0.9,
          strokeWeight: 2,
          map: mapRef.current,
        });
        return;
      }

      polygonRef.current = new maps.Polygon({
        paths: boundary.points,
        editable: mode === 'edit-boundary',
        strokeColor: '#2563EB',
        strokeOpacity: 0.95,
        strokeWeight: 2,
        fillColor: '#60A5FA',
        fillOpacity: 0.18,
        map: mapRef.current,
      });

      if (mode === 'edit-boundary') {
        overlayListenersRef.current.push(
          polygonRef.current.addListener('mouseup', () => {
            const path = polygonRef.current.getPath();
            const nextPoints: MapPoint[] = [];
            for (let index = 0; index < path.getLength(); index += 1) {
              const point = path.getAt(index);
              nextPoints.push({ lat: point.lat(), lng: point.lng() });
            }
            setBoundary({ type: 'polygon', points: nextPoints });
          })
        );
      }

      return;
    }

    if (boundary.type === 'rectangle') {
      rectangleRef.current = new maps.Rectangle({
        bounds: boundary.bounds,
        editable: mode === 'edit-boundary',
        strokeColor: '#2563EB',
        strokeOpacity: 0.95,
        strokeWeight: 2,
        fillColor: '#60A5FA',
        fillOpacity: 0.18,
        map: mapRef.current,
      });

      if (mode === 'edit-boundary') {
        overlayListenersRef.current.push(
          rectangleRef.current.addListener('bounds_changed', () => {
            const bounds = rectangleRef.current.getBounds();
            if (!bounds) {
              return;
            }

            const northEast = bounds.getNorthEast();
            const southWest = bounds.getSouthWest();

            setBoundary({
              type: 'rectangle',
              bounds: {
                north: northEast.lat(),
                east: northEast.lng(),
                south: southWest.lat(),
                west: southWest.lng(),
              },
            });
          })
        );
      }

      return;
    }

    circleRef.current = new maps.Circle({
      center: boundary.center,
      radius: boundary.radius_m,
      editable: mode === 'edit-boundary',
      strokeColor: '#2563EB',
      strokeOpacity: 0.95,
      strokeWeight: 2,
      fillColor: '#60A5FA',
      fillOpacity: 0.18,
      map: mapRef.current,
    });

    if (mode === 'edit-boundary') {
      const syncCircle = () => {
        const center = circleRef.current.getCenter();
        const radius = circleRef.current.getRadius();

        if (!center) {
          return;
        }

        setBoundary({
          type: 'circle',
          center: {
            lat: center.lat(),
            lng: center.lng(),
          },
          radius_m: radius,
        });
      };

      overlayListenersRef.current.push(circleRef.current.addListener('center_changed', syncCircle));
      overlayListenersRef.current.push(circleRef.current.addListener('radius_changed', syncCircle));
    }
  }, [boundary, mode]);

  useEffect(() => {
    if (!mapRef.current || !window.google?.maps) {
      return;
    }

    gateMarkersRef.current.forEach((marker) => marker.setMap(null));
    gateCirclesRef.current.forEach((circle) => circle.setMap(null));
    gateMarkersRef.current = [];
    gateCirclesRef.current = [];

    const maps = window.google.maps;

    gateMarkers.forEach((gate) => {
      const radius = clampGateRadius(gate.radius_m ?? DEFAULT_GATE_RADIUS);

      const circle = new maps.Circle({
        center: { lat: gate.lat, lng: gate.lng },
        radius,
        strokeColor: selectedGateId === gate.id ? '#DC2626' : '#F97316',
        strokeOpacity: 0.85,
        strokeWeight: selectedGateId === gate.id ? 2 : 1.5,
        fillColor: selectedGateId === gate.id ? '#FCA5A5' : '#FDBA74',
        fillOpacity: 0.18,
        map: mapRef.current,
      });

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
      gateCirclesRef.current.push(circle);
    });
  }, [gateMarkers, selectedGateId]);

  const handleSearchPlace = async (event?: React.FormEvent) => {
    event?.preventDefault();

    if (!searchQuery.trim() || !geocoderRef.current) {
      return;
    }

    try {
      setError('');

      const maps = window.google?.maps;
      if (!maps) {
        throw new Error('Google Maps is not loaded yet.');
      }

      // Prefer first autocomplete suggestion if available.
      let point: MapPoint | null = null;
      if (placeSuggestions.length > 0 && placesServiceRef.current) {
        point = await resolvePlaceSuggestion(placeSuggestions[0]);
      } else {
        const results = await geocodeAddress(geocoderRef.current, searchQuery.trim());
        const location = results[0]?.geometry?.location;

        if (!location) {
          throw new Error(`Could not find "${searchQuery}".`);
        }

        point = { lat: location.lat(), lng: location.lng() };
      }

      if (!point) {
        throw new Error(`Could not find "${searchQuery}".`);
      }

      showSearchMarker(maps, point);
      jumpMapTo(point, 18);
      setPlaceSuggestions([]);
    } catch (searchError) {
      setError(getErrorMessage(searchError));
    }
  };

  const handleSelectSuggestion = async (suggestion: PlaceSuggestion) => {
    try {
      setError('');
      setSearchQuery(suggestion.description);
      setPlaceSuggestions([]);

      const maps = window.google?.maps;
      if (!maps) {
        throw new Error('Google Maps is not loaded yet.');
      }

      const point = await resolvePlaceSuggestion(suggestion);
      showSearchMarker(maps, point);
      jumpMapTo(point, 18);
    } catch (selectError) {
      setError(getErrorMessage(selectError));
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported in this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const point = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        setError('');
        jumpMapTo(point, 18);
      },
      (geoError) => {
        setError(geoError.message || 'Unable to get your current location.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  };

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
        boundary_points: boundary,
        gate_markers: gateMarkers.map((gate) => ({
          ...gate,
          radius_m: clampGateRadius(gate.radius_m ?? DEFAULT_GATE_RADIUS),
        })),
      });

      const updatedBranch = response.data as Branch;
      setBranch(updatedBranch);
      setBoundary(normalizeBranchBoundaryPayload(updatedBranch.boundary_points));
      setGateMarkers(
        (Array.isArray(updatedBranch.gate_markers) ? updatedBranch.gate_markers : []).map((gate) => ({
          ...gate,
          radius_m: clampGateRadius(gate.radius_m ?? DEFAULT_GATE_RADIUS),
        }))
      );
      setSaveMessage(response.message || 'Branch map saved.');
      setMode('pan');
    } catch (saveError) {
      setError(getErrorMessage(saveError));
    } finally {
      setSaving(false);
    }
  };

  const handleResetBoundary = () => {
    setBoundary(null);
    setMode('draw-points');
  };

  const handleFinishBoundary = () => {
    if (!boundary) {
      setError('Create a boundary first.');
      return;
    }

    if (boundary.type === 'polygon' && boundary.points.length < 3) {
      setError('Add at least three points to close the boundary.');
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
      prev.map((gate) =>
        gate.id === selectedGateId
          ? {
              ...gate,
              ...updates,
              radius_m:
                updates.radius_m !== undefined
                  ? clampGateRadius(Number(updates.radius_m))
                  : clampGateRadius(gate.radius_m ?? DEFAULT_GATE_RADIUS),
            }
          : gate
      )
    );
  };

  const handleRemoveSelectedGate = () => {
    if (!selectedGateId) {
      return;
    }

    const nextGateMarkers = gateMarkers.filter((gate) => gate.id !== selectedGateId);
    setGateMarkers(nextGateMarkers);
    setGateZoneByMarkerId((prev) => {
      const next = { ...prev };
      delete next[selectedGateId];
      return next;
    });
    setSelectedGateId(nextGateMarkers[0]?.id ?? null);
  };

  const handleCreateRealGate = async () => {
    if (!selectedGate) {
      return;
    }

    const zoneId = gateZoneByMarkerId[selectedGate.id] || zones[0]?.id || 0;
    if (!zoneId) {
      setError('Create or select a zone before creating a real gate.');
      return;
    }

    try {
      setSaving(true);
      setError('');
      setSaveMessage('');

      const response = await dispatch(createGateThunk({
        zone_id: zoneId,
        gate_name: selectedGate.name.trim() || 'Gate',
        direction: selectedGate.type === 'ENTRY' || selectedGate.type === 'EXIT' ? selectedGate.type : 'BOTH',
        latitude: selectedGate.lat,
        longitude: selectedGate.lng,
        radius_m: clampGateRadius(selectedGate.radius_m ?? DEFAULT_GATE_RADIUS),
        reader_model: null,
        is_active: true,
      })).unwrap();

      setSaveMessage(response.message || 'Gate created.');
    } catch (gateError) {
      setError(getErrorMessage(gateError));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <SetupWorkflowGuide
        activeStep="gates"
        counts={{
          zones: zones.length,
          gates: gateMarkers.length,
        }}
      />

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
            Draw the branch boundary, place gate read areas, then create the real gate record by selecting its zone.
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
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <form onSubmit={handleSearchPlace} className="flex flex-1 items-center gap-2">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search for a place, branch, road, or campus..."
                  className="w-full rounded-md border border-[var(--surface-border)] bg-[var(--surface-1)] py-2 pl-10 pr-3 text-sm text-[var(--text-primary)] outline-none focus:ring-1 focus:ring-[var(--brand-600)]"
                />

                {placeSuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-md border border-[var(--surface-border)] bg-[var(--surface-0)] shadow-lg">
                    <ul className="max-h-64 overflow-auto py-1">
                      {placeSuggestions.map((suggestion) => (
                        <li key={suggestion.place_id}>
                          <button
                            type="button"
                            onClick={() => void handleSelectSuggestion(suggestion)}
                            className="w-full px-3 py-2 text-left text-sm text-[var(--text-primary)] hover:bg-[var(--surface-2)]"
                          >
                            {suggestion.description}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {isSuggesting && placeSuggestions.length === 0 && searchQuery.trim() && (
                  <div className="absolute left-0 right-0 top-full z-20 mt-2 rounded-md border border-[var(--surface-border)] bg-[var(--surface-0)] px-3 py-2 text-xs text-[var(--text-muted)] shadow-lg">
                    Searching...
                  </div>
                )}
              </div>
              <button type="submit" className={editorSecondaryButtonClass}>
                Search
              </button>
              <button type="button" onClick={handleUseCurrentLocation} className={editorSecondaryButtonClass}>
                My Location
              </button>
            </form>
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-2">
            <button onClick={() => setMode('pan')} className={editorButtonClass(mode === 'pan')}>
              <MousePointer2 className="w-4 h-4" />
              Pan
            </button>
            <button
              onClick={() => {
                setError('');
                setMode('draw-points');
                setBoundary((prev) => (prev?.type === 'polygon' ? prev : { type: 'polygon', points: [] }));
              }}
              className={editorButtonClass(mode === 'draw-points')}
            >
              <MapPin className="w-4 h-4" />
              Place Points
            </button>
            <button onClick={() => setMode('add-square')} className={editorButtonClass(mode === 'add-square')}>
              Square
            </button>
            <button onClick={() => setMode('add-circle')} className={editorButtonClass(mode === 'add-circle')}>
              Circle
            </button>
            <button
              onClick={() => setMode('edit-boundary')}
              disabled={!boundary}
              className={editorButtonClass(mode === 'edit-boundary')}
            >
              <CheckIcon className="w-4 h-4" />
              Edit Boundary
            </button>
            <button onClick={handleFinishBoundary} disabled={!boundary} className={editorSecondaryButtonClass}>
              Finish Boundary
            </button>
            <button onClick={handleResetBoundary} className={editorDangerButtonClass}>
              <Trash2 className="w-4 h-4" />
              Clear Boundary
            </button>
            <button onClick={() => setMode('add-gate')} className={editorButtonClass(mode === 'add-gate')}>
              <Plus className="w-4 h-4" />
              Add Gate
            </button>
          </div>

          <div className="mb-3 grid grid-cols-1 gap-3 md:grid-cols-3">
            <label className="rounded-md border border-[var(--surface-border)] bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--text-primary)]">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                Square Size
              </span>
              <input
                type="number"
                min={20}
                value={squareSizeMeters}
                onChange={(event) => setSquareSizeMeters(Math.max(20, Number(event.target.value) || DEFAULT_SQUARE_SIZE))}
                className="w-full bg-transparent outline-none"
              />
              <span className="text-xs text-[var(--text-muted)]">meters</span>
            </label>

            <label className="rounded-md border border-[var(--surface-border)] bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--text-primary)]">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                Circle Radius
              </span>
              <input
                type="number"
                min={10}
                value={circleRadiusMeters}
                onChange={(event) => setCircleRadiusMeters(Math.max(10, Number(event.target.value) || DEFAULT_CIRCLE_RADIUS))}
                className="w-full bg-transparent outline-none"
              />
              <span className="text-xs text-[var(--text-muted)]">meters</span>
            </label>

            <label className="rounded-md border border-[var(--surface-border)] bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--text-primary)]">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                New Gate Radius
              </span>
              <input
                type="number"
                min={1}
                max={100}
                value={defaultGateRadiusMeters}
                onChange={(event) => setDefaultGateRadiusMeters(clampGateRadius(Number(event.target.value)))}
                className="w-full bg-transparent outline-none"
              />
              <span className="text-xs text-[var(--text-muted)]">default 5m</span>
            </label>
          </div>

          <div className="mb-3 flex flex-wrap items-center gap-4 text-xs text-[var(--text-muted)]">
            <span>Mode: {mode.replace('-', ' ')}</span>
            <span>Boundary type: {getBoundaryTypeLabel(boundary)}</span>
            <span>Boundary points: {getPolygonPointCount(boundary)}</span>
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
              <p>Use `My Location` to jump to the device location or `Search` to find a branch area quickly.</p>
              <p>`Place Points` lets you create an irregular boundary, while `Square` and `Circle` create quick site shapes with one click.</p>
              <p>`Add Gate` places a visual marker. Select a zone and click `Create Gate Record` to make it available on the Gates & RFID Readers page.</p>
              <p>Each gate shows its read radius (default 5m), so RFID read coverage can be planned before hardware binding.</p>
              <p>The map center, zoom, branch boundary, and visual gate markers are saved with the branch.</p>
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

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                    Zone
                  </label>
                  <select
                    value={gateZoneByMarkerId[selectedGate.id] || zones[0]?.id || 0}
                    onChange={(event) =>
                      setGateZoneByMarkerId((prev) => ({
                        ...prev,
                        [selectedGate.id]: Number(event.target.value),
                      }))
                    }
                    className="w-full rounded-md border border-[var(--surface-border)] bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-600)]"
                  >
                    <option value={0}>Select zone</option>
                    {zones.map((zone) => (
                      <option key={zone.id} value={zone.id}>
                        {zone.zone_name} / {zone.building?.name || 'Building'}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-[var(--text-muted)]">
                    This is required for the operational gate record. Gates belong to zones, not directly to the branch.
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                    Read Radius
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={selectedGate.radius_m ?? DEFAULT_GATE_RADIUS}
                    onChange={(event) => handleUpdateSelectedGate({ radius_m: Number(event.target.value) })}
                    className="w-full rounded-md border border-[var(--surface-border)] bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-600)]"
                  />
                  <p className="mt-1 text-xs text-[var(--text-muted)]">Default is 5m.</p>
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
                <button
                  onClick={() => void handleCreateRealGate()}
                  disabled={saving || zones.length === 0}
                  className="ml-2 inline-flex items-center gap-2 rounded-md bg-[var(--brand-600)] px-3 py-2 text-sm font-semibold text-white hover:bg-[var(--brand-700)] disabled:opacity-60"
                >
                  <Save className="w-4 h-4" />
                  Create Gate Record
                </button>
              </div>
            ) : (
              <p className="mt-3 text-sm text-[var(--text-muted)]">
                Select a gate marker on the map to rename it, change its type, or adjust its read radius.
              </p>
            )}
          </div>

          <div className="rounded-lg border border-[var(--surface-border)] bg-[var(--surface-0)] p-4 shadow-sm">
            <h3 className="text-base font-semibold text-[var(--text-primary)]">Saved View</h3>
            <div className="mt-3 space-y-2 text-sm text-[var(--text-muted)]">
              <p>Center latitude: {mapCenter.lat.toFixed(6)}</p>
              <p>Center longitude: {mapCenter.lng.toFixed(6)}</p>
              <p>Zoom level: {mapZoom}</p>
              <p>Boundary type: {getBoundaryTypeLabel(boundary)}</p>
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