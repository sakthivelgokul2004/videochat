import { useEffect, useState } from "react";
import { HandleMessage } from "./Messages/handleMessage";
import { Messages } from "./Messages/Messages";

export default function Message(props) {
  const [publicMessages, setPublicMessage] = useState([]);
  const [privateMessages, setPrivateMessage] = useState([]);
  const { socket, room, width, setOpen, isConsumer, setIsNavbarOpen } = props;
  useEffect(() => {

    socket.on("newMesage", (val) => {
      console.log("newMessage", val);
      if (val.receiverId == "public") {
        setPublicMessage((prevs) => [...prevs, val]);
      }
      setPrivateMessage((prevs) => [...prevs, val]);
    });
    return () => {
      socket.off("newMesage");
    };
  }, []);

  return (
    <div className="size  h-screen flex flex-col" style={{ width: width }}>
      <div className="navbar bg-base-100 border-b border-border shadow-sm">

        {/* MOBILE TOGGLE BUTTON: Opens the Room List Sidebar */}
        <div className="flex-none sm:hidden">
          <button
            className="btn  btn-ghost"
            onClick={() => setIsNavbarOpen(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>

        <div className="flex-1">
          <a className="btn btn-ghost text-xl truncate">{room.roomName}</a>
        </div>
        {
          room.roomName !== "public" &&
          <div className="flex-none">
            <button className="btn btn-square btn-primary px-8 mx-4 text-base " onClick={() => {
              setOpen((prevs) => !prevs)
            }}>
              call
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
