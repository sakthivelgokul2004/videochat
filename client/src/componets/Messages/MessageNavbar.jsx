import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { FaVideo } from "react-icons/fa";

export function MessageNavbar(props) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  let room = props.room;
  let socket = props.socket;
  let socketId = props.socketId;
  function startOfferCall(socketId) {
    console.log(callDoc.id);
    socket.emit("initiateCall", { room: callDoc.id, socketId: socketId });
    navigate(`/VideoChat/${callDoc.id}/caller`);
  }

  return (
    <>
      {/* navbar */}
      <div className="navbar   border-border bg-base-200  border-b-2">
        <div className="flex-1">
          <p className="btn btn-ghost text-xl">VideoChat</p>
        </div>
        {room != "public" ? (
          <div
            className="btn btn-square btn-ghost "
            onClick={() => console.log("start call")}
          >
            <FaVideo />
          </div>
        ) : (
          ""
        )}
        <div className="flex-none dropdown dropdown-end">
          <button
            tabIndex={0}
            role="button"
            className="btn btn-square btn-ghost"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-5 h-5 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
          <ul
            tabIndex={0}
            className="menu dropdown-content z-[1] p-2 shadow  rounded-box w-52 mt-4 bg-primary-content"
          >
            <li>
              <button onClick={()=>console.log("sign out")}>Sign Out</button>
            </li>
            <li>
              <a>Item 2</a>
            </li>
          </ul>
        </div>
      </div>
      {/* end navbar */}
    </>
  );
}
