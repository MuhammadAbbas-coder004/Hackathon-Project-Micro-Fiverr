// Service/Gig Slice - Manages services state
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  services: [],
  currentService: null,
  loading: false,
  error: null,
};

const serviceSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setServices: (state, action) => {
      state.loading = false;
      state.services = action.payload;
    },
    setCurrentService: (state, action) => {
      state.loading = false;
      state.currentService = action.payload;
    },
    addService: (state, action) => {
      state.loading = false;
      state.services.unshift(action.payload);
    },
    updateService: (state, action) => {
      state.loading = false;
      const index = state.services.findIndex((s) => s._id === action.payload._id);
      if (index !== -1) state.services[index] = action.payload;
    },
    removeService: (state, action) => {
      state.services = state.services.filter((s) => s._id !== action.payload);
    },
    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  setLoading,
  setServices,
  setCurrentService,
  addService,
  updateService,
  removeService,
  setError,
} = serviceSlice.actions;

export default serviceSlice.reducer;
