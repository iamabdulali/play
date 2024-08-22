import { Router } from "express";
import {
  addVideoToPlaylist,
  createPlaylist,
  deleteVideoFromPlaylist,
  getAllPlaylists,
  getPlaylistById,
  getVideosFromPlaylist,
} from "../controllers/playlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const playlistRouter = Router();

playlistRouter.route("/create-playlist").post(verifyJWT, createPlaylist);
playlistRouter
  .route("/add-video-to-playlist")
  .post(verifyJWT, addVideoToPlaylist);
playlistRouter
  .route("/delete-video-from-playlist")
  .post(verifyJWT, deleteVideoFromPlaylist);
playlistRouter.route("/get-playlists").get(verifyJWT, getAllPlaylists);
playlistRouter.route("/get-playlist").get(verifyJWT, getPlaylistById);
playlistRouter
  .route("/get-playlist-videos")
  .get(verifyJWT, getVideosFromPlaylist);

export default playlistRouter;
