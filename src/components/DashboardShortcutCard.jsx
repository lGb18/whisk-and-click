// components/DashboardShortcutCard.jsx
export default function DashboardShortcutCard({ title, description, onClick, primary }) {
  return (
    <button
      className="card"
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        textAlign: "left",
        padding: "var(--space-xl)",
        border: primary ? "2px solid var(--primary)" : "1px solid transparent",
        cursor: "pointer",
        background: "var(--surface)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        height: "100%",
      }}
      // Adds the hover lift effect cleanly via inline events, 
      // though CSS classes are better if you have them!
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "var(--shadow-card)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "var(--shadow-card-soft)";
      }}
    >
      <h3 style={{ 
        fontSize: "var(--font-h3-size)", 
        margin: "0 0 var(--space-xs) 0",
        color: primary ? "var(--primary)" : "var(--text-primary)"
      }}>
        {title}
      </h3>
      <p style={{ 
        margin: 0, 
        color: "var(--text-secondary)", 
        fontSize: "var(--font-body-size)",
        lineHeight: "var(--font-body-line)"
      }}>
        {description}
      </p>
      
      <div style={{ 
        marginTop: "auto", 
        paddingTop: "var(--space-lg)", 
        color: "var(--primary)",
        fontWeight: "600",
        fontSize: "14px",
        display: "flex",
        alignItems: "center",
        gap: "4px"
      }}>
        Get Started <span aria-hidden="true">&rarr;</span>
      </div>
    </button>
  );
}