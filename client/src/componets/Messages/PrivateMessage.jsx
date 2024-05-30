import { handleTimeAndDate } from "../../utils/handleDateAndTime";

export function PrivateMessages(props) {
  let Messgae = props.message;
  let usermail = props.email;
  console.log(Messgae);
  let time = handleTimeAndDate(Messgae.createdAt);
  let style = Messgae.sendemail == usermail ? "chat-end" : "chat-start";
  return (
    <>
      <div className={`chat  ${style}`}>
        <div className="chat chat-start">
          <div className="chat-bubble max-w-48 ">
            <div className=" flex flex-col  items-end ">
              <div className="">
                {Messgae.text}
                <time className="text-xs opacity-50 pl-2 ">{time}</time>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
