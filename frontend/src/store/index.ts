import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import assetReducer from './slices/assetSlice';
import branchReducer from './slices/branchSlice';
import organizationReducer from './slices/organizationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    assets: assetReducer,
    branches: branchReducer,
    organizations: organizationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;


