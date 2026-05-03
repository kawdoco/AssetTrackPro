import axiosInstance from './axiosInstance';

export interface Zone {
  id: number;
  building_id: number;
  zone_name: string;
  zone_type: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  building?: {
    id: number;
    name: string;
    branch?: {
      id: number;
      name: string;
      organization?: {
        id: number;
        name: string;
      };
    };
  };
  _count?: {
    gates: number;
  };
}

export interface CreateZoneData {
  building_id: number;
  zone_name: string;
  zone_type: string;
  description?: string;
}

export interface UpdateZoneData {
  zone_name?: string;
  zone_type?: string;
  description?: string;
}

export interface ZoneResponse {
  success: boolean;
  data?: Zone | Zone[];
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Create a new zone
 */
export const createZone = async (data: CreateZoneData): Promise<ZoneResponse> => {
  try {
    const response = await axiosInstance.post<ZoneResponse>('/zones', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all zones with pagination and filtering
 */
export const getZones = async (
  page: number = 1,
  limit: number = 10,
  search: string = '',
  buildingId?: number,
  zoneType?: string
): Promise<ZoneResponse> => {
  try {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (search) params.append('search', search);
    if (buildingId) params.append('building_id', buildingId.toString());
    if (zoneType) params.append('zone_type', zoneType);

    const response = await axiosInstance.get<ZoneResponse>(`/zones?${params.toString()}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get zone by ID
 */
export const getZoneById = async (id: number): Promise<ZoneResponse> => {
  try {
    const response = await axiosInstance.get<ZoneResponse>(`/zones/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update zone
 */
export const updateZone = async (id: number, data: UpdateZoneData): Promise<ZoneResponse> => {
  try {
    const response = await axiosInstance.put<ZoneResponse>(`/zones/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete zone
 */
export const deleteZone = async (id: number): Promise<ZoneResponse> => {
  try {
    const response = await axiosInstance.delete<ZoneResponse>(`/zones/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};