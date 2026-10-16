import React, { useState } from 'react';
import { Phone, Delete, User, PhoneCall, PhoneOff } from 'lucide-react';
import { soundHaptics } from '../../utils/haptics';
import { useLauncher } from '../../context/LauncherContext';

export const PhoneApp: React.FC = () => {
  const [number, setNumber] = useState('');
  const [isCalling, setIsCalling] = useState(false);
  const { setDynamicIsland } = useLauncher();

  const handleDigit = (digit: string, freq: number) => {
    soundHaptics.playDialTone(freq);
    setNumber((prev) => prev + digit);
  };

  const handleCall = () => {
    if (!number) return;
    soundHaptics.playClick(1000, 0.08);
    setIsCalling(true);
    // Link to Dynamic Island
    setDynamicIsland((prev) => ({
      ...prev,
      type: 'call',
      call: {
        contact: number,
        number: number,
        duration: 0,
        status: 'connected',
      },
    }));
  };

  const handleEndCall = () => {
    soundHaptics.playClick(600, 0.06);
    setIsCalling(false);
    setDynamicIsland((prev) => ({
      ...prev,
      type: prev.media?.isPlaying ? 'media' : 'idle',
      call: undefined,
    }));
  };

  const keypads = [
    { d: '1', sub: '', f: 697 },
    { d: '2', sub: 'ABC', f: 770 },
    { d: '3', sub: 'DEF', f: 852 },
    { d: '4', sub: 'GHI', f: 697 },
    { d: '5', sub: 'JKL', f: 770 },
    { d: '6', sub: 'MNO', f: 852 },
    { d: '7', sub: 'PQRS', f: 697 },
    { d: '8', sub: 'TUV', f: 770 },
    { d: '9', sub: 'WXYZ', f: 852 },
    { d: '*', sub: '', f: 941 },
    { d: '0', sub: '+', f: 941 },
    { d: '#', sub: '', f: 941 },
  ];

  return (
    <div className="w-full h-full bg-black text-white pt-14 pb-20 px-6 flex flex-col justify-between select-none">
      {isCalling ? (
        /* Active Call Screen */
        <div className="flex-1 flex flex-col items-center justify-between py-12">
          <div className="flex flex-col items-center gap-2 mt-8">
            <div className="w-20 h-20 rounded-full bg-neutral-800 flex items-center justify-center text-white/80">
              <User size={40} />
            </div>
            <h2 className="text-xl font-bold mt-2">{number}</h2>
            <span className="text-xs text-emerald-400 font-semibold animate-pulse">
              Calling...
            </span>
          </div>

          <button
            onClick={handleEndCall}
            className="w-18 h-18 rounded-full bg-red-600 text-white flex items-center justify-center active:scale-95 shadow-xl transition-transform"
          >
            <PhoneOff size={28} />
          </button>
        </div>
      ) : (
        /* Keypad Screen */
        <div className="flex-1 flex flex-col justify-end">
          {/* Number Display */}
          <div className="h-16 flex items-center justify-center mb-6 px-4">
            <span className="text-3xl font-light font-mono tracking-wider tabular-nums">
              {number || ''}
            </span>
          </div>

          {/* Keypad Grid */}
          <div className="grid grid-cols-3 gap-y-4 gap-x-6 max-w-[280px] mx-auto w-full">
            {keypads.map((k) => (
              <button
                key={k.d}
                onClick={() => handleDigit(k.d, k.f)}
                className="w-18 h-18 rounded-full bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600 flex flex-col items-center justify-center transition-colors mx-auto"
              >
                <span className="text-2xl font-light leading-none">{k.d}</span>
                {k.sub && (
                  <span className="text-[9px] font-bold tracking-widest text-neutral-400 mt-0.5">
                    {k.sub}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Call & Backspace buttons */}
          <div className="grid grid-cols-3 items-center max-w-[280px] mx-auto w-full mt-6">
            <div />
            <button
              onClick={handleCall}
              className="w-18 h-18 rounded-full bg-emerald-500 text-white flex items-center justify-center active:scale-95 shadow-lg mx-auto"
            >
              <Phone size={26} className="fill-white" />
            </button>
            {number && (
              <button
                onClick={() => {
                  soundHaptics.playClick(700, 0.04);
                  setNumber((p) => p.slice(0, -1));
                }}
                className="text-neutral-400 hover:text-white p-2 mx-auto"
              >
                <Delete size={22} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
