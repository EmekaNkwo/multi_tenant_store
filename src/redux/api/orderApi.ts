/* eslint-disable no-mixed-spaces-and-tabs */
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../queryInteceptors";

export const orderApi = createApi({
  reducerPath: "order",
  baseQuery: baseQuery,
  refetchOnReconnect: true,
  refetchOnMountOrArgChange: 20,
  tagTypes: ["order", "orders"],
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: () => ({
        url: "orders",
      }),
      providesTags: ["orders"],
    }),
    getOrder: builder.query({
      query: (id) => ({
        url: `orders/${id}`,
      }),
      providesTags: ["order"],
    }),
    updateOrderStatus: builder.mutation({
      query: (body) => ({
        url: `orders/${body.id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["order"],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderQuery,
  useUpdateOrderStatusMutation,
} = orderApi;
