"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/src/lib/supabase";
import NavBar from "@/components/NavBar";

type UserRole = "admin" | "user" | null;

export default function AdminProfilePage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        router.push("/login");
        return;
      }

      setEmail(session.user.email || "");

      try {
        const { data, error } = await supabase
          .from("users")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (error || !data) {
          setRole("admin");
        } else {
          setRole(data.role);
        }
      } catch (err: any) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (loading) {
    return <p className="p-10 text-center">Loading profile...</p>;
  }

  return (
    <div className="min-h-screen bg-[#e6e6fa] p-6 text-black">
      <NavBar />
      <h1 className="text-3xl font-bold mb-6">Admin Profile - {email}</h1>
      <p className="text-gray-600">Welcome to the admin panel</p>
    </div>
  );
}
