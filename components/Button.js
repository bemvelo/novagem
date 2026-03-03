"use client";

/**
 * Button Component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Button content
 * @param {Function} [props.onClick] - Click handler
 * @param {"button" | "submit" | "reset"} [props.type="button"] - Button type
 * @param {"primary" | "secondary" | "success" | "danger" | "outline"} [props.variant="primary"] - Button style variant
 * @param {"sm" | "md" | "lg"} [props.size="md"] - Button size
 * @param {boolean} [props.disabled=false] - Disabled state
 * @param {boolean} [props.loading=false] - Loading state
 * @param {string} [props.className=""] - Additional CSS classes
 * @returns {JSX.Element} Rendered button component
 */
export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  className = "",
}) {
  const baseStyles =
    "font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-center";

  const variants = {
    primary:
      "bg-gradient-to-r from-black to-gray-800 text-white hover:shadow-lg hover:from-gray-900 hover:to-black",
    secondary:
      "bg-white border-2 border-black text-black hover:bg-black hover:text-white",
    success:
      "bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg hover:from-green-600 hover:to-green-700",
    danger:
      "bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg hover:from-red-600 hover:to-red-700",
    outline:
      "border-2 border-gray-300 text-black hover:border-black hover:bg-gray-50",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-6 py-2.5 text-base",
    lg: "px-8 py-3.5 text-lg",
  };

  const buttonClass = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={buttonClass}
    >
      {loading ? (
        <>
          <span className="animate-spin">⏳</span>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
}