import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Mail, Lock, LogIn, Building2 } from 'lucide-react';
import { api } from '@/services/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const [email, setEmail] = useState('superadmin@gccschool.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post(`/auth/login`, { 
        email, 
        password
      });
      
      const { accessToken, refreshToken, user } = response.data.data;
      setAuth(user, accessToken, refreshToken);
      
      navigate('/app/dashboard');
    } catch (err: any) {
      if (Array.isArray(err.response?.data?.message)) {
        setError(err.response.data.message[0]);
      } else {
        setError(err.response?.data?.message || 'Invalid credentials');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in w-full">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-display font-extrabold tracking-tight text-(--text-primary)">
          Welcome Back
        </h1>
        <p className="text-sm font-medium text-(--text-muted)">
          Sign in to access your ERP dashboard
        </p>
      </div>

      {error && (
        <div className="bg-danger/10 text-danger text-sm p-3 rounded-lg border border-danger/20 flex items-center space-x-2 animate-slide-in">
          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-5">
        <Input
          id="email"
          type="email"
          label="Email Address"
          placeholder="you@gccschool.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Mail className="w-4 h-4" />}
          required
        />
        
        <Input
          id="password"
          type="password"
          label="Password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leftIcon={<Lock className="w-4 h-4" />}
          required
        />
        
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center space-x-2 text-sm text-(--text-muted) cursor-pointer group">
            <input type="checkbox" className="rounded border-(--bg-border) text-(--color-primary) focus:ring-(--color-primary) transition-colors" />
            <span className="group-hover:text-(--text-primary) transition-colors">Remember me</span>
          </label>
          <a href="#" className="text-sm font-medium text-(--color-primary) hover:text-(--color-primary-600) transition-colors">
            Forgot password?
          </a>
        </div>

        <Button 
          type="submit" 
          className="w-full h-11 text-base shadow-md hover:shadow-lg transition-all" 
          isLoading={loading} 
          rightIcon={<LogIn className="w-5 h-5" />}
        >
          Sign In
        </Button>
      </form>

      <div className="relative pt-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-(--bg-border)"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-3 bg-white dark:bg-slate-800 text-(--text-muted)">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button 
          variant="outline" 
          type="button" 
          onClick={() => alert('SSO Integration planned for future')} 
          className="w-full h-11 bg-(--bg-surface) hover:bg-(--bg-surface-2) border-(--bg-border) text-(--text-secondary) font-medium shadow-sm transition-all hover:-translate-y-0.5"
        >
          <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
            <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
          </svg>
          Google
        </Button>
        <Button 
          variant="outline" 
          type="button" 
          onClick={() => alert('SSO Integration planned for future')} 
          className="w-full h-11 bg-(--bg-surface) hover:bg-(--bg-surface-2) border-(--bg-border) text-(--text-secondary) font-medium shadow-sm transition-all hover:-translate-y-0.5"
        >
          <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="microsoft" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path fill="currentColor" d="M0 32h214.6v214.6H0V32zm233.4 0H448v214.6H233.4V32zM0 265.4h214.6V480H0V265.4zm233.4 0H448V480H233.4V265.4z"></path>
          </svg>
          Microsoft
        </Button>
      </div>
    </div>
  );
}
