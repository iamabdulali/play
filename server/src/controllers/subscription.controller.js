import { apiResponse } from "../utils/resError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Subscription } from "../models/subscription.models.js";
import mongoose from "mongoose";

export const subscribeChannel = asyncHandler(async (req, res) => {
  const { subscriber, channel } = req.body;

  if (!subscriber || !channel)
    return apiResponse(res, 400, "Channel Or Subscriber is Missing");

  const hasSubscribed = await Subscription.findOne({
    subscriber: subscriber,
    channel: channel,
  });

  if (hasSubscribed) return apiResponse(res, 400, "Already Subscribed");

  await Subscription.create({
    subscriber,
    channel,
  });

  return res.status(200).json({
    message: "Subscribed Successfuuly",
  });
});

export const unSubscribeChannel = asyncHandler(async (req, res) => {
  const { subscriber, channel } = req.body;

  if (!subscriber || !channel)
    return apiResponse(res, 400, "Channel Or Subscriber is Missing");

  await Subscription.findOne({
    subscriber,
    channel,
  }).deleteOne();

  return res.status(200).json({
    message: "UnSubscribed Successfuuly",
  });
});

export const getChannelSubscribers = asyncHandler(async (req, res) => {
  const { channel } = req.query;

  if (!channel) {
    return apiResponse(res, 400, "Channel ID is Missing");
  }

  if (!mongoose.Types.ObjectId.isValid(channel)) {
    return apiResponse(res, 400, "Invalid Channel ID format");
  }

  const id = new mongoose.Types.ObjectId(channel);

  const totalSubscribers = await Subscription.find({
    channel: id,
  }).countDocuments();

  return res.status(200).json({
    totalSubscribers,
    message: "Subscribers Count Fetched Successfully",
  });
});

export const hasUserSubscribed = asyncHandler(async (req, res) => {
  const { userId, channel } = req.query;
  if (!userId || !channel)
    return apiResponse(res, 400, "User Id and Channel Id are Required");

  if (!mongoose.Types.ObjectId.isValid(channel)) {
    return apiResponse(res, 400, "Invalid Channel ID format");
  }

  const hasSubscribed = await Subscription.findOne({
    subscriber: userId,
    channel: channel,
  });

  console.log(hasSubscribed);

  return res.status(200).json({
    hasSubscribed: !!hasSubscribed, // Convert to boolean
    message: "Status Fetched Successfully",
  });
});
