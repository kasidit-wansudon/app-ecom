import { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProductCard from '@/components/product/ProductCard';
import { mockProducts } from '@/data/mockData';
import { useApp } from '@/context/AppContext';
import { Search, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import type { Product } from '@/types';
import EmptyState from '@/components/ui/EmptyState';
import SectionTitle from '@/components/ui/SectionTitle';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart, wishlist, toggleWishlist } = useApp();
  const [addedToCart, setAddedToCart] = useState<number[]>([]);

  const query = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(query);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return mockProducts.filter(p =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery)
    );
  }, [query]);

  const suggestions = ['หูฟังไร้สาย', 'สมาร์ทวอทช์', 'ลำโพง', 'กล้อง', 'แท่นชาร์จ'];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) setSearchParams({ q: searchInput });
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setAddedToCart(prev => [...prev, product.id]);
    toast.success('เพิ่มสินค้าลงตะกร้าเรียบร้อย!', { description: product.name, duration: 2000 });
    setTimeout(() => setAddedToCart(prev => prev.filter(id => id !== product.id)), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Banner */}
      <div className="relative bg-gradient-to-br from-orange-500 to-orange-600 py-16 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-orange-400/30 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            ค้นหาสินค้า
          </h1>
          <p className="text-orange-100 mb-8">ค้นพบสินค้าจากหลากหลายหมวดหมู่</p>

          {/* Search Box */}
          <form onSubmit={handleSearch}>
            <div className="relative bg-white rounded-2xl shadow-2xl shadow-orange-900/20 overflow-hidden flex">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="พิมพ์ชื่อสินค้า หรือหมวดหมู่..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                className="flex-1 pl-14 pr-4 py-4 text-gray-900 text-base focus:outline-none bg-transparent placeholder-gray-400"
              />
              <button
                type="submit"
                className="m-2 btn btn-primary px-6 py-2.5 rounded-xl font-semibold"
              >
                ค้นหา
              </button>
            </div>
          </form>

          {/* Suggestion chips */}
          <div className="flex flex-wrap gap-2 justify-center mt-5">
            {suggestions.map(s => (
              <button
                key={s}
                onClick={() => { setSearchInput(s); setSearchParams({ q: s }); }}
                className="px-4 py-1.5 bg-white/20 text-white text-sm rounded-full hover:bg-white/30 transition-colors border border-white/30"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {query.trim() === '' ? (
          // Default state — show popular products
          <div className="space-y-10">
            <SectionTitle
              label="แนะนำ"
              title="สินค้า"
              highlight="ยอดนิยม"
              subtitle="สินค้าขายดีที่ลูกค้าให้ความไว้ใจ"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {mockProducts.slice(0, 8).map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  isWishlisted={wishlist.includes(product.id)}
                  onToggleWishlist={toggleWishlist}
                  isAdded={addedToCart.includes(product.id)}
                />
              ))}
            </div>
          </div>
        ) : searchResults.length > 0 ? (
          // Has results
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-5 h-5 text-orange-500" />
              <p className="text-gray-700">
                พบ <strong className="text-gray-900">{searchResults.length} รายการ</strong> สำหรับ{' '}
                <strong className="text-orange-600">"{query}"</strong>
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {searchResults.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  isWishlisted={wishlist.includes(product.id)}
                  onToggleWishlist={toggleWishlist}
                  isAdded={addedToCart.includes(product.id)}
                />
              ))}
            </div>
          </div>
        ) : (
          // No results
          <EmptyState
            icon={Search}
            title={`ไม่พบ "${query}"`}
            description="ลองค้นหาด้วยคำอื่น หรือเลือกจากหมวดหมู่สินค้าด้านล่าง"
            actionLabel="ดูสินค้าทั้งหมด"
            onAction={() => navigate('/products')}
            secondaryLabel="กลับหน้าแรก"
            onSecondary={() => navigate('/')}
          />
        )}

        {/* Trending section at bottom when searching */}
        {query.trim() !== '' && searchResults.length > 0 && (
          <div className="mt-16">
            <SectionTitle
              label="อาจถูกใจคุณ"
              title="สินค้า"
              highlight="แนะนำ"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {mockProducts.filter(p => !searchResults.find(r => r.id === p.id)).slice(0, 4).map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  isWishlisted={wishlist.includes(product.id)}
                  onToggleWishlist={toggleWishlist}
                  isAdded={addedToCart.includes(product.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
