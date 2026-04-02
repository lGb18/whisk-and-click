export default function SectionCard({ title, children }) {
  return (
    <section
      style={{
        display: "grid",
        gap: "12px",
        padding: "18px",
        borderRadius: "16px",
        background: "#FFFFFF",
        border: "1px solid #EEEEEE",
      }}
    >
      {title ? (
        <h2
          style={{
            margin: 0,
            fontSize: "1.05rem",
            color: "#333333",
          }}
        >
          {title}
        </h2>
      ) : null}

      {children}
    </section>
  );
}