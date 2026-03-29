import { useState, useEffect } from 'react';
import Navigation from './sections/Navigation';
import Hero from './sections/Hero';
import Categories from './sections/Categories';
import Products from './sections/Products';
import PromoBanner from './sections/PromoBanner';
import Testimonials from './sections/Testimonials';
import Newsletter from './sections/Newsletter';
import Footer from './sections/Footer';
import { Toaster, toast } from 'sonner';

function App() {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Scroll progress indicator
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddToCart = () => {
    setCartCount((prev) => prev + 1);
    toast.success('เพิ่มสินค้าลงตะกร้าเรียบร้อย!', {
      description: 'คุณสามารถดูสินค้าในตะกร้าได้ที่เมนูด้านบน',
      duration: 3000,
      icon: '🛒',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Scroll Progress Indicator */}
      <div
        className="scroll-progress"
        style={{ transform: `scaleX(${scrollProgress / 100})` }}
      />

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
          },
        }}
      />

      {/* Navigation */}
      <Navigation cartCount={cartCount} wishlistCount={wishlistCount} />

      {/* Main Content */}
      <main>
        <Hero onAddToCart={handleAddToCart} />
        <Categories />
        <Products onAddToCart={handleAddToCart} />
        <PromoBanner onAddToCart={handleAddToCart} />
        <Testimonials />
        <Newsletter />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
