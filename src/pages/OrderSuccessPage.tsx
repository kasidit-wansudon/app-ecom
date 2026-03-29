import { useLocation, useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
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
  const state = location.state as OrderSuccessState;

  if (!state) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center py-12">
        <div className="card text-center p-8 max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">ไม่พบข้อมูลคำสั่งซื้อ</h1>
          <p className="text-gray-600 mb-6">
            กรุณากลับไปยังหน้าแรกและลองอีกครั้ง
          </p>
          <button
            className="btn btn-primary w-full"
            onClick={() => navigate('/')}
          >
            กลับไปหน้าแรก
          </button>
        </div>
      </div>
    );
  }

  const { orderId, items, total, shippingAddress } = state;
  const shipping = 50;
  const discount = (total - shipping > 5000) ? (total - shipping) * 0.05 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6 animate-bounce">
            <Check className="w-10 h-10 text-green-600" />
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            สั่งซื้อสำเร็จแล้ว!
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            ขอบคุณที่ใช้บริการ เราจะส่งสินค้าให้คุณ
            <br />
            ตามที่อยู่ที่คุณระบุในเร็วๆ นี้
          </p>
        </div>

        {/* Order Details Card */}
        <div className="card p-6 sm:p-8 mb-8">
          {/* Order ID */}
          <div className="text-center pb-6 border-b">
            <p className="text-gray-600 text-sm mb-1">หมายเลขคำสั่งซื้อ</p>
            <h2 className="text-3xl font-bold text-orange-600">{orderId}</h2>
          </div>

          {/* Shipping Address */}
          <div className="py-6 border-b">
            <h3 className="font-bold text-gray-900 mb-2">ที่อยู่จัดส่ง</h3>
            <p className="text-gray-600 text-sm">{shippingAddress}</p>
          </div>

          {/* Items Summary */}
          <div className="py-6 border-b">
            <h3 className="font-bold text-gray-900 mb-4">สินค้าที่สั่ง</h3>
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>สินค้า</th>
                    <th className="text-right">จำนวน</th>
                    <th className="text-right">ราคา</th>
                    <th className="text-right">รวม</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <tr key={item.product.id}>
                      <td className="font-medium">{item.product.name}</td>
                      <td className="text-right">{item.quantity}</td>
                      <td className="text-right">฿{item.product.price.toLocaleString()}</td>
                      <td className="text-right font-medium">
                        ฿{(item.product.price * item.quantity).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cost Summary */}
          <div className="py-6 space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>ค่าจัดส่ง</span>
              <span>฿{shipping.toLocaleString()}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>ส่วนลด</span>
                <span>-฿{discount.toLocaleString()}</span>
              </div>
            )}
            <div className="border-t pt-3 flex justify-between items-center">
              <span className="font-bold text-gray-900">รวมทั้งสิ้น</span>
              <span className="text-2xl font-bold text-orange-500">
                ฿{total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="card p-6 bg-blue-50 border-blue-200 mb-8">
          <h3 className="font-bold text-gray-900 mb-3">ขั้นตอนต่อไป</h3>
          <ol className="space-y-2 text-sm text-gray-700">
            <li className="flex gap-3">
              <span className="font-bold text-blue-600 flex-shrink-0">1.</span>
              <span>คุณจะได้รับอีเมลยืนยันคำสั่งซื้อในไม่ช้า</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-600 flex-shrink-0">2.</span>
              <span>สินค้าจะถูกเตรียมส่งและคุณจะได้รับหมายเลขการติดตาม</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-600 flex-shrink-0">3.</span>
              <span>สินค้าจะถึงประมาณ 2-5 วันทำการ</span>
            </li>
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            className="btn btn-primary flex-1 h-12"
            onClick={() => navigate('/orders')}
          >
            ดูสถานะคำสั่งซื้อ
          </button>
          <button
            className="btn btn-outline flex-1 h-12"
            onClick={() => navigate('/products')}
          >
            เลือกสินค้าเพิ่มเติม
          </button>
        </div>

        {/* Support Info */}
        <div className="card p-6 mt-8 bg-gray-50">
          <h3 className="font-bold text-gray-900 mb-2">ติดต่อเรา</h3>
          <p className="text-sm text-gray-600">
            หากมีคำถามเกี่ยวกับคำสั่งซื้อของคุณ โปรดติดต่อทีมสนับสนุนของเรา
            <br />
            <a href="mailto:support@example.com" className="text-orange-500 hover:text-orange-600">
              support@example.com
            </a>
            {' '}หรือ{' '}
            <a href="tel:+66123456789" className="text-orange-500 hover:text-orange-600">
              +66 1 2345 6789
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
