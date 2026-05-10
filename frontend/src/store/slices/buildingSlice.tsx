import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { buildingService } from '../../services/buildingService';
import type {
  Building,
  BuildingResponse,
  CreateBuildingData,
  UpdateBuildingData,
} from '../../services/buildingService';
import type { RootState } from '../index';

interface BuildingState {
  buildings: Building[];
  selectedBuilding: Building | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const initialState: BuildingState = {
  buildings: [],
  selectedBuilding: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

const getErrorMessage = (error: any, fallback: string) =>
  error.response?.data?.message || error.message || fallback;

const normalizePagination = (response: BuildingResponse, fallbackPage = 1, fallbackLimit = 10) => {
  const pagination = response.pagination;

  return {
    page: pagination?.page ?? pagination?.currentPage ?? fallbackPage,
    limit: pagination?.limit ?? pagination?.itemsPerPage ?? fallbackLimit,
    total: pagination?.total ?? pagination?.totalItems ?? 0,
    totalPages:
      pagination?.totalPages ??
      Math.ceil((pagination?.total ?? pagination?.totalItems ?? 0) / (pagination?.limit ?? pagination?.itemsPerPage ?? fallbackLimit)),
  };
};

export const fetchBuildings = createAsyncThunk(
  'buildings/fetchBuildings',
  async (
    params: { page?: number; limit?: number; search?: string; branch_id?: number } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await buildingService.getBuildings(
        params.page || 1,
        params.limit || 10,
        params.search || '',
        params.branch_id
      );
      return { response, page: params.page || 1, limit: params.limit || 10 };
    } catch (error: any) {
      return rejectWithValue(getErrorMessage(error, 'Failed to fetch buildings'));
    }
  }
);

export const fetchBuildingById = createAsyncThunk(
  'buildings/fetchBuildingById',
  async (id: number, { rejectWithValue }) => {
    try {
      return await buildingService.getBuildingById(id);
    } catch (error: any) {
      return rejectWithValue(getErrorMessage(error, 'Failed to fetch building'));
    }
  }
);

export const createBuilding = createAsyncThunk(
  'buildings/createBuilding',
  async (data: CreateBuildingData, { rejectWithValue }) => {
    try {
      return await buildingService.createBuilding(data);
    } catch (error: any) {
      return rejectWithValue(getErrorMessage(error, 'Failed to create building'));
    }
  }
);

export const updateBuilding = createAsyncThunk(
  'buildings/updateBuilding',
  async ({ id, data }: { id: number; data: UpdateBuildingData }, { rejectWithValue }) => {
    try {
      return await buildingService.updateBuilding(id, data);
    } catch (error: any) {
      return rejectWithValue(getErrorMessage(error, 'Failed to update building'));
    }
  }
);

export const deleteBuilding = createAsyncThunk(
  'buildings/deleteBuilding',
  async (id: number, { rejectWithValue }) => {
    try {
      await buildingService.deleteBuilding(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(getErrorMessage(error, 'Failed to delete building'));
    }
  }
);

const buildingSlice = createSlice({
  name: 'buildings',
  initialState,
  reducers: {
    setSelectedBuilding: (state, action: PayloadAction<Building | null>) => {
      state.selectedBuilding = action.payload;
    },
    clearBuildingError: (state) => {
      state.error = null;
    },
    resetBuildings: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBuildings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBuildings.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload.response.data;
        state.buildings = Array.isArray(data) ? data : [];
        state.pagination = normalizePagination(action.payload.response, action.payload.page, action.payload.limit);
      })
      .addCase(fetchBuildings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchBuildingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBuildingById.fulfilled, (state, action) => {
        state.loading = false;
        if (!Array.isArray(action.payload.data) && action.payload.data) {
          state.selectedBuilding = action.payload.data;
          const index = state.buildings.findIndex((building) => building.id === action.payload.data?.id);
          if (index >= 0) state.buildings[index] = action.payload.data;
        }
      })
      .addCase(fetchBuildingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createBuilding.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBuilding.fulfilled, (state, action) => {
        state.loading = false;
        if (!Array.isArray(action.payload.data) && action.payload.data) {
          state.buildings.unshift(action.payload.data);
          state.selectedBuilding = action.payload.data;
          state.pagination.total += 1;
        }
      })
      .addCase(createBuilding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateBuilding.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBuilding.fulfilled, (state, action) => {
        state.loading = false;
        if (!Array.isArray(action.payload.data) && action.payload.data) {
          const updated = action.payload.data;
          const index = state.buildings.findIndex((building) => building.id === updated.id);
          if (index >= 0) state.buildings[index] = updated;
          if (state.selectedBuilding?.id === updated.id) state.selectedBuilding = updated;
        }
      })
      .addCase(updateBuilding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteBuilding.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBuilding.fulfilled, (state, action) => {
        state.loading = false;
        state.buildings = state.buildings.filter((building) => building.id !== action.payload);
        if (state.selectedBuilding?.id === action.payload) state.selectedBuilding = null;
        state.pagination.total = Math.max(0, state.pagination.total - 1);
      })
      .addCase(deleteBuilding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedBuilding, clearBuildingError, resetBuildings } = buildingSlice.actions;

export const selectBuildingsState = (state: RootState) => state.buildings;
export const selectAllBuildings = (state: RootState) => state.buildings.buildings;
export const selectBuildingsLoading = (state: RootState) => state.buildings.loading;
export const selectBuildingsError = (state: RootState) => state.buildings.error;
export const selectBuildingsPagination = (state: RootState) => state.buildings.pagination;
export const selectSelectedBuilding = (state: RootState) => state.buildings.selectedBuilding;
export const selectBuildingsByBranch = (state: RootState, branchId: number) =>
  state.buildings.buildings.filter((building) => building.branch_id === branchId);

export default buildingSlice.reducer;
