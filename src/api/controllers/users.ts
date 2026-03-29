import { IS_MOCK } from '../config';
import { apiClient } from '../client';
import type { ApiResponse, UserFilters } from '../types';
import { mockUsers } from '@/data/mockData';
import type { User } from '@/types';

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
// Users controller
// ---------------------------------------------------------------------------
export const usersController = {
  /**
   * GET /admin/users  (admin)
   */
  getAll: async (filters?: UserFilters): Promise<ApiResponse<User[]>> => {
    if (IS_MOCK) {
      let data = [...mockUsers];

      if (filters?.status) {
        data = data.filter((u) => u.status === filters.status);
      }
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        data = data.filter(
          (u) =>
            u.name.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q)
        );
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
    return apiClient.get<User[]>(`/admin/users${params ? `?${params}` : ''}`);
  },

  /**
   * GET /admin/users/:id  (admin)
   */
  getById: async (id: number): Promise<ApiResponse<User>> => {
    if (IS_MOCK) {
      const user = mockUsers.find((u) => u.id === id);
      if (!user) throw new Error('User not found');
      return mockResponse(user);
    }
    return apiClient.get<User>(`/admin/users/${id}`);
  },

  /**
   * PATCH /admin/users/:id/status  (admin)
   */
  updateStatus: async (
    id: number,
    status: 'active' | 'inactive'
  ): Promise<ApiResponse<User>> => {
    if (IS_MOCK) {
      const user = mockUsers.find((u) => u.id === id);
      if (!user) throw new Error('User not found');
      return mockResponse({ ...user, status });
    }
    return apiClient.patch<User>(`/admin/users/${id}/status`, { status });
  },

  /**
   * GET /users/me  — current authenticated user's profile
   */
  getProfile: async (): Promise<ApiResponse<User>> => {
    if (IS_MOCK) {
      // Return the first mock user as the "logged-in" user
      return mockResponse(mockUsers[0]);
    }
    return apiClient.get<User>('/users/me');
  },

  /**
   * PUT /users/me  — update current user's profile
   */
  updateProfile: async (
    data: Partial<Pick<User, 'name' | 'email' | 'phone' | 'avatar'>>
  ): Promise<ApiResponse<User>> => {
    if (IS_MOCK) {
      return mockResponse({ ...mockUsers[0], ...data });
    }
    return apiClient.put<User>('/users/me', data);
  },
};
