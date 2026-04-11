// Job Slice - Manages jobs state (post, browse, apply)
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  jobs: [],
  currentJob: null,
  loading: false,
  error: null,
};

const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setJobs: (state, action) => {
      state.loading = false;
      state.jobs = action.payload;
    },
    setCurrentJob: (state, action) => {
      state.loading = false;
      state.currentJob = action.payload;
    },
    addJob: (state, action) => {
      state.loading = false;
      state.jobs.unshift(action.payload);
    },
    updateJob: (state, action) => {
      state.loading = false;
      const index = state.jobs.findIndex((j) => j._id === action.payload._id);
      if (index !== -1) state.jobs[index] = action.payload;
    },
    removeJob: (state, action) => {
      state.jobs = state.jobs.filter((j) => j._id !== action.payload);
    },
    applyToJob: (state, action) => {
      const job = state.jobs.find((j) => j._id === action.payload.jobId);
      if (job) job.applicants.push(action.payload.userId);
    },
    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  setLoading,
  setJobs,
  setCurrentJob,
  addJob,
  updateJob,
  removeJob,
  applyToJob,
  setError,
} = jobSlice.actions;

export default jobSlice.reducer;
