import { Like } from "../models/likes.models.js";
import { Dislike } from "../models/dislikes.models.js";
import { apiResponse } from "../utils/resError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Generic function to handle likes and dislikes
async function handleReaction(itemId, userId, res, type, itemType) {
  if (!itemId) return apiResponse(res, 400, `${itemType} ID is required`);

  const Model = type === "like" ? Like : Dislike;
  const field = itemType.toLowerCase();
  const existingReaction = await Model.findOne({
    [field]: itemId,
    likedBy: userId,
  });

  if (existingReaction) {
    return apiResponse(res, 400, `${itemType} has already been ${type}d`);
  }

  // Create a new like or dislike
  const reaction = await Model.create({ [field]: itemId, likedBy: userId });

  return res.status(201).json({
    message: `${itemType} ${type}d successfully`,
    reaction,
  });
}

// Generic function to remove likes or dislikes
async function removeReaction(itemId, userId, res, type, itemType) {
  if (!itemId) return apiResponse(res, 400, `${itemType} ID is required`);

  const Model = type === "like" ? Like : Dislike;
  const field = itemType.toLowerCase();
  await Model.findOne({ [field]: itemId, likedBy: userId }).deleteOne();

  return res.status(200).json({
    message: `${type.charAt(0).toUpperCase() + type.slice(1)} removed successfully`,
  });
}

// Generic function to check user reaction status
async function checkUserReactionStatus(itemId, userId, res, itemType) {
  if (!itemId) return apiResponse(res, 400, `${itemType} ID is required`);

  const field = itemType.toLowerCase();
  const likeStatus = await Like.findOne({ [field]: itemId, likedBy: userId });
  const dislikeStatus = await Dislike.findOne({
    [field]: itemId,
    likedBy: userId,
  });

  if (likeStatus) {
    return "liked";
  } else if (dislikeStatus) {
    return "disliked";
  } else {
    return "no_reaction";
  }
}

export const likeItem = asyncHandler(async (req, res) => {
  const { itemId, itemType } = req.body;
  const userId = req.user._id;

  await handleReaction(itemId, userId, res, "like", itemType);
});

export const dislikeItem = asyncHandler(async (req, res) => {
  const { itemId, itemType } = req.body;
  const userId = req.user._id;

  // Remove like if exists before adding dislike
  await removeReaction(itemId, userId, res, "like", itemType);
  await handleReaction(itemId, userId, res, "dislike", itemType);
});

export const unlikeItem = asyncHandler(async (req, res) => {
  const { itemId, itemType } = req.body;
  const userId = req.user._id;

  await removeReaction(itemId, userId, res, "like", itemType);
});

export const undislikeItem = asyncHandler(async (req, res) => {
  const { itemId, itemType } = req.body;
  const userId = req.user._id;

  await removeReaction(itemId, userId, res, "dislike", itemType);
});

export const getItemLikes = asyncHandler(async (req, res) => {
  const { itemId, itemType } = req.query;

  if (!itemId) apiResponse(res, 400, `${itemType} ID is required`);

  const field = itemType.toLowerCase();
  const totalLikes = await Like.countDocuments({ [field]: itemId });

  return res.status(200).json({
    message: "Likes fetched successfully",
    totalLikes,
  });
});

export const getUserReactionStatus = asyncHandler(async (req, res) => {
  const { itemId, itemType } = req.query;
  const userId = req.user._id;

  const reactionStatus = await checkUserReactionStatus(
    itemId,
    userId,
    res,
    itemType
  );

  return res.status(200).json({
    status: reactionStatus,
  });
});

export const userLikedVideos = asyncHandler(async (req, res) => {
  const userId = req?.user?._id;

  if (!userId) return apiResponse(res, 400, "User ID is Required");

  const totalLikes = await Like.find({
    likedBy: userId,
  }).countDocuments();

  return res.status(200).json({
    totalLikes,
  });
});
