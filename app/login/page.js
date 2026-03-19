"use client";
import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async () => {
    if (!email || !password) { setError("Please enter email and password"); return; }
    setLoading(true);
    setError("");
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) { setError(authError.message || "Login failed."); setLoading(false); return; }
      if (!data.user) { setError("Login failed. Please try again."); setLoading(false); return; }
      const { data: userData, error: userError } = await supabase.from("users").select("role").eq("id", data.user.id).single();
      if (userError || !userData) { setError("Could not fetch user role"); setLoading(false); return; }
      const userRole = userData.role || "user";
      if (role === "admin" && userRole === "admin") router.push("/admin");
      else if (role === "user") router.push("/users/products");
      else setError("You don't have permission to access this role.");
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => { if (e.key === "Enter") login(); };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #e8dff5 0%, #f0ebf8 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <span style={{ fontFamily: "Georgia, serif", fontSize: "32px", fontWeight: "700", letterSpacing: "5px", color: "#6c3fc5" }}>GLEAMIA</span>
          </Link>
          <p style={{ color: "#9b72e0", fontSize: "13px", marginTop: "6px", letterSpacing: "1px" }}>YOUR JEWELLERY DESTINATION</p>
        </div>

        {/* Card */}
        <div style={{ background: "rgba(255,255,255,0.92)", borderRadius: "20px", padding: "36px 32px", boxShadow: "0 8px 32px rgba(108,63,197,0.18)", border: "1px solid #e4d8f8" }}>

          <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#1a1a2e", textAlign: "center", marginBottom: "6px" }}>Welcome Back</h2>
          <p style={{ textAlign: "center", fontSize: "13px", color: "#6b6b8a", marginBottom: "28px" }}>Sign in to your account</p>

          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderLeft: "4px solid #ef4444", color: "#991b1b", padding: "10px 14px", borderRadius: "8px", fontSize: "13px", marginBottom: "20px" }}>
              {error}
            </div>
          )}

          {/* Email */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "#4a4a6a", display: "block", marginBottom: "6px" }}>Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              style={{ width: "100%", padding: "12px 16px", border: "2px solid #d4c8f0", borderRadius: "10px", fontSize: "14px", color: "#1a1a2e", background: "#fff", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s", marginBottom: 0 }}
              onFocus={e => e.target.style.borderColor = "#6c3fc5"}
              onBlur={e => e.target.style.borderColor = "#d4c8f0"}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: "8px" }}>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "#4a4a6a", display: "block", marginBottom: "6px" }}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              style={{ width: "100%", padding: "12px 16px", border: "2px solid #d4c8f0", borderRadius: "10px", fontSize: "14px", color: "#1a1a2e", background: "#fff", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s", marginBottom: 0 }}
              onFocus={e => e.target.style.borderColor = "#6c3fc5"}
              onBlur={e => e.target.style.borderColor = "#d4c8f0"}
            />
          </div>

          {/* Forgot */}
          <div style={{ textAlign: "right", marginBottom: "20px" }}>
            <Link href="/forgot-password" style={{ fontSize: "12px", color: "#9b72e0", fontWeight: "600" }}>Forgot password?</Link>
          </div>

          {/* Role selector */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
            {["user", "admin"].map(r => (
              <label key={r} onClick={() => setRole(r)} style={{ flex: 1, border: `2px solid ${role === r ? "#6c3fc5" : "#d4c8f0"}`, borderRadius: "10px", padding: "10px 12px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", cursor: "pointer", background: role === r ? "rgba(108,63,197,0.08)" : "#fff", transition: "all 0.2s" }}>
                <input type="radio" name="role" value={r} checked={role === r} onChange={() => setRole(r)} style={{ display: "none" }} />
                <span style={{ fontSize: "13px", fontWeight: "600", color: role === r ? "#6c3fc5" : "#6b6b8a" }}>
                  {r === "user" ? "👤 User" : "⚙️ Admin"}
                </span>
              </label>
            ))}
          </div>

          {/* Submit */}
          <button
            onClick={login}
            disabled={loading}
            style={{ width: "100%", background: loading ? "#9b72e0" : "linear-gradient(135deg, #6c3fc5, #9b72e0)", color: "#fff", border: "none", padding: "14px", borderRadius: "10px", fontSize: "15px", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer", boxShadow: "0 4px 14px rgba(108,63,197,0.35)", letterSpacing: "0.5px", transition: "all 0.2s" }}>
            {loading ? "Signing in..." : "Login"}
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "20px 0" }}>
            <div style={{ flex: 1, height: "1px", background: "#e4d8f8" }} />
            <span style={{ fontSize: "12px", color: "#a0a0c0" }}>or</span>
            <div style={{ flex: 1, height: "1px", background: "#e4d8f8" }} />
          </div>

          {/* Sign up */}
          <p style={{ textAlign: "center", fontSize: "14px", color: "#6b6b8a" }}>
            Dont have an account?{" "}
            <Link href="/signup" style={{ color: "#6c3fc5", fontWeight: "700" }}>Sign Up</Link>
          </p>
        </div>

        {/* Terms */}
        <p style={{ textAlign: "center", fontSize: "11px", color: "#a0a0c0", marginTop: "20px" }}>
          By signing in, you agree to our{" "}
          <Link href="/privacy" style={{ color: "#9b72e0" }}>Privacy Policy</Link>
          {" "}and{" "}
          <Link href="/terms" style={{ color: "#9b72e0" }}>Terms & Conditions</Link>
        </p>
      </div>
    </div>
  );
}