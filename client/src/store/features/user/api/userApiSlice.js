import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { createFormData } from "../../../../utils/formData";

export const userApi = createApi({
  reducerPath: "userApi",
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
  tagTypes: ["UPDATE"],
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (data) => {
        const formData = createFormData(data);
        return {
          url: `user/register`,
          method: "POST",
          body: formData,
        };
      },
    }),
    login: builder.mutation({
      query: (data) => {
        return {
          url: `user/login`,
          method: "POST",
          body: data,
        };
      },
    }),
    getUser: builder.query({
      query: () => `user/get-user`,
      providesTags: ["UPDATE"],
    }),
    updateUserDetails: builder.mutation({
      invalidatesTags: ["UPDATE"],
      query: (data) => {
        return {
          url: `user/update-user-details`,
          method: "PATCH",
          body: data,
        };
      },
    }),
    updateUserAvatar: builder.mutation({
      invalidatesTags: ["UPDATE"],
      query: (data) => {
        const formData = createFormData(data);
        return {
          url: `user/update-avatar`,
          method: "PATCH",
          body: formData,
        };
      },
    }),
    changePassword: builder.mutation({
      query: (data) => {
        return {
          method: "POST",
          url: "user/change-password",
          body: data,
        };
      },
    }),
    userChannelProfile: builder.query({
      query: (username) => `user/get-user-channel?username=${username}`,
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginMutation,
  useGetUserQuery,
  useUpdateUserDetailsMutation,
  useUpdateUserAvatarMutation,
  useChangePasswordMutation,
  useUserChannelProfileQuery,
} = userApi;
