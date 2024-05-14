import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home";
import useLogin from "./hooks/useLogin";
import VideoChat from "./pages/videoChat";
import { PeerProvider } from "./componets/contex/peerContex";
import Login from "./pages/login";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setSignIn, setUserData } from "./redux/userSlice";

function App() {
  let auth = getAuth();
  console.log(auth);
  let dispach = useDispatch();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispach(setSignIn);
        dispach(setUserData(user));
      }
    });
  });
  const user = auth.currentUser;
  return (
    <>
      <PeerProvider>
        <div className="h-screen w-screen">
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={user ? <Home /> : <Navigate to={"/login"} />}
              />
              <Route
                path="/login"
                element={user ? <Navigate to={"/"} /> : <Login />}
              />
              <Route path="/VideoChat" element={<VideoChat />} />
            </Routes>
          </BrowserRouter>
        </div>
      </PeerProvider>
    </>
  );
}

export default App;
