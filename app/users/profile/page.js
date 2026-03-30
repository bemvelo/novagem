"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import NavBar from "../../../components/NavBar";
import Link from "next/link";

const USER_CARDS = [
  { title: "Browse Collection", link: "/users/products", emoji: "💍", desc: "Shop our latest jewelry" },
  { title: "My Cart", link: "/users/cart", emoji: "🛒", desc: "View your saved items" },
  { title: "Checkout", link: "/users/checkout", emoji: "💳", desc: "Complete your order" },
  { title: "Order History", link: "/users/orders", emoji: "📦", desc: "Track your past orders" },
];

const ADMIN_CARDS = [
  { title: "Products", link: "/admin/products", emoji: "💎", desc: "Manage your inventory" },
  { title: "Orders", link: "/admin/orders", emoji: "📦", desc: "View & process orders" },
  { title: "Analytics", link: "/admin/analytics", emoji: "📊", desc: "Sales & performance" },
  { title: "Users", link: "/admin/users", emoji: "👥", desc: "Manage customers" },
];

export default function ProfilePage() {
  const router = useRouter();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [joinedDate, setJoinedDate] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { router.push("/login"); return; }

      setEmail(session.user.email || "");
      setJoinedDate(new Date(session.user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" }));

      try {
        const { data, error } = await supabase.from("users").select("role").eq("id", session.user.id).single();
        setRole(error || !data ? "user" : data.role);
      } catch (err) {
        console.error(err.message);
        setRole("user");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const cards = role === "admin" ? ADMIN_CARDS : USER_CARDS;
  const initials = email ? email[0].toUpperCase() : "?";

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #f0ebf8, #e8dff5)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>💍</div>
          <p style={{ color: "#6b6b8a", fontSize: "16px" }}>Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #f0ebf8 0%, #e8dff5 100%)", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", color: "#1a1a2e" }}>

      {/* Hero banner */}
      <div style={{ background: "linear-gradient(135deg, #4e2d96 0%, #6c3fc5 100%)", padding: "52px 32px 80px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-80px", right: "-60px", width: "300px", height: "300px", borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
        <div style={{ position: "absolute", bottom: "-60px", left: "5%", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(255,107,157,0.08)" }} />
        <div style={{ maxWidth: "900px", margin: "0 auto", position: "relative" }}>
          <p style={{ fontSize: "11px", letterSpacing: "4px", color: "#c4a8f0", textTransform: "uppercase", fontWeight: "600", marginBottom: "20px" }}>My Account</p>
          <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
            {/* Avatar */}
            <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "linear-gradient(135deg, #ff6b9d, #ff9b72)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", fontWeight: "700", color: "#fff", flexShrink: 0, boxShadow: "0 4px 16px rgba(255,107,157,0.4)" }}>
              {initials}
            </div>
            <div>
              <h1 style={{ fontSize: "clamp(22px,4vw,34px)", fontFamily: "Georgia,serif", fontWeight: "400", color: "#fff", margin: "0 0 6px", letterSpacing: "1px" }}>
                Welcome back!
              </h1>
              <p style={{ color: "#c4a8f0", fontSize: "14px", margin: 0 }}>{email}</p>
              {joinedDate && <p style={{ color: "#a08cd0", fontSize: "12px", marginTop: "4px" }}>Member since {joinedDate}</p>}
            </div>
            {/* Role badge */}
            <span style={{ marginLeft: "auto", background: role === "admin" ? "rgba(255,107,157,0.25)" : "rgba(255,255,255,0.12)", color: role === "admin" ? "#ffb3d1" : "#e4d8f8", fontSize: "12px", fontWeight: "700", padding: "6px 16px", borderRadius: "20px", letterSpacing: "1px", textTransform: "uppercase", border: `1px solid ${role === "admin" ? "rgba(255,107,157,0.3)" : "rgba(255,255,255,0.2)"}` }}>
              {role === "admin" ? "⚙️ Admin" : "👤 Member"}
            </span>
          </div>
        </div>
      </div>

      {/* Cards pulled up */}
      <div style={{ maxWidth: "900px", margin: "-40px auto 0", padding: "0 32px 48px" }}>

        {/* Quick stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px", marginBottom: "28px" }}>
          {(role === "admin"
            ? [["📦","Orders","Manage all"], ["💎","Products","In store"], ["👥","Users","Registered"]]
            : [["🛒","Cart Items","Saved"], ["📦","Orders","Placed"], ["❤️","Wishlist","Saved"]]
          ).map(([emoji, label, sub]) => (
            <div key={label} style={{ background: "#fff", borderRadius: "14px", padding: "20px 16px", textAlign: "center", border: "1px solid #e4d8f8", boxShadow: "0 2px 8px rgba(108,63,197,0.06)" }}>
              <div style={{ fontSize: "28px", marginBottom: "6px" }}>{emoji}</div>
              <div style={{ fontSize: "14px", fontWeight: "700", color: "#1a1a2e" }}>{label}</div>
              <div style={{ fontSize: "11px", color: "#9b72e0" }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* Section title */}
        <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#1a1a2e", marginBottom: "16px", letterSpacing: "0.5px" }}>
          {role === "admin" ? "⚙️ Admin Dashboard" : "🛍️ Quick Access"}
        </h2>

        {/* Nav cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: "14px", marginBottom: "28px" }}>
          {cards.map(card => (
            <Link key={card.title} href={card.link} style={{ textDecoration: "none" }}>
              <div style={{ background: "#fff", borderRadius: "14px", padding: "24px 20px", border: "1px solid #e4d8f8", boxShadow: "0 2px 8px rgba(108,63,197,0.06)", cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#6c3fc5"; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 10px 24px rgba(108,63,197,0.22)"; e.currentTarget.querySelectorAll("[data-text]").forEach(el => el.style.color = "#fff"); e.currentTarget.querySelectorAll("[data-sub]").forEach(el => el.style.color = "#c4a8f0"); }}
                onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(108,63,197,0.06)"; e.currentTarget.querySelectorAll("[data-text]").forEach(el => el.style.color = ""); e.currentTarget.querySelectorAll("[data-sub]").forEach(el => el.style.color = ""); }}>
                <div style={{ fontSize: "32px", marginBottom: "12px" }}>{card.emoji}</div>
                <div data-text style={{ fontSize: "15px", fontWeight: "700", color: "#1a1a2e", marginBottom: "4px" }}>{card.title}</div>
                <div data-sub style={{ fontSize: "12px", color: "#9b72e0" }}>{card.desc}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Account section */}
        <div style={{ background: "#fff", borderRadius: "16px", padding: "24px 28px", border: "1px solid #e4d8f8", boxShadow: "0 2px 8px rgba(108,63,197,0.06)" }}>
          <h3 style={{ fontSize: "15px", fontWeight: "700", marginBottom: "18px", color: "#1a1a2e" }}>Account Details</h3>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid #f0ebf8" }}>
            <div>
              <p style={{ fontSize: "12px", color: "#9b72e0", fontWeight: "600", marginBottom: "2px" }}>EMAIL ADDRESS</p>
              <p style={{ fontSize: "14px", fontWeight: "600", color: "#1a1a2e" }}>{email}</p>
            </div>
            <span style={{ fontSize: "20px" }}>📧</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid #f0ebf8" }}>
            <div>
              <p style={{ fontSize: "12px", color: "#9b72e0", fontWeight: "600", marginBottom: "2px" }}>ACCOUNT TYPE</p>
              <p style={{ fontSize: "14px", fontWeight: "600", color: "#1a1a2e", textTransform: "capitalize" }}>{role}</p>
            </div>
            <span style={{ fontSize: "20px" }}>{role === "admin" ? "⚙️" : "👤"}</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0" }}>
            <div>
              <p style={{ fontSize: "12px", color: "#9b72e0", fontWeight: "600", marginBottom: "2px" }}>MEMBER SINCE</p>
              <p style={{ fontSize: "14px", fontWeight: "600", color: "#1a1a2e" }}>{joinedDate || "—"}</p>
            </div>
            <span style={{ fontSize: "20px" }}>📅</span>
          </div>

          <button onClick={handleLogout}
            style={{ marginTop: "20px", width: "100%", background: "rgba(239,68,68,0.08)", color: "#ef4444", border: "2px solid rgba(239,68,68,0.2)", padding: "12px", borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s", letterSpacing: "0.3px" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#ef4444"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; e.currentTarget.style.color = "#ef4444"; }}>
            Sign Out
          </button>
        </div>

      </div>
    </div>
  );
}
