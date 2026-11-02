import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Star, ArrowRight, RotateCcw, LayoutGrid, CheckCircle } from 'lucide-react';
import { sound } from '../services/audio';

interface VictoryModalProps {
  isOpen: boolean;
  roomTitle: string;
  roomName: string;
  explanation: string;
  scoreBreakdown: {
    basePoints: number;
    timeBonus: number;
    hintPenalty: number;
    streakBonus: number;
    totalEarned: number;
  };
  stars: number;
  hasNextLevel: boolean;
  onNextLevel: () => void;
  onReplay: () => void;
  onBackToMap: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  roomTitle,
  roomName,
  explanation,
  scoreBreakdown,
  stars,
  hasNextLevel,
  onNextLevel,
  onReplay,
  onBackToMap,
}) => {
  useEffect(() => {
    if (isOpen) {
      sound.playSuccess();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#d97706', '#fbbf24', '#ffffff', '#38bdf8'],
        });
      } catch {
        // Ignore confetti error if canvas unmounted
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-amber-600/50 rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative overflow-hidden text-center">
        {/* Glow backdrop behind trophy */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-32 bg-amber-500/10 blur-3xl pointer-events-none" />

        {/* Victory Emblem */}
        <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 p-0.5 shadow-lg shadow-amber-900/40 flex items-center justify-center">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-amber-400">
            <Trophy className="w-8 h-8" />
          </div>
        </div>

        {/* Room Cleared Heading */}
        <div className="text-xs uppercase tracking-widest text-amber-400 font-semibold mb-1">
          Teka-Teki Terpecahkan!
        </div>
        <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-slate-100 mb-1">
          {roomName} Berhasil Dibuka
        </h3>
        <p className="text-xs text-slate-400 mb-4">{roomTitle}</p>

        {/* Stars Display */}
        <div className="flex items-center justify-center gap-2 mb-5">
          {[1, 2, 3].map(s => (
            <Star
              key={s}
              className={`w-7 h-7 transition-all ${
                s <= stars
                  ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)] scale-110'
                  : 'fill-slate-800 text-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Score Breakdown Table */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 mb-4 text-xs space-y-2 text-left">
          <div className="flex justify-between text-slate-400">
            <span>Poin Dasar Ruangan</span>
            <span className="font-mono-code text-slate-200">+{scoreBreakdown.basePoints}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Bonus Sisa Waktu</span>
            <span className="font-mono-code text-emerald-400">+{scoreBreakdown.timeBonus}</span>
          </div>
          {scoreBreakdown.hintPenalty > 0 && (
            <div className="flex justify-between text-slate-400">
              <span>Pengurangan Petunjuk</span>
              <span className="font-mono-code text-red-400">-{scoreBreakdown.hintPenalty}</span>
            </div>
          )}
          {scoreBreakdown.streakBonus > 0 && (
            <div className="flex justify-between text-slate-400">
              <span>Bonus Rentetan Berpikir (Streak)</span>
              <span className="font-mono-code text-amber-400">+{scoreBreakdown.streakBonus}</span>
            </div>
          )}
          <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm font-semibold">
            <span className="text-amber-300">Total Skor Diperoleh</span>
            <span className="font-mono-code text-amber-300 text-lg">
              +{scoreBreakdown.totalEarned} Pts
            </span>
          </div>
        </div>

        {/* Explanation & Critical Thinking Takeaway */}
        <div className="bg-amber-950/20 border border-amber-900/30 rounded-xl p-3 mb-6 text-left">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 mb-1">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Kunci Logika &amp; Pemecahan:</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{explanation}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            type="button"
            onClick={onBackToMap}
            className="flex-1 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Peta Ruangan</span>
          </button>
          <button
            type="button"
            onClick={onReplay}
            className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            title="Mainkan Ulang Level Ini"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Ulang</span>
          </button>
          {hasNextLevel && (
            <button
              type="button"
              onClick={onNextLevel}
              className="flex-1 py-2.5 px-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 active:scale-[0.99] text-white rounded-lg text-xs font-semibold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Level Berikutnya</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
