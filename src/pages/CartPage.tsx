import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Trash2, Minus, Plus, ShoppingCart, Tag, Truck, Shield } from 'lucide-react';
import { toast } from 'sonner';
import PageBanner from '@/components/ui/PageBanner';
import EmptyState from '@/components/ui/EmptyState';

export default function CartPage() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useApp();
  const [removingId, setRemovingId] = useState<number | null>(null);

  const shipping = cartItems.length > 0 ? 50 : 0;
  const discount = cartTotal > 5000 ? cartTotal * 0.05 : 0;
  const total = cartTotal + shipping - discount;

  const handleRemove = (productId: number) => {
    setRemovingId(productId);
    setTimeout(() => {
      removeFromCart(productId);
      toast.success('ลบสินค้าออกจากตะกร้าเรียบร้อย');
      setRemovingId(null);
    }, 300);
  };

  const handleUpdateQuantity = (productId: number, newQty: number) => {
    if (newQty < 1) return;
    updateQuantity(productId, newQty);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('กรุณาเพิ่มสินค้าลงตะกร้า');
      return;
    }
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <>
        <PageBanner
          title="ตะกร้าสินค้า"
          subtitle="รวมสินค้าที่คุณต้องการซื้อไว้ที่นี่"
          size="sm"
        />
        <EmptyState
          icon={ShoppingCart}
          title="ตะกร้าว่างเปล่า"
          description="คุณยังไม่ได้เพิ่มสินค้าลงในตะกร้า กลับไปเลือกสินค้าที่คุณชอบแล้วเพิ่มลงตะกร้า"
          actionLabel="ไปเลือกสินค้า"
          onAction={() => navigate('/products')}
        />
      </>
    );
  }

  return (
    <>
      <PageBanner
        title="ตะกร้าสินค้า"
        titleHighlight={`(${cartItems.length} รายการ)`}
        subtitle="ตรวจสอบสินค้าและดำเนินการชำระเงิน"
        size="sm"
      />

      <div className="bg-gray-50 min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map(item => (
                <div
                  key={item.product.id}
                  className={`bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-5 flex gap-4 ${
                    removingId === item.product.id ? 'opacity-40 scale-95' : ''
                  }`}
                >
                  {/* Image */}
                  <div className="flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-gray-50">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <p className="text-xs font-semibold text-orange-500 uppercase tracking-wide mb-1">
                        {item.product.category}
                      </p>
                      <h3 className="font-bold text-gray-900 leading-snug line-clamp-2">
                        {item.product.name}
                      </h3>
                    </div>
                    <p className="text-xl font-bold text-orange-500 mt-2">
                      ฿{item.product.price.toLocaleString('th-TH')}
                    </p>
                  </div>

                  {/* Qty & Actions */}
                  <div className="flex flex-col items-end justify-between gap-3 flex-shrink-0">
                    <div className="flex items-center rounded-xl border border-gray-200 overflow-hidden">
                      <button
                        onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="w-9 h-9 flex items-center justify-center hover:bg-orange-50 hover:text-orange-600 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-bold text-sm">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="w-9 h-9 flex items-center justify-center hover:bg-orange-50 hover:text-orange-600 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        ฿{(item.product.price * item.quantity).toLocaleString('th-TH')}
                      </p>
                      <button
                        onClick={() => handleRemove(item.product.id)}
                        className="mt-1 text-xs text-red-400 hover:text-red-600 transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        ลบ
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-4 mt-2">
                {[
                  { icon: Truck, text: 'จัดส่งภายใน 24 ชม.' },
                  { icon: Shield, text: 'รับประกันสินค้า' },
                  { icon: Tag, text: 'ราคาดีที่สุด' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
                    <Icon className="w-4 h-4 text-orange-500 flex-shrink-0" />
                    <span className="text-xs text-gray-600">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-5 pb-4 border-b border-gray-100">
                  สรุปคำสั่งซื้อ
                </h2>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-gray-600 text-sm">
                    <span>ราคาสินค้า ({cartItems.length} ชิ้น)</span>
                    <span>฿{cartTotal.toLocaleString('th-TH')}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 text-sm">
                    <span>ค่าจัดส่ง</span>
                    <span>{shipping > 0 ? `฿${shipping}` : 'ฟรี'}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600 text-sm font-medium">
                      <span>ส่วนลด 5%</span>
                      <span>-฿{discount.toLocaleString('th-TH')}</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-100 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900">รวมทั้งสิ้น</span>
                    <span className="text-2xl font-bold text-orange-500">
                      ฿{total.toLocaleString('th-TH')}
                    </span>
                  </div>
                </div>

                <button
                  className="btn btn-primary w-full h-12 text-base font-semibold shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 mb-3"
                  onClick={handleCheckout}
                >
                  ดำเนินการชำระเงิน
                </button>
                <button
                  className="btn btn-outline w-full"
                  onClick={() => navigate('/products')}
                >
                  เลือกสินค้าเพิ่มเติม
                </button>

                {cartTotal <= 5000 && (
                  <div className="mt-4 p-3 bg-orange-50 rounded-xl text-xs text-orange-700 text-center">
                    ซื้อเพิ่มอีก{' '}
                    <strong>฿{(5000 - cartTotal).toLocaleString('th-TH')}</strong>{' '}
                    เพื่อรับส่วนลด 5%!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
