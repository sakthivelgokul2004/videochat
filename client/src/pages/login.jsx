import handleCredentialResponse from "../utils/handleResponse";

export default function Login() {
  return (
    <div className="h-screen overflow-hidden ">
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">VideoChat</a>
        </div>
        <div className="flex-none">
          <button className="btn btn-square btn-primary px-8 mx-4 text-base ">
            {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path></svg> */}
            Login
          </button>
        </div>
      </div>
      <div className="hero h-full  bg-base-200 ">
        <div className="hero-content text-center">
          <div className="max-w-lg">
            <h1 className="text-5xl font-bold">Hello </h1>
            <p className="py-1 text-base">
              The VideoChat project is a messaging application and video chat
              platform developed using Node.js, React, Socket.io, and Tailwind
              CSS etc. It facilitates one-on-one communication and utilizes
              WebRTC for video streaming, ensuring a smooth user experience.
            </p>
            <button
              className="btn my-3 btn-primary text-lg  "
              onClick={handleCredentialResponse}
            >
              Login via Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
