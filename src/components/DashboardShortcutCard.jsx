export default function DashboardShortcutCard({
  title,
  description,
  onClick,
  disabled = false,
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "grid",
        gap: "8px",
        textAlign: "left",
        padding: "18px",
        borderRadius: "16px",
        border: "1px solid #ECECEC",
        background: "#FFFFFF",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.7 : 1,
      }}
    >
      <div
        style={{
          fontSize: "1rem",
          fontWeight: 700,
          color: "#333333",
        }}
      >
        {title}
      </div>

      <div
        style={{
          color: "#666666",
          lineHeight: 1.5,
        }}
      >
        {description}
      </div>
    </button>
  );
}