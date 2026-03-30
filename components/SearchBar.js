"use client";

import { useState } from "react";

export default function SearchBar({ value, onChange }) {
  const [focused, setFocused] = useState(false);

  return (
    <div
      className={`flex items-center border-2 rounded-lg px-4 py-3 w-full max-w-md shadow-md transition-all ${
        focused
          ? "border-black bg-white shadow-lg scale-105"
          : "border-gray-300 bg-white hover:border-gray-400"
      }`}
    >
      {/* Search Icon */}
      <span className="text-xl mr-3 text-gray-500">🔍</span>

      {/* Input */}
      <input
        type="text"
        placeholder="Search jewellery..."
        value={value}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 outline-none bg-transparent text-black placeholder-gray-500 font-medium"
      />

      {/* Clear button */}
      {value && (
        <button
          onClick={() => onChange("")}
          className="ml-2 text-gray-400 hover:text-red-500 transition text-lg font-bold"
        >
          ✕
        </button>
      )}
    </div>
  );
}
