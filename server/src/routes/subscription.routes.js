import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getChannelSubscribers,
  hasUserSubscribed,
  subscribeChannel,
  unSubscribeChannel,
} from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter
  .route("/subscribe-channel")
  .post(verifyJWT, subscribeChannel);
subscriptionRouter
  .route("/unsubscribe-channel")
  .post(verifyJWT, unSubscribeChannel);
subscriptionRouter.route("/channel-subscribers").get(getChannelSubscribers);
subscriptionRouter
  .route("/check-user-subscription")
  .get(verifyJWT, hasUserSubscribed);

export default subscriptionRouter;
