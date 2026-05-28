import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { PageLoader } from '@/components/ui/PageLoader';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RoleRoute } from '@/components/auth/RoleRoute';

// ─── Layouts (lazy) ───────────────────────────────────────────
const AuthLayout = lazy(() => import('@/layouts/AuthLayout'));
const DashboardLayout = lazy(() => import('@/layouts/DashboardLayout'));

// ─── Auth Pages ───────────────────────────────────────────────
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));

// ─── Unified Core ──────────────────────────────────────────────
const UnifiedDashboard = lazy(() => import('@/pages/dashboard/UnifiedDashboard'));

// ─── Admin ────────────────────────────────────────────────────
const StudentsPage = lazy(() => import('@/pages/admin/StudentsPage'));
const FacultyPage = lazy(() => import('@/pages/admin/FacultyPage'));
const CoursesPage = lazy(() => import('@/pages/admin/CoursesPage'));
const AttendancePage = lazy(() => import('@/pages/admin/AttendancePage'));
const FeesPage = lazy(() => import('@/pages/admin/FeesPage'));
const ExaminationPage = lazy(() => import('@/pages/admin/ExaminationPage'));
const RolesPage = lazy(() => import('@/pages/admin/RolesPage'));
const ReportsPage = lazy(() => import('@/pages/admin/ReportsPage'));
const BlogsPage = lazy(() => import('@/pages/admin/BlogsPage'));
const NotificationsPage = lazy(() => import('@/pages/admin/NotificationsPage'));

const wrap = (Page: React.ComponentType) => (
  <Suspense fallback={<PageLoader />}>
    <Page />
  </Suspense>
);

export const router = createBrowserRouter([
  // Auth Routes
  {
    path: '/',
    element: <Suspense fallback={<PageLoader />}><AuthLayout /></Suspense>,
    children: [
      { index: true, element: <Navigate to="/login" replace /> },
      { path: 'login', element: wrap(LoginPage) },
      { path: 'register', element: wrap(RegisterPage) },
    ],
  },

  // Protected App Routes
  {
    path: '/app',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<PageLoader />}><DashboardLayout /></Suspense>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/app/dashboard" replace /> },

      // Unified Dashboard (Adapts based on role)
      { path: 'dashboard', element: wrap(UnifiedDashboard) },

      // Admin & Super Admin Features (Could be accessed by others based on permissions later)
      { path: 'students', element: <RoleRoute roles={['Super Admin', 'Admin', 'Faculty']}>{wrap(StudentsPage)}</RoleRoute> },
      { path: 'faculty', element: <RoleRoute roles={['Super Admin', 'Admin']}>{wrap(FacultyPage)}</RoleRoute> },
      { path: 'courses', element: wrap(CoursesPage) },
      { path: 'attendance', element: wrap(AttendancePage) },
      { path: 'fees', element: wrap(FeesPage) },
      { path: 'examination', element: wrap(ExaminationPage) },
      { path: 'roles', element: <RoleRoute roles={['Super Admin']}>{wrap(RolesPage)}</RoleRoute> },
      { path: 'reports', element: <RoleRoute roles={['Super Admin', 'Admin']}>{wrap(ReportsPage)}</RoleRoute> },
      { path: 'blogs', element: wrap(BlogsPage) },
      { path: 'notifications', element: wrap(NotificationsPage) },
    ],
  },

  // Catch all
  { path: '*', element: <Navigate to="/login" replace /> },
]);
