import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import DashboardShortcutCard from "../components/DashboardShortcutCard";
import { useAuthSession } from "../hooks/useAuthSession";

export default function StaffDashboardPage() {
  const navigate = useNavigate();
  const { profile, user } = useAuthSession();

  const displayName = profile?.full_name || user?.email || "Staff";

  return (
    <AppShell
      title="Staff Dashboard"
      subtitle={`Welcome, ${displayName}. Manage operational orders and account access.`}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "14px",
        }}
      >
        <DashboardShortcutCard
          title="Manage Orders"
          description="Open the operational order page and continue valid lifecycle transitions."
          onClick={() => navigate("/admin/orders")}
        />

        <DashboardShortcutCard
          title="Go to Account"
          description="Review your account details and sign out securely."
          onClick={() => navigate("/account")}
        />
      </div>
    </AppShell>
  );
}