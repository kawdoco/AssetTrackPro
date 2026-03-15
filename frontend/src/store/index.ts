import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

/**
 * Redux Store Configuration
 * Centralized state management for the application
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    // Add more slices here as needed:
    // assets: assetsReducer,
    // alerts: alertsReducer,
    // zones: zonesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
