export default function RoleBadge({ role }) {
  const styles = {
    customer: {
      background: "#F3F3F3",
      color: "#444444",
      border: "#DDDDDD",
    },
    staff: {
      background: "#E8F3FF",
      color: "#1F5FAF",
      border: "#B9D8FF",
    },
    admin: {
      background: "#FDEDED",
      color: "#B3261E",
      border: "#F5C2C0",
    },
  };

  const current = styles[role] ?? styles.customer;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "6px 12px",
        borderRadius: "999px",
        fontSize: "0.85rem",
        fontWeight: 600,
        background: current.background,
        color: current.color,
        border: `1px solid ${current.border}`,
      }}
    >
      {role}
    </span>
  );
}