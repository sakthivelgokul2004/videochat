import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginSuccess } from "./componets/loginSucces"
import { useAuthContex } from "./contex/userContex";
import ProtectedRoute from "./componets/proctedRoute";
import Home from "./pages/Home";
import Dashboard from "./componets/dashboard";
import Loading from "./pages/loading";
function App() {
  const [auth, setAuth, loading] = useAuthContex();
  if (loading) {
    return <Loading/>;
  }
  console.log("auth:", auth);
  return (
    <>
      <div className="h-screen w-screen overflow-hidden">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard/>
              </ProtectedRoute>}
            />
            <Route
              path="/dashboard"
              element={<Dashboard/>}
            />
            <Route path="/test" element={<Dashboard test={true}/>} />
            <Route path="/home" element={<Home setAuth={setAuth}/>} />
            <Route path="/success" element={<LoginSuccess />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;

// <Route
//   path="/VideoChat/:room?/:state"
//   element={<VideoChat />}
// />
