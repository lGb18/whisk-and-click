import { useNavigate } from "react-router-dom";
import AppNav from "../components/AppNav";
import DashboardShortcutCard from "../components/DashboardShortcutCard";
import { useAuthSession } from "../hooks/useAuthSession";

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { profile, user } = useAuthSession();
  const displayName =
    profile?.full_name || user?.email || "Admin";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F9F7F4",
        padding: "24px",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "grid",
          gap: "20px",
        }}
      >
        <AppNav />

        <div style={{ display: "grid", gap: "6px" }}>
          <h1 style={{ margin: 0, color: "#333333" }}>
            Admin Dashboard
          </h1>
          <div style={{ color: "#666666" }}>
            Welcome, {displayName}. Access admin operations, users, and account controls.
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "14px",
          }}
        >
          <DashboardShortcutCard
            title="Manage Orders"
            description="Open the internal order operations page and review tracked orders."
            onClick={() => navigate("/admin/orders")}
          />

          <DashboardShortcutCard
            title="Manage Users"
            description="Update roles, control application access, and review administrative user operations."
            onClick={() => navigate("/admin/users")}
          />

          <DashboardShortcutCard
            title="Go to Account"
            description="Review your profile details and sign out securely."
            onClick={() => navigate("/account")}
          />
        </div>
      </div>
    </div>
  );
}