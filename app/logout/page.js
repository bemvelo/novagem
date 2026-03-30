"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

const logoutStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500;600;700&display=swap');

  :root {
    --rose-gold: #b76e79;
    --rose-gold-light: #d4a0a7;
    --rose-gold-pale: #f2dce0;
    --cream: #fdf6f0;
    --cream-border: #e8d8cc;
    --champagne: #f0d9c8;
    --dark: #2c1810;
    --dark-mid: #5a3e38;
    --muted: #9a7b74;
    --white: #ffffff;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .logout-page {
    min-height: 100vh;
    background: var(--cream);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Jost', sans-serif;
    position: relative;
    overflow: hidden;
  }

  .logout-page::before {
    content: '';
    position: fixed;
    top: -100px;
    right: -100px;
    width: 450px;
    height: 450px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(183,110,121,0.1) 0%, transparent 65%);
    pointer-events: none;
  }

  .logout-page::after {
    content: '';
    position: fixed;
    bottom: -100px;
    left: -80px;
    width: 380px;
    height: 380px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(44,24,16,0.05) 0%, transparent 65%);
    pointer-events: none;
  }

  .logout-card {
    text-align: center;
    padding: 56px 48px;
    background: var(--white);
    border: 1px solid var(--cream-border);
    border-radius: 4px;
    box-shadow: 0 8px 40px rgba(44,24,16,0.1);
    max-width: 380px;
    width: 100%;
    margin: 16px;
    position: relative;
    z-index: 1;
    animation: fadeUp 0.6s ease both;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .logout-logo {
    font-family: 'Cormorant Garamond', serif;
    font-size: 28px;
    font-weight: 600;
    letter-spacing: 7px;
    color: var(--dark);
    text-decoration: none;
    display: block;
    text-transform: uppercase;
    margin-bottom: 4px;
  }

  .logout-logo-tag {
    font-size: 8px;
    letter-spacing: 3px;
    color: var(--rose-gold);
    text-transform: uppercase;
    font-weight: 400;
    display: block;
    margin-bottom: 32px;
  }

  .logout-divider {
    width: 40px;
    height: 1px;
    background: linear-gradient(to right, transparent, var(--rose-gold-light), transparent);
    margin: 0 auto 28px;
  }

  .logout-spinner {
    width: 40px;
    height: 40px;
    border: 2px solid var(--rose-gold-pale);
    border-top-color: var(--rose-gold);
    border-radius: 50%;
    animation: spin 0.9s linear infinite;
    margin: 0 auto 20px;
  }

  .logout-loading-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px;
    font-weight: 400;
    font-style: italic;
    color: var(--dark);
    margin-bottom: 8px;
  }

  .logout-loading-sub {
    font-size: 12px;
    color: var(--muted);
    font-weight: 300;
    letter-spacing: 0.5px;
  }

  .logout-error-icon {
    font-size: 36px;
    margin-bottom: 16px;
    display: block;
  }

  .logout-error-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px;
    font-weight: 400;
    font-style: italic;
    color: var(--dark);
    margin-bottom: 8px;
  }

  .logout-error-msg {
    font-size: 13px;
    color: #c0392b;
    margin-bottom: 28px;
    font-weight: 300;
    background: #fef5f5;
    border: 1px solid #f5c6c6;
    border-left: 3px solid #e07070;
    padding: 10px 14px;
    border-radius: 2px;
    text-align: left;
  }

  .logout-btn-home {
    display: inline-block;
    background: linear-gradient(135deg, var(--rose-gold), #c4808b);
    color: var(--white);
    text-decoration: none;
    padding: 13px 36px;
    border-radius: 2px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    font-family: 'Jost', sans-serif;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 16px rgba(183,110,121,0.35);
  }

  .logout-btn-home:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 22px rgba(183,110,121,0.45);
  }
`;

export default function LogoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const logout = async () => {
      try {
        const { error } = await supabase.auth.signOut();
        if (error) {
          setError(error.message || "Failed to logout.");
        } else {
          router.push("/login");
        }
      } catch (err) {
        setError(err.message || "Logout failed.");
      } finally {
        setLoading(false);
      }
    };
    logout();
  }, [router]);

  return (
    <>
      <style>{logoutStyles}</style>
      <div className="logout-page">
        <div className="logout-card">

          {/* Logo */}
          <Link href="/" className="logout-logo">Novagem</Link>
          <span className="logout-logo-tag">Where Tech Meets Elegance</span>
          <div className="logout-divider" />

          {loading && (
            <>
              <div className="logout-spinner" />
              <h2 className="logout-loading-title">Signing you out…</h2>
              <p className="logout-loading-sub">Please wait a moment</p>
            </>
          )}

          {!loading && error && (
            <>
              <span className="logout-error-icon">⚠️</span>
              <h2 className="logout-error-title">Something went wrong</h2>
              <p className="logout-error-msg">{error}</p>
              <button onClick={() => router.push("/")} className="logout-btn-home">
                Back to Home
              </button>
            </>
          )}

        </div>
      </div>
    </>
  );
}
