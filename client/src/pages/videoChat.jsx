import VideoContainer from "../componets/videoContainer.jsx";
import {  usePeerContex, useStreamStateContex,useStremUpateContex } from "../componets/contex/peerContex.jsx";
import { useRef, useState } from "react";
import  createOffer  from "../hooks/CreateOffer.jsx";
import answerCall from "../utils/answerCall.js";

export default  function VideoChat() {
  const [id,setId]=useState()
const pc=usePeerContex()
const inputref=useRef()
  // console.log(inputref.current.value)
const SteamState=useStreamStateContex()
const updateSteamState=useStremUpateContex()
async function createCall(pc){
  let rid=(await createOffer(pc))
  await setId((prev)=>rid)
  console.log(id)
  inputref.current.value=id
}
  return (
    <div className=" h-full w-full flex flex-col">
      <div className="videoDisplay flex-grow h-auto w-auto">
        {SteamState && <VideoContainer />}
      </div>
      <div className="flex-grow-0 bottom-0 ">
        <button onClick={() => updateSteamState(true)}>gry media</button>
        <button onClick={() => createCall(pc)}>createCall</button>
        <button onClick={() => answerCall(pc, inputref.current.value)}>
          answer button
        </button>
      </div>
      <input type="text" name="val" id="id" ref={inputref} />
    </div>
  );
}
