"use client";

export default function ProductCard({ product, addToCart }) {
  return (
    <div className="border p-4 rounded shadow">
      <h2 className="text-lg font-bold">{product.name}</h2>
      <p className="text-gray-600">${product.price}</p>
      <button
        onClick={() => addToCart(product)}
        className="bg-blue-600 text-white px-3 py-1 mt-2"
      >
        Add to Cart
      </button>
    </div>
  );
}
