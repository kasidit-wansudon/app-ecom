import { useEffect, useRef, useState } from 'react';
import { Mail, Check, Gift, Bell, Tag } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const benefits = [
  { icon: Gift, text: 'รับส่วนลด 10% ครั้งแรก' },
  { icon: Bell, text: 'แจ้งเตือนโปรโมชั่นก่อนใคร' },
  { icon: Tag, text: 'สิทธิพิเศษเฉพาะสมาชิก' },
];

export default function Newsletter() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Card animation
      gsap.fromTo(
        '.newsletter-card',
        { y: 60, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Benefits animation
      gsap.fromTo(
        '.benefit-item',
        { x: -30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);

      // Confetti effect
      createConfetti();
    }, 1500);
  };

  const createConfetti = () => {
    const colors = ['#FF6B35', '#FF9F6B', '#E85D04', '#FFD93D', '#6BCF7F'];
    const container = document.querySelector('.newsletter-card');

    if (!container) return;

    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'absolute w-3 h-3 rounded-sm pointer-events-none';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = '50%';
      confetti.style.top = '50%';
      container.appendChild(confetti);

      gsap.to(confetti, {
        x: (Math.random() - 0.5) * 400,
        y: (Math.random() - 0.5) * 400,
        rotation: Math.random() * 720,
        opacity: 0,
        duration: 1 + Math.random(),
        ease: 'power2.out',
        onComplete: () => confetti.remove(),
      });
    }
  };

  return (
    <section
      ref={sectionRef}
      className="py-20 lg:py-32 bg-white relative overflow-hidden"
    >
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-orange-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-orange-300/15 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Newsletter Card with Gradient Border */}
        <div className="newsletter-card relative">
          {/* Gradient Border Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 rounded-3xl opacity-75 blur-sm animate-pulse" />

          {/* Card Content */}
          <div className="relative bg-white rounded-3xl p-8 sm:p-12 shadow-2xl overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-100 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 text-center">
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg shadow-orange-500/30 mb-6">
                <Mail className="w-8 h-8 text-white" />
              </div>

              {/* Title */}
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                รับสิทธิพิเศษ<span className="text-gradient-orange">ก่อนใคร!</span>
              </h2>

              <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                สมัครรับข่าวสารและโปรโมชั่นสุดคุ้ม อัปเดตก่อนใคร
              </p>

              {/* Benefits */}
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="benefit-item flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-full"
                  >
                    <benefit.icon className="w-4 h-4 text-orange-500" />
                    <span className="text-sm text-gray-700">{benefit.text}</span>
                  </div>
                ))}
              </div>

              {/* Form */}
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        placeholder="กรอกอีเมลของคุณ"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-input pl-12 pr-4 py-4 text-lg rounded-xl border-2 border-gray-200 focus:border-orange-500 w-full"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn btn-primary px-8 py-4 text-lg font-semibold rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 disabled:opacity-70"
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          กำลังส่ง...
                        </span>
                      ) : (
                        'สมัครเลย'
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="max-w-md mx-auto">
                  <div className="flex flex-col items-center gap-4 p-6 bg-green-50 rounded-2xl">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-green-700 mb-2">
                        สมัครสำเร็จ!
                      </h3>
                      <p className="text-green-600">
                        ขอบคุณที่สมัครรับข่าวสาร เราจะส่งโปรโมชั่นดีๆ ให้คุณ
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Note */}
              <p className="text-sm text-gray-400 mt-6">
                เราเคารพความเป็นส่วนตัวของคุณ ไม่ส่งสแปมแน่นอน
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
