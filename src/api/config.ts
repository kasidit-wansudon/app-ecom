// API Mode: 'mock' | 'real'
// Set VITE_API_MODE=real in .env to switch to real Go backend
export const API_MODE = import.meta.env.VITE_API_MODE || 'mock';
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';
export const IS_MOCK = API_MODE === 'mock';
