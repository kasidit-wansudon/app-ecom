import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockOrders } from '@/data/mockData';
import { Package, Truck, CheckCircle, XCircle } from 'lucide-react';

const statusConfig = {
  pending: {
    label: 'รอดำเนินการ',
    icon: Package,
    badgeClass: 'badge bg-yellow-100 text-yellow-800',
  },
  processing: {
    label: 'กำลังจัดเตรียม',
    icon: Package,
    badgeClass: 'badge bg-blue-100 text-blue-800',
  },
  shipped: {
    label: 'จัดส่งแล้ว',
    icon: Truck,
    badgeClass: 'badge bg-orange-100 text-orange-800',
  },
  delivered: {
    label: 'ส่งถึงแล้ว',
    icon: CheckCircle,
    badgeClass: 'badge bg-green-100 text-green-800',
  },
  cancelled: {
    label: 'ยกเลิก',
    icon: XCircle,
    badgeClass: 'badge bg-red-100 text-red-800',
  },
};

export default function OrdersPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'shipped' | 'delivered' | 'cancelled'>('all');

  const filteredOrders = activeTab === 'all'
    ? mockOrders
    : mockOrders.filter(order => {
        if (activeTab === 'pending') {
          return order.status === 'pending' || order.status === 'processing';
        }
        return order.status === activeTab;
      });

  const tabs = [
    { id: 'all', label: 'ทั้งหมด', count: mockOrders.length },
    {
      id: 'pending' as const,
      label: 'รอจัดส่ง',
      count: mockOrders.filter(o => o.status === 'pending' || o.status === 'processing').length,
    },
    {
      id: 'shipped' as const,
      label: 'จัดส่งแล้ว',
      count: mockOrders.filter(o => o.status === 'shipped').length,
    },
    {
      id: 'delivered' as const,
      label: 'ส่งถึงแล้ว',
      count: mockOrders.filter(o => o.status === 'delivered').length,
    },
    {
      id: 'cancelled' as const,
      label: 'ยกเลิก',
      count: mockOrders.filter(o => o.status === 'cancelled').length,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
          คำสั่งซื้อของฉัน
        </h1>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 sm:gap-4 mb-6 border-b">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 sm:px-4 py-3 font-medium border-b-2 transition-colors relative -mb-px ${
                activeTab === tab.id
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
              <span className="ml-2 text-sm text-gray-500">({tab.count})</span>
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="card p-12 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              {activeTab === 'all'
                ? 'ยังไม่มีคำสั่งซื้อ'
                : 'ไม่มีคำสั่งซื้อในหมวดหมู่นี้'}
            </h2>
            <p className="text-gray-600 mb-6">
              {activeTab === 'all'
                ? 'เริ่มช้อปปิ้งเพื่อสร้างคำสั่งซื้อแรกของคุณ'
                : 'ลองตรวจสอบแท็บอื่นเพื่อดูคำสั่งซื้อของคุณ'}
            </p>
            {activeTab === 'all' && (
              <button
                className="btn btn-primary"
                onClick={() => navigate('/products')}
              >
                ไปเลือกสินค้า
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map(order => {
              const config = statusConfig[order.status];
              const StatusIcon = config.icon;

              return (
                <div
                  key={order.id}
                  className="card p-4 sm:p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    {/* Left - Order Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-gray-900">{order.id}</h3>
                        <span className={config.badgeClass}>
                          {config.label}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mb-3">
                        วันที่สั่งซื้อ: {new Date(order.date).toLocaleDateString('th-TH')}
                      </p>

                      {/* Items Summary */}
                      <div className="space-y-1 mb-3">
                        {order.items.slice(0, 2).map((item, idx) => (
                          <p key={idx} className="text-sm text-gray-600">
                            {item.product.name} x{item.quantity}
                          </p>
                        ))}
                        {order.items.length > 2 && (
                          <p className="text-sm text-gray-600">
                            +{order.items.length - 2} รายการเพิ่มเติม
                          </p>
                        )}
                      </div>

                      {/* Shipping Address */}
                      <p className="text-xs text-gray-500">
                        ส่งถึง: {order.shippingAddress}
                      </p>
                    </div>

                    {/* Right - Price & Actions */}
                    <div className="flex flex-col items-end gap-3">
                      <div className="text-right">
                        <p className="text-xs text-gray-600">ยอดรวม</p>
                        <p className="text-2xl font-bold text-orange-500">
                          ฿{order.total.toLocaleString()}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => navigate(`/orders/${order.id}`)}
                        >
                          ดูรายละเอียด
                        </button>

                        {order.status === 'shipped' || order.status === 'delivered' ? (
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => {
                              // Handle tracking
                            }}
                          >
                            ติดตาม
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {/* Status Timeline */}
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <StatusIcon className="w-4 h-4 text-gray-600" />
                      <p className="text-sm text-gray-600">
                        {order.status === 'pending' && 'รอการยืนยันออกจากคลัง'}
                        {order.status === 'processing' && 'กำลังเตรียมสินค้า'}
                        {order.status === 'shipped' && 'อยู่ระหว่างการจัดส่ง'}
                        {order.status === 'delivered' && 'ส่งถึงแล้ว'}
                        {order.status === 'cancelled' && 'คำสั่งซื้อถูกยกเลิก'}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
