import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Star, Truck, Shield } from 'lucide-react';
import gsap from 'gsap';
import { useApp } from '@/context/AppContext';
import { mockProducts } from '@/data/mockData';

const trustBadges = [
  { icon: ShoppingBag, value: '10K+', label: 'สินค้า' },
  { icon: Star, value: '50K+', label: 'รีวิว' },
  { icon: Truck, value: '24h', label: 'จัดส่ง' },
  { icon: Shield, value: '100%', label: 'รับประกัน' },
];

export default function Hero() {
  const navigate = useNavigate();
  const { addToCart } = useApp();
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const productRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Timeline for entrance animations
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Background gradient reveal
      tl.fromTo(
        '.hero-bg',
        { opacity: 0, scale: 1.1 },
        { opacity: 1, scale: 1, duration: 0.8 }
      );

      // Eyebrow
      tl.fromTo(
        '.hero-eyebrow',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4 },
        '-=0.4'
      );

      // Headline words
      tl.fromTo(
        '.hero-headline-word',
        { y: 40, opacity: 0, clipPath: 'inset(100% 0 0 0)' },
        {
          y: 0,
          opacity: 1,
          clipPath: 'inset(0% 0 0 0)',
          duration: 0.5,
          stagger: 0.1,
        },
        '-=0.2'
      );

      // Description
      tl.fromTo(
        '.hero-description',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4 },
        '-=0.2'
      );

      // CTA buttons
      tl.fromTo(
        '.hero-cta',
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, stagger: 0.1 },
        '-=0.2'
      );

      // Trust badges
      tl.fromTo(
        '.trust-badge',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.1 },
        '-=0.2'
      );

      // Product card
      tl.fromTo(
        '.hero-product',
        { x: 100, opacity: 0, rotateY: -30 },
        { x: 0, opacity: 1, rotateY: 0, duration: 0.8, ease: 'back.out(1.2)' },
        '-=0.6'
      );

      // Floating elements
      tl.fromTo(
        '.floating-element',
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(2)' },
        '-=0.4'
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Mouse move handler for 3D effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!productRef.current) return;
    const rect = productRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
    setMousePosition({ x: x * 15, y: y * -15 });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Animated Background */}
      <div className="hero-bg absolute inset-0">
        {/* Gradient Mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-orange-100" />

        {/* Animated Orbs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-orange-300/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-orange-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-orange-200/10 to-pink-200/10 rounded-full blur-3xl" />

        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-orange-400/30 rounded-full float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div ref={contentRef} className="text-center lg:text-left">
            {/* Eyebrow */}
            <div className="hero-eyebrow inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full mb-6">
              <span className="text-orange-500">✨</span>
              <span className="text-sm font-medium text-orange-700">
                สินค้าขายดีประจำเดือน
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              <span className="hero-headline-word inline-block">ค้นพบ</span>{' '}
              <span className="hero-headline-word inline-block text-gradient-orange">สินค้าที่ใช่</span>{' '}
              <span className="hero-headline-word inline-block">สำหรับ</span>
              <br />
              <span className="hero-headline-word inline-block">ไลฟ์สไตล์ของคุณ</span>
            </h1>

            {/* Description */}
            <p className="hero-description text-lg text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
              คัดสรรสินค้าคุณภาพดี ราคาคุ้มค่า ส่งตรงถึงบ้านคุณ
              พร้อมโปรโมชั่นสุดพิเศษทุกวัน
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
              <button
                className="hero-cta btn btn-primary btn-lg px-8 py-6 text-lg font-semibold rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 group"
                onClick={() => {
                  addToCart(mockProducts[0]);
                  navigate('/cart');
                }}
              >
                ช้อปเลยตอนนี้
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
              </button>
              <button
                className="hero-cta btn btn-outline btn-lg border-2 border-gray-900 text-gray-900 hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50 px-8 py-6 text-lg font-semibold rounded-xl group"
                onClick={() => navigate('/products')}
              >
                ดูสินค้าทั้งหมด
                <ArrowRight className="ml-2 w-5 h-5 group-hover:rotate-[-45deg] transition-transform duration-300" />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6">
              {trustBadges.map((badge, index) => (
                <div
                  key={index}
                  className="trust-badge flex items-center gap-3 px-4 py-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <badge.icon className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{badge.value}</div>
                    <div className="text-xs text-gray-500">{badge.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - 3D Product Showcase */}
          <div
            ref={productRef}
            className="relative flex justify-center items-center"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ perspective: '1000px' }}
          >
            {/* Main Product Card */}
            <div
              className="hero-product relative w-80 h-[450px] bg-white rounded-3xl shadow-2xl overflow-hidden cursor-pointer"
              style={{
                transform: `rotateX(${mousePosition.y}deg) rotateY(${mousePosition.x}deg)`,
                transition: 'transform 0.1s ease-out',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Product Image */}
              <div className="relative h-3/5 bg-gradient-to-br from-orange-100 to-orange-50 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop"
                  alt="Featured Product"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
                {/* Sale Badge */}
                <div className="absolute top-4 left-4 px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full sale-pulse">
                  ลด 30%
                </div>
                {/* New Badge */}
                <div className="absolute top-4 right-4 px-3 py-1 bg-orange-500 text-white text-sm font-bold rounded-full">
                  ใหม่
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  หูฟังไร้สาย Premium
                </h3>
                <p className="text-gray-500 text-sm mb-4">
                  เสียงคมชัด แบตอึด ใส่สบาย
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-orange-500">฿2,990</span>
                    <span className="text-sm text-gray-400 line-through ml-2">฿4,290</span>
                  </div>
                  <button
                    className="btn btn-primary btn-sm rounded-full flex items-center"
                    onClick={() => addToCart(mockProducts[0])}
                  >
                    <ShoppingBag className="w-4 h-4 mr-1" />
                    เพิ่ม
                  </button>
                </div>
              </div>

              {/* Reflection Effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none shimmer" />
            </div>

            {/* Floating Elements */}
            <div
              className="floating-element absolute -top-4 -right-4 w-20 h-20 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg float"
              style={{ animationDelay: '0.5s' }}
            >
              <Star className="w-10 h-10 text-white fill-white" />
            </div>

            <div
              className="floating-element absolute -bottom-4 -left-4 w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-lg float"
              style={{ animationDelay: '1s' }}
            >
              <span className="text-2xl font-bold text-orange-500">4.9</span>
            </div>

            <div
              className="floating-element absolute top-1/2 -right-8 w-14 h-14 bg-gradient-to-br from-pink-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg float"
              style={{ animationDelay: '1.5s' }}
            >
              <span className="text-white text-xs font-bold">HOT</span>
            </div>

            {/* Background Decorative Elements */}
            <div className="absolute -z-10 w-[500px] h-[500px] border-2 border-orange-200/50 rounded-full animate-spin" style={{ animationDuration: '30s' }} />
            <div className="absolute -z-10 w-[400px] h-[400px] border border-orange-300/30 rounded-full animate-spin" style={{ animationDuration: '20s', animationDirection: 'reverse' }} />
          </div>
        </div>
      </div>
    </section>
  );
}
