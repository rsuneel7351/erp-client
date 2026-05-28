import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export function PageLoader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md z-50 transition-colors duration-300">
      <div className="relative flex flex-col items-center space-y-4">
        {/* Animated outer ring */}
        <motion.div
          className="absolute -inset-4 rounded-full border border-blue-500/30 dark:border-blue-400/20"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Logo/Icon Area */}
        <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700/50">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </motion.div>
        </div>

        {/* Text Area */}
        <div className="text-center">
          <motion.h3
            className="text-lg font-bold tracking-wider text-slate-800 dark:text-slate-150 uppercase"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            KCG ERP
          </motion.h3>
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-1">
            Loading systems...
          </p>
        </div>
      </div>
    </div>
  );
}
