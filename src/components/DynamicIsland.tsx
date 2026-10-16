import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music2, Timer } from 'lucide-react';
import { useLauncher } from '../context/LauncherContext';

export const DynamicIsland: React.FC = () => {
  const {
    dynamicIsland,
    isMavicOnline,
    triggerMavicOrb,
  } = useLauncher();

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const isMediaActive = dynamicIsland.type === 'media' && dynamicIsland.media?.isPlaying;
  const isTimerActive = dynamicIsland.type === 'timer' && (dynamicIsland.timer?.remainingSeconds ?? 0) > 0;

  const handleIslandTap = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Do not open any sheet or page! Trigger rolling colors orb at down part of phone
    triggerMavicOrb();
  };

  return (
    <div className="absolute top-2.5 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <motion.div
        layout
        transition={{ type: 'spring', damping: 25, stiffness: 320 }}
        onClick={handleIslandTap}
        className={`bg-black text-white pointer-events-auto shadow-2xl overflow-hidden cursor-pointer flex items-center transition-colors duration-200 active:scale-95 ${
          isMediaActive || isTimerActive
            ? 'w-[215px] h-[35px] rounded-full px-3 justify-between'
            : isMavicOnline
            ? 'w-[155px] h-[34px] rounded-full px-3 justify-between'
            : 'w-[124px] h-[32px] rounded-full px-3 justify-center'
        }`}
        title="Tap for MAVIC AI Assistant"
      >
        <AnimatePresence mode="wait">
          {isMediaActive ? (
            /* COMPACT MEDIA PILL (with green online dot) */
            <motion.div
              key="compact-media"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center gap-1.5">
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: dynamicIsland.media?.coverColor || '#f43f5e' }}
                >
                  <Music2 size={10} className="text-white" />
                </div>
                <span className="text-[11px] font-semibold tracking-tight truncate max-w-[70px]">
                  {dynamicIsland.media?.title}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {/* Visualizer */}
                <div className="flex items-end gap-[2px] h-3.5">
                  <span className="w-[2.5px] bg-rose-500 rounded-full animate-[pulse_0.5s_infinite] h-2.5" />
                  <span className="w-[2.5px] bg-rose-500 rounded-full animate-[pulse_0.7s_infinite] h-3.5" />
                  <span className="w-[2.5px] bg-rose-500 rounded-full animate-[pulse_0.4s_infinite] h-2" />
                </div>
                {/* MAVIC Assistant Green Dot */}
                {isMavicOnline && (
                  <span
                    className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse"
                    title="MAVIC Assistant Online"
                  />
                )}
              </div>
            </motion.div>
          ) : isTimerActive ? (
            /* COMPACT TIMER PILL (with green online dot) */
            <motion.div
              key="compact-timer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center gap-1 text-amber-500">
                <Timer size={13} />
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-500/80">Timer</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-amber-400 tabular-nums">
                  {formatSeconds(dynamicIsland.timer?.remainingSeconds ?? 0)}
                </span>
                {isMavicOnline && (
                  <span
                    className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse"
                    title="MAVIC Assistant Online"
                  />
                )}
              </div>
            </motion.div>
          ) : (
            /* IDLE PILL WITH GREEN MAVIC ASSISTANT ONLINE DOT */
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex items-center justify-between px-1"
            >
              {/* True-depth sensor & front lens */}
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#0a0a0f] border border-neutral-800/80 flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-blue-950/70" />
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
              </div>

              {/* Mavic Assistant Green Indicator Dot & Label */}
              {isMavicOnline && (
                <div
                  className="flex items-center gap-1.5 group cursor-pointer"
                  title="MAVIC AI Assistant Online (Tap for Rolling Colors Orb)"
                >
                  <span className="text-[9px] font-bold tracking-widest text-emerald-400/90 uppercase font-mono group-hover:text-emerald-300">
                    MAVIC
                  </span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399] animate-pulse" />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
