"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import Link from "next/link";
import AnalyticsChart from "../../../components/AnalyticsChart";

const analyticsStyles = `
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

  .analytics-page {
    min-height: 100vh;
    background: var(--cream);
    font-family: 'Jost', sans-serif;
    color: var(--dark);
  }

  /* Hero — identical pattern to admin/products */
  .analytics-hero {
    background: linear-gradient(135deg, #2c1810 0%, #5a3e38 55%, #b76e79 100%);
    padding: 48px 40px 72px;
    position: relative;
    overflow: hidden;
  }

  .analytics-hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 80% 40%, rgba(240,217,200,0.15) 0%, transparent 60%);
    pointer-events: none;
  }

  .analytics-hero-orb-1 {
    position: absolute;
    top: -100px; right: -80px;
    width: 360px; height: 360px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(183,110,121,0.25) 0%, transparent 65%);
    pointer-events: none;
  }

  .analytics-hero-orb-2 {
    position: absolute;
    bottom: -60px; left: -40px;
    width: 240px; height: 240px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(44,24,16,0.2) 0%, transparent 65%);
    pointer-events: none;
  }

  .analytics-hero-inner {
    max-width: 1300px;
    margin: 0 auto;
    position: relative;
  }

  .analytics-hero-breadcrumb {
    font-size: 10px;
    letter-spacing: 4px;
    color: var(--rose-gold-light);
    text-transform: uppercase;
    font-weight: 600;
    margin-bottom: 12px;
  }

  .analytics-hero-breadcrumb a {
    color: var(--champagne);
    text-decoration: none;
    transition: color 0.2s;
  }

  .analytics-hero-breadcrumb a:hover { color: var(--white); }

  .analytics-hero-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(26px, 4vw, 46px);
    font-weight: 300;
    letter-spacing: 3px;
    color: var(--white);
    margin-bottom: 8px;
    line-height: 1.1;
  }

  .analytics-hero-sub {
    font-size: 13px;
    color: rgba(240,217,200,0.7);
    font-weight: 300;
    letter-spacing: 0.5px;
  }

  /* Content */
  .analytics-content {
    max-width: 1300px;
    margin: -36px auto 0;
    padding: 0 40px 60px;
    position: relative;
    z-index: 1;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Stat cards row */
  .analytics-stats {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 16px;
    margin-bottom: 26px;
    animation: fadeUp 0.5s ease both;
  }

  .analytics-stat-card {
    background: var(--white);
    border-radius: 4px;
    padding: 22px 24px;
    border: 1px solid var(--cream-border);
    box-shadow: 0 2px 10px rgba(44,24,16,0.05);
    transition: all 0.22s;
  }

  .analytics-stat-card:hover {
    box-shadow: 0 8px 24px rgba(183,110,121,0.13);
    transform: translateY(-2px);
    border-color: var(--rose-gold-pale);
  }

  .analytics-stat-label {
    font-size: 10px;
    letter-spacing: 2.5px;
    color: var(--muted);
    text-transform: uppercase;
    font-weight: 600;
    margin-bottom: 10px;
  }

  .analytics-stat-value {
    font-family: 'Cormorant Garamond', serif;
    font-size: 34px;
    font-weight: 600;
    color: var(--rose-gold);
    letter-spacing: 1px;
    line-height: 1;
    margin-bottom: 4px;
  }

  .analytics-stat-sub {
    font-size: 11px;
    color: var(--muted);
    font-weight: 300;
  }

  /* Chart panels */
  .analytics-charts {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(520px, 1fr));
    gap: 20px;
    margin-bottom: 20px;
    animation: fadeUp 0.6s ease 0.1s both;
  }

  .analytics-chart-panel {
    background: var(--white);
    border-radius: 4px;
    padding: 28px;
    border: 1px solid var(--cream-border);
    box-shadow: 0 2px 10px rgba(44,24,16,0.05);
    transition: all 0.25s;
  }

  .analytics-chart-panel:hover {
    box-shadow: 0 10px 28px rgba(183,110,121,0.12);
    border-color: var(--rose-gold-pale);
  }

  /* Coming soon panel */
  .analytics-coming-soon {
    background: var(--white);
    border-radius: 4px;
    padding: 36px 40px;
    border: 1px solid var(--cream-border);
    box-shadow: 0 2px 10px rgba(44,24,16,0.05);
    animation: fadeUp 0.6s ease 0.2s both;
    display: flex;
    align-items: center;
    gap: 28px;
    flex-wrap: wrap;
  }

  .analytics-coming-icon {
    font-size: 48px;
    opacity: 0.7;
    flex-shrink: 0;
  }

  .analytics-coming-body { flex: 1; min-width: 240px; }

  .analytics-coming-eyebrow {
    font-size: 10px;
    letter-spacing: 3px;
    color: var(--rose-gold);
    text-transform: uppercase;
    font-weight: 600;
    margin-bottom: 6px;
  }

  .analytics-coming-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 24px;
    font-weight: 400;
    color: var(--dark);
    margin-bottom: 8px;
    letter-spacing: 1px;
  }

  .analytics-coming-desc {
    font-size: 13px;
    color: var(--muted);
    font-weight: 300;
    line-height: 1.65;
  }

  .analytics-coming-tags {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: 14px;
  }

  .analytics-coming-tag {
    background: var(--rose-gold-pale);
    color: var(--rose-gold);
    font-size: 10px;
    font-weight: 600;
    padding: 4px 12px;
    border-radius: 2px;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    font-family: 'Jost', sans-serif;
  }

  /* Loading */
  .analytics-loading {
    text-align: center;
    padding: 80px 0;
    color: var(--muted);
    font-size: 13px;
    font-weight: 300;
    letter-spacing: 1px;
    animation: fadeUp 0.4s ease both;
  }

  @media (max-width: 640px) {
    .analytics-hero { padding: 40px 20px 64px; }
    .analytics-content { padding: 0 16px 48px; }
    .analytics-charts { grid-template-columns: 1fr; }
  }
`;

export default function AnalyticsPage() {
  const [stats, setStats] = useState({ products: 0, categories: 0, lowStock: 0, avgPrice: 0 });
  const [loading, setLoading] = useState(true);

  // ✅ Pull real stats from Supabase instead of hardcoded dummy data
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("price, category, stock");
        if (!error && data) {
          const categories = new Set(data.map(p => p.category)).size;
          const lowStock = data.filter(p => p.stock !== undefined && p.stock <= 5).length;
          const avgPrice = data.length
            ? (data.reduce((sum, p) => sum + Number(p.price || 0), 0) / data.length).toFixed(2)
            : 0;
          setStats({ products: data.length, categories, lowStock, avgPrice });
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchStats();
  }, []);

  // Chart data — replace with real order/visit data when available
  const salesData = [
    { month: "Jan", sales: 120 },
    { month: "Feb", sales: 200 },
    { month: "Mar", sales: 150 },
    { month: "Apr", sales: 280 },
    { month: "May", sales: 310 },
    { month: "Jun", sales: 260 },
  ];

  const visitsData = [
    { day: "Mon", visits: 300 },
    { day: "Tue", visits: 450 },
    { day: "Wed", visits: 500 },
    { day: "Thu", visits: 380 },
    { day: "Fri", visits: 420 },
    { day: "Sat", visits: 610 },
    { day: "Sun", visits: 540 },
  ];

  return (
    <>
      <style>{analyticsStyles}</style>
      <div className="analytics-page">

        {/* Hero */}
        <div className="analytics-hero">
          <div className="analytics-hero-orb-1" />
          <div className="analytics-hero-orb-2" />
          <div className="analytics-hero-inner">
            <p className="analytics-hero-breadcrumb">
              <Link href="/admin">Admin</Link> &nbsp;/&nbsp; Analytics
            </p>
            <h1 className="analytics-hero-title">Analytics</h1>
            <p className="analytics-hero-sub">Performance overview for your Novagem store</p>
          </div>
        </div>

        <div className="analytics-content">

          {/* Stat cards */}
          {loading ? (
            <div className="analytics-loading">
              <div style={{ fontSize: "44px", marginBottom: "14px", opacity: 0.6 }}>📊</div>
              <p>Loading analytics...</p>
            </div>
          ) : (
            <>
              <div className="analytics-stats">
                <div className="analytics-stat-card">
                  <p className="analytics-stat-label">Total Products</p>
                  <p className="analytics-stat-value">{stats.products}</p>
                  <p className="analytics-stat-sub">pieces in catalogue</p>
                </div>
                <div className="analytics-stat-card">
                  <p className="analytics-stat-label">Categories</p>
                  <p className="analytics-stat-value">{stats.categories}</p>
                  <p className="analytics-stat-sub">active collections</p>
                </div>
                <div className="analytics-stat-card">
                  <p className="analytics-stat-label">Avg. Price</p>
                  <p className="analytics-stat-value">${stats.avgPrice}</p>
                  <p className="analytics-stat-sub">across all products</p>
                </div>
                <div className="analytics-stat-card">
                  <p className="analytics-stat-label">Low Stock</p>
                  <p className="analytics-stat-value" style={{ color: stats.lowStock > 0 ? "#b85c5c" : "var(--rose-gold)" }}>
                    {stats.lowStock}
                  </p>
                  <p className="analytics-stat-sub">items need restocking</p>
                </div>
              </div>

              {/* Charts */}
              <div className="analytics-charts">
                <div className="analytics-chart-panel">
                  <AnalyticsChart title="Product Sales" data={salesData} />
                </div>
                <div className="analytics-chart-panel">
                  <AnalyticsChart title="Site Visits" data={visitsData} />
                </div>
              </div>

              {/* Coming soon */}
              <div className="analytics-coming-soon">
                <div className="analytics-coming-icon">🔮</div>
                <div className="analytics-coming-body">
                  <p className="analytics-coming-eyebrow">Coming Soon</p>
                  <h2 className="analytics-coming-title">Market Analytics</h2>
                  <p className="analytics-coming-desc">
                    Deep insights into customer demographics, trending categories, regional sales performance, and conversion funnels — all styled for the Novagem experience.
                  </p>
                  <div className="analytics-coming-tags">
                    <span className="analytics-coming-tag">Demographics</span>
                    <span className="analytics-coming-tag">Trending</span>
                    <span className="analytics-coming-tag">Regional Sales</span>
                    <span className="analytics-coming-tag">Conversions</span>
                  </div>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </>
  );
}