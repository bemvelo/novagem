"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";

import NavBar from "../../../components/NavBar";
import ProductCard from "../../../components/ProductCard";
import SearchBar from "../../../components/SearchBar";
import CategoryMenu from "../../../components/CategoryMenu";

type Product = {
  id: string;
  name: string;
  price: number;
  description?: string;
  image_url?: string;
  category?: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*");

        if (error) {
          console.error("Error fetching products:", error);
          setProducts([]);
        } else {
          setProducts(data || []);
        }
      } catch (error: any) {
        console.error("Error:", error.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#e6e6fa] text-black p-6">
        <NavBar />
        <h1 className="text-3xl font-bold mb-6 text-center">Products</h1>
        <p className="text-center">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e6e6fa] text-black p-6">
      <NavBar />

      <h1 className="text-3xl font-bold mb-6 text-center">Products</h1>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <SearchBar value={search} onChange={setSearch} />
        <CategoryMenu
          categories={["All", "Bags", "Jewelry", "Watches"]}
          onSelect={setSelectedCategory}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white p-4 rounded shadow-md flex flex-col justify-between"
          >
            {product.image_url && (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-48 object-cover rounded mb-4"
              />
            )}
            <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
            <p className="text-gray-700 mb-2">{product.description}</p>
            <p className="text-lg font-bold mb-4">${product.price}</p>
            <div className="flex gap-2">
              <button className="bg-black text-white px-3 py-1 rounded hover:bg-gray-800 transition">
                Add to Cart +
              </button>
              <button className="bg-pink-500 text-white px-3 py-1 rounded hover:bg-pink-400 transition">
                Remove -
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}