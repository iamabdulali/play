import { Router } from "express";
import {
  changeAccountDetails,
  changeAvatar,
  changePassword,
  getCurrentUser,
  getUserChannelProfile,
  getUserWatchHistory,
  login,
  logout,
  refreshAccessToken,
  register,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.route("/register").post(upload.single("avatar"), register);
userRouter.route("/login").post(login);
userRouter.route("/logout").post(verifyJWT, logout);
userRouter.route("/refresh-token").post(refreshAccessToken);
userRouter.route("/change-password").post(verifyJWT, changePassword);
userRouter.route("/update-user-details").patch(verifyJWT, changeAccountDetails);
userRouter
  .route("/update-avatar")
  .patch(verifyJWT, upload.single("avatar"), changeAvatar);
userRouter.route("/get-user").get(verifyJWT, getCurrentUser);
userRouter.route("/get-user-channel").get(getUserChannelProfile);
userRouter.route("/get-user-watch-history").get(verifyJWT, getUserWatchHistory);
export default userRouter;
