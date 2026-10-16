import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ShieldCheck } from 'lucide-react';
import { useLauncher } from '../context/LauncherContext';

export const BootSequence: React.FC = () => {
  const { bootState, userName } = useLauncher();

  if (bootState === 'ready') return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 z-[100] bg-black text-white flex flex-col justify-between items-center py-16 px-6 select-none overflow-hidden"
      >
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-radial from-indigo-900/20 via-black to-black pointer-events-none" />

        {/* Top spacer or status */}
        <div className="flex items-center gap-2 text-white/40 text-xs font-mono tracking-widest uppercase">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Mavic OS Active</span>
        </div>

        {/* Center Content: either Loading Bar or Personalized Name */}
        <div className="relative z-10 flex flex-col items-center text-center my-auto">
          {bootState === 'booting' ? (
            /* BOOT LOADING STATE */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center gap-6"
            >
              {/* Minimalist Glowing Apple/Mavic Emblem */}
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-white/10 to-white/5 border border-white/20 backdrop-blur-xl flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.15)] relative">
                <Sparkles size={36} className="text-white drop-shadow-md animate-pulse" />
              </div>

              {/* Smooth Progress Bar */}
              <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden mt-4">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.6, ease: 'easeInOut' }}
                  className="h-full bg-white rounded-full shadow-[0_0_10px_white]"
                />
              </div>

              <span className="text-xs font-mono text-white/50 tracking-wider">
                Initializing System...
              </span>
            </motion.div>
          ) : (
            /* WELCOME DISPLAY: "[User's Name]" */
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-3 px-4"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wide mb-1">
                <ShieldCheck size={14} />
                <span>Device Activated</span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white drop-shadow-[0_4px_24px_rgba(255,255,255,0.3)]">
                {userName}
              </h1>

              <p className="text-sm text-neutral-400 font-medium max-w-[260px] leading-relaxed">
                Welcome to your iPhone 16 experience
              </p>
            </motion.div>
          )}
        </div>

        {/* Bottom Attribution: "powered by zhundamavicofficial" */}
        <div className="relative z-10 flex flex-col items-center gap-1">
          <span className="text-xs font-medium tracking-wide text-neutral-400 font-sans">
            powered by <span className="font-bold text-white tracking-wider">zhundamavicofficial</span>
          </span>
          <span className="text-[10px] text-neutral-600 font-mono">
            Default Phone Launcher Disabled · Full Access Granted
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
