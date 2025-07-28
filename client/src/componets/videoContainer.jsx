import { useEffect, useRef, useState } from "react";

export default function VideoContainer() {
  const servers = {
    iceServers: [
      {
        urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
      },
    ],
    iceCandidatePoolSize: 10,
  };
  const pc = new RTCPeerConnection(servers)
  let remoteStream = new MediaStream();
  const ref = useRef();
  const remoteRef = useRef();
  const [state, setState] = useState();
  useEffect(() => {
    async function inial() {
      let localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      ref.current.srcObject = localStream;
      console.log();
      setState(localStream);
      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);

        // Pull tracks from remote stream, add to video stream
        pc.ontrack = (event) => {
          event.streams[0].getTracks().forEach((track) => {
            remoteStream.addTrack(track);
          });
        };
      });

      remoteRef.current.srcObject = remoteStream;
    }

    inial();
  }, []);

  return (
    <div className="h-full w-full relative flex">
      <video
        playsInline
        autoPlay
        className="absolute  bottom-0 aspect-square h-[240px]    left-0"
        ref={ref}
      ></video>
      <div className="flex justify-center items-center w-full">
        <video
          playsInline
          autoPlay
          className="w-[640px] h-[480px] object-fill justify-center items-center"
          ref={remoteRef}
        ></video>
      </div>
    </div>
  );
}
