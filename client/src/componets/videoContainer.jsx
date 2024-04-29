import { useEffect,useRef,useState } from "react";
import { useSelector } from "react-redux";
import { setLocalStreamState } from "../redux/peerSlice";
import useMediaStream from "../utils/getUserMedia";
import { usePeerContex } from "./contex/peerContex";
export default  function  VideoContainer(){
  const pc =usePeerContex()
const ref=useRef()
const localStremState= useSelector((state) => state.Peer.localStremState);
    const [state, setState] = useState();
useEffect(() => {
  async function inial() {
    let localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });
    console.log(localStream);
     setState(localStream);
    ref.current.srcObject=localStream
     localStream.getTracks().forEach((track) => {
    pc.addTrack(track, localStream);
  });

  // Pull tracks from remote stream, add to video stream
  // pc.ontrack = (event) => {
  //   event.streams[0].getTracks().forEach((track) => {
  //     remoteStream.addTrack(track);
  //   });
  // };
    }

  inial()
}, []);
console.log(state)



    return <div>

        <video playsInline autoPlay ref={ref}></video>
    </div>
}