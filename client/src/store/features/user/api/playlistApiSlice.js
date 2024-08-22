import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const playlistApi = createApi({
  reducerPath: "playlistApi",
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
  tagTypes: ["Playlists"],
  endpoints: (builder) => ({
    getUserPlaylists: builder.query({
      query: () => `playlists/get-playlists`,
      providesTags: ["Playlists"],
    }),
    createNewPlaylist: builder.mutation({
      query: (data) => {
        return {
          method: "POST",
          url: "playlists/create-playlist",
          body: data,
        };
      },
      invalidatesTags: ["Playlists"],
    }),
    addVideoToPlaylist: builder.mutation({
      query: (data) => {
        return {
          method: "POST",
          url: "playlists/add-video-to-playlist",
          body: data,
        };
      },
    }),
    deleteVideoFromPlaylist: builder.mutation({
      query: (data) => {
        return {
          method: "POST",
          url: "playlists/delete-video-from-playlist",
          body: data,
        };
      },
    }),
    getUserPlaylists: builder.query({
      query: () => `playlists/get-playlists`,
    }),
    getPlaylistById: builder.query({
      query: (playlistID) => `playlists/get-playlist?playlistID=${playlistID}`,
    }),
    getVideosFromPlaylist: builder.query({
      query: (videos) => `playlists/get-playlist-videos?videos=${videos}`,
    }),
  }),
});

export const {
  useGetUserPlaylistsQuery,
  useCreateNewPlaylistMutation,
  useAddVideoToPlaylistMutation,
  useDeleteVideoFromPlaylistMutation,
  useLazyGetUserPlaylistsQuery,
  useGetPlaylistByIdQuery,
  useGetVideosFromPlaylistQuery,
} = playlistApi;
