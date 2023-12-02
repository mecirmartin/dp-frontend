import { Navigate } from "react-router-dom";
import useToken from "../hooks/useToken";

export const ProtectedRoute = ({ children }) => {
  const { token } = useToken();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
};
