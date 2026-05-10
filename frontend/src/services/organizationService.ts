import axiosInstance from './axiosInstance';

export interface Organization {
  id: number;
  name: string;
  industry_type?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  _count?: {
    branches: number;
    employees: number;
    assets: number;
  };
}

export interface CreateOrganizationData {
  name: string;
  industry_type?: string;
}

export interface UpdateOrganizationData {
  name: string;
  industry_type?: string;
}

export interface OrganizationResponse {
  success: boolean;
  data?: Organization | Organization[];
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Create a new organization
 */
export const createOrganization = async (data: CreateOrganizationData): Promise<OrganizationResponse> => {
  try {
    const response = await axiosInstance.post<OrganizationResponse>('/organizations', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all organizations with pagination and search
 */
export const getOrganizations = async (
  page: number = 1,
  limit: number = 10,
  search: string = '',
  includeInactive: boolean = false
): Promise<OrganizationResponse> => {
  try {
    const response = await axiosInstance.get<OrganizationResponse>('/organizations', {
      params: { page, limit, search, includeInactive },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get organization by ID
 */
export const getOrganizationById = async (id: number): Promise<OrganizationResponse> => {
  try {
    const response = await axiosInstance.get<OrganizationResponse>(`/organizations/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update organization
 */
export const updateOrganization = async (
  id: number,
  data: UpdateOrganizationData
): Promise<OrganizationResponse> => {
  try {
    const response = await axiosInstance.put<OrganizationResponse>(`/organizations/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Deactivate (delete) organization
 */
export const deactivateOrganization = async (id: number): Promise<OrganizationResponse> => {
  try {
    const response = await axiosInstance.delete<OrganizationResponse>(`/organizations/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Reactivate organization
 */
export const reactivateOrganization = async (id: number): Promise<OrganizationResponse> => {
  try {
    const response = await axiosInstance.patch<OrganizationResponse>(`/organizations/${id}/reactivate`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
