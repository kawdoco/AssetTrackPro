import axiosInstance from './axiosInstance';

export interface Building {
  id: number;
  branch_id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
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
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
    currentPage?: number;
    totalItems?: number;
    itemsPerPage?: number;
  };
}

export interface CreateBuildingData {
  branch_id: number;
  name: string;
}

export type UpdateBuildingData = Partial<CreateBuildingData>;

export const buildingService = {
  async getBuildings(
    page: number = 1,
    limit: number = 10,
    search: string = '',
    branchId?: number
  ): Promise<BuildingResponse> {
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      if (search) params.append('search', search);
      if (branchId) params.append('branch_id', branchId.toString());

      const response = await axiosInstance.get<BuildingResponse>(`/buildings?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getBuildingById(id: number): Promise<BuildingResponse> {
    const response = await axiosInstance.get<BuildingResponse>(`/buildings/${id}`);
    return response.data;
  },

  async createBuilding(data: CreateBuildingData): Promise<BuildingResponse> {
    const response = await axiosInstance.post<BuildingResponse>('/buildings', data);
    return response.data;
  },

  async updateBuilding(id: number, data: UpdateBuildingData): Promise<BuildingResponse> {
    const response = await axiosInstance.put<BuildingResponse>(`/buildings/${id}`, data);
    return response.data;
  },

  async deleteBuilding(id: number): Promise<BuildingResponse> {
    const response = await axiosInstance.delete<BuildingResponse>(`/buildings/${id}`);
    return response.data;
  },
};
