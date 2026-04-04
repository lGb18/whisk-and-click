import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import OrderSummaryCard from "../components/OrderSummaryCard";
import {
  EmptyStateCard,
  ErrorStateCard,
  LoadingStateCard,
} from "../components/PageState";
import { fetchMyOrders } from "../utils/orderQueries";
import { useAuthSession } from "../hooks/useAuthSession";

export default function MyOrdersPage() {
  const navigate = useNavigate();
  // const { reloadProfile } = useAuthSession();

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");


  useEffect(() => {
    async function loadOrders() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const data = await fetchMyOrders();
        setOrders(data);
      } catch (error) {
        setErrorMessage(error?.message ?? "Failed to load orders.");
      } finally {
        setIsLoading(false);
      }
    }

    loadOrders();
  }, []);

  return (
    <AppShell
      title="My Orders"
      subtitle="Review your placed orders, statuses, and tracking details."
    >
      {errorMessage ? <ErrorStateCard message={errorMessage} /> : null}

      {isLoading ? (
        <LoadingStateCard message="Loading your orders..." />
      ) : orders.length === 0 ? (
        <EmptyStateCard message="You have no orders yet." />
      ) : (
        <div style={{ display: "grid", gap: "12px" }}>
          {orders.map((order) => (
            <OrderSummaryCard
              key={order.id}
              order={order}
              onViewDetails={(selectedOrder) =>
                navigate(`/orders/${selectedOrder.id}`)
              }
            />
          ))}
        </div>
      )}
    </AppShell>
  );
}