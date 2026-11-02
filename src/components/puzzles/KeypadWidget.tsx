import React, { useState } from 'react';
import { Delete, CornerDownLeft, RotateCcw } from 'lucide-react';
import { sound } from '../../services/audio';

interface KeypadWidgetProps {
  instruction: string;
  question: string;
  detailPrompt: string;
  expectedLength?: number;
  onSubmit: (code: string) => void;
  isSubmitting?: boolean;
}

export const KeypadWidget: React.FC<KeypadWidgetProps> = ({
  instruction,
  question,
  detailPrompt,
  onSubmit,
  isSubmitting = false,
}) => {
  const [inputVal, setInputVal] = useState<string>('');

  const handleKeyPress = (char: string) => {
    sound.playClick();
    if (inputVal.length < 12) {
      setInputVal(prev => prev + char);
    }
  };

  const handleBackspace = () => {
    sound.playClick();
    setInputVal(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    sound.playClick();
    setInputVal('');
  };

  const handleFormSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim()) return;
    onSubmit(inputVal.trim());
  };

  return (
    <div className="bg-slate-900/90 border border-amber-900/40 rounded-xl p-5 shadow-2xl backdrop-blur-md max-w-md mx-auto">
      <div className="mb-4 text-center">
        <h4 className="text-xs uppercase tracking-wider text-amber-500/90 font-medium mb-1">
          {instruction}
        </h4>
        <p className="text-sm text-slate-300 font-medium">{question}</p>
        <p className="text-xs text-slate-400 mt-1">{detailPrompt}</p>
      </div>

      {/* Screen Display */}
      <div className="bg-slate-950/90 border border-amber-500/30 rounded-lg p-3.5 mb-4 text-center shadow-inner">
        <div className="text-xs text-amber-500/60 font-mono-code uppercase tracking-wider mb-1">
          KODE INPUT
        </div>
        <div className="font-mono-code text-2xl md:text-3xl tracking-widest text-amber-300 min-h-[40px] flex items-center justify-center font-bold">
          {inputVal || <span className="text-slate-600 animate-pulse">_ _ _ _</span>}
        </div>
      </div>

      {/* Direct Keyboard Input Alternative */}
      <form onSubmit={handleFormSubmit} className="mb-4">
        <div className="relative">
          <input
            type="text"
            value={inputVal}
            onChange={e => setInputVal(e.target.value.toUpperCase())}
            placeholder="Ketik kode atau gunakan tombol..."
            className="w-full bg-slate-950/70 border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-lg px-3.5 py-2 text-sm text-amber-200 placeholder-slate-500 font-mono-code uppercase outline-none transition-colors"
          />
        </div>
      </form>

      {/* Mechanical Dial Keypad */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
          <button
            key={num}
            type="button"
            onClick={() => handleKeyPress(num)}
            className="h-12 bg-slate-800/80 hover:bg-amber-950/40 active:scale-95 border border-slate-700 hover:border-amber-500/50 rounded-lg text-lg font-bold text-slate-200 hover:text-amber-300 transition-all shadow-sm font-mono-code flex items-center justify-center cursor-pointer"
          >
            {num}
          </button>
        ))}
        <button
          type="button"
          onClick={handleClear}
          title="Hapus Semua"
          className="h-12 bg-slate-800/80 hover:bg-red-950/30 active:scale-95 border border-slate-700 hover:border-red-500/50 rounded-lg text-slate-400 hover:text-red-400 transition-all font-mono-code flex items-center justify-center cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => handleKeyPress('0')}
          className="h-12 bg-slate-800/80 hover:bg-amber-950/40 active:scale-95 border border-slate-700 hover:border-amber-500/50 rounded-lg text-lg font-bold text-slate-200 hover:text-amber-300 transition-all shadow-sm font-mono-code flex items-center justify-center cursor-pointer"
        >
          0
        </button>
        <button
          type="button"
          onClick={handleBackspace}
          title="Hapus Satu Karakter"
          className="h-12 bg-slate-800/80 hover:bg-amber-950/30 active:scale-95 border border-slate-700 hover:border-amber-500/50 rounded-lg text-slate-300 hover:text-amber-300 transition-all font-mono-code flex items-center justify-center cursor-pointer"
        >
          <Delete className="w-4 h-4" />
        </button>
      </div>

      {/* Submit Button */}
      <button
        type="button"
        disabled={isSubmitting || !inputVal.trim()}
        onClick={() => handleFormSubmit()}
        className="w-full py-3 px-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none rounded-lg text-white font-medium text-sm transition-all shadow-lg shadow-amber-900/30 flex items-center justify-center gap-2 cursor-pointer"
      >
        <CornerDownLeft className="w-4 h-4" />
        <span>Buka Kunci Brankas</span>
      </button>
    </div>
  );
};
