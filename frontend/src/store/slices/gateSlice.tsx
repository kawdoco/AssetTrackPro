import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';
import {
  createGate as createGateApi,
  deleteGate as deleteGateApi,
  getGates,
  updateGate as updateGateApi,
  type Gate,
  type GatePayload,
} from '../../services/gateService';

interface GateState {
  gates: Gate[];
  selectedGate: Gate | null;
  loading: boolean;
  error: string | null;
}

const initialState: GateState = {
  gates: [],
  selectedGate: null,
  loading: false,
  error: null,
};

const errorMessage = (error: any, fallback: string) =>
  error.response?.data?.message || error.message || fallback;

export const fetchGates = createAsyncThunk(
  'gates/fetchGates',
  async (params: { search?: string; zone_id?: number; branch_id?: number } = {}, { rejectWithValue }) => {
    try {
      return await getGates(params);
    } catch (error: any) {
      return rejectWithValue(errorMessage(error, 'Failed to fetch gates'));
    }
  },
);

export const createGate = createAsyncThunk(
  'gates/createGate',
  async (data: GatePayload, { rejectWithValue }) => {
    try {
      return await createGateApi(data);
    } catch (error: any) {
      return rejectWithValue(errorMessage(error, 'Failed to create gate'));
    }
  },
);

export const updateGate = createAsyncThunk(
  'gates/updateGate',
  async ({ id, data }: { id: number; data: Partial<GatePayload> }, { rejectWithValue }) => {
    try {
      return await updateGateApi(id, data);
    } catch (error: any) {
      return rejectWithValue(errorMessage(error, 'Failed to update gate'));
    }
  },
);

export const deleteGate = createAsyncThunk(
  'gates/deleteGate',
  async (id: number, { rejectWithValue }) => {
    try {
      await deleteGateApi(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(errorMessage(error, 'Failed to delete gate'));
    }
  },
);

const gateSlice = createSlice({
  name: 'gates',
  initialState,
  reducers: {
    setSelectedGate: (state, action: PayloadAction<Gate | null>) => {
      state.selectedGate = action.payload;
    },
    clearGateError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGates.fulfilled, (state, action) => {
        state.loading = false;
        state.gates = Array.isArray(action.payload.data) ? action.payload.data : [];
      })
      .addCase(fetchGates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createGate.fulfilled, (state, action) => {
        if (action.payload.data) state.gates.unshift(action.payload.data);
      })
      .addCase(updateGate.fulfilled, (state, action) => {
        if (!action.payload.data) return;
        const index = state.gates.findIndex((gate) => gate.id === action.payload.data.id);
        if (index >= 0) state.gates[index] = action.payload.data;
      })
      .addCase(deleteGate.fulfilled, (state, action) => {
        state.gates = state.gates.filter((gate) => gate.id !== action.payload);
      });
  },
});

export const { setSelectedGate, clearGateError } = gateSlice.actions;

export const selectGates = (state: RootState) => state.gates.gates;
export const selectGatesLoading = (state: RootState) => state.gates.loading;
export const selectGatesError = (state: RootState) => state.gates.error;

export default gateSlice.reducer;