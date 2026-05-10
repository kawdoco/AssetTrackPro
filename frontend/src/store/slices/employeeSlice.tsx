import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../index';
import {
  createEmployee as createEmployeeApi,
  deleteEmployee as deleteEmployeeApi,
  fetchEmployeeOrganizations as fetchEmployeeOrganizationsApi,
  fetchEmployees as fetchEmployeesApi,
  updateEmployee as updateEmployeeApi,
  type EmployeeCreatePayload,
  type EmployeeRecord,
  type OrganizationOption,
} from '../../services/employeeService';

export type { EmployeeCreatePayload, EmployeeRecord } from '../../services/employeeService';

interface EmployeeState {
  employees: EmployeeRecord[];
  organizations: OrganizationOption[];
  loading: boolean;
  organizationsLoading: boolean;
  error: string | null;
}

const initialState: EmployeeState = {
  employees: [],
  organizations: [],
  loading: false,
  organizationsLoading: false,
  error: null,
};

const errorMessage = (error: any, fallback: string) =>
  error.response?.data?.message || error.message || fallback;

export const fetchEmployees = createAsyncThunk(
  'employees/fetchEmployees',
  async (search = '', { rejectWithValue }) => {
    try {
      return await fetchEmployeesApi(search);
    } catch (error: any) {
      return rejectWithValue(errorMessage(error, 'Failed to fetch employees'));
    }
  },
);

export const fetchEmployeeOrganizations = createAsyncThunk(
  'employees/fetchEmployeeOrganizations',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchEmployeeOrganizationsApi();
    } catch (error: any) {
      return rejectWithValue(errorMessage(error, 'Failed to fetch organizations'));
    }
  },
);

export const createEmployee = createAsyncThunk(
  'employees/createEmployee',
  async (payload: EmployeeCreatePayload, { rejectWithValue }) => {
    try {
      return await createEmployeeApi(payload);
    } catch (error: any) {
      return rejectWithValue(errorMessage(error, 'Failed to create employee'));
    }
  },
);

export const updateEmployee = createAsyncThunk(
  'employees/updateEmployee',
  async ({ id, data }: { id: number; data: EmployeeCreatePayload }, { rejectWithValue }) => {
    try {
      return await updateEmployeeApi(id, data);
    } catch (error: any) {
      return rejectWithValue(errorMessage(error, 'Failed to update employee'));
    }
  },
);

export const deactivateEmployee = createAsyncThunk(
  'employees/deactivateEmployee',
  async (id: number, { rejectWithValue }) => {
    try {
      return await deleteEmployeeApi(id);
    } catch (error: any) {
      return rejectWithValue(errorMessage(error, 'Failed to deactivate employee'));
    }
  },
);

const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    clearEmployeeError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchEmployeeOrganizations.pending, (state) => {
        state.organizationsLoading = true;
      })
      .addCase(fetchEmployeeOrganizations.fulfilled, (state, action) => {
        state.organizationsLoading = false;
        state.organizations = action.payload;
      })
      .addCase(fetchEmployeeOrganizations.rejected, (state, action) => {
        state.organizationsLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.employees.unshift(action.payload);
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        const index = state.employees.findIndex((employee) => employee.id === action.payload.id);
        if (index >= 0) state.employees[index] = action.payload;
      })
      .addCase(deactivateEmployee.fulfilled, (state, action) => {
        const index = state.employees.findIndex((employee) => employee.id === action.payload.id);
        if (index >= 0) state.employees[index] = action.payload;
      });
  },
});

export const { clearEmployeeError } = employeeSlice.actions;

export const selectEmployees = (state: RootState) => state.employees.employees;
export const selectEmployeeOrganizations = (state: RootState) => state.employees.organizations;
export const selectEmployeesLoading = (state: RootState) => state.employees.loading;
export const selectEmployeesError = (state: RootState) => state.employees.error;

export default employeeSlice.reducer;