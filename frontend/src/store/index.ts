import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import assetReducer from './slices/assetSlice';
import branchReducer from './slices/branchSlice';
import organizationReducer from './slices/organizationSlice';
import employeeReducer from './slices/employeeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    assets: assetReducer,
    branches: branchReducer,
    organizations: organizationReducer,
    employee: employeeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;


