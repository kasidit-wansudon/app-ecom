import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '@/components/product/ProductCard';
import { mockProducts } from '@/data/mockData';
import { useApp } from '@/context/AppContext';
import { Heart, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import type { Product } from '@/types';

export default function WishlistPage() {
  const navigate = useNavigate();
  const { addToCart, wishlist, toggleWishlist } = useApp();
  const [addedToCart, setAddedToCart] = useState<number[]>([]);

  // Filter products that are in wishlist
  const wishlistProducts = mockProducts.filter(p => wishlist.includes(p.id));

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setAddedToCart(prev => [...prev, product.id]);
    toast.success('เพิ่มสินค้าลงตะกร้าเรียบร้อย!', {
      description: product.name,
      duration: 2000,
    });
    setTimeout(() => {
      setAddedToCart(prev => prev.filter(id => id !== product.id));
    }, 2000);
  };

  const handleRemoveWishlist = (productId: number) => {
    toggleWishlist(productId);
    toast.success('ลบออกจากรายการโปรดเรียบร้อย');
  };

  if (wishlistProducts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center py-12">
        <div className="card text-center p-8 max-w-md">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            รายการโปรดว่างเปล่า
          </h1>
          <p className="text-gray-600 mb-6">
            คุณยังไม่ได้เพิ่มสินค้าลงในรายการโปรด
            กลับไปเลือกสินค้าที่คุณชอบ
          </p>
          <button
            className="btn btn-primary w-full"
            onClick={() => navigate('/products')}
          >
            เลือกสินค้า
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              รายการโปรด
            </h1>
            <p className="text-gray-600">
              คุณมี {wishlistProducts.length} รายการในรายการโปรด
            </p>
          </div>
          <button
            className="btn btn-primary mt-4 sm:mt-0 flex items-center gap-2"
            onClick={() => navigate('/products')}
          >
            <ArrowRight className="w-4 h-4" />
            เลือกสินค้าเพิ่มเติม
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistProducts.map(product => (
            <div key={product.id} className="relative group">
              <ProductCard
                product={product}
                onAddToCart={handleAddToCart}
                isWishlisted={wishlist.includes(product.id)}
                onToggleWishlist={handleRemoveWishlist}
                isAdded={addedToCart.includes(product.id)}
              />

              {/* Remove from Wishlist Button */}
              <button
                onClick={() => handleRemoveWishlist(product.id)}
                className="absolute top-2 right-2 z-10 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                title="ลบออกจากรายการโปรด"
              >
                <Heart className="w-5 h-5 fill-white" />
              </button>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="card mt-12 p-6 bg-orange-50 border-orange-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="font-bold text-gray-900 mb-1">
                ต้องการสินค้าทั้งหมด?
              </h3>
              <p className="text-sm text-gray-600">
                เพิ่มสินค้าทั้งหมดในรายการโปรดไปยังตะกร้า
              </p>
            </div>
            <button
              className="btn btn-primary whitespace-nowrap"
              onClick={() => {
                wishlistProducts.forEach(product => {
                  addToCart(product);
                });
                setAddedToCart(wishlistProducts.map(p => p.id));
                toast.success(`เพิ่มสินค้า ${wishlistProducts.length} รายการลงตะกร้า`, {
                  duration: 2000,
                });
                setTimeout(() => {
                  setAddedToCart([]);
                }, 2000);
              }}
            >
              เพิ่มทั้งหมด
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
