'use client';

// Mock data
const mockProduct = {
  id: 'product-1',
  name: 'Luxury Purple Gemstone Ring',
  price: 259.99,
  description:
    'Beautiful handcrafted ring with premium amethyst gemstone set in sterling silver.',
  category: 'Rings',
  rating: 4.5,
  reviewCount: 24,
  material: 'Sterling Silver',
  gemstone: 'Amethyst',
};

export default function ProductDetailExample() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {mockProduct.name}
          </h1>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <span key={i} className={i <= Math.round(mockProduct.rating) ? 'text-yellow-400' : 'text-gray-300'}>
                  ★
                </span>
              ))}
            </div>
            <span className="font-semibold">{mockProduct.rating}</span>
            <span className="text-gray-600">({mockProduct.reviewCount} reviews)</span>
            <p className="text-gray-600 ml-4">
              {mockProduct.category} • {mockProduct.material}
            </p>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Product Image & Info */}
          <div className="md:col-span-1">
            <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg h-80 flex items-center justify-center text-6xl">
              ✨
            </div>
            <p className="text-4xl font-bold text-gray-900 mt-6 mb-2">
              ${mockProduct.price}
            </p>
            <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition">
              Add to Cart
            </button>
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Product Details
            </h2>
            <p className="text-gray-700 text-lg mb-6">
              {mockProduct.description}
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <span className="font-semibold text-gray-700 w-32">
                  Material:
                </span>
                <span className="text-gray-600">{mockProduct.material}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold text-gray-700 w-32">
                  Gemstone:
                </span>
                <span className="text-gray-600">{mockProduct.gemstone}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold text-gray-700 w-32">
                  Category:
                </span>
                <span className="text-gray-600">{mockProduct.category}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
