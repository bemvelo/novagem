"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";
import Link from "next/link";

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

type SortOption = "featured" | "price-low" | "price-high" | "newest";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
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
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = (id: string) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const qty = (prev[id] || 0) - 1;
      if (qty <= 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: qty };
    });
  };

  let filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Apply sorting
  if (sortBy === "price-low") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (sortBy === "newest") {
    // Assuming newer items are at the end of the array
    filteredProducts = [...filteredProducts].reverse();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e8dff5] to-[#f0ebf8]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#d4c5e8] to-[#e0d5f0] px-6 py-16 mb-12 rounded-2xl border border-purple-200 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-black mb-3">✨ Our Collection</h1>
          <p className="text-lg text-gray-700">
            Discover {products.length} stunning pieces of jewelry
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Filters & Search */}
        <div className="mb-10 bg-white p-6 rounded-xl border border-gray-200 shadow-md">
          <SearchBar value={search} onChange={setSearch} />

          {/* Categories & Sorting */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mt-6">
            <div className="flex-1">
              <CategoryMenu
                categories={["All", "Rings", "Necklaces", "Earrings", "Accessories"]}
                onSelect={setSelectedCategory}
              />
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="border-2 border-gray-300 px-4 py-2.5 rounded-lg focus:border-black focus:outline-none bg-white text-black font-semibold hover:border-black transition"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>

          {/* Results Count */}
          <p className="text-sm text-gray-600 mt-4 font-medium">
            Showing <span className="font-bold text-black">{filteredProducts.length}</span> product{filteredProducts.length !== 1 ? "s" : ""}
            {cart && Object.values(cart).reduce((a, b) => a + b, 0) > 0 && (
              <span className="ml-4 text-black font-bold bg-green-100 px-3 py-1 rounded-full inline-block">
                Cart ({Object.values(cart).reduce((a, b) => a + b, 0)} items)
              </span>
            )}
          </p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg mb-4">No products found</p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedCategory("All");
              }}
              className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                quantity={cart[product.id] || 0}
                onAdd={() => addToCart(product.id)}
                onRemove={() => removeFromCart(product.id)}
              />
            ))}
          </div>
        )}

        {/* Floating Cart Button */}
        {Object.values(cart).reduce((a, b) => a + b, 0) > 0 && (
          <div className="fixed bottom-8 right-8">
            <Link
              href="/users/cart"
              className="bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition shadow-lg flex items-center gap-2"
            >
              🛒 View Cart ({Object.values(cart).reduce((a, b) => a + b, 0)})
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}