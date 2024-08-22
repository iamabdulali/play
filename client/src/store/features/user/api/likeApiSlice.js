import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const likeApi = createApi({
  reducerPath: "likeApi",
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
  tagTypes: ["VIDEO_REACTION"],
  endpoints: (builder) => ({
    likeVideo: builder.mutation({
      query: (data) => {
        return {
          url: `likes/like-video`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["VIDEO_REACTION"],
    }),
    dislikeVideo: builder.mutation({
      query: (data) => {
        return {
          url: `likes/dislike-video`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["VIDEO_REACTION"],
    }),
    getVideoLikes: builder.query({
      query: (videoId) => `likes/video-likes?itemId=${videoId}&itemType=video`,
      providesTags: ["VIDEO_REACTION"],
    }),
    userLikeDislikeStatus: builder.query({
      query: (videoId) => `likes/check-like?itemId=${videoId}&itemType=video`,
      providesTags: ["VIDEO_REACTION"],
    }),
    userLikedVideos: builder.query({
      query: () => `likes/total-likes`,
      providesTags: ["VIDEO_REACTION"],
    }),
  }),
});

export const {
  useLikeVideoMutation,
  useGetVideoLikesQuery,
  useUserLikeDislikeStatusQuery,
  useDislikeVideoMutation,
  useUserLikedVideosQuery,
} = likeApi;
