"use client";

import { useState } from "react";
import { supabase } from "@/src/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "admin">("user");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async () => {
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Sign in with Supabase
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message || "Login failed. Please try again.");
        setLoading(false);
        return;
      }

      if (!data.user) {
        setError("Login failed. Please try again.");
        setLoading(false);
        return;
      }

      // Get user role from database
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (userError || !userData) {
        setError("Could not fetch user role");
        setLoading(false);
        return;
      }

      const userRole = userData.role || "user";

      if (role === "admin" && userRole === "admin") {
        router.push("/admin");
      } else if (role === "user") {
        router.push("/users/products");
      } else {
        setError("You don't have permission to access this role.");
      }
    } catch (error: any) {
      setError(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") login();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e8dff5] to-[#f0ebf8] flex justify-center items-center p-4">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-md p-8 border border-purple-100">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black">Welcome Back</h1>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="space-y-4 mb-6">
          <input
            type="email"
            placeholder="Username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-black focus:outline-none transition text-black placeholder-gray-500"
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-black focus:outline-none transition text-black placeholder-gray-500"
            disabled={loading}
          />
        </div>

        <div className="flex gap-4 mb-6">
          <label className="flex items-center gap-2 cursor-pointer flex-1">
            <input
              type="radio"
              name="role"
              value="user"
              checked={role === "user"}
              onChange={() => setRole("user")}
              className="w-4 h-4"
            />
            <span className="text-black font-medium">User</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer flex-1">
            <input
              type="radio"
              name="role"
              value="admin"
              checked={role === "admin"}
              onChange={() => setRole("admin")}
              className="w-4 h-4"
            />
            <span className="text-black font-medium">Admin</span>
          </label>
        </div>

        <button
          onClick={login}
          disabled={loading}
          className="w-full bg-black text-white p-3 rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}