import { baseApi } from "../api/baseApi";

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentSettings: builder.query<any, void>({
      query: () => "/payment-settings",
      providesTags: ["PaymentSetting"],
    }),
    getAllPaymentSettings: builder.query<any, void>({
      query: () => "/payment-settings/all",
      providesTags: ["PaymentSetting"],
    }),
    createPaymentSetting: builder.mutation<any, any>({
      query: (data) => ({ url: "/payment-settings", method: "POST", body: data }),
      invalidatesTags: ["PaymentSetting"],
    }),
    updatePaymentSetting: builder.mutation<any, any>({
      query: ({ id, ...data }) => ({ url: `/payment-settings/${id}`, method: "PATCH", body: data }),
      invalidatesTags: ["PaymentSetting"],
    }),
    deletePaymentSetting: builder.mutation<any, string>({
      query: (id) => ({ url: `/payment-settings/${id}`, method: "DELETE" }),
      invalidatesTags: ["PaymentSetting"],
    }),
  }),
});

export const {
  useGetPaymentSettingsQuery,
  useGetAllPaymentSettingsQuery,
  useCreatePaymentSettingMutation,
  useUpdatePaymentSettingMutation,
  useDeletePaymentSettingMutation,
} = paymentApi;
