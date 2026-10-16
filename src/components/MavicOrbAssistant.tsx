import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Mic,
  MicOff,
  Send,
  Wifi,
  WifiOff,
  ExternalLink,
  FileText,
  Video,
  Image as ImageIcon,
  CheckCircle2,
  X,
  Volume2,
  Share2,
} from 'lucide-react';
import { useLauncher } from '../context/LauncherContext';
import { soundHaptics } from '../utils/haptics';

export const MavicOrbAssistant: React.FC = () => {
  const {
    userName,
    orbState,
    setOrbState,
    isInternetConnected,
    setIsInternetConnected,
    mavicOnlineResponse,
    executeMavicOrbCommand,
    isMavicListening,
    respondWaterPrompt,
    openApp,
  } = useLauncher();

  const [inputCommand, setInputCommand] = useState('');
  const floatingCardRef = useRef<HTMLDivElement | null>(null);

  // Suggested errand chips demonstrating app opening, voice reading, depression empathy, health, sleep, and web gathering
  const suggestedCommands = [
    "Hey Mavic, I'm depressed what can I do",
    'Speak alarms',
    'Read schedule',
    'Have you taken water this morning',
    'Hey Mavic, open settings',
    'Open health',
    'Goodnight (Bedtime Mode)',
    "Simulate 06:00 AM ('wake up')",
    'Weather forecast',
    'Go to the web to gather quantum computing',
  ];

  if (orbState === 'hidden') return null;

  const handleUserSubmit = (cmd: string) => {
    if (!cmd.trim()) return;
    setInputCommand('');
    executeMavicOrbCommand(cmd.trim());
  };

  return (
    <div
      onClick={(e) => {
        // If user taps outside the floating card, dismiss!
        if (orbState === 'display_online' || orbState === 'processing_offline') {
          soundHaptics.playClick(700, 0.04);
          setOrbState('hidden');
        }
      }}
      className="absolute inset-0 z-50 pointer-events-auto flex flex-col justify-end pb-10 px-4 select-none"
    >
      {/* 1. ROLLING COLORS IN A CIRCLE (FLOATING AT THE DOWN PART OF THE PHONE) */}
      <AnimatePresence>
        {orbState === 'listening' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 40 }}
            transition={{ type: 'spring', damping: 20, stiffness: 280 }}
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col items-center gap-3 mx-auto mb-4 w-full max-w-xs"
          >
            {/* Assistant prompt subtitle */}
            <div className="bg-black/60 backdrop-blur-xl border border-white/20 px-3.5 py-1.5 rounded-full text-xs text-white/90 font-medium shadow-xl flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>&quot;{userName}, speak I&apos;m listening&quot;</span>
            </div>

            {/* The Rolling Colors Circle (Apple Intelligence / Multi-chromatic rotating fluid sphere) */}
            <div className="relative w-28 h-28 flex items-center justify-center animate-float-gentle">
              {/* Outer chromatic glow halo */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-400 via-purple-500 to-amber-400 blur-xl opacity-60 animate-spin-slow" />

              {/* Counter-rotating chromatic ring */}
              <div className="absolute inset-1 rounded-full bg-gradient-to-br from-rose-500 via-indigo-500 to-emerald-400 blur-md opacity-80 animate-spin-reverse" />

              {/* Rolling colors core circle */}
              <div className="relative w-22 h-22 rounded-full overflow-hidden shadow-[0_0_35px_rgba(168,85,247,0.7)] border border-white/40 p-[2px] bg-black">
                <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#38bdf8] via-[#a855f7] via-[#ec4899] to-[#f59e0b] animate-spin-slow flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/30">
                    <Sparkles size={26} className="text-white drop-shadow-md animate-pulse" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick voice/text command input bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUserSubmit(inputCommand);
              }}
              className="w-full flex items-center bg-black/70 backdrop-blur-2xl border border-white/20 rounded-full px-3 py-1.5 shadow-2xl mt-1"
            >
              <Mic size={16} className="text-emerald-400 animate-pulse mr-2 shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Give MAVIC a command..."
                value={inputCommand}
                onChange={(e) => setInputCommand(e.target.value)}
                className="flex-1 bg-transparent text-xs text-white placeholder-white/50 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!inputCommand.trim()}
                className="w-7 h-7 rounded-full bg-emerald-500 text-black flex items-center justify-center shrink-0 disabled:opacity-40 ml-1 active:scale-90"
              >
                <Send size={12} />
              </button>
            </form>

            {/* Network mode badge & quick errand triggers */}
            <div className="flex items-center justify-between w-full px-1">
              <button
                onClick={() => {
                  soundHaptics.playClick(850, 0.05);
                  setIsInternetConnected(!isInternetConnected);
                }}
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 transition-colors ${
                  isInternetConnected
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}
                title="Click to toggle Online vs Offline state"
              >
                {isInternetConnected ? <Wifi size={10} /> : <WifiOff size={10} />}
                <span>{isInternetConnected ? 'Online Mode' : 'Offline Mode'}</span>
              </button>
              <span className="text-[10px] text-white/50">Tap to toggle net</span>
            </div>

            {/* Suggested Command Chips */}
            <div className="flex gap-1.5 overflow-x-auto w-full pb-1">
              {suggestedCommands.slice(0, 3).map((cmd, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleUserSubmit(cmd)}
                  className="px-2 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-[10px] text-white/80 whitespace-nowrap border border-white/10 active:scale-95"
                >
                  {cmd}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. BREAKING SHAPES AND ROLLING ANIMATION (IF NO INTERNET ACCESS) */}
      <AnimatePresence>
        {orbState === 'processing_offline' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col items-center gap-4 mx-auto mb-8 w-full max-w-xs text-center"
          >
            {/* Status notification */}
            <div className="bg-amber-950/80 backdrop-blur-xl border border-amber-500/40 px-3.5 py-1.5 rounded-full text-xs text-amber-200 font-semibold shadow-xl flex items-center gap-1.5">
              <WifiOff size={14} className="text-amber-400" />
              <span>Offline Mode: Colors Breaking &amp; Rolling</span>
            </div>

            {/* Geometric Shapes Breaking & Rolling in a Circle */}
            <div className="relative w-36 h-36 flex items-center justify-center my-2">
              {/* Central glowing fragment */}
              <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-amber-400 to-rose-500 shadow-[0_0_25px_rgba(245,158,11,0.8)] border border-white/60 animate-spin-slow" />

              {/* Shard 1: Rolling Triangle/Rhombus Left */}
              <div className="absolute w-8 h-8 rounded-sm bg-gradient-to-br from-cyan-400 to-blue-600 shadow-[0_0_20px_#38bdf8] border border-white/40 animate-shape-roll-1" />

              {/* Shard 2: Rolling Hexagon/Polygon Right */}
              <div className="absolute w-9 h-9 rounded-md bg-gradient-to-tr from-purple-500 to-pink-500 shadow-[0_0_20px_#a855f7] border border-white/40 animate-shape-roll-2" />

              {/* Shard 3: Rolling Ring/Segment Vertical */}
              <div className="absolute w-7 h-7 rounded-full bg-gradient-to-b from-emerald-400 to-teal-600 shadow-[0_0_20px_#10b981] border border-white/40 animate-shape-roll-3" />
            </div>

            {/* Offline Speech feedback */}
            {mavicOnlineResponse && (
              <div className="bg-black/60 backdrop-blur-xl border border-white/15 p-3.5 rounded-2xl text-xs text-white shadow-2xl leading-relaxed">
                <p className="font-medium text-amber-300 mb-1">
                  &quot;{mavicOnlineResponse.speechText}&quot;
                </p>
                {mavicOnlineResponse.actionDescription && (
                  <span className="text-[10px] text-emerald-400 font-mono block mt-1">
                    ✓ {mavicOnlineResponse.actionDescription}
                  </span>
                )}
                <span className="text-[10px] text-white/40 block mt-2">
                  Tap anywhere outside to close
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. TRANSPARENT FLOATING PAGE (IF INTERNET ACCESS: COLORS DISAPPEAR & ANSWERS IN SPEECH, IMAGES, VIDEOS, FILES, DOCS, LINKS) */}
      <AnimatePresence>
        {orbState === 'display_online' && mavicOnlineResponse && (
          <motion.div
            ref={floatingCardRef}
            initial={{ opacity: 0, y: 70, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 70, scale: 0.94 }}
            transition={{ type: 'spring', damping: 25, stiffness: 260 }}
            onClick={(e) => e.stopPropagation()} // Stop propagation so clicks inside don't dismiss!
            className="w-full max-w-sm mx-auto bg-black/45 backdrop-blur-3xl border border-white/20 rounded-[32px] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex flex-col gap-3.5 text-white max-h-[74vh] overflow-y-auto mb-2 relative"
          >
            {/* Header: Speech indicator & close button */}
            <div className="flex items-center justify-between pb-2 border-b border-white/15">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-cyan-400 via-indigo-500 to-pink-500 flex items-center justify-center shadow-md">
                  <Sparkles size={16} className="text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold tracking-tight">MAVIC AI Online</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <span className="text-[10px] text-white/60">
                    Speech Synthesized · Web Grounded
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  soundHaptics.playClick(750, 0.05);
                  setOrbState('hidden');
                }}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white/60 hover:text-white flex items-center justify-center transition-colors"
                title="Close floating page"
              >
                <X size={15} />
              </button>
            </div>

            {/* Written Speech Answer */}
            <div className="bg-white/10 rounded-2xl p-3 border border-white/10 flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-bold uppercase tracking-wider">
                <Volume2 size={13} className="animate-pulse" />
                <span>Speech Transcript</span>
              </div>
              <p className="text-xs leading-relaxed text-white/95 font-medium">
                {mavicOnlineResponse.speechText}
              </p>
              {mavicOnlineResponse.actionDescription && (
                <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 mt-1">
                  <CheckCircle2 size={12} />
                  <span>{mavicOnlineResponse.actionDescription}</span>
                </div>
              )}

              {/* Contextual Interactive Hydration response buttons */}
              {mavicOnlineResponse.speechText.toLowerCase().includes('have you taken water') && (
                <div className="flex gap-2 mt-2 pt-2 border-t border-white/10">
                  <button
                    onClick={() => respondWaterPrompt(true)}
                    className="flex-1 py-1.5 bg-sky-500 hover:bg-sky-400 text-white rounded-lg text-xs font-bold active:scale-95 transition-all shadow-sm"
                  >
                    Yes, I Drank Water
                  </button>
                  <button
                    onClick={() => respondWaterPrompt(false)}
                    className="flex-1 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold active:scale-95 transition-all"
                  >
                    Not Yet
                  </button>
                </div>
              )}

              {/* Contextual Emotional Wellness quick actions */}
              {mavicOnlineResponse.actionDescription?.includes('Emotional') && (
                <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-white/10">
                  <button
                    onClick={() => {
                      soundHaptics.playClick(900, 0.05);
                      executeMavicOrbCommand('Water hydration check');
                    }}
                    className="px-2.5 py-1 bg-sky-500/20 text-sky-300 rounded-lg text-[10px] font-semibold border border-sky-500/30 active:scale-95"
                  >
                    🥛 Drink Water
                  </button>
                  <button
                    onClick={() => {
                      soundHaptics.playClick(900, 0.05);
                      openApp('health');
                      setOrbState('hidden');
                    }}
                    className="px-2.5 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-[10px] font-semibold border border-purple-500/30 active:scale-95"
                  >
                    💜 Open Health
                  </button>
                  <button
                    onClick={() => {
                      soundHaptics.playClick(900, 0.05);
                      window.open('https://988lifeline.org', '_blank');
                    }}
                    className="px-2.5 py-1 bg-rose-500/20 text-rose-300 rounded-lg text-[10px] font-semibold border border-rose-500/30 active:scale-95"
                  >
                    📞 988 Lifeline
                  </button>
                </div>
              )}
            </div>

            {/* ONLINE IMAGES GRID */}
            {mavicOnlineResponse.images && mavicOnlineResponse.images.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-sky-400">
                  <ImageIcon size={14} />
                  <span>Online Images</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {mavicOnlineResponse.images.map((img, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl overflow-hidden bg-black/40 border border-white/15 flex flex-col group relative"
                    >
                      <div className="h-20 w-full overflow-hidden">
                        <img
                          src={img.url}
                          alt={img.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <span className="text-[10px] text-white/80 p-1.5 font-medium truncate bg-neutral-900/80">
                        {img.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ONLINE VIDEOS */}
            {mavicOnlineResponse.videos && mavicOnlineResponse.videos.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400">
                  <Video size={14} />
                  <span>Videos</span>
                </div>
                <div className="flex flex-col gap-2">
                  {mavicOnlineResponse.videos.map((vid, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 shadow-inner"
                          style={{ backgroundColor: vid.thumbnailBg }}
                        >
                          <Video size={16} className="text-white" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold leading-tight">{vid.title}</span>
                          <span className="text-[10px] text-white/60">
                            {vid.channel} · {vid.views}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/50 text-white/90">
                        {vid.duration}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FILES & DOCUMENTS */}
            {mavicOnlineResponse.files && mavicOnlineResponse.files.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                  <FileText size={14} />
                  <span>Files &amp; Documents</span>
                </div>
                <div className="flex flex-col gap-2">
                  {mavicOnlineResponse.files.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-xl bg-white/10 border border-white/10"
                    >
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-amber-400 shrink-0" />
                        <div>
                          <span className="text-xs font-semibold block">{file.name}</span>
                          <span className="text-[10px] text-white/50">{file.date}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-white/70">{file.size}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ONLINE WEB LINKS */}
            {mavicOnlineResponse.links && mavicOnlineResponse.links.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
                  <ExternalLink size={14} />
                  <span>Links &amp; Grounded Sources</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  {mavicOnlineResponse.links.map((link, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-sky-300 hover:underline">
                          {link.title}
                        </span>
                        <span className="text-[10px] text-white/60 truncate max-w-[240px]">
                          {link.snippet}
                        </span>
                      </div>
                      <ExternalLink size={13} className="text-white/40 shrink-0 ml-2" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SOCIAL MEDIA & COMMUNITY CONTENTS */}
            {mavicOnlineResponse.socialMedia && mavicOnlineResponse.socialMedia.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-teal-300">
                  <Share2 size={14} />
                  <span>Social Media &amp; Community Feeds</span>
                </div>
                <div className="flex flex-col gap-2">
                  {mavicOnlineResponse.socialMedia.map((post, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 flex flex-col gap-1.5 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="text-[9.5px] font-bold px-2 py-0.5 rounded-full text-white shadow-sm"
                            style={{ backgroundColor: post.badgeColor }}
                          >
                            {post.platform}
                          </span>
                          <span className="text-xs font-semibold text-white">{post.author}</span>
                          <span className="text-[11px] text-white/50">{post.handle}</span>
                        </div>
                        <span className="text-[10px] text-white/40">{post.date}</span>
                      </div>
                      <p className="text-xs text-white/90 leading-relaxed">{post.content}</p>
                      <div className="flex items-center justify-between text-[10px] text-white/60 pt-1 border-t border-white/5">
                        <span>{post.metrics}</span>
                        <span className="text-sky-300 hover:underline cursor-pointer">Live Thread ›</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tap outside to dismiss hint */}
            <div className="text-center pt-1 border-t border-white/10">
              <span className="text-[10px] text-white/40">
                Tap anywhere outside this floating card to dismiss
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
