import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, MapPin } from '@/icons/lucideMuiAdapter';
import {
  getBranches,
  normalizeBranchBoundaryPayload,
  type Branch,
} from '@/services/branchService';
import { getGates, type Gate } from '@/services/gateService';
import { loadGoogleMaps } from '@/services/googleMapsLoader';

const DEFAULT_CENTER = { lat: 6.9271, lng: 79.8612 };
const DEFAULT_ZOOM = 7;

type OverlayEntry = {
  branchId: number;
  instance: any;
};

export const BranchOverviewMap: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const infoWindowRef = useRef<any>(null);
  const overlaysRef = useRef<OverlayEntry[]>([]);

  const [branches, setBranches] = useState<Branch[]>([]);
  const [systemGates, setSystemGates] = useState<Gate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const bootstrap = async () => {
      try {
        const [maps, response, gateResponse] = await Promise.all([
          loadGoogleMaps(),
          getBranches(1, 100, '', undefined, true),
          getGates(),
        ]);

        if (!active || !containerRef.current) {
          return;
        }

        if (!mapRef.current) {
          mapRef.current = new maps.Map(containerRef.current, {
            center: DEFAULT_CENTER,
            zoom: DEFAULT_ZOOM,
            mapTypeControl: true,
            streetViewControl: false,
            fullscreenControl: true,
          });
          infoWindowRef.current = new maps.InfoWindow();
        }

        setBranches(Array.isArray(response.data) ? response.data : []);
        setSystemGates(Array.isArray(gateResponse.data) ? gateResponse.data : []);
      } catch (bootstrapError) {
        if (!active) {
          return;
        }

        setError(
          bootstrapError instanceof Error
            ? bootstrapError.message
            : 'Unable to load the Google Map.'
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    bootstrap();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !window.google?.maps) {
      return;
    }

    const maps = window.google.maps;

    overlaysRef.current.forEach(({ instance }) => {
      if (instance?.setMap) {
        instance.setMap(null);
      }
    });
    overlaysRef.current = [];

    const bounds = new maps.LatLngBounds();

    branches.forEach((branch) => {
      const boundary = normalizeBranchBoundaryPayload(branch.boundary_points);
      const gates = Array.isArray(branch.gate_markers) ? branch.gate_markers : [];
      const hasCenter =
        typeof branch.map_center_lat === 'number' && typeof branch.map_center_lng === 'number';

      const infoHtml = `
        <div style="min-width:220px;padding:4px 0;">
          <div style="font-weight:700;font-size:14px;margin-bottom:4px;">${branch.name}</div>
          <div style="font-size:12px;color:#475569;margin-bottom:8px;">${branch.city}</div>
          <div style="font-size:12px;color:#0f172a;">Status: ${branch.status}</div>
          <div style="font-size:12px;color:#0f172a;">Buildings: ${branch._count?.buildings ?? 0}</div>
          <div style="font-size:12px;color:#0f172a;">Mapped gates: ${gates.length}</div>
        </div>
      `;

      if (boundary?.type === 'polygon' && boundary.points.length >= 3) {
        const polygon = new maps.Polygon({
          paths: boundary.points,
          strokeColor: '#2563EB',
          strokeOpacity: 0.95,
          strokeWeight: 2,
          fillColor: '#60A5FA',
          fillOpacity: 0.18,
          map: mapRef.current,
        });

        polygon.addListener('click', (event: any) => {
          infoWindowRef.current?.setPosition(event.latLng);
          infoWindowRef.current?.setContent(infoHtml);
          infoWindowRef.current?.open(mapRef.current);
        });

        boundary.points.forEach((point) => bounds.extend(point));
        overlaysRef.current.push({ branchId: branch.id, instance: polygon });
      } else if (boundary?.type === 'rectangle') {
        const rectangle = new maps.Rectangle({
          bounds: boundary.bounds,
          strokeColor: '#2563EB',
          strokeOpacity: 0.95,
          strokeWeight: 2,
          fillColor: '#60A5FA',
          fillOpacity: 0.18,
          map: mapRef.current,
        });

        rectangle.addListener('click', (event: any) => {
          if (event?.latLng) {
            infoWindowRef.current?.setPosition(event.latLng);
          }
          infoWindowRef.current?.setContent(infoHtml);
          infoWindowRef.current?.open(mapRef.current);
        });

        bounds.extend({ lat: boundary.bounds.north, lng: boundary.bounds.east });
        bounds.extend({ lat: boundary.bounds.south, lng: boundary.bounds.west });
        overlaysRef.current.push({ branchId: branch.id, instance: rectangle });
      } else if (boundary?.type === 'circle') {
        const circle = new maps.Circle({
          center: boundary.center,
          radius: boundary.radius_m,
          strokeColor: '#2563EB',
          strokeOpacity: 0.95,
          strokeWeight: 2,
          fillColor: '#60A5FA',
          fillOpacity: 0.18,
          map: mapRef.current,
        });

        circle.addListener('click', (event: any) => {
          if (event?.latLng) {
            infoWindowRef.current?.setPosition(event.latLng);
          }
          infoWindowRef.current?.setContent(infoHtml);
          infoWindowRef.current?.open(mapRef.current);
        });

        const circleBounds = circle.getBounds();
        if (circleBounds) {
          bounds.union(circleBounds);
        }
        overlaysRef.current.push({ branchId: branch.id, instance: circle });
      } else if (hasCenter) {
        const marker = new maps.Marker({
          position: {
            lat: branch.map_center_lat as number,
            lng: branch.map_center_lng as number,
          },
          map: mapRef.current,
          title: branch.name,
          icon: {
            path: maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#2563EB',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 2,
          },
        });

        marker.addListener('click', () => {
          infoWindowRef.current?.setContent(infoHtml);
          infoWindowRef.current?.open({
            anchor: marker,
            map: mapRef.current,
          });
        });

        bounds.extend(marker.getPosition());
        overlaysRef.current.push({ branchId: branch.id, instance: marker });
      }

      gates.forEach((gate) => {
        const gateRadius = gate.radius_m ?? 25;
        const gateCircle = new maps.Circle({
          center: { lat: gate.lat, lng: gate.lng },
          radius: gateRadius,
          strokeColor: '#F97316',
          strokeOpacity: 0.85,
          strokeWeight: 1.5,
          fillColor: '#FDBA74',
          fillOpacity: 0.15,
          map: mapRef.current,
        });

        const marker = new maps.Marker({
          position: { lat: gate.lat, lng: gate.lng },
          map: mapRef.current,
          title: gate.name,
          label: {
            text: 'G',
            color: '#FFFFFF',
            fontWeight: '700',
          },
          icon: {
            path: maps.SymbolPath.BACKWARD_CLOSED_ARROW,
            scale: 6,
            fillColor: '#0F172A',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 1.5,
          },
        });

        marker.addListener('click', () => {
          infoWindowRef.current?.setContent(`
            <div style="min-width:180px;padding:4px 0;">
              <div style="font-weight:700;font-size:13px;margin-bottom:4px;">${gate.name}</div>
              <div style="font-size:12px;color:#475569;">Branch: ${branch.name}</div>
              <div style="font-size:12px;color:#475569;">Type: ${gate.type}</div>
              <div style="font-size:12px;color:#475569;">Read radius: ${gateRadius}m</div>
            </div>
          `);
          infoWindowRef.current?.open({
            anchor: marker,
            map: mapRef.current,
          });
        });

        bounds.extend(marker.getPosition());
        const gateBounds = gateCircle.getBounds();
        if (gateBounds) {
          bounds.union(gateBounds);
        }
        overlaysRef.current.push({ branchId: branch.id, instance: gateCircle });
        overlaysRef.current.push({ branchId: branch.id, instance: marker });
      });
    });

    systemGates
      .filter((gate) => typeof gate.latitude === 'number' && typeof gate.longitude === 'number')
      .forEach((gate) => {
        const position = { lat: gate.latitude as number, lng: gate.longitude as number };
        const radius = gate.radius_m || 5;

        const circle = new maps.Circle({
          center: position,
          radius,
          strokeColor: '#059669',
          strokeOpacity: 0.9,
          strokeWeight: 1.5,
          fillColor: '#34D399',
          fillOpacity: 0.16,
          map: mapRef.current,
        });

        const marker = new maps.Marker({
          position,
          map: mapRef.current,
          title: gate.gate_name,
          label: {
            text: 'R',
            color: '#FFFFFF',
            fontWeight: '700',
          },
          icon: {
            path: maps.SymbolPath.CIRCLE,
            scale: 7,
            fillColor: '#047857',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 1.5,
          },
        });

        marker.addListener('click', () => {
          infoWindowRef.current?.setContent(`
            <div style="min-width:200px;padding:4px 0;">
              <div style="font-weight:700;font-size:13px;margin-bottom:4px;">${gate.gate_name}</div>
              <div style="font-size:12px;color:#475569;">System gate</div>
              <div style="font-size:12px;color:#475569;">Zone: ${gate.zone?.zone_name || '-'}</div>
              <div style="font-size:12px;color:#475569;">Direction: ${gate.direction}</div>
              <div style="font-size:12px;color:#475569;">Linked readers: ${gate.reader_devices?.length || 0}</div>
            </div>
          `);
          infoWindowRef.current?.open({
            anchor: marker,
            map: mapRef.current,
          });
        });

        bounds.extend(position);
        const circleBounds = circle.getBounds();
        if (circleBounds) {
          bounds.union(circleBounds);
        }
        overlaysRef.current.push({ branchId: gate.zone?.building?.branch?.id || 0, instance: circle });
        overlaysRef.current.push({ branchId: gate.zone?.building?.branch?.id || 0, instance: marker });
      });

    if (!bounds.isEmpty()) {
      mapRef.current.fitBounds(bounds, 60);
    } else {
      mapRef.current.setCenter(DEFAULT_CENTER);
      mapRef.current.setZoom(DEFAULT_ZOOM);
    }
  }, [branches, systemGates]);

  if (error) {
    return (
      <div className="bg-[var(--surface-0)] p-4 rounded-lg border border-[var(--surface-border)] shadow-sm h-full flex items-center justify-center">
        <div className="max-w-md text-center space-y-3">
          <AlertCircle className="w-8 h-8 mx-auto text-rose-500" />
          <p className="text-sm font-semibold text-[var(--text-primary)]">Unable to load branch map</p>
          <p className="text-xs text-[var(--text-muted)]">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--surface-0)] p-4 rounded-lg border border-[var(--surface-border)] shadow-sm h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-[var(--text-primary)] text-base">Branch Coverage</h3>
          <p className="text-[11px] text-[var(--text-muted)] font-semibold uppercase tracking-wide">
            Google Maps Overview
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-md border border-[var(--surface-border)] bg-[var(--surface-1)] px-3 py-2">
          <MapPin className="w-4 h-4 text-[var(--brand-600)]" />
          <span className="text-xs font-semibold text-[var(--text-primary)]">
            {branches.length} Branches / {systemGates.length} Gates
          </span>
        </div>
      </div>

      <div className="relative flex-1 rounded-lg border border-[var(--surface-border)] overflow-hidden bg-[var(--surface-1)]">
        <div ref={containerRef} className="absolute inset-0" />
        {loading && (
          <div className="absolute inset-0 bg-[var(--surface-1)]/80 backdrop-blur-sm flex items-center justify-center">
            <p className="text-sm text-[var(--text-muted)]">Loading Google Map...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BranchOverviewMap;