import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, SunMedium, SlidersHorizontal, Aperture, ZoomIn, X } from 'lucide-react';
import { useLauncher } from '../context/LauncherContext';
import { soundHaptics } from '../utils/haptics';

export const CameraControl: React.FC = () => {
  const {
    cameraControl,
    setCameraControl,
    adjustCameraZoom,
    cycleCameraControlMode,
    openApp,
    activeAppId,
  } = useLauncher();

  const [isPressing, setIsPressing] = useState(false);
  const dragStartY = useRef<number | null>(null);

  const handleLightPress = () => {
    soundHaptics.playCameraControlTick();
    setCameraControl((prev) => ({ ...prev, isOpen: !prev.isOpen }));
  };

  const handleFirmPress = () => {
    soundHaptics.playCameraShutter();
    if (activeAppId !== 'camera') {
      openApp('camera');
    }
  };

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    dragStartY.current = clientY;
    setIsPressing(true);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (dragStartY.current === null) return;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const diff = dragStartY.current - clientY;

    if (Math.abs(diff) > 12) {
      if (cameraControl.activeMode === 'zoom') {
        const step = diff > 0 ? 0.2 : -0.2;
        const newZoom = Math.min(5.0, Math.max(0.5, Number((cameraControl.zoom + step).toFixed(1))));
        if (newZoom !== cameraControl.zoom) {
          adjustCameraZoom(newZoom);
          dragStartY.current = clientY;
        }
      } else if (cameraControl.activeMode === 'exposure') {
        const step = diff > 0 ? 0.3 : -0.3;
        const newExp = Math.min(2.0, Math.max(-2.0, Number((cameraControl.exposure + step).toFixed(1))));
        if (newExp !== cameraControl.exposure) {
          soundHaptics.playCameraControlTick();
          setCameraControl((prev) => ({ ...prev, exposure: newExp }));
          dragStartY.current = clientY;
        }
      }
    }
  };

  const handleTouchEnd = () => {
    dragStartY.current = null;
    setIsPressing(false);
  };

  const getModeIcon = () => {
    switch (cameraControl.activeMode) {
      case 'zoom':
        return <ZoomIn size={15} />;
      case 'exposure':
        return <SunMedium size={15} />;
      case 'styles':
        return <SlidersHorizontal size={15} />;
      case 'depth':
        return <Aperture size={15} />;
    }
  };

  const getModeValueDisplay = () => {
    switch (cameraControl.activeMode) {
      case 'zoom':
        return `${cameraControl.zoom.toFixed(1)}x`;
      case 'exposure':
        return `${cameraControl.exposure > 0 ? '+' : ''}${cameraControl.exposure.toFixed(1)}`;
      case 'styles':
        return cameraControl.style;
      case 'depth':
        return `f/${cameraControl.depth.toFixed(1)}`;
    }
  };

  return (
    <>
      {/* On-screen floating HUD overlay for Camera Control adjustment */}
      <AnimatePresence>
        {cameraControl.isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute right-4 bottom-28 z-50 bg-black/85 backdrop-blur-xl border border-white/20 rounded-2xl p-3 shadow-2xl flex flex-col gap-2 min-w-[150px] text-white"
          >
            <div className="flex items-center justify-between pb-1 border-b border-white/10">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                Camera Control
              </span>
              <button
                onClick={() => setCameraControl((p) => ({ ...p, isOpen: false }))}
                className="text-neutral-400 hover:text-white p-0.5"
              >
                <X size={14} />
              </button>
            </div>

            {/* Mode Switcher */}
            <div
              onClick={cycleCameraControlMode}
              className="flex items-center justify-between bg-white/10 hover:bg-white/15 px-2.5 py-1.5 rounded-xl cursor-pointer active:scale-98 transition-all"
            >
              <div className="flex items-center gap-1.5 text-amber-400">
                {getModeIcon()}
                <span className="text-xs font-semibold capitalize">{cameraControl.activeMode}</span>
              </div>
              <span className="text-xs font-mono font-bold text-white tabular-nums">
                {getModeValueDisplay()}
              </span>
            </div>

            {/* Interactive Slider Bar */}
            <div className="flex flex-col gap-1 pt-1">
              {cameraControl.activeMode === 'zoom' && (
                <div className="flex justify-between items-center px-1">
                  {[0.5, 1.0, 2.0, 5.0].map((z) => (
                    <button
                      key={z}
                      onClick={() => adjustCameraZoom(z)}
                      className={`text-[11px] font-bold px-2 py-1 rounded-full transition-all tabular-nums ${
                        Math.abs(cameraControl.zoom - z) < 0.2
                          ? 'bg-amber-400 text-black shadow-sm'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      {z}x
                    </button>
                  ))}
                </div>
              )}

              {cameraControl.activeMode === 'styles' && (
                <div className="flex flex-col gap-1">
                  {(['Standard', 'Vibrant', 'Rich Warm', 'Muted Amber'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        soundHaptics.playCameraControlTick();
                        setCameraControl((p) => ({ ...p, style: st }));
                      }}
                      className={`text-left text-xs px-2 py-1 rounded-lg transition-colors ${
                        cameraControl.style === st ? 'bg-amber-400/20 text-amber-300 font-semibold' : 'text-neutral-300'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              )}

              {cameraControl.activeMode === 'exposure' && (
                <input
                  type="range"
                  min="-2"
                  max="2"
                  step="0.1"
                  value={cameraControl.exposure}
                  onChange={(e) => {
                    soundHaptics.playCameraControlTick();
                    setCameraControl((p) => ({ ...p, exposure: parseFloat(e.target.value) }));
                  }}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              )}

              {cameraControl.activeMode === 'depth' && (
                <input
                  type="range"
                  min="1.4"
                  max="16"
                  step="0.2"
                  value={cameraControl.depth}
                  onChange={(e) => {
                    soundHaptics.playCameraControlTick();
                    setCameraControl((p) => ({ ...p, depth: parseFloat(e.target.value) }));
                  }}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              )}
            </div>

            <span className="text-[10px] text-neutral-400 text-center tracking-tight">
              Slide finger or click to adjust
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Physical / Floating Virtual Camera Control Button (iPhone 16 signature recessed button) */}
      <div
        className="absolute right-0 bottom-28 translate-x-1/2 z-40 flex items-center justify-center group"
        title="iPhone 16 Camera Control (Slide to Zoom, Click to Open Camera)"
      >
        <button
          onMouseDown={handleTouchStart}
          onMouseMove={handleTouchMove}
          onMouseUp={handleTouchEnd}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={handleLightPress}
          onDoubleClick={handleFirmPress}
          className={`w-3.5 h-14 rounded-full bg-neutral-900 border border-neutral-700/80 shadow-md transition-all duration-150 flex items-center justify-center cursor-pointer ${
            isPressing ? 'scale-90 bg-amber-500/40 border-amber-400' : 'hover:bg-neutral-800'
          }`}
        >
          <div className="w-1 h-8 rounded-full bg-neutral-600/70 pointer-events-none" />
        </button>
      </div>
    </>
  );
};
