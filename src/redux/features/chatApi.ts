import { baseApi } from "../api/baseApi";

export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyMessagesWithAdmin: builder.query<any, void>({
      query: () => "/chat/my-messages",
      providesTags: ["ChatMessage"],
    }),
    getAdminConversations: builder.query<any, void>({
      query: () => "/chat/conversations",
      providesTags: ["ChatMessage"],
    }),
    getMessagesWithUser: builder.query<any, string>({
      query: (userId) => `/chat/messages/${userId}`,
      providesTags: (_result, _error, userId) => [{ type: "ChatMessage" as const, id: userId }],
    }),
  }),
});

export const {
  useGetMyMessagesWithAdminQuery,
  useGetAdminConversationsQuery,
  useGetMessagesWithUserQuery,
} = chatApi;
