import { Navigate, Outlet } from "react-router-dom";
import { useAuthContex } from "../contex/userContex";

const ProtectedRoute = () => {
  const [auth, setAuth, loading] = useAuthContex();

  if (loading) {
    return <h1>loading</h1>; 
  }

  // If authenticated, render the children (Outlet)
  // If not, send them back to /home
  return auth ? <Outlet /> : <Navigate to="/home" replace />;
};

export default ProtectedRoute;
