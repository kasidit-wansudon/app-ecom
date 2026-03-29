import { IS_MOCK } from '../config';
import { apiClient, setToken, removeToken } from '../client';
import type { ApiResponse, LoginRequest, RegisterRequest, AuthResponse } from '../types';

const TOKEN_KEY = 'auth_token';

// ---------------------------------------------------------------------------
// Mock helpers
// ---------------------------------------------------------------------------
function mockAuthResponse(
  email: string,
  name: string,
  role: 'customer' | 'admin' = 'customer'
): ApiResponse<AuthResponse> {
  const token = `mock-jwt-token-${Date.now()}`;
  setToken(token);
  return {
    success: true,
    data: {
      token,
      user: { id: 1, name, email, role },
    },
    message: 'ok',
  };
}

// ---------------------------------------------------------------------------
// Auth controller
// ---------------------------------------------------------------------------
export const authController = {
  /**
   * POST /auth/login
   * Stores JWT token in localStorage on success.
   */
  login: async (credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    if (IS_MOCK) {
      // Simulate basic validation — any non-empty email/password passes in mock mode
      if (!credentials.email || !credentials.password) {
        throw new Error('กรุณากรอกอีเมลและรหัสผ่าน');
      }
      const name = credentials.email.split('@')[0];
      return mockAuthResponse(credentials.email, name, 'customer');
    }

    const res = await apiClient.post<AuthResponse>('/auth/login', credentials);
    if (res.success && res.data.token) {
      setToken(res.data.token);
    }
    return res;
  },

  /**
   * POST /auth/register
   * Stores JWT token in localStorage on success.
   */
  register: async (data: RegisterRequest): Promise<ApiResponse<AuthResponse>> => {
    if (IS_MOCK) {
      if (!data.email || !data.password || !data.name) {
        throw new Error('กรุณากรอกข้อมูลให้ครบถ้วน');
      }
      return mockAuthResponse(data.email, data.name, 'customer');
    }

    const res = await apiClient.post<AuthResponse>('/auth/register', data);
    if (res.success && res.data.token) {
      setToken(res.data.token);
    }
    return res;
  },

  /**
   * POST /auth/logout  (or local-only in mock mode)
   * Removes JWT token from localStorage.
   */
  logout: async (): Promise<void> => {
    removeToken();
    if (!IS_MOCK) {
      // Best-effort server-side invalidation — ignore errors
      await apiClient.post('/auth/logout', {}).catch(() => undefined);
    }
  },

  /**
   * GET /auth/me
   * Returns the profile of the currently authenticated user.
   */
  getMe: async (): Promise<ApiResponse<AuthResponse['user']>> => {
    if (IS_MOCK) {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) throw new Error('Unauthorized');
      return {
        success: true,
        data: { id: 1, name: 'ผู้ใช้ทดสอบ', email: 'demo@example.com', role: 'customer' },
        message: 'ok',
      };
    }
    return apiClient.get<AuthResponse['user']>('/auth/me');
  },

  /**
   * Returns true when a JWT token exists in localStorage.
   * Does NOT verify the token with the server.
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(TOKEN_KEY);
  },
};
