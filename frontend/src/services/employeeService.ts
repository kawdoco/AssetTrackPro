import axiosInstance from './axiosInstance';

export interface OrganizationOption {
  id: number;
  name: string;
}

export interface EmployeeRecord {
  id: number;
  organization_id: number;
  employee_code: string;
  name: string;
  email: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  is_active: boolean;
  created_at: string;
  organization: OrganizationOption | null;
}

export interface EmployeeCreatePayload {
  organization_id: string;
  employee_code: string;
  name: string;
  email: string;
  status: 'ACTIVE' | 'INACTIVE';
  is_active?: boolean;
}

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export const fetchEmployeeOrganizations = async () => {
  const response = await axiosInstance.get<ApiResponse<OrganizationOption[]>>('/employees/organizations');
  return response.data.data || [];
};

export const fetchEmployees = async (search = '') => {
  const response = await axiosInstance.get<ApiResponse<EmployeeRecord[]>>('/employees', {
    params: search ? { search } : undefined,
  });

  return response.data.data || [];
};

export const createEmployee = async (payload: EmployeeCreatePayload) => {
  const response = await axiosInstance.post<ApiResponse<EmployeeRecord>>('/employees/create', {
    ...payload,
    organization_id: Number(payload.organization_id),
  });

  return response.data.data;
};

export const updateEmployee = async (id: number, payload: EmployeeCreatePayload) => {
  const response = await axiosInstance.put<ApiResponse<EmployeeRecord>>(`/employees/${id}`, {
    ...payload,
    organization_id: Number(payload.organization_id),
  });

  return response.data.data;
};

export const deleteEmployee = async (id: number) => {
  const response = await axiosInstance.delete<ApiResponse<EmployeeRecord>>(`/employees/${id}`);
  return response.data.data;
};
