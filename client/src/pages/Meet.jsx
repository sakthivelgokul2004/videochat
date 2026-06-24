import { useEffect } from "react";
import VideoPreview from "../componets/videoPreview"
import { useParams, useNavigate } from "react-router-dom";
import { useMediaSoup } from "../hooks/useMediaHook";
import { useState } from "react";
import ActiveConnections from "../componets/layout";
import { useAuthContex, useUserContex } from "../contex/userContex";
import MediaControlPanel from "../componets/mediaControlpanel";
import Navbar from "../componets/navbar";
const Meet = () => {
  const { roomid: urlRoomId } = useParams();
  const [auth, setAuth, loading] = useAuthContex();
  const [user, setUser] = useUserContex()
  const navigate = useNavigate();
  const { CallStarted, localStream, peers, userState, videoElementRef, mediaConstraints, toggleMediaConstraint, EnterRoom, roomIsAlive, setUserName, leaveRoom } = useMediaSoup();
  const [roomId, setRoomId] = useState("");
  const [isRoomExist, setisRoomExist] = useState(false);
  const [guestName, setGuestName] = useState("");
  useEffect(() => {
    async function check() {
      if (urlRoomId) {
        const result = await roomIsAlive(urlRoomId);
        if (result != null) {
          setRoomId(urlRoomId);
          setisRoomExist(true);
        } else {
          console.log("Room does not exist:", urlRoomId);
          navigate(`/meet/`, { replace: true });
        }
      }
    }
    check()
  }, [urlRoomId, navigate]);
  useEffect(() => {
    if (auth == true) {
      console.log("called the auth");
      setUserName(user.displayName, user.photoUrl);
    }
  }, [auth, loading]);

  const joinRoom = async (type, enteredGuestName) => {
    if (!auth && enteredGuestName?.trim()) {
      setGuestName(enteredGuestName);
      setUserName(enteredGuestName, null); // no photo for guests
    }
    const resultRoomId = await EnterRoom(type, roomId);
    console.log("Response from server:", resultRoomId);
    if (type === "create" && resultRoomId) {
      setRoomId(resultRoomId);
      navigate(`/meet/${resultRoomId}`, { replace: true });
    }
  }
  const handleLeave = () => {
    leaveRoom();
    setRoomId("");
    setisRoomExist(false)
    navigate("/meet", { replace: true });
  };

  return (
    <div className="bg-base-200">
      {
        !CallStarted && <VideoPreview mediaConstraints={mediaConstraints} toggleMediaConstraint={toggleMediaConstraint} videoElementRef={videoElementRef} JoinRoom={joinRoom} isRoomExist={isRoomExist} isCall={false} isAuth={auth}/>
      }
      {CallStarted && <>
        <Navbar />
        <ActiveConnections peers={peers} localStream={localStream} localUserData={userState} />
        <MediaControlPanel mediaConstraints={mediaConstraints} toggleMediaConstraint={toggleMediaConstraint} onLeave={handleLeave} />
      </>}
    </div>
  )
}

export default Meet

