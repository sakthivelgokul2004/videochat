import ActiveConnections from './layout'
import VideoPreview from "./videoPreview"
import { useMediaSoup } from "../hooks/useMediaHook";
import { useEffect, useState } from 'react';

const Silder = ({
  isConsumer,
  width,
  sendInvite,
  room,
  routerId,
  setRouterId,
}) => {
  const { CallStarted, localStream, remoteStreams, peers, videoElementRef, mediaConstraints, toggleMediaConstraint, EnterRoom, roomIsAlive, setUserName } = useMediaSoup();
  const [isRoomExist, setisRoomExist] = useState(false);
  const joinRoom = async (type) => {
    let roomState = routerId === "" ? "create" : "join";
    const resultRoomId = await EnterRoom(type, routerId);
    console.log("Response from server:", resultRoomId);
    if (type === "create" && resultRoomId) {
      setRouterId(resultRoomId);
      if (roomState === "create") {
        sendInvite(resultRoomId);
      }
    }
  }

  useEffect(() => {
    async function check() {
      if (routerId) {
        const result = await roomIsAlive(routerId);
        if (result != null) {
          setRouterId(routerId);
          setisRoomExist(true);
        } else {
          console.log("Room does not exist:", routerId);
        }
      }
    }
    check()
  }, [routerId]);



  return (
    <div
      className="relative h-full w-full flex flex-col p-4 gap-4 bg-waikawa-gray-950"
      style={{ width: width }}
    >
      {
        !CallStarted && <VideoPreview mediaConstraints={mediaConstraints} toggleMediaConstraint={toggleMediaConstraint} videoElementRef={videoElementRef} JoinRoom={joinRoom} isRoomExist={isRoomExist} isCall={true} />
      }
      {CallStarted && <ActiveConnections remoteStreams={remoteStreams} localStream={localStream} />}
    </div>
  );
}

export default Silder

