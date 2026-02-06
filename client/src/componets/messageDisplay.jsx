import { useEffect, useState } from "react";
import { HandleMessage } from "./Messages/handleMessage";
import { Messages } from "./Messages/Messages";

export default function Message(props) {
  const [publicMessages, setPublicMessage] = useState([]);
  const [privateMessages, setPrivateMessage] = useState([]);
  const socket = props.socket;
  let room = props.room;
  const width = props.width;
  const setRoom = props.setRoom;
  const setOpen = props.setOpen;
  const isConsumer = props.isConsumer;
  useEffect(() => {

    socket.on("newMesage", (val) => {
      console.log("newMessage", val);
      if (val.receiverId == "public") {
//        console.log("on messageDisplay" + val);
        setPublicMessage((prevs) => [...prevs, val]);
 //       console.log("on messageDisplay" + val);
      }
      setPrivateMessage((prevs) => [...prevs, val]);
    });
    return () => {
      socket.off("newMesage");
    };
  }, []);

  return (
    <div className="size  h-screen flex flex-col" style={{ width: width }}>
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">{room.roomName}</a>
        </div>
        {
          room.roomName !== "public" &&
          <div className="flex-none">
            <button className="btn btn-square btn-primary px-8 mx-4 text-base " onClick={() => {
              setOpen((prevs) => !prevs)
            }}>
              call
            </button>
            <button className="btn btn-square btn-primary px-8 mx-4 text-base " onClick={() => {
              isConsumer((prev) => true);
              setOpen((prev) => !prev);
            }}>
              Cosumer
            </button>
          </div>
        }
      </div>
      <div className="overflow-y-scroll flex-grow ">
        <Messages
          publicMessages={publicMessages}
          RoomName={room.roomName}
          socketId={room.socketId}
          privateMessages={privateMessages}
        />
      </div>
      <HandleMessage room={room} socket={socket} />
    </div>
  );
}
