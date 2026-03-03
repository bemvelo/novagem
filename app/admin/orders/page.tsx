"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";

type Order = {
  id: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: "pending" | "shipped" | "completed";
  user_email?: string;
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching orders:", error);
          setOrders([]);
        } else {
          setOrders(data || []);
        }
      } catch (err) {
        console.error(err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const updateStatus = async (orderId: string, newStatus: Order["status"]) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) {
        alert("Error updating order status: " + error.message);
      } else {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch (error: any) {
      alert("Error updating order status: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#e6e6fa] text-black p-6">
        <h1 className="text-3xl font-bold mb-8">Manage Orders</h1>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e6e6fa] text-black p-6">
      <h1 className="text-3xl font-bold mb-8">Manage Orders</h1>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-6 rounded shadow"
            >
              <h2 className="text-xl font-semibold mb-2">
                Order #{order.id} — {order.user_email || "N/A"}
              </h2>
              <p className="mb-2 font-medium">Status: {order.status}</p>

              <ul className="mb-4">
                {order.items && order.items.map((p, i) => (
                  <li key={i} className="flex justify-between">
                    <span>{p.name} x {p.quantity}</span>
                    <span>${(p.price * p.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>

              <p className="font-bold mb-4">Total: ${order.total.toFixed(2)}</p>

              <div className="flex gap-2">
                {order.status === "pending" && (
                  <button
                    onClick={() => updateStatus(order.id, "shipped")}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Mark as Shipped
                  </button>
                )}
                {order.status !== "completed" && (
                  <button
                    onClick={() => updateStatus(order.id, "completed")}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Complete Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}