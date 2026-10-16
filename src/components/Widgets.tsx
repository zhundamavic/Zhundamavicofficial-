import React from 'react';
import {
  CloudSun,
  BatteryCharging,
  Flame,
  CheckCircle2,
  Circle,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
} from 'lucide-react';
import { useLauncher } from '../context/LauncherContext';
import { soundHaptics } from '../utils/haptics';

export const WeatherWidget: React.FC = () => {
  const { openApp, iconStyle, tintColor } = useLauncher();

  const getStyle = () => {
    if (iconStyle === 'tinted') {
      return {
        background: 'rgba(24, 24, 27, 0.85)',
        border: `1.5px solid ${tintColor}40`,
        color: tintColor,
      };
    }
    if (iconStyle === 'dark') {
      return {
        background: 'rgba(24, 24, 27, 0.85)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
      };
    }
    return {};
  };

  return (
    <div
      onClick={() => openApp('weather')}
      className="col-span-4 h-[148px] rounded-3xl p-4 bg-gradient-to-br from-sky-500 via-sky-600 to-blue-700 text-white shadow-lg backdrop-blur-xl border border-white/20 cursor-pointer active:scale-[0.98] transition-transform flex flex-col justify-between overflow-hidden relative select-none"
      style={getStyle()}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-sm font-bold tracking-tight block">San Francisco</span>
          <span className="text-3xl font-extrabold tracking-tighter block mt-0.5 font-mono">74°</span>
        </div>
        <div className="flex flex-col items-end">
          <CloudSun size={28} className="text-amber-300 drop-shadow-sm" />
          <span className="text-xs font-semibold text-white/90 mt-1">Mostly Sunny</span>
          <span className="text-[11px] text-white/70">H:78° L:62°</span>
        </div>
      </div>

      {/* Hourly forecast strip */}
      <div className="flex justify-between items-center pt-2 border-t border-white/15 text-[11px]">
        {[
          { time: 'Now', temp: '74°' },
          { time: '4PM', temp: '75°' },
          { time: '5PM', temp: '72°' },
          { time: '6PM', temp: '69°' },
          { time: '7PM', temp: '66°' },
        ].map((item, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <span className="text-white/70 text-[10px]">{item.time}</span>
            <span className="font-bold font-mono text-[11px] mt-0.5">{item.temp}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const BatteryWidget: React.FC = () => {
  const { batteryLevel, iconStyle, tintColor } = useLauncher();

  const getStyle = () => {
    if (iconStyle === 'tinted') {
      return {
        background: 'rgba(24, 24, 27, 0.85)',
        border: `1.5px solid ${tintColor}40`,
        color: tintColor,
      };
    }
    if (iconStyle === 'dark') {
      return {
        background: 'rgba(24, 24, 27, 0.85)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
      };
    }
    return {};
  };

  return (
    <div
      className="col-span-2 h-[148px] rounded-3xl p-3.5 bg-neutral-900/80 backdrop-blur-xl border border-white/15 text-white shadow-lg flex flex-col justify-between select-none"
      style={getStyle()}
    >
      <div className="flex items-center justify-between text-xs font-bold text-white/70">
        <span>Batteries</span>
        <BatteryCharging size={16} className="text-emerald-400" />
      </div>

      <div className="flex items-center justify-around py-1">
        {/* iPhone Ring */}
        <div className="flex flex-col items-center gap-1">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-12 h-12 -rotate-90">
              <circle cx="24" cy="24" r="20" stroke="rgba(255,255,255,0.15)" strokeWidth="4" fill="none" />
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="#10b981"
                strokeWidth="4"
                strokeDasharray="125.6"
                strokeDashoffset={125.6 * (1 - batteryLevel / 100)}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <span className="absolute text-[11px] font-bold font-mono tabular-nums">{batteryLevel}%</span>
          </div>
          <span className="text-[10px] font-medium text-white/60">iPhone</span>
        </div>

        {/* AirPods Ring */}
        <div className="flex flex-col items-center gap-1">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-12 h-12 -rotate-90">
              <circle cx="24" cy="24" r="20" stroke="rgba(255,255,255,0.15)" strokeWidth="4" fill="none" />
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="#10b981"
                strokeWidth="4"
                strokeDasharray="125.6"
                strokeDashoffset={125.6 * (1 - 0.88)}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <span className="absolute text-[11px] font-bold font-mono tabular-nums">88%</span>
          </div>
          <span className="text-[10px] font-medium text-white/60">AirPods</span>
        </div>
      </div>
    </div>
  );
};

export const ActivityWidget: React.FC = () => {
  const { iconStyle, tintColor, healthData, openApp } = useLauncher();

  const getStyle = () => {
    if (iconStyle === 'tinted') {
      return {
        background: 'rgba(24, 24, 27, 0.85)',
        border: `1.5px solid ${tintColor}40`,
        color: tintColor,
      };
    }
    if (iconStyle === 'dark') {
      return {
        background: 'rgba(24, 24, 27, 0.85)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
      };
    }
    return {};
  };

  return (
    <div
      onClick={() => openApp('health')}
      className="col-span-2 h-[148px] rounded-3xl p-3.5 bg-neutral-900/80 backdrop-blur-xl border border-white/15 text-white shadow-lg flex flex-col justify-between select-none cursor-pointer hover:border-emerald-500/40 active:scale-95 transition-all"
      style={getStyle()}
    >
      <div className="flex items-center justify-between text-xs font-bold text-white/70">
        <span>Activity &amp; Health</span>
        <Flame size={16} className="text-rose-500" />
      </div>

      {/* 3 Rings visualization */}
      <div className="flex items-center justify-between px-1">
        <div className="relative w-16 h-16 flex items-center justify-center">
          <svg className="w-16 h-16 -rotate-90">
            {/* Red Move Ring */}
            <circle cx="32" cy="32" r="28" stroke="rgba(244,63,94,0.2)" strokeWidth="4.5" fill="none" />
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="#f43f5e"
              strokeWidth="4.5"
              strokeDasharray="175.9"
              strokeDashoffset={175.9 * (1 - 0.78)}
              strokeLinecap="round"
              fill="none"
            />
            {/* Green Exercise Ring */}
            <circle cx="32" cy="32" r="21" stroke="rgba(34,197,94,0.2)" strokeWidth="4.5" fill="none" />
            <circle
              cx="32"
              cy="32"
              r="21"
              stroke="#22c55e"
              strokeWidth="4.5"
              strokeDasharray="131.9"
              strokeDashoffset={131.9 * (1 - 0.65)}
              strokeLinecap="round"
              fill="none"
            />
            {/* Blue Stand Ring */}
            <circle cx="32" cy="32" r="14" stroke="rgba(56,189,248,0.2)" strokeWidth="4.5" fill="none" />
            <circle
              cx="32"
              cy="32"
              r="14"
              stroke="#38bdf8"
              strokeWidth="4.5"
              strokeDasharray="87.9"
              strokeDashoffset={87.9 * (1 - 0.9)}
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>

        <div className="flex flex-col gap-1 text-[11px] font-mono">
          <span className="text-rose-400 font-bold">{healthData.caloriesBurned}<span className="text-[9px] text-white/50">CAL</span></span>
          <span className="text-emerald-400 font-bold">{healthData.walkingMinutes}<span className="text-[9px] text-white/50">MIN</span></span>
          <span className="text-sky-400 font-bold">{healthData.steps}<span className="text-[9px] text-white/50">STEPS</span></span>
        </div>
      </div>
    </div>
  );
};

export const CalendarWidget: React.FC = () => {
  const { currentTime, openApp } = useLauncher();
  const [tasks, setTasks] = React.useState([
    { id: 1, text: 'Review iPhone 16 features', done: true },
    { id: 2, text: 'Configure custom iOS 18 icons', done: false },
  ]);

  const toggleTask = (id: number) => {
    soundHaptics.playClick(900, 0.05);
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  return (
    <div
      onClick={() => openApp('reminders')}
      className="col-span-4 h-[148px] rounded-3xl p-4 bg-neutral-900/80 backdrop-blur-xl border border-white/15 text-white shadow-lg flex flex-col justify-between cursor-pointer active:scale-[0.98] transition-transform select-none"
    >
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <CalendarIcon size={16} className="text-rose-500" />
          <span className="text-xs font-bold text-white">Upcoming & Reminders</span>
        </div>
        <span className="text-[11px] text-rose-400 font-semibold font-mono">
          {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
        </span>
      </div>

      <div className="flex flex-col gap-2 py-1">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={(e) => {
              e.stopPropagation();
              toggleTask(task.id);
            }}
            className="flex items-center gap-2.5 text-xs hover:text-white transition-colors"
          >
            {task.done ? (
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            ) : (
              <Circle size={16} className="text-white/40 shrink-0" />
            )}
            <span className={`truncate ${task.done ? 'line-through text-white/40' : 'text-white/90'}`}>
              {task.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
