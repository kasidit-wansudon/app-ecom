# OrangeShop API Service Layer

ชั้น service layer สำหรับเชื่อมต่อ React frontend กับ Go REST API backend
พร้อม **Mock Mode** ที่ใช้ข้อมูลจำลองจาก `mockData.ts` เพื่อพัฒนาและทดสอบโดยไม่ต้องมี backend จริง

---

## Architecture Overview

```
src/api/
├── config.ts              # Environment config + IS_MOCK toggle
├── client.ts              # Fetch-based HTTP client + JWT injection
├── types.ts               # Shared request/response TypeScript types
└── controllers/
    ├── products.ts        # Product CRUD
    ├── orders.ts          # Order management
    ├── users.ts           # User management (admin + profile)
    ├── auth.ts            # Login / register / logout
    └── categories.ts      # Category listing
```

**Flow:**

```
Component
  └─▶ controller (products / orders / ...)
        ├─▶ IS_MOCK=true  → return mock data wrapped in ApiResponse<T>
        └─▶ IS_MOCK=false → apiClient.get/post/... → Go REST API
```

---

## Switching Between Mock and Real API

สร้างไฟล์ `.env` ที่ root ของโปรเจกต์:

### Mock Mode (default — ไม่ต้องมี backend)
```env
VITE_API_MODE=mock
```

### Real API Mode (ต้องรัน Go backend)
```env
VITE_API_MODE=real
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

> ค่า default ของ `VITE_API_MODE` คือ `'mock'` และ `VITE_API_BASE_URL` คือ `http://localhost:8080/api/v1`

---

## Go API Expected Endpoints

| Method   | Endpoint                      | Controller Method            | Description              |
|----------|-------------------------------|------------------------------|--------------------------|
| GET      | `/products`                   | `productsController.getAll`  | รายการสินค้า (+ filter)  |
| GET      | `/products/:id`               | `productsController.getById` | ดูสินค้าเดียว            |
| POST     | `/products`                   | `productsController.create`  | เพิ่มสินค้า (admin)      |
| PUT      | `/products/:id`               | `productsController.update`  | แก้ไขสินค้า (admin)      |
| DELETE   | `/products/:id`               | `productsController.delete`  | ลบสินค้า (admin)         |
| GET      | `/orders`                     | `ordersController.getAll`    | รายการออเดอร์            |
| GET      | `/orders/:id`                 | `ordersController.getById`   | ดูออเดอร์เดียว           |
| POST     | `/orders`                     | `ordersController.create`    | สร้างออเดอร์ใหม่         |
| PATCH    | `/orders/:id/status`          | `ordersController.updateStatus` | เปลี่ยนสถานะ (admin)  |
| PATCH    | `/orders/:id/cancel`          | `ordersController.cancel`    | ยกเลิกออเดอร์            |
| GET      | `/admin/users`                | `usersController.getAll`     | รายการ users (admin)     |
| GET      | `/admin/users/:id`            | `usersController.getById`    | ดู user เดียว (admin)    |
| PATCH    | `/admin/users/:id/status`     | `usersController.updateStatus` | เปลี่ยนสถานะ user     |
| GET      | `/users/me`                   | `usersController.getProfile` | โปรไฟล์ตัวเอง            |
| PUT      | `/users/me`                   | `usersController.updateProfile` | แก้ไขโปรไฟล์          |
| POST     | `/auth/login`                 | `authController.login`       | เข้าสู่ระบบ              |
| POST     | `/auth/register`              | `authController.register`    | สมัครสมาชิก              |
| POST     | `/auth/logout`                | `authController.logout`      | ออกจากระบบ               |
| GET      | `/auth/me`                    | `authController.getMe`       | ข้อมูล user จาก token    |
| GET      | `/categories`                 | `categoriesController.getAll` | รายการหมวดหมู่          |
| GET      | `/categories/:id`             | `categoriesController.getById` | ดูหมวดหมู่เดียว        |

---

## Response Format (Go Struct → TypeScript Interface)

### Go Backend Struct
```go
type Response[T any] struct {
    Success    bool        `json:"success"`
    Data       T           `json:"data"`
    Message    string      `json:"message"`
    Pagination *Pagination `json:"pagination,omitempty"`
}

type Pagination struct {
    Page       int `json:"page"`
    Limit      int `json:"limit"`
    Total      int `json:"total"`
    TotalPages int `json:"totalPages"`
}
```

### TypeScript Interface (src/api/types.ts)
```ts
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  pagination?: Pagination;
}
```

---

## Auth Flow (JWT Bearer Token)

1. เรียก `authController.login({ email, password })` หรือ `register(...)`
2. token ถูกเก็บอัตโนมัติใน `localStorage` ด้วย key `auth_token`
3. `apiClient` อ่าน token จาก localStorage และใส่ header `Authorization: Bearer <token>` ทุก request อัตโนมัติ
4. เมื่อ logout เรียก `authController.logout()` → ลบ token ออกจาก localStorage

---

## Error Handling

ทุก controller ใช้ `throw new Error(message)` เมื่อเกิด error
ใน component ให้ใช้ try/catch:

```tsx
try {
  const res = await productsController.getAll({ category: 'หูฟัง' });
  setProducts(res.data);
} catch (err) {
  setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
}
```

---

## Example Usage in Components

### ดึงสินค้า
```tsx
import { productsController } from '@/api/controllers/products';

const { data: products, pagination } = await productsController.getAll({
  category: 'หูฟัง',
  sort: 'price_asc',
  page: 1,
  limit: 12,
});
```

### Login
```tsx
import { authController } from '@/api/controllers/auth';

const res = await authController.login({ email, password });
// token ถูกเก็บอัตโนมัติ
console.log(res.data.user.name);
```

### ตรวจสอบว่า login อยู่หรือเปล่า
```tsx
if (authController.isAuthenticated()) {
  // show dashboard
}
```

---

## How to Add a New Controller

1. สร้างไฟล์ใน `src/api/controllers/myFeature.ts`
2. Import `IS_MOCK` จาก `../config` และ `apiClient` จาก `../client`
3. Export `const myFeatureController = { methodName: async (...) => {...} }`
4. แต่ละ method: ถ้า `IS_MOCK` → return mock data ในรูปแบบ `ApiResponse<T>` / ถ้าไม่ → เรียก `apiClient`

```ts
import { IS_MOCK } from '../config';
import { apiClient } from '../client';
import type { ApiResponse } from '../types';

export const myFeatureController = {
  getAll: async (): Promise<ApiResponse<MyType[]>> => {
    if (IS_MOCK) {
      return { success: true, data: mockMyData, message: 'ok' };
    }
    return apiClient.get<MyType[]>('/my-feature');
  },
};
```
