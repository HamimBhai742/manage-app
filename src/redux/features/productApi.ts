import { baseApi } from "../api/baseApi";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPublishedProducts: builder.query<any, void>({
      query: () => "/products",
      providesTags: ["Product"],
    }),
    getProductById: builder.query<any, string>({
      query: (id) => `/products/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Product" as const, id }],
    }),
    getAllProductsAdmin: builder.query<any, void>({
      query: () => "/products/admin/all",
      providesTags: ["Product"],
    }),
    createProduct: builder.mutation<any, any>({
      query: (data) => ({ url: "/products", method: "POST", body: data }),
      invalidatesTags: ["Product"],
    }),
    updateProduct: builder.mutation<any, any>({
      query: ({ id, ...data }) => ({ url: `/products/${id}`, method: "PATCH", body: data }),
      invalidatesTags: ["Product"],
    }),
    togglePublish: builder.mutation<any, string>({
      query: (id) => ({ url: `/products/${id}/publish`, method: "PATCH" }),
      invalidatesTags: ["Product"],
    }),
    deleteProduct: builder.mutation<any, string>({
      query: (id) => ({ url: `/products/${id}`, method: "DELETE" }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useGetPublishedProductsQuery,
  useGetProductByIdQuery,
  useGetAllProductsAdminQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useTogglePublishMutation,
  useDeleteProductMutation,
} = productApi;
