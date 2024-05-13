import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

export default function Room() {
  const socket = useSelector((state) => state.Socket.socket);
  useEffect(() => {}, []);
  function createRoom() {
    socket.emit("create", "public");
  }
  return (
    <div className="w-1/4 h-screen flex flex-col items-end ">

  <div className="w-full h-screen">
    <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
    <ul className="menu p-4 w-60 h-full bg-base-200 text-base-content ">
      <li><a>Sidebar Item 1</a></li>
      <li><a>Sidebar Item 2</a></li>
    </ul>
  </div>
</div>
  );
}
