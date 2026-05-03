import axiosInstance from './axiosInstance';

export interface Branch {
  id: number;
  organization_id: number;
  name: string;
  city: string;
  status: string; // ACTIVE, INACTIVE
  map_center_lat?: number | null;
  map_center_lng?: number | null;
  map_zoom?: number;
  boundary_points?: BranchBoundaryPayload;
  gate_markers?: BranchGateMarker[] | null;
  map_updated_at?: string | null;
  created_at: string;
  updated_at: string;
  organization?: {
    id: number;
    name: string;
  };
  _count?: {
    buildings: number;
  };
}

export interface MapPoint {
  lat: number;
  lng: number;
}

export interface BranchGateMarker {
  id: string;
  name: string;
  type: string;
  lat: number;
  lng: number;
  radius_m?: number;
}

export interface BranchPolygonBoundary {
  type: 'polygon';
  points: MapPoint[];
}

export interface BranchRectangleBoundary {
  type: 'rectangle';
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

export interface BranchCircleBoundary {
  type: 'circle';
  center: MapPoint;
  radius_m: number;
}

export type BranchBoundary =
  | BranchPolygonBoundary
  | BranchRectangleBoundary
  | BranchCircleBoundary;

export type BranchBoundaryPayload = BranchBoundary | MapPoint[] | null | undefined;

export const isLegacyPolygonPoints = (value: BranchBoundaryPayload): value is MapPoint[] =>
  Array.isArray(value);

export const normalizeBranchBoundaryPayload = (value: BranchBoundaryPayload): BranchBoundary | null => {
  if (!value) {
    return null;
  }

  if (isLegacyPolygonPoints(value)) {
    return {
      type: 'polygon',
      points: value,
    };
  }

  return value;
};

export const getBranchBoundaryPointCount = (value: BranchBoundaryPayload): number => {
  const normalized = normalizeBranchBoundaryPayload(value);

  if (!normalized) {
    return 0;
  }

  if (normalized.type === 'polygon') {
    return normalized.points.length;
  }

  return 0;
};

export interface CreateBranchData {
  organization_id: number;
  name: string;
  city: string;
}

export interface UpdateBranchData {
  name?: string;
  city?: string;
  status?: string;
}

export interface BranchResponse {
  success: boolean;
  data?: Branch | Branch[];
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UpdateBranchMapData {
  map_center_lat: number | null;
  map_center_lng: number | null;
  map_zoom: number;
  boundary_points: BranchBoundaryPayload;
  gate_markers: BranchGateMarker[];
}

/**
 * Create a new branch
 */
export const createBranch = async (data: CreateBranchData): Promise<BranchResponse> => {
  try {
    const response = await axiosInstance.post<BranchResponse>('/branches', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all branches with pagination and filtering
 */
export const getBranches = async (
  page: number = 1,
  limit: number = 10,
  search: string = '',
  organizationId?: number,
  includeInactive: boolean = false
): Promise<BranchResponse> => {
  try {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (search) params.append('search', search);
    if (organizationId) params.append('organization_id', organizationId.toString());
    params.append('includeInactive', includeInactive.toString());

    const response = await axiosInstance.get<BranchResponse>(`/branches?${params.toString()}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get branch by ID
 */
export const getBranchById = async (id: number): Promise<BranchResponse> => {
  try {
    const response = await axiosInstance.get<BranchResponse>(`/branches/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update branch
 */
export const updateBranch = async (id: number, data: UpdateBranchData): Promise<BranchResponse> => {
  try {
    const response = await axiosInstance.put<BranchResponse>(`/branches/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Deactivate branch (soft delete)
 */
export const deactivateBranch = async (id: number): Promise<BranchResponse> => {
  try {
    const response = await axiosInstance.delete<BranchResponse>(`/branches/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Reactivate branch
 */
export const reactivateBranch = async (id: number): Promise<BranchResponse> => {
  try {
    const response = await axiosInstance.patch<BranchResponse>(`/branches/${id}/reactivate`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get branch map configuration
 */
export const getBranchMap = async (id: number): Promise<BranchResponse> => {
  try {
    const response = await axiosInstance.get<BranchResponse>(`/branches/${id}/map`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update branch map configuration
 */
export const updateBranchMap = async (
  id: number,
  data: UpdateBranchMapData
): Promise<BranchResponse> => {
  try {
    const response = await axiosInstance.put<BranchResponse>(`/branches/${id}/map`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
