import { useNavigate } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, CreditCard, Truck, Shield, RotateCcw } from 'lucide-react';

const footerLinks = {
  categories: [
    { label: 'มือถือ & แท็บเล็ต', href: '#' },
    { label: 'คอมพิวเตอร์', href: '#' },
    { label: 'หูฟัง & ลำโพง', href: '#' },
    { label: 'แฟชั่น', href: '#' },
    { label: 'ของใช้ในบ้าน', href: '#' },
  ],
  help: [
    { label: 'วิธีสั่งซื้อ', href: '#' },
    { label: 'การจัดส่ง', href: '#' },
    { label: 'การคืนสินค้า', href: '#' },
    { label: 'คำถามที่พบบ่อย', href: '#' },
    { label: 'ติดต่อเรา', href: '#' },
  ],
  about: [
    { label: 'เกี่ยวกับเรา', href: '#' },
    { label: 'ร่วมงานกับเรา', href: '#' },
    { label: 'นโยบายความเป็นส่วนตัว', href: '#' },
    { label: 'เงื่อนไขการใช้งาน', href: '#' },
    { label: 'แผนผังเว็บไซต์', href: '#' },
  ],
};

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook', color: 'hover:bg-blue-600' },
  { icon: Instagram, href: '#', label: 'Instagram', color: 'hover:bg-pink-600' },
  { icon: Twitter, href: '#', label: 'Twitter', color: 'hover:bg-sky-500' },
  { icon: Youtube, href: '#', label: 'Youtube', color: 'hover:bg-red-600' },
];

const trustFeatures = [
  { icon: CreditCard, label: 'ชำระเงินปลอดภัย' },
  { icon: Truck, label: 'จัดส่งรวดเร็ว' },
  { icon: Shield, label: 'ของแท้ 100%' },
  { icon: RotateCcw, label: 'คืนสินค้าได้ใน 7 วัน' },
];

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="relative bg-gray-900 text-white overflow-hidden">
      {/* Animated Gradient Border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-pink-500 via-purple-500 via-blue-500 to-orange-500 animate-gradient-x" />

      {/* Trust Features Bar */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustFeatures.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-3 group"
              >
                <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center group-hover:bg-orange-500 transition-colors duration-300">
                  <feature.icon className="w-6 h-6 text-orange-500 group-hover:text-white transition-colors duration-300" />
                </div>
                <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors duration-300">
                  {feature.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                <span className="text-white font-bold text-2xl">O</span>
              </div>
              <span className="font-bold text-2xl">
                Orange<span className="text-orange-500">Shop</span>
              </span>
            </button>

            <p className="text-gray-400 mb-6 max-w-sm">
              จัดจำหน่ายสินค้าคุณภาพดี ราคาคุ้มค่า พร้อมบริการหลังการขายที่ดีที่สุด
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-gray-400 hover:text-orange-500 transition-colors">
                <Phone className="w-5 h-5" />
                <span>02-123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 hover:text-orange-500 transition-colors">
                <Mail className="w-5 h-5" />
                <span>support@orangeshop.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 hover:text-orange-500 transition-colors">
                <MapPin className="w-5 h-5" />
                <span>กรุงเทพมหานคร, ประเทศไทย</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className={`w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 ${social.color} hover:text-white transition-all duration-300 hover:scale-110 hover:rotate-6`}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Categories Column */}
          <div>
            <h3 className="font-bold text-lg mb-6">หมวดหมู่สินค้า</h3>
            <ul className="space-y-3">
              {footerLinks.categories.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => navigate(`/products?category=${link.label}`)}
                    className="text-gray-400 hover:text-orange-500 transition-colors duration-300 inline-flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-orange-500 mr-0 group-hover:mr-2 transition-all duration-300" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Column */}
          <div>
            <h3 className="font-bold text-lg mb-6">ช่วยเหลือ</h3>
            <ul className="space-y-3">
              {footerLinks.help.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-orange-500 transition-colors duration-300 inline-flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-orange-500 mr-0 group-hover:mr-2 transition-all duration-300" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* About Column */}
          <div>
            <h3 className="font-bold text-lg mb-6">เกี่ยวกับเรา</h3>
            <ul className="space-y-3">
              {footerLinks.about.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-orange-500 transition-colors duration-300 inline-flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-orange-500 mr-0 group-hover:mr-2 transition-all duration-300" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">
              © 2024 OrangeShop. สงวนลิขสิทธิ์ทั้งหมด.
            </p>
            
            {/* Payment Methods */}
            <div className="flex items-center gap-4">
              <span className="text-gray-500 text-sm">ชำระเงินผ่าน:</span>
              <div className="flex gap-2">
                {['Visa', 'Mastercard', 'PromptPay'].map((method) => (
                  <div
                    key={method}
                    className="px-3 py-1 bg-gray-800 rounded text-xs text-gray-400"
                  >
                    {method}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add CSS for gradient animation */}
      <style>{`
        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 10s ease infinite;
        }
      `}</style>
    </footer>
  );
}
