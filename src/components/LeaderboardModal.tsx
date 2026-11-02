import React from 'react';
import { LeaderboardEntry, PlayerStats } from '../types/game';
import { Trophy, Medal, X, Flame, Shield, Award } from 'lucide-react';
import { getRankTitle } from '../services/storage';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: LeaderboardEntry[];
  playerStats: PlayerStats;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  entries,
  playerStats,
}) => {
  if (!isOpen) return null;

  const currentRankTitle = getRankTitle(playerStats.totalScore);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-amber-900/50 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
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
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-cinzel text-lg font-bold text-slate-100">
              Peringkat Detektif &amp; Hall of Fame
            </h3>
            <p className="text-xs text-slate-400">
              Papan skor kehormatan pemecah teka-teki Mystery Room.
            </p>
          </div>
        </div>

        {/* Player Current Rank Card */}
        <div className="bg-gradient-to-r from-amber-950/50 via-slate-900 to-amber-950/30 border border-amber-600/40 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-amber-400 font-semibold">
                  Status Investigasi Anda
                </div>
                <div className="font-semibold text-slate-100 text-sm">{playerStats.playerName}</div>
                <div className="text-xs text-slate-400">{currentRankTitle}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-slate-400">Total Skor</div>
              <div className="font-mono-code text-lg font-bold text-amber-300">
                {playerStats.totalScore.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-500">
                {playerStats.levelsCompleted.length} / 8 Ruang Tuntas
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard Table List */}
        <div className="overflow-y-auto flex-1 pr-1 space-y-2 mb-4">
          {entries.map((entry, index) => {
            const isTop3 = index < 3;
            const isCurrentPlayer = entry.name.toLowerCase() === playerStats.playerName.toLowerCase();

            return (
              <div
                key={entry.id}
                className={`p-3 rounded-lg border transition-all flex items-center justify-between gap-3 ${
                  isCurrentPlayer
                    ? 'bg-amber-950/30 border-amber-500/60 ring-1 ring-amber-500/30'
                    : 'bg-slate-950/50 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold font-mono-code text-xs shrink-0 ${
                      index === 0
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                        : index === 1
                        ? 'bg-slate-300 text-slate-950'
                        : index === 2
                        ? 'bg-amber-800 text-amber-100'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {index + 1}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-xs text-slate-200 truncate">
                        {entry.name}
                      </span>
                      {isCurrentPlayer && (
                        <span className="text-[10px] text-amber-400 font-semibold px-1.5 py-0.2 bg-amber-950/60 rounded border border-amber-600/40">
                          Anda
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                      <span>{entry.rankTitle}</span>
                      <span>·</span>
                      <span>{entry.roomsCleared} Ruang</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-mono-code text-xs font-bold text-amber-300">
                    {entry.score.toLocaleString()} Pts
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Ranking Tier Guide */}
        <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex flex-wrap gap-x-4 gap-y-1 justify-center">
          <span>Magang (&lt;1.8k)</span>
          <span>·</span>
          <span>Penyelidik (1.8k+)</span>
          <span>·</span>
          <span>Pemecah Sandi (4.5k+)</span>
          <span>·</span>
          <span>Master Deduksi (8k+)</span>
          <span>·</span>
          <span className="text-amber-400 font-semibold">Legenda (12k+)</span>
        </div>
      </div>
    </div>
  );
};
