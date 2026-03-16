"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function NavBar() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [cartCount, setCartCount] = useState(0);

  const syncCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const total = cart.reduce((sum, i) => sum + i.quantity, 0);
    setCartCount(total);
  };

  useEffect(() => {
    syncCartCount();
    window.addEventListener("storage", syncCartCount);
    window.addEventListener("cartUpdated", syncCartCount);
    return () => {
      window.removeEventListener("storage", syncCartCount);
      window.removeEventListener("cartUpdated", syncCartCount);
    };
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        const { data, error } = await supabase.from("users").select("role").eq("id", session.user.id).single();
        setRole(data && !error ? data.role || "user" : "user");
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });
    return () => subscription?.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
  };

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 1000, fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>

      {/* Promo bar */}
      <div style={{ background: "#6c3fc5", color: "#fff", textAlign: "center", padding: "7px 16px", fontSize: "12px", letterSpacing: "0.5px" }}>
        💎 FREE SHIPPING ON ORDERS OVER $30 &nbsp;·&nbsp; USE CODE <strong>GLEAMIA10</strong> FOR 10% OFF
      </div>

      {/* Main nav */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e4d8f8", boxShadow: "0 2px 12px rgba(108,63,197,0.08)" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "12px 32px", display: "flex", alignItems: "center", gap: "24px" }}>

          <Link href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
            <span style={{ fontFamily: "Georgia, serif", fontSize: "24px", fontWeight: "700", letterSpacing: "4px", color: "#6c3fc5" }}>GLEAMIA</span>
          </Link>

          <div style={{ flex: 1, maxWidth: "500px", display: "flex", margin: "0 auto" }}>
            <input
              type="text"
              placeholder="Search for jewelry..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, padding: "9px 16px", border: "2px solid #d4c8f0", borderRight: "none", fontSize: "13px", outline: "none", borderRadius: "8px 0 0 8px", color: "#1a1a2e", fontFamily: "inherit" }}
              onFocus={e => e.target.style.borderColor = "#6c3fc5"}
              onBlur={e => e.target.style.borderColor = "#d4c8f0"}
            />
            <button style={{ background: "#6c3fc5", border: "none", padding: "0 16px", cursor: "pointer", borderRadius: "0 8px 8px 0", display: "flex", alignItems: "center" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "20px", flexShrink: 0 }}>
            {!loading && (
              <>
                {user ? (
                  <>
                    {role !== "admin" && (
                      <Link href="/users/cart" style={{ textDecoration: "none", color: "#6c3fc5", display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", fontSize: "11px", fontWeight: "600" }}>
                        <div style={{ position: "relative" }}>
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                          {cartCount > 0 && (
                            <span style={{ position: "absolute", top: "-6px", right: "-8px", background: "#ff6b9d", color: "#fff", borderRadius: "50%", width: "16px", height: "16px", fontSize: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700" }}>
                              {cartCount > 99 ? "99+" : cartCount}
                            </span>
                          )}
                        </div>
                        Cart
                      </Link>
                    )}
                    <Link href={role === "admin" ? "/admin" : "/users/profile"} style={{ textDecoration: "none", color: "#6c3fc5", display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", fontSize: "11px", fontWeight: "600" }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      {role === "admin" ? "Dashboard" : "Profile"}
                    </Link>
                    <button onClick={handleLogout} style={{ background: "#6c3fc5", color: "#fff", border: "none", padding: "8px 18px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer", transition: "background 0.2s" }}
                      onMouseEnter={e => e.target.style.background = "#4e2d96"}
                      onMouseLeave={e => e.target.style.background = "#6c3fc5"}>
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" style={{ textDecoration: "none", color: "#6c3fc5", fontSize: "13px", fontWeight: "600", display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      Sign In
                    </Link>
                    <Link href="/signup" style={{ background: "#6c3fc5", color: "#fff", textDecoration: "none", padding: "9px 20px", borderRadius: "8px", fontSize: "13px", fontWeight: "700", boxShadow: "0 4px 12px rgba(108,63,197,0.3)" }}>
                      Sign Up
                    </Link>
                  </>
                )}
              </>
            )}
            <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6c3fc5", fontSize: "22px", display: "flex", alignItems: "center" }}>
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </div>

      {/* Category nav */}
      <div style={{ background: "#faf8fe", borderBottom: "1px solid #e4d8f8", overflowX: "auto" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 32px", display: "flex" }}>
          {["New In", "Sale", "Necklaces", "Rings", "Earrings", "Bracelets", "Anklets", "Sets", "Gift Ideas"].map(cat => (
            <Link key={cat}
              href={user ? `/users/products?category=${encodeURIComponent(cat)}` : "/login"}
              style={{ textDecoration: "none", color: cat === "Sale" ? "#ff6b9d" : "#4a4a6a", fontSize: "13px", fontWeight: cat === "New In" || cat === "Sale" ? "700" : "500", padding: "10px 14px", whiteSpace: "nowrap", display: "block", borderBottom: "2px solid transparent", transition: "all 0.2s" }}
              onMouseEnter={e => { e.target.style.color = "#6c3fc5"; e.target.style.borderBottomColor = "#6c3fc5"; }}
              onMouseLeave={e => { e.target.style.color = cat === "Sale" ? "#ff6b9d" : "#4a4a6a"; e.target.style.borderBottomColor = "transparent"; }}>
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ background: "#fff", borderBottom: "1px solid #e4d8f8", padding: "16px 24px", boxShadow: "0 4px 12px rgba(108,63,197,0.1)" }}>
          {[["Home", "/"], ...(user ? (role === "admin" ? [["📊 Dashboard", "/admin"], ["Products", "/admin/products"]] : [["Products", "/users/products"], ["🛒 Cart", "/users/cart"], ["👤 Profile", "/users/profile"]]) : [["Login", "/login"], ["Sign Up", "/signup"]])].map(([label, href]) => (
            <Link key={label} href={href} onClick={() => setMenuOpen(false)}
              style={{ display: "block", padding: "10px 12px", color: "#1a1a2e", textDecoration: "none", fontSize: "14px", fontWeight: "500", borderRadius: "8px", marginBottom: "4px" }}
              onMouseEnter={e => e.currentTarget.style.background = "#f0ebf8"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              {label}
            </Link>
          ))}
          {user && (
            <button onClick={handleLogout} style={{ width: "100%", marginTop: "8px", background: "#6c3fc5", color: "#fff", border: "none", padding: "10px", borderRadius: "8px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
}