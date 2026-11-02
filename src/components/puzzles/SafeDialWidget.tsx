import React, { useState } from 'react';
import { ChevronUp, ChevronDown, CheckCircle2, RotateCcw } from 'lucide-react';
import { sound } from '../../services/audio';

interface SafeDialWidgetProps {
  instruction: string;
  question: string;
  detailPrompt: string;
  onSubmit: (code: string) => void;
  isSubmitting?: boolean;
}

export const SafeDialWidget: React.FC<SafeDialWidgetProps> = ({
  instruction,
  question,
  detailPrompt,
  onSubmit,
  isSubmitting = false,
}) => {
  // 3 tumblers for [A] - [B] - [C]
  const [tumbler1, setTumbler1] = useState<number>(10);
  const [tumbler2, setTumbler2] = useState<number>(20);
  const [tumbler3, setTumbler3] = useState<number>(10);

  const changeTumbler = (index: 1 | 2 | 3, delta: number) => {
    sound.playDialTick();
    if (index === 1) {
      setTumbler1(prev => (prev + delta + 100) % 100);
    } else if (index === 2) {
      setTumbler2(prev => (prev + delta + 100) % 100);
    } else {
      setTumbler3(prev => (prev + delta + 100) % 100);
    }
  };

  const handleReset = () => {
    sound.playClick();
    setTumbler1(0);
    setTumbler2(0);
    setTumbler3(0);
  };

  const handleSubmit = () => {
    sound.playClick();
    const formattedCode = `${tumbler1}-${tumbler2}-${tumbler3}`;
    onSubmit(formattedCode);
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

      {/* Brass Safe Dial Visual Representation */}
      <div className="bg-slate-950/80 border border-amber-700/30 rounded-xl p-6 mb-5 flex flex-col items-center">
        <div className="flex items-center justify-center gap-4 md:gap-6 mb-4">
          {/* Tumbler 1 */}
          <div className="flex flex-col items-center">
            <span className="text-[11px] font-mono-code text-amber-400/80 mb-1">DIAL A</span>
            <button
              type="button"
              onClick={() => changeTumbler(1, 1)}
              className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded transition-colors cursor-pointer"
            >
              <ChevronUp className="w-6 h-6" />
            </button>
            <div className="w-16 h-20 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-2 border-amber-600/40 rounded-lg flex items-center justify-center shadow-inner">
              <span className="text-2xl font-bold font-mono-code text-amber-300 tabular-nums">
                {String(tumbler1).padStart(2, '0')}
              </span>
            </div>
            <button
              type="button"
              onClick={() => changeTumbler(1, -1)}
              className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded transition-colors cursor-pointer"
            >
              <ChevronDown className="w-6 h-6" />
            </button>
          </div>

          <div className="text-xl font-bold text-amber-500/40 pt-4">-</div>

          {/* Tumbler 2 */}
          <div className="flex flex-col items-center">
            <span className="text-[11px] font-mono-code text-amber-400/80 mb-1">DIAL B</span>
            <button
              type="button"
              onClick={() => changeTumbler(2, 1)}
              className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded transition-colors cursor-pointer"
            >
              <ChevronUp className="w-6 h-6" />
            </button>
            <div className="w-16 h-20 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-2 border-amber-600/40 rounded-lg flex items-center justify-center shadow-inner">
              <span className="text-2xl font-bold font-mono-code text-amber-300 tabular-nums">
                {String(tumbler2).padStart(2, '0')}
              </span>
            </div>
            <button
              type="button"
              onClick={() => changeTumbler(2, -1)}
              className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded transition-colors cursor-pointer"
            >
              <ChevronDown className="w-6 h-6" />
            </button>
          </div>

          <div className="text-xl font-bold text-amber-500/40 pt-4">-</div>

          {/* Tumbler 3 */}
          <div className="flex flex-col items-center">
            <span className="text-[11px] font-mono-code text-amber-400/80 mb-1">DIAL C</span>
            <button
              type="button"
              onClick={() => changeTumbler(3, 1)}
              className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded transition-colors cursor-pointer"
            >
              <ChevronUp className="w-6 h-6" />
            </button>
            <div className="w-16 h-20 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-2 border-amber-600/40 rounded-lg flex items-center justify-center shadow-inner">
              <span className="text-2xl font-bold font-mono-code text-amber-300 tabular-nums">
                {String(tumbler3).padStart(2, '0')}
              </span>
            </div>
            <button
              type="button"
              onClick={() => changeTumbler(3, -1)}
              className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded transition-colors cursor-pointer"
            >
              <ChevronDown className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Quick Stepper Presets / Number Inputs */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
          <span>Kombinasi Saat Ini:</span>
          <span className="font-mono-code text-amber-300 font-bold text-sm tracking-widest">
            {tumbler1} - {tumbler2} - {tumbler3}
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-3 gap-3">
        <button
          type="button"
          onClick={handleReset}
          className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Dial</span>
        </button>
        <button
          type="button"
          disabled={isSubmitting}
          onClick={handleSubmit}
          className="col-span-2 py-2.5 px-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 active:scale-[0.99] disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Uji Kombinasi Brankas</span>
        </button>
      </div>
    </div>
  );
};
