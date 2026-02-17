import { handleTimeAndDate } from "../../utils/handleDateAndTime";

export function PrivateMessages({message,userMail}) {
  console.log(message);
  let time = handleTimeAndDate(message.createdAt);
  let style = message.senderemail == userMail ? "chat-end" : "chat-start";
  console.log( message.senderemail, userMail);
  return (
    <>
      <div className={`chat  ${style}`}>
        <div className="chat chat-start">
          <div className="chat-bubble max-w-48 ">
            <div className=" flex flex-col  items-end ">
              <div className="">
                {message.text}
                <time className="text-xs opacity-50 pl-2 ">{time}</time>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
