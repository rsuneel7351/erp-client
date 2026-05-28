import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';

interface RoleRouteProps {
  children: React.ReactNode;
  roles: string[];
}

export function RoleRoute({ children, roles }: RoleRouteProps) {
  const { isRole } = useAuthStore();

  if (!isRole(...roles)) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return <>{children}</>;
}
