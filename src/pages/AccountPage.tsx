import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { ShoppingBag, DollarSign, Zap } from 'lucide-react';
import PageBanner from '@/components/ui/PageBanner';

const personalInfoSchema = z.object({
  name: z.string().min(2, 'กรุณากรอกชื่อ'),
  email: z.string().email('อีเมลไม่ถูกต้อง'),
  phone: z.string().min(9, 'กรุณากรอกเบอร์โทร'),
  address: z.string().min(5, 'กรุณากรอกที่อยู่'),
});

const securitySchema = z.object({
  currentPassword: z.string().min(6, 'กรุณากรอกรหัสผ่านปัจจุบัน'),
  newPassword: z.string().min(6, 'รหัสผ่านต้องมีอย่างน้อย 6 ตัว'),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'รหัสผ่านไม่ตรงกัน',
  path: ['confirmPassword'],
});

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
type SecurityFormData = z.infer<typeof securitySchema>;

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('personal');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);

  // Personal Info Form
  const {
    register: registerPersonal,
    handleSubmit: handlePersonalSubmit,
    formState: { errors: personalErrors },
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      name: 'สมหญิง เจริยะ',
      email: 'somying@example.com',
      phone: '081-234-5678',
      address: '123 ถ.สุขุมวิท แขวงคลองเตย กรุงเทพฯ 10110',
    },
  });

  // Security Form
  const {
    register: registerSecurity,
    handleSubmit: handleSecuritySubmit,
    formState: { errors: securityErrors },
    reset: resetSecurity,
  } = useForm<SecurityFormData>({
    resolver: zodResolver(securitySchema),
  });

  const onPersonalSubmit = async (_data: PersonalInfoFormData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.success('บันทึกข้อมูลส่วนตัวสำเร็จ!');
    } catch (error) {
      toast.error('เกิดข้อผิดพลาด');
    }
  };

  const onSecuritySubmit = async (_data: SecurityFormData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.success('เปลี่ยนรหัสผ่านสำเร็จ!');
      resetSecurity();
    } catch (error) {
      toast.error('เกิดข้อผิดพลาด');
    }
  };

  return (
    <>
      <PageBanner
        title="บัญชี"
        titleHighlight="ของฉัน"
        subtitle="จัดการข้อมูลส่วนตัว ความปลอดภัย และการแจ้งเตือน"
        size="sm"
      />
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="card p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">คำสั่งซื้อทั้งหมด</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">ยอดใช้จ่าย</p>
                <p className="text-2xl font-bold text-gray-900">฿124,560</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">จุดสะสม</p>
                <p className="text-2xl font-bold text-gray-900">1,245</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs border-b mb-6">
          {[
            { key: 'personal', label: 'ข้อมูลส่วนตัว' },
            { key: 'security', label: 'ความปลอดภัย' },
            { key: 'notifications', label: 'การแจ้งเตือน' },
          ].map(tab => (
            <button
              key={tab.key}
              className={`tab-button ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Personal Information */}
        {activeTab === 'personal' && (
          <div className="card p-6 sm:p-8">
            <form onSubmit={handlePersonalSubmit(onPersonalSubmit)} className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-6">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop"
                  alt="Avatar"
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div>
                  <button type="button" className="btn btn-outline mb-2">
                    เปลี่ยนรูป
                  </button>
                  <p className="text-sm text-gray-600">
                    ไฟล์สูงสุด 5MB (JPG, PNG)
                  </p>
                </div>
              </div>

              <hr className="divider" />

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="form-label">ชื่อ-นามสกุล</label>
                  <input
                    id="name"
                    {...registerPersonal('name')}
                    className={`form-input ${personalErrors.name ? 'border-red-500' : ''}`}
                  />
                  {personalErrors.name && (
                    <p className="form-error">{personalErrors.name.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="form-label">อีเมล</label>
                    <input
                      id="email"
                      type="email"
                      {...registerPersonal('email')}
                      className={`form-input ${personalErrors.email ? 'border-red-500' : ''}`}
                    />
                    {personalErrors.email && (
                      <p className="form-error">{personalErrors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="phone" className="form-label">เบอร์โทร</label>
                    <input
                      id="phone"
                      {...registerPersonal('phone')}
                      className={`form-input ${personalErrors.phone ? 'border-red-500' : ''}`}
                    />
                    {personalErrors.phone && (
                      <p className="form-error">{personalErrors.phone.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="address" className="form-label">ที่อยู่</label>
                  <input
                    id="address"
                    {...registerPersonal('address')}
                    className={`form-input ${personalErrors.address ? 'border-red-500' : ''}`}
                  />
                  {personalErrors.address && (
                    <p className="form-error">{personalErrors.address.message}</p>
                  )}
                </div>
              </div>

              <button type="submit" className="btn btn-primary">
                บันทึกการเปลี่ยนแปลง
              </button>
            </form>
          </div>
        )}

        {/* Tab 2: Security */}
        {activeTab === 'security' && (
          <div className="card p-6 sm:p-8">
            <form onSubmit={handleSecuritySubmit(onSecuritySubmit)} className="space-y-6 max-w-md">
              <div>
                <label htmlFor="currentPassword" className="form-label">รหัสผ่านปัจจุบัน</label>
                <input
                  id="currentPassword"
                  type="password"
                  {...registerSecurity('currentPassword')}
                  className={`form-input ${securityErrors.currentPassword ? 'border-red-500' : ''}`}
                />
                {securityErrors.currentPassword && (
                  <p className="form-error">{securityErrors.currentPassword.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="newPassword" className="form-label">รหัสผ่านใหม่</label>
                <input
                  id="newPassword"
                  type="password"
                  {...registerSecurity('newPassword')}
                  className={`form-input ${securityErrors.newPassword ? 'border-red-500' : ''}`}
                />
                {securityErrors.newPassword && (
                  <p className="form-error">{securityErrors.newPassword.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="form-label">ยืนยันรหัสผ่านใหม่</label>
                <input
                  id="confirmPassword"
                  type="password"
                  {...registerSecurity('confirmPassword')}
                  className={`form-input ${securityErrors.confirmPassword ? 'border-red-500' : ''}`}
                />
                {securityErrors.confirmPassword && (
                  <p className="form-error">{securityErrors.confirmPassword.message}</p>
                )}
              </div>

              <button type="submit" className="btn btn-primary">
                เปลี่ยนรหัสผ่าน
              </button>
            </form>
          </div>
        )}

        {/* Tab 3: Notifications */}
        {activeTab === 'notifications' && (
          <div className="card p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="font-bold text-gray-900 mb-4">การแจ้งเตือน</h3>

              {/* Email Notifications */}
              <div className="flex items-center justify-between p-4 border rounded-lg mb-3">
                <div>
                  <p className="font-medium text-gray-900">การแจ้งเตือนทางอีเมล</p>
                  <p className="text-sm text-gray-600">
                    ข้อมูลเกี่ยวกับคำสั่งซื้อและโปรโมชั่น
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={e => setEmailNotifications(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>

              {/* SMS Notifications */}
              <div className="flex items-center justify-between p-4 border rounded-lg mb-3">
                <div>
                  <p className="font-medium text-gray-900">การแจ้งเตือนทาง SMS</p>
                  <p className="text-sm text-gray-600">
                    ข้อความสถานะการจัดส่ง
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={smsNotifications}
                    onChange={e => setSmsNotifications(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>

              {/* Push Notifications */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">การแจ้งเตือน Push</p>
                  <p className="text-sm text-gray-600">
                    ข้อมูลการไลฟ์และข้อมูลคำสั่งซื้อ
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pushNotifications}
                    onChange={e => setPushNotifications(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>
            </div>

            <hr className="divider" />

            <button
              className="btn btn-primary"
              onClick={() => toast.success('บันทึกการตั้งค่าการแจ้งเตือนสำเร็จ!')}
            >
              บันทึกการตั้งค่า
            </button>
          </div>
        )}

        {/* Danger Zone */}
        <div className="card p-6 border-red-200 bg-red-50 mt-8">
          <h3 className="font-bold text-red-900 mb-2">เขตอันตราย</h3>
          <p className="text-sm text-red-800 mb-4">
            การดำเนินการด้านล่างไม่สามารถเลิกทำได้ โปรดทำอย่างระมัดระวัง
          </p>
          <button
            className="btn btn-danger"
            onClick={() =>
              toast.promise(
                new Promise(resolve => setTimeout(() => resolve('delete'), 1000)),
                {
                  success: 'ลบบัญชีสำเร็จแล้ว',
                  error: 'เกิดข้อผิดพลาด',
                  loading: 'กำลังลบบัญชี...',
                }
              )
            }
          >
            ลบบัญชี
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
