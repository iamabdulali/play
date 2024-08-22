import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const commentApi = createApi({
  reducerPath: "commentApi",
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
  tagTypes: ["COMMENT"],
  endpoints: (builder) => ({
    addComment: builder.mutation({
      query: (data) => {
        return {
          url: `comments/create-comment`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["COMMENT"],
    }),
    deleteComment: builder.mutation({
      query: (data) => {
        return {
          url: "comments/delete-comment",
          method: "DELETE",
          body: data,
        };
      },
      invalidatesTags: ["COMMENT"],
    }),
    editComment: builder.mutation({
      query: (data) => {
        return {
          url: "comments/edit-comment",
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["COMMENT"],
    }),
    getAllCommentsForVideo: builder.query({
      query: (videoId) => `comments/video-comments?videoId=${videoId}`,
      providesTags: ["COMMENT"],
    }),
  }),
});

export const {
  useAddCommentMutation,
  useGetAllCommentsForVideoQuery,
  useDeleteCommentMutation,
  useEditCommentMutation,
} = commentApi;
