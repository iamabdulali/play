import { Router } from "express";
import {
  captureVideoViews,
  deleteVideo,
  editVideoDetails,
  getAllVideos,
  getUserVideos,
  getVideoById,
  updateVideoPublishedStatus,
  uploadVideo,
} from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const videoRouter = Router();

videoRouter.route("/upload-video").post(
  verifyJWT,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "videoFile", maxCount: 1 },
  ]),
  uploadVideo
);

videoRouter.route("/").get(getAllVideos);
videoRouter.route("/user-videos").get(getUserVideos);
videoRouter.route("/watch").get(getVideoById);
videoRouter
  .route("/update-published-status")
  .post(verifyJWT, updateVideoPublishedStatus);
videoRouter
  .route("/update-video-details")
  .post(verifyJWT, upload.single("thumbnail"), editVideoDetails);

videoRouter.route("/delete-video").delete(verifyJWT, deleteVideo);
videoRouter.route("/capture-views").post(captureVideoViews);

export default videoRouter;
