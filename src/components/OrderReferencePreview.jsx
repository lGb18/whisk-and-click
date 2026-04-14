import { getOrderReferencePreview } from "../utils/mediaHelpers";

export default function OrderReferencePreview({ order }) {
  const preview = getOrderReferencePreview(order);

  if (!preview.hasImage) {
    return (
      <div
        style={{
          width: "100%",
          minHeight: "180px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "var(--radius-card)",
          border: "2px dashed var(--border)",
          backgroundColor: "var(--surface-muted)",
          color: "var(--text-secondary)",
          textAlign: "center",
          padding: "var(--space-md)",
        }}
      >
        {preview.fallbackLabel}
      </div>
    );
  }

  return (
    <img
      src={preview.imageUrl}
      alt={preview.alt}
      style={{
        width: "100%",
        maxWidth: "420px",
        borderRadius: "var(--radius-card)",
        border: "1px solid var(--border)",
        objectFit: "cover",
        boxShadow: "var(--shadow-card-soft)",
      }}
      onError={(e) => {
        // Ultimate fallback if the image path is broken
        e.target.src = "/assets/placeholder.png"; 
        e.target.style.objectFit = "contain";
      }}
    />
  );
}