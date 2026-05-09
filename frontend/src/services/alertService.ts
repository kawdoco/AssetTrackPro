import axiosInstance from './axiosInstance';

export type AlertRecord = {
  id: number;
  alert_type: string;
  severity: string;
  status: string;
  message: string;
  created_at: string;
  asset: {
    id: number;
    asset_tag_uid: string;
    asset_type: string;
    status: string;
  };
  movement_event?: {
    id: number;
    event_type: string;
    event_time: string;
    zone_from_id: number;
    zone_to_id: number;
  };
};

export type AlertListResponse = {
  success: boolean;
  data: AlertRecord[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export const getAlerts = async (params: {
  status?: string;
  search?: string;
  severity?: string;
  assetId?: number;
  page?: number;
  limit?: number;
}) => {
  const response = await axiosInstance.get<AlertListResponse>('/alerts', {
    params,
  });

  return response.data;
};

export const acknowledgeAlert = async (id: number | string) => {
  const response = await axiosInstance.patch(`/alerts/${id}/acknowledge`);
  return response.data;
};

export const resolveAlert = async (
  id: number | string,
  resolution_notes?: string
) => {
  const response = await axiosInstance.patch(`/alerts/${id}/resolve`, {
    resolution_notes,
  });

  return response.data;
};
