import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '@/components/product/ProductCard';
import { mockProducts } from '@/data/mockData';
import { useApp } from '@/context/AppContext';
import { Grid3X3, List, Star, ShoppingCart, Heart, X, Truck, Shield, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import type { Product } from '@/types';
import PageBanner from '@/components/ui/PageBanner';
import FilterAccordion from '@/components/ui/FilterAccordion';
import StyledSelect from '@/components/ui/StyledSelect';

export default function ProductsPage() {
  const navigate = useNavigate();
  const { addToCart, wishlist, toggleWishlist } = useApp();
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRating, setSelectedRating] = useState<string>('all');
  const [selectedBadges, setSelectedBadges] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [addedToCart, setAddedToCart] = useState<number[]>([]);

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

  return (
    <>
      <PageBanner
        title="สินค้า"
        titleHighlight="ทั้งหมด"
        subtitle={`พบสินค้า ${filteredProducts.length} รายการ — เลือกกรองตามที่ต้องการ`}
        size="sm"
      />
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-24">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">ตัวกรอง</p>

              <FilterAccordion title="หมวดหมู่" defaultOpen>
                {[{ value: 'all', label: 'ทั้งหมด' }, ...categories.map(c => ({ value: c, label: c }))].map(opt => (
                  <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === opt.value}
                      onChange={() => setSelectedCategory(opt.value)}
                      className="form-radio accent-orange-500"
                    />
                    <span className={`text-sm transition-colors ${selectedCategory === opt.value ? 'text-orange-600 font-semibold' : 'text-gray-600 group-hover:text-gray-900'}`}>
                      {opt.label}
                    </span>
                  </label>
                ))}
              </FilterAccordion>

              <FilterAccordion title="ราคา" defaultOpen>
                <div className="space-y-3">
                  <input
                    type="range"
                    min={0}
                    max={50000}
                    step={500}
                    value={priceRange[1]}
                    onChange={e => setPriceRange([0, Number(e.target.value)])}
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-orange-500"
                    style={{
                      background: `linear-gradient(to right, #f97316 0%, #f97316 ${(priceRange[1] / 50000) * 100}%, #e5e7eb ${(priceRange[1] / 50000) * 100}%, #e5e7eb 100%)`
                    }}
                  />
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-gray-500">฿0</span>
                    <span className="text-orange-600">฿{priceRange[1].toLocaleString('th-TH')}</span>
                  </div>
                </div>
              </FilterAccordion>

              <FilterAccordion title="ระดับคะแนน">
                {[
                  { value: 'all', label: 'ทั้งหมด' },
                  { value: '4.5', label: '⭐ 4.5+ ดาว' },
                  { value: '4', label: '⭐ 4+ ดาว' },
                  { value: '3.5', label: '⭐ 3.5+ ดาว' },
                ].map(opt => (
                  <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="radio"
                      name="rating"
                      checked={selectedRating === opt.value}
                      onChange={() => setSelectedRating(opt.value)}
                      className="form-radio accent-orange-500"
                    />
                    <span className={`text-sm transition-colors ${selectedRating === opt.value ? 'text-orange-600 font-semibold' : 'text-gray-600 group-hover:text-gray-900'}`}>
                      {opt.label}
                    </span>
                  </label>
                ))}
              </FilterAccordion>

              <FilterAccordion title="ป้ายกำกับ">
                {[
                  { key: 'new', label: '🆕 ใหม่' },
                  { key: 'bestseller', label: '🔥 ขายดี' },
                  { key: 'sale', label: '🏷️ ลดราคา' },
                ].map(badge => (
                  <label key={badge.key} className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedBadges.includes(badge.key)}
                      onChange={() => toggleBadge(badge.key)}
                      className="form-checkbox accent-orange-500 rounded"
                    />
                    <span className={`text-sm transition-colors ${selectedBadges.includes(badge.key) ? 'text-orange-600 font-semibold' : 'text-gray-600 group-hover:text-gray-900'}`}>
                      {badge.label}
                    </span>
                  </label>
                ))}
              </FilterAccordion>

              <button
                className="btn btn-outline w-full mt-4 text-xs"
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
                <StyledSelect
                  className="w-full sm:w-48"
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                >
                  <option value="popular">ยอดนิยม</option>
                  <option value="price-low-high">ราคา ต่ำ-สูง</option>
                  <option value="price-high-low">ราคา สูง-ต่ำ</option>
                  <option value="newest">ใหม่</option>
                </StyledSelect>

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

            {/* Products */}
            {filteredProducts.length === 0 ? (
              <div className="card p-12 text-center">
                <p className="text-gray-600 mb-4">ไม่พบสินค้าที่ตรงกับเงื่อนไขการค้นหา</p>
                <button className="btn btn-outline" onClick={handleResetFilters}>รีเซ็ตตัวกรอง</button>
              </div>
            ) : (
              <>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                ) : (
                  /* List View — split panel on desktop */
                  <div className="flex gap-6">
                    {/* List */}
                    <div className={`space-y-3 transition-all duration-300 ${selectedProduct ? 'hidden lg:block lg:w-1/2' : 'w-full'}`}>
                      {paginatedProducts.map(product => {
                        const isSelected = selectedProduct?.id === product.id;
                        const discount = product.originalPrice
                          ? Math.round((1 - product.price / product.originalPrice) * 100)
                          : null;
                        return (
                          <div
                            key={product.id}
                            onClick={() => setSelectedProduct(isSelected ? null : product)}
                            className={`bg-white rounded-2xl border transition-all duration-200 cursor-pointer flex gap-4 p-4 hover:shadow-md ${
                              isSelected ? 'border-orange-400 shadow-md shadow-orange-500/10' : 'border-gray-100 hover:border-orange-200'
                            }`}
                          >
                            {/* Image */}
                            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                            </div>
                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-orange-500 font-semibold uppercase tracking-wide mb-0.5">{product.category}</p>
                              <h3 className="font-bold text-gray-900 text-sm sm:text-base line-clamp-2 mb-1">{product.name}</h3>
                              <div className="flex items-center gap-1 mb-2">
                                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs text-gray-600">{product.rating} ({product.reviews?.toLocaleString()} รีวิว)</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-orange-500">฿{product.price.toLocaleString('th-TH')}</span>
                                {product.originalPrice && (
                                  <span className="text-xs text-gray-400 line-through">฿{product.originalPrice.toLocaleString('th-TH')}</span>
                                )}
                                {discount && <span className="badge bg-red-100 text-red-600 text-xs">ลด {discount}%</span>}
                              </div>
                            </div>
                            {/* Actions */}
                            <div className="flex flex-col gap-2 flex-shrink-0 justify-center">
                              <button
                                onClick={e => { e.stopPropagation(); handleAddToCart(product); }}
                                className="btn btn-primary btn-sm px-3"
                              >
                                <ShoppingCart className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={e => { e.stopPropagation(); toggleWishlist(product.id); }}
                                className="btn btn-outline btn-sm px-3"
                              >
                                <Heart className={`w-3.5 h-3.5 ${wishlist.includes(product.id) ? 'fill-orange-500 text-orange-500' : ''}`} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Detail Panel — desktop only */}
                    {selectedProduct && (
                      <div className="hidden lg:block lg:w-1/2">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-md sticky top-24 overflow-hidden">
                          {/* Close */}
                          <button
                            onClick={() => setSelectedProduct(null)}
                            className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-sm"
                          >
                            <X className="w-4 h-4 text-gray-600" />
                          </button>

                          {/* Image */}
                          <div className="relative h-64 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                            <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
                            {selectedProduct.badge && (
                              <span className="absolute top-3 left-3 badge bg-red-500 text-white">{selectedProduct.badge}</span>
                            )}
                            {selectedProduct.isNew && (
                              <span className="absolute top-3 left-3 badge bg-orange-500 text-white">ใหม่</span>
                            )}
                          </div>

                          {/* Content */}
                          <div className="p-5">
                            <p className="text-xs text-orange-500 font-bold uppercase tracking-widest mb-1">{selectedProduct.category}</p>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">{selectedProduct.name}</h2>

                            <div className="flex items-center gap-2 mb-4">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(selectedProduct.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                                ))}
                              </div>
                              <span className="text-sm text-gray-600">{selectedProduct.rating} ({selectedProduct.reviews?.toLocaleString()} รีวิว)</span>
                            </div>

                            <div className="flex items-end gap-3 mb-5">
                              <span className="text-3xl font-bold text-orange-500">฿{selectedProduct.price.toLocaleString('th-TH')}</span>
                              {selectedProduct.originalPrice && (
                                <>
                                  <span className="text-gray-400 line-through text-sm mb-1">฿{selectedProduct.originalPrice.toLocaleString('th-TH')}</span>
                                  <span className="badge bg-red-100 text-red-600 mb-1">
                                    ลด {Math.round((1 - selectedProduct.price / selectedProduct.originalPrice) * 100)}%
                                  </span>
                                </>
                              )}
                            </div>

                            {/* Trust badges */}
                            <div className="grid grid-cols-3 gap-2 mb-5">
                              {[
                                { icon: Truck, text: 'จัดส่งเร็ว' },
                                { icon: Shield, text: 'รับประกัน' },
                                { icon: RotateCcw, text: 'คืนสินค้าได้' },
                              ].map(({ icon: Icon, text }) => (
                                <div key={text} className="flex flex-col items-center gap-1 p-2 bg-orange-50 rounded-xl">
                                  <Icon className="w-4 h-4 text-orange-500" />
                                  <span className="text-xs text-gray-600 text-center">{text}</span>
                                </div>
                              ))}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                              <button
                                className="btn btn-primary flex-1"
                                onClick={() => handleAddToCart(selectedProduct)}
                              >
                                <ShoppingCart className="w-4 h-4" />
                                เพิ่มลงตะกร้า
                              </button>
                              <button
                                className="btn btn-outline px-3"
                                onClick={() => navigate(`/products/${selectedProduct.id}`)}
                              >
                                ดูเพิ่มเติม
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

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
    </>
  );
}
