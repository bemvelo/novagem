"use client";

import { useWishlist } from "@/lib/wishlistContext";
import StarRating from "./StarRating";

type Product = {
  id: string;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
};

type ProductCardProps = {
  product: Product;
  quantity?: number;
  onAdd?: () => void;
  onRemove?: () => void;
};

export default function ProductCard({
  product,
  quantity = 0,
  onAdd,
  onRemove,
}: ProductCardProps) {
  const hasControls = onAdd && onRemove;
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition border border-gray-200 overflow-hidden group">
      {/* Image Placeholder with Wishlist Button */}
      <div className="relative">
        <div className="w-full h-48 bg-gradient-to-br from-[#e6e6fa] to-[#f5f5dc] flex items-center justify-center text-4xl group-hover:scale-105 transition">
          {product.imageUrl ? product.imageUrl : "✨"}
        </div>
        <button
          onClick={() =>
            inWishlist ? removeFromWishlist(product.id) : addToWishlist(product.id)
          }
          className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-lg hover:scale-110 transition"
        >
          {inWishlist ? "❤️" : "🤍"}
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Category Badge */}
        {product.category && (
          <span className="inline-block bg-gray-200 text-gray-800 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            {product.category}
          </span>
        )}

        {/* Title */}
        <h3 className="text-lg font-bold text-black mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Description */}
        {product.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Rating */}
        {product.rating !== undefined && (
          <div className="mb-3">
            <StarRating 
              rating={product.rating} 
              totalReviews={product.reviewCount || 0}
              size="sm"
            />
          </div>
        )}

        {/* Price */}
        <p className="text-2xl font-bold text-black mb-4">
          ${product.price.toFixed(2)}
        </p>

        {/* Quantity/Add Controls */}
        {hasControls && (
          <div className="flex items-center justify-between bg-gray-100 rounded-lg p-2 mb-3">
            <button
              onClick={onRemove}
              disabled={quantity <= 0}
              className="font-bold text-lg text-black hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              −
            </button>
            <span className="font-semibold text-black min-w-[40px] text-center">
              {quantity}
            </span>
            <button
              onClick={onAdd}
              className="font-bold text-lg text-black hover:text-green-600"
            >
              +
            </button>
          </div>
        )}

        {/* Add to Cart Button */}
        {hasControls ? (
          quantity > 0 ? (
            <div className="text-sm font-semibold text-green-600 text-center bg-green-50 py-2 rounded">
              In Cart
            </div>
          ) : (
            <button
              onClick={onAdd}
              className="w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition"
            >
              Add to Cart
            </button>
          )
        ) : null}
      </div>
    </div>
  );
}
