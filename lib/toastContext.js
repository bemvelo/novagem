"use client";

import React, { useState, useCallback } from "react";

const ToastContext = React.createContext(undefined);

export const ToastProvider = ({ children }) => {
  children,
}) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info") => {
    const id = Date.now().toString();
    const newToast = { id, message, type };

    setToasts((prev) => [...prev, newToast]);

    // Auto-remove after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};

function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            animate-fade-in px-6 py-4 rounded-lg shadow-lg border-l-4 flex items-center justify-between
            max-w-sm text-white font-medium transition-all
            ${
              toast.type === "success"
                ? "bg-green-500 border-green-600"
                : toast.type === "error"
                ? "bg-red-500 border-red-600"
                : toast.type === "warning"
                ? "bg-yellow-500 border-yellow-600"
                : "bg-blue-500 border-blue-600"
            }
          `}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">
              {toast.type === "success"
                ? "✓"
                : toast.type === "error"
                ? "✕"
                : toast.type === "warning"
                ? "⚠"
                : "ℹ"}
            </span>
            <span>{toast.message}</span>
          </div>
          <button
            onClick={() => onRemove(toast.id)}
            className="ml-4 text-white hover:opacity-70 transition"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
