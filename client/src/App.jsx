import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthContex } from "./contex/userContex";
import ProtectedRoute from "./componets/proctedRoute";
import Home from "./pages/Home";
import LoginSuccess from "./componets/loginSucces";
import Dashboard from "./componets/dashboard";
import Loading from "./pages/loading";
import { lazy, Suspense } from "react";
import { useEffect } from "react";
function App() {
  const [auth, setAuth, loading] = useAuthContex();
  if (loading) {
    return <Loading />;
  }
  console.log("auth:", auth);
  return (
    <>
      <div className="h-dvh w-dvw overflow-hidden">
        <BrowserRouter>
          <Routes>
            <Route path="/home" element={<Home setAuth={setAuth} />} />
            <Route element={<ProtectedRoute />}>
              {/* Everything inside here requires auth */}
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;

