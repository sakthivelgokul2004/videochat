import CustomSigninGoogle from "../componets/customSigninGoogle.jsx"

import { useNavigate } from "react-router-dom";
export default function Login(props) {
  const navigate = useNavigate()
  return (
    <div className="h-screen overflow-hidden ">
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">VideoChat</a>
        </div>
        <div className="flex-none px-4">
          <button
            className="btn btn-active btn-primary"
            onClick={() => navigate(`/meet/`,)}
          >Create a Meet</button>
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
            <CustomSigninGoogle />
          </div>
        </div>
      </div>
    </div>
  );
}
