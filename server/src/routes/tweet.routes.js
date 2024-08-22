import { Router } from "express";
import {
  createTweet,
  getAllUserTweets,
} from "../controllers/tweet.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const tweetsRouter = Router();

tweetsRouter.route("/create-tweet").post(verifyJWT, createTweet);
tweetsRouter.route("/get-tweets").get(verifyJWT, getAllUserTweets);

export default tweetsRouter;
