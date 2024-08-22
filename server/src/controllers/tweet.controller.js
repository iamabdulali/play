import { Tweet } from "../models/tweets.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content) throw new ApiError(400, "Content is Missing");

  //   const user = await User.findById(req.user?._id)
  const tweet = await Tweet.create({
    content,
    owner: req.user?._id,
  });

  res.status(200).json({
    success: true,
    message: "Tweet Created Successfully",
    data: tweet,
  });
});

export const getAllUserTweets = asyncHandler(async (req, res) => {
  const tweets = await Tweet.find({
    owner: req.user?._id,
  });

  console.log(req.user?._id);

  res.status(200).json({
    success: true,
    data: tweets,
    message: "Tweets Fetched Successfully",
  });
});
