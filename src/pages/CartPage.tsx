import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Trash2, Minus, Plus, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

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
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center py-12">
        <div className="card text-center p-8 max-w-md">
          <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">ตะกร้าว่างเปล่า</h1>
          <p className="text-gray-600 mb-6">
            คุณยังไม่ได้เพิ่มสินค้าลงในตะกร้า กลับไปเลือกสินค้าและเพิ่มลงตะกร้า
          </p>
          <button
            className="btn btn-primary w-full"
            onClick={() => navigate('/products')}
          >
            ไปเลือกสินค้า
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
          ตะกร้าสินค้า ({cartItems.length} รายการ)
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items - Left */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => (
              <div
                key={item.product.id}
                className={`card p-4 sm:p-6 flex gap-4 transition-all ${
                  removingId === item.product.id ? 'opacity-50' : ''
                }`}
              >
                {/* Product Image */}
                <div className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      {item.product.category}
                    </p>
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                      {item.product.name}
                    </h3>
                  </div>

                  {/* Price */}
                  <p className="text-lg font-bold text-orange-500">
                    ฿{item.product.price.toLocaleString()}
                  </p>
                </div>

                {/* Quantity & Actions */}
                <div className="flex flex-col items-end gap-3">
                  {/* Quantity Control */}
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.product.id, item.quantity - 1)
                      }
                      className="p-1.5 hover:bg-gray-100"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-1.5 text-center font-semibold w-12">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.product.id, item.quantity + 1)
                      }
                      className="p-1.5 hover:bg-gray-100"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Subtotal & Remove */}
                  <div className="text-right space-y-2">
                    <p className="text-sm text-gray-600">
                      รวม: ฿{(item.product.price * item.quantity).toLocaleString()}
                    </p>
                    <button
                      onClick={() => handleRemove(item.product.id)}
                      className="text-red-500 hover:text-red-600 transition-colors flex items-center gap-1 text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      ลบ
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary - Right */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-20 space-y-4">
              {/* Summary Details */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">สรุปคำสั่งซื้อ</h2>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-gray-600">
                    <span>ราคาสินค้า</span>
                    <span>฿{cartTotal.toLocaleString()}</span>
                  </div>

                  {shipping > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>ค่าจัดส่ง</span>
                      <span>฿{shipping.toLocaleString()}</span>
                    </div>
                  )}

                  {discount > 0 && (
                    <div className="flex justify-between text-green-600 font-medium">
                      <span>ส่วนลด</span>
                      <span>-฿{discount.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <hr className="divider my-4" />

                <div className="flex justify-between text-xl font-bold text-gray-900 mb-6">
                  <span>รวมทั้งสิ้น</span>
                  <span className="text-orange-500">฿{total.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                className="btn btn-primary w-full h-12"
                onClick={handleCheckout}
              >
                ดำเนินการชำระเงิน
              </button>

              {/* Continue Shopping */}
              <button
                className="btn btn-outline w-full"
                onClick={() => navigate('/products')}
              >
                เลือกสินค้าเพิ่มเติม
              </button>

              {/* Discount Info */}
              {cartTotal <= 5000 && (
                <div className="p-3 bg-orange-50 rounded-lg text-sm text-orange-700">
                  ซื้อเพิ่มอีก ฿{(5000 - cartTotal).toLocaleString()} เพื่อได้ส่วนลด 5%
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
