import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useApp } from '@/context/AppContext';
import { mockProducts } from '@/data/mockData';
import ProductCard from '@/components/product/ProductCard';

gsap.registerPlugin(ScrollTrigger);

export default function Products() {
  const navigate = useNavigate();
  const { addToCart, wishlist, toggleWishlist } = useApp();
  const sectionRef = useRef<HTMLDivElement>(null);
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

  const handleAddToCart = (productId: number) => {
    const product = mockProducts.find((p) => p.id === productId);
    if (product) {
      addToCart(product);
      setAddedToCart((prev) => [...prev, productId]);

      setTimeout(() => {
        setAddedToCart((prev) => prev.filter((id) => id !== productId));
      }, 2000);
    }
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
          <button
            onClick={() => navigate('/products')}
            className="mt-6 sm:mt-0 inline-flex items-center gap-2 text-orange-500 font-semibold hover:text-orange-600 transition-colors group"
          >
            ดูสินค้าทั้งหมด
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>

        {/* Products Grid */}
        <div className="products-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockProducts.slice(0, 8).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={(prod) => handleAddToCart(prod.id)}
              isWishlisted={wishlist.includes(product.id)}
              onToggleWishlist={toggleWishlist}
              isAdded={addedToCart.includes(product.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
