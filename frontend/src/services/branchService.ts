import axiosInstance from './axiosInstance';

export interface Branch {
  id: number;
  organization_id: number;
  name: string;
  city: string;
  status: string; // ACTIVE, INACTIVE
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
