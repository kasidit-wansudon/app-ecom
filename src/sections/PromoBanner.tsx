import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Clock, Zap } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function PromoBanner() {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 35,
    seconds: 42,
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background sweep animation
      gsap.fromTo(
        '.promo-bg-left',
        { x: '-100%' },
        {
          x: '0%',
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        '.promo-bg-right',
        { x: '100%' },
        {
          x: '0%',
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Content animation
      gsap.fromTo(
        '.promo-content',
        { y: 50, opacity: 0 },
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

      // Countdown animation
      gsap.fromTo(
        '.countdown-item',
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: 'back.out(2)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev;

        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours--;
            } else {
              hours = 23;
              if (days > 0) {
                days--;
              }
            }
          }
        }

        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const isUrgent = timeLeft.hours < 1;

  return (
    <section
      id="promo"
      ref={sectionRef}
      className="relative py-20 lg:py-28 overflow-hidden"
    >
      {/* Diagonal Split Background */}
      <div className="absolute inset-0">
        {/* Left Side - Dark */}
        <div className="promo-bg-left absolute inset-0 bg-gray-900" style={{ clipPath: 'polygon(0 0, 60% 0, 45% 100%, 0 100%)' }} />

        {/* Right Side - Orange Gradient */}
        <div
          className="promo-bg-right absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600"
          style={{ clipPath: 'polygon(60% 0, 100% 0, 100% 100%, 45% 100%)' }}
        />

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-32 h-32 border border-white/10 rounded-full" />
        <div className="absolute bottom-10 right-10 w-48 h-48 border border-white/10 rounded-full" />
        <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-orange-400 rounded-full animate-pulse" />
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-white/30 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="promo-content grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 backdrop-blur-sm rounded-full mb-6">
              <Zap className="w-5 h-5 text-orange-400" />
              <span className="text-orange-300 font-medium">Flash Sale จำกัดเวลา</span>
            </div>

            {/* Headline */}
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              ลดสูงสุด
              <span className="text-gradient-orange block mt-2">50%</span>
            </h2>

            <p className="text-gray-300 text-lg mb-8 max-w-md mx-auto lg:mx-0">
              สินค้าคอลเลกชันพิเศษ จำกัดจำนวน รีบคว้าก่อนหมด!
            </p>

            {/* CTA Button */}
            <button
              onClick={() => navigate('/products')}
              className={`btn btn-lg bg-white text-gray-900 hover:bg-orange-50 px-8 py-6 text-lg font-bold rounded-xl hover:scale-105 group ${
                isUrgent ? 'animate-pulse' : ''
              }`}
            >
              ช้อปดีลนี้เลย
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>

          {/* Right Content - Countdown */}
          <div className="flex flex-col items-center lg:items-end">
            {/* Countdown Label */}
            <div className="flex items-center gap-2 text-white/80 mb-6">
              <Clock className={`w-5 h-5 ${isUrgent ? 'text-red-400 animate-pulse' : ''}`} />
              <span className="font-medium">หมดเวลาในอีก</span>
            </div>

            {/* Countdown Timer */}
            <div className="flex gap-4">
              {[
                { value: timeLeft.days, label: 'วัน' },
                { value: timeLeft.hours, label: 'ชม.' },
                { value: timeLeft.minutes, label: 'นาที' },
                { value: timeLeft.seconds, label: 'วิ' },
              ].map((item, index) => (
                <div
                  key={index}
                  className={`countdown-item flex flex-col items-center ${
                    isUrgent ? 'animate-pulse' : ''
                  }`}
                >
                  <div
                    className={`w-20 h-24 sm:w-24 sm:h-28 flex items-center justify-center rounded-2xl text-3xl sm:text-4xl font-bold ${
                      isUrgent
                        ? 'bg-red-500/20 border-2 border-red-500 text-red-400'
                        : 'bg-white/10 backdrop-blur-sm text-white border border-white/20'
                    }`}
                  >
                    {String(item.value).padStart(2, '0')}
                  </div>
                  <span className="text-white/60 text-sm mt-2">{item.label}</span>
                </div>
              ))}
            </div>

            {/* Urgency Message */}
            {isUrgent && (
              <div className="mt-6 px-6 py-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-center animate-pulse">
                ⚡ เหลือเวลาอีกนิดเดียว! รีบสั่งซื้อเลย
              </div>
            )}

            {/* Stats */}
            <div className="mt-8 flex gap-8 text-center">
              <div>
                <div className="text-2xl font-bold text-white">1,234</div>
                <div className="text-white/60 text-sm">คนดูขณะนี้</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-400">89</div>
                <div className="text-white/60 text-sm">ชิ้นที่เหลือ</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">456</div>
                <div className="text-white/60 text-sm">ขายแล้ว</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
