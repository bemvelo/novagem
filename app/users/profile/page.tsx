"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/src/lib/supabase";
import NavBar from "@/components/NavBar";

type UserRole = "admin" | "user" | null;

export default function ProfilePage() {
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
          setRole("user");
        } else {
          setRole(data.role);
        }
      } catch (err: any) {
        console.error(err.message);
        setRole("user");
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
      <h1 className="text-3xl font-bold mb-6">Welcome, {email}</h1>

      {role === "admin" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AdminCard title="Products" link="/admin/products" />
          <AdminCard title="Orders" link="/admin/orders" />
          <AdminCard title="Analytics" link="/admin/analytics" />
          <AdminCard title="Users" link="/admin/users" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UserCard title="Products" link="/users/products" />
          <UserCard title="Cart" link="/users/cart" />
          <UserCard title="Checkout" link="/users/checkout" />
          <UserCard title="Logout" link="/logout" />
        </div>
      )}
    </div>
  );
}

function AdminCard({ title, link }: { title: string; link: string }) {
  return (
    <a href={link} className="block p-6 rounded-lg bg-white shadow hover:bg-gray-100">
      <h2 className="text-xl font-bold">{title}</h2>
    </a>
  );
}

function UserCard({ title, link }: { title: string; link: string }) {
  return (
    <a href={link} className="block p-6 rounded-lg bg-white shadow hover:bg-gray-100">
      <h2 className="text-xl font-bold">{title}</h2>
    </a>
  );
}