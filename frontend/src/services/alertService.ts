import axiosInstance from './axiosInstance';



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
