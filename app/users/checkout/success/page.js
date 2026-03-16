"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) setEmail(session.user.email || "");
    };
    getUser();
    const t = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #f0ebf8 0%, #e8dff5 100%)", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: "520px", textAlign: "center", opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(20px)", transition: "all 0.5s ease" }}>

        <div style={{ background: "#fff", borderRadius: "24px", padding: "52px 40px", border: "1px solid #e4d8f8", boxShadow: "0 8px 40px rgba(108,63,197,0.14)" }}>

          <div style={{ width: "88px", height: "88px", borderRadius: "50%", background: "linear-gradient(135deg, #6c3fc5, #9b72e0)", margin: "0 auto 24px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 28px rgba(108,63,197,0.4)", fontSize: "40px", color: "#fff" }}>
            ✓
          </div>

          <div style={{ fontSize: "28px", marginBottom: "20px", letterSpacing: "6px" }}>🎉 💍 🎉</div>

          <p style={{ fontSize: "11px", letterSpacing: "4px", color: "#9b72e0", textTransform: "uppercase", fontWeight: "600", marginBottom: "10px" }}>Gleamia</p>

          <h1 style={{ fontSize: "28px", fontFamily: "Georgia, serif", fontWeight: "400", color: "#1a1a2e", marginBottom: "12px", letterSpacing: "1px" }}>
            Order Confirmed!
          </h1>

          <p style={{ fontSize: "15px", color: "#6b6b8a", marginBottom: "8px", lineHeight: "1.6" }}>
            Your payment was received. Thank you for shopping with GLEAMIA!
          </p>

          {email && (
            <p style={{ fontSize: "13px", color: "#9b72e0", fontWeight: "600", marginBottom: "32px" }}>
              A confirmation will be sent to <strong>{email}</strong>
            </p>
          )}

          <div style={{ background: "linear-gradient(135deg, #f5f0ff, #ede5f8)", borderRadius: "14px", padding: "20px", marginBottom: "32px", textAlign: "left" }}>
            <p style={{ fontSize: "13px", fontWeight: "700", color: "#6c3fc5", marginBottom: "12px", letterSpacing: "0.5px", textTransform: "uppercase" }}>What happens next?</p>
            {[
              ["📦", "Your order is being prepared"],
              ["🚚", "We'll ship within 1-2 business days"],
              ["💌", "You'll receive tracking info by email"],
            ].map(([emoji, text]) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <span style={{ fontSize: "18px" }}>{emoji}</span>
                <span style={{ fontSize: "13px", color: "#4a4a6a" }}>{text}</span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <Link href="/users/products" style={{ background: "linear-gradient(135deg, #6c3fc5, #9b72e0)", color: "#fff", textDecoration: "none", padding: "14px", borderRadius: "12px", fontSize: "14px", fontWeight: "700", letterSpacing: "0.5px", boxShadow: "0 4px 14px rgba(108,63,197,0.35)", display: "block" }}>
              💍 Continue Shopping
            </Link>

            <Link href="/users/profile" style={{ background: "rgba(108,63,197,0.08)", color: "#6c3fc5", textDecoration: "none", padding: "13px", borderRadius: "12px", fontSize: "14px", fontWeight: "700", border: "2px solid rgba(108,63,197,0.2)", display: "block" }}>
              👤 View My Orders
            </Link>

            <button onClick={handleLogout}
              style={{ background: "transparent", color: "#ef4444", border: "2px solid rgba(239,68,68,0.2)", padding: "12px", borderRadius: "12px", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#ef4444"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#ef4444"; }}>
              Sign Out
            </button>
          </div>

        </div>

        <p style={{ marginTop: "24px", fontSize: "13px", color: "#a0a0c0" }}>
          Thank you for choosing <span style={{ color: "#9b72e0", fontWeight: "700", fontFamily: "Georgia, serif", letterSpacing: "2px" }}>GLEAMIA</span>
        </p>

      </div>
    </div>
  );
}