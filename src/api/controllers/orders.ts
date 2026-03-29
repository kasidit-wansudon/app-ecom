import { IS_MOCK } from '../config';
import { apiClient } from '../client';
import type { ApiResponse, OrderFilters } from '../types';
import { mockOrders } from '@/data/mockData';
import type { Order, CartItem } from '@/types';

// ---------------------------------------------------------------------------
// Internal helper
// ---------------------------------------------------------------------------
function mockResponse<T>(data: T, total = 1): ApiResponse<T> {
  return {
    success: true,
    data,
    message: 'ok',
    pagination: { page: 1, limit: 20, total, totalPages: 1 },
  };
}

// ---------------------------------------------------------------------------
// Orders controller
// ---------------------------------------------------------------------------
export const ordersController = {
  /**
   * GET /orders
   * Returns a paginated list of orders, optionally filtered by status / date range.
   */
  getAll: async (filters?: OrderFilters): Promise<ApiResponse<Order[]>> => {
    if (IS_MOCK) {
      let data = [...mockOrders];

      if (filters?.status) {
        data = data.filter((o) => o.status === filters.status);
      }
      if (filters?.dateFrom) {
        data = data.filter((o) => o.date >= filters.dateFrom!);
      }
      if (filters?.dateTo) {
        data = data.filter((o) => o.date <= filters.dateTo!);
      }

      const page = filters?.page ?? 1;
      const limit = filters?.limit ?? 20;
      const start = (page - 1) * limit;
      const paged = data.slice(start, start + limit);

      return {
        success: true,
        data: paged,
        message: 'ok',
        pagination: {
          page,
          limit,
          total: data.length,
          totalPages: Math.ceil(data.length / limit),
        },
      };
    }

    const params = new URLSearchParams(
      Object.entries(filters ?? {})
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)])
    ).toString();
    return apiClient.get<Order[]>(`/orders${params ? `?${params}` : ''}`);
  },

  /**
   * GET /orders/:id
   */
  getById: async (id: string): Promise<ApiResponse<Order>> => {
    if (IS_MOCK) {
      const order = mockOrders.find((o) => o.id === id);
      if (!order) throw new Error('Order not found');
      return mockResponse(order);
    }
    return apiClient.get<Order>(`/orders/${id}`);
  },

  /**
   * POST /orders
   */
  create: async (
    items: CartItem[],
    shippingAddress: string,
    paymentMethod: string
  ): Promise<ApiResponse<Order>> => {
    if (IS_MOCK) {
      const total = items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );
      const newOrder: Order = {
        id: `ORD-MOCK-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        status: 'pending',
        items,
        total,
        shippingAddress,
      };
      return mockResponse(newOrder);
    }
    return apiClient.post<Order>('/orders', { items, shippingAddress, paymentMethod });
  },

  /**
   * PATCH /orders/:id/status  (admin)
   */
  updateStatus: async (
    id: string,
    status: Order['status']
  ): Promise<ApiResponse<Order>> => {
    if (IS_MOCK) {
      const order = mockOrders.find((o) => o.id === id);
      if (!order) throw new Error('Order not found');
      return mockResponse({ ...order, status });
    }
    return apiClient.patch<Order>(`/orders/${id}/status`, { status });
  },

  /**
   * PATCH /orders/:id/cancel
   */
  cancel: async (id: string): Promise<ApiResponse<Order>> => {
    if (IS_MOCK) {
      const order = mockOrders.find((o) => o.id === id);
      if (!order) throw new Error('Order not found');
      return mockResponse({ ...order, status: 'cancelled' });
    }
    return apiClient.patch<Order>(`/orders/${id}/cancel`, {});
  },
};
