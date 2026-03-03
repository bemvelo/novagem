"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";

export default function NavBar() {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        
        // Get user role from database
        const { data, error } = await supabase
          .from("users")
          .select("role")
          .eq("id", session.user.id)
          .single();
        
        if (data && !error) {
          setRole(data.role || "user");
        } else {
          setRole("user");
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
  };

  return (
    <nav className="bg-gradient-to-r from-[#e8dff5] to-[#f0ebf8] shadow-lg sticky top-0 z-50 border-b border-purple-200">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-black hover:text-gray-700 transition">
          ✨
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-black hover:text-gray-700 transition font-medium">
            Home
          </Link>
          {user && (
            <>
              <Link
                href={role === "admin" ? "/admin/products" : "/users/products"}
                className="text-black hover:text-gray-700 transition font-medium"
              >
                Products
              </Link>
              {role !== "admin" && (
                <>
                  <Link
                    href="/users/cart"
                    className="text-black hover:text-gray-700 transition font-medium"
                  >
                    🛒 Cart
                  </Link>
                  <Link
                    href="/users/profile"
                    className="text-black hover:text-gray-700 transition font-medium"
                  >
                    👤 Profile
                  </Link>
                </>
              )}
              {role === "admin" && (
                <Link
                  href="/admin"
                  className="text-black hover:text-gray-700 transition font-medium"
                >
                  📊 Dashboard
                </Link>
              )}
            </>
          )}
        </div>

        {/* Auth Section */}
        <div className="flex items-center gap-4">
          {!loading && (
            <>
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-700 hidden sm:inline">
                    {user.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition text-sm font-medium"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link
                    href="/login"
                    className="text-black hover:text-gray-700 transition font-medium text-sm"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition text-sm font-medium"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-black text-xl"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t p-4 space-y-2">
          <Link href="/" className="block text-black hover:bg-gray-100 p-2 rounded">
            Home
          </Link>
          {user && (
            <>
              <Link
                href={role === "admin" ? "/admin/products" : "/users/products"}
                className="block text-black hover:bg-gray-100 p-2 rounded"
              >
                Products
              </Link>
              {role !== "admin" && (
                <>
                  <Link
                    href="/users/cart"
                    className="block text-black hover:bg-gray-100 p-2 rounded"
                  >
                    🛒 Cart
                  </Link>
                  <Link
                    href="/users/profile"
                    className="block text-black hover:bg-gray-100 p-2 rounded"
                  >
                    👤 Profile
                  </Link>
                </>
              )}
              {role === "admin" && (
                <Link
                  href="/admin"
                  className="block text-black hover:bg-gray-100 p-2 rounded"
                >
                  📊 Dashboard
                </Link>
              )}
            </>
          )}
        </div>
      )}
    </nav>
  );
}
