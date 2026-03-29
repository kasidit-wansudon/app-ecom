import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockProducts } from '@/data/mockData';
import { useApp } from '@/context/AppContext';
import { Heart, ShoppingCart, Star, Truck, Shield, RotateCcw, Minus, Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, wishlist, toggleWishlist } = useApp();

  const product = mockProducts.find(p => p.id === parseInt(id || '0'));
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(wishlist.includes(product?.id || 0));
  const [activeTab, setActiveTab] = useState('details');

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <p className="text-gray-600 mb-4">ไม่พบสินค้า</p>
        <button className="btn btn-primary" onClick={() => navigate('/products')}>
          กลับไปหน้าสินค้า
        </button>
      </div>
    );
  }

  const relatedProducts = mockProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const images = [product.image, product.image, product.image, product.image];
  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toast.success('เพิ่มสินค้าลงตะกร้าเรียบร้อย!', {
      description: `${quantity} ${product.name}`,
      duration: 2000,
    });
    setQuantity(1);
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product.id);
    setIsWishlisted(!isWishlisted);
    toast.success(
      isWishlisted ? 'ลบออกจากรายการโปรด' : 'เพิ่มลงในรายการโปรด',
      { duration: 1500 }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-gray-600">
          <button onClick={() => navigate('/')} className="hover:text-orange-500 transition-colors cursor-pointer">
            หน้าแรก
          </button>
          <span>/</span>
          <button onClick={() => navigate('/products')} className="hover:text-orange-500 transition-colors cursor-pointer">
            สินค้า
          </button>
          <span>/</span>
          <span className="text-gray-500">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery - Left */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-white rounded-2xl overflow-hidden aspect-square">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-3">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? 'border-orange-500 shadow-lg'
                      : 'border-gray-200 hover:border-orange-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-24 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info - Right */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {product.badge && (
                <span className="badge badge-danger">{product.badge}</span>
              )}
              {product.isNew && (
                <span className="badge badge-warning">ใหม่</span>
              )}
              {product.isBestseller && (
                <span className="badge badge-primary">ขายดี</span>
              )}
            </div>

            {/* Name */}
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              {product.name}
            </h1>

            {/* Category */}
            <p className="text-sm text-gray-500 uppercase tracking-wide">
              หมวดหมู่: {product.category}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg font-semibold text-gray-900">
                {product.rating}
              </span>
              <span className="text-gray-600">
                ({product.reviews} รีวิว)
              </span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-orange-500">
                  ฿{product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-gray-400 line-through">
                      ฿{product.originalPrice.toLocaleString()}
                    </span>
                    <span className="text-lg font-semibold text-red-500">
                      ประหยัด {discountPercentage}%
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-lg leading-relaxed">
              สินค้าคุณภาพสูง ตรงตามมาตรฐานสากล พร้อมการรับประกันและบริการหลังการขายที่ยอดเยี่ยม
            </p>

            {/* Quantity & Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">จำนวน:</span>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-bold text-gray-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  className="btn btn-primary btn-lg flex-1 flex items-center justify-center gap-2"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-5 h-5" />
                  เพิ่มลงตะกร้า
                </button>
                <button
                  className={`btn btn-outline btn-lg ${isWishlisted ? 'bg-red-50 border-red-200' : ''}`}
                  onClick={handleToggleWishlist}
                >
                  <Heart
                    className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`}
                  />
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="text-center">
                <Truck className="w-6 h-6 mx-auto text-orange-500 mb-2" />
                <p className="text-xs text-gray-600">จัดส่งฟรี</p>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 mx-auto text-orange-500 mb-2" />
                <p className="text-xs text-gray-600">ปลอดภัยแน่นอน</p>
              </div>
              <div className="text-center">
                <RotateCcw className="w-6 h-6 mx-auto text-orange-500 mb-2" />
                <p className="text-xs text-gray-600">คืนได้ 30 วัน</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="card mb-12">
          <div className="tabs border-b">
            {[
              { key: 'details', label: 'รายละเอียด' },
              { key: 'specs', label: 'สเปค' },
              { key: 'reviews', label: 'รีวิว' },
            ].map(tab => (
              <button
                key={tab.key}
                className={`tab-button ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'details' && (
              <div className="space-y-4">
                <p className="text-gray-700">
                  สินค้านี้เป็นผลิตภัณฑ์ที่ได้รับการคัดสรรมาอย่างดี มีคุณภาพเยี่ยม และมีการรับประกันจากผู้ผลิต
                  ทุกส่วนของสินค้าได้รับการทดสอบแล้ว เพื่อให้มั่นใจว่าสินค้าจะสามารถใช้งานได้อย่างถูกต้องและปลอดภัย
                </p>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <p className="font-medium text-gray-700">หมวดหมู่</p>
                  <p className="text-gray-600">{product.category}</p>
                  <p className="font-medium text-gray-700">ราคา</p>
                  <p className="text-gray-600">฿{product.price.toLocaleString()}</p>
                  <p className="font-medium text-gray-700">คะแนน</p>
                  <p className="text-gray-600">{product.rating} / 5</p>
                  <p className="font-medium text-gray-700">จำนวนรีวิว</p>
                  <p className="text-gray-600">{product.reviews}</p>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <p className="text-gray-600">
                มีผู้รีวิว {product.reviews} คน โดยมีคะแนนเฉลี่ย {product.rating} / 5
              </p>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">สินค้าที่เกี่ยวข้อง</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(relatedProduct => (
                <div
                  key={relatedProduct.id}
                  className="card overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/products/${relatedProduct.id}`)}
                >
                  <div className="aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 line-clamp-2 mb-2">
                      {relatedProduct.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-3">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-medium text-gray-700">
                        {relatedProduct.rating}
                      </span>
                    </div>
                    <span className="text-lg font-bold text-orange-500">
                      ฿{relatedProduct.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
