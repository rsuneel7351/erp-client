import apiClient from './api.client';

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  name: string;
  password: string;
}

export const authService = {
  login: async (dto: LoginDto) => {
    const res = await apiClient.post('/auth/login', dto);
    return res;
  },

  register: async (dto: RegisterDto) => {
    const res = await apiClient.post('/auth/register', dto);
    return res;
  },

  refresh: async (refreshToken: string) => {
    const res = await apiClient.post('/auth/refresh', { refreshToken });
    return res;
  },

  logout: async (refreshToken?: string) => {
    const res = await apiClient.post('/auth/logout', { refreshToken });
    return res;
  },

  getMe: async () => {
    const res = await apiClient.get('/auth/me');
    return res;
  },
};
