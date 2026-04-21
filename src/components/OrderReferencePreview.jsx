import { getOrderReferencePreview } from "../utils/mediaHelpers";

export default function OrderReferencePreview({ order, blueprints = [] }) {
  
  const preview = getOrderReferencePreview(order, blueprints);

  if (!preview.hasImage) {
    return (
      <div style={{ padding: "24px", textAlign: "center", backgroundColor: "var(--surface-muted)", borderRadius: "8px" }}>
        <p style={{ color: "var(--text-secondary)" }}>{preview.fallbackLabel}</p>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", borderRadius: "8px", overflow: "hidden", backgroundColor: "var(--surface-muted)" }}>
      <img 
        src={preview.imageUrl} 
        alt={preview.alt} 
        style={{ width: "100%", height: "auto", display: "block", objectFit: "cover" }} 
      />
    </div>
  );
}