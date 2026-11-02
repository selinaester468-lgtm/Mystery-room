import React from 'react';
import { PlayerStats } from '../../types/game';
import { sound } from '../../services/audio';
import { LogIn, Star, Trophy, Moon, Heart } from 'lucide-react';

interface ExitScreenProps {
  playerStats: PlayerStats;
  onReEnterGame: () => void;
}

export const ExitScreen: React.FC<ExitScreenProps> = ({
  playerStats,
  onReEnterGame,
}) => {
  const totalStars = Object.values(playerStats.levelStars).reduce((acc, curr) => acc + curr, 0);

  return (
    <div className="relative w-full h-full min-h-[640px] flex flex-col items-center justify-between p-6 sm:p-8 select-none overflow-hidden bg-[#130f24]">
      {/* Background with cozy night room */}
      <img
        src="/src/assets/images/mystery_room_cozy_bg_1793627597939.jpg"
        alt="Mystery Room at Night"
        className="absolute inset-0 w-full h-full object-cover filter brightness-[0.45] contrast-105 pointer-events-none"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#100c1e] via-[#16102b]/80 to-[#100c1e] pointer-events-none" />

      {/* Top Quiet Banner */}
      <div className="relative z-10 flex items-center gap-2 px-4 py-1.5 bg-[#251b3d]/90 border border-[#584282] rounded-full text-xs font-fredoka text-purple-200 mt-4 shadow-lg">
        <Moon className="w-3.5 h-3.5 text-amber-300" />
        <span>Ruang Misteri Sedang Terkunci Rapi</span>
      </div>

      {/* Center Goodbye Lockup */}
      <div className="relative z-10 flex flex-col items-center text-center my-auto max-w-xs">
        {/* Chibi Detective Resting */}
        <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full p-1.5 bg-gradient-to-b from-amber-400/40 to-purple-600/40 backdrop-blur-sm shadow-2xl mb-4">
          <img
            src="/src/assets/images/chibi_detective_happy_1793627597581.jpg"
            alt="Detective Rest"
            className="w-full h-full rounded-full object-cover"
          />
        </div>

        <h2 className="font-fredoka text-2xl sm:text-3xl font-extrabold text-amber-200 mb-1.5 drop-shadow-md">
          Sampai Jumpa, Detektif!
        </h2>
        <p className="font-fredoka text-xs sm:text-sm text-purple-200/90 leading-relaxed mb-4">
          Terima kasih telah mengasah otak dan memecahkan teka-teki hari ini. Kamu bisa kembali kapan saja untuk melanjutkan petualangan.
        </p>

        {/* Stats card */}
        <div className="w-full bg-[#241a3d]/90 border border-[#584282] rounded-2xl p-3.5 shadow-lg grid grid-cols-3 gap-2 text-center font-fredoka">
          <div>
            <div className="text-[10px] text-purple-300">Level</div>
            <div className="text-sm font-bold text-amber-300">
              {playerStats.levelsCompleted.length} / 8
            </div>
          </div>
          <div>
            <div className="text-[10px] text-purple-300">Bintang</div>
            <div className="text-sm font-bold text-amber-300 flex items-center justify-center gap-0.5">
              <span>{totalStars}</span>
              <Star className="w-3 h-3 fill-amber-400" />
            </div>
          </div>
          <div>
            <div className="text-[10px] text-purple-300">Skor</div>
            <div className="text-sm font-bold text-amber-300">
              {playerStats.totalScore.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Re-enter Button */}
      <div className="relative z-10 w-full max-w-xs mb-6">
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onReEnterGame();
          }}
          className="btn-cartoon-pink w-full py-3.5 px-6 rounded-full text-white font-fredoka text-base font-bold tracking-wide flex items-center justify-center gap-2.5 transition-transform cursor-pointer"
        >
          <LogIn className="w-5 h-5" />
          <span>Masuk Kembali ke Game</span>
        </button>
      </div>
    </div>
  );
};
