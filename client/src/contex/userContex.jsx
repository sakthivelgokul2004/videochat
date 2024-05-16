import { createContext, useContext, useState } from "react";
import { io } from "socket.io-client";

const UserContex = createContext();
const SetuserContex = createContext();
const IsLoginContex = createContext();
const SetIsLoginContex = createContext();

export function useUserContex() {
  return useContext(UserContex);
}
export function useSetUserContex() {
  return useContext(SetuserContex);
}
export function useIsLoginContex() {
  return useContext(IsLoginContex);
}
export function useSetIsLoginContex() {
  return useContext(SetIsLoginContex);
}

export function UserProvider({ children }) {
  let [isLogin, setIsLogin] = useState(false);
  let [user, setUser] = useState({ displayName: "", email: "", photoURL: "" });

  return (
    <>
      <UserContex.Provider value={user}>
        <SetuserContex.Provider value={setUser}>
          <IsLoginContex.Provider value={isLogin}>
            <SetIsLoginContex.Provider value={setIsLogin}>
              {children}
            </SetIsLoginContex.Provider>
          </IsLoginContex.Provider>
        </SetuserContex.Provider>
      </UserContex.Provider>
    </>
  );
}
