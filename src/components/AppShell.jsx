import AppNav from "./AppNav";

export default function AppShell({ title, subtitle, children }) {
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
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gap: "20px",
        }}
      >
        <AppNav />

        {(title || subtitle) && (
          <div style={{ display: "grid", gap: "6px" }}>
            {title ? (
              <h1 style={{ margin: 0, color: "#333333" }}>{title}</h1>
            ) : null}
            {subtitle ? (
              <div style={{ color: "#666666" }}>{subtitle}</div>
            ) : null}
          </div>
        )}

        {children}
      </div>
    </div>
  );
}