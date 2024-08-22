import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Comment } from "../models/comments.models.js";
import { apiResponse } from "../utils/resError.js";

export const createComment = asyncHandler(async (req, res) => {
  const { content, videoId } = req.body;
  if (!content) throw new ApiError(400, "Content is Missing");

  const comment = await Comment.create({
    content,
    owner: req.user?._id,
    ownerData: JSON.stringify(req.user),
    video: videoId,
  });

  res.status(200).json({
    success: true,
    message: "Comment Added Successfully",
    comment,
  });
});

export const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.body;

  if (!commentId) return apiResponse(res, 400, "Comment ID is Required");

  await Comment.findByIdAndDelete(commentId);

  res.status(200).json({
    message: "Comment Deleted Successfully",
  });
});

export const editComment = asyncHandler(async (req, res) => {
  const { commentId, newContent } = req.body;
  if (!commentId) return apiResponse(res, 400, "Comment ID is Required");
  await Comment.findByIdAndUpdate(commentId, {
    content: newContent,
  });

  res.status(200).json({
    message: "Comment Edited Successfully",
  });
});

export const getAllComments = asyncHandler(async (req, res) => {
  const { videoId } = req.query;

  if (!videoId) return apiResponse(res, 400, "Video ID is Required");

  const comments = await Comment.find({
    video: videoId,
  });

  return res.status(200).json({
    message: "Comments Fetched Successfully",
    comments,
  });
});
