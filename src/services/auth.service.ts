import apiClient from './api.client';

export interface LoginDto {
  email: string;
  password: string;
  tenantSlug: string;
}

export interface RegisterDto {
  tenantName: string;
  tenantSlug: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export const authService = {
  login: async (dto: LoginDto) => {
    const res = await apiClient.post('/auth/login', dto);
    return res.data;
  },

  register: async (dto: RegisterDto) => {
    const res = await apiClient.post('/auth/register', dto);
    return res.data;
  },

  refresh: async (refreshToken: string) => {
    const res = await apiClient.post('/auth/refresh', { refreshToken });
    return res.data;
  },

  logout: async (refreshToken?: string) => {
    const res = await apiClient.post('/auth/logout', { refreshToken });
    return res.data;
  },

  getMe: async () => {
    const res = await apiClient.get('/auth/me');
    return res.data;
  },
};
