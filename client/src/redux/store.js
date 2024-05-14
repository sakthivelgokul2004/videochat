import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import socketSlice from "./socketSlice";
import peerSlice from "./peerSlice";

export const store = configureStore({
  reducer: {
    User: userSlice,
    Socket: socketSlice,
    Peer: peerSlice,
  },
});
