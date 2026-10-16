import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  RotateCcw,
  Zap,
  ZapOff,
  Sun,
  ChevronDown,
  Sparkles,
  Image as ImageIcon,
  Check,
} from 'lucide-react';
import { useLauncher } from '../../context/LauncherContext';
import { soundHaptics } from '../../utils/haptics';

export const CameraApp: React.FC = () => {
  const { cameraControl, adjustCameraZoom, setCameraControl } = useLauncher();
  const [photoMode, setPhotoMode] = useState<'PHOTO' | 'PORTRAIT' | 'VIDEO' | 'CINEMATIC'>('PHOTO');
  const [isFlashActive, setIsFlashActive] = useState(false);
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('environment');
  const [hasWebcam, setHasWebcam] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Initialize webcam if available
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({
          video: { facingMode: cameraFacing },
          audio: false,
        })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
            setHasWebcam(true);
          }
        })
        .catch(() => {
          setHasWebcam(false);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraFacing]);

  const takePhoto = () => {
    soundHaptics.playCameraShutter();
    setIsFlashActive(true);
    setTimeout(() => setIsFlashActive(false), 120);

    // Save capture to local gallery
    const timestamp = new Date().toLocaleTimeString();
    setCapturedPhotos((prev) => [
      `Captured ${photoMode} at ${timestamp} (${cameraControl.zoom}x, ${cameraControl.style})`,
      ...prev,
    ]);
  };

  const flipCamera = () => {
    soundHaptics.playClick(900, 0.05);
    setCameraFacing((p) => (p === 'user' ? 'environment' : 'user'));
  };

  return (
    <div className="relative w-full h-full bg-black text-white flex flex-col justify-between overflow-hidden select-none">
      {/* Flash overlay animation */}
      {isFlashActive && <div className="absolute inset-0 bg-white z-50 pointer-events-none animate-fade-out" />}

      {/* Top Camera Controls */}
      <div className="relative z-20 flex items-center justify-between px-6 pt-12 pb-3 bg-gradient-to-b from-black/80 to-transparent">
        <button
          onClick={() => {
            soundHaptics.playClick(800, 0.05);
            setIsFlashOn(!isFlashOn);
          }}
          className={`p-2 rounded-full ${isFlashOn ? 'bg-amber-400 text-black' : 'text-white/80'}`}
        >
          {isFlashOn ? <Zap size={18} /> : <ZapOff size={18} />}
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono uppercase bg-neutral-900/80 border border-white/10 px-2 py-0.5 rounded-full text-white/80">
            {cameraControl.style}
          </span>
          <span className="text-[11px] font-mono text-amber-400">
            {cameraControl.exposure > 0 ? `+${cameraControl.exposure}` : cameraControl.exposure} EV
          </span>
        </div>

        <button
          onClick={() => {
            soundHaptics.playClick(850, 0.05);
            setCameraControl((p) => ({ ...p, isOpen: !p.isOpen }));
          }}
          className="text-white/80 hover:text-white p-2"
          title="Camera Control Settings"
        >
          <Sparkles size={18} />
        </button>
      </div>

      {/* Viewfinder Area */}
      <div className="relative flex-1 w-full bg-neutral-950 flex items-center justify-center overflow-hidden">
        {hasWebcam ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover transition-transform duration-200"
            style={{
              transform: `scale(${cameraControl.zoom})`,
              filter:
                cameraControl.style === 'Vibrant'
                  ? 'saturate(1.4) contrast(1.1)'
                  : cameraControl.style === 'Rich Warm'
                  ? 'sepia(0.25) saturate(1.2)'
                  : cameraControl.style === 'Muted Amber'
                  ? 'sepia(0.4) contrast(0.95)'
                  : 'none',
            }}
          />
        ) : (
          /* Live Photorealistic Viewfinder Canvas Simulation */
          <div
            className="w-full h-full relative flex flex-col items-center justify-center transition-transform duration-200"
            style={{
              transform: `scale(${cameraControl.zoom})`,
              background: 'radial-gradient(circle at 50% 40%, #1e293b 0%, #0f172a 60%, #020617 100%)',
            }}
          >
            {/* Viewfinder crosshairs / focus box */}
            <div className="w-24 h-24 border border-amber-400/70 rounded-xl pointer-events-none relative flex items-center justify-center animate-pulse">
              <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
              <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-amber-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-amber-400" />
              <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-amber-400" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-amber-400" />
            </div>

            <span className="text-white/40 text-[11px] font-mono tracking-tight mt-4">
              iPhone 16 48MP Fusion Camera
            </span>
          </div>
        )}

        {/* Optical Zoom Pill (0.5x, 1x, 2x, 5x) */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/60 backdrop-blur-xl px-2 py-1 rounded-full border border-white/20">
          {[0.5, 1, 2, 5].map((z) => (
            <button
              key={z}
              onClick={() => adjustCameraZoom(z)}
              className={`w-7 h-7 rounded-full text-xs font-bold font-mono transition-all tabular-nums ${
                cameraControl.zoom === z
                  ? 'bg-amber-400 text-black shadow-md scale-105'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              {z === 0.5 ? '.5' : `${z}`}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Mode Picker + Shutter Control */}
      <div className="relative z-20 flex flex-col bg-black pt-3 pb-8 px-6">
        {/* Mode Selector */}
        <div className="flex items-center justify-center gap-5 text-xs font-bold tracking-wider uppercase mb-5 overflow-x-auto py-1">
          {(['CINEMATIC', 'VIDEO', 'PHOTO', 'PORTRAIT'] as const).map((m) => (
            <button
              key={m}
              onClick={() => {
                soundHaptics.playClick(900, 0.04);
                setPhotoMode(m);
              }}
              className={`transition-colors whitespace-nowrap ${
                photoMode === m ? 'text-amber-400 scale-105 font-extrabold' : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Shutter Bar */}
        <div className="flex items-center justify-between px-4">
          {/* Gallery Preview Thumbnail */}
          <div className="w-12 h-12 rounded-xl bg-neutral-800 border border-white/20 overflow-hidden flex items-center justify-center cursor-pointer shadow-md">
            {capturedPhotos.length > 0 ? (
              <div className="w-full h-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-bold font-mono">
                {capturedPhotos.length}
              </div>
            ) : (
              <ImageIcon size={20} className="text-white/50" />
            )}
          </div>

          {/* Shutter Button (iPhone 16 concentric circle) */}
          <button
            onClick={takePhoto}
            className="w-18 h-18 rounded-full border-4 border-white flex items-center justify-center active:scale-95 transition-transform"
          >
            <div className={`w-14 h-14 rounded-full ${photoMode === 'VIDEO' ? 'bg-red-600 rounded-2xl' : 'bg-white'}`} />
          </button>

          {/* Flip Camera */}
          <button
            onClick={flipCamera}
            className="w-12 h-12 rounded-full bg-neutral-900 border border-white/20 flex items-center justify-center active:scale-90 transition-transform text-white"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
