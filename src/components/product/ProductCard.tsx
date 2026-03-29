import { Heart, ShoppingCart, Eye, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: number) => void;
  isAdded?: boolean;
}

export default function ProductCard({
  product,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
  isAdded = false,
}: ProductCardProps) {
  const navigate = useNavigate();

  return (
    <div className="product-card group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500">
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.badge && (
            <span className="badge badge-danger sale-pulse">
              {product.badge}
            </span>
          )}
          {product.isNew && (
            <span className="badge badge-warning">
              ใหม่
            </span>
          )}
          {product.isBestseller && (
            <span className="badge badge-primary">
              ขายดี
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={() => onToggleWishlist(product.id)}
          className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
            isWishlisted
              ? 'bg-red-500 text-white'
              : 'bg-white/90 text-gray-600 hover:bg-red-50 hover:text-red-500'
          }`}
        >
          <Heart
            className={`w-5 h-5 transition-transform ${
              isWishlisted ? 'fill-white scale-110' : ''
            }`}
          />
        </button>

        {/* Quick Actions Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex gap-2">
            <button
              className="btn btn-sm flex-1 bg-white/90 hover:bg-white text-gray-900 flex items-center justify-center"
              onClick={() => navigate(`/products/${product.id}`)}
            >
              <Eye className="w-4 h-4 mr-1" />
              ดู
            </button>
            <button
              className="btn btn-primary btn-sm flex-1 flex items-center justify-center"
              onClick={() => onAddToCart(product)}
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              {isAdded ? 'เพิ่มแล้ว' : 'เพิ่ม'}
            </button>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Category */}
        <span className="text-xs text-gray-500 uppercase tracking-wide">
          {product.category}
        </span>

        {/* Name */}
        <h3 className="font-bold text-gray-900 mt-1 mb-2 line-clamp-2 group-hover:text-orange-500 transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-medium text-gray-700">
              {product.rating}
            </span>
          </div>
          <span className="text-sm text-gray-400">
            ({product.reviews} รีวิว)
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-orange-500">
            ฿{product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              ฿{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
