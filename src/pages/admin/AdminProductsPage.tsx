import { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { mockProducts, mockCategories } from '@/data/mockData';
import type { Product } from '@/types';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: 0,
    originalPrice: 0,
    image: '',
    stock: 0,
    isActive: true,
    badge: '',
  });

  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({ name: '', category: '', price: 0, originalPrice: 0, image: '', stock: 0, isActive: true, badge: '' });
    setIsDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice || 0,
      image: product.image,
      stock: 0,
      isActive: true,
      badge: product.badge || '',
    });
    setIsDialogOpen(true);
  };

  const handleSaveProduct = () => {
    if (!formData.name || !formData.category || formData.price <= 0) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? { ...p, name: formData.name, category: formData.category, price: formData.price, originalPrice: formData.originalPrice, image: formData.image, badge: formData.badge }
            : p
        )
      );
    } else {
      const newProduct: Product = {
        id: Math.max(...products.map((p) => p.id), 0) + 1,
        name: formData.name,
        category: formData.category,
        price: formData.price,
        originalPrice: formData.originalPrice,
        image: formData.image,
        rating: 4.5,
        reviews: 0,
        badge: formData.badge,
      };
      setProducts((prev) => [...prev, newProduct]);
    }

    setIsDialogOpen(false);
  };

  const handleDeleteClick = (id: number) => {
    setDeleteTarget(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget !== null) {
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget));
      setIsDeleteDialogOpen(false);
      setDeleteTarget(null);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(filteredProducts.map((p) => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedProducts((prev) => [...prev, id]);
    } else {
      setSelectedProducts((prev) => prev.filter((p) => p !== id));
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">จัดการสินค้า</h1>
          <p className="text-gray-500 mt-2">สินค้าทั้งหมด: {filteredProducts.length}</p>
        </div>
        <button onClick={handleAddProduct} className="btn btn-primary">
          เพิ่มสินค้า
        </button>
      </div>

      {/* Toolbar */}
      <div className="card">
        <div className="card-content pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="form-group">
              <label className="form-label">ค้นหา</label>
              <input
                className="form-input"
                placeholder="ค้นหาสินค้า..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">หมวดหมู่</label>
              <select
                className="form-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">ทั้งหมด</option>
                {mockCategories.map((cat) => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">สถานะ</label>
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">ทั้งหมด</option>
                <option value="active">พร้อมขาย</option>
                <option value="inactive">ปิด</option>
              </select>
            </div>
          </div>
          {selectedProducts.length > 0 && (
            <div className="flex gap-2 items-center">
              <span className="text-sm text-gray-500">เลือกแล้ว {selectedProducts.length} รายการ</span>
              <button className="btn btn-outline btn-sm">ลบรายการที่เลือก</button>
            </div>
          )}
        </div>
      </div>

      {/* Products Table */}
      <div className="card">
        <div className="card-content overflow-x-auto pt-6">
          <table className="table w-full">
            <thead>
              <tr>
                <th className="w-12">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={filteredProducts.length > 0 && selectedProducts.length === filteredProducts.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
                <th>รูป</th>
                <th>ชื่อสินค้า</th>
                <th>หมวดหมู่</th>
                <th className="text-right">ราคา</th>
                <th>สต็อก</th>
                <th>สถานะ</th>
                <th className="text-right">ดำเนินการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <input
                      type="checkbox"
                      className="form-checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={(e) => handleSelectProduct(product.id, e.target.checked)}
                    />
                  </td>
                  <td>
                    <img src={product.image} alt={product.name} className="h-10 w-10 rounded-md object-cover" />
                  </td>
                  <td className="font-medium">{product.name}</td>
                  <td>{product.category}</td>
                  <td className="text-right font-semibold">฿{product.price.toLocaleString('th-TH')}</td>
                  <td>
                    <span className="badge badge-gray">-</span>
                  </td>
                  <td>
                    <span className="badge badge-success">พร้อมขาย</span>
                  </td>
                  <td className="text-right space-x-2">
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => handleEditProduct(product)}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      className="btn btn-ghost btn-sm text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteClick(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="modal-content w-full max-w-md mx-4">
            <div className="modal-header">
              <h3 className="modal-title">{editingProduct ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}</h3>
            </div>
            <div className="modal-body space-y-4">
              <div className="form-group">
                <label className="form-label" htmlFor="name">ชื่อสินค้า</label>
                <input
                  id="name"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="category">หมวดหมู่</label>
                <select
                  id="category"
                  className="form-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="">เลือกหมวดหมู่</option>
                  {mockCategories.map((cat) => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label" htmlFor="price">ราคา</label>
                  <input
                    id="price"
                    type="number"
                    className="form-input"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="originalPrice">ราคาเดิม</label>
                  <input
                    id="originalPrice"
                    type="number"
                    className="form-input"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="image">URL รูป</label>
                <input
                  id="image"
                  className="form-input"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="stock">สต็อก</label>
                <input
                  id="stock"
                  type="number"
                  className="form-input"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="badge">Badge (เช่น ลด 20%)</label>
                <input
                  id="badge"
                  className="form-input"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${formData.isActive ? 'bg-blue-600' : 'bg-gray-300'}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.isActive ? 'translate-x-6' : 'translate-x-1'}`}
                  />
                </button>
                <label className="form-label mb-0">สายพร้อมขาย</label>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setIsDialogOpen(false)}>ยกเลิก</button>
              <button className="btn btn-primary" onClick={handleSaveProduct}>
                {editingProduct ? 'บันทึก' : 'เพิ่มสินค้า'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="modal-content w-full max-w-sm mx-4">
            <div className="modal-header">
              <h3 className="modal-title">ยืนยันการลบ</h3>
            </div>
            <div className="modal-body">
              <p className="text-gray-600">คุณแน่ใจหรือว่าต้องการลบสินค้านี้? ไม่สามารถกู้คืนได้</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setIsDeleteDialogOpen(false)}>ยกเลิก</button>
              <button className="btn btn-danger" onClick={handleConfirmDelete}>ลบ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
