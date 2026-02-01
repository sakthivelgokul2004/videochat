
import { Navigate } from "react-router-dom";
import { useAuthContex } from "../contex/userContex";

const ProtectedRoute = () => {
  const [auth, setAuth, loading] = useAuthContex();
  if (loading) {
    return <h1>loading</h1>;
  }

  return auth ? <Navigate to="/dashboard"/>: <Navigate to="/home" />;
};

export default ProtectedRoute;
