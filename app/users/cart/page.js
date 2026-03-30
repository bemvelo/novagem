"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const EMOJI_MAP = { Rings: "💍", Necklaces: "📿", Earrings: "✨", Bracelets: "📿", Anklets: "⭐", Sets: "💎", default: "💎" };

const cartStyles = `
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

  .cart-page {
    min-height: 100vh;
    background: var(--cream);
    font-family: 'Jost', sans-serif;
    color: var(--dark);
  }

  /* Hero */
  .cart-hero {
    background: linear-gradient(160deg, #2c1810 0%, #4a2820 50%, #6b3a30 100%);
    padding: 44px 32px;
    color: var(--white);
    position: relative;
    overflow: hidden;
  }

  .cart-hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 70% 50%, rgba(183,110,121,0.2) 0%, transparent 55%);
  }

  .cart-hero-inner {
    max-width: 900px;
    margin: 0 auto;
    position: relative;
  }

  .cart-hero-eyebrow {
    font-size: 10px;
    letter-spacing: 5px;
    color: var(--rose-gold-light);
    text-transform: uppercase;
    font-weight: 600;
    margin-bottom: 10px;
    font-family: 'Jost', sans-serif;
  }

  .cart-hero-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(26px, 4vw, 44px);
    font-weight: 300;
    letter-spacing: 3px;
    margin-bottom: 8px;
    color: var(--white);
  }

  .cart-hero-sub {
    color: rgba(240,217,200,0.65);
    font-size: 13px;
    font-weight: 300;
    letter-spacing: 0.5px;
  }

  /* Layout */
  .cart-wrap {
    max-width: 900px;
    margin: 0 auto;
    padding: 32px;
  }

  /* Empty state */
  .cart-empty {
    background: var(--white);
    border-radius: 4px;
    padding: 80px 40px;
    text-align: center;
    border: 1px solid var(--cream-border);
    box-shadow: 0 2px 16px rgba(44,24,16,0.06);
  }

  .cart-empty-icon { font-size: 64px; margin-bottom: 20px; display: block; }

  .cart-empty-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 26px;
    font-weight: 400;
    font-style: italic;
    color: var(--dark);
    margin-bottom: 10px;
  }

  .cart-empty-sub {
    color: var(--muted);
    font-size: 13px;
    margin-bottom: 32px;
    font-weight: 300;
    letter-spacing: 0.3px;
  }

  .cart-empty-btn {
    background: linear-gradient(135deg, var(--rose-gold), #c4808b);
    color: var(--white);
    text-decoration: none;
    padding: 13px 36px;
    border-radius: 2px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    font-family: 'Jost', sans-serif;
    box-shadow: 0 4px 16px rgba(183,110,121,0.35);
    transition: all 0.2s;
    display: inline-block;
  }

  .cart-empty-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 22px rgba(183,110,121,0.45); }

  /* Grid layout */
  .cart-grid {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 24px;
    align-items: start;
  }

  /* Cart item */
  .cart-item {
    background: var(--white);
    border-radius: 4px;
    padding: 20px;
    margin-bottom: 14px;
    border: 1px solid var(--cream-border);
    box-shadow: 0 2px 10px rgba(44,24,16,0.05);
    display: flex;
    gap: 16px;
    align-items: center;
    transition: box-shadow 0.2s, border-color 0.2s;
  }

  .cart-item:hover {
    box-shadow: 0 6px 22px rgba(183,110,121,0.14);
    border-color: var(--rose-gold-pale);
  }

  .cart-item-img {
    width: 90px;
    height: 90px;
    border-radius: 4px;
    overflow: hidden;
    background: linear-gradient(135deg, var(--cream-dark), var(--champagne));
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .cart-item-details { flex: 1; min-width: 0; }

  .cart-item-name {
    font-size: 14px;
    font-weight: 500;
    color: var(--dark);
    margin-bottom: 6px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    letter-spacing: 0.3px;
  }

  .cart-item-cat {
    font-size: 10px;
    color: var(--rose-gold);
    font-weight: 600;
    background: var(--rose-gold-pale);
    padding: 2px 10px;
    border-radius: 2px;
    letter-spacing: 1px;
    text-transform: uppercase;
    display: inline-block;
  }

  .cart-item-price {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px;
    font-weight: 600;
    color: var(--rose-gold);
    margin-top: 8px;
    display: block;
  }

  .cart-item-subtotal {
    font-size: 11px;
    color: var(--muted);
    font-weight: 300;
    margin-top: 2px;
  }

  .cart-item-subtotal strong { color: var(--dark-mid); font-weight: 600; }

  /* Item controls */
  .cart-item-controls {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }

  .cart-stepper {
    display: flex;
    align-items: center;
    border: 1.5px solid var(--cream-border);
    border-radius: 2px;
    overflow: hidden;
  }

  .stepper-btn {
    padding: 7px 13px;
    background: transparent;
    border: none;
    color: var(--rose-gold);
    font-size: 18px;
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
    padding: 7px 14px;
    font-weight: 700;
    color: var(--dark);
    font-size: 14px;
    border-left: 1px solid var(--cream-border);
    border-right: 1px solid var(--cream-border);
    min-width: 38px;
    text-align: center;
    font-family: 'Jost', sans-serif;
  }

  .cart-remove-btn {
    font-size: 11px;
    color: #c0392b;
    background: #fef5f5;
    border: 1px solid #f5c6c6;
    padding: 4px 14px;
    border-radius: 2px;
    cursor: pointer;
    font-weight: 500;
    font-family: 'Jost', sans-serif;
    letter-spacing: 0.5px;
    transition: all 0.15s;
  }

  .cart-remove-btn:hover { background: #fee; border-color: #e07070; color: #8b2020; }

  .cart-continue {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--rose-gold);
    text-decoration: none;
    font-size: 12px;
    font-weight: 500;
    margin-top: 6px;
    letter-spacing: 0.5px;
    border-bottom: 1px solid var(--rose-gold-pale);
    padding-bottom: 1px;
    transition: border-color 0.2s;
  }

  .cart-continue:hover { border-color: var(--rose-gold); }

  /* Order summary */
  .order-summary {
    background: var(--white);
    border-radius: 4px;
    padding: 26px;
    border: 1px solid var(--cream-border);
    box-shadow: 0 2px 16px rgba(44,24,16,0.06);
    position: sticky;
    top: 100px;
  }

  .summary-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px;
    font-weight: 400;
    font-style: italic;
    margin-bottom: 22px;
    color: var(--dark);
  }

  .summary-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
  }

  .summary-label {
    font-size: 12px;
    color: var(--muted);
    font-weight: 300;
    letter-spacing: 0.3px;
  }

  .summary-value {
    font-size: 13px;
    font-weight: 600;
    color: var(--dark-mid);
  }

  .summary-value.free { color: #7aaa7a; }

  .shipping-nudge {
    background: var(--rose-gold-pale);
    border-radius: 2px;
    padding: 10px 14px;
    margin-bottom: 16px;
    border-left: 3px solid var(--rose-gold-light);
  }

  .shipping-nudge p {
    font-size: 12px;
    color: var(--rose-gold);
    font-weight: 500;
    letter-spacing: 0.3px;
  }

  .summary-divider {
    border: none;
    border-top: 1px solid var(--cream-border);
    margin: 14px 0;
  }

  .summary-total-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 22px;
  }

  .summary-total-label {
    font-size: 14px;
    font-weight: 600;
    color: var(--dark);
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }

  .summary-total-value {
    font-family: 'Cormorant Garamond', serif;
    font-size: 26px;
    font-weight: 600;
    color: var(--rose-gold);
  }

  .checkout-btn {
    display: block;
    background: linear-gradient(135deg, var(--rose-gold), #c4808b);
    color: var(--white);
    text-decoration: none;
    padding: 14px;
    border-radius: 2px;
    text-align: center;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    font-family: 'Jost', sans-serif;
    box-shadow: 0 4px 16px rgba(183,110,121,0.35);
    margin-bottom: 16px;
    transition: all 0.2s;
  }

  .checkout-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 22px rgba(183,110,121,0.45); }

  .summary-perks {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-top: 14px;
    flex-wrap: wrap;
  }

  .summary-perk {
    font-size: 10px;
    color: var(--muted);
    font-weight: 500;
    letter-spacing: 0.5px;
  }

  @media (max-width: 700px) {
    .cart-grid { grid-template-columns: 1fr; }
    .cart-wrap { padding: 16px; }
    .cart-hero { padding: 36px 20px; }
  }
`;

export default function CartPage() {
  const [cart, setCart] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem("cart") || "[]");
    } catch {
      return [];
    }
  });
  const [imgErrors, setImgErrors] = useState({});

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const addItem    = (id) => updateCart(cart.map(i => i.id === id ? { ...i, quantity: i.quantity + 1 } : i));
  const removeItem = (id) => updateCart(cart.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i).filter(i => i.quantity > 0));
  const deleteItem = (id) => updateCart(cart.filter(i => i.id !== id));

  const totalPrice = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
  const shipping   = totalPrice >= 30 ? 0 : 4.99;
  const grandTotal = totalPrice + shipping;

  return (
    <>
      <style>{cartStyles}</style>
      <div className="cart-page">

        {/* Hero */}
        <div className="cart-hero">
          <div className="cart-hero-inner">
            <p className="cart-hero-eyebrow">Novagem · Your Selection</p>
            <h1 className="cart-hero-title">Your Cart</h1>
            <p className="cart-hero-sub">{totalItems} item{totalItems !== 1 ? "s" : ""} in your cart</p>
          </div>
        </div>

        <div className="cart-wrap">

          {cart.length === 0 ? (
            <div className="cart-empty">
              <span className="cart-empty-icon">🛍️</span>
              <h2 className="cart-empty-title">Your cart is empty</h2>
              <p className="cart-empty-sub">Looks like you havenot added any pieces yet.</p>
              <Link href="/users/products" className="cart-empty-btn">Browse Collection</Link>
            </div>
          ) : (
            <div className="cart-grid">

              {/* Items */}
              <div>
                {cart.map(item => (
                  <div key={item.id} className="cart-item">

                    <div className="cart-item-img">
                      {item.imageUrl && !imgErrors[item.id] ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          width={90}
                          height={90}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          onError={() => setImgErrors(p => ({ ...p, [item.id]: true }))}
                        />
                      ) : (
                        <span style={{ fontSize: "38px" }}>{EMOJI_MAP[item.category] || EMOJI_MAP.default}</span>
                      )}
                    </div>

                    <div className="cart-item-details">
                      <h3 className="cart-item-name">{item.name}</h3>
                      {item.category && <span className="cart-item-cat">{item.category}</span>}
                      <span className="cart-item-price">${Number(item.price).toFixed(2)}</span>
                      <p className="cart-item-subtotal">
                        Subtotal: <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                      </p>
                    </div>

                    <div className="cart-item-controls">
                      <div className="cart-stepper">
                        <button onClick={() => removeItem(item.id)} className="stepper-btn">−</button>
                        <span className="stepper-count">{item.quantity}</span>
                        <button onClick={() => addItem(item.id)} className="stepper-btn add">+</button>
                      </div>
                      <button onClick={() => deleteItem(item.id)} className="cart-remove-btn">Remove</button>
                    </div>

                  </div>
                ))}

                <Link href="/users/products" className="cart-continue">← Continue Shopping</Link>
              </div>

              {/* Order summary */}
              <div className="order-summary">
                <h2 className="summary-title">Order Summary</h2>

                <div className="summary-row">
                  <span className="summary-label">Subtotal ({totalItems} item{totalItems !== 1 ? "s" : ""})</span>
                  <span className="summary-value">${totalPrice.toFixed(2)}</span>
                </div>

                <div className="summary-row">
                  <span className="summary-label">Shipping</span>
                  <span className={`summary-value ${shipping === 0 ? "free" : ""}`}>
                    {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>

                {shipping > 0 && (
                  <div className="shipping-nudge">
                    <p>✦ Add ${(30 - totalPrice).toFixed(2)} more for free shipping</p>
                  </div>
                )}

                <hr className="summary-divider" />

                <div className="summary-total-row">
                  <span className="summary-total-label">Total</span>
                  <span className="summary-total-value">${grandTotal.toFixed(2)}</span>
                </div>

                <Link href="/users/checkout" className="checkout-btn">
                  Proceed to Checkout →
                </Link>

                <div className="summary-perks">
                  {["🔒 Secure", "↩️ Free Returns", "💎 Quality"].map(perk => (
                    <span key={perk} className="summary-perk">{perk}</span>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </>
  );
}
