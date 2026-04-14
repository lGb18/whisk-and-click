function formatDateTime(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  
  // I matched this format to the one we used in OrderDetailsPage so the UI stays consistent
  return date.toLocaleString('en-US', { 
    month: 'short', day: 'numeric', year: 'numeric', 
    hour: 'numeric', minute: '2-digit' 
  });
}

export default function PaymentSummaryCard({ payment, proofUrl = "" }) {
  if (!payment) {
    return (
      <div style={{ color: "var(--text-secondary)", padding: "var(--space-sm) 0" }}>
        No payment record available yet.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
      
      {/* Clean, receipt-style grid matching KeyValueGrid */}
      <div style={{ display: "grid", gap: "8px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>Method</span>
          <span style={{ color: "var(--text-secondary)", textTransform: "capitalize" }}>
            {payment.payment_method.replace(/_/g, ' ')}
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>Status</span>
          <span style={{ color: "var(--text-secondary)", textTransform: "capitalize" }}>
            {payment.payment_status}
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>Reference</span>
          <span style={{ color: "var(--text-secondary)" }}>{payment.reference_number || "—"}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>Created</span>
          <span style={{ color: "var(--text-secondary)" }}>{formatDateTime(payment.created_at)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>Reviewed</span>
          <span style={{ color: "var(--text-secondary)" }}>{formatDateTime(payment.reviewed_at)}</span>
        </div>
      </div>

      {/* Notes Section - Visually grouped in a muted box */}
      {(payment.notes || payment.review_note) && (
        <div style={{
          backgroundColor: "var(--surface-muted)",
          padding: "var(--space-md)",
          borderRadius: "var(--radius-input)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-sm)"
        }}>
          {payment.notes && (
            <div>
              <span style={{ display: "block", fontSize: "13px", color: "var(--text-secondary)", fontWeight: "600" }}>Customer Note:</span>
              <p style={{ margin: "2px 0 0 0", color: "var(--text-primary)" }}>{payment.notes}</p>
            </div>
          )}
          {payment.review_note && (
            <div>
              <span style={{ display: "block", fontSize: "13px", color: "var(--text-secondary)", fontWeight: "600" }}>Review Note:</span>
              <p style={{ margin: "2px 0 0 0", color: "var(--text-primary)" }}>{payment.review_note}</p>
            </div>
          )}
        </div>
      )}

      {/* Proof Image Area */}
      <div style={{ marginTop: "var(--space-xs)" }}>
        <span style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "var(--space-sm)" }}>
          Payment Proof
        </span>
        {proofUrl ? (
          <img
            src={proofUrl}
            alt="Uploaded payment proof"
            style={{
              width: "100%",
              maxWidth: "420px",
              borderRadius: "var(--radius-card)",
              border: "1px solid var(--border)",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              minHeight: "140px",
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
            No payment proof uploaded
          </div>
        )}
      </div>
    </div>
  );
}