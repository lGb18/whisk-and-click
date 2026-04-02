export default function AccountSummaryCard({ profile, user, role }) {
  const email = profile?.email || user?.email || "—";
  const fullName = profile?.full_name || "Not set";
  const accessLabel = profile?.is_active === false ? "Disabled" : "Active";

  return (
    <div
      style={{
        display: "grid",
        gap: "12px",
        padding: "18px",
        borderRadius: "16px",
        background: "#FFFFFF",
        border: "1px solid #ECECEC",
      }}
    >
      <div style={{ display: "grid", gap: "6px" }}>
        <div style={{ color: "#666666" }}>Full Name</div>
        <div style={{ fontWeight: 700, color: "#333333" }}>{fullName}</div>
      </div>

      <div style={{ display: "grid", gap: "6px" }}>
        <div style={{ color: "#666666" }}>Email</div>
        <div style={{ color: "#333333" }}>{email}</div>
      </div>

      <div style={{ display: "grid", gap: "6px" }}>
        <div style={{ color: "#666666" }}>Role</div>
        <div style={{ color: "#333333", fontWeight: 600 }}>{role}</div>
      </div>

      <div style={{ display: "grid", gap: "6px" }}>
        <div style={{ color: "#666666" }}>Access State</div>
        <div style={{ color: "#333333", fontWeight: 600 }}>{accessLabel}</div>
      </div>

      {profile?.created_at ? (
        <div style={{ display: "grid", gap: "6px" }}>
          <div style={{ color: "#666666" }}>Created</div>
          <div style={{ color: "#333333" }}>
            {new Date(profile.created_at).toLocaleString()}
          </div>
        </div>
      ) : null}
    </div>
  );
}