"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const WishlistContext = createContext(undefined);

export const WishlistProvider = ({
  children,
}) => {
  const [wishlist, setWishlist] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("novagem-wishlist");
    if (saved) {
      try {
        setWishlist(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load wishlist:", e);
      }
    }
    setHydrated(true);
  }, []);

  // Save to localStorage whenever wishlist changes
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem("novagem-wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist, hydrated]);

  const addToWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev : [...prev, productId]
    );
  };

  const removeFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter((id) => id !== productId));
  };

  const isInWishlist = (productId: string) => {
    return wishlist.includes(productId);
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
};
