"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const logout = async () => {
      try {
        const { error } = await supabase.auth.signOut();
        
        if (error) {
          setError(error.message || "Failed to logout");
        } else {
          // Redirect to login after successful logout
          router.push("/login");
        }
      } catch (err: any) {
        setError(err.message || "Logout failed");
      } finally {
        setLoading(false);
      }
    };

    logout();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Logging out...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return null;
}