import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const subscriptionApi = createApi({
  reducerPath: "subscriptionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api/v1",
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem("token");

      // If we have a token set in state, let's assume that we should be passing it.
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ["Subscribe"],
  endpoints: (builder) => ({
    subscribeChannel: builder.mutation({
      query: (data) => {
        return {
          url: `subscriptions/subscribe-channel`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["Subscribe"],
    }),
    unSubscribeChannel: builder.mutation({
      query: (data) => {
        return {
          url: `subscriptions/unsubscribe-channel`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["Subscribe"],
    }),
    getChannelSubscribers: builder.query({
      query: (channelId) =>
        `subscriptions/channel-subscribers?channel=${channelId}`,
      providesTags: ["Subscribe"],
    }),
    hasUserSubscribed: builder.query({
      query: ({ userId, channel }) =>
        `subscriptions/check-user-subscription?userId=${userId}&channel=${channel}`,
      providesTags: ["Subscribe"],
    }),
  }),
});

export const {
  useSubscribeChannelMutation,
  useGetChannelSubscribersQuery,
  useHasUserSubscribedQuery,
  useUnSubscribeChannelMutation,
} = subscriptionApi;
