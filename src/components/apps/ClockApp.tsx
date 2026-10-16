import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Plus, Clock as ClockIcon, Timer as TimerIcon } from 'lucide-react';
import { useLauncher } from '../../context/LauncherContext';
import { soundHaptics } from '../../utils/haptics';

export const ClockApp: React.FC = () => {
  const { startLiveTimer, cancelLiveTimer, dynamicIsland } = useLauncher();
  const [tab, setTab] = useState<'world' | 'stopwatch' | 'timer'>('timer');

  // Stopwatch state
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [isStopwatchRunning, setIsStopwatchRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);

  // Timer custom input
  const [timerMinutes, setTimerMinutes] = useState(5);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isStopwatchRunning) {
      interval = setInterval(() => {
        setStopwatchTime((t) => t + 10);
      }, 10);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isStopwatchRunning]);

  const formatStopwatch = (ms: number) => {
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    const centi = Math.floor((ms % 1000) / 10);
    return `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}.${centi < 10 ? '0' : ''}${centi}`;
  };

  const handleStartTimer = () => {
    soundHaptics.playClick(1000, 0.06);
    startLiveTimer(timerMinutes * 60, `${timerMinutes} Min Timer`);
  };

  return (
    <div className="w-full h-full bg-black text-white pt-14 pb-20 px-4 flex flex-col justify-between select-none">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-4 capitalize px-2">{tab}</h1>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* TIMER TAB */}
        {tab === 'timer' && (
          <div className="w-full flex flex-col items-center gap-6">
            {dynamicIsland.timer?.isRunning ? (
              <div className="flex flex-col items-center gap-2">
                <span className="text-xs uppercase font-bold text-amber-500 tracking-wider">
                  Live on Dynamic Island
                </span>
                <span className="text-6xl font-light font-mono text-amber-400 tabular-nums">
                  {Math.floor(dynamicIsland.timer.remainingSeconds / 60)}:
                  {(dynamicIsland.timer.remainingSeconds % 60).toString().padStart(2, '0')}
                </span>
                <button
                  onClick={cancelLiveTimer}
                  className="mt-6 px-6 py-2.5 rounded-full bg-neutral-800 text-red-400 font-bold text-sm hover:bg-neutral-700 active:scale-95 transition-all"
                >
                  Cancel Timer
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-6 w-full">
                <div className="flex items-center justify-center gap-4 py-8">
                  <div className="flex flex-col items-center">
                    <span className="text-6xl font-extralight font-mono">{timerMinutes}</span>
                    <span className="text-xs text-neutral-400 mt-1">min</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {[1, 3, 5, 10, 15].map((m) => (
                    <button
                      key={m}
                      onClick={() => {
                        soundHaptics.playClick(900, 0.04);
                        setTimerMinutes(m);
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold font-mono ${
                        timerMinutes === m ? 'bg-amber-500 text-black' : 'bg-neutral-800 text-white'
                      }`}
                    >
                      {m}m
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleStartTimer}
                  className="w-20 h-20 rounded-full border-2 border-emerald-500/80 bg-emerald-500/20 text-emerald-400 font-bold text-base flex items-center justify-center active:scale-95 transition-transform"
                >
                  Start
                </button>
              </div>
            )}
          </div>
        )}

        {/* STOPWATCH TAB */}
        {tab === 'stopwatch' && (
          <div className="w-full flex flex-col items-center gap-6">
            <span className="text-6xl font-light font-mono tabular-nums">
              {formatStopwatch(stopwatchTime)}
            </span>

            <div className="flex items-center justify-between w-full px-6">
              <button
                onClick={() => {
                  soundHaptics.playClick(800, 0.05);
                  if (isStopwatchRunning) {
                    setLaps([stopwatchTime, ...laps]);
                  } else {
                    setStopwatchTime(0);
                    setLaps([]);
                  }
                }}
                className="w-18 h-18 rounded-full bg-neutral-800 text-white font-semibold text-sm flex items-center justify-center active:scale-95"
              >
                {isStopwatchRunning ? 'Lap' : 'Reset'}
              </button>

              <button
                onClick={() => {
                  soundHaptics.playClick(1000, 0.06);
                  setIsStopwatchRunning(!isStopwatchRunning);
                }}
                className={`w-18 h-18 rounded-full border-2 font-bold text-sm flex items-center justify-center active:scale-95 ${
                  isStopwatchRunning
                    ? 'border-red-500/80 bg-red-500/20 text-red-400'
                    : 'border-emerald-500/80 bg-emerald-500/20 text-emerald-400'
                }`}
              >
                {isStopwatchRunning ? 'Stop' : 'Start'}
              </button>
            </div>

            {/* Lap list */}
            <div className="w-full max-h-40 overflow-y-auto mt-4 px-4 flex flex-col gap-1 border-t border-neutral-800 pt-2">
              {laps.map((lap, idx) => (
                <div key={idx} className="flex justify-between text-xs py-1 text-neutral-300 font-mono">
                  <span>Lap {laps.length - idx}</span>
                  <span>{formatStopwatch(lap)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* WORLD CLOCK TAB */}
        {tab === 'world' && (
          <div className="w-full flex flex-col gap-3 px-2">
            {[
              { city: 'San Francisco', diff: 'Today, +0HRS', time: '9:41 AM' },
              { city: 'New York', diff: 'Today, +3HRS', time: '12:41 PM' },
              { city: 'London', diff: 'Today, +8HRS', time: '5:41 PM' },
              { city: 'Tokyo', diff: 'Tomorrow, +16HRS', time: '1:41 AM' },
            ].map((c, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-neutral-800">
                <div>
                  <span className="text-xs text-neutral-400 block">{c.diff}</span>
                  <span className="text-base font-semibold">{c.city}</span>
                </div>
                <span className="text-2xl font-light font-mono">{c.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Tabs */}
      <div className="flex items-center justify-around border-t border-neutral-800 pt-3">
        {(['world', 'stopwatch', 'timer'] as const).map((t) => (
          <button
            key={t}
            onClick={() => {
              soundHaptics.playClick(850, 0.04);
              setTab(t);
            }}
            className={`flex flex-col items-center gap-1 text-[11px] font-medium capitalize transition-colors ${
              tab === t ? 'text-amber-500 font-bold' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            {t === 'timer' ? <TimerIcon size={20} /> : <ClockIcon size={20} />}
            <span>{t}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
