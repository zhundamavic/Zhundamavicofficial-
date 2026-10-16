import React, { useState } from 'react';
import { Heart, Trash2, X, Share2 } from 'lucide-react';
import { soundHaptics } from '../../utils/haptics';

export const PhotosApp: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const photos = [
    { id: '1', url: '/src/assets/images/iphone16_default_wallpaper_1791853744695.jpg', label: 'Vibrant Waves' },
    { id: '2', url: '/src/assets/images/iphone16_dark_titanium_1791853745427.jpg', label: 'Dark Titanium' },
    { id: '3', url: '/src/assets/images/ios18_neon_dusk_1791853743681.jpg', label: 'Neon Sunset' },
  ];

  return (
    <div className="w-full h-full bg-black text-white pt-14 pb-20 px-4 flex flex-col select-none overflow-hidden">
      <div className="flex items-center justify-between mb-4 px-1">
        <h1 className="text-2xl font-bold tracking-tight">Photos</h1>
        <span className="text-xs text-neutral-400 font-mono">Library</span>
      </div>

      {/* Photo Grid */}
      <div className="flex-1 overflow-y-auto">
        <span className="text-xs font-semibold text-neutral-400 block mb-2 px-1">Recent Captures</span>
        <div className="grid grid-cols-3 gap-1.5">
          {photos.map((p) => (
            <div
              key={p.id}
              onClick={() => {
                soundHaptics.playClick(900, 0.04);
                setSelectedPhoto(p.url);
              }}
              className="aspect-square rounded-lg overflow-hidden bg-neutral-900 border border-neutral-800 cursor-pointer active:scale-95 transition-transform"
            >
              <img
                src={p.url}
                alt={p.label}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Photo Modal */}
      {selectedPhoto && (
        <div className="absolute inset-0 z-50 bg-black flex flex-col justify-between py-12 px-4">
          <div className="flex justify-between items-center text-white">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="p-2 text-white/80 hover:text-white"
            >
              <X size={22} />
            </button>
            <div className="flex gap-4">
              <button
                onClick={() => soundHaptics.playClick(950, 0.05)}
                className="p-2 text-rose-500 hover:text-rose-400"
              >
                <Heart size={20} />
              </button>
              <button
                onClick={() => soundHaptics.playClick(800, 0.05)}
                className="p-2 text-white/80 hover:text-white"
              >
                <Share2 size={20} />
              </button>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center p-2">
            <img
              src={selectedPhoto}
              alt="Preview"
              referrerPolicy="no-referrer"
              className="max-h-[75vh] w-auto object-contain rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
