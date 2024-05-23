import { PublicMessage } from "./publicMessage";
export function Message(props) {
  let Messages = props.publicMessages;
  let room = props.room;

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
  let privateMessages = props.privateMessages;
  return (
    <>
      {privateMessages.length
        ? privateMessages.map((Message) => {
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
