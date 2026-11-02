import React, { useState } from 'react';
import { PlayerStats } from '../types/game';
import { getRankTitle } from '../services/storage';
import { User, X, Check, Award, Flame, Star, Shield, RotateCcw } from 'lucide-react';
import { sound } from '../services/audio';

interface DetectiveProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerStats: PlayerStats;
  onUpdateName: (newName: string) => void;
  onResetProgress: () => void;
}

export const DetectiveProfileModal: React.FC<DetectiveProfileModalProps> = ({
  isOpen,
  onClose,
  playerStats,
  onUpdateName,
  onResetProgress,
}) => {
  const [nameInput, setNameInput] = useState<string>(playerStats.playerName);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [showConfirmReset, setShowConfirmReset] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    sound.playClick();
    onUpdateName(nameInput.trim());
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleResetConfirm = () => {
    sound.playClick();
    onResetProgress();
    setShowConfirmReset(false);
    onClose();
  };

  const rankTitle = getRankTitle(playerStats.totalScore);

  // Total stars calculated
  const totalStars = Object.values(playerStats.levelStars).reduce((acc, curr) => acc + curr, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-amber-900/50 rounded-2xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden flex flex-col">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-600/40 flex items-center justify-center text-amber-400">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-cinzel text-lg font-bold text-slate-100">
              Profil Detektif
            </h3>
            <p className="text-xs text-slate-400">
              Atur identitas penyelidik dan periksa catatan rekor Anda.
            </p>
          </div>
        </div>

        {/* Name Form */}
        <form onSubmit={handleSave} className="mb-5">
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Nama / Alias Detektif:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              maxLength={24}
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-lg px-3 py-2 text-sm text-slate-100 outline-none transition-colors"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-medium rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1"
            >
              {isSaved ? <Check className="w-3.5 h-3.5" /> : null}
              <span>{isSaved ? 'Tersimpan' : 'Simpan'}</span>
            </button>
          </div>
        </form>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 gap-2.5 mb-5 text-xs">
          <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-lg">
            <div className="text-slate-400 mb-0.5">Pangkat Detektif</div>
            <div className="font-semibold text-amber-300">{rankTitle}</div>
          </div>
          <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-lg">
            <div className="text-slate-400 mb-0.5">Total Skor Akumulasi</div>
            <div className="font-mono-code font-bold text-slate-100 text-sm">
              {playerStats.totalScore.toLocaleString()} Pts
            </div>
          </div>
          <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-lg flex items-center justify-between">
            <div>
              <div className="text-slate-400 mb-0.5">Ruang Terpecahkan</div>
              <div className="font-semibold text-slate-200">
                {playerStats.levelsCompleted.length} / 8 Ruangan
              </div>
            </div>
            <Shield className="w-4 h-4 text-amber-500/60" />
          </div>
          <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-lg flex items-center justify-between">
            <div>
              <div className="text-slate-400 mb-0.5">Bintang Emas</div>
              <div className="font-semibold text-amber-400 flex items-center gap-1">
                <span>{totalStars}</span>
                <Star className="w-3.5 h-3.5 fill-amber-400" />
              </div>
            </div>
            <Award className="w-4 h-4 text-amber-500/60" />
          </div>
        </div>

        {/* Reset Progress Section */}
        <div className="pt-3 border-t border-slate-800">
          {showConfirmReset ? (
            <div className="bg-red-950/30 border border-red-800/40 p-3 rounded-lg text-xs space-y-2">
              <p className="text-red-300">
                Apakah Anda yakin ingin mengatur ulang semua progres level dan skor?
              </p>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowConfirmReset(false)}
                  className="px-3 py-1 bg-slate-800 text-slate-300 rounded text-xs cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleResetConfirm}
                  className="px-3 py-1 bg-red-700 hover:bg-red-600 text-white rounded text-xs cursor-pointer"
                >
                  Ya, Reset Progres
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowConfirmReset(true)}
              className="text-xs text-slate-500 hover:text-red-400 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Progres Permainan</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
