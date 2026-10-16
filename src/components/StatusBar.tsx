import React from 'react';
import { Wifi } from 'lucide-react';
import { useLauncher } from '../context/LauncherContext';
import { soundHaptics } from '../utils/haptics';

interface StatusBarProps {
  colorScheme?: 'light' | 'dark';
}

export const StatusBar: React.FC<StatusBarProps> = ({ colorScheme = 'light' }) => {
  const {
    currentTime,
    batteryLevel,
    isLowPowerMode,
    setIsNotificationCenterOpen,
    setIsControlCenterOpen,
  } = useLauncher();

  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const formattedTime = `${hours % 12 || 12}:${minutes < 10 ? '0' : ''}${minutes}`;

  const textColor = colorScheme === 'light' ? 'text-white' : 'text-slate-900';

  return (
    <div className={`relative z-40 w-full h-11 px-6 flex items-center justify-between text-xs font-semibold ${textColor} select-none`}>
      {/* Left Slot: Time -> Tap to open Notification Center */}
      <button
        onClick={() => {
          soundHaptics.playClick(800, 0.05);
          setIsNotificationCenterOpen(true);
        }}
        className="flex items-center gap-1 active:opacity-60 transition-opacity focus:outline-none"
        title="Tap for Notifications"
      >
        <span className="text-[13px] font-bold tracking-tight font-mono">{formattedTime}</span>
      </button>

      {/* Right Slot: Signal, 5G, Wi-Fi, Battery -> Tap to open Control Center */}
      <button
        onClick={() => {
          soundHaptics.playClick(850, 0.05);
          setIsControlCenterOpen(true);
        }}
        className="flex items-center gap-2 active:opacity-60 transition-opacity focus:outline-none"
        title="Tap for Control Center"
      >
        {/* Cellular Signal Bars */}
        <div className="flex items-end gap-[1.5px] h-3">
          <span className="w-[2.5px] h-1.5 bg-current rounded-[0.5px]" />
          <span className="w-[2.5px] h-2 bg-current rounded-[0.5px]" />
          <span className="w-[2.5px] h-2.5 bg-current rounded-[0.5px]" />
          <span className="w-[2.5px] h-3 bg-current rounded-[0.5px]" />
        </div>

        {/* 5G label */}
        <span className="text-[10px] font-bold tracking-tighter">5G</span>

        {/* Wi-Fi Icon */}
        <Wifi size={13} strokeWidth={2.5} />

        {/* Battery Icon with internal charge fill */}
        <div className="flex items-center">
          <div className="w-[22px] h-[11px] rounded-[3.5px] border border-current p-[1.5px] flex items-center relative">
            <div
              className={`h-full rounded-[1.5px] transition-all duration-300 ${
                isLowPowerMode ? 'bg-amber-400' : 'bg-current'
              }`}
              style={{ width: `${Math.max(15, batteryLevel)}%` }}
            />
          </div>
          <div className="w-[1.5px] h-[4px] bg-current rounded-r-[1px] ml-[0.5px]" />
        </div>
      </button>
    </div>
  );
};
