import { useState } from "react";
import { useUserContex } from "../../contex/userContex";
import { useRoomContex } from "../../contex/SocketContex";

export function HandleMessage(props) {
  const [currMessage, setCurrMessage] = useState("");
  const [user,setUser] = useUserContex();
  let room = props.room;
  const setRoom = props.setRoom;
  const socket = props.socket;

  const handleMessage = (event) => {
    setCurrMessage(() => event.target.value);
  };

  function onEnter(e) {
    if (e.key === "Enter") {
      if (room.roomName == "public") {
        let msg = currMessage;
        console.log(currMessage)
        let message = {
          ...user,
          text: msg,
          receiver: room.roomName,
        };
        console.log("publicMessage", message)
        socket.emit("publicMessage", message);
        setCurrMessage("");
      } else {
        let msg = currMessage;
        let message = {
          ...user,
          text: msg,
          receiver: room.roomName,
        };
        let reqestobj = {
          socketId: room.socketId,
          message,
        };
        console.log("privateMessage", reqestobj);
        socket.emit("privateMessage", reqestobj);
        setCurrMessage("");
      }
    }
  }

  return (
    <div className="w-full flex justify-center bg-base-200 p-4">
      <input
        type="text"
        placeholder="Type here"
        className="input input-bordered input-accent  w-full "
        onChange={handleMessage}
        onKeyUp={onEnter}
        value={currMessage}
      />
    </div>
  );
}
