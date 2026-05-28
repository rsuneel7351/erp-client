import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex bg-(--bg-app) transition-colors duration-300">
      {/* Visual Panel (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-(--color-primary) overflow-hidden items-center justify-center p-12">
        {/* Abstract background blobs (using primary light/dark variants) */}
        <motion.div 
          className="absolute w-[600px] h-[600px] rounded-full bg-(--color-primary-300) opacity-20 blur-3xl -top-40 -left-40"
          animate={{
            x: [0, 40, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute w-[500px] h-[500px] rounded-full bg-white opacity-10 blur-3xl -bottom-20 -right-20"
          animate={{
            x: [0, -30, 0],
            y: [0, 40, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Content Box */}
        <div className="relative max-w-lg text-white text-center space-y-8 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-block px-6 py-4 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl mb-4"
          >
            <span className="text-3xl font-display font-extrabold tracking-widest uppercase">GCC School ERP</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl font-display font-bold tracking-tight leading-tight"
          >
            A Unified Digital Ecosystem
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-white/80 text-xl font-medium leading-relaxed max-w-md mx-auto"
          >
            Seamlessly manage courses, attendance, results, and administration in one intuitive platform.
          </motion.p>
        </div>
      </div>

      {/* Auth Form Container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-24 bg-(--bg-app)">
        <motion.div 
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md bg-(--bg-surface) p-8 sm:p-10 rounded-3xl shadow-xl shadow-(--color-primary)/5 border border-(--bg-border) relative overflow-hidden"
        >
          {/* Subtle top accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-(--color-primary-300) via-(--color-primary) to-(--color-primary-600)"></div>
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
}
