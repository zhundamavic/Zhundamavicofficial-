import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Sliders, Check, Sparkles } from 'lucide-react';
import { useLauncher, APPS, WALLPAPERS } from '../context/LauncherContext';
import { AppIcon } from './AppIcon';
import { WeatherWidget, BatteryWidget, ActivityWidget, CalendarWidget } from './Widgets';
import { AppLibrary } from './AppLibrary';
import { soundHaptics } from '../utils/haptics';

export const HomeScreen: React.FC = () => {
  const {
    openApp,
    setIsSpotlightOpen,
    isCustomizingHome,
    setIsCustomizingHome,
    iconStyle,
    setIconStyle,
    tintColor,
    setTintColor,
    iconSize,
    setIconSize,
    activeWallpaper,
    setWallpaper,
  } = useLauncher();

  const [activePage, setActivePage] = useState(1); // 0: Widgets, 1: Home 1, 2: Home 2, 3: App Library

  const page1Apps = APPS.slice(0, 8); // top 8 apps for page 1
  const page2Apps = APPS.slice(8, 16); // apps 8..16 for page 2
  const dockApps = APPS.slice(0, 4); // Phone, Safari, Messages, Music

  const tintColors = [
    '#38bdf8', // Sky
    '#f43f5e', // Rose
    '#eab308', // Amber
    '#a855f7', // Purple
    '#10b981', // Emerald
    '#f97316', // Orange
  ];

  return (
    <div className="relative w-full h-full flex flex-col justify-between pt-12 pb-3 overflow-hidden select-none">
      {/* Paged Content Container */}
      <div className="flex-1 w-full overflow-hidden relative">
        <motion.div
          className="flex h-full w-[400%]"
          animate={{ x: `-${activePage * 25}%` }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        >
          {/* PAGE 0: Widgets Screen (Today View) */}
          <div className="w-1/4 h-full px-5 overflow-y-auto pb-24">
            <div className="grid grid-cols-4 gap-3.5 pt-2">
              <WeatherWidget />
              <BatteryWidget />
              <ActivityWidget />
              <CalendarWidget />
            </div>
          </div>

          {/* PAGE 1: Main Home Screen (Weather Widget + 8 Apps) */}
          <div className="w-1/4 h-full px-5 overflow-y-auto pb-24 flex flex-col justify-between">
            <div className="grid grid-cols-4 gap-3.5 pt-2">
              <WeatherWidget />
              <div className="col-span-4 grid grid-cols-4 gap-y-4 gap-x-2 pt-2">
                {page1Apps.map((app) => (
                  <div key={app.id} className="flex justify-center">
                    <AppIcon app={app} onClick={() => openApp(app.id)} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* PAGE 2: Secondary Home Screen (Battery & Activity Widgets + remaining Apps) */}
          <div className="w-1/4 h-full px-5 overflow-y-auto pb-24 flex flex-col justify-between">
            <div className="grid grid-cols-4 gap-3.5 pt-2">
              <BatteryWidget />
              <ActivityWidget />
              <div className="col-span-4 grid grid-cols-4 gap-y-4 gap-x-2 pt-2">
                {page2Apps.map((app) => (
                  <div key={app.id} className="flex justify-center">
                    <AppIcon app={app} onClick={() => openApp(app.id)} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* PAGE 3: App Library */}
          <div className="w-1/4 h-full">
            <AppLibrary />
          </div>
        </motion.div>
      </div>

      {/* Page Navigation & Spotlight Pill */}
      <div className="flex flex-col items-center gap-2 mb-2 z-20">
        <div className="flex items-center gap-1.5 bg-black/25 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 shadow-sm">
          {[0, 1, 2, 3].map((page) => (
            <button
              key={page}
              onClick={() => {
                soundHaptics.playClick(800, 0.03);
                setActivePage(page);
              }}
              className={`transition-all rounded-full ${
                activePage === page ? 'w-2 h-2 bg-white' : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}

          <div className="w-[1px] h-3 bg-white/20 mx-1" />

          {/* Spotlight Search capsule button */}
          <button
            onClick={() => {
              soundHaptics.playClick(900, 0.05);
              setIsSpotlightOpen(true);
            }}
            className="flex items-center gap-1 text-[11px] font-bold text-white/90 hover:text-white px-1 active:scale-95 transition-transform"
          >
            <Search size={11} strokeWidth={2.5} />
            <span>Search</span>
          </button>

          {/* Customize Home Screen button */}
          <button
            onClick={() => {
              soundHaptics.playClick(950, 0.05);
              setIsCustomizingHome(!isCustomizingHome);
            }}
            className="text-white/70 hover:text-white p-0.5 active:scale-90"
            title="Customize iOS 18 Home Screen"
          >
            <Sliders size={12} />
          </button>
        </div>
      </div>

      {/* Dock (Iconic iOS Glassmorphism Bottom Dock) */}
      <div className="px-4 pb-2 z-20">
        <div className="w-full h-[88px] rounded-[32px] bg-white/25 dark:bg-black/35 backdrop-blur-3xl border border-white/30 dark:border-white/15 px-4 flex items-center justify-around shadow-2xl">
          {dockApps.map((app) => (
            <div key={app.id} className="flex justify-center">
              <AppIcon app={app} showName={false} onClick={() => openApp(app.id)} />
            </div>
          ))}
        </div>
      </div>

      {/* iOS 18 Customize Home Screen Bottom Drawer */}
      <AnimatePresence>
        {isCustomizingHome && (
          <motion.div
            initial={{ y: 200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 200, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="absolute bottom-0 left-0 right-0 z-50 bg-neutral-900/90 backdrop-blur-3xl border-t border-white/15 rounded-t-[32px] p-5 shadow-2xl text-white select-none"
          >
            <div className="w-10 h-1 bg-white/30 rounded-full mx-auto mb-4" />

            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-sm font-bold flex items-center gap-1.5">
                <Sparkles size={16} className="text-amber-400" />
                Customize iOS 18 Icons & Wallpapers
              </span>
              <button
                onClick={() => setIsCustomizingHome(false)}
                className="text-xs font-bold text-sky-400 hover:text-sky-300"
              >
                Done
              </button>
            </div>

            {/* Icon Style Tabs (Default, Dark, Tinted) */}
            <div className="flex flex-col gap-2 mt-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                Icon Appearance
              </span>
              <div className="grid grid-cols-3 gap-2 bg-neutral-800/80 p-1 rounded-2xl">
                {(['default', 'dark', 'tinted'] as const).map((style) => (
                  <button
                    key={style}
                    onClick={() => {
                      soundHaptics.playClick(900, 0.05);
                      setIconStyle(style);
                    }}
                    className={`py-2 text-xs font-semibold rounded-xl capitalize transition-all ${
                      iconStyle === style ? 'bg-white text-black shadow-md' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Tint Color Picker (if in tinted mode) */}
            {iconStyle === 'tinted' && (
              <div className="flex flex-col gap-2 mt-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  Tint Hue
                </span>
                <div className="flex items-center gap-2.5">
                  {tintColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        soundHaptics.playClick(900, 0.05);
                        setTintColor(color);
                      }}
                      className="w-7 h-7 rounded-full flex items-center justify-center transition-transform active:scale-90"
                      style={{ backgroundColor: color }}
                    >
                      {tintColor === color && <Check size={14} className="text-black font-bold" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Icon Size Toggle (Standard vs Large) */}
            <div className="flex flex-col gap-2 mt-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                Icon Size
              </span>
              <div className="grid grid-cols-2 gap-2 bg-neutral-800/80 p-1 rounded-2xl">
                {(['standard', 'large'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      soundHaptics.playClick(900, 0.05);
                      setIconSize(size);
                    }}
                    className={`py-2 text-xs font-semibold rounded-xl capitalize transition-all ${
                      iconSize === size ? 'bg-white text-black shadow-md' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {size === 'standard' ? 'Small (with text)' : 'Large (no text)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Wallpaper Selection */}
            <div className="flex flex-col gap-2 mt-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                Wallpapers
              </span>
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {WALLPAPERS.map((wp) => (
                  <div
                    key={wp.id}
                    onClick={() => {
                      soundHaptics.playClick(900, 0.05);
                      setWallpaper(wp);
                    }}
                    className={`w-14 h-24 rounded-xl shrink-0 cursor-pointer overflow-hidden border-2 transition-all relative ${
                      activeWallpaper.id === wp.id ? 'border-amber-400 scale-105 shadow-md' : 'border-white/20 opacity-70'
                    }`}
                  >
                    {wp.type === 'image' && wp.url ? (
                      <img src={wp.url} alt={wp.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full" style={{ background: wp.gradient }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
