import { signOut } from "../../utils/signOut";

export function MessageNavbar(props) {
  let room = props.room;
  return (
    <>
      {/* navbar */}
      <div className="navbar bg-base-100 absolute top-0 ">
        <div className="flex-1">
          <p className="btn btn-ghost text-xl">{room}</p>
        </div>
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
              <button onClick={signOut}>Sign Out</button>
            </li>
            <li>
              <a>Item 2</a>
            </li>
          </ul>
        </div>
        {/* <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost rounded-btn">
            Dropdown
          </div>
          <ul
            tabIndex={0}
            className="menu dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box w-52 mt-4"
          >
            <li>
              <a>Item 1</a>
            </li>
            <li>
              <a>Item 2</a>
            </li>
          </ul>
        </div> */}
      </div>
      {/* end navbar */}
    </>
  );
}
