import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppShell from "../components/AppShell";
import OrderReferencePreview from "../components/OrderReferencePreview";
import OrderStatusBadge from "../components/OrderStatusBadge";
import OrderTimeline from "../components/OrderTimeline";
import SectionCard from "../components/SectionCard";
import StatusUpdatePanel from "../components/StatusUpdatePanel";
import { ErrorStateCard, LoadingStateCard } from "../components/PageState";
import { fetchOrderById } from "../utils/orderQueries";
import { getStatusLabel } from "../utils/orderStatusConfig";
import { useAuthSession } from "../hooks/useAuthSession";
import PaymentSummaryCard from "../components/PaymentSummaryCard";
import PaymentReviewPanel from "../components/PaymentReviewPanel";
import { fetchPaymentByOrderId, getPaymentProofSignedUrl } from "../utils/paymentQueries";

function formatDateTime(value) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString();
}

function KeyValueGrid({ data }) {
  const entries = Object.entries(data ?? {}).filter(
    ([, value]) =>
      value !== null &&
      value !== undefined &&
      value !== "" &&
      !(typeof value === "object" && Object.keys(value).length === 0)
  );

  if (!entries.length) {
    return <div style={{ color: "#666666" }}>No data available.</div>;
  }

  return (
    <div style={{ display: "grid", gap: "10px" }}>
      {entries.map(([key, value]) => (
        <div
          key={key}
          style={{
            display: "grid",
            gridTemplateColumns: "180px 1fr",
            gap: "12px",
            alignItems: "start",
            paddingBottom: "10px",
            borderBottom: "1px solid #F3F3F3",
          }}
        >
          <div
            style={{
              fontWeight: 600,
              color: "#444444",
              textTransform: "capitalize",
            }}
          >
            {key.replace(/_/g, " ")}
          </div>

          <div style={{ color: "#555555", whiteSpace: "pre-wrap" }}>
            {typeof value === "object"
              ? JSON.stringify(value, null, 2)
              : String(value)}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  // Ensure useAuthSession is properly imported in your actual file
  const { role, reloadProfile } = useAuthSession();

  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // 1. ADDED PAYMENT STATE HERE (inside the component)
  const [payment, setPayment] = useState(null);
  const [paymentProofUrl, setPaymentProofUrl] = useState("");

  const canManageStatus = role === "staff" || role === "admin";

  const loadOrder = useCallback(async () => {
    if (!orderId) return;

    setIsLoading(true);
    setErrorMessage("");

    try {
      // Ensure fetchOrderById is imported at the top of your file
      const data = await fetchOrderById(orderId);
      setOrder(data);
    } catch (error) {
      setErrorMessage(error?.message ?? "Failed to load order details.");
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  // 2. MOVED loadPayment INSIDE THE COMPONENT (so it can access states & orderId)
  const loadPayment = useCallback(async () => {
    if (!orderId) return;

    try {
      const paymentData = await fetchPaymentByOrderId(orderId);
      setPayment(paymentData);

      if (paymentData?.proof_path) {
        const signedUrl = await getPaymentProofSignedUrl(paymentData.proof_path, 3600);
        setPaymentProofUrl(signedUrl);
      } else {
        setPaymentProofUrl("");
      }
    } catch {
      setPayment(null);
      setPaymentProofUrl("");
    }
  }, [orderId]);

  useEffect(() => {
    loadOrder();
    loadPayment();
  }, [loadOrder, loadPayment]); // Added loadPayment to dependency array

  const sourceLabel = useMemo(() => {
    if (!order?.reference_source) return "—";

    if (order.reference_source === "recommendation") return "Recommendation";
    if (order.reference_source === "fallback_ai") return "Fallback AI";

    return order.reference_source;
  }, [order]);

  return (
    <AppShell
      title="Order Details"
      subtitle={order ? `Order ID: ${order.id}` : "Review order details and tracking."}
    >
      <button
        onClick={() => navigate("/my-orders")}
        style={{
          width: "fit-content",
          padding: "8px 12px",
          borderRadius: "10px",
          border: "1px solid #DDDDDD",
          background: "#FFFFFF",
          color: "#333333",
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        Back to My Orders
      </button>

      {errorMessage ? <ErrorStateCard message={errorMessage} /> : null}

      {isLoading ? (
        <LoadingStateCard message="Loading order details..." />
      ) : !order ? (
        <ErrorStateCard message="Order not found." />
      ) : (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "16px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div style={{ color: "#666666" }}>
              Current status: {getStatusLabel(order.status)}
            </div>
            <OrderStatusBadge status={order.status} />
          </div>

          <SectionCard title="Order Overview">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "12px",
              }}
            >
              <div style={{ padding: "14px", borderRadius: "12px", background: "#FAFAFA" }}>
                <div style={{ color: "#666666", marginBottom: "6px" }}>Source</div>
                <div style={{ fontWeight: 600, color: "#333333" }}>{sourceLabel}</div>
              </div>

              <div style={{ padding: "14px", borderRadius: "12px", background: "#FAFAFA" }}>
                <div style={{ color: "#666666", marginBottom: "6px" }}>Created At</div>
                <div style={{ fontWeight: 600, color: "#333333" }}>
                  {formatDateTime(order.created_at)}
                </div>
              </div>

              <div style={{ padding: "14px", borderRadius: "12px", background: "#FAFAFA" }}>
                <div style={{ color: "#666666", marginBottom: "6px" }}>Status Updated</div>
                <div style={{ fontWeight: 600, color: "#333333" }}>
                  {formatDateTime(order.status_updated_at)}
                </div>
              </div>
            </div>

            {order.cancel_reason ? (
              <ErrorStateCard message={`Cancel Reason: ${order.cancel_reason}`} />
            ) : null}
          </SectionCard>

          {canManageStatus ? (
            <StatusUpdatePanel
              orderId={order.id}
              currentStatus={order.status}
              onUpdated={loadOrder}
            />
          ) : null}

          <SectionCard title="Reference Preview">
            <OrderReferencePreview order={order} />
          </SectionCard>

          <SectionCard title="Status Timeline">
            <OrderTimeline history={order.order_status_history ?? []} />
          </SectionCard>

          <SectionCard title="Reference Information">
            <KeyValueGrid
              data={{
                reference_source: order.reference_source,
                cake_reference_id: order.cake_reference_id,
                fallback_prompt: order.fallback_prompt,
              }}
            />
          </SectionCard>
          <SectionCard title="Payment">
          <PaymentSummaryCard payment={payment} proofUrl={paymentProofUrl} />
        </SectionCard>

        {canManageStatus ? (
          <SectionCard title="Payment Review">
            <PaymentReviewPanel
              payment={payment}
              onReviewed={loadPayment}
            />
          </SectionCard>
        ) : null}
          <SectionCard title="Cake Configuration">
            <KeyValueGrid data={order.cake_config} />
          </SectionCard>

          <SectionCard title="Customization">
            <KeyValueGrid data={order.customization} />
          </SectionCard>

          <SectionCard title="Checkout Details">
            <KeyValueGrid data={order.checkout_details} />
          </SectionCard>
        </>
      )}
    </AppShell>
  );
}