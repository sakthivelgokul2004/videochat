import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import useLogin from "./hooks/useLogin";
import VideoChat from "./pages/videoChat";
import { PeerProvider } from "./componets/contex/peerContex";

function App() {
  return (
    <>
   <PeerProvider>
      <div className="h-screen w-screen">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
        <Route path="VideoChat" element={<VideoChat/>} />
          </Routes>
        </BrowserRouter>
      </div>
    </PeerProvider>
    </>
  );
}

export default App;
