import axiosInstance from './axiosInstance';

export interface Building {
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
}

export interface BuildingResponse {
  success: boolean;
  data?: Building | Building[];
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const buildingService = {
  async getBuildings(
    page: number = 1,
    limit: number = 10,
    search: string = '',
    organizationId?: number,
    includeInactive: boolean = false
  ): Promise<BuildingResponse> {
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      if (search) params.append('search', search);
      if (organizationId) params.append('organization_id', organizationId.toString());
      params.append('includeInactive', includeInactive.toString());

      const response = await axiosInstance.get<BuildingResponse>(`/buildings?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getBuildingById(id: number): Promise<Building> {
    const response = await axiosInstance.get(`/buildings/${id}`);
    return response.data;
  },

  async createBuilding(data: { name: string; branch_id: number; description?: string }): Promise<Building> {
    const response = await axiosInstance.post('/buildings', data);
    return response.data;
  },

  async updateBuilding(id: number, data: { name?: string; branch_id?: number; description?: string }): Promise<Building> {
    const response = await axiosInstance.put(`/buildings/${id}`, data);
    return response.data;
  },

  async deleteBuilding(id: number): Promise<void> {
    await axiosInstance.delete(`/buildings/${id}`);
  },
};