import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
function useEmit(name, message) {
  const socket = useSelector((state) => state.Socket.socket);
  useEffect(() => {
    socket.emit(name, message);
  }, []);
}

export default useEmit;
