import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Smartphone, Laptop, Headphones, Watch, Camera, Gamepad2, Shirt, Home } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const categories = [
  { id: 1, name: 'มือถือ', icon: Smartphone, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop', productCount: 245, color: 'bg-blue-500' },
  { id: 2, name: 'คอมพิวเตอร์', icon: Laptop, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop', productCount: 189, color: 'bg-purple-500' },
  { id: 3, name: 'หูฟัง', icon: Headphones, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop', productCount: 156, color: 'bg-orange-500' },
  { id: 4, name: 'นาฬิกา', icon: Watch, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop', productCount: 98, color: 'bg-green-500' },
  { id: 5, name: 'กล้อง', icon: Camera, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop', productCount: 67, color: 'bg-red-500' },
  { id: 6, name: 'เกม', icon: Gamepad2, image: 'https://images.unsplash.com/photo-1493711662062-fa541f7f3d24?w=400&h=300&fit=crop', productCount: 134, color: 'bg-indigo-500' },
  { id: 7, name: 'แฟชั่น', icon: Shirt, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop', productCount: 312, color: 'bg-pink-500' },
  { id: 8, name: 'บ้าน', icon: Home, image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400&h=300&fit=crop', productCount: 178, color: 'bg-teal-500' },
];

export default function Categories() {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        '.category-title',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Underline animation
      gsap.fromTo(
        '.title-underline',
        { width: '0%' },
        {
          width: '100%',
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Cards stagger animation
      gsap.fromTo(
        '.category-card',
        { x: 60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleMouseMove = (e: React.MouseEvent, cardId: number) => {
    const card = e.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
    setMousePos({ x, y });
    setHoveredCard(cardId);
  };

  const handleMouseLeave = () => {
    setHoveredCard(null);
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <section
      id="categories"
      ref={sectionRef}
      className="py-20 lg:py-32 bg-white relative overflow-hidden"
    >
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div ref={titleRef} className="text-center mb-16">
          <h2 className="category-title text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            หมวดหมู่<span className="text-gradient-orange">ยอดนิยม</span>
          </h2>
          <div className="relative inline-block">
            <p className="category-title text-gray-600 text-lg">
              ค้นหาสินค้าตามหมวดหมู่ที่คุณสนใจ
            </p>
            <div className="title-underline absolute -bottom-2 left-1/2 -translate-x-1/2 h-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full" style={{ width: 0 }} />
          </div>
        </div>

        {/* Categories Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {categories.map((category) => {
            const Icon = category.icon;
            const isHovered = hoveredCard === category.id;

            return (
              <div
                key={category.id}
                className="category-card group relative"
                onMouseMove={(e) => handleMouseMove(e, category.id)}
                onMouseLeave={handleMouseLeave}
                style={{ perspective: '1000px' }}
                onClick={() => navigate(`/products?category=${category.name}`)}
              >
                <div
                  className="relative bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
                  style={{
                    transform: isHovered
                      ? `rotateX(${mousePos.y}deg) rotateY(${mousePos.x}deg) translateZ(30px) scale(1.05)`
                      : 'rotateX(0) rotateY(0) translateZ(0) scale(1)',
                    transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* Image */}
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    
                    {/* Icon Badge */}
                    <div className={`absolute bottom-4 left-4 w-12 h-12 ${category.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-orange-500 transition-colors duration-300">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {category.productCount.toLocaleString()} สินค้า
                    </p>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  {/* Shine Effect */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: isHovered
                        ? `radial-gradient(circle at ${((mousePos.x + 10) / 20) * 100}% ${((-mousePos.y + 5) / 10) * 100}%, rgba(255,255,255,0.3) 0%, transparent 50%)`
                        : 'none',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate('/products')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-full font-semibold hover:bg-orange-500 transition-colors duration-300 group"
          >
            ดูหมวดหมู่ทั้งหมด
            <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
