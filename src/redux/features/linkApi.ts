import { baseApi } from "../api/baseApi";

export const linkApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLinksByProduct: builder.query<any, string>({
      query: (productId) => `/links?productId=${productId}`,
      providesTags: ["Link"],
    }),
    bulkAddLinks: builder.mutation<any, { productId: string; urls: string[] }>({
      query: (data) => ({ url: "/links/bulk", method: "POST", body: data }),
      invalidatesTags: ["Link", "Product"],
    }),
    deleteLink: builder.mutation<any, string>({
      query: (id) => ({ url: `/links/${id}`, method: "DELETE" }),
      invalidatesTags: ["Link", "Product"],
    }),
    deleteAllUnusedLinks: builder.mutation<any, string>({
      query: (productId) => ({ url: `/links/clear?productId=${productId}`, method: "DELETE" }),
      invalidatesTags: ["Link", "Product"],
    }),
  }),
});

export const {
  useGetLinksByProductQuery,
  useBulkAddLinksMutation,
  useDeleteLinkMutation,
  useDeleteAllUnusedLinksMutation,
} = linkApi;
