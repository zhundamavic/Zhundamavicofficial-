import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLauncher } from '../context/LauncherContext';
import { CameraApp } from './apps/CameraApp';
import { SettingsApp } from './apps/SettingsApp';
import { WeatherApp } from './apps/WeatherApp';
import { CalculatorApp } from './apps/CalculatorApp';
import { NotesApp } from './apps/NotesApp';
import { PhotosApp } from './apps/PhotosApp';
import { SafariApp } from './apps/SafariApp';
import { ClockApp } from './apps/ClockApp';
import { PhoneApp } from './apps/PhoneApp';
import { MessagesApp } from './apps/MessagesApp';
import { MusicApp } from './apps/MusicApp';
import { HealthApp } from './apps/HealthApp';
import { soundHaptics } from '../utils/haptics';

export const ActiveAppContainer: React.FC = () => {
  const { activeAppId, closeApp } = useLauncher();

  if (!activeAppId) return null;

  const renderAppContent = () => {
    switch (activeAppId) {
      case 'camera':
        return <CameraApp />;
      case 'settings':
        return <SettingsApp />;
      case 'weather':
        return <WeatherApp />;
      case 'calculator':
        return <CalculatorApp />;
      case 'notes':
        return <NotesApp />;
      case 'photos':
        return <PhotosApp />;
      case 'safari':
        return <SafariApp />;
      case 'clock':
        return <ClockApp />;
      case 'phone':
        return <PhoneApp />;
      case 'messages':
        return <MessagesApp />;
      case 'music':
        return <MusicApp />;
      case 'health':
        return <HealthApp />;
      case 'reminders':
        return <NotesApp />;
      case 'maps':
      case 'appstore':
      case 'files':
      default:
        return <SafariApp />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 50 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-0 z-30 flex flex-col bg-black overflow-hidden"
    >
      {/* App Body */}
      <div className="flex-1 w-full h-full relative overflow-hidden">
        {renderAppContent()}
      </div>

      {/* iOS Home Indicator (Swipe/Click to Return Home) */}
      <div
        onClick={() => {
          soundHaptics.playClick(750, 0.05);
          closeApp();
        }}
        className="absolute bottom-2 left-0 right-0 h-6 flex items-center justify-center cursor-pointer z-50 group"
        title="Swipe up / Click to return Home"
      >
        <div className="w-36 h-1 bg-white/70 group-hover:bg-white rounded-full transition-all group-active:scale-95 shadow-md" />
      </div>
    </motion.div>
  );
};
