import { createContext, useContext, useEffect, useState } from "react";
import { useUserContex } from "./userContex";
import { io } from "socket.io-client";
const SocketContex = createContext();
const RoomContex = createContext();

export function useSocketContex() {
  return useContext(SocketContex);
}

export function useRoomContex() {
  return useContext(RoomContex);
}

export function SocketContexProvider({ children }) {
  const [socket, setSocket] = useState();
  const [room, setRoom] = useState("public");
  let user = useUserContex();
  console.log(user);
  useEffect(() => {
    try {
      const socket = io("http:/localhost:3000/", {
        query: {
          userEmail: user.email,
        },
      });
      socket.on("connect", () => {
        console.log("connet");
      });
      setSocket(socket);
    } catch (e) {
      console.log(e);
    }
  }, []);
  return (
    <>
      <SocketContex.Provider value={socket}>
        <RoomContex.Provider value={[room, setRoom]}>
          {children}
        </RoomContex.Provider>
      </SocketContex.Provider>
    </>
  );
}
