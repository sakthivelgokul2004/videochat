import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./componets/home";
import VideoChat from "./pages/videoChat";
import { PeerProvider } from "./contex/peerContex";
import Login from "./pages/login";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  useIsLoginContex,
  useSetIsLoginContex,
  useSetUserContex,
  useUserContex,
} from "./contex/userContex";
import { SocketContexProvider } from "./contex/SocketContex";
import { Loading } from "./pages/loading";
import { addUser } from "./utils/adduser";

function App() {
  let isLogin = useIsLoginContex();
  let data = useUserContex();
  const setuser = useSetUserContex();
  const auth = getAuth();
  const setlogin = useSetIsLoginContex();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let unsubcribe = onAuthStateChanged(auth, async (user) => {
      console.log("trigger");
      if (user) {
        const user = auth.currentUser;
        let userDetail = {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        };
        setlogin(true);
        setuser((prevs) => ({
          ...prevs,
          ...userDetail,
        }));
        setLoading(false);
        await addUser();
      } else {
        console.log("notu");
        setlogin(false);
        setLoading(false);
        console.log(isLogin);
      }
    });
    return unsubcribe;
  }, []);
  function decide() {
    console.log("hi");
    if (loading) {
      return <Loading loading={loading} />;
    }
    if (isLogin) {
      return <Home />;
    }
    return <Login />;
  }
  return (
    <>
      <PeerProvider>
        <SocketContexProvider>
          <div className="h-screen w-screen">
            <BrowserRouter>
              <Routes>
                <Route path="/" element={decide()} />
                <Route
                  path="/login"
                  element={isLogin ? <Navigate to={"/"} /> : <Login />}
                />
                <Route
                  path="/VideoChat/:room?/:state"
                  element={<VideoChat />}
                />
                <Route path="/Loading" element={<Loading />} />
              </Routes>
            </BrowserRouter>
          </div>
        </SocketContexProvider>
      </PeerProvider>
    </>
  );
}

export default App;
