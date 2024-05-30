import { useUserContex } from "../../contex/userContex";
import { PrivateMessages } from "./PrivateMessage";
import { PublicMessage } from "./publicMessage";

export function Messages(props) {
  const user = useUserContex();
  let Messages = props.publicMessages;
  console.log(props);
  let room = props.Room;
  let socketId = props.socketId;

  if (room == "public") {
    return (
      <>
        {Messages.length
          ? Messages.map((Message) => {
              return (
                <>
                  <PublicMessage message={Message} user={user.email} />
                </>
              );
            })
          : ""}
      </>
    );
  }
  let privateMessage = props.privateMessages;
  console.log(socketId);

  if (room != "public" && socketId != 0) {
    let currentRoomMessage = getMessagesBySocketId(privateMessage, socketId);
    console.log(currentRoomMessage);
    return (
      <>
        {currentRoomMessage.length
          ? currentRoomMessage.map((obj) => {
              return (
                <>
                  <PrivateMessages message={obj.message} user={user.email} />
                </>
              );
            })
          : ""}
      </>
    );
  }
}
const getMessagesBySocketId = (data, targetSocketId) => {
  let message = data.filter((msg) => msg.socketId === targetSocketId);
  return message;
};
