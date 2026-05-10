
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../services/axiosInstance';
import type { RootState } from '../index';

// ============================================================================
// Types
// ============================================================================

export interface AssetZoneSummary {
	id: number;
	zone_name: string;
	zone_type: string;
}

export interface Asset {
	id: number;
	organization_id: number;
	asset_tag_uid: string;
	asset_type: string;
	model: string | null;
	serial_number: string | null;
	status: string; // ACTIVE, LOST, RECOVERED, RETIRED
	last_seen_zone_id: number | null;
	last_seen_time: string | null;
	created_at: string;
	updated_at: string;
	last_seen_zone?: AssetZoneSummary | null;
}

export interface AssetAssignmentEmployeeSummary {
	id: number;
	employee_code: string;
	name: string;
	email: string;
	status: string;
	is_active: boolean;
}

export interface AssetAssignmentAssetSummary {
	id: number;
	asset_tag_uid: string;
	asset_type: string;
	model: string | null;
	serial_number: string | null;
	status: string;
}

export interface AssetAssignment {
	id: number;
	asset_id: number;
	employee_id: number;
	assigned_at: string;
	returned_at: string | null;
	notes: string | null;
	created_at: string;
	updated_at: string;
	asset: AssetAssignmentAssetSummary;
	employee: AssetAssignmentEmployeeSummary;
}

export interface CreateAssetData {
	asset_tag_uid: string;
	asset_type: string;
	model?: string | null;
	serial_number?: string | null;
	status?: string;
	last_seen_zone_id?: number | null;
	last_seen_time?: string | null;
}

export type UpdateAssetData = Partial<CreateAssetData>;

export interface AssignAssetData {
	employee_id: number;
	assigned_at?: string;
	notes?: string | null;
}

export interface ReturnAssignmentData {
	returned_at?: string;
	notes?: string | null;
}

interface ApiResponse<T> {
	success: boolean;
	message?: string;
	data: T;
}

// ============================================================================
// State
// ============================================================================

interface AssetState {
	assets: Asset[];
	selectedAsset: Asset | null;
	assignmentsByAssetId: Record<number, AssetAssignment[]>;
	loading: boolean;
	error: string | null;
	assignmentsLoadingByAssetId: Record<number, boolean>;
}

const initialState: AssetState = {
	assets: [],
	selectedAsset: null,
	assignmentsByAssetId: {},
	loading: false,
	error: null,
	assignmentsLoadingByAssetId: {},
};

// ============================================================================
// Async Thunks
// ============================================================================

export const fetchAssets = createAsyncThunk(
	'assets/fetchAssets',
	async (
		params: { search?: string; status?: string; asset_type?: string } = {},
		{ rejectWithValue }
	) => {
		try {
			const query = new URLSearchParams();
			if (params.search) query.append('search', params.search);
			if (params.status) query.append('status', params.status);
			if (params.asset_type) query.append('asset_type', params.asset_type);

			const suffix = query.toString() ? `?${query.toString()}` : '';
			const response = await axiosInstance.get<ApiResponse<Asset[]>>(`/assets${suffix}`);
			return response.data.data;
		} catch (error: any) {
			return rejectWithValue(error.response?.data?.message || 'Failed to fetch assets');
		}
	}
);

export const fetchAssetById = createAsyncThunk(
	'assets/fetchAssetById',
	async (id: number, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.get<ApiResponse<Asset>>(`/assets/${id}`);
			return response.data.data;
		} catch (error: any) {
			return rejectWithValue(error.response?.data?.message || 'Failed to fetch asset');
		}
	}
);

export const createAsset = createAsyncThunk(
	'assets/createAsset',
	async (data: CreateAssetData, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.post<ApiResponse<Asset>>('/assets', data);
			return response.data.data;
		} catch (error: any) {
			return rejectWithValue(error.response?.data?.message || 'Failed to create asset');
		}
	}
);

export const updateAsset = createAsyncThunk(
	'assets/updateAsset',
	async ({ id, data }: { id: number; data: UpdateAssetData }, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.put<ApiResponse<Asset>>(`/assets/${id}`, data);
			return response.data.data;
		} catch (error: any) {
			return rejectWithValue(error.response?.data?.message || 'Failed to update asset');
		}
	}
);

export const deleteAsset = createAsyncThunk(
	'assets/deleteAsset',
	async (id: number, { rejectWithValue }) => {
		try {
			await axiosInstance.delete<ApiResponse<unknown>>(`/assets/${id}`);
			return id;
		} catch (error: any) {
			return rejectWithValue(error.response?.data?.message || 'Failed to delete asset');
		}
	}
);

export const fetchAssetAssignments = createAsyncThunk(
	'assets/fetchAssetAssignments',
	async (
		{ assetId, active }: { assetId: number; active?: boolean },
		{ rejectWithValue }
	) => {
		try {
			const query = new URLSearchParams();
			if (active !== undefined) query.append('active', String(active));
			const suffix = query.toString() ? `?${query.toString()}` : '';

			const response = await axiosInstance.get<ApiResponse<AssetAssignment[]>>(
				`/assets/${assetId}/assignments${suffix}`
			);

			return { assetId, assignments: response.data.data };
		} catch (error: any) {
			return rejectWithValue(error.response?.data?.message || 'Failed to fetch asset assignments');
		}
	}
);

export const assignAssetToEmployee = createAsyncThunk(
	'assets/assignAssetToEmployee',
	async (
		{ assetId, data }: { assetId: number; data: AssignAssetData },
		{ rejectWithValue }
	) => {
		try {
			const response = await axiosInstance.post<ApiResponse<AssetAssignment>>(
				`/assets/${assetId}/assignments`,
				data
			);
			return { assetId, assignment: response.data.data };
		} catch (error: any) {
			return rejectWithValue(error.response?.data?.message || 'Failed to assign asset');
		}
	}
);

export const returnAssetAssignment = createAsyncThunk(
	'assets/returnAssetAssignment',
	async (
		{
			assetId,
			assignmentId,
			data,
		}: { assetId: number; assignmentId: number; data: ReturnAssignmentData },
		{ rejectWithValue }
	) => {
		try {
			const response = await axiosInstance.patch<ApiResponse<AssetAssignment>>(
				`/assets/${assetId}/assignments/${assignmentId}/return`,
				data
			);
			return { assetId, assignment: response.data.data };
		} catch (error: any) {
			return rejectWithValue(error.response?.data?.message || 'Failed to return assignment');
		}
	}
);

// ============================================================================
// Slice
// ============================================================================

const assetSlice = createSlice({
	name: 'assets',
	initialState,
	reducers: {
		setSelectedAsset: (state, action: PayloadAction<Asset | null>) => {
			state.selectedAsset = action.payload;
		},
		clearAssetError: (state) => {
			state.error = null;
		},
		clearAssetAssignments: (state, action: PayloadAction<number>) => {
			delete state.assignmentsByAssetId[action.payload];
			delete state.assignmentsLoadingByAssetId[action.payload];
		},
	},
	extraReducers: (builder) => {
		builder
			// Fetch Assets
			.addCase(fetchAssets.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchAssets.fulfilled, (state, action) => {
				state.loading = false;
				state.assets = action.payload;
			})
			.addCase(fetchAssets.rejected, (state, action) => {
				state.loading = false;
				state.error = (action.payload as string) || 'Failed to fetch assets';
			})

			// Fetch Asset By Id
			.addCase(fetchAssetById.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchAssetById.fulfilled, (state, action) => {
				state.loading = false;
				state.selectedAsset = action.payload;

				const index = state.assets.findIndex((asset) => asset.id === action.payload.id);
				if (index >= 0) {
					state.assets[index] = action.payload;
				} else {
					state.assets.unshift(action.payload);
				}
			})
			.addCase(fetchAssetById.rejected, (state, action) => {
				state.loading = false;
				state.error = (action.payload as string) || 'Failed to fetch asset';
			})

			// Create
			.addCase(createAsset.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(createAsset.fulfilled, (state, action) => {
				state.loading = false;
				state.assets.unshift(action.payload);
				state.selectedAsset = action.payload;
			})
			.addCase(createAsset.rejected, (state, action) => {
				state.loading = false;
				state.error = (action.payload as string) || 'Failed to create asset';
			})

			// Update
			.addCase(updateAsset.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(updateAsset.fulfilled, (state, action) => {
				state.loading = false;
				const index = state.assets.findIndex((asset) => asset.id === action.payload.id);
				if (index >= 0) {
					state.assets[index] = action.payload;
				} else {
					state.assets.unshift(action.payload);
				}
				if (state.selectedAsset?.id === action.payload.id) {
					state.selectedAsset = action.payload;
				}
			})
			.addCase(updateAsset.rejected, (state, action) => {
				state.loading = false;
				state.error = (action.payload as string) || 'Failed to update asset';
			})

			// Delete
			.addCase(deleteAsset.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(deleteAsset.fulfilled, (state, action) => {
				state.loading = false;
				state.assets = state.assets.filter((asset) => asset.id !== action.payload);
				if (state.selectedAsset?.id === action.payload) {
					state.selectedAsset = null;
				}
				delete state.assignmentsByAssetId[action.payload];
				delete state.assignmentsLoadingByAssetId[action.payload];
			})
			.addCase(deleteAsset.rejected, (state, action) => {
				state.loading = false;
				state.error = (action.payload as string) || 'Failed to delete asset';
			})

			// Assignments
			.addCase(fetchAssetAssignments.pending, (state, action) => {
				const assetId = action.meta.arg.assetId;
				state.assignmentsLoadingByAssetId[assetId] = true;
				state.error = null;
			})
			.addCase(fetchAssetAssignments.fulfilled, (state, action) => {
				state.assignmentsLoadingByAssetId[action.payload.assetId] = false;
				state.assignmentsByAssetId[action.payload.assetId] = action.payload.assignments;
			})
			.addCase(fetchAssetAssignments.rejected, (state, action) => {
				const assetId = action.meta.arg.assetId;
				state.assignmentsLoadingByAssetId[assetId] = false;
				state.error = (action.payload as string) || 'Failed to fetch asset assignments';
			})

			.addCase(assignAssetToEmployee.pending, (state, action) => {
				state.assignmentsLoadingByAssetId[action.meta.arg.assetId] = true;
				state.error = null;
			})
			.addCase(assignAssetToEmployee.fulfilled, (state, action) => {
				state.assignmentsLoadingByAssetId[action.payload.assetId] = false;
				const existing = state.assignmentsByAssetId[action.payload.assetId] || [];
				state.assignmentsByAssetId[action.payload.assetId] = [action.payload.assignment, ...existing];
			})
			.addCase(assignAssetToEmployee.rejected, (state, action) => {
				const assetId = action.meta.arg.assetId;
				state.assignmentsLoadingByAssetId[assetId] = false;
				state.error = (action.payload as string) || 'Failed to assign asset';
			})

			.addCase(returnAssetAssignment.pending, (state, action) => {
				state.assignmentsLoadingByAssetId[action.meta.arg.assetId] = true;
				state.error = null;
			})
			.addCase(returnAssetAssignment.fulfilled, (state, action) => {
				state.assignmentsLoadingByAssetId[action.payload.assetId] = false;
				const existing = state.assignmentsByAssetId[action.payload.assetId] || [];
				state.assignmentsByAssetId[action.payload.assetId] = existing.map((assignment) =>
					assignment.id === action.payload.assignment.id ? action.payload.assignment : assignment
				);
			})
			.addCase(returnAssetAssignment.rejected, (state, action) => {
				const assetId = action.meta.arg.assetId;
				state.assignmentsLoadingByAssetId[assetId] = false;
				state.error = (action.payload as string) || 'Failed to return assignment';
			});
	},
});

export const { setSelectedAsset, clearAssetError, clearAssetAssignments } = assetSlice.actions;

export default assetSlice.reducer;

// ============================================================================
// Selectors
// ============================================================================

export const selectAssetsState = (state: RootState) => state.assets;
export const selectAllAssets = (state: RootState) => state.assets.assets;
export const selectAssetsLoading = (state: RootState) => state.assets.loading;
export const selectAssetsError = (state: RootState) => state.assets.error;
export const selectSelectedAsset = (state: RootState) => state.assets.selectedAsset;

export const selectAssetById = (state: RootState, id: number) =>
	state.assets.assets.find((asset) => asset.id === id) || null;

export const selectAssetAssignments = (state: RootState, assetId: number) =>
	state.assets.assignmentsByAssetId[assetId] || [];

export const selectAssetAssignmentsLoading = (state: RootState, assetId: number) =>
	!!state.assets.assignmentsLoadingByAssetId[assetId];

