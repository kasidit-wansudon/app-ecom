import { IS_MOCK } from '../config';
import { apiClient } from '../client';
import type { ApiResponse } from '../types';
import { mockCategories } from '@/data/mockData';
import type { Category } from '@/types';

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
// Categories controller
// ---------------------------------------------------------------------------
export const categoriesController = {
  /**
   * GET /categories
   */
  getAll: async (): Promise<ApiResponse<Category[]>> => {
    if (IS_MOCK) {
      return mockResponse(mockCategories, mockCategories.length);
    }
    return apiClient.get<Category[]>('/categories');
  },

  /**
   * GET /categories/:id
   */
  getById: async (id: number): Promise<ApiResponse<Category>> => {
    if (IS_MOCK) {
      const category = mockCategories.find((c) => c.id === id);
      if (!category) throw new Error('Category not found');
      return mockResponse(category);
    }
    return apiClient.get<Category>(`/categories/${id}`);
  },
};
