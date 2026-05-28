import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Users, GraduationCap, BookOpen, 
  CalendarCheck, CreditCard, ClipboardList, ShieldAlert, 
  FileSpreadsheet, Rss, Bell, LogOut, Menu, User
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard },
    { name: 'Students', path: '/app/students', icon: Users },
    { name: 'Faculty', path: '/app/faculty', icon: GraduationCap },
    { name: 'Courses', path: '/app/courses', icon: BookOpen },
    { name: 'Attendance', path: '/app/attendance', icon: CalendarCheck },
    { name: 'Fees', path: '/app/fees', icon: CreditCard },
    { name: 'Examination', path: '/app/examination', icon: ClipboardList },
    { name: 'Roles', path: '/app/roles', icon: ShieldAlert },
    { name: 'Reports', path: '/app/reports', icon: FileSpreadsheet },
    { name: 'Blogs', path: '/app/blogs', icon: Rss },
    { name: 'Notifications', path: '/app/notifications', icon: Bell },
  ];

  return (
    <div className="min-h-screen flex bg-(--bg-app) transition-colors duration-300 text-(--text-primary)">
      
      {/* Sidebar Component */}
      <motion.aside
        animate={{ width: isSidebarOpen ? 260 : 80 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden md:flex flex-col bg-(--sidebar-bg) border-r border-(--sidebar-bg)/10 shadow-xl relative z-30"
      >
        {/* Sidebar Header Logo */}
        <div className="h-16 flex items-center px-6 justify-between border-b border-white/10">
          <Link to="/app/dashboard" className="flex items-center space-x-3 overflow-hidden">
            <div className="min-w-[36px] h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-extrabold text-lg shadow-inner">
              G
            </div>
            {isSidebarOpen && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-bold text-lg tracking-wide text-white uppercase"
              >
                GCC ERP
              </motion.span>
            )}
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-(--sidebar-active) text-white font-semibold shadow-sm'
                    : 'text-(--sidebar-text) hover:bg-(--sidebar-hover) hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 min-w-[20px] ${isActive ? 'text-white' : 'text-(--sidebar-icon) group-hover:text-white'}`} />
                {isSidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="ml-3 text-sm truncate"
                  >
                    {item.name}
                  </motion.span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer / User Logout */}
        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-(--sidebar-text) hover:bg-danger/20 hover:text-white rounded-xl transition-all duration-200 group"
          >
            <LogOut className="w-5 h-5 text-(--sidebar-icon) group-hover:text-white" />
            {isSidebarOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="ml-3 text-sm font-medium"
              >
                Log Out
              </motion.span>
            )}
          </button>
        </div>
      </motion.aside>

      {/* Main Workspace Layer */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        
        {/* Top Header Bar */}
        <header className="h-16 bg-(--bg-surface) border-b border-(--bg-border) flex items-center justify-between px-6 z-20 relative shadow-sm">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-(--bg-surface-2) transition-colors text-(--text-muted) hidden md:block"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-(--text-primary) md:hidden flex items-center space-x-2">
              <span className="w-8 h-8 rounded-lg bg-(--color-primary) flex items-center justify-center text-white font-extrabold text-sm">G</span>
              <span>GCC ERP</span>
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* User Profile */}
            <div className="flex items-center space-x-3 pl-3 border-l border-(--bg-border)">
              <div className="hidden text-right md:block">
                <p className="text-sm font-semibold text-(--text-primary)">
                  {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'ERP User'}
                </p>
                <p className="text-xs text-(--text-muted) capitalize">
                  {user?.roles?.[0] || 'Member'}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-(--bg-surface-2) border border-(--bg-border) flex items-center justify-center text-(--text-muted)">
                <User className="w-5 h-5" />
              </div>
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-[1600px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
