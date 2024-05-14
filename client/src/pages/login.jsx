import { useEffect } from "react";
import { signInWithGoogle } from "../hooks/signWithGoogle";

export default function Login() {
  useEffect(() => {
    // signInWithGoogle();
    function handleCredentialResponse(response) {
      console.log("Encoded JWT ID token: " + response.credential);
    }
    google.accounts.id.initialize({
      client_id:
        "321973348565-q71f9fh5u8hjbsfv7ou19f9rvvgr21kh.apps.googleusercontent.com",
      callback: handleCredentialResponse,
    });
    google.accounts.id.renderButton(
      document.getElementById("buttonDiv"),
      { theme: "outline", size: "large" }, // customization attributes
    );
    google.accounts.id.prompt();
  });

  return (
    <div className="h-screen overflow-hidden ">
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">VideoChat</a>
        </div>
        <div className="flex-none">
          <button
            className="btn btn-square btn-primary px-8 mx-4 text-base "
            /* onClick={signWithGoogle} */
          >
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
              /* onClick={signWithGoogle} */ id="buttonDiv"
            >
              Login via Google
            </button>
            {/* <p className="text-sm">Login using Gmail </p> */}
          </div>
        </div>
      </div>
    </div>
  );
}
