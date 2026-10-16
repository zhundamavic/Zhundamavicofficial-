import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Moon,
  Sun,
  PhoneCall,
  PhoneOff,
  WifiOff,
  ShieldCheck,
  Bell,
  Sparkles,
} from 'lucide-react';
import { useLauncher } from '../context/LauncherContext';
import { soundHaptics } from '../utils/haptics';

export const PhoneBlankOverlay: React.FC = () => {
  const {
    userName,
    isPhoneBlank,
    setIsPhoneBlank,
    isBedtimeActivated,
    deactivateBedtime,
    triggerWakeUpMorning,
    sleepSchedule,
    simulateVIPCall,
    vipIncomingCall,
    dismissVIPCall,
    currentTime,
  } = useLauncher();

  if (!isPhoneBlank) return null;

  const hours = currentTime.getHours().toString().padStart(2, '0');
  const minutes = currentTime.getMinutes().toString().padStart(2, '0');

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 z-[95] bg-black text-neutral-400 flex flex-col justify-between items-center py-12 px-6 select-none overflow-hidden"
      >
        {/* Subtle Ambient Night Indicator */}
        <div className="flex items-center gap-2 text-indigo-400/70 text-xs font-mono tracking-widest uppercase">
          <Moon size={14} className="text-indigo-400 animate-pulse" />
          <span>Bedtime Downtime · Screen Blank</span>
        </div>

        {/* Center: OLED Minimal Bedtime Clock */}
        <div className="flex flex-col items-center text-center my-auto">
          <h1 className="text-6xl sm:text-7xl font-extralight tracking-tighter text-neutral-300 drop-shadow-sm font-mono">
            {hours}:{minutes}
          </h1>
          <span className="text-xs text-neutral-500 font-medium mt-1">
            Wake up set for {sleepSchedule.wakeUpTime} AM
          </span>

          {/* Privacy & Sleep Safe Badge */}
          <div className="mt-6 flex flex-col items-center gap-2 max-w-xs">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 text-[11px] font-semibold">
              <WifiOff size={12} className="text-rose-400" />
              <span>Internet Access Disabled</span>
            </div>
            <p className="text-[11px] text-neutral-600 leading-relaxed text-center">
              Distractions silenced. Only calls and messages from your important VIP contacts can come in.
            </p>
          </div>

          {/* VIP Contact Allowed Pill */}
          <div className="mt-4 flex flex-wrap gap-1.5 justify-center">
            {sleepSchedule.vipContacts.map((vip, i) => (
              <span
                key={i}
                className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-900/80 text-emerald-400/80 border border-emerald-950"
              >
                ✓ {vip}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Interactive Controls: Simulate VIP Breakthrough & Wake Up */}
        <div className="w-full flex flex-col items-center gap-2.5 z-10">
          <div className="grid grid-cols-2 gap-2 w-full max-w-xs">
            {/* VIP Call Simulator */}
            <button
              onClick={simulateVIPCall}
              className="py-2.5 px-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-emerald-400 text-[11px] font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              title="Test that calls from important contacts break through the blank screen"
            >
              <PhoneCall size={13} />
              <span>Simulate VIP Call</span>
            </button>

            {/* Wake Up (06:00 AM) Morning Simulator */}
            <button
              onClick={triggerWakeUpMorning}
              className="py-2.5 px-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[11px] font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              title="Trigger morning wake up, speak 'hello its morning wake up', and restore internet"
            >
              <Sun size={13} />
              <span>Wake Up (06:00 AM)</span>
            </button>
          </div>

          <button
            onClick={() => {
              soundHaptics.playClick(750, 0.05);
              deactivateBedtime(true);
            }}
            className="text-[11px] text-neutral-600 hover:text-neutral-400 font-medium py-1 transition-colors"
          >
            Tap to exit bedtime downtime
          </button>
        </div>

        {/* VIP INCOMING CALL BREAKTHROUGH MODAL */}
        {vipIncomingCall && vipIncomingCall.active && (
          <div className="absolute inset-0 z-50 bg-black/95 backdrop-blur-3xl flex flex-col justify-between items-center py-16 px-6 text-white animate-in fade-in duration-300">
            <div className="flex flex-col items-center gap-2 mt-8">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
                <ShieldCheck size={14} />
                <span>Important VIP Person · Breakthrough</span>
              </span>
              <h2 className="text-3xl font-black mt-3">{vipIncomingCall.caller}</h2>
              <span className="text-sm text-neutral-400 font-mono">{vipIncomingCall.number}</span>
              <span className="text-xs text-neutral-500 mt-1">Bedtime Filter Bypassed</span>
            </div>

            <div className="flex items-center gap-12 mb-8">
              <button
                onClick={dismissVIPCall}
                className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 flex flex-col items-center justify-center text-white shadow-xl active:scale-90 transition-transform"
              >
                <PhoneOff size={24} />
              </button>

              <button
                onClick={() => {
                  soundHaptics.playClick(1000, 0.08);
                  dismissVIPCall();
                  setIsPhoneBlank(false);
                }}
                className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-400 flex flex-col items-center justify-center text-black shadow-xl active:scale-90 transition-transform animate-bounce"
              >
                <PhoneCall size={24} />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
