"use client";
import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import Link from "next/link";

const CATEGORIES = ["All", "Rings", "Necklaces", "Earrings", "Bracelets", "Anklets", "Sets"];

const EMOJI_MAP = {
  Rings: "💍", Necklaces: "📿", Earrings: "✨", Bracelets: "📿", Anklets: "⭐", Sets: "💎", default: "💎"
};

const productsStyles = `
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

  .products-page {
    min-height: 100vh;
    background: var(--cream);
    font-family: 'Jost', sans-serif;
    color: var(--dark);
  }

  /* Hero */
  .products-hero {
    background: linear-gradient(160deg, #2c1810 0%, #4a2820 50%, #6b3a30 100%);
    padding: 56px 32px;
    position: relative;
    overflow: hidden;
  }

  .products-hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 75% 50%, rgba(183,110,121,0.22) 0%, transparent 55%);
  }

  .products-hero-orb {
    position: absolute;
    top: -80px; right: -80px;
    width: 320px; height: 320px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(183,110,121,0.18) 0%, transparent 70%);
  }

  .products-hero-inner {
    max-width: 1400px;
    margin: 0 auto;
    position: relative;
  }

  .products-hero-eyebrow {
    font-size: 10px;
    letter-spacing: 5px;
    color: var(--rose-gold-light);
    text-transform: uppercase;
    font-weight: 600;
    margin-bottom: 12px;
    font-family: 'Jost', sans-serif;
  }

  .products-hero-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(28px, 5vw, 52px);
    font-weight: 300;
    letter-spacing: 3px;
    color: var(--white);
    margin-bottom: 10px;
    line-height: 1.1;
  }

  .products-hero-sub {
    color: rgba(240,217,200,0.7);
    font-size: 14px;
    font-weight: 300;
    letter-spacing: 0.5px;
  }

  .products-hero-sub strong { color: var(--champagne); font-weight: 600; }

  /* Filters */
  .products-wrap {
    max-width: 1400px;
    margin: 0 auto;
    padding: 32px;
  }

  .filter-bar {
    background: var(--white);
    border-radius: 4px;
    padding: 26px 28px;
    margin-bottom: 28px;
    border: 1px solid var(--cream-border);
    box-shadow: 0 2px 16px rgba(44,24,16,0.06);
  }

  .filter-search-wrap {
    position: relative;
    margin-bottom: 20px;
  }

  .filter-search-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
  }

  .filter-search-input {
    width: 100%;
    padding: 13px 16px 13px 46px;
    border: 1.5px solid var(--cream-border);
    border-radius: 2px;
    font-size: 13px;
    color: var(--dark);
    outline: none;
    font-family: 'Jost', sans-serif;
    background: var(--cream);
    transition: all 0.2s;
    font-weight: 300;
  }

  .filter-search-input::placeholder { color: var(--muted); }
  .filter-search-input:focus {
    border-color: var(--rose-gold);
    background: var(--white);
    box-shadow: 0 0 0 3px rgba(183,110,121,0.08);
  }

  .filter-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 14px;
  }

  .filter-cats {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .filter-cat-btn {
    padding: 7px 18px;
    border-radius: 2px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    border: 1.5px solid var(--cream-border);
    transition: all 0.18s;
    font-family: 'Jost', sans-serif;
    letter-spacing: 0.5px;
    background: transparent;
    color: var(--muted);
  }

  .filter-cat-btn:hover {
    border-color: var(--rose-gold-light);
    color: var(--rose-gold);
  }

  .filter-cat-btn.active {
    background: var(--rose-gold);
    border-color: var(--rose-gold);
    color: var(--white);
  }

  .filter-sort {
    padding: 9px 16px;
    border: 1.5px solid var(--cream-border);
    border-radius: 2px;
    font-size: 12px;
    color: var(--dark-mid);
    background: var(--cream);
    outline: none;
    font-family: 'Jost', sans-serif;
    font-weight: 500;
    cursor: pointer;
    transition: border-color 0.2s;
  }

  .filter-sort:focus { border-color: var(--rose-gold); }

  .filter-meta {
    margin-top: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .filter-meta-text {
    font-size: 12px;
    color: var(--muted);
    font-weight: 300;
  }

  .filter-meta-text strong { color: var(--rose-gold); font-weight: 600; }

  .cart-pill {
    background: var(--rose-gold-pale);
    color: var(--rose-gold);
    font-size: 11px;
    font-weight: 700;
    padding: 4px 14px;
    border-radius: 2px;
    letter-spacing: 0.5px;
  }

  /* Grid */
  .products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(275px, 1fr));
    gap: 22px;
  }

  .product-card {
    background: var(--white);
    border-radius: 4px;
    overflow: hidden;
    border: 1px solid var(--cream-border);
    box-shadow: 0 2px 10px rgba(44,24,16,0.05);
    transition: all 0.25s;
    display: flex;
    flex-direction: column;
  }

  .product-card:hover {
    box-shadow: 0 12px 32px rgba(183,110,121,0.18);
    transform: translateY(-4px);
    border-color: var(--rose-gold-pale);
  }

  .product-img-wrap {
    position: relative;
    height: 248px;
    background: linear-gradient(135deg, var(--cream-dark), var(--champagne));
    overflow: hidden;
    flex-shrink: 0;
  }

  .product-cat-badge {
    position: absolute;
    top: 12px; left: 12px;
    background: rgba(44,24,16,0.78);
    color: var(--champagne);
    font-size: 10px;
    font-weight: 600;
    padding: 4px 12px;
    border-radius: 2px;
    letter-spacing: 1px;
    text-transform: uppercase;
    backdrop-filter: blur(4px);
    font-family: 'Jost', sans-serif;
  }

  .product-wishlist-btn {
    position: absolute;
    top: 10px; right: 10px;
    background: rgba(253,246,240,0.95);
    border: none;
    width: 36px; height: 36px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 17px;
    box-shadow: 0 2px 8px rgba(44,24,16,0.12);
    transition: transform 0.2s;
  }

  .product-wishlist-btn:hover { transform: scale(1.15); }

  .product-info {
    padding: 18px 18px 20px;
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .product-name {
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 6px;
    color: var(--dark);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    letter-spacing: 0.3px;
  }

  .product-desc {
    font-size: 12px;
    color: var(--muted);
    margin-bottom: 14px;
    line-height: 1.55;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    flex: 1;
    font-weight: 300;
  }

  .product-price-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    margin-top: auto;
  }

  .product-price {
    font-family: 'Cormorant Garamond', serif;
    font-size: 24px;
    font-weight: 600;
    color: var(--rose-gold);
    letter-spacing: 0.5px;
  }

  .product-stock-badge {
    font-size: 10px;
    color: #c0392b;
    font-weight: 700;
    background: #fef5f5;
    padding: 3px 10px;
    border-radius: 2px;
    letter-spacing: 0.5px;
    border: 1px solid #f5c6c6;
  }

  /* Cart stepper */
  .cart-stepper {
    display: flex;
    align-items: center;
    border: 1.5px solid var(--rose-gold);
    border-radius: 2px;
    overflow: hidden;
  }

  .stepper-btn {
    flex: 1;
    padding: 10px;
    background: transparent;
    border: none;
    color: var(--rose-gold);
    font-size: 20px;
    font-weight: 700;
    cursor: pointer;
    line-height: 1;
    font-family: 'Jost', sans-serif;
    transition: background 0.15s;
  }

  .stepper-btn:hover { background: var(--rose-gold-pale); }

  .stepper-btn.add {
    background: var(--rose-gold);
    color: var(--white);
  }

  .stepper-btn.add:hover { background: var(--dark-mid); }

  .stepper-count {
    flex: 1;
    text-align: center;
    font-weight: 700;
    color: var(--rose-gold);
    font-size: 15px;
    font-family: 'Jost', sans-serif;
  }

  .add-to-cart-btn {
    width: 100%;
    background: linear-gradient(135deg, var(--rose-gold), #c4808b);
    color: var(--white);
    border: none;
    padding: 12px;
    border-radius: 2px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    font-family: 'Jost', sans-serif;
    box-shadow: 0 4px 14px rgba(183,110,121,0.3);
    letter-spacing: 1.5px;
    text-transform: uppercase;
    transition: all 0.2s;
  }

  .add-to-cart-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(183,110,121,0.4);
  }

  /* Empty / loading */
  .products-empty {
    text-align: center;
    padding: 80px 0;
  }

  .products-empty-icon { font-size: 52px; margin-bottom: 16px; }

  .products-empty-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 26px;
    font-weight: 400;
    color: var(--dark);
    margin-bottom: 8px;
  }

  .products-empty-sub {
    font-size: 13px;
    color: var(--muted);
    margin-bottom: 28px;
    font-weight: 300;
  }

  .products-reset-btn {
    background: linear-gradient(135deg, var(--rose-gold), #c4808b);
    color: var(--white);
    border: none;
    padding: 12px 32px;
    border-radius: 2px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    font-family: 'Jost', sans-serif;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    box-shadow: 0 4px 14px rgba(183,110,121,0.3);
    transition: all 0.2s;
  }

  .products-reset-btn:hover { transform: translateY(-1px); }

  /* Floating cart */
  .floating-cart {
    position: fixed;
    bottom: 28px; right: 28px;
    z-index: 999;
  }

  .floating-cart-link {
    background: linear-gradient(135deg, var(--dark), #4a2820);
    color: var(--champagne);
    text-decoration: none;
    padding: 14px 28px;
    border-radius: 2px;
    font-weight: 600;
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0 8px 28px rgba(44,24,16,0.35);
    letter-spacing: 1px;
    text-transform: uppercase;
    font-family: 'Jost', sans-serif;
    transition: all 0.2s;
  }

  .floating-cart-link:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 36px rgba(44,24,16,0.4);
  }

  .floating-cart-badge {
    background: var(--rose-gold);
    color: var(--white);
    border-radius: 2px;
    padding: 2px 10px;
    font-size: 12px;
    font-weight: 700;
  }

  /* Suspense fallback */
  .products-fallback {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--cream);
    font-family: 'Jost', sans-serif;
  }

  @media (max-width: 640px) {
    .products-wrap { padding: 16px; }
    .products-hero { padding: 44px 20px; }
    .filter-bar { padding: 18px; }
  }
`;

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [cart, setCart] = useState({});
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState({});
  const [imgErrors, setImgErrors] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase.from("products").select("*");
        if (error) { console.error("Error:", error); setProducts([]); }
        else setProducts(data || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchProducts();

    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      const matched = CATEGORIES.find(
        c => c.toLowerCase() === categoryParam.toLowerCase() ||
             c.toLowerCase().replace(" ", "-") === categoryParam.toLowerCase()
      );
      if (matched) setSelectedCategory(matched);
    }

    const saved = JSON.parse(localStorage.getItem("cart") || "[]");
    const cartMap = {};
    saved.forEach(item => { cartMap[item.id] = item.quantity; });
    setCart(cartMap);
  }, [searchParams]);

  const addToCart = (id) => {
    const product = products.find(p => p.id === id);
    if (!product) return;
    const existing = JSON.parse(localStorage.getItem("cart") || "[]");
    const found = existing.find(i => i.id === id);
    const updatedCart = found
      ? existing.map(i => i.id === id ? { ...i, quantity: i.quantity + 1 } : i)
      : [...existing, { id: product.id, name: product.name, price: product.price, imageUrl: product.image_url, category: product.category, quantity: 1 }];
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const removeFromCart = (id) => {
    const existing = JSON.parse(localStorage.getItem("cart") || "[]");
    const updatedCart = existing
      .map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i)
      .filter(i => i.quantity > 0);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
    setCart(prev => {
      const qty = (prev[id] || 0) - 1;
      if (qty <= 0) { const c = { ...prev }; delete c[id]; return c; }
      return { ...prev, [id]: qty };
    });
  };

  const toggleWishlist = (id) => setWishlist(prev => ({ ...prev, [id]: !prev[id] }));
  const cartTotal = Object.values(cart).reduce((a, b) => a + b, 0);

  let filtered = products.filter(p => {
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === "All" || p.category === selectedCategory;
    return matchSearch && matchCat;
  });
  if (sortBy === "price-low") filtered = [...filtered].sort((a, b) => a.price - b.price);
  else if (sortBy === "price-high") filtered = [...filtered].sort((a, b) => b.price - a.price);
  else if (sortBy === "newest") filtered = [...filtered].reverse();

  return (
    <>
      <style>{productsStyles}</style>
      <div className="products-page">

        {/* Hero */}
        <div className="products-hero">
          <div className="products-hero-orb" />
          <div className="products-hero-inner">
            <p className="products-hero-eyebrow">Novagem · Curated Collection</p>
            <h1 className="products-hero-title">Our Collection</h1>
            <p className="products-hero-sub">
              Discover <strong>{products.length}</strong> stunning pieces of handcrafted jewelry
            </p>
          </div>
        </div>

        <div className="products-wrap">

          {/* Filter bar */}
          <div className="filter-bar">
            <div className="filter-search-wrap">
              <svg className="filter-search-icon" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#b76e79" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Search rings, necklaces, earrings..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="filter-search-input"
              />
            </div>

            <div className="filter-row">
              <div className="filter-cats">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`filter-cat-btn ${selectedCategory === cat ? "active" : ""}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="filter-sort"
              >
                <option value="featured">✦ Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>

            <div className="filter-meta">
              <p className="filter-meta-text">
                Showing <strong>{filtered.length}</strong> product{filtered.length !== 1 ? "s" : ""}
                {selectedCategory !== "All" && <span> in <strong>{selectedCategory}</strong></span>}
              </p>
              {cartTotal > 0 && (
                <span className="cart-pill">🛒 {cartTotal} item{cartTotal !== 1 ? "s" : ""} in cart</span>
              )}
            </div>
          </div>

          {/* Products */}
          {loading ? (
            <div className="products-empty">
              <div className="products-empty-icon">💍</div>
              <p className="products-empty-sub">Loading your collection...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="products-empty">
              <div className="products-empty-icon">🔍</div>
              <h2 className="products-empty-title">No pieces found</h2>
              <p className="products-empty-sub">Try a different search or category</p>
              <button
                onClick={() => { setSearch(""); setSelectedCategory("All"); }}
                className="products-reset-btn"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {filtered.map(product => (
                <div key={product.id} className="product-card">

                  <div className="product-img-wrap">
                    {product.image_url && !imgErrors[product.id] ? (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        width={350}
                        height={220}
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        onError={() => setImgErrors(prev => ({ ...prev, [product.id]: true }))}
                      />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                        <span style={{ fontSize: "80px" }}>{EMOJI_MAP[product.category] || EMOJI_MAP.default}</span>
                        <span style={{ fontSize: "11px", color: "var(--muted)", letterSpacing: "1px" }}>No image</span>
                      </div>
                    )}
                    {product.category && (
                      <span className="product-cat-badge">{product.category}</span>
                    )}
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="product-wishlist-btn"
                    >
                      {wishlist[product.id] ? "❤️" : "🤍"}
                    </button>
                  </div>

                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    {product.description && (
                      <p className="product-desc">{product.description}</p>
                    )}
                    <div className="product-price-row">
                      <span className="product-price">${Number(product.price).toFixed(2)}</span>
                      {product.stock !== undefined && product.stock <= 5 && product.stock > 0 && (
                        <span className="product-stock-badge">Only {product.stock} left</span>
                      )}
                    </div>

                    {cart[product.id] ? (
                      <div className="cart-stepper">
                        <button onClick={() => removeFromCart(product.id)} className="stepper-btn">−</button>
                        <span className="stepper-count">{cart[product.id]}</span>
                        <button onClick={() => addToCart(product.id)} className="stepper-btn add">+</button>
                      </div>
                    ) : (
                      <button onClick={() => addToCart(product.id)} className="add-to-cart-btn">
                        Add to Cart
                      </button>
                    )}
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

        {/* Floating cart */}
        {cartTotal > 0 && (
          <div className="floating-cart">
            <Link href="/users/cart" className="floating-cart-link">
              🛒 View Cart
              <span className="floating-cart-badge">{cartTotal}</span>
            </Link>
          </div>
        )}

      </div>
    </>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="products-fallback">
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>💍</div>
          <p style={{ color: "#9a7b74", fontSize: "14px", fontWeight: "300", letterSpacing: "1px" }}>Loading collection...</p>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
