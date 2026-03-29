import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useApp } from '@/context/AppContext';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const checkoutSchema = z.object({
  fullName: z.string().min(2, 'กรุณากรอกชื่อ'),
  phone: z.string().min(9, 'กรุณากรอกเบอร์โทรศัพท์'),
  email: z.string().email('อีเมลไม่ถูกต้อง'),
  buildingNumber: z.string().min(1, 'กรุณากรอกหมายเลขอาคาร'),
  soi: z.string().optional(),
  road: z.string().min(1, 'กรุณากรอกถนน'),
  subdistrict: z.string().min(1, 'กรุณากรอกตำบล'),
  district: z.string().min(1, 'กรุณากรอกอำเภอ'),
  province: z.string().min(1, 'กรุณากรอกจังหวัด'),
  zipcode: z.string().min(5, 'กรุณากรอกรหัสไปรษณีย์'),
  paymentMethod: z.enum(['credit-card', 'promptpay', 'cod']),
  cardNumber: z.string().optional(),
  cardName: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCVC: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('credit-card');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: 'credit-card',
    },
  });

  const provinces = [
    'กรุงเทพมหานคร',
    'นนทบุรี',
    'ปทุมธานี',
    'สมุทรปราการ',
    'สมุทรสาคร',
    'จังหวัดอื่นๆ',
  ];

  const shipping = 50;
  const discount = cartTotal > 5000 ? cartTotal * 0.05 : 0;
  const total = cartTotal + shipping - discount;

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const orderId = `ORD-${Date.now()}`;

      clearCart();
      navigate(`/order-success`, {
        state: {
          orderId,
          items: cartItems,
          total,
          shippingAddress: `${data.buildingNumber} ${data.soi || ''} ถ.${data.road} ต.${data.subdistrict} อ.${data.district} ${data.province} ${data.zipcode}`,
        },
      });

      toast.success('สั่งซื้อสำเร็จ!');
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการสั่งซื้อ');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center py-12">
        <div className="card text-center p-8 max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">ตะกร้าว่างเปล่า</h1>
          <p className="text-gray-600 mb-6">
            กรุณาเพิ่มสินค้าลงในตะกร้าก่อนชำระเงิน
          </p>
          <button
            className="btn btn-primary w-full"
            onClick={() => navigate('/products')}
          >
            กลับไปเลือกสินค้า
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
          ชำระเงิน
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form - Left */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <div className="card p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">ข้อมูลลูกค้า</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="fullName" className="form-label">ชื่อ-นามสกุล *</label>
                    <input
                      id="fullName"
                      placeholder="ชื่อ-นามสกุล"
                      {...register('fullName')}
                      className={`form-input ${errors.fullName ? 'border-red-500' : ''}`}
                    />
                    {errors.fullName && (
                      <p className="form-error">{errors.fullName.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="phone" className="form-label">เบอร์โทรศัพท์ *</label>
                    <input
                      id="phone"
                      placeholder="08X-XXXX-XXXX"
                      {...register('phone')}
                      className={`form-input ${errors.phone ? 'border-red-500' : ''}`}
                    />
                    {errors.phone && (
                      <p className="form-error">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="form-label">อีเมล *</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    {...register('email')}
                    className={`form-input ${errors.email ? 'border-red-500' : ''}`}
                  />
                  {errors.email && (
                    <p className="form-error">{errors.email.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="card p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">ที่อยู่จัดส่ง</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="buildingNumber" className="form-label">หมายเลขอาคาร/บ้าน *</label>
                  <input
                    id="buildingNumber"
                    placeholder="123"
                    {...register('buildingNumber')}
                    className={`form-input ${errors.buildingNumber ? 'border-red-500' : ''}`}
                  />
                  {errors.buildingNumber && (
                    <p className="form-error">{errors.buildingNumber.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="soi" className="form-label">ซอย</label>
                    <input
                      id="soi"
                      placeholder="ซอย (ไม่บังคับ)"
                      {...register('soi')}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label htmlFor="road" className="form-label">ถนน *</label>
                    <input
                      id="road"
                      placeholder="ถนน"
                      {...register('road')}
                      className={`form-input ${errors.road ? 'border-red-500' : ''}`}
                    />
                    {errors.road && (
                      <p className="form-error">{errors.road.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="subdistrict" className="form-label">ตำบล *</label>
                    <input
                      id="subdistrict"
                      placeholder="ตำบล"
                      {...register('subdistrict')}
                      className={`form-input ${errors.subdistrict ? 'border-red-500' : ''}`}
                    />
                    {errors.subdistrict && (
                      <p className="form-error">{errors.subdistrict.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="district" className="form-label">อำเภอ *</label>
                    <input
                      id="district"
                      placeholder="อำเภอ"
                      {...register('district')}
                      className={`form-input ${errors.district ? 'border-red-500' : ''}`}
                    />
                    {errors.district && (
                      <p className="form-error">{errors.district.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="province" className="form-label">จังหวัด *</label>
                    <select
                      id="province"
                      {...register('province')}
                      className={`form-select ${errors.province ? 'border-red-500' : ''}`}
                    >
                      <option value="">เลือกจังหวัด</option>
                      {provinces.map(prov => (
                        <option key={prov} value={prov}>
                          {prov}
                        </option>
                      ))}
                    </select>
                    {errors.province && (
                      <p className="form-error">{errors.province.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="zipcode" className="form-label">รหัสไปรษณีย์ *</label>
                    <input
                      id="zipcode"
                      placeholder="10110"
                      {...register('zipcode')}
                      className={`form-input ${errors.zipcode ? 'border-red-500' : ''}`}
                    />
                    {errors.zipcode && (
                      <p className="form-error">{errors.zipcode.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="card p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">วิธีชำระเงิน</h2>
              <div className="space-y-3">
                {/* Credit Card */}
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <input
                    type="radio"
                    id="credit-card"
                    name="paymentMethod"
                    value="credit-card"
                    checked={selectedPayment === 'credit-card'}
                    onChange={() => setSelectedPayment('credit-card')}
                    className="form-radio"
                  />
                  <label htmlFor="credit-card" className="form-label cursor-pointer flex-1">
                    บัตรเครดิต / เดบิต
                  </label>
                </div>

                {/* Card Details */}
                {selectedPayment === 'credit-card' && (
                  <div className="space-y-4 pl-9 pt-2">
                    <div>
                      <label htmlFor="cardNumber" className="form-label">หมายเลขบัตร</label>
                      <input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        {...register('cardNumber')}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label htmlFor="cardName" className="form-label">ชื่อบนบัตร</label>
                      <input
                        id="cardName"
                        placeholder="FIRSTNAME LASTNAME"
                        {...register('cardName')}
                        className="form-input"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="cardExpiry" className="form-label">วันหมดอายุ</label>
                        <input
                          id="cardExpiry"
                          placeholder="MM/YY"
                          {...register('cardExpiry')}
                          className="form-input"
                        />
                      </div>
                      <div>
                        <label htmlFor="cardCVC" className="form-label">CVC</label>
                        <input
                          id="cardCVC"
                          placeholder="123"
                          {...register('cardCVC')}
                          className="form-input"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* PromptPay */}
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <input
                    type="radio"
                    id="promptpay"
                    name="paymentMethod"
                    value="promptpay"
                    checked={selectedPayment === 'promptpay'}
                    onChange={() => setSelectedPayment('promptpay')}
                    className="form-radio"
                  />
                  <label htmlFor="promptpay" className="form-label cursor-pointer flex-1">
                    PromptPay
                  </label>
                </div>

                {/* COD */}
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <input
                    type="radio"
                    id="cod"
                    name="paymentMethod"
                    value="cod"
                    checked={selectedPayment === 'cod'}
                    onChange={() => setSelectedPayment('cod')}
                    className="form-radio"
                  />
                  <label htmlFor="cod" className="form-label cursor-pointer flex-1">
                    เก็บเงินปลายทาง
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary - Right */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-20 space-y-4">
              <h2 className="text-lg font-bold text-gray-900">สรุปคำสั่งซื้อ</h2>

              {/* Items List */}
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {cartItems.map(item => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-gray-600 flex-1 truncate">
                      {item.product.name} x{item.quantity}
                    </span>
                    <span className="font-medium text-gray-900 flex-shrink-0 ml-2">
                      ฿{(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <hr className="divider" />

              {/* Cost Breakdown */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>ราคาสินค้า</span>
                  <span>฿{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>ค่าจัดส่ง</span>
                  <span>฿{shipping.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>ส่วนลด (5%)</span>
                    <span>-฿{discount.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <hr className="divider" />

              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900">รวมทั้งสิ้น</span>
                <span className="text-2xl font-bold text-orange-500">
                  ฿{total.toLocaleString()}
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary w-full h-12 text-base"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'กำลังดำเนินการ...' : 'ยืนยันการสั่งซื้อ'}
              </button>

              {/* Info Box */}
              <div className="p-3 bg-blue-50 rounded-lg flex gap-2 text-xs text-blue-800">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p>
                  ข้อมูลของคุณจะได้รับการป้องกันและเข้ารหัสลับแบบ SSL
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
