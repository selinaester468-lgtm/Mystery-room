import React from 'react';
import { ArrowLeft, Trophy, BarChart3, Crown, Award } from 'lucide-react';
import { LeaderboardEntry, PlayerStats } from '../../types/game';
import { sound } from '../../services/audio';

interface PeringkatModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: LeaderboardEntry[];
  playerStats: PlayerStats;
}

export const PeringkatModal: React.FC<PeringkatModalProps> = ({
  isOpen,
  onClose,
  entries,
  playerStats,
}) => {
  if (!isOpen) return null;

  // Ensure reference players like Selestia, Player02, etc. are shown as in the screenshot
  const displayList = entries.slice(0, 10);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in select-none">
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#251b3d] to-[#1a132e] border-4 border-[#5a4282] rounded-3xl p-5 sm:p-6 text-center shadow-[0_15px_35px_rgba(0,0,0,0.8)]">
        {/* Header Matching Screen 6: [←] [🏆 Peringkat] [📊] */}
        <div className="flex items-center justify-between mb-5">
          {/* Back Button */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-10 h-10 rounded-full bg-[#2d224d] border-2 border-[#584282] hover:bg-[#3d2f66] active:scale-95 text-amber-300 flex items-center justify-center shadow-md transition-transform cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Central Ribbon */}
          <div className="px-6 py-2 bg-gradient-to-r from-[#fef3c7] via-[#fde68a] to-[#fef3c7] border-2 border-[#b45309] rounded-2xl shadow-md flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-600 fill-amber-400" />
            <h3 className="font-fredoka text-base sm:text-lg font-bold text-[#78350f]">
              Peringkat
            </h3>
          </div>

          {/* Chart Icon Button */}
          <div className="w-10 h-10 rounded-full bg-[#2d224d] border-2 border-[#584282] text-amber-300 flex items-center justify-center shadow-md">
            <BarChart3 className="w-5 h-5" />
          </div>
        </div>

        {/* Parchment Leaderboard Table Matching Screen 6 */}
        <div className="bg-[#fef3c7] border-2 border-[#b45309] rounded-2xl p-2 sm:p-3 mb-4 shadow-inner overflow-hidden">
          <div className="divide-y divide-[#eab308]/40">
            {displayList.map((entry, index) => {
              const rank = index + 1;
              const isCurrentPlayer = entry.name.toLowerCase() === playerStats.playerName.toLowerCase();

              return (
                <div
                  key={entry.id}
                  className={`py-2 px-3 flex items-center justify-between font-fredoka text-xs sm:text-sm transition-colors ${
                    isCurrentPlayer ? 'bg-[#fde047]/60 rounded-xl font-bold' : ''
                  }`}
                >
                  {/* Rank number & Crown for Rank 1 */}
                  <div className="flex items-center gap-2.5 w-10 text-left">
                    <span className="font-bold text-[#78350f] text-sm">{rank}</span>
                    {rank === 1 && (
                      <Crown className="w-4 h-4 text-amber-500 fill-amber-400" />
                    )}
                  </div>

                  {/* Player Name */}
                  <div className="flex-1 text-left px-2 font-bold text-[#451a03] truncate">
                    {entry.name}
                    {isCurrentPlayer && (
                      <span className="ml-1.5 text-[10px] text-[#9a3412] font-semibold">
                        (Kamu)
                      </span>
                    )}
                  </div>

                  {/* Score */}
                  <div className="font-bold text-[#78350f] tabular-nums text-right">
                    {entry.score.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Player current status badge */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#2d224d] border border-[#584282] rounded-2xl text-xs font-fredoka text-purple-200 mb-4">
          <span>Skor Kamu Saat Ini:</span>
          <span className="font-bold text-amber-300 text-sm">
            {playerStats.totalScore.toLocaleString()} Pts
          </span>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="btn-cartoon-parchment w-full py-2.5 px-6 rounded-2xl font-fredoka text-sm font-bold tracking-wide transition-transform cursor-pointer border border-[#d97706]/40"
        >
          Tutup
        </button>
      </div>
    </div>
  );
};
