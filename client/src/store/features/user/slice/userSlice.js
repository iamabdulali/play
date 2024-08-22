import { createSlice } from "@reduxjs/toolkit";
import { userApi } from "../api/userApiSlice";
import toast from "react-hot-toast";

const initialState = {
  status: false,
  userData: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginUser: (state, { payload }) => {
      state.status = true;
      state.userData = payload.data;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      userApi.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        state.status = true;
        state.userData = payload;
        toast.success("Logged In Successfully");
        const token = state.userData.accessToken;
        localStorage.setItem("token", token);
      }
    );
    builder.addMatcher(
      userApi.endpoints.getUser.matchFulfilled,
      (state, { payload }) => {
        state.status = true;
        state.userData = payload;
      }
    );
  },
});

export const { loginUser } = userSlice.actions;
export default userSlice.reducer;
