"use client";

import { useState } from "react";
import { supabase } from "@/src/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const signup = async () => {
    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Sign up with Supabase
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        setError(authError.message || "Sign up failed. Please try again.");
        setLoading(false);
        return;
      }

      if (!data.user) {
        setError("Sign up failed. Please try again.");
        setLoading(false);
        return;
      }

      const role = email === "admin@gleamia.com" ? "admin" : "user";

      // Insert user data into users table
      const { error: insertError } = await supabase.from("users").insert({
        id: data.user.id,
        email,
        role,
        created_at: new Date().toISOString(),
      });

      if (insertError) {
        setError(insertError.message || "Failed to create user profile");
        setLoading(false);
        return;
      }

      if (role === "admin") {
        router.push("/admin");
      } else {
        router.push("/users/products");
      }
    } catch (error: any) {
      setError(error.message || "Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") signup();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e8dff5] to-[#f0ebf8] flex justify-center items-center p-4">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-md p-8 border border-purple-100">
        <div className="text-center mb-8">
          <p className="text-purple-600 font-semibold text-sm tracking-widest mb-2">CREATE ACCOUNT</p>
          <h1 className="text-3xl font-bold text-black">Sign Up</h1>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4 mb-6">
          <input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-black focus:outline-none transition text-black"
            disabled={loading}
          />

          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-black focus:outline-none transition text-black"
            disabled={loading}
          />

          <input
            placeholder="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-black focus:outline-none transition text-black"
            disabled={loading}
          />
        </div>

        <button
          onClick={signup}
          disabled={loading}
          className="w-full bg-black text-white p-3 rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        <p className="text-center text-gray-700 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-black font-semibold hover:underline">
            Login
          </Link>
        </p>

        <p className="text-center text-gray-700 mt-4">
          <Link href="/" className="text-gray-600 hover:text-black transition">
            ← Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
}