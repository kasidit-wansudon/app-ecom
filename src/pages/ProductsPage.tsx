import { useState, useMemo } from 'react';
import ProductCard from '@/components/product/ProductCard';
import { mockProducts } from '@/data/mockData';
import { useApp } from '@/context/AppContext';
import { Grid3X3, List, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import type { Product } from '@/types';

export default function ProductsPage() {
  const { addToCart, wishlist, toggleWishlist } = useApp();
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRating, setSelectedRating] = useState<string>('all');
  const [selectedBadges, setSelectedBadges] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [addedToCart, setAddedToCart] = useState<number[]>([]);

  // Accordion state
  const [openAccordion, setOpenAccordion] = useState<string | null>('category');

  const categories = Array.from(new Set(mockProducts.map(p => p.category)));

  const filteredProducts = useMemo(() => {
    let result = [...mockProducts];

    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }

    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    if (selectedRating !== 'all') {
      const minRating = parseFloat(selectedRating);
      result = result.filter(p => p.rating >= minRating);
    }

    if (selectedBadges.length > 0) {
      result = result.filter(p => {
        if (selectedBadges.includes('new') && p.isNew) return true;
        if (selectedBadges.includes('bestseller') && p.isBestseller) return true;
        if (selectedBadges.includes('sale') && p.badge) return true;
        return false;
      });
    }

    if (sortBy === 'price-low-high') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high-low') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'popular') {
      result.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
    } else if (sortBy === 'newest') {
      result = result.filter(p => p.isNew).concat(result.filter(p => !p.isNew));
    }

    return result;
  }, [selectedCategory, priceRange, selectedRating, selectedBadges, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleResetFilters = () => {
    setPriceRange([0, 50000]);
    setSelectedCategory('all');
    setSelectedRating('all');
    setSelectedBadges([]);
    setSortBy('popular');
    setCurrentPage(1);
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

  const toggleBadge = (badge: string) => {
    setSelectedBadges(prev => {
      if (prev.includes(badge)) {
        return prev.filter(b => b !== badge);
      } else {
        return [...prev, badge];
      }
    });
  };

  const toggleAccordion = (key: string) => {
    setOpenAccordion(prev => (prev === key ? null : key));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">สินค้าทั้งหมด</h1>
          <p className="text-gray-600">พบสินค้า {filteredProducts.length} รายการ</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="card p-6 sticky top-20">
              {/* Category Accordion */}
              <div className="border-b pb-2 mb-2">
                <button
                  className="flex items-center justify-between w-full py-2 font-medium text-gray-900"
                  onClick={() => toggleAccordion('category')}
                >
                  <span>หมวดหมู่</span>
                  {openAccordion === 'category' ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {openAccordion === 'category' && (
                  <div className="space-y-3 mt-2 pb-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="category-all"
                        name="category"
                        checked={selectedCategory === 'all'}
                        onChange={() => setSelectedCategory('all')}
                        className="form-radio"
                      />
                      <label htmlFor="category-all" className="ml-2 text-sm cursor-pointer">
                        ทั้งหมด
                      </label>
                    </div>
                    {categories.map(cat => (
                      <div key={cat} className="flex items-center">
                        <input
                          type="radio"
                          id={`category-${cat}`}
                          name="category"
                          checked={selectedCategory === cat}
                          onChange={() => setSelectedCategory(cat)}
                          className="form-radio"
                        />
                        <label htmlFor={`category-${cat}`} className="ml-2 text-sm cursor-pointer">
                          {cat}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Accordion */}
              <div className="border-b pb-2 mb-2">
                <button
                  className="flex items-center justify-between w-full py-2 font-medium text-gray-900"
                  onClick={() => toggleAccordion('price')}
                >
                  <span>ราคา</span>
                  {openAccordion === 'price' ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {openAccordion === 'price' && (
                  <div className="space-y-4 mt-2 pb-2">
                    <input
                      type="range"
                      min={0}
                      max={50000}
                      step={100}
                      value={priceRange[1]}
                      onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-full accent-orange-500"
                    />
                    <div className="flex gap-2 text-sm">
                      <span>฿{priceRange[0].toLocaleString()}</span>
                      <span>-</span>
                      <span>฿{priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Rating Accordion */}
              <div className="border-b pb-2 mb-2">
                <button
                  className="flex items-center justify-between w-full py-2 font-medium text-gray-900"
                  onClick={() => toggleAccordion('rating')}
                >
                  <span>ระดับคะแนน</span>
                  {openAccordion === 'rating' ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {openAccordion === 'rating' && (
                  <div className="space-y-3 mt-2 pb-2">
                    {[
                      { value: 'all', label: 'ทั้งหมด' },
                      { value: '4.5', label: '4.5+ ดาว' },
                      { value: '4', label: '4+ ดาว' },
                      { value: '3.5', label: '3.5+ ดาว' },
                    ].map(opt => (
                      <div key={opt.value} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id={`rating-${opt.value}`}
                          name="rating"
                          value={opt.value}
                          checked={selectedRating === opt.value}
                          onChange={() => setSelectedRating(opt.value)}
                          className="form-radio"
                        />
                        <label htmlFor={`rating-${opt.value}`} className="form-label cursor-pointer">
                          {opt.label}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Badges Accordion */}
              <div className="pb-2 mb-2">
                <button
                  className="flex items-center justify-between w-full py-2 font-medium text-gray-900"
                  onClick={() => toggleAccordion('badges')}
                >
                  <span>ป้ายกำกับ</span>
                  {openAccordion === 'badges' ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {openAccordion === 'badges' && (
                  <div className="space-y-2 mt-2 pb-2">
                    {[
                      { id: 'badge-new', key: 'new', label: 'ใหม่' },
                      { id: 'badge-bestseller', key: 'bestseller', label: 'ขายดี' },
                      { id: 'badge-sale', key: 'sale', label: 'ลดราคา' },
                    ].map(badge => (
                      <div key={badge.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={badge.id}
                          checked={selectedBadges.includes(badge.key)}
                          onChange={() => toggleBadge(badge.key)}
                          className="form-checkbox"
                        />
                        <label htmlFor={badge.id} className="form-label cursor-pointer">
                          {badge.label}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Reset Button */}
              <button
                className="btn btn-outline w-full mt-6"
                onClick={handleResetFilters}
              >
                รีเซ็ตตัวกรอง
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
              <div className="text-sm text-gray-600">
                {filteredProducts.length === 0
                  ? 'ไม่มีสินค้า'
                  : `แสดงผล ${(currentPage - 1) * itemsPerPage + 1}-${Math.min(
                      currentPage * itemsPerPage,
                      filteredProducts.length
                    )} จากทั้งหมด ${filteredProducts.length}`}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                {/* Sort Select */}
                <select
                  className="form-select w-full sm:w-48"
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                >
                  <option value="popular">ยอดนิยม</option>
                  <option value="price-low-high">ราคา ต่ำ-สูง</option>
                  <option value="price-high-low">ราคา สูง-ต่ำ</option>
                  <option value="newest">ใหม่</option>
                </select>

                {/* View Toggle */}
                <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                    title="Grid View"
                  >
                    <Grid3X3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                    title="List View"
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="card p-12 text-center">
                <p className="text-gray-600 mb-4">ไม่พบสินค้าที่ตรงกับเงื่อนไขการค้นหา</p>
                <button className="btn btn-outline" onClick={handleResetFilters}>
                  รีเซ็ตตัวกรอง
                </button>
              </div>
            ) : (
              <>
                <div
                  className={`${
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                      : 'space-y-4'
                  }`}
                >
                  {paginatedProducts.map(product => (
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

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <nav className="pagination">
                      {currentPage > 1 && (
                        <button
                          className="pagination-button"
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        >
                          ก่อนหน้า
                        </button>
                      )}

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          className={`pagination-button ${page === currentPage ? 'active' : ''}`}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </button>
                      ))}

                      {currentPage < totalPages && (
                        <button
                          className="pagination-button"
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        >
                          ถัดไป
                        </button>
                      )}
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
