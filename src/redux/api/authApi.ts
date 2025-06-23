/* eslint-disable no-mixed-spaces-and-tabs */
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../queryInteceptors";

export const authApi = createApi({
  reducerPath: "auth",
  baseQuery: baseQuery,
  refetchOnReconnect: true,
  refetchOnMountOrArgChange: 20,
  tagTypes: ["auth"],
  endpoints: (builder) => ({
    getCurrentUser: builder.query({
      query: () => ({
        url: "auth/get-me",
        method: "GET",
      }),
      providesTags: ["auth"],
    }),
    login: builder.mutation({
      query: (body) => ({
        url: "auth/login",
        body,
        method: "POST",
      }),
      invalidatesTags: ["auth"],
    }),
    register: builder.mutation({
      query: (body) => ({
        url: "auth/register",
        body,
        method: "POST",
      }),
      invalidatesTags: ["auth"],
    }),
    logout: builder.mutation({
      query: () => ({
        url: "auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["auth"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
} = authApi;
