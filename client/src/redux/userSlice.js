import { createSlice } from "@reduxjs/toolkit";
import { getAuth } from "firebase/auth";
import app from "../../firebase.config"
const initialState = {
  // auth: getAuth(app),
  authState: getAuth(app) ? true: false,
};

const roomSlice = createSlice({
  name: "Auth",
  initialState,
  reducers: {
    setConneted: (state, action) => {
    },
  },
});

export const { setConneted } = roomSlice.actions;

export default roomSlice.reducer;
