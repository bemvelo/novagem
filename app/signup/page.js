"use client";
import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

const signupStyles = `
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
    --error: #c0392b;
    --error-bg: #fef5f5;
    --error-border: #f5c6c6;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .signup-page {
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

  .signup-page::before {
    content: '';
    position: fixed;
    top: -100px;
    left: -100px;
    width: 480px;
    height: 480px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(183,110,121,0.1) 0%, transparent 65%);
    pointer-events: none;
  }

  .signup-page::after {
    content: '';
    position: fixed;
    bottom: -120px;
    right: -80px;
    width: 420px;
    height: 420px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(44,24,16,0.06) 0%, transparent 65%);
    pointer-events: none;
  }

  .signup-wrap {
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

  .signup-logo-wrap {
    text-align: center;
    margin-bottom: 32px;
  }

  .signup-logo-name {
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

  .signup-logo-tag {
    font-size: 9px;
    letter-spacing: 4px;
    color: var(--rose-gold);
    text-transform: uppercase;
    font-weight: 400;
    margin-top: 6px;
    display: block;
  }

  .signup-card {
    background: var(--white);
    border-radius: 4px;
    padding: 40px 36px;
    box-shadow: 0 8px 40px rgba(44,24,16,0.1);
    border: 1px solid var(--cream-border);
  }

  .signup-eyebrow {
    text-align: center;
    font-size: 9px;
    letter-spacing: 4px;
    color: var(--rose-gold);
    font-weight: 600;
    text-transform: uppercase;
    margin-bottom: 8px;
  }

  .signup-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 28px;
    font-weight: 400;
    font-style: italic;
    color: var(--dark);
    text-align: center;
    margin-bottom: 6px;
  }

  .signup-subtitle {
    text-align: center;
    font-size: 12px;
    color: var(--muted);
    margin-bottom: 28px;
    font-weight: 300;
    letter-spacing: 0.5px;
  }

  .signup-gem-decor {
    text-align: center;
    font-size: 16px;
    margin-bottom: 18px;
    opacity: 0.45;
    letter-spacing: 8px;
  }

  .signup-error {
    background: var(--error-bg);
    border: 1px solid var(--error-border);
    border-left: 3px solid var(--error);
    color: var(--error);
    padding: 10px 14px;
    border-radius: 2px;
    font-size: 12px;
    margin-bottom: 20px;
    font-weight: 400;
    letter-spacing: 0.3px;
  }

  .signup-field {
    margin-bottom: 18px;
  }

  .signup-label {
    font-size: 11px;
    font-weight: 600;
    color: var(--dark-mid);
    display: block;
    margin-bottom: 7px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
  }

  .signup-input {
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

  .signup-input::placeholder { color: var(--muted); }

  .signup-input:focus {
    border-color: var(--rose-gold);
    background: var(--white);
    box-shadow: 0 0 0 3px rgba(183,110,121,0.08);
  }

  .signup-input:disabled { opacity: 0.6; cursor: not-allowed; }
  .signup-input.input-error { border-color: var(--error); }

  .signup-input-hint {
    font-size: 11px;
    color: var(--error);
    margin-top: 5px;
    font-weight: 400;
    letter-spacing: 0.3px;
  }

  .signup-input-match {
    font-size: 11px;
    color: #7aaa7a;
    margin-top: 5px;
    font-weight: 400;
    letter-spacing: 0.3px;
  }

  .signup-strength {
    display: flex;
    gap: 4px;
    margin-top: 7px;
  }

  .strength-bar {
    flex: 1;
    height: 3px;
    border-radius: 2px;
    background: var(--cream-border);
    transition: background 0.3s;
  }

  .strength-bar.weak   { background: #e07070; }
  .strength-bar.medium { background: var(--champagne); }
  .strength-bar.strong { background: var(--rose-gold); }

  .signup-submit {
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
    margin-bottom: 22px;
  }

  .signup-submit:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 24px rgba(183,110,121,0.45);
  }

  .signup-submit:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }

  .signup-divider {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 20px;
  }

  .signup-divider-line { flex: 1; height: 1px; background: var(--cream-border); }
  .signup-divider-text { font-size: 11px; color: var(--muted); letter-spacing: 1px; }

  .signup-login-text {
    text-align: center;
    font-size: 13px;
    color: var(--muted);
    font-weight: 300;
    margin-bottom: 12px;
  }

  .signup-login-text a {
    color: var(--rose-gold);
    font-weight: 600;
    text-decoration: none;
    border-bottom: 1px solid var(--rose-gold-pale);
    padding-bottom: 1px;
    transition: border-color 0.2s;
  }

  .signup-login-text a:hover { border-color: var(--rose-gold); }

  .signup-back {
    text-align: center;
    font-size: 12px;
  }

  .signup-back a {
    color: var(--muted);
    text-decoration: none;
    font-weight: 400;
    letter-spacing: 0.5px;
    transition: color 0.2s;
  }

  .signup-back a:hover { color: var(--rose-gold); }

  .signup-terms {
    text-align: center;
    font-size: 11px;
    color: var(--muted);
    margin-top: 20px;
    font-weight: 300;
    line-height: 1.7;
  }

  .signup-terms a {
    color: var(--rose-gold);
    text-decoration: none;
  }

  .signup-terms a:hover { text-decoration: underline; }
`;

function getPasswordStrength(pw) {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw) || /[0-9]/.test(pw)) score++;
  return score; // 0–3
}

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const strength = getPasswordStrength(password);
  const strengthLabel = ["", "Weak", "Good", "Strong"][strength];
  const strengthClass = ["", "weak", "medium", "strong"][strength];

  const signup = async () => {
    if (!email || !password || !confirmPassword) { setError("Please fill in all fields."); return; }
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    setError("");
    try {
      const { data, error: authError } = await supabase.auth.signUp({ email, password });
      if (authError) { setError(authError.message || "Sign up failed."); setLoading(false); return; }
      if (!data.user) { setError("Sign up failed. Please try again."); setLoading(false); return; }
      const role = email === "admin@novagem.com" ? "admin" : "user";
      const { error: insertError } = await supabase.from("users").insert({ id: data.user.id, email, role, created_at: new Date().toISOString() });
      if (insertError) { setError(insertError.message || "Failed to create user profile."); setLoading(false); return; }
      router.push(role === "admin" ? "/admin" : "/users/products");
    } catch (err) {
      setError(err.message || "Sign up failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => { if (e.key === "Enter") signup(); };

  const passwordsMatch = confirmPassword && confirmPassword === password;
  const passwordsMismatch = confirmPassword && confirmPassword !== password;

  return (
    <>
      <style>{signupStyles}</style>
      <div className="signup-page">
        <div className="signup-wrap">

          {/* Logo */}
          <div className="signup-logo-wrap">
            <Link href="/" className="signup-logo-name">Novagem</Link>
            <span className="signup-logo-tag">Where Tech Meets Elegance</span>
          </div>

          {/* Card */}
          <div className="signup-card">
            <div className="signup-gem-decor">✦ 💎 ✦</div>
            <p className="signup-eyebrow">Join Novagem</p>
            <h2 className="signup-title">Create Your Account</h2>
            <p className="signup-subtitle">Begin your journey with us</p>

            {error && <div className="signup-error">{error}</div>}

            {/* Email */}
            <div className="signup-field">
              <label className="signup-label">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
                className="signup-input"
              />
            </div>

            {/* Password */}
            <div className="signup-field">
              <label className="signup-label">Password</label>
              <input
                type="password"
                placeholder="Min. 6 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
                className="signup-input"
              />
              {password && (
                <>
                  <div className="signup-strength">
                    {[1, 2, 3].map(i => (
                      <div key={i} className={`strength-bar ${i <= strength ? strengthClass : ""}`} />
                    ))}
                  </div>
                  <p style={{ fontSize: "11px", color: "var(--muted)", marginTop: "4px", letterSpacing: "0.5px" }}>
                    Strength: <span style={{ color: strength === 1 ? "#e07070" : strength === 2 ? "#b78a50" : "var(--rose-gold)", fontWeight: 600 }}>{strengthLabel}</span>
                  </p>
                </>
              )}
            </div>

            {/* Confirm Password */}
            <div className="signup-field" style={{ marginBottom: "28px" }}>
              <label className="signup-label">Confirm Password</label>
              <input
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
                className={`signup-input ${passwordsMismatch ? "input-error" : ""}`}
              />
              {passwordsMismatch && <p className="signup-input-hint">Passwords do not match</p>}
              {passwordsMatch && <p className="signup-input-match">✓ Passwords match</p>}
            </div>

            {/* Submit */}
            <button onClick={signup} disabled={loading} className="signup-submit">
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            {/* Divider */}
            <div className="signup-divider">
              <div className="signup-divider-line" />
              <span className="signup-divider-text">or</span>
              <div className="signup-divider-line" />
            </div>

            {/* Login link */}
            <p className="signup-login-text">
              Already have an account?{" "}
              <Link href="/login">Sign In</Link>
            </p>

            {/* Back home */}
            <p className="signup-back">
              <Link href="/">← Back to Home</Link>
            </p>
          </div>

          {/* Terms */}
          <p className="signup-terms">
            By signing up, you agree to our{" "}
            <Link href="/privacy">Privacy Policy</Link>
            {" "}and{" "}
            <Link href="/terms">Terms & Conditions</Link>
          </p>

        </div>
      </div>
    </>
  );
}
