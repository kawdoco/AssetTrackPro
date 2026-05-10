import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';
import * as zoneService from '../../services/zoneService';
import type { CreateZoneData, UpdateZoneData, Zone } from '../../services/zoneService';

interface ZoneState {
  zones: Zone[];
  selectedZone: Zone | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const initialState: ZoneState = {
  zones: [],
  selectedZone: null,
  loading: false,
  error: null,
  pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
};

const errorMessage = (error: any, fallback: string) =>
  error.response?.data?.message || error.message || fallback;

export const fetchZones = createAsyncThunk(
  'zones/fetchZones',
  async (
    params: { page?: number; limit?: number; search?: string; building_id?: number; zone_type?: string } = {},
    { rejectWithValue },
  ) => {
    try {
      return await zoneService.getZones(
        params.page || 1,
        params.limit || 10,
        params.search || '',
        params.building_id,
        params.zone_type,
      );
    } catch (error: any) {
      return rejectWithValue(errorMessage(error, 'Failed to fetch zones'));
    }
  },
);

export const createZone = createAsyncThunk(
  'zones/createZone',
  async (data: CreateZoneData, { rejectWithValue }) => {
    try {
      return await zoneService.createZone(data);
    } catch (error: any) {
      return rejectWithValue(errorMessage(error, 'Failed to create zone'));
    }
  },
);

export const updateZone = createAsyncThunk(
  'zones/updateZone',
  async ({ id, data }: { id: number; data: UpdateZoneData }, { rejectWithValue }) => {
    try {
      return await zoneService.updateZone(id, data);
    } catch (error: any) {
      return rejectWithValue(errorMessage(error, 'Failed to update zone'));
    }
  },
);

export const deleteZone = createAsyncThunk(
  'zones/deleteZone',
  async (id: number, { rejectWithValue }) => {
    try {
      await zoneService.deleteZone(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(errorMessage(error, 'Failed to delete zone'));
    }
  },
);

const zoneSlice = createSlice({
  name: 'zones',
  initialState,
  reducers: {
    setSelectedZone: (state, action: PayloadAction<Zone | null>) => {
      state.selectedZone = action.payload;
    },
    clearZoneError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchZones.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchZones.fulfilled, (state, action) => {
        state.loading = false;
        state.zones = Array.isArray(action.payload.data) ? action.payload.data : [];
        if (action.payload.pagination) state.pagination = action.payload.pagination;
      })
      .addCase(fetchZones.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createZone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createZone.fulfilled, (state, action) => {
        state.loading = false;
        if (!Array.isArray(action.payload.data) && action.payload.data) {
          state.zones.unshift(action.payload.data);
          state.pagination.total += 1;
        }
      })
      .addCase(createZone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateZone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateZone.fulfilled, (state, action) => {
        state.loading = false;
        if (!Array.isArray(action.payload.data) && action.payload.data) {
          const updated = action.payload.data;
          const index = state.zones.findIndex((zone) => zone.id === updated.id);
          if (index >= 0) state.zones[index] = updated;
          if (state.selectedZone?.id === updated.id) state.selectedZone = updated;
        }
      })
      .addCase(updateZone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteZone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteZone.fulfilled, (state, action) => {
        state.loading = false;
        state.zones = state.zones.filter((zone) => zone.id !== action.payload);
        state.pagination.total = Math.max(0, state.pagination.total - 1);
      })
      .addCase(deleteZone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedZone, clearZoneError } = zoneSlice.actions;

export const selectZones = (state: RootState) => state.zones.zones;
export const selectZonesLoading = (state: RootState) => state.zones.loading;
export const selectZonesError = (state: RootState) => state.zones.error;
export const selectZonesPagination = (state: RootState) => state.zones.pagination;

export default zoneSlice.reducer;