"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/src/lib/supabase";

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e8dff5] to-[#f0ebf8]">
      {/* Hero Section */}
      <section className="px-4 py-20 md:py-32 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-black mb-6">
          Discover Timeless Elegance
        </h1>
        <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
          Handcrafted jewelry that tells your story. From necklaces to rings, find the perfect piece to express yourself.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={isLoggedIn ? "/users/products" : "/login"}
            className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
          >
            {isLoggedIn ? "Shop Now" : "Get Started"}
          </Link>
          <Link
            href="#features"
            className="border-2 border-black text-black px-8 py-3 rounded-lg font-semibold hover:bg-black hover:text-white transition"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="px-4 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Collections</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Necklaces", desc: "Elegant chains and pendants" },
            { name: "Rings", desc: "Statement and everyday rings" },
            { name: "Earrings", desc: "Timeless ear adornments" },
          ].map((cat) => (
            <Link
              key={cat.name}
              href={isLoggedIn ? `/users/products?category=${cat.name}` : "/login"}
              className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition text-center"
            >
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-semibold mb-2">{cat.name}</h3>
              <p className="text-gray-600">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="features" className="bg-[#e6e6fa] px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose GLEAMIA</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: "🎨", title: "Handcrafted", desc: "Each piece is carefully made" },
              { icon: "✅", title: "Quality Assured", desc: "Premium materials guaranteed" },
              { icon: "🚚", title: "Fast Shipping", desc: "Delivered within 3-5 days" },
              { icon: "💰", title: "Fair Prices", desc: "Best value for luxury" },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">What Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Sarah M.", review: "Beautiful quality! Arrived perfectly packaged." },
            { name: "James L.", review: "Exactly what I was looking for. Highly recommend!" },
            { name: "Anna R.", review: "Amazing customer service and stunning pieces." },
          ].map((testi, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow">
              <p className="text-yellow-500 mb-2">⭐⭐⭐⭐⭐</p>
              <p className="text-gray-700 mb-4">"{testi.review}"</p>
              <p className="font-semibold text-black">— {testi.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-black text-white px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Find Your Perfect Piece?</h2>
        <p className="text-lg mb-6 max-w-2xl mx-auto">
          Join thousands of happy customers who've found their favorite jewelry at GLEAMIA.
        </p>
        {!isLoggedIn && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-black transition"
            >
              Sign Up
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}