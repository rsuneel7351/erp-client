import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string | null;
  roles: string[];
  permissions: string[];
  student?: { id: string; enrollmentNumber: string; photoUrl?: string | null } | null;
  faculty?: { id: string; employeeId: string; photoUrl?: string | null } | null;
}

interface AuthState {
  user: UserProfile | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;

  // Actions
  setAuth: (user: UserProfile, accessToken: string, refreshToken: string) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: UserProfile) => void;
  logout: () => void;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
  isRole: (...roles: string[]) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setAuth: (user, accessToken, refreshToken) =>
        set({ user, accessToken, refreshToken, isAuthenticated: true }),

      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),

      setUser: (user) => set({ user }),

      logout: () =>
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false }),

      hasRole: (role: string) => {
        const { user } = get();
        return user?.roles?.map((r) => r.toLowerCase()).includes(role.toLowerCase()) ?? false;
      },

      hasPermission: (permission: string) => {
        const { user } = get();
        return user?.permissions?.includes(permission) ?? false;
      },

      isRole: (...roles: string[]) => {
        const { user } = get();
        if (!user) return false;
        return roles.some((role) =>
          user.roles.map((r) => r.toLowerCase()).includes(role.toLowerCase()),
        );
      },
    }),
    {
      name: 'gcc-erp-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
