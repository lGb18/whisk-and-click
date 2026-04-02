import { useNavigate } from "react-router-dom";
import AppNav from "../components/AppNav";
import DashboardShortcutCard from "../components/DashboardShortcutCard";
import { useAuthSession } from "../hooks/useAuthSession";

export default function StaffDashboardPage() {
  const navigate = useNavigate();
  const { profile, user } = useAuthSession();

  const displayName =
    profile?.full_name || user?.email || "Staff";

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
            Staff Dashboard
          </h1>
          <div style={{ color: "#666666" }}>
            Welcome, {displayName}. Review operational orders and manage status progression.
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
            description="Open the internal order operations page and continue valid lifecycle transitions."
            onClick={() => navigate("/admin/orders")}
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