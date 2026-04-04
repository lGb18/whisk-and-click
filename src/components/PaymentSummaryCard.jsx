function formatDateTime(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString();
}

export default function PaymentSummaryCard({ payment, proofUrl = "" }) {
  if (!payment) {
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
        <div style={{ color: "#666666" }}>No payment record available yet.</div>
      </div>
    );
  }

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
      <h2 style={{ margin: 0, color: "#333333", fontSize: "1.05rem" }}>
        Payment Summary
      </h2>

      <div style={{ color: "#333333" }}><strong>Method:</strong> {payment.payment_method}</div>
      <div style={{ color: "#333333" }}><strong>Status:</strong> {payment.payment_status}</div>
      <div style={{ color: "#333333" }}><strong>Reference:</strong> {payment.reference_number || "—"}</div>
      <div style={{ color: "#333333" }}><strong>Created:</strong> {formatDateTime(payment.created_at)}</div>
      <div style={{ color: "#333333" }}><strong>Reviewed:</strong> {formatDateTime(payment.reviewed_at)}</div>

      {payment.notes ? (
        <div style={{ color: "#555555", whiteSpace: "pre-wrap" }}>
          <strong>Customer Note:</strong> {payment.notes}
        </div>
      ) : null}

      {payment.review_note ? (
        <div style={{ color: "#555555", whiteSpace: "pre-wrap" }}>
          <strong>Review Note:</strong> {payment.review_note}
        </div>
      ) : null}

      {proofUrl ? (
        <img
          src={proofUrl}
          alt="Payment proof"
          style={{
            width: "100%",
            maxWidth: "420px",
            borderRadius: "14px",
            border: "1px solid #EEEEEE",
            objectFit: "cover",
          }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            minHeight: "140px",
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
          No payment proof uploaded
        </div>
      )}
    </div>
  );
}