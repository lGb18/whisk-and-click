import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import PageHeader from "../components/PageHeader";
import { useAppFlow } from "../state/AppFlow";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");
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
              <div key={order.id} className="card" style={{ padding: "16px" }}>
                <div><strong>ID:</strong> {order.id}</div>
                <div><strong>Status:</strong> {order.status}</div>
                <div><strong>Source:</strong> {order.reference_source}</div>
                <div><strong>Created:</strong> {order.created_at}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}