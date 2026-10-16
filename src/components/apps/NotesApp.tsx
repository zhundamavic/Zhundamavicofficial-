import React, { useState } from 'react';
import { Plus, Trash2, Search, CheckSquare, Square, Edit3 } from 'lucide-react';
import { soundHaptics } from '../../utils/haptics';

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
}

export const NotesApp: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'iPhone 16 Launcher Features',
      content: 'Dynamic Island live activities, Camera Control slider, customizable iOS 18 squircle grid, modular Control Center, and lock screen widgets.',
      date: 'Oct 14',
    },
    {
      id: '2',
      title: 'Grocery List',
      content: 'Almond milk, organic avocados, sourdough bread, espresso beans, green apples.',
      date: 'Oct 12',
    },
  ]);

  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [search, setSearch] = useState('');

  const createNote = () => {
    soundHaptics.playClick(900, 0.05);
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'New Note',
      content: '',
      date: 'Today',
    };
    setNotes([newNote, ...notes]);
    setActiveNote(newNote);
  };

  const deleteNote = (id: string) => {
    soundHaptics.playClick(750, 0.05);
    setNotes(notes.filter((n) => n.id !== id));
    if (activeNote?.id === id) setActiveNote(null);
  };

  const updateActiveContent = (text: string) => {
    if (!activeNote) return;
    const lines = text.split('\n');
    const title = lines[0] || 'New Note';
    const updated = { ...activeNote, title, content: text };
    setActiveNote(updated);
    setNotes(notes.map((n) => (n.id === updated.id ? updated : n)));
  };

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full h-full bg-[#f2f2f7] dark:bg-black text-slate-900 dark:text-white pt-14 pb-20 px-4 flex flex-col select-none">
      {activeNote ? (
        /* Edit Note Screen */
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-neutral-800">
            <button
              onClick={() => setActiveNote(null)}
              className="text-amber-500 font-semibold text-sm hover:underline"
            >
              ‹ Notes
            </button>
            <button
              onClick={() => deleteNote(activeNote.id)}
              className="text-red-500 p-1 hover:text-red-400"
            >
              <Trash2 size={18} />
            </button>
          </div>
          <textarea
            autoFocus
            value={activeNote.content}
            onChange={(e) => updateActiveContent(e.target.value)}
            placeholder="Type your note here..."
            className="flex-1 w-full bg-transparent p-3 text-sm focus:outline-none resize-none leading-relaxed text-slate-800 dark:text-neutral-100 font-sans"
          />
        </div>
      ) : (
        /* Notes List Screen */
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-3 px-1">
            <h1 className="text-2xl font-bold tracking-tight">Notes</h1>
            <button
              onClick={createNote}
              className="p-1.5 rounded-full bg-amber-500 text-black active:scale-95 transition-transform"
            >
              <Plus size={18} />
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex items-center bg-slate-200 dark:bg-neutral-800 rounded-xl px-3 py-2 mb-3">
            <Search size={15} className="text-neutral-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search Notes"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-xs focus:outline-none"
            />
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto flex flex-col gap-2">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                onClick={() => {
                  soundHaptics.playClick(850, 0.04);
                  setActiveNote(note);
                }}
                className="bg-white dark:bg-[#1c1c1e] p-3.5 rounded-2xl shadow-sm border border-slate-200/60 dark:border-white/5 cursor-pointer hover:bg-slate-50 dark:hover:bg-[#252528] transition-colors"
              >
                <h3 className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                  {note.title}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-neutral-400 line-clamp-2 mt-1">
                  {note.content || 'No additional text'}
                </p>
                <span className="text-[10px] text-amber-500 font-medium block mt-1.5 font-mono">
                  {note.date}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
