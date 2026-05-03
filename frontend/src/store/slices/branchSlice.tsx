import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../services/axiosInstance';
import type {
  Branch,
  CreateBranchData,
  UpdateBranchData,
  UpdateBranchMapData,
  BranchResponse,
} from '../../services/branchService';

// ============================================================================
// State Interface
// ============================================================================
interface BranchState {
  branches: Branch[];
  selectedBranch: Branch | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================================================
// Initial State
// ============================================================================
const initialState: BranchState = {
  branches: [],
  selectedBranch: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

// ============================================================================
// Async Thunks
// ============================================================================

/**
 * Fetch all branches with pagination and filters
 */
export const fetchBranches = createAsyncThunk(
  'branches/fetchBranches',
  async (
    params: {
      page?: number;
      limit?: number;
      search?: string;
      organization_id?: number;
      includeInactive?: boolean;
    },
    { rejectWithValue }
  ) => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('page', (params.page || 1).toString());
      queryParams.append('limit', (params.limit || 10).toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.organization_id) queryParams.append('organization_id', params.organization_id.toString());
      queryParams.append('includeInactive', (params.includeInactive || false).toString());

      const response = await axiosInstance.get<BranchResponse>(`/branches?${queryParams.toString()}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch branches');
    }
  }
);

/**
 * Fetch single branch by ID
 */
export const fetchBranchById = createAsyncThunk(
  'branches/fetchBranchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<BranchResponse>(`/branches/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch branch');
    }
  }
);

/**
 * Create new branch
 */
export const createBranch = createAsyncThunk(
  'branches/createBranch',
  async (data: CreateBranchData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post<BranchResponse>('/branches', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create branch');
    }
  }
);

/**
 * Update branch details
 */
export const updateBranch = createAsyncThunk(
  'branches/updateBranch',
  async ({ id, data }: { id: number; data: UpdateBranchData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put<BranchResponse>(`/branches/${id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update branch');
    }
  }
);

/**
 * Deactivate branch (soft delete)
 */
export const deactivateBranch = createAsyncThunk(
  'branches/deactivateBranch',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete<BranchResponse>(`/branches/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to deactivate branch');
    }
  }
);

/**
 * Reactivate branch
 */
export const reactivateBranch = createAsyncThunk(
  'branches/reactivateBranch',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch<BranchResponse>(`/branches/${id}/reactivate`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reactivate branch');
    }
  }
);

/**
 * Fetch branch map data
 */
export const fetchBranchMap = createAsyncThunk(
  'branches/fetchBranchMap',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<BranchResponse>(`/branches/${id}/map`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch branch map');
    }
  }
);

/**
 * Update branch map data
 */
export const updateBranchMap = createAsyncThunk(
  'branches/updateBranchMap',
  async ({ id, data }: { id: number; data: UpdateBranchMapData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put<BranchResponse>(`/branches/${id}/map`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update branch map');
    }
  }
);

// ============================================================================
// Slice
// ============================================================================
const branchSlice = createSlice({
  name: 'branches',
  initialState,
  reducers: {
    /**
     * Clear error message
     */
    clearError: (state) => {
      state.error = null;
    },

    /**
     * Clear selected branch
     */
    clearSelectedBranch: (state) => {
      state.selectedBranch = null;
    },

    /**
     * Reset branches to initial state
     */
    resetBranches: (state) => {
      state.branches = [];
      state.selectedBranch = null;
      state.error = null;
      state.pagination = {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      };
    },
  },

  extraReducers: (builder) => {
    // ========================================================================
    // fetchBranches
    // ========================================================================
    builder
      .addCase(fetchBranches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBranches.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(action.payload.data)) {
          state.branches = action.payload.data;
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
      .addCase(fetchBranches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ========================================================================
    // fetchBranchById
    // ========================================================================
    builder
      .addCase(fetchBranchById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBranchById.fulfilled, (state, action) => {
        state.loading = false;
        if (!Array.isArray(action.payload.data)) {
          state.selectedBranch = action.payload.data as Branch;
        }
        state.error = null;
      })
      .addCase(fetchBranchById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ========================================================================
    // createBranch
    // ========================================================================
    builder
      .addCase(createBranch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBranch.fulfilled, (state, action) => {
        state.loading = false;
        if (!Array.isArray(action.payload.data)) {
          const newBranch = action.payload.data as Branch;
          state.branches.unshift(newBranch);
          state.pagination.total += 1;
        }
        state.error = null;
      })
      .addCase(createBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ========================================================================
    // updateBranch
    // ========================================================================
    builder
      .addCase(updateBranch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBranch.fulfilled, (state, action) => {
        state.loading = false;
        if (!Array.isArray(action.payload.data)) {
          const updatedBranch = action.payload.data as Branch;
          const index = state.branches.findIndex((b) => b.id === updatedBranch.id);
          if (index !== -1) {
            state.branches[index] = updatedBranch;
          }
          if (state.selectedBranch?.id === updatedBranch.id) {
            state.selectedBranch = updatedBranch;
          }
        }
        state.error = null;
      })
      .addCase(updateBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ========================================================================
    // deactivateBranch
    // ========================================================================
    builder
      .addCase(deactivateBranch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deactivateBranch.fulfilled, (state, action) => {
        state.loading = false;
        if (!Array.isArray(action.payload.data)) {
          const deactivatedBranch = action.payload.data as Branch;
          const index = state.branches.findIndex((b) => b.id === deactivatedBranch.id);
          if (index !== -1) {
            state.branches[index] = deactivatedBranch;
          }
          if (state.selectedBranch?.id === deactivatedBranch.id) {
            state.selectedBranch = deactivatedBranch;
          }
        }
        state.error = null;
      })
      .addCase(deactivateBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ========================================================================
    // reactivateBranch
    // ========================================================================
    builder
      .addCase(reactivateBranch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reactivateBranch.fulfilled, (state, action) => {
        state.loading = false;
        if (!Array.isArray(action.payload.data)) {
          const reactivatedBranch = action.payload.data as Branch;
          const index = state.branches.findIndex((b) => b.id === reactivatedBranch.id);
          if (index !== -1) {
            state.branches[index] = reactivatedBranch;
          }
          if (state.selectedBranch?.id === reactivatedBranch.id) {
            state.selectedBranch = reactivatedBranch;
          }
        }
        state.error = null;
      })
      .addCase(reactivateBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ========================================================================
    // fetchBranchMap
    // ========================================================================
    builder
      .addCase(fetchBranchMap.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBranchMap.fulfilled, (state, action) => {
        state.loading = false;
        if (!Array.isArray(action.payload.data)) {
          const mapBranch = action.payload.data as Branch;
          const index = state.branches.findIndex((b) => b.id === mapBranch.id);
          if (index !== -1) {
            state.branches[index] = mapBranch;
          }
          if (state.selectedBranch?.id === mapBranch.id) {
            state.selectedBranch = mapBranch;
          }
        }
        state.error = null;
      })
      .addCase(fetchBranchMap.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ========================================================================
    // updateBranchMap
    // ========================================================================
    builder
      .addCase(updateBranchMap.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBranchMap.fulfilled, (state, action) => {
        state.loading = false;
        if (!Array.isArray(action.payload.data)) {
          const updatedMapBranch = action.payload.data as Branch;
          const index = state.branches.findIndex((b) => b.id === updatedMapBranch.id);
          if (index !== -1) {
            state.branches[index] = updatedMapBranch;
          }
          if (state.selectedBranch?.id === updatedMapBranch.id) {
            state.selectedBranch = updatedMapBranch;
          }
        }
        state.error = null;
      })
      .addCase(updateBranchMap.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// ============================================================================
// Actions
// ============================================================================
export const { clearError, clearSelectedBranch, resetBranches } = branchSlice.actions;

// ============================================================================
// Selectors
// ============================================================================
export const selectBranches = (state: any) => state.branches.branches;
export const selectSelectedBranch = (state: any) => state.branches.selectedBranch;
export const selectBranchesLoading = (state: any) => state.branches.loading;
export const selectBranchesError = (state: any) => state.branches.error;
export const selectBranchesPagination = (state: any) => state.branches.pagination;

export const selectBranchById = (state: any, id: number) =>
  state.branches.branches.find((branch: Branch) => branch.id === id);

export const selectActiveBranches = (state: any) =>
  state.branches.branches.filter((branch: Branch) => branch.status === 'ACTIVE');

export const selectInactiveBranches = (state: any) =>
  state.branches.branches.filter((branch: Branch) => branch.status === 'INACTIVE');

export const selectBranchCount = (state: any) => state.branches.branches.length;

export const selectBranchesByOrganization = (state: any, organizationId: number) =>
  state.branches.branches.filter((branch: Branch) => branch.organization_id === organizationId);

// ============================================================================
// Export Reducer
// ============================================================================
export default branchSlice.reducer;