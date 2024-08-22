import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "./features/user/api/userApiSlice.js";
import userReducer from "./features/user/slice/userSlice.js";
import { videoApi } from "./features/user/api/videoApiSlice.js";
import { likeApi } from "./features/user/api/likeApiSlice.js";
import { playlistApi } from "./features/user/api/playlistApiSlice.js";
import { commentApi } from "./features/user/api/commentApiSlice.js";
import { subscriptionApi } from "./features/user/api/subscriptionApiSlice.js";

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [videoApi.reducerPath]: videoApi.reducer,
    [likeApi.reducerPath]: likeApi.reducer,
    [playlistApi.reducerPath]: playlistApi.reducer,
    [commentApi.reducerPath]: commentApi.reducer,
    [subscriptionApi.reducerPath]: subscriptionApi.reducer,
    user: userReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      userApi.middleware,
      videoApi.middleware,
      likeApi.middleware,
      playlistApi.middleware,
      commentApi.middleware,
      subscriptionApi.middleware
    ),
});
