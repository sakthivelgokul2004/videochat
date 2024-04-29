import { createContext,useContext, useState } from "react";


const PeerContex = createContext();
const StreamStateContex = createContext();
const StreamUpdateContex = createContext();

export function usePeerContex() {
    return useContext(PeerContex)
}
export function useStreamStateContex() {
    return useContext(StreamStateContex)
}
export function useStremUpateContex() {
    return useContext(StreamUpdateContex)
}

export function PeerProvider({ children }) {

const servers = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
  iceCandidatePoolSize: 10,
};
const pc =new RTCPeerConnection(servers) 
const [localStreamState,setLocalStreamState]=useState(false)
    return (
        <PeerContex.Provider value={pc}>
            <StreamStateContex.Provider value={localStreamState}>
                <StreamUpdateContex.Provider value={setLocalStreamState}>
                    {children}
                </StreamUpdateContex.Provider>
            </StreamStateContex.Provider>
        </PeerContex.Provider>
    )
}