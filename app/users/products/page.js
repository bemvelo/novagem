"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import Link from "next/link";

const CATEGORIES = ["All", "Rings", "Necklaces", "Earrings", "Bracelets", "Anklets", "Sets"];

const EMOJI_MAP = {
  Rings: "💍", Necklaces: "📿", Earrings: "✨", Bracelets: "📿", Anklets: "⭐", Sets: "💎", default: "💎"
};

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

    // Read category from URL param
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      const matched = CATEGORIES.find(
        c => c.toLowerCase() === categoryParam.toLowerCase() ||
             c.toLowerCase().replace(" ", "-") === categoryParam.toLowerCase()
      );
      if (matched) setSelectedCategory(matched);
    }

    // Load existing cart state from localStorage
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
      : [...existing, {
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.image_url,
          category: product.category,
          quantity: 1
        }];

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
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #f0ebf8 0%, #e8dff5 100%)", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", color: "#1a1a2e" }}>

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #4e2d96 0%, #6c3fc5 100%)", padding: "52px 32px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-80px", right: "-80px", width: "300px", height: "300px", borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
        <div style={{ position: "absolute", bottom: "-60px", left: "10%", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(255,107,157,0.08)" }} />
        <div style={{ maxWidth: "1400px", margin: "0 auto", position: "relative" }}>
          <p style={{ fontSize: "11px", letterSpacing: "4px", color: "#c4a8f0", textTransform: "uppercase", fontWeight: "600", marginBottom: "10px" }}>Gleamia Store</p>
          <h1 style={{ fontSize: "clamp(28px,5vw,52px)", fontFamily: "Georgia,serif", fontWeight: "300", letterSpacing: "2px", color: "#fff", margin: "0 0 10px" }}>✨ Our Collection</h1>
          <p style={{ color: "#c4a8f0", fontSize: "15px" }}>Discover <strong style={{ color: "#fff" }}>{products.length}</strong> stunning pieces of handcrafted jewelry</p>
        </div>
      </div>

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "32px" }}>

        {/* Filter bar */}
        <div style={{ background: "#fff", borderRadius: "16px", padding: "24px 28px", marginBottom: "28px", border: "1px solid #e4d8f8", boxShadow: "0 2px 16px rgba(108,63,197,0.08)" }}>

          {/* Search */}
          <div style={{ position: "relative", marginBottom: "20px" }}>
            <svg style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9b72e0" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input
              type="text" placeholder="Search for rings, necklaces, earrings..." value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: "100%", padding: "13px 16px 13px 46px", border: "2px solid #d4c8f0", borderRadius: "12px", fontSize: "14px", color: "#1a1a2e", outline: "none", boxSizing: "border-box", fontFamily: "inherit", background: "#faf8fe" }}
              onFocus={e => e.target.style.borderColor = "#6c3fc5"}
              onBlur={e => e.target.style.borderColor = "#d4c8f0"}
            />
          </div>

          {/* Categories + Sort */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "14px" }}>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setSelectedCategory(cat)}
                  style={{ padding: "7px 18px", borderRadius: "20px", fontSize: "13px", fontWeight: "600", cursor: "pointer", border: "2px solid #6c3fc5", transition: "all 0.18s", fontFamily: "inherit",
                    background: selectedCategory === cat ? "#6c3fc5" : "transparent",
                    color: selectedCategory === cat ? "#fff" : "#6c3fc5" }}
                  onMouseEnter={e => { if (selectedCategory !== cat) e.currentTarget.style.background = "rgba(108,63,197,0.08)"; }}
                  onMouseLeave={e => { if (selectedCategory !== cat) e.currentTarget.style.background = "transparent"; }}>
                  {cat}
                </button>
              ))}
            </div>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              style={{ padding: "9px 16px", border: "2px solid #d4c8f0", borderRadius: "10px", fontSize: "13px", color: "#1a1a2e", background: "#fff", outline: "none", fontFamily: "inherit", fontWeight: "600", cursor: "pointer" }}
              onFocus={e => e.target.style.borderColor = "#6c3fc5"}
              onBlur={e => e.target.style.borderColor = "#d4c8f0"}>
              <option value="featured">⭐ Featured</option>
              <option value="price-low">💰 Price: Low to High</option>
              <option value="price-high">💎 Price: High to Low</option>
              <option value="newest">🆕 Newest</option>
            </select>
          </div>

          {/* Results row */}
          <div style={{ marginTop: "16px", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <p style={{ fontSize: "13px", color: "#6b6b8a" }}>
              Showing <strong style={{ color: "#6c3fc5" }}>{filtered.length}</strong> product{filtered.length !== 1 ? "s" : ""}
              {selectedCategory !== "All" && <span> in <strong style={{ color: "#6c3fc5" }}>{selectedCategory}</strong></span>}
            </p>
            {cartTotal > 0 && (
              <span style={{ background: "rgba(108,63,197,0.1)", color: "#6c3fc5", fontSize: "12px", fontWeight: "700", padding: "4px 14px", borderRadius: "20px" }}>
                🛒 {cartTotal} item{cartTotal !== 1 ? "s" : ""} in cart
              </span>
            )}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>💍</div>
            <p style={{ color: "#6b6b8a", fontSize: "16px" }}>Loading your collection...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: "52px", marginBottom: "16px" }}>🔍</div>
            <p style={{ color: "#1a1a2e", fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>No products found</p>
            <p style={{ color: "#6b6b8a", fontSize: "14px", marginBottom: "24px" }}>Try a different search or category</p>
            <button onClick={() => { setSearch(""); setSelectedCategory("All"); }}
              style={{ background: "linear-gradient(135deg,#6c3fc5,#9b72e0)", color: "#fff", border: "none", padding: "12px 32px", borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 12px rgba(108,63,197,0.3)" }}>
              Reset Filters
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: "22px" }}>
            {filtered.map(product => (
              <div key={product.id}
                style={{ background: "#fff", borderRadius: "16px", overflow: "hidden", border: "1px solid #e4d8f8", boxShadow: "0 2px 8px rgba(108,63,197,0.06)", transition: "all 0.22s", display: "flex", flexDirection: "column" }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 10px 28px rgba(108,63,197,0.18)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 8px rgba(108,63,197,0.06)"; e.currentTarget.style.transform = "none"; }}>

                <div style={{ position: "relative", height: "240px", background: "linear-gradient(135deg, #f5f0ff, #ede5f8)", overflow: "hidden", flexShrink: 0 }}>
                  {product.image_url && !imgErrors[product.id] ? (
                    <img src={product.image_url} alt={product.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      onError={() => setImgErrors(prev => ({ ...prev, [product.id]: true }))} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                      <span style={{ fontSize: "80px" }}>{EMOJI_MAP[product.category] || EMOJI_MAP.default}</span>
                      <span style={{ fontSize: "12px", color: "#9b72e0", fontWeight: "600" }}>No image</span>
                    </div>
                  )}
                  {product.category && (
                    <span style={{ position: "absolute", top: "12px", left: "12px", background: "rgba(78,45,150,0.85)", color: "#fff", fontSize: "11px", fontWeight: "700", padding: "4px 12px", borderRadius: "20px", backdropFilter: "blur(4px)", letterSpacing: "0.3px" }}>
                      {product.category}
                    </span>
                  )}
                  <button onClick={() => toggleWishlist(product.id)}
                    style={{ position: "absolute", top: "10px", right: "10px", background: "rgba(255,255,255,0.95)", border: "none", width: "36px", height: "36px", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", boxShadow: "0 2px 8px rgba(0,0,0,0.12)", transition: "transform 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.transform = "scale(1.15)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
                    {wishlist[product.id] ? "❤️" : "🤍"}
                  </button>
                </div>

                <div style={{ padding: "18px 18px 20px", display: "flex", flexDirection: "column", flex: 1 }}>
                  <h3 style={{ fontSize: "15px", fontWeight: "700", marginBottom: "6px", color: "#1a1a2e", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{product.name}</h3>
                  {product.description && (
                    <p style={{ fontSize: "12px", color: "#6b6b8a", marginBottom: "14px", lineHeight: "1.5", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", flex: 1 }}>{product.description}</p>
                  )}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", marginTop: "auto" }}>
                    <span style={{ fontSize: "22px", fontWeight: "700", color: "#6c3fc5" }}>${Number(product.price).toFixed(2)}</span>
                    {product.stock !== undefined && product.stock <= 5 && product.stock > 0 && (
                      <span style={{ fontSize: "11px", color: "#ff6b9d", fontWeight: "700", background: "rgba(255,107,157,0.1)", padding: "3px 10px", borderRadius: "20px" }}>Only {product.stock} left!</span>
                    )}
                  </div>
                  {cart[product.id] ? (
                    <div style={{ display: "flex", alignItems: "center", border: "2px solid #6c3fc5", borderRadius: "10px", overflow: "hidden" }}>
                      <button onClick={() => removeFromCart(product.id)}
                        style={{ flex: 1, padding: "10px", background: "transparent", border: "none", color: "#6c3fc5", fontSize: "22px", fontWeight: "700", cursor: "pointer", lineHeight: 1, fontFamily: "inherit", transition: "background 0.15s" }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(108,63,197,0.08)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>−</button>
                      <span style={{ flex: 1, textAlign: "center", fontWeight: "700", color: "#6c3fc5", fontSize: "16px" }}>{cart[product.id]}</span>
                      <button onClick={() => addToCart(product.id)}
                        style={{ flex: 1, padding: "10px", background: "#6c3fc5", border: "none", color: "#fff", fontSize: "22px", fontWeight: "700", cursor: "pointer", lineHeight: 1, fontFamily: "inherit", transition: "background 0.15s" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#4e2d96"}
                        onMouseLeave={e => e.currentTarget.style.background = "#6c3fc5"}>+</button>
                    </div>
                  ) : (
                    <button onClick={() => addToCart(product.id)}
                      style={{ width: "100%", background: "linear-gradient(135deg, #6c3fc5, #9b72e0)", color: "#fff", border: "none", padding: "12px", borderRadius: "10px", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 12px rgba(108,63,197,0.3)", letterSpacing: "0.5px", transition: "opacity 0.2s" }}
                      onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
                      onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                      🛒 Add to Cart
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {cartTotal > 0 && (
        <div style={{ position: "fixed", bottom: "28px", right: "28px", zIndex: 999 }}>
          <Link href="/users/cart"
            style={{ background: "linear-gradient(135deg, #6c3fc5, #9b72e0)", color: "#fff", textDecoration: "none", padding: "14px 28px", borderRadius: "30px", fontWeight: "700", fontSize: "14px", display: "flex", alignItems: "center", gap: "10px", boxShadow: "0 8px 28px rgba(108,63,197,0.45)", letterSpacing: "0.3px" }}>
            🛒 View Cart
            <span style={{ background: "#ff6b9d", borderRadius: "20px", padding: "2px 10px", fontSize: "13px" }}>{cartTotal}</span>
          </Link>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(160deg, #f0ebf8 0%, #e8dff5 100%)" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>💍</div>
          <p style={{ color: "#6b6b8a", fontSize: "16px" }}>Loading collection...</p>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
