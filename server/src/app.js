import cookieParser from "cookie-parser";
import express, { json, urlencoded } from "express";
import cors from "cors";

export const app = express();
app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import userRouter from "./routes/user.routes.js";
import tweetsRouter from "./routes/tweet.routes.js";
import playlistRouter from "./routes/playlist.routes.js";
import commentsRouter from "./routes/comment.routes.js";
import videoRouter from "./routes/video.routes.js";
import likeRouter from "./routes/like.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";

app.use("/api/v1/user", userRouter);
app.use("/api/v1/tweets", tweetsRouter);
app.use("/api/v1/playlists", playlistRouter);
app.use("/api/v1/comments", commentsRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
