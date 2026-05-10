import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import buildingReducer from './slices/buildingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    buildings: buildingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
