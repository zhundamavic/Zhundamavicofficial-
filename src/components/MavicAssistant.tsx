import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mic,
  MicOff,
  Send,
  X,
  Sparkles,
  Command,
  CheckCircle2,
  Volume2,
} from 'lucide-react';
import { useLauncher } from '../context/LauncherContext';
import { soundHaptics } from '../utils/haptics';

export const MavicAssistant: React.FC = () => {
  const {
    userName,
    isMavicOnline,
    isMavicListening,
    startMavicListening,
    stopMavicListening,
    isMavicSheetOpen,
    setIsMavicSheetOpen,
    mavicMessages,
    executeMavicCommand,
    awaitingUserName,
  } = useLauncher();

  const [input, setInput] = useState('');

  if (!isMavicSheetOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const cmd = input;
    setInput('');
    executeMavicCommand(cmd);
  };

  const sampleCommands = awaitingUserName
    ? [`My name is ${userName}`, `Call me ${userName}`, 'Marvellous']
    : [
        'Hi Mavic',
        'Turn on flashlight',
        'Set brightness to 80%',
        'Take a photo',
        'Play music',
        'Start 3 min timer',
      ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsMavicSheetOpen(false)}
        className="absolute inset-0 z-50 bg-black/60 backdrop-blur-2xl flex flex-col justify-end select-none"
      >
        <motion.div
          initial={{ y: 250, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 250, opacity: 0 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-sm mx-auto bg-neutral-900/95 border-t border-white/15 rounded-t-[36px] p-5 shadow-2xl flex flex-col gap-3 text-white max-h-[82vh]"
        >
          {/* Grab handle */}
          <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-1" />

          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md">
                <Sparkles size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold tracking-tight">MAVIC Assistant</h2>
                  {isMavicOnline && (
                    <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Online
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-neutral-400">
                  Offline OS Intelligence · Full Device Control
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsMavicSheetOpen(false)}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X size={15} />
            </button>
          </div>

          {/* Conversation Feed */}
          <div className="flex-1 overflow-y-auto max-h-[40vh] flex flex-col gap-2.5 py-1 px-0.5">
            {mavicMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[85%] ${
                  msg.sender === 'user' ? 'self-end items-end' : 'self-start items-start'
                }`}
              >
                <div
                  className={`p-3 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-sm shadow-sm'
                      : 'bg-neutral-800 text-neutral-100 rounded-bl-sm border border-white/10'
                  }`}
                >
                  <p>{msg.text}</p>
                  {msg.actionDescription && (
                    <div className="mt-1.5 pt-1.5 border-t border-white/10 flex items-center gap-1 text-[10px] text-emerald-400 font-semibold font-mono">
                      <CheckCircle2 size={12} />
                      <span>{msg.actionDescription}</span>
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-neutral-500 mt-0.5 px-1 font-mono">
                  {msg.timestamp}
                </span>
              </div>
            ))}
          </div>

          {/* Quick Suggestion Chips */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 pt-0.5">
            {sampleCommands.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => executeMavicCommand(chip)}
                className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/15 text-[11px] text-neutral-300 font-medium whitespace-nowrap active:scale-95 transition-all border border-white/10"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Voice Mic & Text Input */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                if (isMavicListening) stopMavicListening();
                else startMavicListening();
              }}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all shadow-md active:scale-90 shrink-0 ${
                isMavicListening
                  ? 'bg-rose-600 text-white animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.6)]'
                  : 'bg-emerald-500 text-black hover:bg-emerald-400'
              }`}
              title={isMavicListening ? 'Stop listening' : 'Start voice recognition'}
            >
              {isMavicListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>

            <input
              type="text"
              placeholder={awaitingUserName ? 'Enter your name...' : 'Ask MAVIC to control phone...'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-neutral-800 border border-white/15 rounded-full px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
            />

            <button
              type="submit"
              disabled={!input.trim()}
              className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center disabled:opacity-40 transition-all shrink-0 active:scale-90"
            >
              <Send size={15} />
            </button>
          </form>

          <span className="text-[10px] text-neutral-400 text-center tracking-tight">
            Say &quot;Hi Mavic&quot; anytime to invoke · Documented in offline database
          </span>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
