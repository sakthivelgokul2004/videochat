import { useEffect, useState } from "react";
import app from "../../firebase.config";
import { useUserContex } from "../contex/userContex";
import { PublicMessage } from "./Messages/publicMessage";
import { MessageNavbar } from "./Messages/MessageNavbar";
import { HandleMessage } from "./Messages/handleMessage";

export default function Message(props) {
  const [messages, setMessage] = useState([]);
  const socket = props.socket;
  let room = props.room;
  let user = useUserContex();
  useEffect(() => {
    socket.on("newMesage", (val) => {
      console.log(val);
      if (val.receiverId == room) {
        setMessage((prevs) => [...prevs, val]);
      }
    });
  }, []);

  return (
    <div className="flex flex-col justify-end w-screen relative overflow-hidden">
      <MessageNavbar room={room} />
      {messages.length
        ? messages.map((Message) => {
            console.log(Message);
            return (
              <>
                <PublicMessage message={Message} user={user.email} />
                {/* <p key={Message._id} className="chat-bubble">
                  {Message.text}
                </p> */}
              </>
            );
          })
        : ""}
      <HandleMessage room={room} socket={socket} />
    </div>
  );
}
