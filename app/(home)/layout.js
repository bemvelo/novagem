"use client";

import "../app/globals.css"; // Import global CSS
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--accent)] text-[var(--primary)]">
      <NavBar />
      <main className="flex-1 container">{children}</main>
      <Footer />
    </div>
  );
}
