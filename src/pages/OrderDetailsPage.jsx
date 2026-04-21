import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import AppShell from "../components/AppShell";
import OrderReferencePreview from "../components/OrderReferencePreview";
import OrderStatusBadge from "../components/OrderStatusBadge";
import OrderTimeline from "../components/OrderTimeline";
import SectionCard from "../components/SectionCard";
import StatusUpdatePanel from "../components/StatusUpdatePanel";
import PaymentSummaryCard from "../components/PaymentSummaryCard";
import PaymentReviewPanel from "../components/PaymentReviewPanel";
import { ErrorStateCard, LoadingStateCard } from "../components/PageState";
import { fetchOrderById } from "../utils/orderQueries";
import { fetchPaymentByOrderId, getPaymentProofSignedUrl } from "../utils/paymentQueries";
import { getStatusLabel } from "../utils/orderStatusConfig";
import { useAuthSession } from "../hooks/useAuthSession";

// Translates the 1-9 math vectors
function translateVectorConfig(config) {
  if (!config) return {};
  
  const translated = {};
  
  if (config.form_factor) {
    if (config.form_factor <= 3) translated["Cake Structure"] = "Bento or Cupcakes";
    else if (config.form_factor >= 8) translated["Cake Structure"] = "Multi-Tier or Custom Shape";
    else translated["Cake Structure"] = "Standard Round or Square";
  }

  if (config.complexity) {
    if (config.complexity <= 3) translated["Design Complexity"] = "Minimalist";
    else if (config.complexity >= 8) translated["Design Complexity"] = "Highly Intricate / 3D";
    else translated["Design Complexity"] = "Detailed / Piped / Loaded";
  }

  if (config.aesthetic) {
    if (config.aesthetic <= 3) translated["Theme Vibe"] = "Elegant & Formal";
    else if (config.aesthetic >= 8) translated["Theme Vibe"] = "Playful & Loud";
    else translated["Theme Vibe"] = "Casual & Classic";
  }

  if (config.flavor) {
    if (config.flavor <= 3) translated["Base Flavor"] = "Classic (Vanilla/Chocolate)";
    else if (config.flavor >= 8) translated["Base Flavor"] = "Premium (Yema/Red Velvet)";
    else translated["Base Flavor"] = "Specialty";
  }

  if (config.primary_color) {
    translated["Primary Color"] = config.primary_color;
  }

  Object.keys(config).forEach(key => {
    if (!['form_factor', 'complexity', 'aesthetic', 'flavor', 'primary_color'].includes(key)) {
      translated[key] = config[key];
    }
  });

  return translated;
}
function formatDateTime(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  
  // Format to look like: "Feb 12, 2025, 3:30 PM"
  return date.toLocaleString('en-US', { 
    month: 'short', day: 'numeric', year: 'numeric', 
    hour: 'numeric', minute: '2-digit' 
  });
}

// UI Polish: Make the grid look like a clean receipt
function KeyValueGrid({ data }) {
  const entries = Object.entries(data ?? {}).filter(
    ([, value]) =>
      value !== null &&
      value !== undefined &&
      value !== "" &&
      !(typeof value === "object" && Object.keys(value).length === 0)
  );

  if (!entries.length) {
    return <p style={{ color: "var(--text-secondary)", margin: 0 }}>No additional details provided.</p>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {entries.map(([key, value]) => (
        <div
          key={key}
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingBottom: "8px",
            borderBottom: "1px solid var(--border)",
            alignItems: "flex-start",
            gap: "var(--space-md)"
          }}
        >
          <span style={{ fontWeight: 600, color: "var(--text-primary)", textTransform: "capitalize", minWidth: "120px" }}>
            {key.replace(/_/g, " ")}
          </span>
          <span style={{ color: "var(--text-secondary)", textAlign: "right", whiteSpace: "pre-wrap" }}>
            {typeof value === "object" ? JSON.stringify(value, null, 2) : String(value)}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { role } = useAuthSession();

  const canManageStatus = role === "staff" || role === "admin";

  const { 
    data: order, 
    isLoading: isOrderLoading, 
    isError: isOrderError, 
    error: orderError 
  } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => fetchOrderById(orderId),
    enabled: !!orderId,
  });

  const {
    data: paymentData,
    isLoading: isPaymentLoading,
  } = useQuery({
    queryKey: ['payment', orderId],
    queryFn: async () => {
      try {
        const payment = await fetchPaymentByOrderId(orderId);
        let proofUrl = "";
        if (payment?.proof_path) {
          proofUrl = await getPaymentProofSignedUrl(payment.proof_path, 3600);
        }
        return { payment, proofUrl };
      } catch (err) {
        return { payment: null, proofUrl: "" };
      }
    },
    enabled: !!orderId,
  });

  const payment = paymentData?.payment || null;
  const paymentProofUrl = paymentData?.proofUrl || "";

  const sourceLabel = useMemo(() => {
    if (!order?.reference_source) return "—";
    if (order.reference_source === "recommendation") return "Bakeshop";
    if (order.reference_source === "fallback_ai") return "Custom";
    return order.reference_source;
  }, [order]);

  const handlePaymentReviewed = () => {
    queryClient.invalidateQueries({ queryKey: ['payment', orderId] });
  };

  return (
    <AppShell
      title="Order Summary"
      subtitle={order ? `Order Ref: #${order.id.split('-')[0].toUpperCase()}` : "Review order details and tracking."}
    >
      {/* Top Action Bar */}
      <div style={{ marginBottom: "var(--space-md)" }}>
        <button className="secondary-button" onClick={() => navigate(-1)}>
          &larr; Back to List
        </button>
      </div>

      {isOrderError && <ErrorStateCard message={orderError?.message || "Failed to load order"} />}

      {isOrderLoading ? (
        <LoadingStateCard message="Loading order details..." />
      ) : !order ? (
        <ErrorStateCard message="Order not found." />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xl)" }}>
          
          {/* Header Banner */}
          <div className="card" style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            gap: "var(--space-md)", 
            alignItems: "center", 
            flexWrap: "wrap",
            padding: "var(--space-lg)" 
          }}>
            <div>
              <p className="caption" style={{ margin: "0 0 4px 0" }}>Current Status</p>
              <h2 style={{ fontSize: "var(--font-h2-size)", margin: 0 }}>{getStatusLabel(order.status)}</h2>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "var(--space-xl)", alignItems: "start" }}>
            
            {/* LEFT COLUMN: Data grids */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xl)" }}>
              <SectionCard title="Order Details">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-sm)", marginBottom: "var(--space-lg)" }}>
                  <div style={{ padding: "var(--space-sm)", borderRadius: "var(--radius-card)", backgroundColor: "var(--surface-muted)" }}>
                    <p className="caption" style={{ margin: "0 0 2px 0" }}>Source</p>
                    <p style={{ margin: 0, fontWeight: 600 }}>{sourceLabel}</p>
                  </div>
                  <div style={{ padding: "var(--space-sm)", borderRadius: "var(--radius-card)", backgroundColor: "var(--surface-muted)" }}>
                    <p className="caption" style={{ margin: "0 0 2px 0" }}>Date Placed</p>
                    <p style={{ margin: 0, fontWeight: 600 }}>{formatDateTime(order.created_at)}</p>
                  </div>
                </div>

                {order.cancel_reason && (
                  <div className="alert alert-error" style={{ marginBottom: "var(--space-md)" }}>
                    <strong>Cancel Reason:</strong> {order.cancel_reason}
                  </div>
                )}
                
                <h4 style={{ margin: "0 0 var(--space-sm) 0", fontSize: "16px" }}>Checkout Information</h4>
                <KeyValueGrid data={order.checkout_details} />
              </SectionCard>

              <SectionCard title="Cake Configuration">
                <KeyValueGrid data={{ ...translateVectorConfig(order.cake_config), ...order.customization }} />
              </SectionCard>
            </div>

            {/* RIGHT COLUMN: Operational info & timeline */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xl)" }}>
              {canManageStatus && (
                <StatusUpdatePanel orderId={order.id} currentStatus={order.status} />
              )}

              <SectionCard title="Payment Information">
                {isPaymentLoading ? (
                  <p style={{ color: "var(--text-secondary)" }}>Loading payment details...</p>
                ) : (
                  <PaymentSummaryCard payment={payment} proofUrl={paymentProofUrl} />
                )}
              </SectionCard>

              {canManageStatus && payment && (
                <SectionCard title="Payment Review">
                  <PaymentReviewPanel payment={payment} onReviewed={handlePaymentReviewed} />
                </SectionCard>
              )}

              <SectionCard title="Status Timeline">
                <OrderTimeline history={order.order_status_history ?? []} />
              </SectionCard>

              <SectionCard title="Visual Reference">
                <OrderReferencePreview order={order} />
              </SectionCard>
            </div>

          </div>
        </div>
      )}
    </AppShell>
  );
}