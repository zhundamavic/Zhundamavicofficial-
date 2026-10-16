import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Calculator, Globe, ArrowRight } from 'lucide-react';
import { useLauncher, APPS } from '../context/LauncherContext';
import { soundHaptics } from '../utils/haptics';
import { AppIcon } from './AppIcon';

export const SpotlightSearch: React.FC = () => {
  const { isSpotlightOpen, setIsSpotlightOpen, openApp } = useLauncher();
  const [query, setQuery] = useState('');

  // Math expression evaluation
  const mathResult = useMemo(() => {
    if (!query.trim()) return null;
    const clean = query.replace(/[^-()\d/*+.]/g, '');
    if (clean.length < 2) return null;
    try {
      // safe simple evaluation of basic math
      const res = Function(`"use strict"; return (${clean})`)();
      if (typeof res === 'number' && !isNaN(res) && isFinite(res)) {
        return res;
      }
    } catch {
      return null;
    }
    return null;
  }, [query]);

  // Filter apps
  const matchedApps = useMemo(() => {
    if (!query.trim()) return APPS.slice(0, 8);
    const q = query.toLowerCase();
    return APPS.filter(
      (app) =>
        app.name.toLowerCase().includes(q) ||
        app.category.toLowerCase().includes(q)
    );
  }, [query]);

  if (!isSpotlightOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsSpotlightOpen(false)}
        className="absolute inset-0 z-50 bg-black/60 backdrop-blur-2xl flex flex-col pt-16 px-5 select-none"
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-sm mx-auto flex flex-col gap-3"
        >
          {/* Search Input Box */}
          <div className="relative flex items-center bg-white/15 border border-white/20 rounded-2xl px-3.5 py-3 shadow-2xl backdrop-blur-md">
            <Search size={18} className="text-white/60 mr-2.5 shrink-0" />
            <input
              type="text"
              autoFocus
              placeholder="Search apps, calculate, web..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-white text-sm placeholder-white/50 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => {
                  soundHaptics.playClick(600, 0.04);
                  setQuery('');
                }}
                className="text-white/60 hover:text-white p-1"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Math calculation result if valid */}
          {mathResult !== null && (
            <div
              onClick={() => {
                soundHaptics.playClick(1000, 0.05);
                openApp('calculator');
              }}
              className="bg-white/15 hover:bg-white/20 border border-white/20 rounded-2xl p-3 flex items-center justify-between text-white cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center text-white">
                  <Calculator size={18} />
                </div>
                <div>
                  <span className="text-xs text-white/60 block">{query} =</span>
                  <span className="text-lg font-bold font-mono text-amber-300">{mathResult}</span>
                </div>
              </div>
              <ArrowRight size={16} className="text-white/40" />
            </div>
          )}

          {/* App Matches */}
          <div className="bg-white/10 border border-white/15 rounded-2xl p-3 flex flex-col gap-2 shadow-xl">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/50 px-1">
              {query ? 'Top Hits' : 'Siri Suggestions'}
            </span>
            <div className="grid grid-cols-4 gap-3 py-1">
              {matchedApps.slice(0, 8).map((app) => (
                <div key={app.id} className="flex justify-center">
                  <AppIcon
                    app={app}
                    onClick={() => {
                      openApp(app.id);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Web search item */}
          {query.trim() && (
            <div
              onClick={() => {
                soundHaptics.playClick(800, 0.05);
                openApp('safari');
              }}
              className="bg-white/10 hover:bg-white/15 border border-white/15 rounded-2xl p-3 flex items-center justify-between text-white cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-sky-500 flex items-center justify-center text-white">
                  <Globe size={18} />
                </div>
                <span className="text-xs font-medium text-white/90">
                  Search web for &quot;{query}&quot;
                </span>
              </div>
              <ArrowRight size={16} className="text-white/40" />
            </div>
          )}

          <button
            onClick={() => setIsSpotlightOpen(false)}
            className="text-center text-xs text-white/50 hover:text-white/80 py-2"
          >
            Cancel
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
