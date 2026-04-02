import OrderStatusBadge from "./OrderStatusBadge";

function formatDateTime(value) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString();
}

export default function OrderSummaryCard({
  order,
  onViewDetails,
  extraActions = null,
}) {
  return (
    <div
      style={{
        display: "grid",
        gap: "12px",
        padding: "18px",
        borderRadius: "16px",
        background: "#FFFFFF",
        border: "1px solid #ECECEC",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "12px",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <div style={{ display: "grid", gap: "4px" }}>
          <div style={{ fontWeight: 700, color: "#333333" }}>
            Order {order.id}
          </div>
          <div style={{ color: "#666666" }}>
            Source: {order.reference_source || "—"}
          </div>
          <div style={{ color: "#666666" }}>
            Created: {formatDateTime(order.created_at)}
          </div>
          {order.user_id ? (
            <div style={{ color: "#666666" }}>
              User: {order.user_id}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <OrderStatusBadge status={order.status} />

          {onViewDetails ? (
            <button
              onClick={() => onViewDetails(order)}
              style={{
                padding: "10px 14px",
                borderRadius: "10px",
                border: "none",
                background: "#E25D4D",
                color: "#FFFFFF",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              View Details
            </button>
          ) : null}

          {extraActions}
        </div>
      </div>
    </div>
  );
}