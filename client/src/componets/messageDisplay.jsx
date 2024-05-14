import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAuth } from "firebase/auth";
import app from "../../firebase.config";
import { useUserContex } from "./contex/userContex";

export default function Message(props) {
  const [currMessage, setCurrMessage] = useState("");
  const [messages, setMessage] = useState([]);
  const socket = useSelector((state) => state.Socket.socket);
  const user = useUserContex();
  console.log(user);
  let room = props.room;
  useEffect(() => {
    socket.on("newMesage", (val) => setMessage((prevs) => [...prevs, val]));
  }, []);

  const handleMessage = (event) => {
    setCurrMessage(() => event.target.value);
  };

  function onEnter(e) {
    if (e.key === "Enter") {
      socket.emit("message", currMessage);
      setCurrMessage("");
    }
  }

  return (
    <div className="flex flex-col justify-end w-screen relative overflow-hidden">
      {/* navbar */}
      <div className="navbar bg-base-100 absolute top-0 ">
        <div className="flex-none">
          <button className="btn btn-square btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-5 h-5 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>
        <div className="flex-1">
          <p className="btn btn-ghost text-xl">{room}</p>
        </div>
        <div className="flex-none">
          <button className="btn btn-square btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-5 h-5 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
              ></path>
            </svg>
          </button>
        </div>
      </div>
      {/* end navbar */}
      {messages.length
        ? messages.map((Message) => {
            return (
              <p key={Message} className="chat-bubble">
                {Message}
              </p>
            );
          })
        : ""}
      <input
        type="text"
        placeholder="Type here"
        className="input input-bordered input-accent  m-8 "
        onChange={handleMessage}
        onKeyUp={onEnter}
        value={currMessage}
      />
    </div>
  );
}
