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

  const { 
    data: orders = [], 
    isLoading, 
    isError, 
    error 
  } = useQuery({
    queryKey: ['my-orders', user?.id],
    queryFn: fetchMyOrders,            
    enabled: !!user?.id,               
    staleTime: 60000,
  });

  return (
    <AppShell title="My Orders" subtitle="Review your placed orders and tracking details.">
      {isError ? <ErrorStateCard message={error?.message || "Failed to load orders."} /> : null}

      {isLoading ? (
        <LoadingStateCard message="Loading your orders..." />
      ) : orders.length === 0 ? (
        <EmptyStateCard message="You have no active or past orders yet." />
      ) : (
        // Swapped to CSS variables for responsive consistency
        <div style={{ display: "grid", gap: "var(--space-md)" }}>
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