"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import Link from "next/link";

const EMOJI_MAP = { Rings: "💍", Necklaces: "📿", Earrings: "✨", Bracelets: "📿", Anklets: "⭐", Sets: "💎", default: "💎" };

const PAYMENT_METHODS = [
  { value: "ecocash", label: "EcoCash", emoji: "📱", desc: "Pay via EcoCash mobile money" },
  { value: "cod", label: "Cash on Delivery", emoji: "💵", desc: "Pay when your order arrives" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem("cart") || "[]");
    } catch {
      return [];
    }
  });
  const [phone, setPhone] = useState("");
  const [method, setMethod] = useState("ecocash");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imgErrors, setImgErrors] = useState({});

  const total      = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping   = total >= 30 ? 0 : 4.99;
  const grandTotal = total + shipping;
  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);

  const handlePayment = async () => {
    if (!phone) { setError("Please enter your phone number"); return; }
    setLoading(true);
    setError("");
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { setError("Please log in to complete checkout"); setLoading(false); return; }

      const { error: insertError } = await supabase.from("orders").insert({
        user_id: session.user.id,
        user_email: session.user.email,
        items: cart,
        total: grandTotal,
        phone,
        method,
        status: "pending",
        created_at: new Date().toISOString(),
      });

      if (insertError) { setError(insertError.message || "Failed to create order"); setLoading(false); return; }

      localStorage.removeItem("cart");
      router.push("/users/checkout/success");
    } catch (err) {
      setError(err.message || "An error occurred");
    }
    setLoading(false);
  };

  const inputStyle = {
    width: "100%", padding: "12px 16px", border: "2px solid #d4c8f0", borderRadius: "10px",
    fontSize: "14px", color: "#1a1a2e", background: "#fff", outline: "none",
    boxSizing: "border-box", fontFamily: "inherit", transition: "border-color 0.2s"
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #f0ebf8 0%, #e8dff5 100%)", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", color: "#1a1a2e" }}>

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #4e2d96 0%, #6c3fc5 100%)", padding: "44px 32px", color: "#fff" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <p style={{ fontSize: "11px", letterSpacing: "4px", color: "#c4a8f0", textTransform: "uppercase", fontWeight: "600", marginBottom: "8px" }}>novagem</p>
          <h1 style={{ fontSize: "clamp(24px,4vw,40px)", fontFamily: "Georgia,serif", fontWeight: "300", letterSpacing: "2px", margin: "0 0 6px" }}>💳 Checkout</h1>
          <p style={{ color: "#c4a8f0", fontSize: "14px" }}>Complete your order — {totalItems} item{totalItems !== 1 ? "s" : ""}</p>
        </div>
      </div>

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px" }}>

        {cart.length === 0 ? (
          <div style={{ background: "#fff", borderRadius: "20px", padding: "80px 40px", textAlign: "center", border: "1px solid #e4d8f8", boxShadow: "0 2px 16px rgba(108,63,197,0.08)" }}>
            <div style={{ fontSize: "64px", marginBottom: "20px" }}>🛍️</div>
            <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "10px" }}>Your cart is empty</h2>
            <p style={{ color: "#6b6b8a", marginBottom: "24px", fontSize: "14px" }}>Add some jewelry before checking out.</p>
            <Link href="/users/products" style={{ background: "linear-gradient(135deg,#6c3fc5,#9b72e0)", color: "#fff", textDecoration: "none", padding: "13px 32px", borderRadius: "10px", fontSize: "14px", fontWeight: "700" }}>
              Browse Collection
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "24px", alignItems: "start" }}>

            {/* Left — payment form */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

              {/* Contact */}
              <div style={{ background: "#fff", borderRadius: "16px", padding: "26px 28px", border: "1px solid #e4d8f8", boxShadow: "0 2px 8px rgba(108,63,197,0.06)" }}>
                <h2 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "18px", color: "#1a1a2e" }}>📱 Contact Details</h2>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#4a4a6a", display: "block", marginBottom: "6px" }}>Phone Number</label>
                <input
                  type="text" placeholder="+263 7XX XXX XXX" value={phone}
                  onChange={e => setPhone(e.target.value)} disabled={loading}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "#6c3fc5"}
                  onBlur={e => e.target.style.borderColor = "#d4c8f0"}
                />
              </div>

              {/* Payment method */}
              <div style={{ background: "#fff", borderRadius: "16px", padding: "26px 28px", border: "1px solid #e4d8f8", boxShadow: "0 2px 8px rgba(108,63,197,0.06)" }}>
                <h2 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "18px", color: "#1a1a2e" }}>💳 Payment Method</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {PAYMENT_METHODS.map(pm => (
                    <label key={pm.value} onClick={() => setMethod(pm.value)}
                      style={{ display: "flex", alignItems: "center", gap: "14px", padding: "16px 18px", border: `2px solid ${method === pm.value ? "#6c3fc5" : "#d4c8f0"}`, borderRadius: "12px", cursor: "pointer", background: method === pm.value ? "rgba(108,63,197,0.05)" : "#fff", transition: "all 0.18s" }}>
                      <input type="radio" name="method" value={pm.value} checked={method === pm.value} onChange={() => setMethod(pm.value)} style={{ display: "none" }} />
                      <span style={{ fontSize: "28px" }}>{pm.emoji}</span>
                      <div>
                        <div style={{ fontSize: "14px", fontWeight: "700", color: method === pm.value ? "#6c3fc5" : "#1a1a2e" }}>{pm.label}</div>
                        <div style={{ fontSize: "12px", color: "#6b6b8a" }}>{pm.desc}</div>
                      </div>
                      {method === pm.value && (
                        <span style={{ marginLeft: "auto", width: "20px", height: "20px", borderRadius: "50%", background: "#6c3fc5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "#fff", fontWeight: "700", flexShrink: 0 }}>✓</span>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Error */}
              {error && (
                <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderLeft: "4px solid #ef4444", color: "#991b1b", padding: "12px 16px", borderRadius: "10px", fontSize: "13px" }}>
                  {error}
                </div>
              )}

              {/* Submit */}
              <button onClick={handlePayment} disabled={loading || cart.length === 0}
                style={{ width: "100%", background: loading ? "#9b72e0" : "linear-gradient(135deg, #6c3fc5, #9b72e0)", color: "#fff", border: "none", padding: "16px", borderRadius: "12px", fontSize: "16px", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", boxShadow: "0 4px 16px rgba(108,63,197,0.35)", letterSpacing: "0.5px", transition: "opacity 0.2s" }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = "0.92"; }}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                {loading ? "⏳ Processing your order..." : `Complete Order — $${grandTotal.toFixed(2)}`}
              </button>

              {/* Trust badges */}
              <div style={{ display: "flex", justifyContent: "center", gap: "24px", flexWrap: "wrap" }}>
                {["🔒 Secure Checkout", "↩️ Easy Returns", "💎 Quality Guaranteed"].map(b => (
                  <span key={b} style={{ fontSize: "12px", color: "#9b72e0", fontWeight: "600" }}>{b}</span>
                ))}
              </div>
            </div>

            {/* Right — order summary */}
            <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", border: "1px solid #e4d8f8", boxShadow: "0 2px 16px rgba(108,63,197,0.08)", position: "sticky", top: "100px" }}>
              <h2 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "20px", color: "#1a1a2e" }}>Order Summary</h2>

              {/* Items */}
              <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "20px" }}>
                {cart.map(item => (
                  <div key={item.id} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "52px", height: "52px", borderRadius: "10px", background: "linear-gradient(135deg, #f5f0ff, #ede5f8)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
                      {item.imageUrl && !imgErrors[item.id] ? (
                        <Image src={item.imageUrl} alt={item.name} width={52} height={52}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          onError={() => setImgErrors(p => ({ ...p, [item.id]: true }))} />
                      ) : (
                        <span style={{ fontSize: "24px" }}>{EMOJI_MAP[item.category] || EMOJI_MAP.default}</span>
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: "13px", fontWeight: "600", color: "#1a1a2e", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</p>
                      <p style={{ fontSize: "12px", color: "#6b6b8a" }}>Qty: {item.quantity}</p>
                    </div>
                    <span style={{ fontSize: "13px", fontWeight: "700", color: "#6c3fc5", flexShrink: 0 }}>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: "1px solid #e4d8f8", paddingTop: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ fontSize: "13px", color: "#6b6b8a" }}>Subtotal</span>
                  <span style={{ fontSize: "13px", fontWeight: "600" }}>${total.toFixed(2)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "14px" }}>
                  <span style={{ fontSize: "13px", color: "#6b6b8a" }}>Shipping</span>
                  <span style={{ fontSize: "13px", fontWeight: "600", color: shipping === 0 ? "#10b981" : "#1a1a2e" }}>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #e4d8f8", paddingTop: "14px" }}>
                  <span style={{ fontSize: "16px", fontWeight: "700" }}>Total</span>
                  <span style={{ fontSize: "20px", fontWeight: "700", color: "#6c3fc5" }}>${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <Link href="/users/cart" style={{ display: "block", textAlign: "center", marginTop: "16px", fontSize: "13px", color: "#9b72e0", textDecoration: "none", fontWeight: "600" }}>
                ← Edit Cart
              </Link>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
