import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import OrderSummaryCard from "../components/OrderSummaryCard";
import {
  EmptyStateCard,
  ErrorStateCard,
  LoadingStateCard,
} from "../components/PageState";
import { fetchAllOrdersForAdmin } from "../utils/orderQueries";
import { ORDER_STATUS } from "../utils/orderStatusConfig";
import { useAuthSession } from "../hooks/useAuthSession";

export default function AdminOrdersPage() {
  const navigate = useNavigate();
  const { reloadProfile } = useAuthSession();

  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    reloadProfile();
  }, [reloadProfile]);

  useEffect(() => {
    async function loadOrders() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const data = await fetchAllOrdersForAdmin();
        setOrders(data);
      } catch (error) {
        setErrorMessage(error?.message ?? "Failed to load admin orders.");
      } finally {
        setIsLoading(false);
      }
    }

    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === "all" ? true : order.status === statusFilter;

      const matchesSource =
        sourceFilter === "all" ? true : order.reference_source === sourceFilter;

      const normalized = searchTerm.trim().toLowerCase();
      const matchesSearch = normalized
        ? (
            order.id?.toLowerCase().includes(normalized) ||
            order.user_id?.toLowerCase().includes(normalized)
          )
        : true;

      return matchesStatus && matchesSource && matchesSearch;
    });
  }, [orders, statusFilter, sourceFilter, searchTerm]);

  return (
    <AppShell
      title="Admin Orders"
      subtitle="Review and track all customer orders."
    >
      <div
        style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Search by order id or user id"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            minWidth: "260px",
            padding: "10px 12px",
            borderRadius: "10px",
            border: "1px solid #D8D8D8",
            background: "#FFFFFF",
          }}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            minWidth: "180px",
            padding: "10px 12px",
            borderRadius: "10px",
            border: "1px solid #D8D8D8",
            background: "#FFFFFF",
          }}
        >
          <option value="all">All Statuses</option>
          {Object.values(ORDER_STATUS).map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          style={{
            minWidth: "180px",
            padding: "10px 12px",
            borderRadius: "10px",
            border: "1px solid #D8D8D8",
            background: "#FFFFFF",
          }}
        >
          <option value="all">All Sources</option>
          <option value="recommendation">Recommendation</option>
          <option value="fallback_ai">Fallback AI</option>
        </select>
      </div>

      {errorMessage ? <ErrorStateCard message={errorMessage} /> : null}

      {isLoading ? (
        <LoadingStateCard message="Loading admin orders..." />
      ) : filteredOrders.length === 0 ? (
        <EmptyStateCard message="No orders found for this filter." />
      ) : (
        <div style={{ display: "grid", gap: "12px" }}>
          {filteredOrders.map((order) => (
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