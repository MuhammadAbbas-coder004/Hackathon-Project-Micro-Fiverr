// Redux Store Configuration
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import jobReducer from './slices/jobSlice';
import serviceReducer from './slices/serviceSlice';
import chatReducer from './slices/chatSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobReducer,
    services: serviceReducer,
    chat: chatReducer,
  },
});

export default store;
