import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import DashboardShortcutCard from "../components/DashboardShortcutCard";
import { useAuthSession } from "../hooks/useAuthSession";

export default function CustomerDashboardPage() {
  const navigate = useNavigate();
  const { profile, user } = useAuthSession();

  const displayName = profile?.full_name || user?.email || "Customer";

  return (
    <AppShell
      title={`Welcome, ${displayName}`}
      subtitle="Start a new order, check your orders, or manage your account."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "14px",
        }}
      >
        <DashboardShortcutCard
          title="Start New Cake Order"
          description="Begin the guided recommendation-first ordering flow."
          onClick={() => navigate("/wizard")}
        />

        <DashboardShortcutCard
          title="View My Orders"
          description="Review your order history, statuses, and tracking details."
          onClick={() => navigate("/my-orders")}
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