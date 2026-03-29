import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockOrders } from '@/data/mockData';
import { Package, Truck, CheckCircle, XCircle, ClipboardList } from 'lucide-react';
import PageBanner from '@/components/ui/PageBanner';
import EmptyState from '@/components/ui/EmptyState';

const statusConfig = {
  pending: { label: 'รอดำเนินการ', icon: Package, badgeClass: 'badge bg-yellow-100 text-yellow-800' },
  processing: { label: 'กำลังจัดเตรียม', icon: Package, badgeClass: 'badge bg-blue-100 text-blue-800' },
  shipped: { label: 'จัดส่งแล้ว', icon: Truck, badgeClass: 'badge bg-orange-100 text-orange-800' },
  delivered: { label: 'ส่งถึงแล้ว', icon: CheckCircle, badgeClass: 'badge bg-green-100 text-green-800' },
  cancelled: { label: 'ยกเลิก', icon: XCircle, badgeClass: 'badge bg-red-100 text-red-800' },
};

const statusMessage = {
  pending: 'รอการยืนยันออกจากคลัง',
  processing: 'กำลังเตรียมสินค้า',
  shipped: 'อยู่ระหว่างการจัดส่ง',
  delivered: 'ส่งถึงแล้ว',
  cancelled: 'คำสั่งซื้อถูกยกเลิก',
};

export default function OrdersPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'shipped' | 'delivered' | 'cancelled'>('all');

  const filteredOrders = activeTab === 'all'
    ? mockOrders
    : mockOrders.filter(order => {
        if (activeTab === 'pending') return order.status === 'pending' || order.status === 'processing';
        return order.status === activeTab;
      });

  const tabs = [
    { id: 'all', label: 'ทั้งหมด', count: mockOrders.length },
    { id: 'pending' as const, label: 'รอจัดส่ง', count: mockOrders.filter(o => o.status === 'pending' || o.status === 'processing').length },
    { id: 'shipped' as const, label: 'จัดส่งแล้ว', count: mockOrders.filter(o => o.status === 'shipped').length },
    { id: 'delivered' as const, label: 'ส่งถึงแล้ว', count: mockOrders.filter(o => o.status === 'delivered').length },
    { id: 'cancelled' as const, label: 'ยกเลิก', count: mockOrders.filter(o => o.status === 'cancelled').length },
  ];

  return (
    <>
      <PageBanner
        title="คำสั่งซื้อ"
        titleHighlight="ของฉัน"
        subtitle="ติดตามสถานะการสั่งซื้อและประวัติทั้งหมด"
        size="sm"
      />

      <div className="bg-gray-50 min-h-screen py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
            <div className="flex flex-wrap">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex-1 min-w-fit px-4 py-4 text-sm font-medium border-b-2 transition-all ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-600 bg-orange-50'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full font-bold ${
                      activeTab === tab.id ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <EmptyState
              icon={ClipboardList}
              title={activeTab === 'all' ? 'ยังไม่มีคำสั่งซื้อ' : 'ไม่มีคำสั่งซื้อในหมวดนี้'}
              description={activeTab === 'all' ? 'เริ่มช้อปปิ้งเพื่อสร้างคำสั่งซื้อแรกของคุณ' : 'ลองตรวจสอบแท็บอื่น'}
              actionLabel={activeTab === 'all' ? 'ไปเลือกสินค้า' : undefined}
              onAction={activeTab === 'all' ? () => navigate('/products') : undefined}
            />
          ) : (
            <div className="space-y-4">
              {filteredOrders.map(order => {
                const config = statusConfig[order.status];
                const StatusIcon = config.icon;

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-5 sm:p-6"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      {/* Left */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="font-bold text-gray-900">{order.id}</h3>
                          <span className={config.badgeClass}>{config.label}</span>
                        </div>
                        <p className="text-sm text-gray-500 mb-3">
                          วันที่สั่ง: {new Date(order.date).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                        <div className="space-y-1 mb-3">
                          {order.items.slice(0, 2).map((item, idx) => (
                            <p key={idx} className="text-sm text-gray-700">
                              • {item.product.name}{' '}
                              <span className="text-gray-500">x{item.quantity}</span>
                            </p>
                          ))}
                          {order.items.length > 2 && (
                            <p className="text-sm text-orange-500 font-medium">
                              + อีก {order.items.length - 2} รายการ
                            </p>
                          )}
                        </div>
                        <p className="text-xs text-gray-400">จัดส่งไปยัง: {order.shippingAddress}</p>
                      </div>

                      {/* Right */}
                      <div className="flex flex-col items-end gap-3 flex-shrink-0">
                        <div className="text-right">
                          <p className="text-xs text-gray-500 mb-1">ยอดรวม</p>
                          <p className="text-2xl font-bold text-orange-500">
                            ฿{order.total.toLocaleString('th-TH')}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => navigate(`/orders/${order.id}`)}
                          >
                            รายละเอียด
                          </button>
                          {(order.status === 'shipped' || order.status === 'delivered') && (
                            <button className="btn btn-primary btn-sm">
                              ติดตาม
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Status bar */}
                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2">
                      <StatusIcon className="w-4 h-4 text-gray-500" />
                      <p className="text-sm text-gray-500">{statusMessage[order.status]}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
