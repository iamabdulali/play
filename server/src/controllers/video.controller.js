import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadFileCloudinary } from "../utils/cloudinary.js";
import { Video } from "../models/video.models.js";
import { Like } from "../models/likes.models.js";
import { Dislike } from "../models/dislikes.models.js";
import { apiResponse } from "../utils/resError.js";

export const uploadVideo = asyncHandler(async (req, res) => {
  const { title, description, duration } = req.body;
  const missingFields = [];

  if (!title || title.trim() === "") {
    missingFields.push("Title");
  }

  if (!description || description.trim() === "") {
    missingFields.push("Description");
  }

  const thumbnail = req.files?.thumbnail?.[0];
  const videoFile = req.files?.videoFile?.[0];

  if (!thumbnail) {
    missingFields.push("Thumbnail");
  }

  if (!videoFile) {
    missingFields.push("Video");
  }

  if (missingFields.length > 0) {
    return apiResponse(
      res,
      400,
      `The following fields are required: ${missingFields.join(", ")}`
    );
  }

  const thumbnailPath = thumbnail.path;
  const videoFilePath = videoFile.path;

  const cloudinaryThumbnail = await uploadFileCloudinary(thumbnailPath);
  const cloudinaryVideoFile = await uploadFileCloudinary(videoFilePath);

  const video = await Video.create({
    title,
    description,
    thumbnail: cloudinaryThumbnail?.url,
    videoFile: cloudinaryVideoFile?.url,
    isPublished: false,
    duration,
    views: 0,
    ownerId: req.user,
    owner: JSON.stringify(req.user),
  });

  res.status(201).json({
    data: video,
    message: "Video Uploaded Successfully",
  });
});

export const captureVideoViews = asyncHandler(async (req, res) => {
  const { videoID } = req.body;

  if (!videoID) return apiResponse(res, 400, "Video ID is Required");

  const video = await Video.findByIdAndUpdate(
    videoID,
    {
      $inc: {
        views: 1,
      },
    },
    {
      new: true,
    }
  );

  if (!video) return apiResponse(res, 404, "Video not found");

  return res.status(200).json({
    message: "View Captured Successfully",
    views: video.views,
  });
});

export const getAllVideos = asyncHandler(async (req, res) => {
  const videos = await Video.find();
  return res.status(200).json({
    message: "Videos Fetched Successfully",
    videos,
  });
});

async function countVideoReactions(reaction, videoIDs, ownerId) {
  const reactionType = reaction == "like" ? Like : Dislike;
  return await Promise.all(
    videoIDs.map(async (videoId) => {
      const videoReactions = await reactionType
        .find({
          likedBy: ownerId,
          video: videoId,
        })
        .countDocuments();
      return videoReactions;
    })
  );
}

export const getAllUserVideosViews = asyncHandler(async (req, res) => {
  const { userId } = req.user?._id;

  if (!userId) return apiResponse(res, 400, "User ID Not found");

  const videos = await Video.find({
    ownerId: userId,
  });
});

export const getUserVideos = asyncHandler(async (req, res) => {
  const { ownerId } = req.query;
  const videos = await Video.find({ ownerId });

  const videoIDs = videos.flatMap((video) => {
    return video._id;
  });

  const videoLikes = await countVideoReactions("like", videoIDs, ownerId);
  const videoDislikes = await countVideoReactions("dislike", videoIDs, ownerId);

  return res.status(200).json({
    message: "Videos Fetched Successfully",
    videos,
    videoLikes,
    videoDislikes,
  });
});

export const getVideoById = asyncHandler(async (req, res) => {
  const { videoID } = req.query;

  if (!videoID) apiResponse(res, 400, "Video ID is Required");

  const video = await Video.findById({
    _id: videoID,
  });

  return res.status(200).json({
    message: "Video Fetched Successfully",
    video,
  });
});

export const updateVideoPublishedStatus = asyncHandler(async (req, res) => {
  const { videoID, publishedStatus } = req.body;

  if (!videoID) return apiResponse(res, 400, "Video ID is Required");

  const video = await Video.findByIdAndUpdate(
    videoID,
    {
      $set: {
        isPublished: publishedStatus,
      },
    },
    { new: true }
  );

  return res.status(200).json({
    message: "Status Updated Successfully",
    video,
  });
});

export const editVideoDetails = asyncHandler(async (req, res) => {
  const { title, description, videoID } = req.body;

  if (!videoID) return apiResponse(res, 400, "Video ID is Required");
  const thumbnail = req.file;
  const thumbnailPath = thumbnail?.path;

  const cloudinaryThumbnail = await uploadFileCloudinary(thumbnailPath);

  await Video.findByIdAndUpdate(
    videoID,
    {
      $set: {
        title,
        description,
        thumbnail: cloudinaryThumbnail?.url,
      },
    },
    {
      new: true,
    }
  );

  return res.status(200).json({
    message: "Details Updated Successfully",
  });
});

export const deleteVideo = asyncHandler(async (req, res) => {
  const { videoID } = req.body;
  if (!videoID) return apiResponse(res, 400, "Video ID is Required");

  await Video.findByIdAndDelete(videoID);

  return res.status(200).json({
    message: "Video Deleted Successfully",
  });
});
