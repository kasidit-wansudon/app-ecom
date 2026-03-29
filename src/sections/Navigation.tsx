import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, Heart } from 'lucide-react';
import { useApp } from '@/context/AppContext';

const navLinks = [
  { label: 'หน้าแรก', href: '/' },
  { label: 'สินค้า', href: '/products' },
];

export default function Navigation() {
  const navigate = useNavigate();
  const { cartCount, wishlist } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-orange-snap ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-lg py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              className={`flex items-center gap-2 transition-transform duration-500 ${
                isScrolled ? 'scale-90' : 'scale-100'
              }`}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                <span className="text-white font-bold text-xl">O</span>
              </div>
              <span
                className={`font-bold text-xl transition-colors duration-300 ${
                  isScrolled ? 'text-gray-900' : 'text-gray-900'
                }`}
              >
                Orange<span className="text-orange-500">Shop</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="relative text-gray-700 hover:text-orange-500 font-medium transition-colors duration-300 group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 ease-orange-snap group-hover:w-full" />
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                className="hidden sm:flex items-center justify-center w-10 h-10 rounded-lg text-gray-700 hover:text-orange-500 hover:bg-orange-50 transition-all duration-300"
                onClick={() => navigate('/search')}
              >
                <Search className="w-5 h-5" />
              </button>

              <button
                className="hidden sm:flex items-center justify-center w-10 h-10 rounded-lg text-gray-700 hover:text-orange-500 hover:bg-orange-50 transition-all duration-300 relative"
                onClick={() => navigate('/wishlist')}
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-orange-500 text-white text-xs rounded-full animate-pulse">
                    {wishlist.length}
                  </span>
                )}
              </button>

              <button
                className="hidden sm:flex items-center justify-center w-10 h-10 rounded-lg text-gray-700 hover:text-orange-500 hover:bg-orange-50 transition-all duration-300"
                onClick={() => navigate('/account')}
              >
                <User className="w-5 h-5" />
              </button>

              <button
                className="flex items-center justify-center w-10 h-10 rounded-lg text-gray-700 hover:text-orange-500 hover:bg-orange-50 transition-all duration-300 relative"
                onClick={() => navigate('/cart')}
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-orange-500 text-white text-xs rounded-full sale-pulse">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg text-gray-700 hover:text-orange-500 hover:bg-orange-50"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${
          isMobileMenuOpen ? 'visible' : 'invisible'
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-500 ${
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Menu Panel */}
        <div
          className={`absolute top-0 right-0 w-80 max-w-full h-full bg-white shadow-2xl transition-transform duration-500 ease-orange-snap ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-6 pt-20">
            <div className="flex flex-col gap-4">
              {navLinks.map((link, index) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-medium text-gray-800 hover:text-orange-500 py-3 border-b border-gray-100 transition-all duration-300"
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="mt-8 flex gap-4">
              <button
                className="btn btn-outline flex-1 border-orange-500 text-orange-500 hover:bg-orange-50 flex items-center justify-center"
                onClick={() => {
                  navigate('/account');
                  setIsMobileMenuOpen(false);
                }}
              >
                <User className="w-4 h-4 mr-2" />
                บัญชี
              </button>
              <button
                className="btn btn-primary flex-1 flex items-center justify-center"
                onClick={() => {
                  navigate('/cart');
                  setIsMobileMenuOpen(false);
                }}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                ตะกร้า ({cartCount})
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
