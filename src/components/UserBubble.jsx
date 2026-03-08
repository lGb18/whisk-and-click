export default function UserBubble({ text }) {
  return (
    <div
      style={{
        maxWidth: "420px",
        background: "var(--primary)",
        color: "#fff",
        borderRadius: "14px",
        padding: "12px 16px",
        marginLeft: "auto"
      }}
    >
      {text}
    </div>
  );
}