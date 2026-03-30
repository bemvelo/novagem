"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "../lib/supabase";

const EMOJI_MAP = { Rings: "💍", Necklaces: "📿", Earrings: "✨", Bracelets: "📿", Anklets: "⭐", Sets: "💎", default: "💎" };

const perks = [
  ["🚚", "Free Shipping", "On orders over $30"],
  ["↩️", "Free Returns", "On all orders"],
  ["🔒", "Secure Payment", "100% protected"],
  ["💎", "Quality Guaranteed", "Premium materials"],
];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500;600;700&display=swap');

  :root {
    --rose-gold: #b76e79;
    --rose-gold-light: #d4a0a7;
    --rose-gold-pale: #f2dce0;
    --cream: #fdf6f0;
    --cream-dark: #f5ece3;
    --cream-border: #e8d8cc;
    --champagne: #f0d9c8;
    --dark: #2c1810;
    --dark-mid: #5a3e38;
    --muted: #9a7b74;
    --white: #ffffff;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Jost', sans-serif;
    background: var(--cream);
    color: var(--dark);
  }

  .promo-bar {
    background: var(--dark);
    color: var(--champagne);
    padding: 9px 16px;
    display: flex;
    justify-content: center;
    gap: 40px;
    flex-wrap: wrap;
    font-size: 11px;
    letter-spacing: 1.5px;
    font-weight: 400;
    font-family: 'Jost', sans-serif;
    text-transform: uppercase;
  }

  .promo-bar strong { color: var(--rose-gold-light); font-weight: 600; }

  .hero {
    background: linear-gradient(160deg, #2c1810 0%, #4a2820 40%, #6b3a30 70%, #8b4a3a 100%);
    color: var(--white);
    padding: 100px 24px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  .hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 70% 50%, rgba(183,110,121,0.25) 0%, transparent 60%),
                radial-gradient(ellipse at 20% 80%, rgba(212,160,167,0.15) 0%, transparent 50%);
  }

  .hero-orb-1 {
    position: absolute;
    top: -80px;
    right: -80px;
    width: 360px;
    height: 360px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(183,110,121,0.2) 0%, transparent 70%);
  }

  .hero-orb-2 {
    position: absolute;
    bottom: -100px;
    left: -60px;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(240,217,200,0.1) 0%, transparent 70%);
  }

  .hero-content {
    position: relative;
    max-width: 720px;
    margin: 0 auto;
    animation: fadeUp 1s ease both;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .hero-eyebrow {
    font-size: 10px;
    letter-spacing: 6px;
    color: var(--rose-gold-light);
    margin-bottom: 18px;
    font-weight: 600;
    text-transform: uppercase;
    font-family: 'Jost', sans-serif;
  }

  .hero-brand {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(52px, 10vw, 96px);
    font-weight: 300;
    letter-spacing: 12px;
    margin-bottom: 6px;
    color: var(--white);
    line-height: 1;
  }

  .hero-tagline-small {
    font-size: 11px;
    letter-spacing: 4px;
    color: var(--rose-gold-light);
    font-weight: 300;
    text-transform: uppercase;
    margin-bottom: 18px;
    font-family: 'Jost', sans-serif;
  }

  .hero-headline {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(20px, 3vw, 28px);
    font-weight: 300;
    font-style: italic;
    letter-spacing: 1px;
    margin-bottom: 14px;
    color: var(--champagne);
    line-height: 1.4;
  }

  .hero-sub {
    color: rgba(240,217,200,0.7);
    font-size: 13px;
    margin-bottom: 44px;
    letter-spacing: 0.5px;
    font-weight: 300;
  }

  .hero-divider {
    width: 60px;
    height: 1px;
    background: linear-gradient(to right, transparent, var(--rose-gold-light), transparent);
    margin: 0 auto 44px;
  }

  .btn-primary {
    background: linear-gradient(135deg, var(--rose-gold), #c4808b);
    color: var(--white);
    padding: 14px 44px;
    text-decoration: none;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    border-radius: 2px;
    font-family: 'Jost', sans-serif;
    transition: all 0.3s ease;
    display: inline-block;
    box-shadow: 0 4px 20px rgba(183,110,121,0.4);
  }

  .btn-primary:hover {
    background: linear-gradient(135deg, #c4808b, var(--rose-gold));
    transform: translateY(-1px);
    box-shadow: 0 6px 28px rgba(183,110,121,0.5);
  }

  .btn-outline {
    background: transparent;
    color: var(--champagne);
    padding: 13px 44px;
    text-decoration: none;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    border-radius: 2px;
    border: 1px solid rgba(240,217,200,0.4);
    font-family: 'Jost', sans-serif;
    transition: all 0.3s ease;
    display: inline-block;
  }

  .btn-outline:hover {
    border-color: var(--rose-gold-light);
    color: var(--rose-gold-light);
  }

  .perks-bar {
    background: var(--white);
    border-bottom: 1px solid var(--cream-border);
    border-top: 1px solid var(--cream-border);
  }

  .perks-inner {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }

  .perk-item {
    padding: 18px 32px;
    display: flex;
    align-items: center;
    gap: 12px;
    border-right: 1px solid var(--cream-border);
  }

  .perk-title { font-size: 12px; font-weight: 600; color: var(--dark); letter-spacing: 0.5px; }
  .perk-sub { font-size: 11px; color: var(--muted); margin-top: 2px; }

  .section-wrap {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 32px;
  }

  .section-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 28px;
    flex-wrap: wrap;
    padding-top: 52px;
  }

  .section-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px;
    font-weight: 400;
    color: var(--dark);
    letter-spacing: 1px;
  }

  .timer-unit {
    background: var(--rose-gold);
    color: var(--white);
    padding: 4px 9px;
    font-size: 14px;
    font-weight: 700;
    font-family: 'Jost', sans-serif;
    border-radius: 3px;
    min-width: 32px;
    text-align: center;
  }

  .view-all {
    margin-left: auto;
    font-size: 11px;
    color: var(--rose-gold);
    text-decoration: none;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    border-bottom: 1px solid var(--rose-gold-pale);
    padding-bottom: 2px;
    transition: border-color 0.2s;
  }

  .view-all:hover { border-color: var(--rose-gold); }

  .products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 20px;
    padding-bottom: 52px;
  }

  .product-card {
    background: var(--white);
    border: 1px solid var(--cream-border);
    border-radius: 4px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 12px rgba(44,24,16,0.04);
  }

  .product-card:hover {
    box-shadow: 0 12px 32px rgba(183,110,121,0.18);
    transform: translateY(-3px);
    border-color: var(--rose-gold-pale);
  }

  .product-img-wrap {
    background: linear-gradient(135deg, var(--cream-dark), var(--champagne));
    height: 210px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
  }

  .product-info { padding: 16px; }

  .product-name {
    font-size: 13px;
    margin-bottom: 8px;
    font-weight: 400;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--dark-mid);
    letter-spacing: 0.3px;
  }

  .product-price {
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px;
    font-weight: 600;
    color: var(--rose-gold);
    letter-spacing: 0.5px;
  }

  .reviews-section { padding-bottom: 52px; }

  .reviews-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 28px;
    font-weight: 300;
    font-style: italic;
    margin-bottom: 28px;
    text-align: center;
    color: var(--dark);
  }

  .reviews-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
    gap: 18px;
  }

  .review-card {
    background: var(--white);
    border: 1px solid var(--cream-border);
    padding: 24px;
    border-radius: 4px;
    box-shadow: 0 2px 12px rgba(44,24,16,0.04);
    position: relative;
  }

  .review-card::before {
    content: '"';
    position: absolute;
    top: 12px;
    right: 20px;
    font-family: 'Cormorant Garamond', serif;
    font-size: 72px;
    color: var(--rose-gold-pale);
    line-height: 1;
  }

  .review-stars { color: var(--rose-gold); margin-bottom: 12px; font-size: 13px; letter-spacing: 2px; }
  .review-text { font-size: 13px; color: var(--dark-mid); margin-bottom: 14px; font-style: italic; line-height: 1.6; font-weight: 300; }
  .review-author { font-size: 12px; font-weight: 600; color: var(--rose-gold); letter-spacing: 1px; text-transform: uppercase; }

  .banners-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    padding-bottom: 56px;
  }

  .banner-light {
    background: linear-gradient(135deg, var(--champagne), var(--cream-dark));
    padding: 52px 44px;
    border-radius: 4px;
    border: 1px solid var(--cream-border);
  }

  .banner-dark {
    background: linear-gradient(135deg, var(--dark), #4a2820);
    padding: 52px 44px;
    border-radius: 4px;
    color: var(--white);
    position: relative;
    overflow: hidden;
  }

  .banner-dark::after {
    content: '';
    position: absolute;
    top: -40px;
    right: -40px;
    width: 180px;
    height: 180px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(183,110,121,0.3) 0%, transparent 70%);
  }

  .banner-eyebrow {
    font-size: 10px;
    letter-spacing: 4px;
    text-transform: uppercase;
    font-weight: 600;
    margin-bottom: 10px;
    color: var(--rose-gold);
    font-family: 'Jost', sans-serif;
  }

  .banner-dark .banner-eyebrow { color: var(--rose-gold-light); }

  .banner-heading {
    font-family: 'Cormorant Garamond', serif;
    font-size: 32px;
    font-weight: 300;
    margin-bottom: 22px;
    color: var(--dark);
    line-height: 1.2;
  }

  .banner-dark .banner-heading { color: var(--white); }

  .banner-link {
    font-size: 11px;
    font-weight: 600;
    color: var(--rose-gold);
    text-decoration: none;
    letter-spacing: 2px;
    text-transform: uppercase;
    border-bottom: 1px solid var(--rose-gold);
    padding-bottom: 2px;
    font-family: 'Jost', sans-serif;
    transition: opacity 0.2s;
  }

  .banner-dark .banner-link { color: var(--rose-gold-light); border-color: var(--rose-gold-light); }
  .banner-link:hover { opacity: 0.7; }

  .cta-section {
    background: linear-gradient(160deg, #2c1810, #4a2820 60%, #6b3a30);
    color: var(--white);
    padding: 80px 24px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  .cta-section::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 50% 50%, rgba(183,110,121,0.2) 0%, transparent 65%);
  }

  .cta-content { position: relative; }

  .cta-eyebrow {
    font-size: 10px;
    letter-spacing: 5px;
    color: var(--rose-gold-light);
    text-transform: uppercase;
    margin-bottom: 16px;
    font-weight: 600;
    font-family: 'Jost', sans-serif;
  }

  .cta-heading {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(26px, 4vw, 40px);
    font-weight: 300;
    font-style: italic;
    margin-bottom: 14px;
    color: var(--white);
  }

  .cta-sub {
    color: rgba(240,217,200,0.65);
    font-size: 13px;
    margin-bottom: 40px;
    font-weight: 300;
    letter-spacing: 0.5px;
  }

  .cta-buttons {
    display: flex;
    gap: 14px;
    justify-content: center;
    flex-wrap: wrap;
  }

  .btn-cta-login {
    background: transparent;
    color: var(--champagne);
    padding: 13px 40px;
    text-decoration: none;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    border-radius: 2px;
    border: 1px solid rgba(240,217,200,0.35);
    font-family: 'Jost', sans-serif;
    transition: all 0.3s;
  }

  .btn-cta-login:hover { border-color: var(--rose-gold-light); color: var(--rose-gold-light); }

  .btn-cta-signup {
    background: linear-gradient(135deg, var(--rose-gold), #c4808b);
    color: var(--white);
    padding: 14px 40px;
    text-decoration: none;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    border-radius: 2px;
    font-family: 'Jost', sans-serif;
    transition: all 0.3s;
    box-shadow: 0 4px 18px rgba(183,110,121,0.4);
  }

  .btn-cta-signup:hover { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(183,110,121,0.5); }

  .loading-state {
    text-align: center;
    padding: 70px 0;
  }

  .timer-sep { font-weight: 700; color: var(--rose-gold); margin: 0 1px; }

  @media (max-width: 640px) {
    .banners-grid { grid-template-columns: 1fr; }
    .hero { padding: 72px 20px; }
    .section-wrap { padding: 0 16px; }
    .perk-item { padding: 14px 18px; }
  }
`;

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
        if (error) { console.error("Error fetching products:", error); setProducts([]); }
        else { setProducts(data || []); }
      } catch (e) { console.error("Error:", e); setProducts([]); }
      finally { setLoading(false); }
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

  return (
    <>
      <style>{styles}</style>
      <div style={{ minHeight: "100vh" }}>

        {/* Promo bar */}
        <div className="promo-bar">
          <span> <strong>Free Delivery</strong> · T&Cs Apply</span>
          <span>↩<strong>Free Returns</strong> · All Orders</span>
          <span> <strong>No Hidden Fees</strong> · Guaranteed</span>
        </div>

        {/* Hero */}
        <div className="hero">
          <div className="hero-orb-1" />
          <div className="hero-orb-2" />
          <div className="hero-content">
            <p className="hero-eyebrow">New Collection · 2026</p>
            <h1 className="hero-brand">NOVAGEM</h1>
            <p className="hero-tagline-small">Where Tech Meets Elegance</p>
            <div className="hero-divider" />
            <p className="hero-headline">Discover Timeless Elegance</p>
            <p className="hero-sub">Jewelry that tells your story</p>
            <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href={shopLink} className="btn-primary">
                {isLoggedIn ? "Shop Now" : "Get Started"}
              </Link>
              <Link href="#features" className="btn-outline">View Sale</Link>
            </div>
          </div>
        </div>

        {/* Perks */}
        <div className="perks-bar">
          <div className="perks-inner">
            {perks.map(([icon, title, sub]) => (
              <div key={title} className="perk-item">
                <span style={{ fontSize: "22px" }}>{icon}</span>
                <div>
                  <div className="perk-title">{title}</div>
                  <div className="perk-sub">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="section-wrap">

          {/* Featured Products */}
          <div className="section-header">
            <h2 className="section-title">✦ Featured Products</h2>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "11px", color: "var(--muted)", letterSpacing: "0.5px" }}>Ends in:</span>
              {[pad(timeLeft.h), pad(timeLeft.m), pad(timeLeft.s)].map((u, i) => (
                <span key={i} style={{ display: "flex", alignItems: "center" }}>
                  <span className="timer-unit">{u}</span>
                  {i < 2 && <span className="timer-sep"> : </span>}
                </span>
              ))}
            </div>
            <Link href={shopLink} className="view-all">View All →</Link>
          </div>

          {loading ? (
            <div className="loading-state">
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>💍</div>
              <p style={{ color: "var(--muted)", fontSize: "14px", fontWeight: "300" }}>Loading featured products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="loading-state">
              <p style={{ color: "var(--muted)", fontSize: "14px" }}>No products available yet. Check back soon!</p>
            </div>
          ) : (
            <div className="products-grid">
              {products.map(product => (
                <Link key={product.id} href={shopLink} style={{ textDecoration: "none" }}>
                  <div className="product-card">
                    <div className="product-img-wrap">
                      {product.image_url && !imgErrors[product.id] ? (
                        <Image src={product.image_url} alt={product.name} width={260} height={260}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          onError={() => setImgErrors(prev => ({ ...prev, [product.id]: true }))} />
                      ) : (
                        <span style={{ fontSize: "72px" }}>{EMOJI_MAP[product.category] || EMOJI_MAP.default}</span>
                      )}
                    </div>
                    <div className="product-info">
                      <p className="product-name">{product.name}</p>
                      <span className="product-price">${Number(product.price).toFixed(2)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Testimonials */}
          <div className="reviews-section">
            <h2 className="reviews-title">What Our Customers Say</h2>
            <div className="reviews-grid">
              {[
                ["Sarah M.", "Beautiful quality! Arrived perfectly packaged."],
                ["James L.", "Exactly what I was looking for. Highly recommend!"],
                ["Anna R.", "Amazing customer service and stunning pieces."]
              ].map(([name, review]) => (
                <div key={name} className="review-card">
                  <p className="review-stars">★ ★ ★ ★ ★</p>
                  <p className="review-text">{review}</p>
                  <p className="review-author">— {name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Banners */}
          <div className="banners-grid">
            <div className="banner-light">
              <p className="banner-eyebrow">Just Arrived</p>
              <h3 className="banner-heading">New Arrivals</h3>
              <Link href={shopLink} className="banner-link">Shop Now →</Link>
            </div>
            <div className="banner-dark">
              <p className="banner-eyebrow">Up to 60% Off</p>
              <h3 className="banner-heading">Sale Collection</h3>
              <Link href={shopLink} className="banner-link">Shop Sale →</Link>
            </div>
          </div>

        </div>

        {/* CTA */}
        {!isLoggedIn && (
          <div className="cta-section">
            <div className="cta-content">
              <p className="cta-eyebrow">Join Novagem</p>
              <h2 className="cta-heading">Ready to Find Your Perfect Piece?</h2>
              <p className="cta-sub">Join thousands of happy customers who have found their favourite jewelry at Novagem.</p>
              <div className="cta-buttons">
                <Link href="/login" className="btn-cta-login">Login</Link>
                <Link href="/signup" className="btn-cta-signup">Sign Up</Link>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
