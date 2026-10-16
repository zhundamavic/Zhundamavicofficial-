import React from 'react';
import {
  Smartphone,
  Maximize2,
  Lock,
  Unlock,
  Volume2,
  VolumeX,
  Camera,
  Layers,
  Sparkles,
  Bot,
  Mic,
} from 'lucide-react';
import { useLauncher } from '../context/LauncherContext';
import { StatusBar } from './StatusBar';
import { DynamicIsland } from './DynamicIsland';
import { CameraControl } from './CameraControl';
import { HomeScreen } from './HomeScreen';
import { LockScreen } from './LockScreen';
import { ActiveAppContainer } from './ActiveAppContainer';
import { ControlCenter } from './ControlCenter';
import { NotificationCenter } from './NotificationCenter';
import { SpotlightSearch } from './SpotlightSearch';
import { BootSequence } from './BootSequence';
import { PhoneBlankOverlay } from './PhoneBlankOverlay';
import { MavicAssistant } from './MavicAssistant';
import { MavicOrbAssistant } from './MavicOrbAssistant';
import { soundHaptics } from '../utils/haptics';

export const PhoneFrame: React.FC = () => {
  const {
    screenState,
    setScreenState,
    activeWallpaper,
    brightness,
    deviceMode,
    setDeviceMode,
    openApp,
    toggleFlashlight,
    isFlashlightOn,
    isMavicOnline,
    setIsMavicSheetOpen,
    executeMavicCommand,
    triggerMavicOrb,
  } = useLauncher();

  const isLocked = screenState === 'locked';

  const toggleLock = () => {
    if (isLocked) {
      soundHaptics.playClick(900, 0.05);
      setScreenState('home');
    } else {
      soundHaptics.playLockSound();
      setScreenState('locked');
    }
  };

  const handleActionButton = () => {
    soundHaptics.playClick(1000, 0.08);
    toggleFlashlight();
  };

  const handleMavicVoiceClick = () => {
    triggerMavicOrb();
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 flex flex-col items-center justify-start select-none py-3 px-2">
      {/* Top Application Header / Studio Navigation Bar */}
      <header className="w-full max-w-5xl flex items-center justify-between gap-6 px-4 py-2.5 mb-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-100 shadow-xl backdrop-blur-md">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-sm">
            <Smartphone size={16} />
          </div>
          <span className="text-sm font-bold tracking-tight text-white whitespace-nowrap">
            iPhone 16 Launcher for Android
          </span>
          <span className="hidden sm:inline text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded-full">
            Mavic OS
          </span>
        </div>

        {/* Zone 2: Navigation / Quick Features */}
        <div className="hidden md:flex items-center gap-4 text-xs font-medium text-slate-300">
          <button
            onClick={handleMavicVoiceClick}
            className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 whitespace-nowrap text-emerald-300"
            title="Invoke MAVIC Voice Assistant ('Hi Mavic')"
          >
            <Mic size={14} className="text-emerald-400 animate-pulse" />
            <span>Say &quot;Hi Mavic&quot;</span>
          </button>
          <button
            onClick={() => openApp('settings')}
            className="hover:text-white transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <Sparkles size={14} className="text-amber-400" />
            <span>Launcher Settings</span>
          </button>
          <button
            onClick={() => openApp('camera')}
            className="hover:text-white transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <Camera size={14} className="text-sky-400" />
            <span>Camera Control</span>
          </button>
        </div>

        {/* Zone 3: Primary Action Bar */}
        <div className="flex items-center gap-2 shrink-0">
          {/* MAVIC Assistant Trigger */}
          <button
            onClick={handleMavicVoiceClick}
            className="px-2.5 py-1.5 rounded-lg bg-emerald-600/20 border border-emerald-500/40 hover:bg-emerald-600/30 text-xs font-semibold text-emerald-300 flex items-center gap-1.5 transition-colors"
            title="Open MAVIC Assistant"
          >
            <Bot size={14} className="text-emerald-400" />
            <span className="hidden sm:inline">MAVIC</span>
          </button>

          {/* Lock / Unlock Toggle */}
          <button
            onClick={toggleLock}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors"
            title="Lock or Unlock iPhone 16"
          >
            {isLocked ? <Unlock size={14} className="text-emerald-400" /> : <Lock size={14} className="text-amber-400" />}
            <span className="hidden sm:inline">{isLocked ? 'Unlock' : 'Lock'}</span>
          </button>

          {/* Fullscreen vs Frame Toggle */}
          <button
            onClick={() => {
              soundHaptics.playClick(900, 0.05);
              setDeviceMode(deviceMode === 'frame' ? 'fullscreen' : 'frame');
            }}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white flex items-center gap-1.5 shadow-sm transition-colors whitespace-nowrap"
          >
            <Maximize2 size={13} />
            <span>{deviceMode === 'frame' ? 'Fullscreen Mode' : 'Phone Frame'}</span>
          </button>
        </div>
      </header>

      {/* Main Launcher Viewport */}
      <div className="relative flex items-center justify-center w-full max-w-full">
        {deviceMode === 'frame' ? (
          /* IPHONE 16 PRO TITANIUM CHASSIS CONTAINER */
          <div className="relative flex items-center justify-center p-2">
            {/* Action Button (Left upper) */}
            <button
              onClick={handleActionButton}
              className={`absolute -left-2 top-28 w-2 h-9 rounded-l-md transition-all active:scale-95 cursor-pointer z-10 ${
                isFlashlightOn ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b]' : 'bg-neutral-600 hover:bg-neutral-500'
              }`}
              title="Action Button (Tap to toggle Flashlight)"
            />

            {/* Volume Up (Left middle) */}
            <div
              className="absolute -left-2 top-42 w-2 h-14 rounded-l-md bg-neutral-600 z-10"
              title="Volume Up"
            />

            {/* Volume Down (Left lower) */}
            <div
              className="absolute -left-2 top-60 w-2 h-14 rounded-l-md bg-neutral-600 z-10"
              title="Volume Down"
            />

            {/* Power Button (Right upper) */}
            <button
              onClick={toggleLock}
              className="absolute -right-2 top-36 w-2 h-20 rounded-r-md bg-neutral-600 hover:bg-neutral-500 transition-all active:scale-95 cursor-pointer z-10"
              title="Power Button (Click to Lock/Unlock)"
            />

            {/* iPhone 16 Camera Control Button (Right lower) */}
            <CameraControl />

            {/* Titanium Body Outer Shell */}
            <div className="w-[395px] h-[815px] max-w-[94vw] max-h-[88vh] rounded-[55px] p-3.5 bg-gradient-to-tr from-[#2a292d] via-[#48464c] to-[#252427] shadow-[0_25px_70px_rgba(0,0,0,0.85)] border-[1.5px] border-neutral-600/70 flex items-center justify-center relative">
              {/* Screen Bezel & Display */}
              <div
                className="w-full h-full rounded-[44px] overflow-hidden relative shadow-inner bg-black flex flex-col justify-between"
                style={{
                  filter: `brightness(${brightness}%)`,
                }}
              >
                {/* Wallpaper Canvas */}
                <div className="absolute inset-0 z-0">
                  {activeWallpaper.type === 'image' && activeWallpaper.url ? (
                    <img
                      src={activeWallpaper.url}
                      alt="Wallpaper"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-all duration-500"
                    />
                  ) : (
                    <div
                      className="w-full h-full transition-all duration-500"
                      style={{ background: activeWallpaper.gradient }}
                    />
                  )}
                  {/* Subtle darkening vignette overlay */}
                  <div className="absolute inset-0 bg-black/15 pointer-events-none" />
                </div>

                {/* Status Bar */}
                <StatusBar />

                {/* Dynamic Island with MAVIC AI Green Status Dot */}
                <DynamicIsland />

                {/* Active Screen Layers */}
                {screenState === 'locked' && <LockScreen />}
                {screenState === 'home' && <HomeScreen />}
                {screenState === 'app' && <ActiveAppContainer />}

                {/* Overlays */}
                <ControlCenter />
                <NotificationCenter />
                <SpotlightSearch />

                {/* MAVIC Assistant Bottom Sheet */}
                <MavicAssistant />

                {/* MAVIC Rolling Colors Orb & Transparent Floating Response Page */}
                <MavicOrbAssistant />

                {/* Bedtime 30-min Blank Screen Downtime */}
                <PhoneBlankOverlay />

                {/* Boot Sequence Overlay */}
                <BootSequence />
              </div>
            </div>
          </div>
        ) : (
          /* FULLSCREEN ANDROID LAUNCHER MODE */
          <div
            className="w-full max-w-md h-[840px] max-h-[92vh] rounded-[36px] overflow-hidden relative shadow-2xl bg-black border border-neutral-800 flex flex-col justify-between"
            style={{
              filter: `brightness(${brightness}%)`,
            }}
          >
            {/* Wallpaper Canvas */}
            <div className="absolute inset-0 z-0">
              {activeWallpaper.type === 'image' && activeWallpaper.url ? (
                <img
                  src={activeWallpaper.url}
                  alt="Wallpaper"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-all duration-500"
                />
              ) : (
                <div
                  className="w-full h-full transition-all duration-500"
                  style={{ background: activeWallpaper.gradient }}
                />
              )}
              <div className="absolute inset-0 bg-black/15 pointer-events-none" />
            </div>

            {/* Status Bar */}
            <StatusBar />

            {/* Dynamic Island with MAVIC AI Green Status Dot */}
            <DynamicIsland />

            {/* Camera Control overlay button */}
            <CameraControl />

            {/* Active Screen Layers */}
            {screenState === 'locked' && <LockScreen />}
            {screenState === 'home' && <HomeScreen />}
            {screenState === 'app' && <ActiveAppContainer />}

            {/* Overlays */}
            <ControlCenter />
            <NotificationCenter />
            <SpotlightSearch />

            {/* MAVIC Assistant Bottom Sheet */}
            <MavicAssistant />

            {/* MAVIC Rolling Colors Orb & Transparent Floating Response Page */}
            <MavicOrbAssistant />

            {/* Bedtime 30-min Blank Screen Downtime */}
            <PhoneBlankOverlay />

            {/* Boot Sequence Overlay */}
            <BootSequence />
          </div>
        )}
      </div>
    </div>
  );
};
