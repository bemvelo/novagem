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

export default function AdminOrdersPage() {
  const [orders, setOrders]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState("all");
  const [search, setSearch]       = useState("");
  const [expanded, setExpanded]   = useState({});
  const [updating, setUpdating]   = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
        if (error) { console.error(error); setOrders([]); }
        else setOrders(data || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    setUpdating(prev => ({ ...prev, [orderId]: true }));
    try {
      const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);
      if (error) alert("Error: " + error.message);
      else setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (e) { alert(e.message); }
    finally { setUpdating(prev => ({ ...prev, [orderId]: false })); }
  };

  const toggleExpand = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const filtered = orders.filter(o => {
    const matchStatus = filter === "all" || o.status === filter;
    const matchSearch = !search || o.id?.toLowerCase().includes(search.toLowerCase()) || o.user_email?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const counts = { all: orders.length, pending: 0, shipped: 0, completed: 0, cancelled: 0 };
  orders.forEach(o => { if (counts[o.status] !== undefined) counts[o.status]++; });
  const totalRevenue = orders.filter(o => o.status === "completed").reduce((s, o) => s + (Number(o.total) || 0), 0);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #f0ebf8 0%, #e8dff5 100%)", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", color: "#1a1a2e" }}>

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #4e2d96 0%, #6c3fc5 100%)", padding: "44px 32px 60px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-80px", right: "-60px", width: "300px", height: "300px", borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
        <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative" }}>
          <p style={{ fontSize: "11px", letterSpacing: "4px", color: "#c4a8f0", textTransform: "uppercase", fontWeight: "600", marginBottom: "10px" }}>
            <Link href="/admin" style={{ color: "#c4a8f0", textDecoration: "none" }}>Admin</Link> / Orders
          </p>
          <h1 style={{ fontSize: "clamp(24px,4vw,40px)", fontFamily: "Georgia,serif", fontWeight: "300", color: "#fff", margin: "0 0 8px", letterSpacing: "2px" }}>📦 Manage Orders</h1>
          <p style={{ color: "#c4a8f0", fontSize: "14px" }}>{orders.length} total orders · ${totalRevenue.toFixed(2)} completed revenue</p>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "-32px auto 0", padding: "0 32px 48px" }}>

        {/* Summary cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "14px", marginBottom: "28px" }}>
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
            <div key={key} onClick={() => setFilter(key)}
              style={{ background: filter === key ? cfg.color : "#fff", borderRadius: "14px", padding: "18px 16px", border: `1px solid ${filter === key ? cfg.color : "#e4d8f8"}`, boxShadow: "0 2px 8px rgba(108,63,197,0.06)", cursor: "pointer", transition: "all 0.2s", textAlign: "center" }}>
              <div style={{ fontSize: "24px", marginBottom: "6px" }}>{cfg.emoji}</div>
              <div style={{ fontSize: "20px", fontWeight: "700", color: filter === key ? "#fff" : cfg.color }}>{counts[key]}</div>
              <div style={{ fontSize: "12px", fontWeight: "600", color: filter === key ? "rgba(255,255,255,0.85)" : "#6b6b8a" }}>{cfg.label}</div>
            </div>
          ))}
          <div onClick={() => setFilter("all")}
            style={{ background: filter === "all" ? "#6c3fc5" : "#fff", borderRadius: "14px", padding: "18px 16px", border: `1px solid ${filter === "all" ? "#6c3fc5" : "#e4d8f8"}`, boxShadow: "0 2px 8px rgba(108,63,197,0.06)", cursor: "pointer", transition: "all 0.2s", textAlign: "center" }}>
            <div style={{ fontSize: "24px", marginBottom: "6px" }}>📋</div>
            <div style={{ fontSize: "20px", fontWeight: "700", color: filter === "all" ? "#fff" : "#6c3fc5" }}>{counts.all}</div>
            <div style={{ fontSize: "12px", fontWeight: "600", color: filter === "all" ? "rgba(255,255,255,0.85)" : "#6b6b8a" }}>All Orders</div>
          </div>
        </div>

        {/* Search */}
        <div style={{ background: "#fff", borderRadius: "14px", padding: "16px 20px", marginBottom: "22px", border: "1px solid #e4d8f8", boxShadow: "0 2px 8px rgba(108,63,197,0.06)", position: "relative" }}>
          <svg style={{ position: "absolute", left: "32px", top: "50%", transform: "translateY(-50%)" }} width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#9b72e0" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input type="text" placeholder="Search by order ID or email..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: "100%", padding: "8px 12px 8px 36px", border: "2px solid #d4c8f0", borderRadius: "10px", fontSize: "14px", color: "#1a1a2e", outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
            onFocus={e => e.target.style.borderColor = "#6c3fc5"}
            onBlur={e => e.target.style.borderColor = "#d4c8f0"} />
        </div>

        {/* Orders list */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📦</div>
            <p style={{ color: "#6b6b8a" }}>Loading orders...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ background: "#fff", borderRadius: "16px", padding: "60px 40px", textAlign: "center", border: "1px solid #e4d8f8" }}>
            <div style={{ fontSize: "52px", marginBottom: "16px" }}>📭</div>
            <p style={{ fontSize: "18px", fontWeight: "700", marginBottom: "8px" }}>No orders found</p>
            <p style={{ color: "#6b6b8a", fontSize: "14px" }}>Try a different filter or search term.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {filtered.map(order => {
              const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
              const isOpen = expanded[order.id];
              const items = Array.isArray(order.items) ? order.items : [];
              const date = order.created_at ? new Date(order.created_at).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }) : "—";

              return (
                <div key={order.id} style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e4d8f8", boxShadow: "0 2px 8px rgba(108,63,197,0.06)", overflow: "hidden", transition: "box-shadow 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = "0 6px 20px rgba(108,63,197,0.12)"}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = "0 2px 8px rgba(108,63,197,0.06)"}>

                  {/* Order header */}
                  <div style={{ padding: "18px 22px", display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap", cursor: "pointer" }} onClick={() => toggleExpand(order.id)}>
                    <div style={{ flexShrink: 0 }}>
                      <p style={{ fontSize: "12px", color: "#9b72e0", fontWeight: "700", marginBottom: "2px" }}>ORDER</p>
                      <p style={{ fontSize: "14px", fontWeight: "700", color: "#1a1a2e", fontFamily: "monospace" }}>#{order.id?.substring(0, 8).toUpperCase()}</p>
                    </div>

                    <div style={{ flex: 1, minWidth: "160px" }}>
                      <p style={{ fontSize: "13px", fontWeight: "600", color: "#1a1a2e", marginBottom: "2px" }}>{order.user_email || "Unknown customer"}</p>
                      <p style={{ fontSize: "12px", color: "#6b6b8a" }}>{date} · {order.method || "N/A"} · {order.phone || ""}</p>
                    </div>

                    <div style={{ textAlign: "center" }}>
                      <p style={{ fontSize: "12px", color: "#6b6b8a", marginBottom: "2px" }}>{items.length} item{items.length !== 1 ? "s" : ""}</p>
                      <p style={{ fontSize: "18px", fontWeight: "700", color: "#6c3fc5" }}>${Number(order.total).toFixed(2)}</p>
                    </div>

                    <span style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, fontSize: "12px", fontWeight: "700", padding: "5px 14px", borderRadius: "20px", whiteSpace: "nowrap" }}>
                      {cfg.emoji} {cfg.label}
                    </span>

                    <span style={{ color: "#9b72e0", fontSize: "18px", transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
                  </div>

                  {/* Expanded details */}
                  {isOpen && (
                    <div style={{ borderTop: "1px solid #f0ebf8", padding: "18px 22px" }}>
                      {/* Items table */}
                      <div style={{ marginBottom: "18px" }}>
                        <p style={{ fontSize: "12px", fontWeight: "700", color: "#9b72e0", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px" }}>Order Items</p>
                        {items.length === 0 ? (
                          <p style={{ fontSize: "13px", color: "#6b6b8a" }}>No item details available.</p>
                        ) : items.map((item, i) => (
                          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f5f0ff" }}>
                            <span style={{ fontSize: "14px", color: "#1a1a2e" }}>{item.name} <span style={{ color: "#9b72e0" }}>×{item.quantity}</span></span>
                            <span style={{ fontSize: "14px", fontWeight: "700", color: "#6c3fc5" }}>${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "10px" }}>
                          <span style={{ fontSize: "14px", fontWeight: "700" }}>Total</span>
                          <span style={{ fontSize: "16px", fontWeight: "700", color: "#6c3fc5" }}>${Number(order.total).toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                        {order.status === "pending" && (
                          <button onClick={() => updateStatus(order.id, "shipped")} disabled={updating[order.id]}
                            style={{ background: "rgba(59,130,246,0.1)", color: "#3b82f6", border: "2px solid rgba(59,130,246,0.3)", padding: "9px 20px", borderRadius: "10px", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}
                            onMouseEnter={e => { e.currentTarget.style.background = "#3b82f6"; e.currentTarget.style.color = "#fff"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "rgba(59,130,246,0.1)"; e.currentTarget.style.color = "#3b82f6"; }}>
                            🚚 Mark as Shipped
                          </button>
                        )}
                        {order.status !== "completed" && (
                          <button onClick={() => updateStatus(order.id, "completed")} disabled={updating[order.id]}
                            style={{ background: "rgba(16,185,129,0.1)", color: "#10b981", border: "2px solid rgba(16,185,129,0.3)", padding: "9px 20px", borderRadius: "10px", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}
                            onMouseEnter={e => { e.currentTarget.style.background = "#10b981"; e.currentTarget.style.color = "#fff"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "rgba(16,185,129,0.1)"; e.currentTarget.style.color = "#10b981"; }}>
                            ✅ Complete Order
                          </button>
                        )}
                        {order.status !== "cancelled" && (
                          <button onClick={() => updateStatus(order.id, "cancelled")} disabled={updating[order.id]}
                            style={{ background: "rgba(239,68,68,0.08)", color: "#ef4444", border: "2px solid rgba(239,68,68,0.2)", padding: "9px 20px", borderRadius: "10px", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}
                            onMouseEnter={e => { e.currentTarget.style.background = "#ef4444"; e.currentTarget.style.color = "#fff"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; e.currentTarget.style.color = "#ef4444"; }}>
                            ❌ Cancel
                          </button>
                        )}
                        {updating[order.id] && <span style={{ fontSize: "13px", color: "#9b72e0", alignSelf: "center" }}>Updating...</span>}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
