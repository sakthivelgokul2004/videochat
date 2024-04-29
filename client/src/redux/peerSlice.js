
import { createSlice } from "@reduxjs/toolkit";
import app from "../../firebase.config"

const servers = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
  iceCandidatePoolSize: 10,
};

const initialState = { 
//  pc : new RTCPeerConnection(servers),
 localStream : null,
 remoteStream : null,
 localStremState:false

};

const peerSlice = createSlice({
  name: "Peer",
  initialState,
  reducers: {
    setConneted: (state, action) => {},
    setLocalStream: (state,action) => {
      state.localStream=action.payload 
    },
    setRemoteStream: (state,action) => {
      state.localStream=action.payload 
    },
    setLocalStreamState:(state)=>{
      state.localStremState=true
    }
  },
});

export const {setLocalStream,setRemoteStream,setLocalStreamState} =peerSlice.actions;

export default peerSlice.reducer;
