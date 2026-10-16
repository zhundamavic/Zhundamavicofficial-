import React, { useState } from 'react';
import {
  User,
  Sliders,
  Image as ImageIcon,
  Palette,
  Volume2,
  Sun,
  Camera,
  Smartphone,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Check,
  Mic,
  RotateCcw,
  Bot,
  Database,
  PowerOff,
  Moon,
  Droplets,
  Footprints,
  Heart,
  PhoneCall,
  WifiOff,
} from 'lucide-react';
import { useLauncher, WALLPAPERS } from '../../context/LauncherContext';
import { soundHaptics } from '../../utils/haptics';

export const SettingsApp: React.FC = () => {
  const {
    userName,
    setUserName,
    replayBootSequence,
    isStockLauncherDisabled,
    setIsStockLauncherDisabled,
    isMavicOnline,
    setIsMavicOnline,
    startMavicListening,
    executeMavicCommand,
    setIsMavicSheetOpen,
    activeWallpaper,
    setWallpaper,
    iconStyle,
    setIconStyle,
    tintColor,
    setTintColor,
    iconSize,
    setIconSize,
    brightness,
    deviceMode,
    setDeviceMode,
    isInternetConnected,
    setIsInternetConnected,
    triggerMavicOrb,
    sleepSchedule,
    setSleepSchedule,
    isBedtimeActivated,
    setIsBedtimeActivated,
    activateBedtime,
    deactivateBedtime,
    isPhoneBlank,
    setIsPhoneBlank,
    triggerWakeUpMorning,
    askWaterPrompt,
    speakAlarms,
    speakSchedules,
    speakWeatherForecast,
    openApp,
  } = useLauncher();

  const [nameInput, setNameInput] = useState(userName);
  const [isSaved, setIsSaved] = useState(false);
  const [bedtimeInput, setBedtimeInput] = useState(sleepSchedule.bedtime);
  const [wakeUpInput, setWakeUpInput] = useState(sleepSchedule.wakeUpTime);
  const [scheduleSaved, setScheduleSaved] = useState(false);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    soundHaptics.playClick(1000, 0.08);
    setUserName(nameInput.trim());
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleTestHiMavic = () => {
    soundHaptics.playClick(1100, 0.08);
    setIsMavicSheetOpen(true);
    executeMavicCommand('Hi Mavic');
  };

  const tintColors = ['#38bdf8', '#f43f5e', '#eab308', '#a855f7', '#10b981', '#f97316'];

  return (
    <div className="w-full h-full bg-[#f2f2f7] dark:bg-[#000000] text-slate-900 dark:text-white pt-12 pb-24 px-4 overflow-y-auto select-none">
      <h1 className="text-2xl font-bold tracking-tight mb-4 px-2">Settings</h1>

      {/* Apple ID Profile Card featuring Customized User Name */}
      <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl p-4 shadow-sm flex items-center gap-3.5 mb-5 border border-slate-200/60 dark:border-white/5">
        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
          <User size={28} />
        </div>
        <div className="flex-1">
          <h2 className="text-base font-semibold leading-snug">{userName}</h2>
          <p className="text-xs text-slate-500 dark:text-neutral-400">
            iPhone 16 Launcher · Mavic OS
          </p>
        </div>
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" title="Mavic OS Active" />
      </div>

      {/* DEDICATED LAUNCHER SETTINGS SECTION (Can only be found in phone settings) */}
      <div className="mb-5">
        <div className="flex items-center gap-1.5 px-3 mb-1.5">
          <Sparkles size={14} className="text-amber-500" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
            Launcher Settings (Mavic OS)
          </span>
        </div>

        <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl p-4 shadow-sm border border-slate-200/60 dark:border-white/5 flex flex-col gap-4">
          {/* User Name Customizer */}
          <div>
            <label className="text-xs font-semibold block mb-1">
              Customize Owner Name on Startup
            </label>
            <p className="text-[11px] text-slate-500 dark:text-neutral-400 mb-2">
              Shown after boot loading finishes, above &quot;powered by zhundamavicofficial&quot;
            </p>
            <form onSubmit={handleSaveName} className="flex gap-2">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Enter your name"
                className="flex-1 bg-slate-100 dark:bg-neutral-800 border border-slate-300 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 font-semibold"
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-transform active:scale-95 flex items-center gap-1 shrink-0"
              >
                {isSaved ? <Check size={14} /> : null}
                <span>{isSaved ? 'Saved' : 'Save'}</span>
              </button>
            </form>

            {/* Live Startup Preview Pill */}
            <div className="mt-3 p-3 rounded-xl bg-slate-100 dark:bg-neutral-900/80 border border-slate-200 dark:border-neutral-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-mono">Startup Display Preview</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{userName}</span>
                <span className="text-[10px] text-slate-500 dark:text-neutral-400 block">powered by zhundamavicofficial</span>
              </div>
              <button
                type="button"
                onClick={replayBootSequence}
                className="px-2.5 py-1.5 rounded-lg bg-slate-200 dark:bg-neutral-800 hover:bg-slate-300 dark:hover:bg-neutral-700 text-[11px] font-semibold flex items-center gap-1 active:scale-95 transition-all text-slate-800 dark:text-neutral-200"
              >
                <RotateCcw size={12} />
                <span>Replay Boot</span>
              </button>
            </div>
          </div>

          {/* Stock Launcher Auto-Disabled Status */}
          <div className="pt-2 border-t border-slate-100 dark:border-neutral-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold block">Stock Android Launcher</span>
              <span className="text-[11px] text-slate-500 dark:text-neutral-400">
                Automatically disabled when iPhone 16 launcher is activated
              </span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
              <PowerOff size={11} />
              <span>Disabled</span>
            </span>
          </div>
        </div>
      </div>

      {/* MAVIC OFFLINE AI ASSISTANT SECTION */}
      <div className="mb-5">
        <div className="flex items-center gap-1.5 px-3 mb-1.5">
          <Bot size={14} className="text-emerald-500" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
            MAVIC Offline AI Voice Assistant
          </span>
        </div>

        <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl p-4 shadow-sm border border-slate-200/60 dark:border-white/5 flex flex-col gap-3.5">
          {/* Assistant Online Switch */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold block">MAVIC AI Online State</span>
                {isMavicOnline && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
                )}
              </div>
              <span className="text-[11px] text-slate-500 dark:text-neutral-400">
                Dynamic Island stays active with green indicator dot
              </span>
            </div>
            <button
              onClick={() => {
                soundHaptics.playClick(900, 0.05);
                setIsMavicOnline(!isMavicOnline);
              }}
              className={`w-12 h-7 rounded-full transition-colors relative p-1 ${
                isMavicOnline ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-neutral-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  isMavicOnline ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Test 'Hi Mavic' Setup Flow */}
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 rounded-xl flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                Wake Word: &quot;Hi Mavic&quot;
              </span>
              <button
                onClick={handleTestHiMavic}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 active:scale-95 transition-transform"
              >
                <Mic size={13} />
                <span>Test Flow</span>
              </button>
            </div>
            <p className="text-[11px] text-emerald-800 dark:text-emerald-400 leading-relaxed">
              When triggered, MAVIC says: &quot;Hi, I&apos;m Mavic. Pls what is your name?&quot; Documents your response into the offline database, then announces: &quot;Hi {userName}, I&apos;m always available at your service, call my name whenever you need me.&quot;
            </p>
          </div>

          {/* Dynamic Island Rolling Colors Orb & Network Mode */}
          <div className="p-3 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/40 rounded-xl flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-purple-900 dark:text-purple-300 block">
                  Dynamic Island Rolling Colors Orb
                </span>
                <span className="text-[10px] text-purple-700 dark:text-purple-400">
                  Tap Dynamic Island anytime to summon rolling colors orb at bottom
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  soundHaptics.playClick(1000, 0.08);
                  triggerMavicOrb();
                }}
                className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold active:scale-95 transition-transform"
              >
                Summon Orb
              </button>
            </div>

            {/* Internet Connectivity Toggle */}
            <div className="pt-2 border-t border-purple-200 dark:border-purple-900/40 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold block text-slate-900 dark:text-white">
                  Internet Connectivity State
                </span>
                <span className="text-[10px] text-slate-500 dark:text-neutral-400">
                  {isInternetConnected
                    ? 'Online: Colors disappear & transparent floating response page appears'
                    : 'Offline: Colors break into geometric shapes & roll'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  soundHaptics.playClick(850, 0.05);
                  setIsInternetConnected(!isInternetConnected);
                }}
                className={`w-12 h-7 rounded-full transition-colors relative p-1 ${
                  isInternetConnected ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    isInternetConnected ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Full Device Control Status */}
          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-neutral-800">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-neutral-300">
              <Database size={14} className="text-indigo-500" />
              <span>Offline Database</span>
            </div>
            <span className="text-[11px] font-mono text-emerald-500 font-semibold">
              Synced ({userName})
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-neutral-300">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>Device Errands & Permissions</span>
            </div>
            <span className="text-[11px] font-mono text-emerald-500 font-semibold">
              Full Control Active
            </span>
          </div>
        </div>
      </div>

      {/* SLEEP, BEDTIME & HEALTH AUTOMATION SETTINGS */}
      <div className="mb-5">
        <div className="flex items-center gap-1.5 px-3 mb-1.5">
          <Moon size={14} className="text-indigo-400" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
            Sleep, Bedtime &amp; Health Automations
          </span>
        </div>

        <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl p-4 shadow-sm border border-slate-200/60 dark:border-white/5 flex flex-col gap-3.5">
          <div>
            <h3 className="text-xs font-semibold block mb-1">
              Sleeping Time &amp; Wake Up Schedule
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-neutral-400 mb-2">
              Phone automatically goes blank 30 min after sleeping time is activated, disabling internet access until morning wake-up at 06:00 AM.
            </p>

            <div className="grid grid-cols-2 gap-2 my-2">
              <div className="bg-slate-100 dark:bg-neutral-800 p-2.5 rounded-xl border border-slate-200 dark:border-neutral-700">
                <span className="text-[10px] font-bold text-neutral-400 block uppercase font-mono">
                  Bedtime
                </span>
                <input
                  type="time"
                  value={bedtimeInput}
                  onChange={(e) => setBedtimeInput(e.target.value)}
                  className="w-full bg-transparent text-sm font-bold text-slate-900 dark:text-white focus:outline-none mt-1"
                />
              </div>

              <div className="bg-slate-100 dark:bg-neutral-800 p-2.5 rounded-xl border border-slate-200 dark:border-neutral-700">
                <span className="text-[10px] font-bold text-neutral-400 block uppercase font-mono">
                  Wake Up (06:00 AM)
                </span>
                <input
                  type="time"
                  value={wakeUpInput}
                  onChange={(e) => setWakeUpInput(e.target.value)}
                  className="w-full bg-transparent text-sm font-bold text-slate-900 dark:text-white focus:outline-none mt-1"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                soundHaptics.playClick(1000, 0.08);
                setSleepSchedule({
                  ...sleepSchedule,
                  bedtime: bedtimeInput,
                  wakeUpTime: wakeUpInput,
                });
                setScheduleSaved(true);
                setTimeout(() => setScheduleSaved(false), 2000);
              }}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-transform active:scale-95 flex items-center justify-center gap-1.5 shadow-sm mt-1"
            >
              {scheduleSaved ? <Check size={14} /> : null}
              <span>{scheduleSaved ? 'Schedule Saved in Mavic OS' : 'Save Sleep Settings'}</span>
            </button>
          </div>

          {/* Quick Automation Actions */}
          <div className="pt-2 border-t border-slate-100 dark:border-neutral-800 flex flex-col gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
              Interactive Voice &amp; Health Errand Triggers
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  soundHaptics.playClick(1000, 0.08);
                  setIsBedtimeActivated(true);
                  setIsPhoneBlank(true);
                }}
                className="py-2 px-2.5 rounded-xl bg-slate-100 dark:bg-neutral-800 hover:bg-slate-200 dark:hover:bg-neutral-700 text-indigo-400 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-200 dark:border-neutral-700 active:scale-95"
              >
                <Moon size={13} />
                <span>Test 30m Blank Screen</span>
              </button>

              <button
                onClick={triggerWakeUpMorning}
                className="py-2 px-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-950/50 text-amber-600 dark:text-amber-300 text-xs font-semibold flex items-center justify-center gap-1.5 border border-amber-200 dark:border-amber-800/40 active:scale-95"
              >
                <Sun size={13} />
                <span>Simulate 06:00 AM Wake</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={askWaterPrompt}
                className="py-2 px-1 rounded-xl bg-sky-50 dark:bg-sky-950/30 text-sky-500 dark:text-sky-300 text-[11px] font-semibold flex items-center justify-center gap-1 border border-sky-200 dark:border-sky-800/40 active:scale-95"
              >
                <Droplets size={12} />
                <span>Water Check</span>
              </button>

              <button
                onClick={speakAlarms}
                className="py-2 px-1 rounded-xl bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300 text-[11px] font-semibold flex items-center justify-center gap-1 border border-slate-200 dark:border-neutral-700 active:scale-95"
              >
                <Volume2 size={12} />
                <span>Speak Alarms</span>
              </button>

              <button
                onClick={speakSchedules}
                className="py-2 px-1 rounded-xl bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300 text-[11px] font-semibold flex items-center justify-center gap-1 border border-slate-200 dark:border-neutral-700 active:scale-95"
              >
                <Volume2 size={12} />
                <span>Read Schedule</span>
              </button>
            </div>

            <button
              onClick={() => openApp('health')}
              className="w-full mt-1 py-2 bg-emerald-600/15 hover:bg-emerald-600/25 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
            >
              <Heart size={14} />
              <span>Open Mavic Health App (Full Dashboard)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Wallpapers Section */}
      <div className="mb-5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400 px-3 mb-1.5 block">
          Wallpapers
        </span>
        <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl p-4 shadow-sm border border-slate-200/60 dark:border-white/5 flex flex-col gap-3">
          <div className="grid grid-cols-3 gap-3">
            {WALLPAPERS.map((wp) => (
              <div
                key={wp.id}
                onClick={() => {
                  soundHaptics.playClick(900, 0.05);
                  setWallpaper(wp);
                }}
                className={`h-28 rounded-xl overflow-hidden cursor-pointer border-2 transition-all relative ${
                  activeWallpaper.id === wp.id
                    ? 'border-blue-500 scale-102 shadow-md'
                    : 'border-transparent opacity-75 hover:opacity-100'
                }`}
              >
                {wp.type === 'image' && wp.url ? (
                  <img src={wp.url} alt={wp.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full" style={{ background: wp.gradient }} />
                )}
                <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-sm p-1 text-[9px] text-white text-center font-semibold truncate">
                  {wp.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* iOS 18 Icon Appearance */}
      <div className="mb-5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400 px-3 mb-1.5 block">
          Home Screen & App Icons (iOS 18)
        </span>
        <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl p-4 shadow-sm border border-slate-200/60 dark:border-white/5 flex flex-col gap-4">
          <div>
            <span className="text-xs font-semibold block mb-2">Icon Theme</span>
            <div className="grid grid-cols-3 gap-2 bg-slate-100 dark:bg-neutral-800 p-1 rounded-xl">
              {(['default', 'dark', 'tinted'] as const).map((style) => (
                <button
                  key={style}
                  onClick={() => {
                    soundHaptics.playClick(900, 0.05);
                    setIconStyle(style);
                  }}
                  className={`py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
                    iconStyle === style
                      ? 'bg-white dark:bg-neutral-900 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 dark:text-neutral-400'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {iconStyle === 'tinted' && (
            <div>
              <span className="text-xs font-semibold block mb-2">Tint Palette</span>
              <div className="flex gap-3">
                {tintColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      soundHaptics.playClick(900, 0.05);
                      setTintColor(color);
                    }}
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-transform active:scale-90"
                    style={{ backgroundColor: color }}
                  >
                    {tintColor === color && <Check size={16} className="text-black font-bold" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <span className="text-xs font-semibold block mb-2">Icon Dimensions</span>
            <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-neutral-800 p-1 rounded-xl">
              {(['standard', 'large'] as const).map((sz) => (
                <button
                  key={sz}
                  onClick={() => {
                    soundHaptics.playClick(900, 0.05);
                    setIconSize(sz);
                  }}
                  className={`py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
                    iconSize === sz
                      ? 'bg-white dark:bg-neutral-900 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 dark:text-neutral-400'
                  }`}
                >
                  {sz === 'standard' ? 'Standard' : 'Large (Hide Text)'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Device Frame & Viewport */}
      <div className="mb-5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400 px-3 mb-1.5 block">
          Device Frame & Viewport
        </span>
        <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl p-4 shadow-sm border border-slate-200/60 dark:border-white/5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold block">Titanium Phone Chassis</span>
              <span className="text-[11px] text-slate-500 dark:text-neutral-400">
                Display iPhone 16 hardware borders and Camera Control button
              </span>
            </div>
            <button
              onClick={() => {
                soundHaptics.playClick(900, 0.05);
                setDeviceMode(deviceMode === 'frame' ? 'fullscreen' : 'frame');
              }}
              className={`w-12 h-7 rounded-full transition-colors relative p-1 ${
                deviceMode === 'frame' ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-neutral-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  deviceMode === 'frame' ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
