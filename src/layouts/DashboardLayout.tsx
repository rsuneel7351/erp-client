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
    <div className="min-h-screen flex bg-(--color-primary-950) text-gray-100 transition-colors duration-500 overflow-hidden relative">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-(--color-accent-500) opacity-10 blur-[120px] pointer-events-none animate-float" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-(--color-accent-400) opacity-10 blur-[120px] pointer-events-none animate-float" style={{ animationDelay: '3s' }} />

      {/* Sidebar Component */}
      <motion.aside
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="hidden md:flex flex-col glass-panel border-r-0 border-r-white/5 relative z-30 m-4 rounded-2xl h-[calc(100vh-32px)]"
      >
        {/* Sidebar Header Logo */}
        <div className="h-20 flex items-center px-6 justify-between border-b border-white/5">
          <Link to="/app/dashboard" className="flex items-center space-x-4 overflow-hidden">
            <div className="min-w-[40px] h-10 rounded-xl bg-gradient-to-br from-(--color-accent-500) to-(--color-accent-400) flex items-center justify-center text-white font-extrabold text-xl shadow-[0_0_15px_rgba(191,0,255,0.4)]">
              G
            </div>
            {isSidebarOpen && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-black text-xl tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 uppercase"
              >
                GCC ERP
              </motion.span>
            )}
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3.5 rounded-xl transition-all duration-300 group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-(--color-accent-500)/20 to-transparent text-white border-l-2 border-(--color-accent-400) shadow-[inset_0_0_20px_rgba(191,0,255,0.1)]'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white border-l-2 border-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 min-w-[20px] transition-colors duration-300 ${isActive ? 'text-(--color-accent-400)' : 'group-hover:text-(--color-accent-400)'}`} />
                {isSidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="ml-4 text-sm font-semibold tracking-wide truncate"
                  >
                    {item.name}
                  </motion.span>
                )}
                
                {/* Active Indicator Glow */}
                {isActive && (
                   <div className="absolute left-0 top-0 h-full w-[2px] bg-(--color-accent-400) shadow-[0_0_10px_rgba(0,240,255,1)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer / User Logout */}
        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3.5 text-gray-400 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all duration-300 group"
          >
            <LogOut className="w-5 h-5 group-hover:text-red-400 transition-colors" />
            {isSidebarOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="ml-4 text-sm font-semibold tracking-wide"
              >
                Log Out
              </motion.span>
            )}
          </button>
        </div>
      </motion.aside>

      {/* Main Workspace Layer */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen relative z-20">
        
        {/* Top Header Bar */}
        <header className="h-20 glass-panel border-x-0 border-t-0 border-b-white/5 flex items-center justify-between px-8 z-20 m-4 mb-0 rounded-2xl sticky top-4">
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 hover:text-white transition-all duration-300 text-gray-400 hidden md:flex items-center justify-center backdrop-blur-sm border border-white/5 hover:border-white/20"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-white md:hidden flex items-center space-x-3">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-(--color-accent-500) to-(--color-accent-400) flex items-center justify-center text-white font-extrabold text-sm shadow-lg">G</span>
              <span>GCC ERP</span>
            </h1>
          </div>

          <div className="flex items-center space-x-6">
            {/* User Profile */}
            <div className="flex items-center space-x-4 pl-6 border-l border-white/10">
              <div className="hidden text-right md:block">
                <p className="text-sm font-bold text-white tracking-wide">
                  {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'ERP User'}
                </p>
                <p className="text-xs text-(--color-accent-400) font-semibold uppercase tracking-wider mt-0.5">
                  {user?.roles?.[0] || 'Member'}
                </p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-white/10 to-white/5 border border-white/20 flex items-center justify-center text-white shadow-inner backdrop-blur-md">
                <User className="w-5 h-5" />
              </div>
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 p-8 overflow-y-auto w-full relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-[1600px] mx-auto w-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
