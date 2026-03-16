"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const EMOJI_MAP = { Rings: "💍", Necklaces: "📿", Earrings: "✨", Bracelets: "📿", Anklets: "⭐", Sets: "💎", default: "💎" };

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [imgErrors, setImgErrors] = useState({});

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(data);
  }, []);

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const addItem    = (id) => updateCart(cart.map(i => i.id === id ? { ...i, quantity: i.quantity + 1 } : i));
  const removeItem = (id) => updateCart(cart.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i).filter(i => i.quantity > 0));
  const deleteItem = (id) => updateCart(cart.filter(i => i.id !== id));

  const totalPrice   = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalItems   = cart.reduce((sum, i) => sum + i.quantity, 0);
  const shipping     = totalPrice >= 30 ? 0 : 4.99;
  const grandTotal   = totalPrice + shipping;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #f0ebf8 0%, #e8dff5 100%)", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", color: "#1a1a2e" }}>

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #4e2d96 0%, #6c3fc5 100%)", padding: "40px 32px", color: "#fff" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <p style={{ fontSize: "11px", letterSpacing: "4px", color: "#c4a8f0", textTransform: "uppercase", fontWeight: "600", marginBottom: "8px" }}>Gleamia</p>
          <h1 style={{ fontSize: "clamp(24px,4vw,40px)", fontFamily: "Georgia,serif", fontWeight: "300", letterSpacing: "2px", margin: "0 0 6px" }}>🛒 Your Cart</h1>
          <p style={{ color: "#c4a8f0", fontSize: "14px" }}>{totalItems} item{totalItems !== 1 ? "s" : ""} in your cart</p>
        </div>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "32px" }}>

        {cart.length === 0 ? (
          /* Empty state */
          <div style={{ background: "#fff", borderRadius: "20px", padding: "80px 40px", textAlign: "center", border: "1px solid #e4d8f8", boxShadow: "0 2px 16px rgba(108,63,197,0.08)" }}>
            <div style={{ fontSize: "72px", marginBottom: "20px" }}>🛍️</div>
            <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#1a1a2e", marginBottom: "10px" }}>Your cart is empty</h2>
            <p style={{ color: "#6b6b8a", fontSize: "14px", marginBottom: "28px" }}>Looks like you haven't added any jewelry yet.</p>
            <Link href="/users/products" style={{ background: "linear-gradient(135deg, #6c3fc5, #9b72e0)", color: "#fff", textDecoration: "none", padding: "13px 36px", borderRadius: "10px", fontSize: "14px", fontWeight: "700", boxShadow: "0 4px 14px rgba(108,63,197,0.3)" }}>
              Browse Collection
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "24px", alignItems: "start" }}>

            {/* Cart items */}
            <div>
              {cart.map(item => (
                <div key={item.id} style={{ background: "#fff", borderRadius: "16px", padding: "20px", marginBottom: "16px", border: "1px solid #e4d8f8", boxShadow: "0 2px 8px rgba(108,63,197,0.06)", display: "flex", gap: "16px", alignItems: "center", transition: "box-shadow 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = "0 6px 20px rgba(108,63,197,0.12)"}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = "0 2px 8px rgba(108,63,197,0.06)"}>

                  {/* Image */}
                  <div style={{ width: "90px", height: "90px", borderRadius: "12px", overflow: "hidden", background: "linear-gradient(135deg, #f5f0ff, #ede5f8)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {item.imageUrl && !imgErrors[item.id] ? (
                      <img src={item.imageUrl} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={() => setImgErrors(p => ({ ...p, [item.id]: true }))} />
                    ) : (
                      <span style={{ fontSize: "40px" }}>{EMOJI_MAP[item.category] || EMOJI_MAP.default}</span>
                    )}
                  </div>

                  {/* Details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#1a1a2e", marginBottom: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</h3>
                    {item.category && <span style={{ fontSize: "11px", color: "#9b72e0", fontWeight: "600", background: "rgba(108,63,197,0.08)", padding: "2px 10px", borderRadius: "20px" }}>{item.category}</span>}
                    <p style={{ fontSize: "18px", fontWeight: "700", color: "#6c3fc5", marginTop: "8px" }}>${Number(item.price).toFixed(2)}</p>
                    <p style={{ fontSize: "12px", color: "#6b6b8a" }}>Subtotal: <strong style={{ color: "#1a1a2e" }}>${(item.price * item.quantity).toFixed(2)}</strong></p>
                  </div>

                  {/* Controls */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", flexShrink: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", border: "2px solid #d4c8f0", borderRadius: "10px", overflow: "hidden" }}>
                      <button onClick={() => removeItem(item.id)}
                        style={{ padding: "7px 13px", background: "transparent", border: "none", color: "#6c3fc5", fontSize: "18px", fontWeight: "700", cursor: "pointer", lineHeight: 1, fontFamily: "inherit" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#f0ebf8"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>−</button>
                      <span style={{ padding: "7px 14px", fontWeight: "700", color: "#1a1a2e", fontSize: "15px", borderLeft: "1px solid #e4d8f8", borderRight: "1px solid #e4d8f8", minWidth: "40px", textAlign: "center" }}>{item.quantity}</span>
                      <button onClick={() => addItem(item.id)}
                        style={{ padding: "7px 13px", background: "#6c3fc5", border: "none", color: "#fff", fontSize: "18px", fontWeight: "700", cursor: "pointer", lineHeight: 1, fontFamily: "inherit" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#4e2d96"}
                        onMouseLeave={e => e.currentTarget.style.background = "#6c3fc5"}>+</button>
                    </div>
                    <button onClick={() => deleteItem(item.id)}
                      style={{ fontSize: "12px", color: "#ef4444", background: "rgba(239,68,68,0.08)", border: "none", padding: "5px 14px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontFamily: "inherit", transition: "background 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.16)"}
                      onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              {/* Continue shopping */}
              <Link href="/users/products" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#6c3fc5", textDecoration: "none", fontSize: "13px", fontWeight: "600", marginTop: "4px" }}>
                ← Continue Shopping
              </Link>
            </div>

            {/* Order summary */}
            <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", border: "1px solid #e4d8f8", boxShadow: "0 2px 16px rgba(108,63,197,0.08)", position: "sticky", top: "100px" }}>
              <h2 style={{ fontSize: "17px", fontWeight: "700", marginBottom: "20px", color: "#1a1a2e" }}>Order Summary</h2>

              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                <span style={{ fontSize: "13px", color: "#6b6b8a" }}>Subtotal ({totalItems} items)</span>
                <span style={{ fontSize: "13px", fontWeight: "600" }}>${totalPrice.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                <span style={{ fontSize: "13px", color: "#6b6b8a" }}>Shipping</span>
                <span style={{ fontSize: "13px", fontWeight: "600", color: shipping === 0 ? "#10b981" : "#1a1a2e" }}>
                  {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                </span>
              </div>

              {shipping > 0 && (
                <div style={{ background: "rgba(108,63,197,0.06)", borderRadius: "8px", padding: "10px 12px", marginBottom: "14px" }}>
                  <p style={{ fontSize: "12px", color: "#6c3fc5", fontWeight: "600" }}>
                    💡 Add ${(30 - totalPrice).toFixed(2)} more for free shipping!
                  </p>
                </div>
              )}

              <div style={{ borderTop: "1px solid #e4d8f8", paddingTop: "14px", marginTop: "4px", display: "flex", justifyContent: "space-between", marginBottom: "22px" }}>
                <span style={{ fontSize: "16px", fontWeight: "700" }}>Total</span>
                <span style={{ fontSize: "20px", fontWeight: "700", color: "#6c3fc5" }}>${grandTotal.toFixed(2)}</span>
              </div>

              <Link href="/checkout" style={{ display: "block", background: "linear-gradient(135deg, #6c3fc5, #9b72e0)", color: "#fff", textDecoration: "none", padding: "14px", borderRadius: "12px", textAlign: "center", fontSize: "15px", fontWeight: "700", boxShadow: "0 4px 14px rgba(108,63,197,0.35)", letterSpacing: "0.3px", marginBottom: "12px" }}>
                Proceed to Checkout →
              </Link>

              <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginTop: "16px" }}>
                {["🔒 Secure", "↩️ Free Returns", "💎 Quality"].map(item => (
                  <span key={item} style={{ fontSize: "11px", color: "#9b72e0", fontWeight: "600" }}>{item}</span>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
