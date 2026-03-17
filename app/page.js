"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";

const categories = [
  { name: "Necklaces", emoji: "📿", desc: "Chains & pendants" },
  { name: "Rings", emoji: "💍", desc: "Statement & everyday" },
  { name: "Earrings", emoji: "✨", desc: "Studs & drops" },
  { name: "Bracelets", emoji: "📿", desc: "Bangles & chains" },
  { name: "Anklets", emoji: "⭐", desc: "Delicate & bold" },
  { name: "Sets", emoji: "💎", desc: "Matching collections" },
];

const EMOJI_MAP = { Rings: "💍", Necklaces: "📿", Earrings: "✨", Bracelets: "📿", Anklets: "⭐", Sets: "💎", default: "💎" };

const perks = [
  ["🚚", "Free Shipping", "On orders over $30"],
  ["↩️", "Free Returns", "On all orders"],
  ["🔒", "Secure Payment", "100% protected"],
  ["💎", "Quality Guaranteed", "Premium materials"],
];

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ h: 5, m: 59, s: 59 });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imgErrors, setImgErrors] = useState({});

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => setIsLoggedIn(!!session));
    return () => subscription?.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase.from("products").select("*").limit(4);
        if (error) {
          console.error("Error fetching products:", error);
          setProducts([]);
        } else {
          setProducts(data || []);
        }
      } catch (e) {
        console.error("Error:", e);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setTimeLeft(p => {
        if (p.s > 0) return { ...p, s: p.s - 1 };
        if (p.m > 0) return { ...p, m: p.m - 1, s: 59 };
        if (p.h > 0) return { h: p.h - 1, m: 59, s: 59 };
        return { h: 5, m: 59, s: 59 };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const pad = n => String(n).padStart(2, "0");
  const shopLink = isLoggedIn ? "/users/products" : "/login";
  const S = { fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" };

  return (
    <div style={{ ...S, background: "#f0ebf8", minHeight: "100vh", color: "#1a1a2e" }}>

      {/* Promo bar */}
      <div style={{ background: "#6c3fc5", color: "#fff", padding: "8px 16px", display: "flex", justifyContent: "center", gap: "40px", flexWrap: "wrap", fontSize: "12px", letterSpacing: "0.5px" }}>
        <span>🚚 <strong>Free Shipping</strong> *T&Cs apply</span>
        <span>↩️ <strong>Free Returns</strong> On all orders *T&Cs apply</span>
        <span>🔒 <strong>No Hidden Fees</strong> Quality guaranteed</span>
      </div>

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #4e2d96 0%, #6c3fc5 50%, #9b72e0 100%)", color: "#fff", padding: "80px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "300px", height: "300px", borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        <div style={{ position: "absolute", bottom: "-80px", left: "-40px", width: "250px", height: "250px", borderRadius: "50%", background: "rgba(255,107,157,0.1)" }} />

        <div style={{ position: "relative", maxWidth: "700px", margin: "0 auto" }}>
          <p style={{ fontSize: "11px", letterSpacing: "5px", color: "#e4c9ff", marginBottom: "14px", fontWeight: "600", textTransform: "uppercase" }}>NEW COLLECTION 2026</p>
          <h1 style={{ fontSize: "clamp(32px,6vw,64px)", fontFamily: "Georgia,serif", fontWeight: "300", letterSpacing: "2px", margin: "0 0 18px", lineHeight: 1.1 }}>
            Discover Timeless<br />Elegance
          </h1>
          <p style={{ color: "#d4b8ff", fontSize: "15px", marginBottom: "36px" }}>Handcrafted jewelry that tells your story</p>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href={shopLink} style={{ background: "#fff", color: "#6c3fc5", padding: "13px 40px", textDecoration: "none", fontSize: "13px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", borderRadius: "8px", boxShadow: "0 4px 14px rgba(0,0,0,0.2)" }}>
              {isLoggedIn ? "SHOP NOW" : "GET STARTED"}
            </Link>
            <Link href="#features" style={{ background: "rgba(255,107,157,0.9)", color: "#fff", padding: "13px 40px", textDecoration: "none", fontSize: "13px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", borderRadius: "8px" }}>
              VIEW SALE
            </Link>
          </div>
        </div>
      </div>

      {/* Perks bar */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e4d8f8", borderTop: "1px solid #e4d8f8" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
          {perks.map(([icon, title, sub]) => (
            <div key={title} style={{ padding: "16px 28px", display: "flex", alignItems: "center", gap: "10px", borderRight: "1px solid #e4d8f8" }}>
              <span style={{ fontSize: "22px" }}>{icon}</span>
              <div>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "#1a1a2e" }}>{title}</div>
                <div style={{ fontSize: "11px", color: "#6b6b8a" }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 32px" }}>

        {/* Featured Products */}
        <div style={{ padding: "44px 0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "22px", flexWrap: "wrap" }}>
            <h2 style={{ fontSize: "20px", fontWeight: "700", margin: 0, color: "#1a1a2e" }}>⚡ FEATURED PRODUCTS</h2>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "12px", color: "#6b6b8a" }}>Ends in:</span>
              {[pad(timeLeft.h), pad(timeLeft.m), pad(timeLeft.s)].map((u, i) => (
                <span key={i} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ background: "#ff6b9d", color: "#fff", padding: "3px 8px", fontSize: "15px", fontWeight: "700", fontFamily: "monospace", borderRadius: "6px" }}>{u}</span>
                  {i < 2 && <span style={{ fontWeight: "700", color: "#ff6b9d" }}>:</span>}
                </span>
              ))}
            </div>
            <Link href={shopLink} style={{ marginLeft: "auto", fontSize: "13px", color: "#6c3fc5", textDecoration: "none", fontWeight: "700" }}>View All →</Link>
          </div>
          
          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>💍</div>
              <p style={{ color: "#6b6b8a", fontSize: "14px" }}>Loading featured products...</p>
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <p style={{ color: "#6b6b8a", fontSize: "14px" }}>No products available yet. Check back soon!</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(210px,1fr))", gap: "16px" }}>
              {products.map(product => (
                <Link key={product.id} href={shopLink} style={{ textDecoration: "none", color: "#1a1a2e" }}>
                  <div style={{ background: "#fff", border: "1px solid #e4d8f8", borderRadius: "12px", overflow: "hidden", cursor: "pointer", transition: "all 0.2s", boxShadow: "0 2px 8px rgba(108,63,197,0.06)" }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 24px rgba(108,63,197,0.18)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 8px rgba(108,63,197,0.06)"; e.currentTarget.style.transform = "none"; }}>
                    <div style={{ background: "linear-gradient(135deg, #f0ebf8, #e8dff5)", height: "200px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
                      {product.image_url && !imgErrors[product.id] ? (
                        <img src={product.image_url} alt={product.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                          onError={() => setImgErrors(prev => ({ ...prev, [product.id]: true }))} />
                      ) : (
                        <span style={{ fontSize: "72px" }}>{EMOJI_MAP[product.category] || EMOJI_MAP.default}</span>
                      )}
                    </div>
                    <div style={{ padding: "14px" }}>
                      <p style={{ fontSize: "13px", margin: "0 0 8px", fontWeight: "500", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{product.name}</p>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <span style={{ fontSize: "16px", fontWeight: "700", color: "#6c3fc5" }}>${Number(product.price).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>





        {/* Testimonials */}
        <div style={{ paddingBottom: "44px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "22px", textAlign: "center", color: "#1a1a2e" }}>What Customers Say</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: "16px" }}>
            {[["Sarah M.","Beautiful quality! Arrived perfectly packaged."],["James L.","Exactly what I was looking for. Highly recommend!"],["Anna R.","Amazing customer service and stunning pieces."]].map(([name,review]) => (
              <div key={name} style={{ background: "#fff", border: "1px solid #e4d8f8", padding: "22px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(108,63,197,0.06)" }}>
                <p style={{ color: "#ff6b9d", marginBottom: "10px", fontSize: "16px" }}>⭐⭐⭐⭐⭐</p>
                <p style={{ fontSize: "14px", color: "#4a4a6a", marginBottom: "12px", fontStyle: "italic" }}>"{review}"</p>
                <p style={{ fontSize: "13px", fontWeight: "700", color: "#6c3fc5" }}>— {name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Banners */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", paddingBottom: "48px" }}>
          <div style={{ background: "linear-gradient(135deg, #e8dff5, #d4c8f0)", padding: "44px 40px", borderRadius: "16px", border: "1px solid #c9b8e8" }}>
            <p style={{ fontSize: "11px", letterSpacing: "3px", color: "#9b72e0", textTransform: "uppercase", marginBottom: "8px", fontWeight: "600" }}>Just Arrived</p>
            <h3 style={{ fontSize: "28px", fontFamily: "Georgia,serif", fontWeight: "400", marginBottom: "20px", color: "#1a1a2e" }}>New Arrivals</h3>
            <Link href={shopLink} style={{ fontSize: "13px", fontWeight: "700", color: "#6c3fc5", textDecoration: "none", letterSpacing: "1px", borderBottom: "2px solid #6c3fc5", paddingBottom: "2px" }}>SHOP NOW →</Link>
          </div>
          <div style={{ background: "linear-gradient(135deg, #6c3fc5, #4e2d96)", padding: "44px 40px", borderRadius: "16px", color: "#fff" }}>
            <p style={{ fontSize: "11px", letterSpacing: "3px", color: "#ffb3d1", textTransform: "uppercase", marginBottom: "8px", fontWeight: "600" }}>Up to 60% Off</p>
            <h3 style={{ fontSize: "28px", fontFamily: "Georgia,serif", fontWeight: "400", marginBottom: "20px" }}>Sale Collection</h3>
            <Link href={shopLink} style={{ fontSize: "13px", fontWeight: "700", color: "#ff6b9d", textDecoration: "none", letterSpacing: "1px", borderBottom: "2px solid #ff6b9d", paddingBottom: "2px" }}>SHOP SALE →</Link>
          </div>
        </div>
      </div>

      {/* CTA */}
      {!isLoggedIn && (
        <div style={{ background: "linear-gradient(135deg, #4e2d96, #6c3fc5)", color: "#fff", padding: "60px 24px", textAlign: "center" }}>
          <h2 style={{ fontSize: "28px", fontFamily: "Georgia,serif", fontWeight: "400", marginBottom: "14px" }}>Ready to Find Your Perfect Piece?</h2>
          <p style={{ color: "#d4b8ff", fontSize: "14px", marginBottom: "32px" }}>Join thousands of happy customers who've found their favorite jewelry at GLEAMIA.</p>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/login" style={{ background: "#fff", color: "#6c3fc5", padding: "13px 40px", textDecoration: "none", fontSize: "13px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", borderRadius: "8px" }}>LOGIN</Link>
            <Link href="/signup" style={{ background: "#ff6b9d", color: "#fff", padding: "13px 40px", textDecoration: "none", fontSize: "13px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", borderRadius: "8px" }}>SIGN UP</Link>
          </div>
        </div>
      )}
    </div>
  );
}
