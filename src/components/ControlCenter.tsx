import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wifi,
  Bluetooth,
  Plane,
  Radio,
  Play,
  Pause,
  SkipForward,
  Sun,
  Volume2,
  Flashlight,
  Moon,
  Calculator,
  Camera,
  Timer,
  BatteryMedium,
  Tv,
} from 'lucide-react';
import { useLauncher } from '../context/LauncherContext';
import { soundHaptics } from '../utils/haptics';

export const ControlCenter: React.FC = () => {
  const {
    isControlCenterOpen,
    setIsControlCenterOpen,
    brightness,
    setBrightness,
    volume,
    setVolume,
    isFlashlightOn,
    toggleFlashlight,
    dynamicIsland,
    toggleMediaPlayback,
    focusMode,
    setFocusMode,
    isLowPowerMode,
    setIsLowPowerMode,
    openApp,
    startLiveTimer,
  } = useLauncher();

  const [isWifiOn, setIsWifiOn] = React.useState(true);
  const [isBluetoothOn, setIsBluetoothOn] = React.useState(true);
  const [isAirplaneOn, setIsAirplaneOn] = React.useState(false);
  const [isCellularOn, setIsCellularOn] = React.useState(true);

  if (!isControlCenterOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsControlCenterOpen(false)}
        className="absolute inset-0 z-50 bg-black/60 backdrop-blur-2xl flex flex-col pt-12 pb-6 px-5 select-none overflow-y-auto"
      >
        <motion.div
          initial={{ y: -40, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -40, opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-sm mx-auto flex flex-col gap-3.5"
        >
          {/* Top Row: Connectivity Pod + Media Pod */}
          <div className="grid grid-cols-2 gap-3.5">
            {/* 1. Connectivity 2x2 Pod */}
            <div className="bg-neutral-900/80 border border-white/10 rounded-3xl p-3 grid grid-cols-2 gap-2 shadow-xl backdrop-blur-xl">
              {/* Airplane */}
              <button
                onClick={() => {
                  soundHaptics.playClick(900, 0.05);
                  setIsAirplaneOn(!isAirplaneOn);
                }}
                className={`w-11 h-11 mx-auto rounded-full flex items-center justify-center transition-colors active:scale-90 ${
                  isAirplaneOn ? 'bg-amber-500 text-white' : 'bg-white/10 text-white/80 hover:bg-white/15'
                }`}
              >
                <Plane size={20} />
              </button>

              {/* Cellular */}
              <button
                onClick={() => {
                  soundHaptics.playClick(900, 0.05);
                  setIsCellularOn(!isCellularOn);
                }}
                className={`w-11 h-11 mx-auto rounded-full flex items-center justify-center transition-colors active:scale-90 ${
                  isCellularOn && !isAirplaneOn ? 'bg-emerald-500 text-white' : 'bg-white/10 text-white/40'
                }`}
              >
                <Radio size={20} />
              </button>

              {/* Wi-Fi */}
              <button
                onClick={() => {
                  soundHaptics.playClick(900, 0.05);
                  setIsWifiOn(!isWifiOn);
                }}
                className={`w-11 h-11 mx-auto rounded-full flex items-center justify-center transition-colors active:scale-90 ${
                  isWifiOn && !isAirplaneOn ? 'bg-blue-500 text-white' : 'bg-white/10 text-white/40'
                }`}
              >
                <Wifi size={20} />
              </button>

              {/* Bluetooth */}
              <button
                onClick={() => {
                  soundHaptics.playClick(900, 0.05);
                  setIsBluetoothOn(!isBluetoothOn);
                }}
                className={`w-11 h-11 mx-auto rounded-full flex items-center justify-center transition-colors active:scale-90 ${
                  isBluetoothOn ? 'bg-blue-500 text-white' : 'bg-white/10 text-white/40'
                }`}
              >
                <Bluetooth size={20} />
              </button>
            </div>

            {/* 2. Media Pod */}
            <div className="bg-neutral-900/80 border border-white/10 rounded-3xl p-3.5 flex flex-col justify-between shadow-xl backdrop-blur-xl">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-white/50 block">Now Playing</span>
                <span className="text-xs font-semibold text-white truncate block mt-0.5">
                  {dynamicIsland.media?.title || 'Music'}
                </span>
                <span className="text-[11px] text-white/60 truncate block">
                  {dynamicIsland.media?.artist || 'Apple Music'}
                </span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={toggleMediaPlayback}
                  className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center active:scale-90 transition-transform"
                >
                  {dynamicIsland.media?.isPlaying ? (
                    <Pause size={18} className="fill-black" />
                  ) : (
                    <Play size={18} className="fill-black ml-0.5" />
                  )}
                </button>
                <button
                  onClick={() => soundHaptics.playClick(800, 0.05)}
                  className="p-2 text-white/70 hover:text-white active:scale-90"
                >
                  <SkipForward size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Middle Row: Focus Pill + Screen Mirroring + Sliders */}
          <div className="grid grid-cols-2 gap-3.5">
            {/* Left Column: Focus + Screen Mirroring */}
            <div className="flex flex-col gap-3.5">
              {/* Focus Pill */}
              <button
                onClick={() => {
                  soundHaptics.playClick(950, 0.05);
                  const modes: ('None' | 'Do Not Disturb' | 'Work' | 'Sleep')[] = ['None', 'Do Not Disturb', 'Work', 'Sleep'];
                  const next = modes[(modes.indexOf(focusMode) + 1) % modes.length];
                  setFocusMode(next);
                }}
                className={`h-[68px] rounded-3xl border border-white/10 flex items-center gap-3 px-3.5 shadow-xl transition-all active:scale-95 ${
                  focusMode !== 'None' ? 'bg-indigo-600/90 text-white' : 'bg-neutral-900/80 text-white/90 hover:bg-neutral-900'
                }`}
              >
                <Moon size={22} className={focusMode !== 'None' ? 'fill-current' : ''} />
                <div className="text-left">
                  <span className="text-xs font-bold block">Focus</span>
                  <span className="text-[11px] text-white/70 block truncate">
                    {focusMode === 'None' ? 'Off' : focusMode}
                  </span>
                </div>
              </button>

              {/* Screen Mirroring */}
              <button
                onClick={() => soundHaptics.playClick(800, 0.05)}
                className="h-[68px] rounded-3xl bg-neutral-900/80 hover:bg-neutral-900 border border-white/10 flex items-center gap-3 px-3.5 text-white/90 shadow-xl transition-all active:scale-95"
              >
                <Tv size={22} />
                <div className="text-left">
                  <span className="text-xs font-bold block">AirPlay</span>
                  <span className="text-[11px] text-white/50 block">Living Room TV</span>
                </div>
              </button>
            </div>

            {/* Right Column: Brightness & Volume Sliders (iOS 18 pill sliders) */}
            <div className="grid grid-cols-2 gap-2.5 h-[150px]">
              {/* Brightness Slider */}
              <div className="relative rounded-3xl bg-neutral-800/90 border border-white/10 overflow-hidden flex flex-col justify-end shadow-xl">
                <div
                  className="bg-white w-full transition-all duration-75"
                  style={{ height: `${brightness}%` }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-between py-3 pointer-events-none">
                  <span className="text-[10px] font-mono font-bold text-neutral-400 tabular-nums">
                    {brightness}%
                  </span>
                  <Sun size={20} className={brightness > 35 ? 'text-neutral-900' : 'text-white'} />
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={brightness}
                  onChange={(e) => {
                    setBrightness(Number(e.target.value));
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer h-full w-full"
                />
              </div>

              {/* Volume Slider */}
              <div className="relative rounded-3xl bg-neutral-800/90 border border-white/10 overflow-hidden flex flex-col justify-end shadow-xl">
                <div
                  className="bg-white w-full transition-all duration-75"
                  style={{ height: `${volume}%` }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-between py-3 pointer-events-none">
                  <span className="text-[10px] font-mono font-bold text-neutral-400 tabular-nums">
                    {volume}%
                  </span>
                  <Volume2 size={20} className={volume > 35 ? 'text-neutral-900' : 'text-white'} />
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setVolume(v);
                    soundHaptics.playClick(400 + v * 5, 0.03);
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer h-full w-full"
                />
              </div>
            </div>
          </div>

          {/* Bottom Grid: 4 Quick Action Pods */}
          <div className="grid grid-cols-4 gap-3">
            {/* Flashlight */}
            <button
              onClick={toggleFlashlight}
              className={`h-16 rounded-2xl flex flex-col items-center justify-center transition-all active:scale-90 border border-white/10 ${
                isFlashlightOn ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.6)]' : 'bg-neutral-900/80 text-white'
              }`}
            >
              <Flashlight size={20} className={isFlashlightOn ? 'fill-current' : ''} />
              <span className="text-[9.5px] font-bold mt-1">Torch</span>
            </button>

            {/* Camera */}
            <button
              onClick={() => {
                setIsControlCenterOpen(false);
                openApp('camera');
              }}
              className="h-16 rounded-2xl bg-neutral-900/80 hover:bg-neutral-900 text-white flex flex-col items-center justify-center transition-all active:scale-90 border border-white/10"
            >
              <Camera size={20} />
              <span className="text-[9.5px] font-bold mt-1">Camera</span>
            </button>

            {/* Calculator */}
            <button
              onClick={() => {
                setIsControlCenterOpen(false);
                openApp('calculator');
              }}
              className="h-16 rounded-2xl bg-neutral-900/80 hover:bg-neutral-900 text-white flex flex-col items-center justify-center transition-all active:scale-90 border border-white/10"
            >
              <Calculator size={20} />
              <span className="text-[9.5px] font-bold mt-1">Calc</span>
            </button>

            {/* Timer -> starts 5 min in Dynamic Island */}
            <button
              onClick={() => {
                startLiveTimer(300, '5 Min Timer');
                setIsControlCenterOpen(false);
              }}
              className="h-16 rounded-2xl bg-neutral-900/80 hover:bg-neutral-900 text-white flex flex-col items-center justify-center transition-all active:scale-90 border border-white/10"
            >
              <Timer size={20} />
              <span className="text-[9.5px] font-bold mt-1">Timer</span>
            </button>
          </div>

          {/* Swipe indicator */}
          <div
            onClick={() => setIsControlCenterOpen(false)}
            className="w-28 h-1 bg-white/40 rounded-full mx-auto mt-2 cursor-pointer hover:bg-white/80 active:scale-95 transition-all"
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
