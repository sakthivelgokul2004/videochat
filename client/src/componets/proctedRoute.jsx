import { Navigate, Outlet } from "react-router-dom";
import { useAuthContex } from "../contex/userContex";

const ProtectedRoute = () => {
  const [auth, setAuth, loading] = useAuthContex();
  const isPublicRoute = location.pathname.startsWith("/meet");

  if (isPublicRoute) {
    return <Outlet />;
  }
  if (loading) {
    return <h1>loading</h1>;
  }

  return auth ? <Outlet /> : <Navigate to="/home" replace />;
};

export default ProtectedRoute;
