import { useState } from "react";
import { useUserContex } from "../../contex/userContex";

export function HandleMessage(props) {
  const [currMessage, setCurrMessage] = useState("");
  const user = useUserContex();
  let room = props.room;
  const socket = props.socket;

  const handleMessage = (event) => {
    setCurrMessage(() => event.target.value);
  };

  function onEnter(e) {
    if (e.key === "Enter") {
      let msg = currMessage;
      let message = {
        ...user,
        text: msg,
        receiver: room,
      };
      socket.emit("message", message);
      setCurrMessage("");
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
