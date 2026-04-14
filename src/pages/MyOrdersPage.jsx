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
import { useQuery } from '@tanstack/react-query';

export default function MyOrdersPage() {
  const navigate = useNavigate();
  const { user } = useAuthSession();
  // const { reloadProfile } = useAuthSession();

  // const [orders, setOrders] = useState([]);
  // const [isLoading, setIsLoading] = useState(true);
  // const [errorMessage, setErrorMessage] = useState("");


  const { 
    data: orders = [], 
    isLoading, 
    isError, 
    error 
  } = useQuery({
    queryKey: ['my-orders', user?.id], // Cache key
    queryFn: fetchMyOrders,            // Your existing fetcher from utils
    enabled: !!user?.id,               // Only run if we have a user
    staleTime: 60000,
  });

  return (
    <AppShell title="My Orders" subtitle="Review your placed orders and tracking details.">
      {isError ? <ErrorStateCard message={error?.message || "Failed to load orders."} /> : null}

      {/* isLoading is ONLY true on the very first fetch. No flicker on return! */}
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
              onViewDetails={(selectedOrder) => navigate(`/orders/${selectedOrder.id}`)}
            />
          ))}
        </div>
      )}
    </AppShell>
  );
}