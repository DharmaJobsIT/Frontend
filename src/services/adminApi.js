import { api } from "./api";

export const adminApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => "/admin/dashboard",
      providesTags: ["Admin"],
    }),
  }),
});

export const { useGetDashboardStatsQuery } = adminApi;
