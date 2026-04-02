import { getOrderReferencePreview } from "../utils/mediaHelpers";

export default function OrderReferencePreview({ order }) {
  const preview = getOrderReferencePreview(order);

  if (!preview.hasImage) {
    return (
      <div
        style={{
          width: "100%",
          minHeight: "180px",
          display: "grid",
          placeItems: "center",
          borderRadius: "14px",
          border: "1px dashed #D8D8D8",
          background: "#FAFAFA",
          color: "#777777",
          textAlign: "center",
          padding: "16px",
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
        borderRadius: "14px",
        border: "1px solid #EEEEEE",
        objectFit: "cover",
      }}
    />
  );
}