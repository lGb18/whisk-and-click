import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderStatusBadge from '../components/OrderStatusBadge';
import { fetchAllOrdersForAdmin } from '../utils/orderQueries';
import { ORDER_STATUS } from '../utils/orderStatusConfig';
import { useAuthSession } from '../hooks/useAuthSession';
import AppNav from "../components/AppNav";

function formatDateTime(value) {
  if (!value) return '—';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';

  return date.toLocaleString();
}

export default function AdminOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");

  const navigate = useNavigate();
  const { role, isAuthLoading, reloadProfile } = useAuthSession();

  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const canAccess = role === 'staff' || role === 'admin';

  useEffect(() => {
    reloadProfile();
    }, [reloadProfile]);
  useEffect(() => {
    if (isAuthLoading) return;

    if (!canAccess) {
      navigate('/my-orders', { replace: true });
    }
  }, [canAccess, isAuthLoading, navigate]);

  useEffect(() => {
    if (!canAccess) return;

    async function loadOrders() {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const data = await fetchAllOrdersForAdmin();
        setOrders(data);
      } catch (error) {
        setErrorMessage(error?.message ?? 'Failed to load admin orders.');
      } finally {
        setIsLoading(false);
      }
    }

    loadOrders();
  }, [canAccess]);

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

  if (isAuthLoading || isLoading) {
    return (
      <div style={{ padding: '24px', color: '#333333' }}>
        Loading admin orders...
      </div>
    );
  }

  if (!canAccess) {
    return null;
  }

  return (
    
    <div
      style={{
        minHeight: '100vh',
        background: '#F9F7F4',
        padding: '24px',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gap: '20px',
        }}
      >
            <AppNav />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'grid', gap: '6px' }}>
            <h1
              style={{
                margin: 0,
                color: '#333333',
              }}
            >
              Admin Orders
            </h1>
            <div style={{ color: '#666666' }}>
              Review and track all customer orders.
            </div>
          </div>

          <div style={{ display: 'grid', gap: '6px' }}>
            <label style={{ fontWeight: 500, color: '#444444' }}>
              Filter by Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                minWidth: '220px',
                padding: '10px 12px',
                borderRadius: '10px',
                border: '1px solid #D8D8D8',
                background: '#FFFFFF',
              }}
            >
              <option value="all">All Statuses</option>
              {Object.values(ORDER_STATUS).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {errorMessage ? (
          <div
            style={{
              padding: '14px 16px',
              borderRadius: '12px',
              background: '#FDEDED',
              color: '#B3261E',
              border: '1px solid #F5C2C0',
            }}
          >
            {errorMessage}
          </div>
        ) : null}

        <div
          style={{
            display: 'grid',
            gap: '12px',
          }}
        >
          {filteredOrders.length === 0 ? (
            <div
              style={{
                padding: '18px',
                borderRadius: '14px',
                border: '1px solid #EAEAEA',
                background: '#FFFFFF',
                color: '#666666',
              }}
            >
              No orders found for this filter.
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                style={{
                  display: 'grid',
                  gap: '12px',
                  padding: '18px',
                  borderRadius: '16px',
                  background: '#FFFFFF',
                  border: '1px solid #ECECEC',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '12px',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ display: 'grid', gap: '4px' }}>
                    <div style={{ fontWeight: 700, color: '#333333' }}>
                      Order {order.id}
                    </div>
                    <div style={{ color: '#666666' }}>
                      User: {order.user_id}
                    </div>
                    <div style={{ color: '#666666' }}>
                      Created: {formatDateTime(order.created_at)}
                    </div>
                    <div style={{ color: '#666666' }}>
                      Source: {order.reference_source}
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      gap: '10px',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                    }}
                  >
                    <OrderStatusBadge status={order.status} />

                    <button
                      onClick={() => navigate(`/orders/${order.id}`)}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: 'none',
                        background: '#E25D4D',
                        color: '#FFFFFF',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}