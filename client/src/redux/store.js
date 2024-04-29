import { configureStore } from "@reduxjs/toolkit";
import roomReducer from "./userSlice";
import socketSlice from "./socketSlice";
import peerSlice from "./peerSlice";

export const store = configureStore({
  reducer: {
    room: roomReducer,
    Socket: socketSlice,
    Peer: peerSlice
  },
});
