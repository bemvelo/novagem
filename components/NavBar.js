"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const navStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Jost:wght@300;400;500;600;700&display=swap');

  :root {
    --rose-gold: #b76e79;
    --rose-gold-light: #d4a0a7;
    --rose-gold-pale: #f2dce0;
    --cream: #fdf6f0;
    --cream-border: #e8d8cc;
    --champagne: #f0d9c8;
    --dark: #2c1810;
    --dark-mid: #5a3e38;
    --muted: #9a7b74;
    --white: #ffffff;
  }

  .nav-promo {
    background: var(--dark);
    color: var(--champagne);
    text-align: center;
    padding: 8px 16px;
    font-size: 11px;
    letter-spacing: 2px;
    font-family: 'Jost', sans-serif;
    font-weight: 400;
    text-transform: uppercase;
  }

  .nav-promo strong {
    color: var(--rose-gold-light);
    font-weight: 600;
  }

  .nav-main {
    background: var(--white);
    border-bottom: 1px solid var(--cream-border);
    box-shadow: 0 2px 16px rgba(44,24,16,0.07);
  }

  .nav-inner {
    max-width: 1400px;
    margin: 0 auto;
    padding: 14px 32px;
    display: flex;
    align-items: center;
    gap: 24px;
  }

  .nav-logo {
    text-decoration: none;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    line-height: 1;
  }

  .nav-logo-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 26px;
    font-weight: 600;
    letter-spacing: 6px;
    color: var(--dark);
    text-transform: uppercase;
  }

  .nav-logo-tag {
    font-family: 'Jost', sans-serif;
    font-size: 8px;
    letter-spacing: 3px;
    color: var(--rose-gold);
    text-transform: uppercase;
    font-weight: 400;
    margin-top: 2px;
  }

  .nav-search-wrap {
    flex: 1;
    max-width: 480px;
    display: flex;
    margin: 0 auto;
  }

  .nav-search-input {
    flex: 1;
    padding: 9px 16px;
    border: 1.5px solid var(--cream-border);
    border-right: none;
    font-size: 13px;
    outline: none;
    border-radius: 2px 0 0 2px;
    color: var(--dark);
    font-family: 'Jost', sans-serif;
    background: var(--cream);
    transition: border-color 0.2s;
    font-weight: 300;
  }

  .nav-search-input::placeholder { color: var(--muted); }
  .nav-search-input:focus { border-color: var(--rose-gold); background: var(--white); }

  .nav-search-btn {
    background: var(--rose-gold);
    border: none;
    padding: 0 16px;
    cursor: pointer;
    border-radius: 0 2px 2px 0;
    display: flex;
    align-items: center;
    transition: background 0.2s;
  }

  .nav-search-btn:hover { background: var(--dark-mid); }

  .nav-actions {
    display: flex;
    align-items: center;
    gap: 20px;
    flex-shrink: 0;
  }

  .nav-icon-btn {
    text-decoration: none;
    color: var(--dark-mid);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.5px;
    font-family: 'Jost', sans-serif;
    transition: color 0.2s;
    text-transform: uppercase;
  }

  .nav-icon-btn:hover { color: var(--rose-gold); }

  .cart-badge {
    position: absolute;
    top: -6px;
    right: -8px;
    background: var(--rose-gold);
    color: var(--white);
    border-radius: 50%;
    width: 16px;
    height: 16px;
    font-size: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-family: 'Jost', sans-serif;
  }

  .nav-btn-logout {
    background: transparent;
    color: var(--dark-mid);
    border: 1.5px solid var(--cream-border);
    padding: 8px 18px;
    border-radius: 2px;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'Jost', sans-serif;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .nav-btn-logout:hover {
    border-color: var(--rose-gold);
    color: var(--rose-gold);
  }

  .nav-btn-signup {
    background: linear-gradient(135deg, var(--rose-gold), #c4808b);
    color: var(--white);
    text-decoration: none;
    padding: 9px 20px;
    border-radius: 2px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    font-family: 'Jost', sans-serif;
    transition: all 0.2s;
    box-shadow: 0 3px 12px rgba(183,110,121,0.3);
  }

  .nav-btn-signup:hover {
    transform: translateY(-1px);
    box-shadow: 0 5px 18px rgba(183,110,121,0.4);
  }

  .nav-hamburger {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--dark-mid);
    font-size: 20px;
    display: flex;
    align-items: center;
    padding: 4px;
    transition: color 0.2s;
  }

  .nav-hamburger:hover { color: var(--rose-gold); }

  .nav-mobile-menu {
    background: var(--white);
    border-bottom: 1px solid var(--cream-border);
    padding: 16px 24px;
    box-shadow: 0 6px 20px rgba(44,24,16,0.08);
  }

  .nav-mobile-link {
    display: block;
    padding: 11px 14px;
    color: var(--dark-mid);
    text-decoration: none;
    font-size: 13px;
    font-weight: 400;
    border-radius: 2px;
    margin-bottom: 2px;
    font-family: 'Jost', sans-serif;
    letter-spacing: 0.5px;
    transition: all 0.15s;
  }

  .nav-mobile-link:hover {
    background: var(--cream);
    color: var(--rose-gold);
    padding-left: 20px;
  }

  .nav-mobile-logout {
    width: 100%;
    margin-top: 10px;
    background: linear-gradient(135deg, var(--rose-gold), #c4808b);
    color: var(--white);
    border: none;
    padding: 11px;
    border-radius: 2px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    font-family: 'Jost', sans-serif;
    transition: opacity 0.2s;
  }

  .nav-mobile-logout:hover { opacity: 0.85; }

  .nav-divider {
    width: 1px;
    height: 28px;
    background: var(--cream-border);
  }
`;

export default function NavBar() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [cartCount, setCartCount] = useState(() => {
    if (typeof window === "undefined") return 0;
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      return cart.reduce((sum, i) => sum + i.quantity, 0);
    } catch {
      return 0;
    }
  });

  const syncCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const total = cart.reduce((sum, i) => sum + i.quantity, 0);
    setCartCount(total);
  };

  useEffect(() => {
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

  const mobileLinks = user
    ? role === "admin"
      ? [["Home", "/"], ["📊 Dashboard", "/admin"], ["Products", "/admin/products"]]
      : [["Home", "/"], ["Products", "/users/products"], ["🛒 Cart", "/users/cart"], ["👤 Profile", "/users/profile"]]
    : [["Home", "/"], ["Login", "/login"], ["Sign Up", "/signup"]];

  return (
    <>
      <style>{navStyles}</style>
      <header style={{ position: "sticky", top: 0, zIndex: 1000 }}>

        {/* Promo bar */}
        <div className="nav-promo">
          💎 Free Shipping on orders over $30 &nbsp;·&nbsp; Use code <strong>NOVAGEM10</strong> for 10% off
        </div>

        {/* Main nav */}
        <div className="nav-main">
          <div className="nav-inner">

            {/* Logo */}
            <Link href="/" className="nav-logo">
              <span className="nav-logo-name">Novagem</span>
              <span className="nav-logo-tag">Where Tech Meets Elegance</span>
            </Link>

            {/* Search */}
            <div className="nav-search-wrap">
              <input
                type="text"
                placeholder="Search for jewelry..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="nav-search-input"
              />
              <button className="nav-search-btn">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
              </button>
            </div>

            {/* Actions */}
            <div className="nav-actions">
              {!loading && (
                <>
                  {user ? (
                    <>
                      {role !== "admin" && (
                        <Link href="/users/cart" className="nav-icon-btn">
                          <div style={{ position: "relative" }}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                              <line x1="3" y1="6" x2="21" y2="6"/>
                              <path d="M16 10a4 4 0 0 1-8 0"/>
                            </svg>
                            {cartCount > 0 && (
                              <span className="cart-badge">{cartCount > 99 ? "99+" : cartCount}</span>
                            )}
                          </div>
                          Cart
                        </Link>
                      )}

                      <div className="nav-divider" />

                      <Link href={role === "admin" ? "/admin" : "/users/profile"} className="nav-icon-btn">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                          <circle cx="12" cy="7" r="4"/>
                        </svg>
                        {role === "admin" ? "Dashboard" : "Profile"}
                      </Link>

                      <button onClick={handleLogout} className="nav-btn-logout">Logout</button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" className="nav-icon-btn">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                          <circle cx="12" cy="7" r="4"/>
                        </svg>
                        Sign In
                      </Link>
                      <Link href="/signup" className="nav-btn-signup">Sign Up</Link>
                    </>
                  )}
                </>
              )}

              <button onClick={() => setMenuOpen(!menuOpen)} className="nav-hamburger">
                {menuOpen ? "✕" : "☰"}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="nav-mobile-menu">
            {mobileLinks.map(([label, href]) => (
              <Link key={label} href={href} className="nav-mobile-link" onClick={() => setMenuOpen(false)}>
                {label}
              </Link>
            ))}
            {user && (
              <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="nav-mobile-logout">
                Logout
              </button>
            )}
          </div>
        )}

      </header>
    </>
  );
}
