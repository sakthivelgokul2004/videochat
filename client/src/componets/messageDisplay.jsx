import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import useEmit from "../hooks/socketEmit";
import  {signWithGoogle , addUser } from "../hooks/signWithGoogle";
import { Outlet, Link } from "react-router-dom";


export default function Message() {
  const [currMessage, setCurrMessage] = useState("");
  const [messages, setMessage] = useState([])
  const dispatch = useDispatch();
  const socket = useSelector((state) => state.Socket.socket);
  useEffect(() => {
    socket.on("newMesage", (val) => setMessage((prevs) => [...prevs, val]))


  }, [])

  const handleMessage = (event) => {
    console.log(event.target.value);
    setCurrMessage(() => event.target.value);
  };

  function onEnter(e) {
    if (e.key === "Enter") {
      socket.emit("message", currMessage);
      setCurrMessage("")
    }
  }
  let style ="text-success bg-"

  return (
    <div>
      {(messages.length) ? messages.map((Message) => {
        return <p key={Message}>{Message}</p>
      }) : ""}
      {messages && messages.forEach((val) => <p className={style+"bg-warning"}>{val}</p>)}
      <input
        type="text"
        placeholder="Type here"
        className="input input-bordered input-accent w-full max-w-xs"
        onChange={handleMessage}
        onKeyUp={onEnter}
        value={currMessage}
      />
      <button onClick={signWithGoogle}>notufoeU</button>
      <button onClick={addUser}>userdetail</button>
      <Link to="/VideoChat">Blogs</Link>

    </div>
  );
}
