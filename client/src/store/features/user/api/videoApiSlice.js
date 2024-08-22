import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { createFormData } from "../../../../utils/formData";

export const videoApi = createApi({
  reducerPath: "videoApi",
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
  tagTypes: ["VIDEO_UPLOAD"],
  endpoints: (builder) => ({
    uploadVideo: builder.mutation({
      query: (data) => {
        const formData = createFormData(data);
        return {
          url: `videos/upload-video`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["VIDEO_UPLOAD"],
    }),
    getAllVideos: builder.query({
      query: () => "videos",
      providesTags: ["VIDEO_UPLOAD"],
    }),
    getUserVideos: builder.query({
      query: (ownerId) => `videos/user-videos?ownerId=${ownerId}`,
      providesTags: ["VIDEO_UPLOAD"],
    }),
    getVideoByID: builder.query({
      query: (videoID) => `videos/watch?videoID=${videoID}`,
    }),
    updateVideoPublishedStatus: builder.mutation({
      query: (data) => {
        return {
          url: `videos/update-published-status`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["VIDEO_UPLOAD"],
    }),
    updateVideoDetails: builder.mutation({
      query: (data) => {
        const formData = createFormData(data);

        return {
          url: `videos/update-video-details`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["VIDEO_UPLOAD"],
    }),
    deleteVideo: builder.mutation({
      query: (data) => {
        return {
          url: `videos/delete-video`,
          method: "DELETE",
          body: data,
        };
      },
      invalidatesTags: ["VIDEO_UPLOAD"],
    }),
    captureVideoViews: builder.mutation({
      query: (data) => {
        return {
          url: `videos/capture-views`,
          method: "POST",
          body: data,
        };
      },
      // invalidatesTags: ["VIDEO_UPLOAD"],
    }),
  }),
});

export const {
  useUploadVideoMutation,
  useGetAllVideosQuery,
  useGetVideoByIDQuery,
  useGetUserVideosQuery,
  useUpdateVideoPublishedStatusMutation,
  useUpdateVideoDetailsMutation,
  useDeleteVideoMutation,
  useCaptureVideoViewsMutation,
} = videoApi;
