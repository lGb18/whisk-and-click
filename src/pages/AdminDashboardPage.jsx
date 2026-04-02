import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import DashboardShortcutCard from "../components/DashboardShortcutCard";
import { useAuthSession } from "../hooks/useAuthSession";

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { profile, user } = useAuthSession();

  const displayName = profile?.full_name || user?.email || "Admin";

  return (
    <AppShell
      title="Admin Dashboard"
      subtitle={`Welcome, ${displayName}. Access admin operations, users, and account controls.`}
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
          description="Open the internal order operations page and review tracked orders."
          onClick={() => navigate("/admin/orders")}
        />

        <DashboardShortcutCard
          title="Manage Users"
          description="Update roles, access state, and internal account operations."
          onClick={() => navigate("/admin/users")}
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