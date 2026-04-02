"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import Link from "next/link";

const CATEGORIES = ["All", "Rings", "Necklaces", "Earrings", "Bracelets", "Anklets", "Sets"];
const EMOJI_MAP = { Rings: "💍", Necklaces: "📿", Earrings: "✨", Bracelets: "📿", Anklets: "⭐", Sets: "💎", default: "💎" };

const adminStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500;600;700&display=swap');

  :root {
    --rose-gold: #b76e79;
    --rose-gold-light: #d4a0a7;
    --rose-gold-pale: #f2dce0;
    --rose-gold-deep: #9a5460;
    --cream: #fdf6f0;
    --cream-dark: #f5ece3;
    --cream-border: #e8d8cc;
    --champagne: #f0d9c8;
    --dark: #2c1810;
    --dark-mid: #5a3e38;
    --muted: #9a7b74;
    --white: #ffffff;
    --danger: #b85c5c;
    --danger-pale: #f9eded;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .admin-page {
    min-height: 100vh;
    background: var(--cream);
    font-family: 'Jost', sans-serif;
    color: var(--dark);
  }

  /* Hero */
  .admin-hero {
    background: linear-gradient(135deg, #2c1810 0%, #5a3e38 55%, #b76e79 100%);
    padding: 48px 40px 72px;
    position: relative;
    overflow: hidden;
  }

  .admin-hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 80% 40%, rgba(240,217,200,0.15) 0%, transparent 60%);
    pointer-events: none;
  }

  .admin-hero-orb-1 {
    position: absolute;
    top: -100px; right: -80px;
    width: 360px; height: 360px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(183,110,121,0.25) 0%, transparent 65%);
    pointer-events: none;
  }

  .admin-hero-orb-2 {
    position: absolute;
    bottom: -60px; left: -40px;
    width: 240px; height: 240px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(44,24,16,0.2) 0%, transparent 65%);
    pointer-events: none;
  }

  .admin-hero-inner {
    max-width: 1300px;
    margin: 0 auto;
    position: relative;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 20px;
  }

  .admin-hero-breadcrumb {
    font-size: 10px;
    letter-spacing: 4px;
    color: var(--rose-gold-light);
    text-transform: uppercase;
    font-weight: 600;
    margin-bottom: 12px;
  }

  .admin-hero-breadcrumb a {
    color: var(--champagne);
    text-decoration: none;
    transition: color 0.2s;
  }

  .admin-hero-breadcrumb a:hover { color: var(--white); }

  .admin-hero-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(26px, 4vw, 46px);
    font-weight: 300;
    letter-spacing: 3px;
    color: var(--white);
    margin-bottom: 8px;
    line-height: 1.1;
  }

  .admin-hero-sub {
    font-size: 13px;
    color: rgba(240,217,200,0.7);
    font-weight: 300;
    letter-spacing: 0.5px;
  }

  .admin-hero-sub strong { color: var(--champagne); font-weight: 600; }

  .admin-add-btn {
    background: linear-gradient(135deg, var(--champagne), #e8c9a8);
    color: var(--dark);
    border: none;
    padding: 14px 30px;
    border-radius: 2px;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    font-family: 'Jost', sans-serif;
    letter-spacing: 2px;
    text-transform: uppercase;
    box-shadow: 0 6px 20px rgba(44,24,16,0.3);
    transition: all 0.2s;
    white-space: nowrap;
  }

  .admin-add-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 28px rgba(44,24,16,0.4);
  }

  /* Main content */
  .admin-content {
    max-width: 1300px;
    margin: -36px auto 0;
    padding: 0 40px 60px;
    position: relative;
    z-index: 1;
  }

  /* Filter bar */
  .admin-filter-bar {
    background: var(--white);
    border-radius: 4px;
    padding: 24px 28px;
    margin-bottom: 26px;
    border: 1px solid var(--cream-border);
    box-shadow: 0 4px 24px rgba(44,24,16,0.08);
    animation: fadeUp 0.5s ease both;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .admin-search-wrap {
    position: relative;
    margin-bottom: 18px;
  }

  .admin-search-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
  }

  .admin-search-input {
    width: 100%;
    padding: 13px 16px 13px 46px;
    border: 1.5px solid var(--cream-border);
    border-radius: 2px;
    font-size: 13px;
    color: var(--dark);
    background: var(--cream);
    outline: none;
    font-family: 'Jost', sans-serif;
    font-weight: 300;
    transition: all 0.2s;
  }

  .admin-search-input::placeholder { color: var(--muted); }
  .admin-search-input:focus {
    border-color: var(--rose-gold);
    background: var(--white);
    box-shadow: 0 0 0 3px rgba(183,110,121,0.08);
  }

  .admin-filter-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
  }

  .admin-cats {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .admin-cat-btn {
    padding: 6px 16px;
    border-radius: 2px;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    border: 1.5px solid var(--cream-border);
    background: transparent;
    color: var(--muted);
    font-family: 'Jost', sans-serif;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    transition: all 0.18s;
  }

  .admin-cat-btn:hover {
    border-color: var(--rose-gold-light);
    color: var(--rose-gold);
  }

  .admin-cat-btn.active {
    background: var(--rose-gold);
    border-color: var(--rose-gold);
    color: var(--white);
  }

  .admin-filter-meta {
    font-size: 12px;
    color: var(--muted);
    font-weight: 300;
  }

  .admin-filter-meta strong { color: var(--rose-gold); font-weight: 600; }

  /* Grid */
  .admin-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(268px, 1fr));
    gap: 20px;
    animation: fadeUp 0.6s ease 0.1s both;
  }

  .admin-card {
    background: var(--white);
    border-radius: 4px;
    overflow: hidden;
    border: 1px solid var(--cream-border);
    box-shadow: 0 2px 10px rgba(44,24,16,0.05);
    transition: all 0.25s;
    display: flex;
    flex-direction: column;
  }

  .admin-card:hover {
    box-shadow: 0 12px 32px rgba(183,110,121,0.16);
    transform: translateY(-3px);
    border-color: var(--rose-gold-pale);
  }

  .admin-card-img {
    height: 196px;
    background: linear-gradient(135deg, var(--cream-dark), var(--champagne));
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    flex-shrink: 0;
  }

  .admin-card-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .admin-card-cat-badge {
    position: absolute;
    top: 10px; left: 10px;
    background: rgba(44,24,16,0.75);
    color: var(--champagne);
    font-size: 9px;
    font-weight: 700;
    padding: 3px 10px;
    border-radius: 2px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    backdrop-filter: blur(4px);
    font-family: 'Jost', sans-serif;
  }

  .admin-card-body {
    padding: 16px 18px 18px;
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .admin-card-name {
    font-size: 14px;
    font-weight: 500;
    color: var(--dark);
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    letter-spacing: 0.3px;
  }

  .admin-card-price {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px;
    font-weight: 600;
    color: var(--rose-gold);
    margin-bottom: 14px;
    letter-spacing: 0.5px;
  }

  .admin-card-actions {
    display: flex;
    gap: 8px;
    margin-top: auto;
  }

  .admin-btn-edit {
    flex: 1;
    background: linear-gradient(135deg, var(--rose-gold), #c4808b);
    color: var(--white);
    border: none;
    padding: 9px 12px;
    border-radius: 2px;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    font-family: 'Jost', sans-serif;
    letter-spacing: 1px;
    text-transform: uppercase;
    transition: all 0.2s;
    box-shadow: 0 3px 10px rgba(183,110,121,0.25);
  }

  .admin-btn-edit:hover {
    transform: translateY(-1px);
    box-shadow: 0 5px 14px rgba(183,110,121,0.35);
  }

  .admin-btn-delete {
    flex: 1;
    background: transparent;
    color: var(--danger);
    border: 1.5px solid #e8c8c8;
    padding: 9px 12px;
    border-radius: 2px;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    font-family: 'Jost', sans-serif;
    letter-spacing: 1px;
    text-transform: uppercase;
    transition: all 0.2s;
  }

  .admin-btn-delete:hover {
    background: var(--danger-pale);
    border-color: var(--danger);
  }

  /* Empty state */
  .admin-empty {
    text-align: center;
    padding: 80px 0;
    animation: fadeUp 0.5s ease both;
  }

  .admin-empty-icon { font-size: 52px; margin-bottom: 16px; }

  .admin-empty-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 26px;
    font-weight: 400;
    color: var(--dark);
    margin-bottom: 8px;
  }

  .admin-empty-sub {
    font-size: 13px;
    color: var(--muted);
    margin-bottom: 28px;
    font-weight: 300;
  }

  .admin-reset-btn {
    background: linear-gradient(135deg, var(--rose-gold), #c4808b);
    color: var(--white);
    border: none;
    padding: 12px 32px;
    border-radius: 2px;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    font-family: 'Jost', sans-serif;
    letter-spacing: 2px;
    text-transform: uppercase;
    box-shadow: 0 4px 14px rgba(183,110,121,0.3);
    transition: all 0.2s;
  }

  .admin-reset-btn:hover { transform: translateY(-1px); }

  /* Loading */
  .admin-loading {
    text-align: center;
    padding: 80px 0;
    color: var(--muted);
    font-size: 13px;
    font-weight: 300;
    letter-spacing: 1px;
    animation: fadeUp 0.4s ease both;
  }

  .admin-loading-icon { font-size: 44px; margin-bottom: 14px; opacity: 0.6; }

  @media (max-width: 640px) {
    .admin-hero { padding: 40px 20px 64px; }
    .admin-content { padding: 0 16px 48px; }
    .admin-filter-bar { padding: 18px; }
  }
`;

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, price, category, image_url, stock")
        .order("created_at", { ascending: false });
      if (error) { console.error(error); setProducts([]); }
      else setProducts(data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const filtered = products.filter(p => {
    const matchSearch = !search || p.name?.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || p.category === category;
    return matchSearch && matchCat;
  });

  return (
    <>
      <style>{adminStyles}</style>
      <div className="admin-page">

        {/* Hero */}
        <div className="admin-hero">
          <div className="admin-hero-orb-1" />
          <div className="admin-hero-orb-2" />
          <div className="admin-hero-inner">
            <div>
              <p className="admin-hero-breadcrumb">
                <Link href="/admin">Admin</Link> &nbsp;/&nbsp; Products
              </p>
              <h1 className="admin-hero-title">Manage Products</h1>
              <p className="admin-hero-sub">
                <strong>{products.length}</strong> pieces in catalogue
              </p>
            </div>
            <button className="admin-add-btn">+ Add Product</button>
          </div>
        </div>

        <div className="admin-content">

          {/* Filter bar */}
          <div className="admin-filter-bar">
            <div className="admin-search-wrap">
              <svg className="admin-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b76e79" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Search products by name..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="admin-search-input"
              />
            </div>

            <div className="admin-filter-row">
              <div className="admin-cats">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`admin-cat-btn ${category === cat ? "active" : ""}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <span className="admin-filter-meta">
                <strong>{filtered.length}</strong> result{filtered.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* States */}
          {loading ? (
            <div className="admin-loading">
              <div className="admin-loading-icon">💎</div>
              <p>Loading catalogue...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="admin-empty">
              <div className="admin-empty-icon">🔍</div>
              <h2 className="admin-empty-title">No products found</h2>
              <p className="admin-empty-sub">Try a different search or category</p>
              <button
                onClick={() => { setSearch(""); setCategory("All"); }}
                className="admin-reset-btn"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="admin-grid">
              {filtered.map(product => (
                <div key={product.id} className="admin-card">
                  <div className="admin-card-img">
                    {product.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={product.image_url} alt={product.name} />
                    ) : (
                      <span style={{ fontSize: "72px" }}>{EMOJI_MAP[product.category] || EMOJI_MAP.default}</span>
                    )}
                    {product.category && (
                      <span className="admin-card-cat-badge">{product.category}</span>
                    )}
                  </div>

                  <div className="admin-card-body">
                    <p className="admin-card-name">{product.name}</p>
                    <p className="admin-card-price">${Number(product.price).toFixed(2)}</p>
                    <div className="admin-card-actions">
                      <button className="admin-btn-edit">Edit</button>
                      <button className="admin-btn-delete">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );
}