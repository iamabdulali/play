import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  dislikeItem,
  getItemLikes,
  getUserReactionStatus,
  likeItem,
  userLikedVideos,
} from "../controllers/like.controller.js";

const likeRouter = Router();

likeRouter.route("/like-video").post(verifyJWT, likeItem);
likeRouter.route("/video-likes").get(getItemLikes);
likeRouter.route("/check-like").get(verifyJWT, getUserReactionStatus);
likeRouter.route("/dislike-video").post(verifyJWT, dislikeItem);
likeRouter.route("/total-likes").get(verifyJWT, userLikedVideos);

export default likeRouter;
