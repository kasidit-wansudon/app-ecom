import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, Package, MapPin, ShoppingBag, ArrowRight, Phone, Mail } from 'lucide-react';
import gsap from 'gsap';
import type { CartItem } from '@/types';

interface OrderSuccessState {
  orderId: string;
  items: CartItem[];
  total: number;
  shippingAddress: string;
}

export default function OrderSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);
  const state = location.state as OrderSuccessState;

  useEffect(() => {
    if (!cardRef.current) return;
    gsap.fromTo(
      cardRef.current.children,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.12, duration: 0.6, ease: 'power3.out', delay: 0.2 }
    );
  }, []);

  if (!state) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center py-12 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">ไม่พบข้อมูลคำสั่งซื้อ</h1>
          <p className="text-gray-500 text-sm mb-6">กรุณากลับไปยังหน้าแรกและลองอีกครั้ง</p>
          <button className="btn btn-primary w-full" onClick={() => navigate('/')}>
            กลับไปหน้าแรก
          </button>
        </div>
      </div>
    );
  }

  const { orderId, items, total, shippingAddress } = state;
  const shipping = 50;
  const subtotal = total - shipping;
  const discount = subtotal > 5000 ? subtotal * 0.05 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-orange-50 py-12 px-4">
      {/* Background Decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-100/40 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-orange-100/40 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto" ref={cardRef}>
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-6">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                <CheckCircle2 className="w-9 h-9 text-white" />
              </div>
            </div>
            {/* Sparkle rings */}
            <div className="absolute inset-0 rounded-full border-4 border-green-200 animate-ping opacity-20" />
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            สั่งซื้อสำเร็จ! 🎉
          </h1>
          <p className="text-gray-600 text-lg">
            ขอบคุณที่ใช้บริการ OrangeShop
          </p>
        </div>

        {/* Order ID Card */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-center mb-6 shadow-lg shadow-orange-500/20">
          <p className="text-orange-100 text-sm mb-1">หมายเลขคำสั่งซื้อ</p>
          <h2 className="text-3xl font-bold text-white tracking-wider">{orderId}</h2>
          <p className="text-orange-200 text-xs mt-2">บันทึกหมายเลขนี้เพื่อติดตามสินค้า</p>
        </div>

        {/* Details Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden mb-6">
          {/* Shipping Address */}
          <div className="p-5 border-b border-gray-100 flex items-start gap-3">
            <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">ที่อยู่จัดส่ง</p>
              <p className="text-gray-800 text-sm">{shippingAddress}</p>
            </div>
          </div>

          {/* Items */}
          <div className="p-5 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <ShoppingBag className="w-4 h-4 text-orange-500" />
              <p className="text-sm font-semibold text-gray-900">รายการสินค้า</p>
            </div>
            <div className="space-y-2">
              {items.map(item => (
                <div key={item.product.id} className="flex justify-between items-center">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 truncate">{item.product.name}</p>
                    <p className="text-xs text-gray-500">x{item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 ml-4">
                    ฿{(item.product.price * item.quantity).toLocaleString('th-TH')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Price Summary */}
          <div className="p-5 space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>ค่าจัดส่ง</span><span>฿{shipping}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-green-600 font-medium">
                <span>ส่วนลด</span><span>-฿{discount.toLocaleString('th-TH')}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
              <span className="font-bold text-gray-900">รวมทั้งสิ้น</span>
              <span className="text-2xl font-bold text-orange-500">฿{total.toLocaleString('th-TH')}</span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 rounded-2xl p-5 mb-6">
          <h3 className="font-bold text-gray-900 mb-4">ขั้นตอนต่อไป</h3>
          <div className="space-y-3">
            {[
              'คุณจะได้รับอีเมลยืนยันคำสั่งซื้อในไม่ช้า',
              'สินค้าจะถูกเตรียมส่งและคุณจะได้รับหมายเลขการติดตาม',
              'สินค้าจะถึงประมาณ 2-5 วันทำการ',
            ].map((step, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-sm text-gray-700">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <button
            className="btn btn-primary flex-1 h-12 text-base font-semibold shadow-lg shadow-orange-500/20"
            onClick={() => navigate('/account/orders')}
          >
            ดูสถานะคำสั่งซื้อ
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            className="btn btn-outline flex-1 h-12"
            onClick={() => navigate('/products')}
          >
            เลือกสินค้าเพิ่มเติม
          </button>
        </div>

        {/* Support */}
        <div className="bg-gray-50 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <p className="text-sm font-semibold text-gray-900">ต้องการความช่วยเหลือ?</p>
          <div className="flex flex-wrap gap-3">
            <a href="mailto:support@orangeshop.com" className="flex items-center gap-2 text-sm text-orange-500 hover:text-orange-600">
              <Mail className="w-4 h-4" /> support@orangeshop.com
            </a>
            <a href="tel:+66123456789" className="flex items-center gap-2 text-sm text-orange-500 hover:text-orange-600">
              <Phone className="w-4 h-4" /> +66 1 2345 6789
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
