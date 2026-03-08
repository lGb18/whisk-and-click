export default function PageHeader({ title, subtitle }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h1 className="page-title">{title}</h1>
      <p className="page-subtitle">{subtitle}</p>
    </div>
  );
}