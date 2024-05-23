import { useState } from "react";
import { useUserContex } from "../../contex/userContex";
import { useRoomContex } from "../../contex/SocketContex";

export function HandleMessage(props) {
  const [currMessage, setCurrMessage] = useState("");
  const user = useUserContex();
  let [roomobject, setRoom] = useRoomContex();
  let room = roomobject.room;

  const socket = props.socket;

  const handleMessage = (event) => {
    setCurrMessage(() => event.target.value);
  };

  function onEnter(e) {
    if (e.key === "Enter") {
      if (room == "public") {
        let msg = currMessage;
        let message = {
          ...user,
          text: msg,
          receiver: room,
        };
        socket.emit("publicMessage", message);
        setCurrMessage("");
      } else {
        let msg = currMessage;
        let message = {
          ...user,
          text: msg,
          receiver: room,
        };
        let reqestobj = {
          socketId: roomobject.socketId,
          message,
        };
        socket.emit("privateMessage", reqestobj);
        setCurrMessage("");
      }
    }
  }

  return (
    <>
      <input
        type="text"
        placeholder="Type here"
        className="input input-bordered input-accent  m-8 "
        onChange={handleMessage}
        onKeyUp={onEnter}
        value={currMessage}
      />
    </>
  );
}
