import { useNavigate } from "react-router-dom";
import AppNav from "../components/AppNav";
import DashboardShortcutCard from "../components/DashboardShortcutCard";
import { useAuthSession } from "../hooks/useAuthSession";

export default function CustomerDashboardPage() {
  const navigate = useNavigate();
  const { profile, user } = useAuthSession();

  const displayName =
    profile?.full_name || user?.email || "Customer";

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

        <div
          style={{
            display: "grid",
            gap: "6px",
          }}
        >
          <h1 style={{ margin: 0, color: "#333333" }}>
            Welcome, {displayName}
          </h1>
          <div style={{ color: "#666666" }}>
            Start a new order, check your existing orders, or manage your account.
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
            title="Start New Cake Order"
            description="Begin the guided ordering flow using the recommendation-first process."
            onClick={() => navigate("/wizard")}
          />

          <DashboardShortcutCard
            title="View My Orders"
            description="Check your placed orders, current statuses, and tracking details."
            onClick={() => navigate("/my-orders")}
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