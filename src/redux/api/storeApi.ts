/* eslint-disable no-mixed-spaces-and-tabs */
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../queryInteceptors";

export const storeApi = createApi({
  reducerPath: "store",
  baseQuery: baseQuery,
  refetchOnReconnect: true,
  refetchOnMountOrArgChange: 20,
  tagTypes: ["store", "stores", "featuredStores"],
  endpoints: (builder) => ({
    getStores: builder.query({
      query: () => ({
        url: "store",
      }),
      providesTags: ["stores"],
    }),
    getStore: builder.query({
      query: (id) => ({
        url: `store/${id}`,
      }),
      providesTags: ["store"],
    }),
    createStore: builder.mutation({
      query: (body) => ({
        url: `store`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["stores"],
    }),
    updateStore: builder.mutation({
      query: (body) => ({
        url: `store/${body.id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["store"],
    }),
    deleteStore: builder.mutation({
      query: (id) => ({
        url: `store/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["stores"],
    }),
    getFeaturedStores: builder.query({
      query: () => ({
        url: "store/featured",
      }),
      providesTags: ["featuredStores"],
    }),
  }),
});

export const {
  useGetStoresQuery,
  useGetStoreQuery,
  useCreateStoreMutation,
  useUpdateStoreMutation,
  useDeleteStoreMutation,
  useGetFeaturedStoresQuery,
} = storeApi;
