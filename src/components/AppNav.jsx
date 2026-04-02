import { useLocation, useNavigate } from "react-router-dom";
import { useAuthSession } from "../hooks/useAuthSession";

export default function AppNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { role, signOut, isAuthLoading } = useAuthSession();

  if (isAuthLoading) return null;

  const itemsByRole = {
    customer: [
      { label: "Dashboard", path: "/dashboard" },
      { label: "My Orders", path: "/my-orders" },
      { label: "Account", path: "/account" },
    ],
    staff: [
      { label: "Dashboard", path: "/dashboard" },
      { label: "Admin Orders", path: "/admin/orders" },
      { label: "Account", path: "/account" },
    ],
    admin: [
      { label: "Dashboard", path: "/dashboard" },
      { label: "Admin Orders", path: "/admin/orders" },
      { label: "Admin Users", path: "/admin/users" },
      { label: "Account", path: "/account" },
    ],
  };

  const items = itemsByRole[role] ?? itemsByRole.customer;

  function isActive(path) {
    if (path === "/dashboard") return location.pathname === "/dashboard";
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  }

  async function handleSignOut() {
    await signOut();
    navigate("/auth", { replace: true });
  }

  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
        alignItems: "center",
        marginBottom: "20px",
      }}
    >
      {items.map((item) => (
        <button
          key={item.path}
          onClick={() => navigate(item.path)}
          style={{
            padding: "10px 14px",
            borderRadius: "10px",
            border: "1px solid #DDDDDD",
            background: isActive(item.path) ? "#E25D4D" : "#FFFFFF",
            color: isActive(item.path) ? "#FFFFFF" : "#333333",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          {item.label}
        </button>
      ))}

      <button
        onClick={handleSignOut}
        style={{
          padding: "10px 14px",
          borderRadius: "10px",
          border: "1px solid #DDDDDD",
          background: "#FFFFFF",
          color: "#333333",
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        Sign Out
      </button>
    </div>
  );
}