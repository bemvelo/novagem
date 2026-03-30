"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import Link from "next/link";

const STATUS_CONFIG = {
  pending:   { color: "#f59e0b", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.3)",  label: "Pending",   emoji: "⏳" },
  shipped:   { color: "#3b82f6", bg: "rgba(59,130,246,0.1)",  border: "rgba(59,130,246,0.3)",  label: "Shipped",   emoji: "🚚" },
  completed: { color: "#10b981", bg: "rgba(16,185,129,0.1)",  border: "rgba(16,185,129,0.3)",  label: "Completed", emoji: "✅" },
  cancelled: { color: "#ef4444", bg: "rgba(239,68,68,0.1)",   border: "rgba(239,68,68,0.3)",   label: "Cancelled", emoji: "❌" },
};

const THEME = {
  bg: "#FFF5E1",
  bgSoft: "#FAF3E0",
  primary: "#B76E79",
  secondary: "#E8B4B8",
  text: "#3E2C2C"
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState({});
  const [updating, setUpdating] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      setOrders(data || []);
      setLoading(false);
    };
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    setUpdating(prev => ({ ...prev, [id]: true }));
    await supabase.from("orders").update({ status }).eq("id", id);
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    setUpdating(prev => ({ ...prev, [id]: false }));
  };

  const toggleExpand = id => setExpanded(p => ({ ...p, [id]: !p[id] }));

  const filtered = orders.filter(o =>
    (filter === "all" || o.status === filter) &&
    (!search ||
      o.id?.toLowerCase().includes(search.toLowerCase()) ||
      o.user_email?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(160deg, ${THEME.bg}, ${THEME.bgSoft})`,
      color: THEME.text
    }}>

      {/* HERO */}
      <div style={{
        background: `linear-gradient(135deg, ${THEME.primary}, ${THEME.secondary})`,
        padding: "50px 30px"
      }}>
        <p style={{ color: "#fff", opacity: 0.8 }}>
          <Link href="/admin" style={{ color: "#fff" }}>Admin</Link> / Orders
        </p>
        <h1 style={{ color: "#fff", fontSize: "32px" }}>
          📦 Manage Orders
        </h1>
      </div>

      <div style={{ maxWidth: "1100px", margin: "auto", padding: "20px" }}>

        {/* SEARCH */}
        <div style={{
          background: THEME.bgSoft,
          padding: "15px",
          borderRadius: "12px",
          border: `1px solid ${THEME.secondary}`,
          marginBottom: "20px"
        }}>
          <input
            placeholder="Search orders..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: `2px solid ${THEME.secondary}`
            }}
          />
        </div>

        {/* ORDERS */}
        {loading ? (
          <p>Loading...</p>
        ) : filtered.map(order => {
          const cfg = STATUS_CONFIG[order.status];
          const open = expanded[order.id];

          return (
            <div key={order.id}
              style={{
                background: THEME.bgSoft,
                border: `1px solid ${THEME.secondary}`,
                borderRadius: "14px",
                marginBottom: "15px",
                padding: "15px",
                boxShadow: "0 4px 12px rgba(183,110,121,0.1)"
              }}>

              {/* HEADER */}
              <div onClick={() => toggleExpand(order.id)}
                style={{ cursor: "pointer", display: "flex", justifyContent: "space-between" }}>

                <div>
                  <strong>#{order.id?.slice(0, 8)}</strong>
                  <p>{order.user_email}</p>
                </div>

                <div>
                  <span style={{
                    background: cfg.bg,
                    color: cfg.color,
                    padding: "5px 12px",
                    borderRadius: "20px",
                    border: `1px solid ${cfg.border}`
                  }}>
                    {cfg.emoji} {cfg.label}
                  </span>
                </div>
              </div>

              {/* DETAILS */}
              {open && (
                <div style={{ marginTop: "15px" }}>
                  {(order.items || []).map((item, i) => (
                    <div key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "6px 0"
                      }}>
                      <span>{item.name} × {item.quantity}</span>
                      <span>${item.price * item.quantity}</span>
                    </div>
                  ))}

                  <hr />

                  <strong style={{ color: THEME.primary }}>
                    Total: ${order.total}
                  </strong>

                  {/* ACTIONS */}
                  <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                    <button onClick={() => updateStatus(order.id, "completed")}
                      style={{
                        background: THEME.primary,
                        color: "#fff",
                        padding: "8px 14px",
                        borderRadius: "8px",
                        border: "none"
                      }}>
                      Complete
                    </button>

                    <button onClick={() => updateStatus(order.id, "cancelled")}
                      style={{
                        background: "#ef4444",
                        color: "#fff",
                        padding: "8px 14px",
                        borderRadius: "8px",
                        border: "none"
                      }}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>
    </div>
  );
}