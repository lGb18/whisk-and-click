import { useState } from "react";
import { reviewPayment } from "../utils/paymentQueries";

export default function PaymentReviewPanel({ payment, onReviewed }) {
  const [reviewNote, setReviewNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!payment) return null;

  async function handleReview(nextStatus) {
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await reviewPayment({
        paymentId: payment.id,
        newStatus: nextStatus,
        reviewNote,
      });

      setReviewNote("");
      await onReviewed?.();
    } catch (error) {
      setErrorMessage(error?.message ?? "Failed to review payment.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const canReview =
    payment.payment_status === "pending_verification" ||
    payment.payment_status === "unpaid";

  if (!canReview) {
    return null;
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
        Review Payment
      </h2>

      <textarea
        value={reviewNote}
        onChange={(e) => setReviewNote(e.target.value)}
        placeholder="Optional review note"
        rows={3}
        style={{
          padding: "12px 14px",
          borderRadius: "10px",
          border: "1px solid #D8D8D8",
          background: "#FFFFFF",
          resize: "vertical",
        }}
      />

      {errorMessage ? (
        <div
          style={{
            padding: "12px 14px",
            borderRadius: "10px",
            background: "#FDEDED",
            color: "#B3261E",
            border: "1px solid #F5C2C0",
          }}
        >
          {errorMessage}
        </div>
      ) : null}

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => handleReview("paid")}
          style={{
            padding: "12px 16px",
            borderRadius: "10px",
            border: "none",
            background: "#4CAF50",
            color: "#FFFFFF",
            fontWeight: 600,
            cursor: isSubmitting ? "not-allowed" : "pointer",
          }}
        >
          Mark Paid
        </button>

        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => handleReview("rejected")}
          style={{
            padding: "12px 16px",
            borderRadius: "10px",
            border: "none",
            background: "#D32F2F",
            color: "#FFFFFF",
            fontWeight: 600,
            cursor: isSubmitting ? "not-allowed" : "pointer",
          }}
        >
          Reject Payment
        </button>
      </div>
    </div>
  );
}