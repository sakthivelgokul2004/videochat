import { createSlice } from "@reduxjs/toolkit";
import { io } from "socket.io-client";

const initialState = {
  socket: io("http://localhost:3000/"),
};

const socketSlice = createSlice({
  name: "Socket",
  initialState,
  reducers: {
    setRestart: (state) => {
      state.socket = io("http://localhost:3000/");
    },
  },
});

export const { setRestart } = socketSlice.actions;

export default socketSlice.reducer;
