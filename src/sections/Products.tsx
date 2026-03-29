import { useEffect, useRef, useState } from 'react';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Product } from '@/types';

gsap.registerPlugin(ScrollTrigger);

interface ProductsProps {
  onAddToCart: () => void;
}

const products: Product[] = [
  {
    id: 1,
    name: 'หูฟังไร้สาย Pro Max',
    price: 3990,
    originalPrice: 5490,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    category: 'หูฟัง',
    rating: 4.9,
    reviews: 328,
    badge: 'ลด 27%',
    isBestseller: true,
  },
  {
    id: 2,
    name: 'สมาร์ทวอทช์ Series 8',
    price: 12900,
    originalPrice: 14900,
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=400&fit=crop',
    category: 'นาฬิกา',
    rating: 4.8,
    reviews: 256,
    badge: 'ลด 13%',
    isNew: true,
  },
  {
    id: 3,
    name: 'ลำโพงบลูทูธ 360°',
    price: 2590,
    originalPrice: 3590,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop',
    category: 'ลำโพง',
    rating: 4.7,
    reviews: 189,
    badge: 'ลด 28%',
  },
  {
    id: 4,
    name: 'แท่นชาร์จไร้สาย 3in1',
    price: 1290,
    originalPrice: 1990,
    image: 'https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?w=400&h=400&fit=crop',
    category: 'อุปกรณ์เสริม',
    rating: 4.6,
    reviews: 145,
    badge: 'ลด 35%',
    isNew: true,
  },
  {
    id: 5,
    name: 'กล้องโพลารอยด์ Instant',
    price: 4590,
    originalPrice: 5990,
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop',
    category: 'กล้อง',
    rating: 4.8,
    reviews: 98,
    badge: 'ลด 23%',
    isBestseller: true,
  },
  {
    id: 6,
    name: 'แก้วเก็บความเย็น 24 ชม.',
    price: 890,
    originalPrice: 1290,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop',
    category: 'ของใช้',
    rating: 4.5,
    reviews: 412,
    badge: 'ลด 31%',
  },
  {
    id: 7,
    name: 'เคสมือถือกันกระแทก',
    price: 590,
    originalPrice: 990,
    image: 'https://images.unsplash.com/photo-1603313011101-320f26a4f6f6?w=400&h=400&fit=crop',
    category: 'อุปกรณ์เสริม',
    rating: 4.4,
    reviews: 267,
    badge: 'ลด 40%',
  },
  {
    id: 8,
    name: 'หมอนรองคอ Memory Foam',
    price: 1590,
    originalPrice: 2290,
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?w=400&h=400&fit=crop',
    category: 'ของใช้',
    rating: 4.7,
    reviews: 178,
    badge: 'ลด 31%',
    isNew: true,
  },
];

export default function Products({ onAddToCart }: ProductsProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [addedToCart, setAddedToCart] = useState<number[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        '.products-title',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.products-title',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Product cards animation
      gsap.fromTo(
        '.product-card',
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: {
            amount: 0.8,
            from: 'start',
          },
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.products-grid',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const toggleWishlist = (productId: number) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleAddToCart = (productId: number) => {
    setAddedToCart((prev) => [...prev, productId]);
    onAddToCart();
    
    setTimeout(() => {
      setAddedToCart((prev) => prev.filter((id) => id !== productId));
    }, 2000);
  };

  return (
    <section
      id="products"
      ref={sectionRef}
      className="py-20 lg:py-32 bg-gradient-to-b from-white to-orange-50/50 relative overflow-hidden"
    >
      {/* Background Decoration */}
      <div className="absolute top-1/4 left-0 w-72 h-72 bg-orange-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-orange-300/15 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12">
          <div className="products-title">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              สินค้า<span className="text-gradient-orange">ขายดี</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-xl">
              สินค้าคุณภาพดีที่ลูกค้าชื่นชอบ พร้อมราคาพิเศษสุดคุ้ม
            </p>
          </div>
          <button className="mt-6 sm:mt-0 inline-flex items-center gap-2 text-orange-500 font-semibold hover:text-orange-600 transition-colors group">
            ดูสินค้าทั้งหมด
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>

        {/* Products Grid */}
        <div className="products-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const isWishlisted = wishlist.includes(product.id);
            const isAdded = addedToCart.includes(product.id);

            return (
              <div
                key={product.id}
                className="product-card group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500"
              >
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
                      <Badge className="bg-red-500 text-white sale-pulse">
                        {product.badge}
                      </Badge>
                    )}
                    {product.isNew && (
                      <Badge className="bg-orange-500 text-white">
                        ใหม่
                      </Badge>
                    )}
                    {product.isBestseller && (
                      <Badge className="bg-purple-500 text-white">
                        ขายดี
                      </Badge>
                    )}
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={() => toggleWishlist(product.id)}
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
                      <Button
                        size="sm"
                        variant="secondary"
                        className="flex-1 bg-white/90 hover:bg-white text-gray-900"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        ดู
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                        onClick={() => handleAddToCart(product.id)}
                      >
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        {isAdded ? 'เพิ่มแล้ว' : 'เพิ่ม'}
                      </Button>
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
          })}
        </div>
      </div>
    </section>
  );
}
