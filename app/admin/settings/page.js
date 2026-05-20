"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import Link from "next/link";

/**
 * @typedef {"pending" | "shipped" | "completed" | "cancelled"} OrderStatus
 * @typedef {{ name: string; quantity: number; price: number }} OrderItem
 * @typedef {{ id: string; status: OrderStatus; user_email?: string; items?: OrderItem[]; total?: number; }} Order
 * @typedef {{ [key: string]: boolean }} BoolMap
 */

const STATUS_CONFIG = {
  pending:   { color: "#c9a96e", bg: "rgba(201,169,110,0.1)",  border: "rgba(201,169,110,0.3)",  label: "Pending",   emoji: "⏳" },
  shipped:   { color: "#b76e5a", bg: "rgba(183,110,90,0.1)",   border: "rgba(183,110,90,0.3)",   label: "Shipped",   emoji: "🚚" },
  completed: { color: "#7a9e7e", bg: "rgba(122,158,126,0.1)",  border: "rgba(122,158,126,0.3)",  label: "Completed", emoji: "✅" },
  cancelled: { color: "#a05252", bg: "rgba(160,82,82,0.1)",    border: "rgba(160,82,82,0.3)",    label: "Cancelled", emoji: "❌" },
};

const THEME = {
  cream:        "#faf7f4",
  creamDark:    "#f2ece4",
  brownDeep:    "#3b1f1a",
  brownMid:     "#5c2d25",
  rosegold:     "#b76e5a",
  rosegoldLight:"#d4907c",
  rosegoldPale: "#f0d8cf",
  gold:         "#c9a96e",
  textDark:     "#2a1a16",
  textMid:      "#6b4c42",
  textLight:    "#9b7d74",
  border:       "rgba(183,110,90,0.15)",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(/** @type {Order[]} */ ([]));
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(/** @type {"all" | OrderStatus} */ ("all"));
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(/** @type {BoolMap} */ ({}));
  const [updating, setUpdating] = useState(/** @type {BoolMap} */ ({}));

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

  /**
   * @param {string} id
   * @param {OrderStatus} status
   */
  const updateStatus = async (id, status) => {
    setUpdating(prev => ({ ...prev, [id]: true }));
    await supabase.from("orders").update({ status }).eq("id", id);
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    setUpdating(prev => ({ ...prev, [id]: false }));
  };

  /**
   * @param {string} id
   */
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
      background: THEME.cream,
      color: THEME.textDark
    }}>

      {/* Announcement bar */}
      <div style={{
        background: THEME.brownDeep,
        color: THEME.cream,
        textAlign: "center",
        padding: "9px 16px",
        fontSize: "11px",
        letterSpacing: "2px",
        textTransform: "uppercase",
        fontWeight: 500
      }}>
        💎 Free shipping on orders over $30 &nbsp;·&nbsp; Use code{" "}
        <strong style={{ color: THEME.gold }}>NOVAGEM10</strong> for 10% off
      </div>

      {/* Nav */}
      <nav style={{
        background: "#fff",
        borderBottom: `1px solid ${THEME.border}`,
        padding: "0 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "72px"
      }}>
        <div>
          <div style={{ fontFamily: "Georgia, serif", fontSize: "22px", letterSpacing: "5px", color: THEME.brownDeep, fontWeight: 600, textTransform: "uppercase" }}>Novagem</div>
          <div style={{ fontSize: "9px", letterSpacing: "4px", color: THEME.textLight, textAlign: "center", fontWeight: 400, marginTop: "-2px" }}>Unmatched Elegance</div>
        </div>
        <Link href="/admin" style={{ padding: "8px 16px", borderRadius: "6px", fontSize: "12px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", border: `1px solid ${THEME.border}`, color: THEME.textMid, background: "transparent", textDecoration: "none" }}>
          ← Admin
        </Link>
      </nav>

      {/* HERO */}
      <div style={{
        background: `linear-gradient(135deg, ${THEME.brownDeep} 0%, ${THEME.brownMid} 60%, #7a3828 100%)`,
        padding: "50px 30px",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{ position: "absolute", top: "-80px", right: "-60px", width: "300px", height: "300px", borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
        <div style={{ position: "absolute", bottom: "-60px", left: "5%", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(183,110,90,0.12)" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <p style={{ color: THEME.gold, fontSize: "10px", letterSpacing: "5px", textTransform: "uppercase", fontWeight: 600, marginBottom: "10px" }}>
            <Link href="/admin" style={{ color: THEME.gold, textDecoration: "none" }}>Admin</Link> / Orders
          </p>
          <h1 style={{ color: "#fff", fontSize: "clamp(26px,4vw,42px)", fontFamily: "Georgia, serif", fontWeight: 300, letterSpacing: "2px" }}>
            📦 Manage Orders
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "auto", padding: "32px 20px" }}>

        {/* SEARCH */}
        <div style={{
          background: "#fff",
          padding: "18px",
          borderRadius: "14px",
          border: `1px solid ${THEME.border}`,
          marginBottom: "24px",
          boxShadow: "0 2px 12px rgba(59,31,26,0.06)"
        }}>
          <input
            placeholder="Search orders..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "8px",
              border: `1.5px solid ${THEME.border}`,
              background: THEME.cream,
              color: THEME.textDark,
              fontSize: "14px",
              outline: "none",
              fontFamily: "inherit"
            }}
          />
        </div>

        {/* ORDERS */}
        {loading ? (
          <p style={{ color: THEME.textLight }}>Loading...</p>
        ) : filtered.map(order => {
          const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
          const open = expanded[order.id];

          return (
            <div key={order.id}
              style={{
                background: "#fff",
                border: `1px solid ${THEME.border}`,
                borderRadius: "14px",
                marginBottom: "14px",
                padding: "20px",
                boxShadow: "0 2px 12px rgba(59,31,26,0.06)"
              }}>

              {/* HEADER */}
              <div onClick={() => toggleExpand(order.id)}
                style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>

                <div>
                  <strong style={{ color: THEME.textDark, fontSize: "15px" }}>#{order.id?.slice(0, 8)}</strong>
                  <p style={{ color: THEME.textLight, fontSize: "13px", marginTop: "4px" }}>{order.user_email}</p>
                </div>

                <div>
                  <span style={{
                    background: cfg.bg,
                    color: cfg.color,
                    padding: "5px 14px",
                    borderRadius: "20px",
                    border: `1px solid ${cfg.border}`,
                    fontSize: "12px",
                    fontWeight: 600
                  }}>
                    {cfg.emoji} {cfg.label}
                  </span>
                </div>
              </div>

              {/* DETAILS */}
              {open && (
                <div style={{ marginTop: "18px" }}>
                  {(order.items || []).map((item, i) => (
                    <div key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "8px 0",
                        borderBottom: `1px solid ${THEME.border}`,
                        fontSize: "14px",
                        color: THEME.textMid
                      }}>
                      <span>{item.name} × {item.quantity}</span>
                      <span style={{ color: THEME.textDark, fontWeight: 600 }}>${item.price * item.quantity}</span>
                    </div>
                  ))}

                  <div style={{ marginTop: "14px", paddingTop: "10px", borderTop: `2px solid ${THEME.border}` }}>
                    <strong style={{ color: THEME.rosegold, fontSize: "16px" }}>
                      Total: ${order.total}
                    </strong>
                  </div>

                  {/* ACTIONS */}
                  <div style={{ marginTop: "14px", display: "flex", gap: "10px" }}>
                    <button
                      onClick={() => updateStatus(order.id, "completed")}
                      disabled={updating[order.id]}
                      style={{
                        background: THEME.rosegold,
                        color: "#fff",
                        padding: "8px 18px",
                        borderRadius: "8px",
                        border: "none",
                        fontSize: "13px",
                        fontWeight: 600,
                        cursor: "pointer",
                        letterSpacing: "0.5px"
                      }}>
                      ✅ Complete
                    </button>

                    <button
                      onClick={() => updateStatus(order.id, "cancelled")}
                      disabled={updating[order.id]}
                      style={{
                        background: "rgba(160,82,82,0.1)",
                        color: "#a05252",
                        padding: "8px 18px",
                        borderRadius: "8px",
                        border: "1px solid rgba(160,82,82,0.3)",
                        fontSize: "13px",
                        fontWeight: 600,
                        cursor: "pointer",
                        letterSpacing: "0.5px"
                      }}>
                      ❌ Cancel
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