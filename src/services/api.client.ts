import { useAuthStore } from '@/stores/auth.store';

const API_BASE = import.meta.env.VITE_API_URL || '/api/v1';

let isRefreshing = false;
let failedQueue: Array<{ resolve: (v: string | null) => void; reject: (e: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

export class ApiError extends Error {
  status: number;
  data: any;
  constructor(status: number, data: any, message: string) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export const fetchClient = async (
  endpoint: string,
  options: RequestInit = {},
  _retry = false
): Promise<any> => {
  // If endpoint is an absolute URL, don't prepend API_BASE
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;
  
  const token = useAuthStore.getState().accessToken;
  
  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  if (!headers.has('Content-Type') && options.body && typeof options.body === 'string') {
    headers.set('Content-Type', 'application/json');
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  let response = await fetch(url, config);

  const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/register') || url.includes('/auth/refresh');

  if (response.status === 401 && !_retry && !isAuthEndpoint) {
    if (isRefreshing) {
      return new Promise<string | null>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((newToken) => {
          if (newToken) {
            headers.set('Authorization', `Bearer ${newToken}`);
          }
          return fetch(url, { ...config, headers });
        })
        .then(async (res) => {
          if (!res.ok) {
             const errData = await res.json().catch(() => ({}));
             throw new ApiError(res.status, errData, errData.message || 'API Error');
          }
          return res.json();
        })
        .catch((e) => Promise.reject(e));
    }

    _retry = true;
    isRefreshing = true;

    try {
      const refreshToken = useAuthStore.getState().refreshToken;
      if (!refreshToken) throw new Error('No refresh token');

      const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken })
      });
      
      if (!refreshRes.ok) {
         throw new Error('Refresh token invalid');
      }

      const refreshData = await refreshRes.json();
      const { accessToken, refreshToken: newRefreshToken } = refreshData.data;

      useAuthStore.getState().setTokens(accessToken, newRefreshToken);
      processQueue(null, accessToken);

      headers.set('Authorization', `Bearer ${accessToken}`);
      response = await fetch(url, { ...config, headers });

    } catch (refreshError) {
      processQueue(refreshError, null);
      useAuthStore.getState().logout();
      window.location.href = '/login';
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(response.status, errorData, errorData.message || 'API Error');
  }

  if (response.status === 204) {
    return null;
  }
  
  return response.json();
};

export const apiClient = {
  get: (endpoint: string, options?: RequestInit) => fetchClient(endpoint, { ...options, method: 'GET' }),
  post: (endpoint: string, data?: any, options?: RequestInit) => fetchClient(endpoint, {
    ...options,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  }),
  put: (endpoint: string, data?: any, options?: RequestInit) => fetchClient(endpoint, {
    ...options,
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  }),
  patch: (endpoint: string, data?: any, options?: RequestInit) => fetchClient(endpoint, {
    ...options,
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
  }),
  delete: (endpoint: string, options?: RequestInit) => fetchClient(endpoint, { ...options, method: 'DELETE' }),
};

export default apiClient;
