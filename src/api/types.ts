// ---------------------------------------------------------------------------
// Shared API response types — mirrors Go backend struct patterns
// Go: type Response[T any] struct { Success bool; Data T; Message string; Pagination *Pagination }
// ---------------------------------------------------------------------------

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  pagination?: Pagination;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string>;
}

// ---------------------------------------------------------------------------
// Request parameter types
// ---------------------------------------------------------------------------

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface ProductFilters extends PaginationParams {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'price_asc' | 'price_desc' | 'popular' | 'newest';
  search?: string;
}

export interface OrderFilters extends PaginationParams {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface UserFilters extends PaginationParams {
  search?: string;
  status?: 'active' | 'inactive';
}

// ---------------------------------------------------------------------------
// Auth types
// ---------------------------------------------------------------------------

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: 'customer' | 'admin';
  };
}
