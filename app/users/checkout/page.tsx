"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/src/lib/supabase";

type Product = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export default function CheckoutPage() {
  const router = useRouter();

  const [cart, setCart] = useState<Product[]>([]);
  const [phone, setPhone] = useState("");
  const [method, setMethod] = useState("ecocash");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* Load cart */
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(data);
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handlePayment = async () => {
    if (!phone) {
      setError("Enter phone number");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        setError("Please log in to complete checkout");
        setLoading(false);
        return;
      }

      /* Save order to Supabase */
      const { error: insertError } = await supabase.from("orders").insert({
        user_id: session.user.id,
        user_email: session.user.email,
        items: cart,
        total,
        phone,
        method,
        status: "pending",
        created_at: new Date().toISOString(),
      });

      if (insertError) {
        setError(insertError.message || "Failed to create order");
        setLoading(false);
        return;
      }

      /* Clear cart */
      localStorage.removeItem("cart");

      router.push("/users/checkout/success");
    } catch (err: any) {
      setError(err.message || "An error occurred");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-black">Checkout</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Order summary */}
      <div className="bg-white p-4 rounded shadow border">
        {cart.length === 0 ? (
          <p className="text-gray-600">Your cart is empty</p>
        ) : (
          <>
            {cart.map((item) => (
              <p key={item.id} className="text-black">
                {item.name} x {item.quantity} — ${(item.price * item.quantity).toFixed(2)}
              </p>
            ))}
            <p className="font-bold mt-3 text-lg text-black">Total: ${total.toFixed(2)}</p>
          </>
        )}
      </div>

      {/* Phone */}
      <input
        type="text"
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="border-2 border-gray-300 p-3 w-full rounded text-black focus:border-black focus:outline-none"
        disabled={loading}
      />

      {/* Payment method */}
      <select
        value={method}
        onChange={(e) => setMethod(e.target.value)}
        className="border-2 border-gray-300 p-3 w-full rounded text-black focus:border-black focus:outline-none"
        disabled={loading}
      >
        <option value="ecocash">EcoCash</option>
        <option value="cod">Cash on Delivery</option>
      </select>

      {/* Pay button */}
      <button
        onClick={handlePayment}
        disabled={loading || cart.length === 0}
        className="w-full bg-black text-white py-3 rounded font-semibold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Processing..." : "Complete Order"}
      </button>
    </div>
  );
}