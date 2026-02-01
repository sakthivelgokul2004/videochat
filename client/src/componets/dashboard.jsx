import { useEffect,  useState } from "react";
import Room from "./roomController";
import { useUserContex } from "../contex/userContex";
import socket from "../utils/messageSocket";
import { MessageNavbar } from "./Messages/MessageNavbar";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import Pane from "./pane";
export default function Dashboard() {
  const [user, setUser] = useUserContex()
  const [room, setRoom] = useState({ roomName: "public", socketId: 0 });
  const [isOpen, setIsOpen] = useState(false);
  const [isConsumer, setConsumer] = useState(false);
  const [routerId, setRouterId] = useState("");
  const notify = () => toast('Here is your toast.');
  useEffect(() => {
    socket.emit("setOnline", user.email);
    socket.on("invite", (res) => {
      console.log("invite", res);
      setRouterId(res.routerId);
      console.log(res.user);
      showInviteToast(res.user, res.routerId);
    })
    setRoom((prevs) => ({ ...prevs, roomName: "public" }));
    return () => {
      socket.disconnect();
    };
  }, []);
  const showInviteToast = (from, routerId) => {
    toast.custom(
      (t) => (
        <div
          className={`${t.visible ? "animate-enter" : "animate-leave"
            } max-w-md w-full bg-white shadow-lg rounded-xl pointer-events-auto flex flex-col p-4`}
        >
          <p className="text-sm font-medium text-gray-900">
            📞 Incoming call from <span className="font-bold">{from}</span>
          </p>
          <div className="mt-3 flex space-x-2">
            <button
              onClick={() => {
                setIsOpen(true);
                socket.emit("acceptInvite", { from, routerId });
                setRouterId(routerId);
                toast.dismiss(t.id);
              }}
              className="flex-1 px-3 py-1 rounded-lg bg-green-500 text-white hover:bg-green-600"
            >
              Accept
            </button>
            <button
              onClick={() => {
                socket.emit("rejectInvite", { from, reason: "Ignored" });
                toast.dismiss(t.id);
              }}
              className="flex-1 px-3 py-1 rounded-lg bg-gray-300 text-gray-800 hover:bg-gray-400"
            >
              Ignore
            </button>
          </div>
        </div>
      ),
      { duration: Infinity } // stays until user acts
    );
  };
  return (
    <div className="relative flex w-screen h-screen ">
      <div className="w-1/4">
        <MessageNavbar
          room={room.roomName}
          socketId={room.socketId}
          socket={socket}
        />
        <Room socket={socket} room={room} setRoom={setRoom} />
      </div>
      <Pane room={room} socket={socket} setRoom={setRoom} setOpen={setIsOpen} isConsumer={setConsumer} isOpen={isOpen} routerId={routerId} setRouterId={setRouterId} />
      <Toaster />
    </div>
  );
}
