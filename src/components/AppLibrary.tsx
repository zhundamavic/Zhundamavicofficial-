import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useLauncher, APPS } from '../context/LauncherContext';
import { AppDefinition } from '../types/launcher';
import { AppIcon } from './AppIcon';
import { soundHaptics } from '../utils/haptics';

export const AppLibrary: React.FC = () => {
  const { openApp } = useLauncher();
  const [search, setSearch] = useState('');

  const categories: AppDefinition['category'][] = [
    'Social',
    'Utilities',
    'Productivity',
    'Entertainment',
    'Creativity',
    'Information',
  ];

  const filteredApps = search.trim()
    ? APPS.filter((a) => a.name.toLowerCase().includes(search.toLowerCase()))
    : null;

  return (
    <div className="w-full h-full flex flex-col px-4 pt-1 pb-24 overflow-y-auto select-none">
      {/* Search Bar */}
      <div className="relative flex items-center bg-white/20 border border-white/25 rounded-2xl px-3 py-2.5 mb-4 backdrop-blur-xl shadow-md">
        <Search size={16} className="text-white/70 mr-2 shrink-0" />
        <input
          type="text"
          placeholder="App Library"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent text-white text-xs placeholder-white/60 focus:outline-none"
        />
        {search && (
          <button
            onClick={() => {
              soundHaptics.playClick(600, 0.04);
              setSearch('');
            }}
            className="text-white/60 hover:text-white"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Filtered Alphabetical List if searching */}
      {filteredApps ? (
        <div className="flex flex-col gap-2">
          {filteredApps.map((app) => (
            <div
              key={app.id}
              onClick={() => openApp(app.id)}
              className="flex items-center gap-3 p-2 rounded-xl bg-white/10 hover:bg-white/15 backdrop-blur-md cursor-pointer transition-colors"
            >
              <AppIcon app={app} showName={false} />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-white">{app.name}</span>
                <span className="text-[10px] text-white/60">{app.category}</span>
              </div>
            </div>
          ))}
          {filteredApps.length === 0 && (
            <div className="text-center text-xs text-white/50 py-8">No results found</div>
          )}
        </div>
      ) : (
        /* Categorized Smart Folders 2x2 Grid */
        <div className="grid grid-cols-2 gap-3.5 pb-8">
          {categories.map((cat) => {
            const catApps = APPS.filter((a) => a.category === cat);
            if (catApps.length === 0) return null;

            return (
              <div
                key={cat}
                className="bg-neutral-900/60 backdrop-blur-2xl border border-white/15 rounded-3xl p-3 shadow-lg flex flex-col justify-between h-[175px]"
              >
                <div className="grid grid-cols-2 gap-2">
                  {catApps.slice(0, 4).map((app) => (
                    <div
                      key={app.id}
                      onClick={() => openApp(app.id)}
                      className="flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
                    >
                      <AppIcon app={app} showName={false} />
                    </div>
                  ))}
                </div>
                <span className="text-[11px] font-bold text-white/80 text-center tracking-tight truncate block pt-1">
                  {cat}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
