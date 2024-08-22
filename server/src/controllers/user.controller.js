import { User } from "../models/user.models.js";
// import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadFileCloudinary } from "../utils/cloudinary.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookieOptions } from "../utils/options.js";
import mongoose from "mongoose";
import { apiResponse } from "../utils/resError.js";

const generateAccessAndRefreshTokens = async (res, userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    apiResponse(res, 500, "Error While Generating Access and Refresh Token");
  }
};

export const register = asyncHandler(async (req, res, next) => {
  const { username, email, fullName, password } = req.body;

  const imagePath = req?.file?.path;

  if (
    [username, email, fullName, password].some((field) => {
      return field?.trim() === "";
    })
  ) {
    apiResponse(res, 400, "All Fields Are Required");
  }

  const isUserExists = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (isUserExists) {
    apiResponse(res, 409, "Username or Email Already Exists");
  }

  if (!imagePath) apiResponse(res, 400, "Avatar is Required");

  const cloudinary = await uploadFileCloudinary(imagePath);

  const user = await User.create({
    username,
    email,
    password,
    fullName,
    avatar: cloudinary?.url,
  });

  const createdUser = await User.findById(user?._id).select(
    "-password -refreshToken"
  );

  res.status(201).json({
    data: createdUser,
    message: "User Registered Successfully",
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password, username } = req.body;

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    // throw new ApiError(404, `User Doesn't Exist, Please Register`);
    // return res.status(404).json({
    //   success: false,
    //   message: `User Doesn't Exist, Please Register`,
    // });
    apiResponse(res, 404, `User Doesn't Exist, Please Register`);
  }

  // Two Ways
  // const isPasswordCorrect = await bcrypt.compare(password, user.password);
  const isPasswordCorrect = await user.isPasswordCorrect(password); // This is coming from the methods we defined in models

  if (!isPasswordCorrect) {
    // throw new ApiError(401, "Invalid Credentials");
    // return res.status(401).json({
    //   message: "Invalid Credentials",
    //   success: false,
    // });

    apiResponse(res, 401, "Invalid Credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    res,
    user?._id
  );

  const loggedInUser = await User.findById(user?._id).select(
    "-password -refreshToken"
  );

  res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json({
      message: "Logged In Successfully",
      success: true,
      data: loggedInUser,
      accessToken,
      refreshToken,
    });
});

export const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json({
      success: true,
      message: "User Logged Out Successfully",
    });
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) apiResponse(res, 401, "Unauthorized");

  const decodedToken = await jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  const user = await User.findById(decodedToken?._id);

  if (!user) apiResponse(res, 401, "Invalid Refresh Token");

  if (incomingRefreshToken !== user.refreshToken) {
    apiResponse(res, 401, "Invalid Refresh Token");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    res,
    user?._id
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken)
    .cookie("refreshToken", refreshToken)
    .json({
      success: true,
      message: "Token Refreshed ",
      data: {
        accessToken,
        refreshToken,
      },
    });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) apiResponse(res, 400, "Password is Incorrect");

  user.password = newPassword;
  user.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
    message: "Password Changed Successfully",
  });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "User Fetched Successfully",
    data: req.user,
  });
});

export const changeAccountDetails = asyncHandler(async (req, res) => {
  const { fullName } = req.body;
  console.log(fullName);
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName,
      },
    },
    { new: true }
  ).select("-password");

  res.status(200).json({
    data: user,
    success: true,
    message: "Updated Successfully",
  });
});

export const changeAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) apiResponse(res, 400, "Avatar is Missing");
  const avatar = await uploadFileCloudinary(avatarLocalPath);

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar?.url,
      },
    },
    { new: true }
  ).select("-password");

  res.status(200).json({
    success: true,
    message: "Avatar Changed Successfully",
    data: user,
  });
});

export const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.query;

  if (!username?.trim()) apiResponse(res, 400, "Username is Missing");

  const channel = await User.aggregate([
    {
      $match: {
        username: username?.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers",
        },
        subscribedToCount: {
          $size: "$subscribedTo",
        },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscribe"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullName: 1,
        username: 1,
        subscribedToCount: 1,
        subscribersCount: 1,
        isSubscribed: 1,
        email: 1,
        avatar: 1,
      },
    },
  ]);

  if (!channel?.length) return apiResponse(res, 400, "Channel Doesn't Exist");

  return res.status(200).json({
    success: true,
    channel,
  });
});

export const getUserWatchHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user?._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    fullName: 1,
                    avatar: 1,
                    username: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: {
                $first: "$owner",
              },
            },
          },
        ],
      },
    },
  ]);
  res.status(200).json({
    success: true,
    message: "Watch History Fetched Successfully",
    data: user[0].watchHistory,
  });
});
