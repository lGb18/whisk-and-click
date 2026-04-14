import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import DashboardShortcutCard from "../components/DashboardShortcutCard";
import { useAuthSession } from "../hooks/useAuthSession";

export default function CustomerDashboardPage() {
  const navigate = useNavigate();
  const { profile, user } = useAuthSession();

  // Prefer first name for a friendlier greeting if possible
  const firstName = profile?.full_name?.split(" ")[0] || "there";

  return (
    <AppShell
      title={`Hi, ${firstName}!`}
      subtitle="Start a new order, check your history, or manage your account."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", // Increased min-width for better text wrapping
          gap: "var(--space-lg)",
        }}
      >
        <DashboardShortcutCard
          primary={true} // Makes this card pop!
          title="Start New Cake Order"
          description="Begin the guided recommendation-first ordering flow to design your perfect cake."
          onClick={() => navigate("/wizard")}
        />

        <DashboardShortcutCard
          title="View My Orders"
          description="Review your order history, check statuses, and track active requests."
          onClick={() => navigate("/my-orders")}
        />

        <DashboardShortcutCard
          title="Account Settings"
          description="Update your contact details, delivery addresses, and secure your account."
          onClick={() => navigate("/account")}
        />
      </div>
    </AppShell>
  );
}