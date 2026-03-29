import { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProductCard from '@/components/product/ProductCard';
import { mockProducts } from '@/data/mockData';
import { useApp } from '@/context/AppContext';
import { Search, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import type { Product } from '@/types';

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
    return mockProducts.filter(product => {
      const nameMatch = product.name.toLowerCase().includes(lowerQuery);
      const categoryMatch = product.category.toLowerCase().includes(lowerQuery);
      return nameMatch || categoryMatch;
    });
  }, [query]);

  const suggestions = [
    'หูฟังไร้สาย',
    'สมาร์ทวอทช์',
    'ลำโพง',
    'กล้อง',
    'แท่นชาร์จ',
  ].filter(s => !query.toLowerCase().includes(s.toLowerCase()));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput });
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchInput(suggestion);
    setSearchParams({ q: suggestion });
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            ค้นหาสินค้า
          </h1>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="พิมพ์ชื่อสินค้าหรือหมวดหมู่..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                className="form-input pl-12 pr-32 py-3 text-lg"
              />
              <button
                type="submit"
                className="btn btn-primary absolute right-1 top-1/2 transform -translate-y-1/2"
              >
                ค้นหา
              </button>
            </div>
          </form>
        </div>

        {/* Results or Empty State */}
        {query.trim() === '' ? (
          // Empty state
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                ขอแนะนำสินค้า
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {suggestions.map(suggestion => (
                  <button
                    key={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="p-4 bg-white border border-gray-200 rounded-lg hover:border-orange-500 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">
                        {suggestion}
                      </span>
                      <ArrowRight className="w-4 h-4 text-orange-500" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Products */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                สินค้าขายดี
              </h2>
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
          </div>
        ) : searchResults.length > 0 ? (
          // Search results
          <div>
            <div className="mb-6">
              <p className="text-gray-600">
                พบสินค้า{' '}
                <span className="font-bold text-gray-900">{searchResults.length}</span>{' '}
                รายการสำหรับ "{query}"
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
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              ไม่พบสินค้า
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              ขออภัยค่ะ ไม่พบสินค้าที่ตรงกับคำค้นหา "{query}"
              ลองค้นหาอีกครั้งด้วยคำอื่นๆ
            </p>

            {/* Alternative Suggestions */}
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-3">
                  คุณอาจสนใจสินค้าเหล่านี้:
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {suggestions.map(suggestion => (
                    <button
                      key={suggestion}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="px-4 py-2 bg-orange-50 text-orange-600 rounded-full hover:bg-orange-100 transition-colors text-sm font-medium"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              <button
                className="btn btn-outline"
                onClick={() => navigate('/products')}
              >
                ดูสินค้าทั้งหมด
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
