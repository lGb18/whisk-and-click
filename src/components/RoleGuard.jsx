import { Navigate } from "react-router-dom";
import { useAuthSession } from "../hooks/useAuthSession";

export default function RoleGuard({
  allow = [],
  redirectTo = "/my-orders",
  children,
}) {
  const { role, isAuthLoading, profile } = useAuthSession();

  if (isAuthLoading) {
    return <div style={{ padding: "24px" }}>Loading...</div>;
  }

  if (profile?.is_active === false) {
    return <Navigate to="/auth" replace />;
  }

  if (!allow.includes(role)) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}