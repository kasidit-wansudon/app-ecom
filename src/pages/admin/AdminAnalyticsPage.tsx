import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { mockChartData } from '@/data/mockData';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444', '#6366f1', '#14b8a6'];

const generateDailySalesData = () => {
  const data = [];
  for (let i = 30; i >= 1; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString('th-TH', { month: 'short', day: 'numeric' }),
      revenue: Math.floor(Math.random() * 50000) + 15000,
    });
  }
  return data;
};

const generateWeeklyData = () => {
  const days = ['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา'];
  return days.map((day) => ({
    day,
    current: Math.floor(Math.random() * 30000) + 10000,
    previous: Math.floor(Math.random() * 30000) + 10000,
  }));
};

const generateCategoryRadarData = () => [
  { category: 'มือถือ', sales: 85 },
  { category: 'คอมพิวเตอร์', sales: 72 },
  { category: 'หูฟัง', sales: 68 },
  { category: 'นาฬิกา', sales: 78 },
  { category: 'กล้อง', sales: 65 },
  { category: 'เกม', sales: 75 },
  { category: 'แฟชั่น', sales: 80 },
  { category: 'บ้าน', sales: 70 },
];

export default function AdminAnalyticsPage() {
  const dailySalesData = generateDailySalesData();
  const weeklyData = generateWeeklyData();
  const categoryRadarData = generateCategoryRadarData();

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">การวิเคราะห์</h1>
        <p className="text-gray-500 mt-2">แดชบอร์ดการวิเคราะห์อย่างละเอียด</p>
      </div>

      {/* Daily Sales Chart */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">ยอดขายรายวัน (30 วันที่ผ่านมา)</h3>
        </div>
        <div className="card-content">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dailySalesData}>
              <defs>
                <linearGradient id="colorDailySales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => `฿${(value as number).toLocaleString('th-TH')}`} />
              <Area type="monotone" dataKey="revenue" stroke="#f59e0b" fillOpacity={1} fill="url(#colorDailySales)" name="ยอดขาย" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart + Radar Chart */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">เปรียบเทียบรายสัปดาห์</h3>
          </div>
          <div className="card-content">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value) => `฿${(value as number).toLocaleString('th-TH')}`} />
                <Legend />
                <Bar dataKey="current" fill="#3b82f6" name="สัปดาห์นี้" />
                <Bar dataKey="previous" fill="#d1d5db" name="สัปดาห์ที่แล้ว" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">ประสิทธิภาพตามหมวดหมู่</h3>
          </div>
          <div className="card-content">
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={categoryRadarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="category" tick={{ fontSize: 12 }} />
                <PolarRadiusAxis />
                <Radar name="ยอดขาย" dataKey="sales" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Payment Methods + Top Products */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">วิธีชำระเงิน</h3>
          </div>
          <div className="card-content">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockChartData.paymentMethods}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {mockChartData.paymentMethods.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">10 สินค้าขายดีที่สุด</h3>
          </div>
          <div className="card-content">
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {mockChartData.topProducts.map((product, idx) => (
                <div key={idx} className="flex items-center gap-3 pb-3 border-b last:border-b-0">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-600">
                    {idx + 1}
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    <p className="text-xs text-gray-500">ขายแล้ว {product.sold} ชิ้น</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-sm font-semibold">฿{(product.revenue / 1000).toFixed(0)}K</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Top Products Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">ตารางสินค้าขายดี</h3>
        </div>
        <div className="card-content overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>อันดับ</th>
                <th>ชื่อสินค้า</th>
                <th className="text-right">ขายแล้ว (ชิ้น)</th>
                <th className="text-right">รายได้</th>
                <th className="text-right">% รวม</th>
              </tr>
            </thead>
            <tbody>
              {mockChartData.topProducts.map((product, idx) => {
                const totalRevenue = mockChartData.topProducts.reduce((sum, p) => sum + p.revenue, 0);
                const percentage = ((product.revenue / totalRevenue) * 100).toFixed(1);
                return (
                  <tr key={idx}>
                    <td className="font-bold text-center">{idx + 1}</td>
                    <td className="font-medium">{product.name}</td>
                    <td className="text-right">{product.sold}</td>
                    <td className="text-right font-semibold">฿{product.revenue.toLocaleString('th-TH')}</td>
                    <td className="text-right">{percentage}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
