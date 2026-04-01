import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import PageHeader from "../components/PageHeader";
import { useAppFlow } from "../state/AppFlow";
import OrderStatusBadge from '../components/OrderStatusBadge';
import { fetchMyOrders } from '../utils/orderQueries';
import { useNavigate } from 'react-router-dom';

export default function MyOrdersPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [orders, setOrders] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    async function loadOrders() {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const data = await fetchMyOrders();
        setOrders(data);
      } catch (error) {
        setErrorMessage(error?.message ?? 'Failed to load orders.');
      } finally {
        setIsLoading(false);
      }
    }

    loadOrders();
  }, []);

  const {
     resetFlow,
    } = useAppFlow();

  useEffect(() => {
    return () => {
      resetFlow();
    };
  }, []);
  
  useEffect(() => {
    async function loadOrders() {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setStatusMessage(error.message);
        return;
      }

      setOrders(data || []);
    }

    loadOrders();
  }, []);

  return (
    <div className="page-shell">
      <div className="container-summary">
        <div
          className="card"
          style={{
            padding: "32px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <PageHeader
            title="My Orders"
            subtitle="Quick verification page for saved orders."
          />

          {statusMessage && <div>{statusMessage}</div>}

          {orders.length === 0 ? (
            <div>No orders yet.</div>
          ) : (
            orders.map((order) => (
              <div key={order.id} style={{ padding: '16px', background: '#FFFFFF', borderRadius: '14px', border: '1px solid #ECECEC' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#333333' }}>Order {order.id}</div>
                    <div style={{ color: '#666666' }}>
                      Source: {order.reference_source}
                    </div>
                    <div style={{ color: '#666666' }}>
                      Created: {new Date(order.created_at).toLocaleString()}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
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