import { FaVideo } from "react-icons/fa";

export function MessageNavbar({ room, socket, socketId, onMenuClick }) {
  return (
    <div className="navbar border-border bg-base-200 border-b-2">

      <div className="flex-1">
        <p className="btn btn-ghost text-xl">VideoChat</p>
      </div>


      {/* MOBILE TOGGLE BUTTON 
          Visible only on small screens (flex sm:hidden)
      */}
      {/* MOBILE CLOSE BUTTON */}
      <div className="flex-none sm:hidden">
        <button
          onClick={onMenuClick}
          className="btn btn-square btn-ghost "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block w-6 h-6 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
