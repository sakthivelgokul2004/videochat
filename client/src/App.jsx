import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home";
import VideoChat from "./pages/videoChat";
import { PeerProvider } from "./contex/peerContex";
import Login from "./pages/login";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import {
  useIsLoginContex,
  useSetIsLoginContex,
  useSetUserContex,
  useUserContex,
} from "./contex/userContex";
import { SocketContexProvider } from "./contex/SocketContex";
import { useisUserPersisted } from "./hooks/isAuthPersisted";
import { Loading } from "./pages/loading";

function App() {
  let isLogin = useIsLoginContex();
  let data = useUserContex();
  const setuser = useSetUserContex();
  const auth = getAuth();
  const setlogin = useSetIsLoginContex();
  console.log(data);
  // const loading = useisUserPersisted();
  const [loading, setLoading] = useState(true);
  console.log(loading);
  setTimeout(() => {
    setLoading(false);
  }, 5000);
  useEffect(() => {
    let unsubcribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const user = auth.currentUser;
        let userDetail = {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        };
        setlogin((prevs) => true);
        setuser((prevs) => ({
          ...prevs,
          ...userDetail,
        }));
        await addUser();
      }
    });
    return unsubcribe;
  }, []);
  return (
    <>
      <PeerProvider>
        <SocketContexProvider>
          <div className="h-screen w-screen">
            <BrowserRouter>
              <Routes>
                <Route
                  path="/"
                  element={isLogin ? <Home /> : <Navigate to={"/login"} />}
                />
                <Route
                  path="/login"
                  element={isLogin ? <Navigate to={"/"} /> : <Login />}
                />
                <Route path="/VideoChat" element={<VideoChat />} />
              </Routes>
            </BrowserRouter>
          </div>
        </SocketContexProvider>
      </PeerProvider>
    </>
  );
}

export default App;
