import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Flashlight,
  Camera,
  Lock,
  Unlock,
  BatteryCharging,
  Sun,
  Flame,
  Calendar as CalendarIcon,
  ChevronUp,
} from 'lucide-react';
import { useLauncher } from '../context/LauncherContext';
import { soundHaptics } from '../utils/haptics';

export const LockScreen: React.FC = () => {
  const {
    currentTime,
    batteryLevel,
    isFlashlightOn,
    toggleFlashlight,
    openApp,
    setScreenState,
    notifications,
  } = useLauncher();

  const [isUnlocking, setIsUnlocking] = useState(false);
  const [clockFont, setClockFont] = useState<'bold' | 'rounded' | 'serif' | 'slim'>('bold');

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayName = days[currentTime.getDay()];
  const monthName = months[currentTime.getMonth()];
  const dateNum = currentTime.getDate();

  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const formattedHours = `${hours % 12 || 12}`;
  const formattedMinutes = `${minutes < 10 ? '0' : ''}${minutes}`;

  const handleUnlock = () => {
    setIsUnlocking(true);
    soundHaptics.playClick(900, 0.08);
    setTimeout(() => {
      setScreenState('home');
      setIsUnlocking(false);
    }, 280);
  };

  const getClockFontClass = () => {
    switch (clockFont) {
      case 'rounded':
        return 'font-sans font-extrabold tracking-tight';
      case 'serif':
        return 'font-serif font-bold tracking-normal';
      case 'slim':
        return 'font-sans font-light tracking-wide';
      case 'bold':
      default:
        return 'font-sans font-black tracking-tighter';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      animate={isUnlocking ? { opacity: 0, y: -80, scale: 0.98 } : { opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -100 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-0 z-40 flex flex-col justify-between pt-14 pb-8 px-6 text-white select-none overflow-hidden"
    >
      {/* Top Padlock & Date / Clock */}
      <div className="flex flex-col items-center gap-1.5 mt-2">
        <div className="flex items-center gap-1.5 text-white/80 mb-1">
          <Lock size={15} />
        </div>

        {/* Date header with mini weather kicker */}
        <div className="flex items-center gap-2 text-sm font-semibold text-white/90 drop-shadow-md">
          <span>{dayName}, {monthName} {dateNum}</span>
          <span className="text-white/40">·</span>
          <div className="flex items-center gap-1 text-amber-300">
            <Sun size={14} />
            <span className="text-xs font-bold">74°</span>
          </div>
        </div>

        {/* Big iOS 18 Clock */}
        <button
          onClick={() => {
            soundHaptics.playClick(1000, 0.04);
            const fonts: ('bold' | 'rounded' | 'serif' | 'slim')[] = ['bold', 'rounded', 'serif', 'slim'];
            const next = fonts[(fonts.indexOf(clockFont) + 1) % fonts.length];
            setClockFont(next);
          }}
          className="focus:outline-none group active:scale-98 transition-transform"
          title="Click to cycle clock font style"
        >
          <div
            className={`text-[86px] leading-[0.95] drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)] flex items-center justify-center ${getClockFontClass()}`}
          >
            <span>{formattedHours}</span>
            <span className="opacity-70 px-1">:</span>
            <span>{formattedMinutes}</span>
          </div>
        </button>

        {/* iOS 18 Lock Screen Widget Bar */}
        <div className="flex items-center gap-3 mt-3 bg-black/25 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 shadow-lg">
          {/* Battery Widget */}
          <div className="flex items-center gap-1 text-xs font-semibold text-white/90">
            <BatteryCharging size={16} className="text-emerald-400" />
            <span className="tabular-nums font-mono text-[11px]">{batteryLevel}%</span>
          </div>

          <div className="w-[1px] h-3 bg-white/20" />

          {/* Fitness Rings */}
          <div className="flex items-center gap-1 text-xs font-semibold text-rose-400">
            <Flame size={15} />
            <span className="tabular-nums font-mono text-[11px]">420 kcal</span>
          </div>

          <div className="w-[1px] h-3 bg-white/20" />

          {/* Next Calendar Event */}
          <div className="flex items-center gap-1 text-xs font-semibold text-sky-300">
            <CalendarIcon size={14} />
            <span className="text-[11px] truncate max-w-[90px]">Design Sync</span>
          </div>
        </div>
      </div>

      {/* Middle: Notifications preview if any */}
      <div className="flex-1 flex flex-col justify-end gap-2.5 max-w-sm mx-auto w-full my-4 overflow-hidden">
        <AnimatePresence>
          {notifications.slice(0, 2).map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={() => {
                handleUnlock();
                openApp(item.appId);
              }}
              className="bg-black/45 backdrop-blur-xl border border-white/15 p-3 rounded-2xl shadow-xl cursor-pointer hover:bg-black/55 transition-colors"
            >
              <div className="flex items-center justify-between text-xs text-white/70 mb-1">
                <span className="font-semibold text-white text-[12px]">{item.title}</span>
                <span className="text-[10px] text-white/50">{item.timeAgo}</span>
              </div>
              <p className="text-xs text-white/90 line-clamp-2 leading-relaxed">{item.message}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Bottom Shortcuts & Swipe To Unlock */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center justify-between w-full px-2">
          {/* Flashlight button */}
          <button
            onClick={toggleFlashlight}
            className={`w-12 h-12 rounded-full backdrop-blur-xl flex items-center justify-center transition-all duration-200 border ${
              isFlashlightOn
                ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.7)]'
                : 'bg-black/40 text-white border-white/20 hover:bg-black/60 active:scale-90'
            }`}
          >
            <Flashlight size={20} className={isFlashlightOn ? 'fill-current' : ''} />
          </button>

          {/* Swipe indicator */}
          <button
            onClick={handleUnlock}
            className="flex flex-col items-center text-white/80 hover:text-white transition-opacity active:scale-95"
          >
            <span className="text-[12px] font-semibold tracking-tight drop-shadow-sm flex items-center gap-1">
              Swipe up to open <ChevronUp size={14} className="animate-bounce" />
            </span>
          </button>

          {/* Camera shortcut button */}
          <button
            onClick={() => {
              handleUnlock();
              openApp('camera');
            }}
            className="w-12 h-12 rounded-full bg-black/40 text-white backdrop-blur-xl border border-white/20 flex items-center justify-center hover:bg-black/60 active:scale-90 transition-transform"
          >
            <Camera size={20} />
          </button>
        </div>

        {/* Home Indicator line */}
        <div
          onClick={handleUnlock}
          className="w-36 h-1 bg-white/75 rounded-full hover:bg-white cursor-pointer active:scale-95 transition-all shadow-sm"
        />
      </div>
    </motion.div>
  );
};
