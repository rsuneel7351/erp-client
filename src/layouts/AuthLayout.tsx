import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex bg-(--color-primary-950) text-gray-100 overflow-hidden relative">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-(--color-accent-500) opacity-10 blur-[150px] pointer-events-none animate-float" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-(--color-accent-400) opacity-10 blur-[150px] pointer-events-none animate-float" style={{ animationDelay: '3s' }} />

      {/* Visual Panel (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden items-center justify-center p-12 z-10">
        
        {/* Content Box */}
        <div className="relative max-w-2xl text-center space-y-8 z-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: 'spring' }}
            className="inline-block px-8 py-5 rounded-2xl glass-panel mb-6 border-white/10"
          >
            <span className="text-4xl font-black tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 uppercase">GCC School ERP</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl font-black tracking-tight leading-tight text-white drop-shadow-2xl"
          >
            A Unified <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-(--color-accent-500) to-(--color-accent-400) filter drop-shadow-[0_0_15px_rgba(0,240,255,0.4)]">Digital Ecosystem</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-gray-300 text-2xl font-medium leading-relaxed max-w-lg mx-auto"
          >
            Seamlessly manage courses, attendance, results, and administration in one intuitive platform.
          </motion.p>
        </div>
      </div>

      {/* Auth Form Container */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-6 sm:p-12 z-20 relative">
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, type: 'spring', damping: 25 }}
          className="w-full max-w-md glass-panel p-8 sm:p-10 rounded-3xl relative overflow-hidden"
        >
          {/* Subtle top accent line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-(--color-accent-500) via-white/50 to-(--color-accent-400) shadow-[0_0_15px_rgba(191,0,255,0.5)]"></div>
          
          {/* Inner Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
          
          <div className="relative z-10">
             <Outlet />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
