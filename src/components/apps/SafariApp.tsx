import React, { useState } from 'react';
import { Search, RefreshCw, Bookmark, Share, ArrowLeft, ArrowRight, Compass } from 'lucide-react';
import { soundHaptics } from '../../utils/haptics';

export const SafariApp: React.FC = () => {
  const [url, setUrl] = useState('apple.com/iphone-16');
  const [inputUrl, setInputUrl] = useState('apple.com/iphone-16');
  const [isLoading, setIsLoading] = useState(false);

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    soundHaptics.playClick(900, 0.05);
    setIsLoading(true);
    setUrl(inputUrl);
    setTimeout(() => setIsLoading(false), 400);
  };

  return (
    <div className="w-full h-full bg-[#f2f2f7] dark:bg-black text-slate-900 dark:text-white pt-14 pb-20 px-4 flex flex-col justify-between select-none">
      {/* Web Content Simulator */}
      <div className="flex-1 bg-white dark:bg-[#1c1c1e] rounded-3xl p-5 shadow-sm border border-slate-200/70 dark:border-white/5 overflow-y-auto mb-3">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-400">
            <RefreshCw size={24} className="animate-spin text-blue-500" />
            <span className="text-xs">Loading page...</span>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-neutral-800">
              <Compass size={20} className="text-blue-500" />
              <span className="text-xs font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-wider">
                {url}
              </span>
            </div>

            <div>
              <span className="text-xs font-bold text-amber-500 uppercase tracking-widest block mb-1">
                iPhone 16 Pro
              </span>
              <h2 className="text-xl font-bold tracking-tight mb-2">
                Hello, Apple Intelligence.
              </h2>
              <p className="text-xs text-slate-600 dark:text-neutral-300 leading-relaxed">
                Featuring the brand-new Camera Control button, stunning Super Retina XDR display with ProMotion, and titanium chassis designed for peak efficiency.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 my-2">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-neutral-800/80">
                <span className="text-[10px] text-slate-400 block">Hardware</span>
                <span className="text-sm font-bold">A18 Pro Chip</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-neutral-800/80">
                <span className="text-[10px] text-slate-400 block">Sensor</span>
                <span className="text-sm font-bold">48MP Fusion</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-200">
              ⚡ Running natively inside the iPhone 16 Launcher on Android.
            </div>
          </div>
        )}
      </div>

      {/* Safari Bottom Address Bar (iOS signature bottom layout) */}
      <div className="flex flex-col gap-2">
        <form
          onSubmit={handleNavigate}
          className="flex items-center bg-white dark:bg-[#1c1c1e] rounded-2xl px-3.5 py-2.5 shadow-md border border-slate-200/80 dark:border-white/10"
        >
          <Search size={15} className="text-neutral-400 mr-2 shrink-0" />
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="w-full bg-transparent text-xs text-slate-900 dark:text-white focus:outline-none"
          />
          <button type="submit" className="text-neutral-400 hover:text-blue-500 p-1">
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </form>

        <div className="flex justify-between items-center px-4 py-1 text-slate-500 dark:text-neutral-400 text-xs">
          <ArrowLeft size={18} className="cursor-pointer hover:text-blue-500" />
          <ArrowRight size={18} className="cursor-pointer hover:text-blue-500" />
          <Share size={18} className="cursor-pointer hover:text-blue-500" />
          <Bookmark size={18} className="cursor-pointer hover:text-blue-500" />
        </div>
      </div>
    </div>
  );
};
