import { useEffect, useState } from "react";
import { useRoomContex, useSocketContex } from "../contex/SocketContex";
import { json } from "react-router-dom";
import { Contact } from "./contacts";

export default function Room() {
  const socket = useSocketContex();
  const [room, setroom] = useRoomContex();
  const [liveUser, setLiveUser] = useState([]);

  useEffect(() => {
    socket.on("getUser", async (lives) => {
      console.log(lives);
      console.log(socket.id);
      lives = lives.filter((obj) => obj.socketId != socket.id);
      setLiveUser((prevs) => [...lives]);
    });
    return () => socket.off("getUser");
  }, []);

  function changeRoom(para, SocketId) {
    setroom((prevs) => ({ ...prevs, socketId: SocketId, room: para }));
  }
  return (
    <div className="w-1/4 h-screen flex flex-col items-end ">
      <div className="w-full h-screen">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu p-4  h-full w-full bg-base-200 text-base-content ">
          <li>
            <button /* onClick={createRoom} */>public</button>
          </li>
          <li>
            {liveUser.length
              ? liveUser.map((contact) => {
                  // console.log(contact);
                  return (
                    <>
                      <Contact
                        contact={contact.user}
                        socketId={contact.socketId}
                        handleRoom={changeRoom}
                      />
                    </>
                  );
                })
              : ""}
          </li>
        </ul>
      </div>
    </div>
  );
}
