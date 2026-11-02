import React, { useState } from 'react';
import { ChevronUp, ChevronDown, KeyRound, RotateCcw } from 'lucide-react';
import { sound } from '../../services/audio';

interface WordLockWidgetProps {
  instruction: string;
  question: string;
  detailPrompt: string;
  slotsCount?: number;
  initialLetters?: string[];
  onSubmit: (word: string) => void;
  isSubmitting?: boolean;
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const WordLockWidget: React.FC<WordLockWidgetProps> = ({
  instruction,
  question,
  detailPrompt,
  slotsCount = 4,
  initialLetters,
  onSubmit,
  isSubmitting = false,
}) => {
  const [letters, setLetters] = useState<string[]>(() => {
    if (initialLetters && initialLetters.length === slotsCount) {
      return [...initialLetters];
    }
    return Array(slotsCount).fill('A');
  });

  const [textInput, setTextInput] = useState<string>('');

  const cycleLetter = (index: number, direction: 1 | -1) => {
    sound.playDialTick();
    setLetters(prev => {
      const copy = [...prev];
      const currentIdx = ALPHABET.indexOf(copy[index]);
      const nextIdx = (currentIdx + direction + ALPHABET.length) % ALPHABET.length;
      copy[index] = ALPHABET[nextIdx];
      return copy;
    });
  };

  const handleReset = () => {
    sound.playClick();
    setLetters(Array(slotsCount).fill('A'));
    setTextInput('');
  };

  const handleCylinderSubmit = () => {
    sound.playClick();
    const word = letters.join('');
    onSubmit(word);
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    sound.playClick();
    onSubmit(textInput.trim().toUpperCase());
  };

  return (
    <div className="bg-slate-900/90 border border-amber-900/40 rounded-xl p-5 shadow-2xl backdrop-blur-md max-w-lg mx-auto">
      <div className="text-center mb-5">
        <h4 className="text-xs uppercase tracking-wider text-amber-500/90 font-medium mb-1">
          {instruction}
        </h4>
        <p className="text-sm text-slate-300 font-medium">{question}</p>
        <p className="text-xs text-slate-400 mt-1">{detailPrompt}</p>
      </div>

      {/* Cryptex Letter Cylinders */}
      <div className="bg-slate-950/80 border border-amber-800/40 rounded-xl p-5 mb-5 flex flex-col items-center">
        <div className="text-[11px] font-mono-code text-amber-400/80 uppercase tracking-widest mb-3">
          Silinder Huruf Berputar (Cryptex)
        </div>

        <div className="flex items-center justify-center gap-2 md:gap-3 mb-4">
          {letters.map((char, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => cycleLetter(idx, -1)}
                className="p-1 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded transition-colors cursor-pointer"
              >
                <ChevronUp className="w-5 h-5" />
              </button>

              <div className="w-12 h-16 bg-gradient-to-b from-amber-950/40 via-slate-800 to-amber-950/40 border-2 border-amber-600/50 rounded-lg flex items-center justify-center shadow-md">
                <span className="font-cinzel text-2xl font-bold text-amber-300">
                  {char}
                </span>
              </div>

              <button
                type="button"
                onClick={() => cycleLetter(idx, 1)}
                className="p-1 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded transition-colors cursor-pointer"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        <div className="text-xs text-slate-400">
          Kata yang terbaca:{' '}
          <span className="font-cinzel text-amber-300 font-bold text-base tracking-widest">
            {letters.join('')}
          </span>
        </div>
      </div>

      {/* Direct Quick Type Option */}
      <form onSubmit={handleTextSubmit} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={textInput}
            maxLength={slotsCount}
            onChange={e => setTextInput(e.target.value.toUpperCase())}
            placeholder={`Atau ketik langsung (${slotsCount} huruf)...`}
            className="flex-1 bg-slate-950/70 border border-slate-700 focus:border-amber-500 rounded-lg px-3 py-2 text-sm text-amber-200 placeholder-slate-500 font-cinzel uppercase outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={!textInput.trim()}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs text-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Terapkan
          </button>
        </div>
      </form>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-3">
        <button
          type="button"
          onClick={handleReset}
          className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
        <button
          type="button"
          disabled={isSubmitting}
          onClick={handleCylinderSubmit}
          className="col-span-2 py-2.5 px-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 active:scale-[0.99] disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <KeyRound className="w-4 h-4" />
          <span>Buka Gembok Silinder</span>
        </button>
      </div>
    </div>
  );
};
