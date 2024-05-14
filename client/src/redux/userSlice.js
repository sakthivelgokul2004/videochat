import { createSlice } from "@reduxjs/toolkit";
import { getAuth } from "firebase/auth";
import app from "../../firebase.config";
const initialState = {
  isSignIn: false,
  userdata: {},
};

const userSlice = createSlice({
  name: "Auth",
  initialState,
  reducers: {
    setSignIn: (state, action) => {
      state.isSignIn = true;
    },
    setUserData: (state, action) => {
      state.userdata = action.payload;
    },
  },
});

export const { setSignIn, setUserData } = userSlice.actions;

export default userSlice.reducer;
