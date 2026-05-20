"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

const ADMIN_CARDS = [
  { title: "Analytics", href: "/admin/analytics", emoji: "📊", desc: "Sales, visits & market insights" },
  { title: "Products", href: "/admin/products", emoji: "💍", desc: "Add, edit, delete & manage inventory" },
  { title: "Users", href: "/admin/users", emoji: "👥", desc: "View users, assign roles & manage accounts" },
  { title: "Orders", href: "/admin/orders", emoji: "📦", desc: "View orders, update status & track fulfillment" },
  { title: "Settings", href: "/admin/settings", emoji: "⚙️", desc: "Store details, payment & shipping options" },
];

const COLORS = {
  cream: "#faf7f4",
  creamDark: "#f2ece4",
  brownDeep: "#3b1f1a",
  brownMid: "#5c2d25",
  rosegold: "#b76e5a",
  rosegoldLight: "#d4907c",
  rosegoldPale: "#f0d8cf",
  gold: "#c9a96e",
  textDark: "#2a1a16",
  textMid: "#6b4c42",
  textLight: "#9b7d74",
  border: "rgba(183,110,90,0.15)",
};

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
      setStats({ products: products.count || 0, orders: orders.count || 0, users: users.count || 0, revenue });
      setLoading(false);
    };
    init();
  }, [router]);

  const STAT_CARDS = [
    { label: "Products", value: stats.products, emoji: "💍", color: COLORS.rosegold, bg: "rgba(183,110,90,0.1)" },
    { label: "Orders", value: stats.orders, emoji: "📦", color: COLORS.gold, bg: "rgba(201,169,110,0.12)" },
    { label: "Users", value: stats.users, emoji: "👥", color: COLORS.brownMid, bg: "rgba(92,45,37,0.08)" },
    { label: "Revenue", value: `$${stats.revenue.toFixed(2)}`, emoji: "💰", color: COLORS.rosegold, bg: "rgba(183,110,90,0.1)" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: COLORS.cream, fontFamily: "'Jost', 'Segoe UI', sans-serif", color: COLORS.textDark }}>

      {/* Announcement */}
      <div style={{ background: COLORS.brownDeep, color: COLORS.cream, textAlign: "center", padding: "9px 16px", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", fontWeight: 500 }}>
        💎 Free shipping on orders over $30 &nbsp;·&nbsp; Use code <strong style={{ color: COLORS.gold }}>NOVAGEM10</strong> for 10% off
      </div>

      {/* Nav */}
      <nav style={{ background: "#fff", borderBottom: `1px solid ${COLORS.border}`, padding: "0 40px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "72px" }}>
        <div>
          <div style={{ fontFamily: "Georgia, serif", fontSize: "22px", letterSpacing: "5px", color: COLORS.brownDeep, fontWeight: 600, textTransform: "uppercase" }}>Novagem</div>
          <div style={{ fontSize: "9px", letterSpacing: "4px", color: COLORS.textLight, textAlign: "center", fontWeight: 400, marginTop: "-2px" }}>Unmatched Elegance</div>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <Link href="/" style={{ padding: "8px 16px", borderRadius: "6px", fontSize: "12px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", border: `1px solid ${COLORS.border}`, color: COLORS.textMid, background: "transparent", textDecoration: "none" }}>← Store Front</Link>
          <Link href="/admin/products/new" style={{ padding: "8px 16px", borderRadius: "6px", fontSize: "12px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", background: COLORS.rosegold, color: "#fff", textDecoration: "none" }}>+ Add Product</Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${COLORS.brownDeep} 0%, ${COLORS.brownMid} 60%, #7a3828 100%)`, padding: "52px 40px 60px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-100px", right: "-80px", width: "380px", height: "380px", borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
        <div style={{ position: "absolute", bottom: "-80px", left: "8%", width: "250px", height: "250px", borderRadius: "50%", background: "rgba(183,110,90,0.12)" }} />
        <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <p style={{ fontSize: "10px", letterSpacing: "5px", color: COLORS.gold, textTransform: "uppercase", fontWeight: 600, marginBottom: "12px" }}>Novagem · Admin</p>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(28px,4vw,44px)", fontWeight: 300, color: "#fff", letterSpacing: "2px", marginBottom: "10px" }}>⚙️ Admin Dashboard</h1>
          <p style={{ color: COLORS.rosegoldLight, fontSize: "14px" }}>Welcome back, <strong style={{ color: "#fff" }}>{adminEmail}</strong></p>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "-36px auto 0", padding: "0 40px 56px", position: "relative", zIndex: 2 }}>

        {/* Stat Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: "14px", marginBottom: "40px" }}>
          {STAT_CARDS.map(stat => (
            <div key={stat.label} style={{ background: "#fff", borderRadius: "14px", padding: "22px 20px", border: `1px solid ${COLORS.border}`, boxShadow: "0 2px 16px rgba(59,31,26,0.07)", display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ width: "52px", height: "52px", borderRadius: "13px", background: stat.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", flexShrink: 0 }}>{stat.emoji}</div>
              <div>
                <p style={{ fontSize: "10px", color: COLORS.textLight, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "5px" }}>{stat.label}</p>
                <p style={{ fontSize: "26px", fontWeight: 700, color: stat.color, lineHeight: 1 }}>{loading ? "—" : stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Section header */}
        <div style={{ fontSize: "11px", fontWeight: 700, color: COLORS.textMid, letterSpacing: "3px", textTransform: "uppercase", marginBottom: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
          Management
          <div style={{ flex: 1, height: "1px", background: COLORS.border }} />
        </div>

        {/* Nav Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "14px", marginBottom: "32px" }}>
          {ADMIN_CARDS.map(card => (
            <Link key={card.title} href={card.href} style={{ textDecoration: "none" }}>
              <div style={{ background: "#fff", borderRadius: "14px", padding: "28px 22px", border: `1px solid ${COLORS.border}`, boxShadow: "0 2px 8px rgba(59,31,26,0.06)", cursor: "pointer", transition: "all 0.22s", height: "100%" }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = COLORS.brownDeep;
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = "0 14px 32px rgba(59,31,26,0.22)";
                  e.currentTarget.querySelectorAll("[data-title]").forEach(el => {
                    if (el instanceof HTMLElement) el.style.color = COLORS.gold;
                  });
                  e.currentTarget.querySelectorAll("[data-desc]").forEach(el => {
                    if (el instanceof HTMLElement) el.style.color = "rgba(250,247,244,0.65)";
                  });
                  e.currentTarget.querySelectorAll("[data-arrow]").forEach(el => {
                    if (el instanceof HTMLElement) el.style.color = COLORS.rosegoldLight;
                  });
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "#fff";
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(59,31,26,0.06)";
                  e.currentTarget.querySelectorAll("[data-title]").forEach(el => {
                    if (el instanceof HTMLElement) el.style.color = COLORS.textDark;
                  });
                  e.currentTarget.querySelectorAll("[data-desc]").forEach(el => {
                    if (el instanceof HTMLElement) el.style.color = COLORS.textLight;
                  });
                  e.currentTarget.querySelectorAll("[data-arrow]").forEach(el => {
                    if (el instanceof HTMLElement) el.style.color = COLORS.rosegold;
                  });
                }}>
                <div style={{ fontSize: "36px", marginBottom: "14px" }}>{card.emoji}</div>
                <div data-title style={{ fontSize: "15px", fontWeight: 600, color: COLORS.textDark, marginBottom: "6px", transition: "color 0.22s", letterSpacing: "0.3px" }}>{card.title}</div>
                <div data-desc style={{ fontSize: "12px", color: COLORS.textLight, lineHeight: 1.6, transition: "color 0.22s" }}>{card.desc}</div>
                <div data-arrow style={{ marginTop: "16px", fontSize: "12px", fontWeight: 700, color: COLORS.rosegold, letterSpacing: "1px", transition: "color 0.22s" }}>Manage →</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{ background: "#fff", borderRadius: "14px", padding: "24px 28px", border: `1px solid ${COLORS.border}`, boxShadow: "0 2px 8px rgba(59,31,26,0.06)" }}>
          <h3 style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: COLORS.textMid, marginBottom: "16px" }}>⚡ Quick Actions</h3>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {[
              { label: "Add Product", href: "/admin/products/new", emoji: "➕" },
              { label: "View Orders", href: "/admin/orders", emoji: "📋" },
              { label: "View Users", href: "/admin/users", emoji: "👤" },
              { label: "Store Front", href: "/", emoji: "🏪" },
            ].map(action => (
              <Link key={action.label} href={action.href}
                style={{ display: "inline-flex", alignItems: "center", gap: "7px", background: COLORS.rosegoldPale, color: COLORS.rosegold, textDecoration: "none", padding: "9px 18px", borderRadius: "8px", fontSize: "12px", fontWeight: 600, border: `1px solid rgba(183,110,90,0.2)`, letterSpacing: "0.5px" }}
                onMouseEnter={e => { e.currentTarget.style.background = COLORS.rosegold; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.background = COLORS.rosegoldPale; e.currentTarget.style.color = COLORS.rosegold; }}>
                <span>{action.emoji}</span> {action.label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}