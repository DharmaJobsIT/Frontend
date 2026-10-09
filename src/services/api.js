import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5001/api", // backend URL
    prepareHeaders: (headers, { getState }) => {
      const admin = getState().admin.adminInfo;

      if (admin?.token) {
        headers.set("authorization", `Bearer ${admin.token}`);
      }

      return headers;
    },
  }),
  tagTypes: ["Admin", "Recruiter", "Job"],
  endpoints: () => ({}),
});
