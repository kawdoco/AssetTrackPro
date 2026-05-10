import axiosInstance from './axiosInstance';

export interface Gate {
  id: number;
  zone_id: number;
  gate_name: string;
  direction: 'ENTRY' | 'EXIT' | 'BOTH';
  reader_model: string | null;
  latitude: number | null;
  longitude: number | null;
  radius_m: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  zone?: {
    id: number;
    zone_name: string;
    zone_type: string;
    building?: {
      id: number;
      name: string;
      branch?: {
        id: number;
        name: string;
        organization_id: number;
      };
    };
  };
  reader_devices?: Array<{
    id: number;
    device_key: string;
    name: string;
    status: string;
    last_seen_at: string | null;
  }>;
}

export interface GatePayload {
  zone_id: number;
  gate_name: string;
  direction: 'ENTRY' | 'EXIT' | 'BOTH';
  reader_model?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  radius_m?: number | null;
  is_active?: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const getGates = async (params: { search?: string; zone_id?: number; branch_id?: number } = {}) => {
  const query = new URLSearchParams();
  if (params.search) query.append('search', params.search);
  if (params.zone_id) query.append('zone_id', String(params.zone_id));
  if (params.branch_id) query.append('branch_id', String(params.branch_id));

  const suffix = query.toString() ? `?${query.toString()}` : '';
  const response = await axiosInstance.get<ApiResponse<Gate[]>>(`/gates${suffix}`);
  return response.data;
};

export const createGate = async (data: GatePayload) => {
  const response = await axiosInstance.post<ApiResponse<Gate>>('/gates', data);
  return response.data;
};

export const updateGate = async (id: number, data: Partial<GatePayload>) => {
  const response = await axiosInstance.put<ApiResponse<Gate>>(`/gates/${id}`, data);
  return response.data;
};

export const deleteGate = async (id: number) => {
  const response = await axiosInstance.delete<{ success: boolean; message?: string }>(`/gates/${id}`);
  return response.data;
};