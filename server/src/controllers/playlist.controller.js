import { Playlist } from "../models/playlist.models.js";
import { Video } from "../models/video.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/resError.js";

export const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return apiResponse(400, "Please Fill All Fields");
  }

  const doesPlaylistAlreadyExists = await Playlist.findOne({
    name,
  });

  if (doesPlaylistAlreadyExists)
    return apiResponse(res, 400, "Playlist By This Name Already Exists");

  const playlist = await Playlist.create({
    name,
    description,
    owner: req.user?._id,
    videos: [],
  });

  return res.status(200).json({
    message: "Playlist Created Successfully",
    success: true,
    playlist,
  });
});

export const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { videoToAdd, playlistID } = req.body;

  if (!videoToAdd) return apiResponse(res, 400, "Video Not Found");

  const playlist = await Playlist.findByIdAndUpdate(
    playlistID,
    {
      $push: { videos: videoToAdd },
    },
    { new: true }
  );

  return res.status(200).json({
    success: true,
    message: "Video Added Successfully",
    playlist,
  });
});

export const deleteVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { videoToAdd, playlistID } = req.body;

  if (!videoToAdd) return apiResponse(res, 400, "Video Not Found");

  const playlist = await Playlist.findByIdAndUpdate(
    playlistID,
    {
      $pull: { videos: videoToAdd },
    },
    { new: true }
  );

  return res.status(200).json({
    success: true,
    message: "Video Removed Successfully",
    playlist,
  });
});

export const getAllPlaylists = asyncHandler(async (req, res) => {
  const playlists = await Playlist.find({
    owner: req.user._id,
  });

  // Use Promise.all to wait for all asynchronous operations to complete
  const playlistsThumbnail = await Promise.all(
    playlists.map(async (playlist) => {
      const video = await Video.findById(
        playlist.videos[playlist.videos.length - 1]
      ).select("thumbnail");
      return video?.thumbnail;
    })
  );

  return res.status(200).json({
    playlists,
    success: true,
    message: "Playlists Fetched Successfully",
    playlistsThumbnail,
  });
});

export const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistID } = req.query;
  if (!playlistID) throw new ApiError(400, "Playlist ID is Missing");

  const playlist = await Playlist.findById(playlistID);

  const { thumbnail } = await Video.findById(
    playlist.videos[playlist.videos.length - 1]
  ).select("thumbnail");

  return res.status(200).json({
    success: true,
    playlist,
    message: "Playlist Fetched Successfully",
    playlistThumbnail: thumbnail,
  });
});

export const getVideosFromPlaylist = asyncHandler(async (req, res) => {
  let playlistVideos = [];
  let { videos } = req.query;

  // If videos is a string, parse it into an array
  if (typeof videos === "string") {
    try {
      // Check if videos is a JSON string and parse it accordingly
      videos = JSON.parse(videos);
    } catch (error) {
      // Attempt to split the string manually if JSON parsing fails
      videos = videos.split(",");
    }
  }

  // Ensure that videos is an array
  if (!Array.isArray(videos)) {
    return res
      .status(400)
      .json({ message: "Invalid videos parameter, expected an array" });
  }

  try {
    // Fetch video documents
    const videoPromises = videos.map(async (videoId) => {
      const capturedVideo = await Video.findById(videoId);
      return capturedVideo;
    });

    playlistVideos = await Promise.all(videoPromises);

    return res.status(200).json({
      playlistVideos,
    });
  } catch (error) {
    console.error("Error fetching videos:", error);
    return res.status(500).json({ message: "Error fetching videos" });
  }
});
