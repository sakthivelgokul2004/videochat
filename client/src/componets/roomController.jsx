export default function Room(props) {
  const socket = props.socket;
  const room = props.room;
  const setRoom = props.setroom;
  console.log(room);

  function createRoom() {
    socket.emit("create", "public");
    setRoom("public");
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
