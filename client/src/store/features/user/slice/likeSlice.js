import { createSlice } from "@reduxjs/toolkit";
import { userApi } from "../api/userApiSlice";
import toast from "react-hot-toast";
import { likeApi } from "../api/likeApiSlice";

const initialState = {
  status: false,
  userData: null,
};

const likeSlice = createSlice({
  name: "like",
  initialState,

  extraReducers: (builder) => {
    builder.addMatcher(
      likeApi.endpoints.getVideoLikes.matchFulfilled,
      (state, { payload }) => {
        state.status = true;
        state.userData = payload;
      }
    );
  },
});

export default likeSlice.reducer;
