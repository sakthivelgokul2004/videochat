import getUserMedia from "../utils/getUserMedia.js"
import useCreateCall from "../hooks/CreateOffer.jsx"
import answerCall from "../utils/answerCall.js";
import VideoContainer from "../componets/videoContainer.jsx";
import { PeerProvider, useStreamStateContex,useStremUpateContex } from "../componets/contex/peerContex.jsx";
import Input from "../componets/inputEment.jsx";
import { useRef } from "react";

export default  function VideoChat() {
const inputref=useRef()
  
const SteamState=useStreamStateContex()
const updateSteamState=useStremUpateContex()
function createCall(){
  let [id]=useCreateCall()
  // inputref.current.value=id
}
  return (
 
    <div className=" h-full w-full flex flex-col">
      <div className="videoDisplay flex-grow">
        {SteamState && <VideoContainer  />}
      </div>
      <div className="bottom bottom-0">
        <button
          onClick={() =>updateSteamState(true)
          }
        >
          gry media
        </button>
        <button onClick={()=>createCall()} >createCall</button>
      </div>
          <input type="text" name="val" id="id" ref={inputref} />
    </div>
  );
}
