import React from 'react';
import { CloudSun, Wind, Droplets, Volume2, Sun, Moon, Sparkles } from 'lucide-react';
import { useLauncher } from '../../context/LauncherContext';
import { soundHaptics } from '../../utils/haptics';

export const WeatherApp: React.FC = () => {
  const {
    userName,
    weatherTimeOfDay,
    setWeatherTimeOfDay,
    speakWeatherForecast,
  } = useLauncher();

  const forecasts = {
    morning: {
      title: 'Morning Forecast',
      temp: '64°',
      condition: 'Crisp & Sunny',
      highLow: 'H:74° · L:58°',
      desc: 'Sunrise brings crisp, clear air and gentle 6 mph winds. Ideal for morning hydration and outdoor walk.',
      gradient: 'from-amber-400/80 via-sky-500 to-indigo-700',
      icon: '🌅',
    },
    afternoon: {
      title: 'Afternoon Forecast',
      temp: '77°',
      condition: 'Warm & Sunny',
      highLow: 'H:78° · L:62°',
      desc: 'Peak daytime temperature with radiant sunshine and light breezes. Stay hydrated and enjoy high energy.',
      gradient: 'from-sky-400 via-sky-600 to-blue-800',
      icon: '☀️',
    },
    evening: {
      title: 'Evening Forecast',
      temp: '68°',
      condition: 'Twilight & Breezy',
      highLow: 'H:70° · L:60°',
      desc: 'Golden hour transitions to a tranquil twilight dusk. Cool evening breezes prepare you for nighttime rest.',
      gradient: 'from-rose-500/80 via-purple-700 to-slate-900',
      icon: '🌆',
    },
  };

  const current = forecasts[weatherTimeOfDay];

  return (
    <div
      className={`w-full h-full bg-gradient-to-b ${current.gradient} text-white pt-14 pb-20 px-5 overflow-y-auto select-none transition-all duration-700`}
    >
      {/* 3-Times Daily Interactive Weather Forecast Switcher */}
      <div className="bg-black/30 backdrop-blur-xl border border-white/20 p-1.5 rounded-2xl mb-4 flex items-center justify-between gap-1 shadow-lg">
        {(['morning', 'afternoon', 'evening'] as const).map((period) => (
          <button
            key={period}
            onClick={() => {
              soundHaptics.playClick(900, 0.05);
              setWeatherTimeOfDay(period);
            }}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold capitalize transition-all flex items-center justify-center gap-1.5 ${
              weatherTimeOfDay === period
                ? 'bg-white text-slate-900 shadow-md scale-102'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            {period === 'morning' ? <Sun size={12} className="text-amber-500" /> : null}
            {period === 'afternoon' ? <CloudSun size={12} className="text-sky-500" /> : null}
            {period === 'evening' ? <Moon size={12} className="text-indigo-600" /> : null}
            <span>{period}</span>
          </button>
        ))}
      </div>

      {/* City & Main Temp */}
      <div className="flex flex-col items-center my-2 text-center">
        <div className="flex items-center gap-1.5 text-xs text-white/80 font-mono uppercase tracking-wider">
          <Sparkles size={12} className="text-amber-300" />
          <span>{current.title} · Interactive Update</span>
        </div>
        <h1 className="text-3xl font-black tracking-tight mt-1">San Francisco</h1>
        <div className="text-7xl font-black font-mono tracking-tighter my-1">
          {current.temp}
        </div>
        <span className="text-base font-bold text-white/95">{current.condition}</span>
        <span className="text-xs text-white/80 mt-0.5">{current.highLow}</span>

        {/* Speak Forecast Button */}
        <button
          onClick={() => speakWeatherForecast(weatherTimeOfDay)}
          className="mt-3 py-1.5 px-3.5 rounded-full bg-white/20 hover:bg-white/30 border border-white/30 text-xs font-bold text-white flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
        >
          <Volume2 size={13} className="text-amber-300 animate-pulse" />
          <span>Read {current.title} Aloud</span>
        </button>
      </div>

      {/* Description Banner */}
      <div className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-2xl p-3.5 my-3 shadow-lg text-xs leading-relaxed text-white/90">
        <p className="font-medium">&quot;{current.desc}&quot;</p>
      </div>

      {/* Hourly forecast strip */}
      <div className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-3xl p-4 my-3 shadow-xl">
        <span className="text-[11px] font-bold uppercase tracking-wider text-white/70 block mb-3">
          Daily Cycle Forecast
        </span>
        <div className="flex justify-between items-center overflow-x-auto gap-4 pb-1">
          {[
            { t: 'Morning', i: '🌅', deg: '64°', active: weatherTimeOfDay === 'morning' },
            { t: '12 PM', i: '☀️', deg: '72°' },
            { t: 'Afternoon', i: '🌤️', deg: '77°', active: weatherTimeOfDay === 'afternoon' },
            { t: '5 PM', i: '⛅', deg: '73°' },
            { t: 'Evening', i: '🌆', deg: '68°', active: weatherTimeOfDay === 'evening' },
            { t: 'Night', i: '🌙', deg: '61°' },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`flex flex-col items-center gap-1.5 shrink-0 p-1.5 rounded-xl transition-all ${
                item.active ? 'bg-white/25 border border-white/40 shadow-sm' : ''
              }`}
            >
              <span className="text-xs text-white/85 font-medium">{item.t}</span>
              <span className="text-lg">{item.i}</span>
              <span className="text-xs font-bold font-mono">{item.deg}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2x2 Weather Details Grid */}
      <div className="grid grid-cols-2 gap-3.5 my-3">
        <div className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-3xl p-3.5 flex flex-col justify-between h-28">
          <div className="flex items-center gap-1.5 text-xs text-white/70">
            <Wind size={15} />
            <span>Wind</span>
          </div>
          <span className="text-xl font-bold font-mono">9 mph</span>
          <span className="text-[11px] text-white/70">WNW gentle airflow</span>
        </div>

        <div className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-3xl p-3.5 flex flex-col justify-between h-28">
          <div className="flex items-center gap-1.5 text-xs text-white/70">
            <Droplets size={15} />
            <span>Humidity</span>
          </div>
          <span className="text-xl font-bold font-mono">56%</span>
          <span className="text-[11px] text-white/70">Optimal air comfort</span>
        </div>
      </div>
    </div>
  );
};
