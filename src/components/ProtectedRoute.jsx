import { Navigate } from "react-router-dom";
import { useAuthSession } from "../hooks/useAuthSession";

export default function ProtectedRoute({ children }) {
  const { user, isAuthLoading } = useAuthSession();

  if (isAuthLoading) {
    return <div className="page-shell">Loading session...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}