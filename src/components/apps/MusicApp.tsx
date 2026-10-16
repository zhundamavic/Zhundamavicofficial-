import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, Music2 } from 'lucide-react';
import { useLauncher } from '../../context/LauncherContext';
import { soundHaptics } from '../../utils/haptics';

export const MusicApp: React.FC = () => {
  const { dynamicIsland, toggleMediaPlayback, setDynamicIsland } = useLauncher();

  const isPlaying = dynamicIsland.media?.isPlaying ?? false;
  const currentMedia = dynamicIsland.media || {
    title: 'Espresso',
    artist: 'Sabrina Carpenter',
    album: 'Short n’ Sweet',
    isPlaying: false,
    duration: 175,
    currentTime: 42,
    coverColor: '#f97316',
  };

  const tracks = [
    { title: 'Espresso', artist: 'Sabrina Carpenter', album: 'Short n’ Sweet', color: '#f97316', duration: 175 },
    { title: 'Birds of a Feather', artist: 'Billie Eilish', album: 'HIT ME HARD AND SOFT', color: '#0284c7', duration: 198 },
    { title: 'Good Luck, Babe!', artist: 'Chappell Roan', album: 'The Rise and Fall of a Midwest Princess', color: '#db2777', duration: 218 },
  ];

  const selectTrack = (track: typeof tracks[0]) => {
    soundHaptics.playClick(900, 0.05);
    setDynamicIsland((prev) => ({
      ...prev,
      type: 'media',
      media: {
        ...track,
        isPlaying: true,
        currentTime: 0,
        coverColor: track.color,
      },
    }));
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="w-full h-full bg-gradient-to-b from-neutral-900 via-black to-black text-white pt-14 pb-20 px-6 flex flex-col justify-between select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">Apple Music</h1>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
          <span className="text-[10px] text-neutral-400 font-bold uppercase">Lossless</span>
        </div>
      </div>

      {/* Album Artwork */}
      <div className="flex flex-col items-center my-4">
        <div
          className="w-56 h-56 rounded-3xl shadow-2xl flex items-center justify-center p-6 transition-all duration-300 relative overflow-hidden"
          style={{ backgroundColor: currentMedia.coverColor }}
        >
          <Music2 size={80} className="text-white/80 drop-shadow-lg" />
          <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/20" />
        </div>
      </div>

      {/* Title & Artist */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold tracking-tight">{currentMedia.title}</h2>
          <span className="text-sm text-neutral-400">{currentMedia.artist}</span>
        </div>
        <button
          onClick={() => soundHaptics.playClick(950, 0.05)}
          className="text-neutral-400 hover:text-rose-500 p-2"
        >
          <Heart size={20} />
        </button>
      </div>

      {/* Scrubber */}
      <div className="flex flex-col gap-1.5 my-2">
        <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-white h-full transition-all duration-300 rounded-full"
            style={{ width: `${(currentMedia.currentTime / currentMedia.duration) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-neutral-400 font-mono">
          <span>{formatSeconds(currentMedia.currentTime)}</span>
          <span>-{formatSeconds(currentMedia.duration - currentMedia.currentTime)}</span>
        </div>
      </div>

      {/* Media Controls */}
      <div className="flex items-center justify-around py-2">
        <button
          onClick={() => soundHaptics.playClick(750, 0.05)}
          className="text-neutral-400 hover:text-white p-2"
        >
          <SkipBack size={26} />
        </button>
        <button
          onClick={toggleMediaPlayback}
          className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center active:scale-95 transition-transform shadow-xl"
        >
          {isPlaying ? (
            <Pause size={28} className="fill-black" />
          ) : (
            <Play size={28} className="fill-black ml-1" />
          )}
        </button>
        <button
          onClick={() => soundHaptics.playClick(750, 0.05)}
          className="text-neutral-400 hover:text-white p-2"
        >
          <SkipForward size={26} />
        </button>
      </div>

      {/* Playlist Strip */}
      <div className="flex gap-2 overflow-x-auto pt-2 border-t border-neutral-900 pb-1">
        {tracks.map((t) => (
          <button
            key={t.title}
            onClick={() => selectTrack(t)}
            className={`px-3 py-1.5 rounded-full text-xs shrink-0 transition-colors ${
              currentMedia.title === t.title ? 'bg-rose-600 text-white font-bold' : 'bg-neutral-800 text-neutral-300'
            }`}
          >
            {t.title}
          </button>
        ))}
      </div>
    </div>
  );
};
