import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

export default function Room(props) {
  const socket = useSelector((state) => state.Socket.socket);
  const room = props.room;
  const setRoom = props.setroom;
  console.log(room);

  function createRoom() {
    socket.emit("create", "public");
    setRoom("public");
    // console.log(room);
  }
  return (
    <div className="w-1/4 h-screen flex flex-col items-end ">
      <div className="w-full h-screen">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu p-4 w-60 h-full w-full bg-base-200 text-base-content ">
          <li>
            <button onClick={createRoom}>public</button>
          </li>
          <li>
            <a>Sidebar Item 2</a>
          </li>
        </ul>
      </div>
    </div>
  );
}
