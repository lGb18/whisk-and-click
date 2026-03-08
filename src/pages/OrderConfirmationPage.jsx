import { useNavigate } from "react-router-dom";
import { useAppFlow } from "../state/AppFlow";
import PageHeader from "../components/PageHeader";
import PrimaryButton from "../components/PrimaryButton";

export default function OrderConfirmationPage() {
  const navigate = useNavigate();
  const { createdOrder, resetFlow } = useAppFlow();

  if (!createdOrder) {
    return (
      <div className="page-shell">
        <div className="container-summary">
          <PageHeader
            title="No order found"
            subtitle="Please complete the recommendation flow first."
          />
        </div>
      </div>
    );
  }

  function handleStartOver() {
    resetFlow();
    navigate("/");
  }

  return (
    <div className="page-shell">
      <div className="container-summary">
        <div className="card" style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "24px" }}>
          <PageHeader
            title="Order Created Successfully"
            subtitle="Your first transaction has been recorded."
          />

          <div><strong>Order ID:</strong> {createdOrder.id}</div>
          <div><strong>Status:</strong> {createdOrder.status}</div>
          <div><strong>Created At:</strong> {createdOrder.createdAt}</div>
          <div><strong>Selected Cake:</strong> {createdOrder.selectedCake.title}</div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {Object.entries(createdOrder.cakeConfig).map(([key, value]) => (
              <div key={key}>
                <strong>{key}:</strong> {value}
              </div>
            ))}
          </div>

          <PrimaryButton onClick={handleStartOver}>Start Over</PrimaryButton>
        </div>
      </div>
    </div>
  );
}