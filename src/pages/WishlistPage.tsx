import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '@/components/product/ProductCard';
import { mockProducts } from '@/data/mockData';
import { useApp } from '@/context/AppContext';
import { Heart, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import type { Product } from '@/types';
import PageBanner from '@/components/ui/PageBanner';
import EmptyState from '@/components/ui/EmptyState';

export default function WishlistPage() {
  const navigate = useNavigate();
  const { addToCart, wishlist, toggleWishlist } = useApp();
  const [addedToCart, setAddedToCart] = useState<number[]>([]);

  const wishlistProducts = mockProducts.filter(p => wishlist.includes(p.id));

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setAddedToCart(prev => [...prev, product.id]);
    toast.success('เพิ่มสินค้าลงตะกร้าเรียบร้อย!', { description: product.name, duration: 2000 });
    setTimeout(() => {
      setAddedToCart(prev => prev.filter(id => id !== product.id));
    }, 2000);
  };

  const handleRemoveWishlist = (productId: number) => {
    toggleWishlist(productId);
    toast.success('ลบออกจากรายการโปรดเรียบร้อย');
  };

  const handleAddAllToCart = () => {
    wishlistProducts.forEach(product => addToCart(product));
    setAddedToCart(wishlistProducts.map(p => p.id));
    toast.success(`เพิ่มสินค้า ${wishlistProducts.length} รายการลงตะกร้า`, { duration: 2000 });
    setTimeout(() => setAddedToCart([]), 2000);
  };

  if (wishlistProducts.length === 0) {
    return (
      <>
        <PageBanner
          title="รายการโปรด"
          subtitle="สินค้าที่คุณถูกใจ บันทึกไว้ที่นี่"
          size="sm"
        />
        <EmptyState
          icon={Heart}
          title="รายการโปรดว่างเปล่า"
          description="คุณยังไม่ได้บันทึกสินค้าไว้ในรายการโปรด กดไอคอนหัวใจบนสินค้าที่ชอบ"
          actionLabel="เลือกสินค้า"
          onAction={() => navigate('/products')}
        />
      </>
    );
  }

  return (
    <>
      <PageBanner
        title="รายการโปรด"
        titleHighlight={`(${wishlistProducts.length} ชิ้น)`}
        subtitle="สินค้าที่คุณบันทึกไว้ — พร้อมเพิ่มลงตะกร้าได้ทันที"
        size="sm"
      >
        <button
          className="btn btn-primary px-8 py-3 shadow-lg shadow-orange-500/20"
          onClick={handleAddAllToCart}
        >
          <ShoppingBag className="w-4 h-4" />
          เพิ่มทั้งหมดลงตะกร้า
        </button>
      </PageBanner>

      <div className="bg-gray-50 min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistProducts.map(product => (
              <div key={product.id} className="relative group">
                <ProductCard
                  product={product}
                  onAddToCart={handleAddToCart}
                  isWishlisted={true}
                  onToggleWishlist={handleRemoveWishlist}
                  isAdded={addedToCart.includes(product.id)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
