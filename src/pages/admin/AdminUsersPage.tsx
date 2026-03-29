import { useState } from 'react';
import { Eye, Download } from 'lucide-react';
import { mockUsers } from '@/data/mockData';
import type { User } from '@/types';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsSheetOpen(true);
  };

  const handleToggleStatus = (user: User) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === user.id
          ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' }
          : u
      )
    );
    if (selectedUser?.id === user.id) {
      setSelectedUser({
        ...selectedUser,
        status: selectedUser.status === 'active' ? 'inactive' : 'active',
      });
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['ชื่อ', 'อีเมล', 'เบอร์โทร', 'วันเข้าร่วม', 'จำนวนคำสั่งซื้อ', 'รวมการใช้จ่าย', 'สถานะ'],
      ...filteredUsers.map((u) => [u.name, u.email, u.phone, u.joinDate, u.totalOrders, u.totalSpent, u.status]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users.csv';
    a.click();
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">จัดการสมาชิก</h1>
          <p className="text-gray-500 mt-2">สมาชิกทั้งหมด: {filteredUsers.length}</p>
        </div>
        <button onClick={handleExport} className="btn btn-outline gap-2">
          <Download className="h-4 w-4" />
          ส่งออก
        </button>
      </div>

      {/* Search */}
      <div className="card">
        <div className="card-content pt-6">
          <input
            className="form-input"
            placeholder="ค้นหาตามชื่อหรืออีเมล..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="card">
        <div className="card-content overflow-x-auto pt-6">
          <table className="table w-full">
            <thead>
              <tr>
                <th>สมาชิก</th>
                <th>อีเมล</th>
                <th>เบอร์โทร</th>
                <th>วันเข้าร่วม</th>
                <th className="text-right">คำสั่งซื้อ</th>
                <th className="text-right">รวมการใช้จ่าย</th>
                <th>สถานะ</th>
                <th className="text-right">ดำเนินการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600">
                          {user.name.charAt(0)}
                        </div>
                      )}
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="text-sm text-gray-500">{user.email}</td>
                  <td className="text-sm">{user.phone}</td>
                  <td className="text-sm">{user.joinDate}</td>
                  <td className="text-right font-semibold">{user.totalOrders}</td>
                  <td className="text-right font-semibold">฿{user.totalSpent.toLocaleString('th-TH')}</td>
                  <td>
                    <span className={user.status === 'active' ? 'badge badge-success' : 'badge badge-gray'}>
                      {user.status === 'active' ? 'ใช้งาน' : 'ปิดใช้'}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => handleViewUser(user)}
                        title="ดูรายละเอียด"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(user)}
                        aria-label="Toggle user status"
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${user.status === 'active' ? 'bg-blue-600' : 'bg-gray-300'}`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${user.status === 'active' ? 'translate-x-6' : 'translate-x-1'}`}
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-gray-500">ไม่พบสมาชิก</div>
          )}
        </div>
      </div>

      {/* User Details Side Panel */}
      {isSheetOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40"
            onClick={() => setIsSheetOpen(false)}
          />
          <div className="fixed top-0 right-0 z-50 h-full w-full sm:w-96 bg-white shadow-xl flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-semibold">รายละเอียดสมาชิก</h2>
              <button className="btn btn-ghost btn-sm" onClick={() => setIsSheetOpen(false)}>✕</button>
            </div>

            {selectedUser && (
              <div className="space-y-6 p-6">
                {/* Avatar and Name */}
                <div className="flex flex-col items-center space-y-4">
                  {selectedUser.avatar ? (
                    <img src={selectedUser.avatar} alt={selectedUser.name} className="w-20 h-20 rounded-full object-cover" />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-600">
                      {selectedUser.name.charAt(0)}
                    </div>
                  )}
                  <div className="text-center">
                    <h2 className="text-xl font-bold">{selectedUser.name}</h2>
                    <span className={selectedUser.status === 'active' ? 'badge badge-success' : 'badge badge-gray'}>
                      {selectedUser.status === 'active' ? 'ใช้งาน' : 'ปิดใช้'}
                    </span>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm">ข้อมูลติดต่อ</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-gray-500">อีเมล</p>
                      <p className="font-medium">{selectedUser.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">เบอร์โทร</p>
                      <p className="font-medium">{selectedUser.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Statistics */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm">สถิติ</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">จำนวนคำสั่งซื้อ</p>
                      <p className="text-2xl font-bold">{selectedUser.totalOrders}</p>
                    </div>
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">รวมการใช้จ่าย</p>
                      <p className="text-lg font-bold">฿{(selectedUser.totalSpent / 1000).toFixed(1)}K</p>
                    </div>
                  </div>
                </div>

                {/* Join Date */}
                <div>
                  <p className="text-sm text-gray-500">วันเข้าร่วม</p>
                  <p className="font-medium">{selectedUser.joinDate}</p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-4 border-t">
                  <button
                    onClick={() => handleToggleStatus(selectedUser)}
                    className={`w-full btn ${selectedUser.status === 'active' ? 'btn-danger' : 'btn-primary'}`}
                  >
                    {selectedUser.status === 'active' ? 'ปิดใช้งาน' : 'เปิดใช้งาน'}
                  </button>
                  <button className="btn btn-outline w-full">ส่งข้อความ</button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
