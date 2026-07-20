import { baseApi } from "../api/baseApi";

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    placeOrder: builder.mutation<any, any>({
      query: (data) => ({ url: "/orders", method: "POST", body: data }),
      invalidatesTags: ["Order", "Product"],
    }),
    getMyOrders: builder.query<any, void>({
      query: () => "/orders/my",
      providesTags: ["Order"],
    }),
    getAllOrders: builder.query<any, string | undefined>({
      query: (status) => ({ url: `/orders${status ? `?status=${status}` : ""}` }),
      providesTags: ["Order"],
    }),
    getOrderById: builder.query<any, string>({
      query: (id) => `/orders/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Order" as const, id }],
    }),
    getOrderStats: builder.query<any, void>({
      query: () => "/orders/stats",
      providesTags: ["Order"],
    }),
    approveOrder: builder.mutation<any, string>({
      query: (id) => ({ url: `/orders/${id}/approve`, method: "PATCH" }),
      invalidatesTags: ["Order", "Link", "Product"],
    }),
    rejectOrder: builder.mutation<any, { id: string; adminNote?: string }>({
      query: ({ id, adminNote }) => ({
        url: `/orders/${id}/reject`,
        method: "PATCH",
        body: { adminNote },
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export const {
  usePlaceOrderMutation,
  useGetMyOrdersQuery,
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
  useGetOrderStatsQuery,
  useApproveOrderMutation,
  useRejectOrderMutation,
} = orderApi;
