"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

const ADMIN_CARDS = [
  { title: "Analytics", href: "/admin/analytics", emoji: "📊", desc: "Sales, visits & market insights", color: "#d4af37" },
  { title: "Products", href: "/admin/products", emoji: "💍", desc: "Add, edit, delete & manage inventory", color: "#c9a227" },
  { title: "Users", href: "/admin/users", emoji: "👥", desc: "View users, assign roles & manage accounts", color: "#e6c200" },
  { title: "Orders", href: "/admin/orders", emoji: "📦", desc: "View orders, update status & track fulfillment", color: "#b8960f" },
  { title: "Settings", href: "/admin/settings", emoji: "⚙️", desc: "Store details, payment & shipping options", color: "#a67c00" },
];

export default function AdminPage() {
  const router = useRouter();
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState("");

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { router.push("/login"); return; }
      setAdminEmail(session.user.email || "");

      const [products, orders, users] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("id,total", { count: "exact" }),
        supabase.from("users").select("id", { count: "exact", head: true }),
      ]);

      const revenue = (orders.data || []).reduce((sum, o) => sum + (Number(o.total) || 0), 0);

      setStats({
        products: products.count || 0,
        orders: orders.count || 0,
        users: users.count || 0,
        revenue,
      });
      setLoading(false);
    };
    init();
  }, [router]);

  const STAT_CARDS = [
    { label: "Products", value: stats.products, emoji: "💍", color: "#d4af37", bg: "rgba(212,175,55,0.12)" },
    { label: "Orders", value: stats.orders, emoji: "📦", color: "#e6c200", bg: "rgba(230,194,0,0.12)" },
    { label: "Users", value: stats.users, emoji: "👥", color: "#c9a227", bg: "rgba(201,162,39,0.12)" },
    { label: "Revenue", value: `$${stats.revenue.toFixed(2)}`, emoji: "💰", color: "#facc15", bg: "rgba(250,204,21,0.12)" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #0f0f0f 0%, #1c1c1c 100%)", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", color: "#f5f5f5" }}>

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #000000 0%, #2c2c2c 100%)", padding: "48px 32px 56px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-80px", right: "-60px", width: "300px", height: "300px", borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        <div style={{ position: "absolute", bottom: "-60px", left: "5%", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(212,175,55,0.08)" }} />
        <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative" }}>
          <p style={{ fontSize: "11px", letterSpacing: "4px", color: "#d4af37", textTransform: "uppercase", fontWeight: "600", marginBottom: "10px" }}>novagem</p>
          <h1 style={{ fontSize: "clamp(26px,4vw,42px)", fontFamily: "Georgia,serif", fontWeight: "300", color: "#fff", margin: "0 0 8px", letterSpacing: "2px" }}>⚙️ Admin Dashboard</h1>
          <p style={{ color: "#d4af37", fontSize: "14px" }}>Welcome back, <strong style={{ color: "#fff" }}>{adminEmail}</strong></p>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "-32px auto 0", padding: "0 32px 48px" }}>

        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px", marginBottom: "36px" }}>
          {STAT_CARDS.map(stat => (
            <div key={stat.label} style={{ background: "#ffffff", borderRadius: "16px", padding: "22px 20px", border: "1px solid #e5e5e5", boxShadow: "0 2px 12px rgba(0,0,0,0.2)", display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: stat.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px", flexShrink: 0 }}>
                {stat.emoji}
              </div>
              <div>
                <p style={{ fontSize: "12px", color: "#666", fontWeight: "600", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{stat.label}</p>
                <p style={{ fontSize: "24px", fontWeight: "700", color: stat.color, lineHeight: 1 }}>
                  {loading ? "—" : stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#fff", marginBottom: "18px" }}>Management</h2>

        {/* Admin nav cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px" }}>
          {ADMIN_CARDS.map(card => (
            <Link key={card.title} href={card.href} style={{ textDecoration: "none" }}>
              <div style={{ background: "#ffffff", borderRadius: "16px", padding: "28px 22px", border: "1px solid #e5e5e5", boxShadow: "0 2px 8px rgba(0,0,0,0.15)", cursor: "pointer", transition: "all 0.22s", height: "100%" }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = card.color;
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 12px 28px rgba(212,175,55,0.35)";
                  e.currentTarget.querySelectorAll("[data-title]").forEach(el => el.style.color = "#000");
                  e.currentTarget.querySelectorAll("[data-desc]").forEach(el => el.style.color = "rgba(0,0,0,0.7)");
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "#fff";
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
                  e.currentTarget.querySelectorAll("[data-title]").forEach(el => el.style.color = "");
                  e.currentTarget.querySelectorAll("[data-desc]").forEach(el => el.style.color = "");
                }}>
                <div style={{ fontSize: "38px", marginBottom: "14px" }}>{card.emoji}</div>
                <div data-title style={{ fontSize: "16px", fontWeight: "700", color: "#1a1a2e", marginBottom: "6px" }}>{card.title}</div>
                <div data-desc style={{ fontSize: "13px", color: "#6b6b8a", lineHeight: "1.5" }}>{card.desc}</div>
                <div style={{ marginTop: "16px", fontSize: "13px", fontWeight: "700", color: card.color }}>
                  Manage →
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick actions */}
        <div style={{ marginTop: "32px", background: "#ffffff", borderRadius: "16px", padding: "24px 28px", border: "1px solid #e5e5e5", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
          <h3 style={{ fontSize: "15px", fontWeight: "700", marginBottom: "16px", color: "#000" }}>⚡ Quick Actions</h3>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {[
              { label: "Add Product", href: "/admin/products/new", emoji: "➕" },
              { label: "View Orders", href: "/admin/orders", emoji: "📋" },
              { label: "View Users", href: "/admin/users", emoji: "👤" },
              { label: "Store Front", href: "/", emoji: "🏪" },
            ].map(action => (
              <Link key={action.label} href={action.href}
                style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(212,175,55,0.1)", color: "#d4af37", textDecoration: "none", padding: "9px 18px", borderRadius: "10px", fontSize: "13px", fontWeight: "700", border: "1px solid rgba(212,175,55,0.3)", transition: "all 0.18s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#d4af37"; e.currentTarget.style.color = "#000"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(212,175,55,0.1)"; e.currentTarget.style.color = "#d4af37"; }}>
                <span>{action.emoji}</span> {action.label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}