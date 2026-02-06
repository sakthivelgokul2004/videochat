import { useEffect, useState } from "react";
import { Contact } from "./contacts";

export default function Room(props) {
  const socket = props.socket;
  const setroom = props.setRoom;
  const [liveUser, setLiveUser] = useState([]);

  useEffect(() => {
    socket.on("getUser", async (lives) => {
//      console.log("getUser",lives);
//      console.log(socket.id);
      lives = lives.filter((obj) => obj.socketId != socket.id);
      setLiveUser((prevs) => [...lives]);
    });
    return () => socket.off("getUser");
  }, []);
//console.log("liveUser:", liveUser);
  function changeRoom(para, SocketId) {
    setroom((prevs) => ({ ...prevs, socketId: SocketId, roomName: para }));
  }
  return (
    <div className="">
      <div className="w-full h-screen justify-center">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu   h-full w-full bg-base-200 text-base-content ">
          <li>
            <button  onClick={()=>changeRoom("public",0)} >public</button>
          </li>
          <li>
            {liveUser.length
              ? liveUser.map((contact) => {
                   console.log(contact);
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
