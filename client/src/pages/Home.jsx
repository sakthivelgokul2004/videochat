import { useNavigate } from "react-router-dom";
import CustomSigninGoogle from "../componets/customSigninGoogle.jsx"
import Navbar from "../componets/navbar.jsx";
import { useAuthContex } from "../contex/userContex.jsx";
import { useEffect } from "react";
export default function Home(props) {

  const [auth, setAuth, loading] = useAuthContex();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && auth == true) {
      navigate(`/dashboard/`, { replace: true });
    }
  }, [auth, loading]);
  return (
    <div className="h-screen overflow-hidden ">
      <Navbar />
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
