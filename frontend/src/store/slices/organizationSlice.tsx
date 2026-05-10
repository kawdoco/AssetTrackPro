import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../services/axiosInstance';
import type {
  Organization,
  CreateOrganizationData,
  UpdateOrganizationData,
  OrganizationResponse,
} from '../../services/organizationService';

interface OrganizationState {
  organizations: Organization[];
  selectedOrganization: Organization | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const initialState: OrganizationState = {
  organizations: [],
  selectedOrganization: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

export const fetchOrganizations = createAsyncThunk(
  'organizations/fetchOrganizations',
  async (
    params: { page?: number; limit?: number; search?: string; includeInactive?: boolean },
    { rejectWithValue }
  ) => {
    try {
      const query = new URLSearchParams();
      query.append('page', (params.page || 1).toString());
      query.append('limit', (params.limit || 10).toString());
      if (params.search) query.append('search', params.search);
      query.append('includeInactive', (params.includeInactive || false).toString());

      const response = await axiosInstance.get<OrganizationResponse>(`/organizations?${query.toString()}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch organizations');
    }
  }
);

export const fetchOrganizationById = createAsyncThunk(
  'organizations/fetchOrganizationById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<OrganizationResponse>(`/organizations/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch organization');
    }
  }
);

export const createOrganization = createAsyncThunk(
  'organizations/createOrganization',
  async (data: CreateOrganizationData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post<OrganizationResponse>('/organizations', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create organization');
    }
  }
);

export const updateOrganization = createAsyncThunk(
  'organizations/updateOrganization',
  async ({ id, data }: { id: number; data: UpdateOrganizationData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put<OrganizationResponse>(`/organizations/${id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update organization');
    }
  }
);

export const deactivateOrganization = createAsyncThunk(
  'organizations/deactivateOrganization',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete<OrganizationResponse>(`/organizations/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to deactivate organization');
    }
  }
);

export const reactivateOrganization = createAsyncThunk(
  'organizations/reactivateOrganization',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch<OrganizationResponse>(`/organizations/${id}/reactivate`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reactivate organization');
    }
  }
);

const organizationSlice = createSlice({
  name: 'organizations',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedOrganization: (state) => {
      state.selectedOrganization = null;
    },
    resetOrganizations: (state) => {
      state.organizations = [];
      state.selectedOrganization = null;
      state.error = null;
      state.pagination = { page: 1, limit: 10, total: 0, totalPages: 0 };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrganizations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrganizations.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        if (Array.isArray(action.payload.data)) {
          state.organizations = action.payload.data;
        }
        if (action.payload.pagination) {
          state.pagination = {
            page: action.payload.pagination.page,
            limit: action.payload.pagination.limit,
            total: action.payload.pagination.total,
            totalPages: action.payload.pagination.totalPages,
          };
        }
        state.error = null;
      })
      .addCase(fetchOrganizations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchOrganizationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrganizationById.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        if (!Array.isArray(action.payload.data)) {
          state.selectedOrganization = action.payload.data as Organization;
        }
        state.error = null;
      })
      .addCase(fetchOrganizationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(createOrganization.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrganization.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        if (!Array.isArray(action.payload.data)) {
          const newOrg = action.payload.data as Organization;
          state.organizations.unshift(newOrg);
          state.pagination.total += 1;
        }
        state.error = null;
      })
      .addCase(createOrganization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(updateOrganization.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrganization.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        if (!Array.isArray(action.payload.data)) {
          const updated = action.payload.data as Organization;
          const idx = state.organizations.findIndex((o) => o.id === updated.id);
          if (idx !== -1) state.organizations[idx] = updated;
          if (state.selectedOrganization?.id === updated.id) state.selectedOrganization = updated;
        }
        state.error = null;
      })
      .addCase(updateOrganization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(deactivateOrganization.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deactivateOrganization.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        if (!Array.isArray(action.payload.data)) {
          const deactivated = action.payload.data as Organization;
          const idx = state.organizations.findIndex((o) => o.id === deactivated.id);
          if (idx !== -1) state.organizations[idx] = deactivated;
          if (state.selectedOrganization?.id === deactivated.id) state.selectedOrganization = deactivated;
        }
        state.error = null;
      })
      .addCase(deactivateOrganization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(reactivateOrganization.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reactivateOrganization.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        if (!Array.isArray(action.payload.data)) {
          const reactivated = action.payload.data as Organization;
          const idx = state.organizations.findIndex((o) => o.id === reactivated.id);
          if (idx !== -1) state.organizations[idx] = reactivated;
          if (state.selectedOrganization?.id === reactivated.id) state.selectedOrganization = reactivated;
        }
        state.error = null;
      })
      .addCase(reactivateOrganization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearSelectedOrganization, resetOrganizations } = organizationSlice.actions;

export const selectOrganizations = (state: any) => state.organizations.organizations;
export const selectSelectedOrganization = (state: any) => state.organizations.selectedOrganization;
export const selectOrganizationsLoading = (state: any) => state.organizations.loading;
export const selectOrganizationsError = (state: any) => state.organizations.error;
export const selectOrganizationsPagination = (state: any) => state.organizations.pagination;

export const selectOrganizationById = (state: any, id: number) =>
  state.organizations.organizations.find((o: Organization) => o.id === id);

export const selectActiveOrganizations = (state: any) =>
  state.organizations.organizations.filter((o: Organization) => o.is_active === true);

export const selectInactiveOrganizations = (state: any) =>
  state.organizations.organizations.filter((o: Organization) => o.is_active === false);

export const selectOrganizationCount = (state: any) => state.organizations.organizations.length;

export default organizationSlice.reducer;
