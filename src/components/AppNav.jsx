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
      { label: "Orders Queue", path: "/admin/orders" },
      { label: "Account", path: "/account" },
    ],
    admin: [
      { label: "Dashboard", path: "/dashboard" },
      { label: "All Orders", path: "/admin/orders" },
      { label: "Manage Users", path: "/admin/users" },
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
    <nav
      style={{
        display: "flex",
        gap: "var(--space-sm)",
        flexWrap: "wrap",
        alignItems: "center",
        borderBottom: "1px solid var(--border)",
        paddingBottom: "var(--space-md)",
      }}
    >
      {/* Primary Navigation Tabs */}
      <div style={{ display: "flex", gap: "var(--space-sm)" }}>
        {items.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="option-button" // Reuse your existing button class!
              style={{
                minWidth: "auto",
                border: "none",
                background: active ? "var(--primary)" : "transparent",
                color: active ? "var(--surface)" : "var(--text-secondary)",
                boxShadow: active ? "var(--shadow-card-soft)" : "none",
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Danger/Account Action - Pushed to the right */}
      <button
        onClick={handleSignOut}
        className="secondary-button"
        style={{
          marginLeft: "auto",
          borderColor: "var(--border)",
          color: "var(--text-secondary)",
          minHeight: "40px", // slightly smaller than standard controls
          padding: "8px 16px"
        }}
      >
        Sign Out
      </button>
    </nav>
  );
}