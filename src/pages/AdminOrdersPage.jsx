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
import { useQuery } from '@tanstack/react-query';

export default function AdminOrdersPage() {
  const navigate = useNavigate();
  const { reloadProfile } = useAuthSession();

  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10; 

  const { 
    data: orders = [], 
    isLoading, 
    isError, 
    error 
  } = useQuery({
    queryKey: ['admin-orders'], 
    queryFn: fetchAllOrdersForAdmin,
    staleTime: 60000,
  });

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

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, sourceFilter, searchTerm]);

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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
          marginBottom: "var(--space-md)"
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

      {isError ? <ErrorStateCard message={error?.message || "Failed to load admin orders."} /> : null}

      {isLoading ? (
        <LoadingStateCard message="Loading admin orders..." />
      ) : filteredOrders.length === 0 ? (
        <EmptyStateCard message="No orders found for this filter." />
      ) : (
        <>
          <div style={{ display: "grid", gap: "12px" }}>
            {paginatedOrders.map((order) => (
              <OrderSummaryCard
                key={order.id}
                order={order}
                onViewDetails={(selectedOrder) =>
                  navigate(`/orders/${selectedOrder.id}`)
                }
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center", 
              marginTop: "var(--space-xl)",
              padding: "var(--space-md)",
              backgroundColor: "#FFFFFF",
              borderRadius: "12px",
              border: "1px solid #ECECEC"
            }}>
              <button 
                className="secondary-button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              >
                &larr; Previous
              </button>
              
              <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>
                Page {currentPage} of {totalPages}
              </span>

              <button 
                className="secondary-button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              >
                Next &rarr;
              </button>
            </div>
          )}
        </>
      )}
    </AppShell>
  );
}