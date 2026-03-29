import { useEffect, useRef, useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    id: 1,
    name: 'คุณสมชาย ใจดี',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    comment: 'สินค้าคุณภาพดีมาก ส่งไวเกินคาด หูฟังที่สั่งมาเสียงดีสุดๆ ประทับใจมากครับ จะสั่งอีกแน่นอน!',
    role: 'ลูกค้าประจำ',
  },
  {
    id: 2,
    name: 'คุณวิภา สวยงาม',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    comment: 'บริการดีมากค่ะ พนักงานตอบไว ให้คำแนะนำดี สินค้าตรงปก แพ็คมาอย่างดี ไม่มีตำหนิเลย',
    role: 'นักธุรกิจ',
  },
  {
    id: 3,
    name: 'คุณประเสริฐ รุ่งเรือง',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    comment: 'ราคาดีที่สุดในตลาด โปรโมชั่นเยอะ สะสมแต้มแลกของรางวัลได้ด้วย คุ้มค่าสุดๆ',
    role: 'นักศึกษา',
  },
  {
    id: 4,
    name: 'คุณมานี มีสุข',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    comment: 'ชอบความหลากหลายของสินค้า มีให้เลือกเยอะ ราคาเป็นมิตร ส่งฟรีด้วย ดีมากค่ะ',
    role: 'ครู',
  },
  {
    id: 5,
    name: 'คุณสมศักดิ์ แข็งแรง',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    comment: 'ซื้อมาหลายครั้งแล้ว ไม่เคยผิดหวัง สินค้าของแท้ 100% มีประกันครบ มั่นใจได้',
    role: 'วิศวกร',
  },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        '.testimonials-title',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Carousel animation
      gsap.fromTo(
        '.testimonial-carousel',
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        goToNext();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [activeIndex, isAnimating]);

  const goToNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToPrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const getCardStyle = (index: number) => {
    const diff = index - activeIndex;
    const normalizedDiff = ((diff + testimonials.length) % testimonials.length);

    if (normalizedDiff === 0) {
      // Active card
      return {
        transform: 'translateX(0) rotateY(0deg) scale(1)',
        opacity: 1,
        zIndex: 10,
      };
    } else if (normalizedDiff === 1 || normalizedDiff === -testimonials.length + 1) {
      // Right card
      return {
        transform: 'translateX(120%) rotateY(-25deg) scale(0.85)',
        opacity: 0.5,
        zIndex: 5,
      };
    } else if (normalizedDiff === testimonials.length - 1 || normalizedDiff === -1) {
      // Left card
      return {
        transform: 'translateX(-120%) rotateY(25deg) scale(0.85)',
        opacity: 0.5,
        zIndex: 5,
      };
    } else {
      // Hidden cards
      return {
        transform: 'translateX(0) rotateY(0deg) scale(0.7)',
        opacity: 0,
        zIndex: 0,
      };
    }
  };

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="py-20 lg:py-32 bg-gradient-to-b from-orange-50/50 to-white relative overflow-hidden"
    >
      {/* Background Decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-orange-300/15 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="testimonials-title text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            ลูกค้าพูด<span className="text-gradient-orange">ถึงเรา</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-xl mx-auto">
            ฟังเสียงจากลูกค้าที่ไว้วางใจและเลือกใช้บริการของเรา
          </p>
        </div>

        {/* 3D Carousel */}
        <div className="testimonial-carousel relative h-[400px] flex items-center justify-center" style={{ perspective: '1000px' }}>
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="absolute w-full max-w-lg transition-all duration-500 ease-out"
              style={{
                ...getCardStyle(index),
                transformStyle: 'preserve-3d',
              }}
            >
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                {/* Quote Icon */}
                <div className="absolute -top-4 left-8 w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                  <Quote className="w-5 h-5 text-white" />
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-6 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < testimonial.rating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-gray-700 text-lg leading-relaxed mb-8">
                  "{testimonial.comment}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    {/* Animated Ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-orange-500 border-dashed animate-spin" style={{ animationDuration: '10s' }} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={goToPrev}
            className="w-12 h-12 rounded-full border-2 border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-all duration-300 flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="flex gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!isAnimating) {
                    setIsAnimating(true);
                    setActiveIndex(index);
                    setTimeout(() => setIsAnimating(false), 500);
                  }
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? 'bg-orange-500 w-8'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          <button
            onClick={goToNext}
            className="w-12 h-12 rounded-full border-2 border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-all duration-300 flex items-center justify-center"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
