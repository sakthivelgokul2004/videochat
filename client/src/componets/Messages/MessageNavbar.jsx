import { FaVideo } from "react-icons/fa";

export function MessageNavbar({ room, socket, socketId, onMenuClick }) {
  return (
    <div className="navbar border-border bg-base-200 border-b-2">

      <div className="flex-1">
        <p className="btn btn-ghost text-xl">VideoChat</p>
      </div>


      <div className="flex-none dropdown dropdown-end">
        <button tabIndex={0} role="button" className="btn btn-square btn-ghost">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
          </svg>
        </button>
        <ul tabIndex={0} className="menu dropdown-content z-[1] p-2 shadow rounded-box w-52 mt-4 bg-base-100">
          <li><button onClick={() => console.log("sign out")}>Sign Out</button></li>
          <li><a>Profile</a></li>
        </ul>
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
