import { Outlet } from 'react-router-dom';
import Navigation from '@/sections/Navigation';
import Footer from '@/sections/Footer';
import { Toaster } from 'sonner';
import { useApp } from '@/context/AppContext';

export default function CustomerLayout() {
  const { scrollProgress } = useApp();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-orange-400 to-orange-600 z-50 origin-left"
        style={{ transform: `scaleX(${scrollProgress / 100})` }}
      />

      <Navigation />
      <main className="flex-1 pt-20">
        <Outlet />
      </main>
      <Footer />

      <Toaster />
    </div>
  );
}
