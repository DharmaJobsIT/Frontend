import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  adminInfo: null,
  dashboardStats: null,
  pendingRecruiters: [],
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdminInfo: (state, action) => {
      state.adminInfo = action.payload;
    },
    setDashboardStats: (state, action) => {
      state.dashboardStats = action.payload;
    },
    setPendingRecruiters: (state, action) => {
      state.pendingRecruiters = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    logoutAdmin: (state) => {
      state.adminInfo = null;
      state.dashboardStats = null;
      state.pendingRecruiters = [];
    },
  },
});

export const {
  setAdminInfo,
  setDashboardStats,
  setPendingRecruiters,
  setLoading,
  setError,
  logoutAdmin,
} = adminSlice.actions;

export default adminSlice.reducer;
