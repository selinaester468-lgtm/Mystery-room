import React, { useState } from 'react';
import { Sparkles, RotateCcw, Flame } from 'lucide-react';
import { sound } from '../../services/audio';

interface SymbolItem {
  id: string;
  symbol: string;
  name: string;
  value: number;
}

interface SymbolDecoderWidgetProps {
  instruction: string;
  question: string;
  detailPrompt: string;
  symbols?: SymbolItem[];
  maxSlots?: number;
  onSubmit: (code: string) => void;
  isSubmitting?: boolean;
}

const DEFAULT_SYMBOLS: SymbolItem[] = [
  { id: 'api', symbol: '🜂', name: 'API (Fire)', value: 1 },
  { id: 'air', symbol: '🜄', name: 'AIR (Water)', value: 2 },
  { id: 'tanah', symbol: '🜃', name: 'TANAH (Earth)', value: 3 },
  { id: 'udara', symbol: '🜁', name: 'UDARA (Air)', value: 4 },
  { id: 'emas', symbol: '🜚', name: 'EMAS (Gold)', value: 5 },
  { id: 'perak', symbol: '🜛', name: 'PERAK (Silver)', value: 6 },
];

export const SymbolDecoderWidget: React.FC<SymbolDecoderWidgetProps> = ({
  instruction,
  question,
  detailPrompt,
  symbols = DEFAULT_SYMBOLS,
  maxSlots = 3,
  onSubmit,
  isSubmitting = false,
}) => {
  const [selectedSymbols, setSelectedSymbols] = useState<SymbolItem[]>([]);

  const handleSelectSymbol = (sym: SymbolItem) => {
    sound.playClick();
    if (selectedSymbols.length < maxSlots) {
      setSelectedSymbols(prev => [...prev, sym]);
    }
  };

  const handleRemoveSlot = (index: number) => {
    sound.playClick();
    setSelectedSymbols(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleReset = () => {
    sound.playClick();
    setSelectedSymbols([]);
  };

  const handleSubmit = () => {
    sound.playClick();
    if (selectedSymbols.length === 0) return;
    // Format options: "API-AIR-EMAS" or "🜂-🜄-🜚"
    const nameCode = selectedSymbols.map(s => s.id.toUpperCase()).join('-');
    onSubmit(nameCode);
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

      {/* Target Formula Slots */}
      <div className="bg-slate-950/80 border border-amber-800/40 rounded-xl p-4 mb-5 text-center">
        <div className="text-[11px] font-mono-code text-amber-400/80 uppercase tracking-widest mb-3">
          Slot Formula Transmutasi ({selectedSymbols.length}/{maxSlots})
        </div>

        <div className="flex items-center justify-center gap-3">
          {Array.from({ length: maxSlots }).map((_, idx) => {
            const current = selectedSymbols[idx];
            return (
              <div
                key={idx}
                onClick={() => current && handleRemoveSlot(idx)}
                className={`w-20 h-24 rounded-lg border-2 flex flex-col items-center justify-center transition-all cursor-pointer ${
                  current
                    ? 'border-amber-500 bg-amber-950/40 shadow-lg shadow-amber-900/30 text-amber-300'
                    : 'border-dashed border-slate-700 bg-slate-900/50 text-slate-600'
                }`}
                title={current ? `Klik untuk menghapus ${current.name}` : `Slot ${idx + 1}`}
              >
                {current ? (
                  <>
                    <span className="text-3xl mb-1">{current.symbol}</span>
                    <span className="text-[10px] font-medium text-amber-200 truncate max-w-[70px]">
                      {current.name.split(' ')[0]}
                    </span>
                    <span className="text-[9px] text-amber-500/60 mt-0.5">#{idx + 1}</span>
                  </>
                ) : (
                  <span className="text-xs font-mono-code text-slate-600">SLOT {idx + 1}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Symbol Selection Bank */}
      <div className="mb-5">
        <div className="text-xs text-slate-400 mb-2 font-medium">Pilih Simbol Alkimia:</div>
        <div className="grid grid-cols-3 gap-2.5">
          {symbols.map(sym => (
            <button
              key={sym.id}
              type="button"
              onClick={() => handleSelectSymbol(sym)}
              disabled={selectedSymbols.length >= maxSlots}
              className="p-3 bg-slate-800/80 hover:bg-amber-950/40 active:scale-95 disabled:opacity-40 disabled:pointer-events-none border border-slate-700 hover:border-amber-500/50 rounded-lg flex flex-col items-center justify-center transition-all cursor-pointer group"
            >
              <span className="text-2xl text-slate-200 group-hover:text-amber-300 transition-colors mb-1">
                {sym.symbol}
              </span>
              <span className="text-xs font-medium text-slate-300 group-hover:text-amber-200">
                {sym.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-3">
        <button
          type="button"
          onClick={handleReset}
          className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Kosongkan</span>
        </button>
        <button
          type="button"
          disabled={isSubmitting || selectedSymbols.length < maxSlots}
          onClick={handleSubmit}
          className="col-span-2 py-2.5 px-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 active:scale-[0.99] disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <Flame className="w-4 h-4" />
          <span>Aktivasi Tungku Transmutasi</span>
        </button>
      </div>
    </div>
  );
};
