import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createComment,
  deleteComment,
  editComment,
  getAllComments,
} from "../controllers/comment.controller.js";

const commentsRouter = Router();

commentsRouter.route("/create-comment").post(verifyJWT, createComment);
commentsRouter.route("/video-comments").get(getAllComments);
commentsRouter.route("/edit-comment").patch(verifyJWT, editComment);
commentsRouter.route("/delete-comment").delete(verifyJWT, deleteComment);

export default commentsRouter;
