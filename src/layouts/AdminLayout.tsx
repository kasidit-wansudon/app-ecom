import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import PageTransition from '@/components/ui/PageTransition';
import { Toaster } from 'sonner';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  LogOut,
  Bell,
  Search,
  CircleUserRound,
} from 'lucide-react';

const adminNavItems = [
  { label: 'แดชบอร์ด', icon: LayoutDashboard, href: '/admin' },
  { label: 'สินค้า', icon: Package, href: '/admin/products' },
  { label: 'คำสั่งซื้อ', icon: ShoppingCart, href: '/admin/orders' },
  { label: 'สมาชิก', icon: Users, href: '/admin/users' },
  { label: 'วิเคราะห์', icon: BarChart3, href: '/admin/analytics' },
];

const pageNameMap: Record<string, string> = {
  '/admin': 'แดชบอร์ด',
  '/admin/products': 'จัดการสินค้า',
  '/admin/orders': 'จัดการคำสั่งซื้อ',
  '/admin/users': 'จัดการสมาชิก',
  '/admin/analytics': 'วิเคราะห์',
};

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const pageName = pageNameMap[location.pathname] || 'Admin Panel';

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold text-white">
            Orange<span className="text-orange-400">Shop</span>
          </h1>
          <span className="mt-2 inline-block bg-orange-500 text-white text-xs font-semibold px-2 py-0.5 rounded">
            Admin
          </span>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {adminNavItems.map((item) => {
            const isActive =
              item.href === location.pathname ||
              (item.href !== '/admin' && location.pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <button
                key={item.href}
                onClick={() => navigate(item.href)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all ${
                  isActive
                    ? 'bg-orange-500 text-white font-semibold'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-800">
          <button
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-300 hover:text-red-400 hover:bg-gray-800 transition-colors"
            onClick={() => navigate('/')}
          >
            <LogOut className="w-5 h-5" />
            ออกจากระบบ
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">{pageName}</h2>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative hidden md:block w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                placeholder="ค้นหา..."
                className="form-input pl-10 bg-gray-50 border-gray-200"
              />
            </div>

            {/* Notification */}
            <button className="relative p-2 text-gray-600 hover:text-gray-900">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full leading-none">
                3
              </span>
            </button>

            {/* Avatar */}
            <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100">
              <CircleUserRound className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <PageTransition>
              <Outlet />
            </PageTransition>
          </div>
        </div>
      </div>

      <Toaster />
    </div>
  );
}
