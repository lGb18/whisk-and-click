import AppNav from "./AppNav";

export default function AppShell({ title, subtitle, children }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)", // Using theme variable
        padding: "var(--space-xl) var(--space-lg)",
      }}
    >
      <div
        style={{
          maxWidth: "var(--content-max-width)",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-2xl)",
        }}
      >
        <AppNav />

        {(title || subtitle) && (
          <header style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
            {title && (
              <h1 style={{ 
                margin: 0, 
                color: "var(--text-primary)", 
                fontFamily: "var(--font-heading)",
                fontSize: "var(--font-h1-size)",
                fontWeight: "var(--font-h1-weight)"
              }}>
                {title}
              </h1>
            )}
            {subtitle && (
              <p style={{ 
                margin: 0,
                color: "var(--text-secondary)", 
                fontSize: "var(--font-body-size)" 
              }}>
                {subtitle}
              </p>
            )}
          </header>
        )}

        <main>
          {children}
        </main>
      </div>
    </div>
  );
}