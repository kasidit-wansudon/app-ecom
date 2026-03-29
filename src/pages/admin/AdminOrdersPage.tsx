import { useState } from 'react';
import StyledSelect from '@/components/ui/StyledSelect';
import { mockOrders } from '@/data/mockData';
import type { Order } from '@/types';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<Order['status'] | null>(null);

  const filteredOrders = orders.filter((order) => {
    if (statusFilter === 'all') return true;
    return order.status === statusFilter;
  });

  const statusOptions: Record<Order['status'], { label: string; badgeClass: string }> = {
    pending: { label: 'รอ', badgeClass: 'badge badge-warning' },
    processing: { label: 'จัดเตรียม', badgeClass: 'badge badge-primary' },
    shipped: { label: 'จัดส่ง', badgeClass: 'badge badge-primary' },
    delivered: { label: 'สำเร็จ', badgeClass: 'badge badge-success' },
    cancelled: { label: 'ยกเลิก', badgeClass: 'badge badge-danger' },
  };

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setSelectedStatus(order.status);
    setIsSheetOpen(true);
  };

  const handleStatusUpdate = () => {
    if (selectedOrder && selectedStatus) {
      setOrders((prev) =>
        prev.map((o) => (o.id === selectedOrder.id ? { ...o, status: selectedStatus } : o))
      );
      setSelectedOrder({ ...selectedOrder, status: selectedStatus });
      alert('บันทึกสถานะเรียบร้อย');
    }
  };

  const getStatusCount = (status: Order['status']) => orders.filter((o) => o.status === status).length;

  const tabs = [
    { value: 'all', label: `ทั้งหมด (${orders.length})` },
    { value: 'pending', label: `รอ (${getStatusCount('pending')})` },
    { value: 'processing', label: `จัดเตรียม (${getStatusCount('processing')})` },
    { value: 'shipped', label: `จัดส่ง (${getStatusCount('shipped')})` },
    { value: 'delivered', label: `สำเร็จ (${getStatusCount('delivered')})` },
  ];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">จัดการคำสั่งซื้อ</h1>
        <p className="text-gray-500 mt-2">คำสั่งซื้อทั้งหมด: {filteredOrders.length}</p>
      </div>

      {/* Tabs */}
      <div className="tabs flex gap-1 bg-gray-100 p-1 rounded-lg overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`tab-button whitespace-nowrap flex-1 ${statusFilter === tab.value ? 'active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="card">
        <div className="card-content overflow-x-auto pt-6">
          <table className="table w-full">
            <thead>
              <tr>
                <th>เลขที่</th>
                <th>วันที่</th>
                <th>ลูกค้า</th>
                <th className="text-right">จำนวน</th>
                <th className="text-right">ยอด</th>
                <th>ชำระ</th>
                <th>จัดส่ง</th>
                <th>สถานะ</th>
                <th className="text-right">ดำเนินการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
                const status = statusOptions[order.status] || { label: 'ไม่ทราบ', badgeClass: 'badge badge-gray' };

                return (
                  <tr key={order.id}>
                    <td className="font-medium">{order.id}</td>
                    <td>{order.date}</td>
                    <td>{order.shippingAddress.split(' ')[0]}</td>
                    <td className="text-right">{itemCount}</td>
                    <td className="text-right font-semibold">฿{order.total.toLocaleString('th-TH')}</td>
                    <td><span className="badge badge-success">ชำระแล้ว</span></td>
                    <td><span className="badge badge-gray">ยังไม่จัดส่ง</span></td>
                    <td><span className={status.badgeClass}>{status.label}</span></td>
                    <td className="text-right">
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => openOrderDetails(order)}
                      >
                        ดูรายละเอียด
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredOrders.length === 0 && (
            <div className="text-center py-8 text-gray-500">ไม่มีคำสั่งซื้อในหมวดนี้</div>
          )}
        </div>
      </div>

      {/* Order Details Side Panel */}
      {isSheetOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/40"
            onClick={() => setIsSheetOpen(false)}
          />
          {/* Panel */}
          <div className="fixed top-0 right-0 z-50 h-full w-full sm:w-96 bg-white shadow-xl flex flex-col overflow-y-auto transition-transform">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-semibold">รายละเอียดคำสั่งซื้อ</h2>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setIsSheetOpen(false)}
              >
                ✕
              </button>
            </div>

            {selectedOrder && (
              <div className="space-y-6 p-6">
                <div className="space-y-2">
                  <h3 className="font-semibold">เลขที่: {selectedOrder.id}</h3>
                  <p className="text-sm text-gray-500">วันที่: {selectedOrder.date}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">สินค้า</h3>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-start pb-2 border-b text-sm">
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-gray-500">จำนวน: {item.quantity}</p>
                        </div>
                        <p className="font-semibold">
                          ฿{(item.product.price * item.quantity).toLocaleString('th-TH')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-100 p-3 rounded-lg space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm">รวม:</span>
                    <span className="font-semibold">฿{selectedOrder.total.toLocaleString('th-TH')}</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">ที่อยู่จัดส่ง</h3>
                  <p className="text-sm text-gray-500">{selectedOrder.shippingAddress}</p>
                </div>

                <div className="space-y-3">
                  <label className="form-label">อัปเดตสถานะ</label>
                  <StyledSelect
                    value={selectedStatus || ''}
                    onChange={(e) => setSelectedStatus(e.target.value as Order['status'])}
                  >
                    <option value="pending">รอดำเนินการ</option>
                    <option value="processing">จัดเตรียม</option>
                    <option value="shipped">จัดส่ง</option>
                    <option value="delivered">สำเร็จ</option>
                    <option value="cancelled">ยกเลิก</option>
                  </StyledSelect>
                  <button onClick={handleStatusUpdate} className="btn btn-primary w-full">
                    บันทึกสถานะ
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
