export default function SystemBubble({ text }) {
  return (
    <div
      style={{
        maxWidth: "520px",
        background: "#fff",
        border: "1px solid #e7e1dc",
        borderRadius: "14px",
        padding: "12px 16px"
      }}
    >
      {text}
    </div>
  );
}