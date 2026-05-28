import { useAuthStore } from '@/stores/auth.store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Users, BookOpen, Clock, FileText, Settings, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UnifiedDashboard() {
  const { user } = useAuthStore();
  
  if (!user) return null;

  const isAdmin = user.roles.includes('Super Admin') || user.roles.includes('Admin');
  const isFaculty = user.roles.includes('Faculty');
  const isStudent = user.roles.includes('Student');

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-(--text-primary)">
          Welcome back, {user.firstName}! 👋
        </h1>
        <p className="text-(--text-muted) mt-1">
          Here's your {isAdmin ? 'administrative' : isFaculty ? 'faculty' : 'student'} overview for today.
        </p>
      </div>

      <motion.div 
        variants={container} 
        initial="hidden" 
        animate="show" 
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {/* Admin Widgets */}
        {isAdmin && (
          <>
            <Widget title="Total Students" value="1,248" icon={<Users className="w-5 h-5 text-blue-500" />} change="+12%" variant="glass" />
            <Widget title="Total Faculty" value="84" icon={<BookOpen className="w-5 h-5 text-emerald-500" />} change="+2%" />
            <Widget title="Pending Approvals" value="12" icon={<Clock className="w-5 h-5 text-amber-500" />} change="-5%" />
            <Widget title="System Health" value="99.9%" icon={<Settings className="w-5 h-5 text-purple-500" />} change="Optimal" />
          </>
        )}

        {/* Faculty Widgets */}
        {isFaculty && (
          <>
            <Widget title="My Courses" value="4" icon={<BookOpen className="w-5 h-5 text-blue-500" />} change="Active Semester" />
            <Widget title="Assignments Graded" value="86%" icon={<FileText className="w-5 h-5 text-emerald-500" />} change="+14% this week" />
            <Widget title="Upcoming Classes" value="3" icon={<Clock className="w-5 h-5 text-amber-500" />} change="Today" />
            <Widget title="Leave Balance" value="12 Days" icon={<ShieldAlert className="w-5 h-5 text-purple-500" />} change="Available" />
          </>
        )}

        {/* Student Widgets */}
        {isStudent && (
          <>
            <Widget title="Overall Attendance" value="85%" icon={<Users className="w-5 h-5 text-blue-500" />} change="Good standing" />
            <Widget title="Active Courses" value="6" icon={<BookOpen className="w-5 h-5 text-emerald-500" />} change="Semester 4" />
            <Widget title="Pending Assignments" value="2" icon={<FileText className="w-5 h-5 text-amber-500" />} change="Due this week" />
            <Widget title="Fee Status" value="Paid" icon={<Settings className="w-5 h-5 text-emerald-500" />} change="No dues" />
          </>
        )}
      </motion.div>

      {/* Main Content Area - Split Layout */}
      <div className="grid gap-6 md:grid-cols-7 lg:grid-cols-7">
        <Card className="md:col-span-4 lg:col-span-5 h-[400px]">
          <CardHeader>
            <CardTitle>Recent Activity Feed</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-64 text-(--text-muted) bg-(--bg-surface-2)/50 rounded-lg border border-dashed border-(--bg-border) m-4">
            Dynamic feed will be loaded here based on {user.roles[0]} role.
          </CardContent>
        </Card>
        
        <Card className="md:col-span-3 lg:col-span-2 h-[400px]">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <QuickAction title={isAdmin ? "Add User" : "View Timetable"} />
            <QuickAction title={isAdmin ? "System Logs" : "Apply Leave"} />
            <QuickAction title={isAdmin ? "Tenant Settings" : "Raise Complaint"} />
            <QuickAction title="Update Profile" />
          </CardContent>
        </Card>
      </div>
    </div>
  );

  function Widget({ title, value, icon, change, variant = 'default' }: any) {
    return (
      <motion.div variants={item}>
        <Card variant={variant as any}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-(--text-muted)">{title}</CardTitle>
            <div className="p-2 bg-(--bg-surface-2) rounded-full">{icon}</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-(--text-primary)">{value}</div>
            <p className="text-xs text-(--text-muted) mt-1">{change}</p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  function QuickAction({ title }: { title: string }) {
    return (
      <button className="w-full flex items-center justify-between p-3 rounded-lg border border-(--bg-border) hover:bg-(--bg-surface-2) transition-colors text-left text-sm font-medium text-(--text-primary)">
        {title}
        <span className="text-(--text-muted)">→</span>
      </button>
    );
  }
}
