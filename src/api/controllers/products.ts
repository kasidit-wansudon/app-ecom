import { IS_MOCK } from '../config';
import { apiClient } from '../client';
import type { ApiResponse, ProductFilters } from '../types';
import { mockProducts } from '@/data/mockData';
import type { Product } from '@/types';

// ---------------------------------------------------------------------------
// Internal helper — wraps mock data in the standard ApiResponse shape
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
// Products controller
// ---------------------------------------------------------------------------
export const productsController = {
  /**
   * GET /products
   * Returns a paginated, optionally filtered list of products.
   */
  getAll: async (filters?: ProductFilters): Promise<ApiResponse<Product[]>> => {
    if (IS_MOCK) {
      let data = [...mockProducts];

      if (filters?.category) {
        data = data.filter((p) => p.category === filters.category);
      }
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        data = data.filter((p) => p.name.toLowerCase().includes(q));
      }
      if (filters?.minPrice !== undefined) {
        data = data.filter((p) => p.price >= filters.minPrice!);
      }
      if (filters?.maxPrice !== undefined) {
        data = data.filter((p) => p.price <= filters.maxPrice!);
      }
      if (filters?.sort === 'price_asc') {
        data.sort((a, b) => a.price - b.price);
      } else if (filters?.sort === 'price_desc') {
        data.sort((a, b) => b.price - a.price);
      } else if (filters?.sort === 'popular') {
        data.sort((a, b) => b.reviews - a.reviews);
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
    return apiClient.get<Product[]>(`/products${params ? `?${params}` : ''}`);
  },

  /**
   * GET /products/:id
   */
  getById: async (id: number): Promise<ApiResponse<Product>> => {
    if (IS_MOCK) {
      const product = mockProducts.find((p) => p.id === id);
      if (!product) throw new Error('Product not found');
      return mockResponse(product);
    }
    return apiClient.get<Product>(`/products/${id}`);
  },

  /**
   * POST /products  (admin)
   */
  create: async (product: Omit<Product, 'id'>): Promise<ApiResponse<Product>> => {
    if (IS_MOCK) {
      const newProduct: Product = { ...product, id: Date.now() };
      return mockResponse(newProduct);
    }
    return apiClient.post<Product>('/products', product);
  },

  /**
   * PUT /products/:id  (admin)
   */
  update: async (
    id: number,
    product: Partial<Omit<Product, 'id'>>
  ): Promise<ApiResponse<Product>> => {
    if (IS_MOCK) {
      const existing = mockProducts.find((p) => p.id === id);
      if (!existing) throw new Error('Product not found');
      return mockResponse({ ...existing, ...product });
    }
    return apiClient.put<Product>(`/products/${id}`, product);
  },

  /**
   * DELETE /products/:id  (admin)
   */
  delete: async (id: number): Promise<ApiResponse<null>> => {
    if (IS_MOCK) return mockResponse(null);
    return apiClient.delete<null>(`/products/${id}`);
  },
};
