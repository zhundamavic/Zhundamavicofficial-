import React, { useState } from 'react';
import { Send, ArrowLeft, MoreVertical, CheckCheck } from 'lucide-react';
import { soundHaptics } from '../../utils/haptics';

interface Message {
  id: string;
  sender: 'me' | 'them';
  text: string;
  time: string;
}

export const MessagesApp: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'them',
      text: 'Have you tried the new iPhone 16 launcher on your Android device?',
      time: '9:40 AM',
    },
    {
      id: '2',
      sender: 'me',
      text: 'Yes! The Dynamic Island and Camera Control button are incredible!',
      time: '9:41 AM',
    },
    {
      id: '3',
      sender: 'them',
      text: 'The iOS 18 tinted icons look so slick with the custom dark wallpapers.',
      time: '9:42 AM',
    },
  ]);

  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    soundHaptics.playClick(1050, 0.06);

    const newMsg: Message = {
      id: Date.now().toString(),
      sender: 'me',
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput('');

    // Simulated reply
    setTimeout(() => {
      soundHaptics.playClick(900, 0.05);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'them',
          text: 'Love it! Smooth 60fps animations too 🚀',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1200);
  };

  return (
    <div className="w-full h-full bg-[#f2f2f7] dark:bg-black text-slate-900 dark:text-white pt-14 pb-20 px-4 flex flex-col justify-between select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center text-xs">
            A
          </div>
          <div>
            <h2 className="text-xs font-bold leading-tight">Alex Rivera</h2>
            <span className="text-[10px] text-slate-400 font-mono">iMessage</span>
          </div>
        </div>
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-2.5">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col max-w-[78%] ${
              m.sender === 'me' ? 'self-end items-end' : 'self-start items-start'
            }`}
          >
            <div
              className={`p-3 rounded-2xl text-xs leading-relaxed ${
                m.sender === 'me'
                  ? 'bg-blue-500 text-white rounded-br-sm shadow-sm'
                  : 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-white rounded-bl-sm border border-slate-200/60 dark:border-white/5'
              }`}
            >
              {m.text}
            </div>
            <span className="text-[9.5px] text-slate-400 mt-1 px-1 font-mono">
              {m.time}
            </span>
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <form onSubmit={handleSend} className="flex items-center gap-2 pt-2">
        <input
          type="text"
          placeholder="iMessage"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-white dark:bg-neutral-900 border border-slate-300 dark:border-neutral-800 rounded-full px-4 py-2.5 text-xs focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center disabled:opacity-40 active:scale-90 transition-all shrink-0"
        >
          <Send size={15} />
        </button>
      </form>
    </div>
  );
};
