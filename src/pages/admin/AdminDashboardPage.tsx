import { useState } from 'react';
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, ShoppingCart, Users, AlertCircle } from 'lucide-react';
import { mockChartData, mockOrders } from '@/data/mockData';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444', '#6366f1', '#14b8a6'];

export default function AdminDashboardPage() {
  const [_dateRange] = useState('thisMonth');

  const stats = [
    { label: 'ยอดขายวันนี้', value: '฿45,231', change: '+20.1%', trend: 'up' as const, icon: TrendingUp },
    { label: 'คำสั่งซื้อใหม่', value: '48', change: '+12%', trend: 'up' as const, icon: ShoppingCart },
    { label: 'สมาชิกใหม่', value: '23', change: '-4%', trend: 'down' as const, icon: Users },
    { label: 'สินค้าใกล้หมด', value: '7', change: '—', trend: 'up' as const, icon: AlertCircle },
  ];

  const statusBadgeClass: Record<string, string> = {
    pending: 'badge badge-warning',
    processing: 'badge badge-primary',
    shipped: 'badge badge-primary',
    delivered: 'badge badge-success',
    cancelled: 'badge badge-danger',
  };

  const statusLabel: Record<string, string> = {
    pending: 'รอดำเนินการ',
    processing: 'จัดเตรียม',
    shipped: 'จัดส่ง',
    delivered: 'สำเร็จ',
    cancelled: 'ยกเลิก',
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">แดชบอร์ด</h1>
        <p className="text-gray-500 mt-2">ยินดีต้อนรับเข้าสู่แพนเนลแอดมิน</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          const isPositive = stat.trend === 'up';
          return (
            <div key={idx} className="card">
              <div className="card-header flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-medium text-gray-500">{stat.label}</h3>
                <Icon className={`h-4 w-4 ${isPositive ? 'text-green-500' : 'text-red-500'}`} />
              </div>
              <div className="card-content">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className={`text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Area Chart */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">ยอดขายรายเดือน</h3>
        </div>
        <div className="card-content">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={mockChartData.monthlySales}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `฿${(value as number).toLocaleString('th-TH')}`} />
              <Legend />
              <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRevenue)" name="ยอดขาย" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">สัดส่วนยอดขายตามหมวดหมู่</h3>
        </div>
        <div className="card-content">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={mockChartData.categorySales}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {mockChartData.categorySales.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">คำสั่งซื้อล่าสุด</h3>
        </div>
        <div className="card-content overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>เลขที่</th>
                <th>ลูกค้า</th>
                <th className="text-right">ยอด</th>
                <th>สถานะ</th>
                <th>วันที่</th>
              </tr>
            </thead>
            <tbody>
              {mockOrders.slice(0, 5).map((order) => (
                <tr key={order.id}>
                  <td className="font-medium">{order.id}</td>
                  <td>{order.shippingAddress.split(' ')[0]}</td>
                  <td className="text-right">฿{order.total.toLocaleString('th-TH')}</td>
                  <td>
                    <span className={statusBadgeClass[order.status] || 'badge badge-gray'}>
                      {statusLabel[order.status] || 'ไม่ทราบ'}
                    </span>
                  </td>
                  <td>{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
