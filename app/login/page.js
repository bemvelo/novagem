"use client";
import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

const loginStyles = `
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

  .login-page {
    min-height: 100vh;
    background: var(--cream);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px 16px;
    font-family: 'Jost', sans-serif;
    position: relative;
    overflow: hidden;
  }

  .login-page::before {
    content: '';
    position: fixed;
    top: -120px;
    right: -120px;
    width: 500px;
    height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(183,110,121,0.12) 0%, transparent 65%);
    pointer-events: none;
  }

  .login-page::after {
    content: '';
    position: fixed;
    bottom: -100px;
    left: -80px;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(44,24,16,0.06) 0%, transparent 65%);
    pointer-events: none;
  }

  .login-wrap {
    width: 100%;
    max-width: 420px;
    position: relative;
    z-index: 1;
    animation: fadeUp 0.7s ease both;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .login-logo-wrap {
    text-align: center;
    margin-bottom: 32px;
  }

  .login-logo-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 36px;
    font-weight: 600;
    letter-spacing: 8px;
    color: var(--dark);
    text-decoration: none;
    display: block;
    text-transform: uppercase;
    line-height: 1;
  }

  .login-logo-tag {
    font-size: 9px;
    letter-spacing: 4px;
    color: var(--rose-gold);
    text-transform: uppercase;
    font-weight: 400;
    margin-top: 6px;
    display: block;
  }

  .login-card {
    background: var(--white);
    border-radius: 4px;
    padding: 40px 36px;
    box-shadow: 0 8px 40px rgba(44,24,16,0.1);
    border: 1px solid var(--cream-border);
  }

  .login-card-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 28px;
    font-weight: 400;
    font-style: italic;
    color: var(--dark);
    text-align: center;
    margin-bottom: 6px;
  }

  .login-card-sub {
    text-align: center;
    font-size: 12px;
    color: var(--muted);
    margin-bottom: 28px;
    letter-spacing: 0.5px;
    font-weight: 300;
  }

  .login-error {
    background: #fef5f5;
    border: 1px solid #f5c6c6;
    border-left: 3px solid #e07070;
    color: #8b2020;
    padding: 10px 14px;
    border-radius: 2px;
    font-size: 12px;
    margin-bottom: 20px;
    font-weight: 400;
    letter-spacing: 0.3px;
  }

  .login-field {
    margin-bottom: 18px;
  }

  .login-label {
    font-size: 11px;
    font-weight: 600;
    color: var(--dark-mid);
    display: block;
    margin-bottom: 7px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
  }

  .login-input {
    width: 100%;
    padding: 12px 16px;
    border: 1.5px solid var(--cream-border);
    border-radius: 2px;
    font-size: 13px;
    color: var(--dark);
    background: var(--cream);
    outline: none;
    transition: all 0.2s;
    font-family: 'Jost', sans-serif;
    font-weight: 300;
  }

  .login-input::placeholder { color: var(--muted); }
  .login-input:focus {
    border-color: var(--rose-gold);
    background: var(--white);
    box-shadow: 0 0 0 3px rgba(183,110,121,0.08);
  }

  .login-input:disabled { opacity: 0.6; cursor: not-allowed; }

  .login-forgot {
    text-align: right;
    margin-top: -10px;
    margin-bottom: 20px;
  }

  .login-forgot a {
    font-size: 11px;
    color: var(--rose-gold);
    font-weight: 500;
    text-decoration: none;
    letter-spacing: 0.5px;
    border-bottom: 1px solid var(--rose-gold-pale);
    padding-bottom: 1px;
    transition: border-color 0.2s;
  }

  .login-forgot a:hover { border-color: var(--rose-gold); }

  .login-roles {
    display: flex;
    gap: 10px;
    margin-bottom: 26px;
  }

  .login-role-option {
    flex: 1;
    border-radius: 2px;
    padding: 10px 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.5px;
    font-family: 'Jost', sans-serif;
  }

  .login-role-option.active {
    border: 1.5px solid var(--rose-gold);
    background: rgba(183,110,121,0.06);
    color: var(--rose-gold);
  }

  .login-role-option.inactive {
    border: 1.5px solid var(--cream-border);
    background: var(--cream);
    color: var(--muted);
  }

  .login-role-option:hover { border-color: var(--rose-gold-light); }

  .login-submit {
    width: 100%;
    background: linear-gradient(135deg, var(--rose-gold), #c4808b);
    color: var(--white);
    border: none;
    padding: 14px;
    border-radius: 2px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 4px 18px rgba(183,110,121,0.35);
    letter-spacing: 2px;
    text-transform: uppercase;
    font-family: 'Jost', sans-serif;
    transition: all 0.2s;
  }

  .login-submit:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 24px rgba(183,110,121,0.45);
  }

  .login-submit:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }

  .login-divider {
    display: flex;
    align-items: center;
    gap: 14px;
    margin: 22px 0;
  }

  .login-divider-line {
    flex: 1;
    height: 1px;
    background: var(--cream-border);
  }

  .login-divider-text {
    font-size: 11px;
    color: var(--muted);
    letter-spacing: 1px;
  }

  .login-signup-text {
    text-align: center;
    font-size: 13px;
    color: var(--muted);
    font-weight: 300;
  }

  .login-signup-text a {
    color: var(--rose-gold);
    font-weight: 600;
    text-decoration: none;
    border-bottom: 1px solid var(--rose-gold-pale);
    padding-bottom: 1px;
    transition: border-color 0.2s;
  }

  .login-signup-text a:hover { border-color: var(--rose-gold); }

  .login-terms {
    text-align: center;
    font-size: 11px;
    color: var(--muted);
    margin-top: 20px;
    font-weight: 300;
    line-height: 1.6;
  }

  .login-terms a {
    color: var(--rose-gold);
    text-decoration: none;
  }

  .login-terms a:hover { text-decoration: underline; }

  .login-gem-decor {
    text-align: center;
    font-size: 18px;
    margin-bottom: 18px;
    opacity: 0.5;
    letter-spacing: 8px;
  }
`;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async () => {
    if (!email || !password) { setError("Please enter your email and password."); return; }
    setLoading(true);
    setError("");
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) { setError(authError.message || "Login failed."); setLoading(false); return; }
      if (!data.user) { setError("Login failed. Please try again."); setLoading(false); return; }
      const { data: userData, error: userError } = await supabase.from("users").select("role").eq("id", data.user.id).single();
      if (userError || !userData) { setError("Could not fetch user role."); setLoading(false); return; }
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
    <>
      <style>{loginStyles}</style>
      <div className="login-page">
        <div className="login-wrap">

          {/* Logo */}
          <div className="login-logo-wrap">
            <Link href="/" className="login-logo-name">Novagem</Link>
            <span className="login-logo-tag">Where Tech Meets Elegance</span>
          </div>

          {/* Card */}
          <div className="login-card">
            <div className="login-gem-decor">✦ 💎 ✦</div>
            <h2 className="login-card-title">Welcome Back</h2>
            <p className="login-card-sub">Sign in to your account</p>

            {error && <div className="login-error">{error}</div>}

            {/* Email */}
            <div className="login-field">
              <label className="login-label">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
                className="login-input"
              />
            </div>

            {/* Password */}
            <div className="login-field">
              <label className="login-label">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
                className="login-input"
              />
            </div>

            {/* Forgot */}
            <div className="login-forgot">
              <Link href="/forgot-password">Forgot password?</Link>
            </div>

            {/* Role selector */}
            <div className="login-roles">
              {["user", "admin"].map(r => (
                <div
                  key={r}
                  onClick={() => setRole(r)}
                  className={`login-role-option ${role === r ? "active" : "inactive"}`}
                >
                  <span>{r === "user" ? "👤 User" : "⚙️ Admin"}</span>
                </div>
              ))}
            </div>

            {/* Submit */}
            <button onClick={login} disabled={loading} className="login-submit">
              {loading ? "Signing in..." : "Sign In"}
            </button>

            {/* Divider */}
            <div className="login-divider">
              <div className="login-divider-line" />
              <span className="login-divider-text">or</span>
              <div className="login-divider-line" />
            </div>

            {/* Sign up link */}
            <p className="login-signup-text">
              Don&apos;t have an account?{" "}
              <Link href="/signup">Sign Up</Link>
            </p>
          </div>

          {/* Terms */}
          <p className="login-terms">
            By signing in, you agree to our{" "}
            <Link href="/privacy">Privacy Policy</Link>
            {" "}and{" "}
            <Link href="/terms">Terms & Conditions</Link>
          </p>

        </div>
      </div>
    </>
  );
}
