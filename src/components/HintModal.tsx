import React, { useState } from 'react';
import { Hint } from '../types/game';
import { sound } from '../services/audio';
import { HelpCircle, X, Lock, Check, AlertCircle, Lightbulb } from 'lucide-react';

interface HintModalProps {
  isOpen: boolean;
  onClose: () => void;
  hints: Hint[];
  unlockedHintTiers: number[];
  onUnlockHint: (tier: number, cost: number) => void;
  currentRoomScore: number;
}

export const HintModal: React.FC<HintModalProps> = ({
  isOpen,
  onClose,
  hints,
  unlockedHintTiers,
  onUnlockHint,
  currentRoomScore,
}) => {
  const [confirmTier, setConfirmTier] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleRequestUnlock = (tier: number) => {
    sound.playClick();
    setConfirmTier(tier);
  };

  const handleConfirmUnlock = (hint: Hint) => {
    sound.playHintReveal();
    onUnlockHint(hint.tier, hint.cost);
    setConfirmTier(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-amber-900/50 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative overflow-hidden">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-600/40 flex items-center justify-center text-amber-400">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-cinzel text-lg font-bold text-slate-100">
              Sistem Petunjuk Bertingkat
            </h3>
            <p className="text-xs text-slate-400">
              Gunakan bantuan jika menemui jalan buntu. Mengambil petunjuk akan memotong skor ruangan.
            </p>
          </div>
        </div>

        {/* Current Score Notice */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 mb-5 flex items-center justify-between text-xs">
          <span className="text-slate-400">Skor Potensial Saat Ini:</span>
          <span className="font-mono-code font-bold text-amber-300 text-sm">
            {currentRoomScore} Poin
          </span>
        </div>

        {/* Hints Tiers */}
        <div className="space-y-3.5 mb-6">
          {hints.map(hint => {
            const isUnlocked = unlockedHintTiers.includes(hint.tier);
            const isConfirming = confirmTier === hint.tier;

            return (
              <div
                key={hint.tier}
                className={`border rounded-xl p-4 transition-all ${
                  isUnlocked
                    ? 'bg-amber-950/20 border-amber-600/40'
                    : 'bg-slate-950/50 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                      Tingkat {hint.tier}: {hint.label}
                    </span>
                  </div>
                  {isUnlocked ? (
                    <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Terbuka
                    </span>
                  ) : (
                    <span className="text-[11px] font-mono-code text-amber-500/80">
                      -{hint.cost} Pts
                    </span>
                  )}
                </div>

                {isUnlocked ? (
                  <p className="text-xs text-slate-200 leading-relaxed bg-slate-900/80 p-3 rounded-lg border border-amber-900/30">
                    {hint.text}
                  </p>
                ) : isConfirming ? (
                  <div className="bg-slate-900/90 border border-amber-500/40 p-3 rounded-lg text-xs space-y-2">
                    <div className="flex items-center gap-1.5 text-amber-300">
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Buka petunjuk ini dengan penalti -{hint.cost} poin?</span>
                    </div>
                    <div className="flex gap-2 justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => setConfirmTier(null)}
                        className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition-colors cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        type="button"
                        onClick={() => handleConfirmUnlock(hint)}
                        className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white font-medium rounded text-xs transition-colors cursor-pointer"
                      >
                        Ya, Buka Sekarang
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-500 italic">
                      Petunjuk terkunci untuk menjaga tantangan penalaran Anda.
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRequestUnlock(hint.tier)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-amber-900/40 border border-slate-700 hover:border-amber-500/50 text-slate-200 hover:text-amber-300 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Buka (-{hint.cost} Pts)</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors cursor-pointer"
          >
            Tutup Jendela
          </button>
        </div>
      </div>
    </div>
  );
};
