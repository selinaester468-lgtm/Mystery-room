import React, { useState } from 'react';
import { RoomLevel, PlayerStats } from '../../types/game';
import { sound } from '../../services/audio';
import { GAME_IMAGES } from '../../services/assets';
import { ArrowLeft, Home, Star, Lock, Moon, Sun, Clock, Key, Compass, Sparkles, Flame, BookOpen } from 'lucide-react';

interface LevelSelectScreenProps {
  rooms: RoomLevel[];
  playerStats: PlayerStats;
  onSelectLevel: (room: RoomLevel) => void;
  onBackToTitle: () => void;
}

export const LevelSelectScreen: React.FC<LevelSelectScreenProps> = ({
  rooms,
  playerStats,
  onSelectLevel,
  onBackToTitle,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const pageSize = 4;
  const totalPages = Math.ceil(rooms.length / pageSize);

  const displayedRooms = rooms.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  const isRoomUnlocked = (roomId: number) => {
    if (roomId === 1) return true;
    return playerStats.levelsCompleted.includes(roomId - 1);
  };

  const handleCardClick = (room: RoomLevel) => {
    if (!isRoomUnlocked(room.id)) {
      sound.playWrong();
      return;
    }
    sound.playClick();
    onSelectLevel(room);
  };

  // Helper for icons matching sensible riddles
  const getCardIcon = (levelId: number) => {
    switch (levelId) {
      case 1:
        return <Moon className="w-9 h-9 sm:w-10 sm:h-10 text-amber-500" />;
      case 2:
        return <Sun className="w-9 h-9 sm:w-10 sm:h-10 text-indigo-500" />;
      case 3:
        return <Clock className="w-9 h-9 sm:w-10 sm:h-10 text-amber-600" />;
      case 4:
        return <Key className="w-9 h-9 sm:w-10 sm:h-10 text-amber-700" />;
      case 5:
        return <Compass className="w-9 h-9 sm:w-10 sm:h-10 text-teal-600" />;
      case 6:
        return <Sparkles className="w-9 h-9 sm:w-10 sm:h-10 text-cyan-600" />;
      case 7:
        return <Flame className="w-9 h-9 sm:w-10 sm:h-10 text-orange-500" />;
      case 8:
        return <BookOpen className="w-9 h-9 sm:w-10 sm:h-10 text-purple-600" />;
      default:
        return <Sparkles className="w-9 h-9 sm:w-10 sm:h-10 text-amber-500" />;
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-3 sm:p-5 select-none bg-[#1d1733]">
      {/* Background with subtle stars */}
      <img
        src={GAME_IMAGES.cozyBg}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover filter brightness-[0.4] pointer-events-none"
      />
      <div className="absolute inset-0 bg-[#1a1330]/85 pointer-events-none" />

      {/* Top Header matching reference */}
      <div className="relative z-10 flex items-center justify-between mb-2 sm:mb-3">
        {/* Back Arrow */}
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onBackToTitle();
          }}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#2d224d] border-2 border-[#584282] hover:bg-[#3d2f66] active:scale-95 text-amber-300 flex items-center justify-center shadow-lg transition-transform cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Central Parchment Ribbon Banner */}
        <div className="px-5 py-1.5 sm:px-6 sm:py-2 bg-gradient-to-r from-[#fef3c7] via-[#fde68a] to-[#fef3c7] border-2 border-[#b45309] rounded-2xl shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
          <h2 className="font-fredoka text-sm sm:text-lg font-bold text-[#78350f] tracking-wide">
            Pilih Level
          </h2>
        </div>

        {/* Home Button */}
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onBackToTitle();
          }}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#2d224d] border-2 border-[#584282] hover:bg-[#3d2f66] active:scale-95 text-amber-300 flex items-center justify-center shadow-lg transition-transform cursor-pointer"
        >
          <Home className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* 2x2 Level Cards Grid */}
      <div className="relative z-10 grid grid-cols-2 gap-2.5 sm:gap-4 my-auto max-w-sm sm:max-w-md mx-auto w-full">
        {displayedRooms.map(room => {
          const unlocked = isRoomUnlocked(room.id);
          const completed = playerStats.levelsCompleted.includes(room.id);
          const starsEarned = playerStats.levelStars[room.id] || (completed ? 3 : 0);

          return (
            <div
              key={room.id}
              onClick={() => handleCardClick(room)}
              className={`relative rounded-2xl p-2.5 sm:p-4 border-2 transition-all flex flex-col items-center justify-between min-h-[140px] sm:min-h-[175px] shadow-[0_6px_16px_rgba(0,0,0,0.4)] ${
                unlocked
                  ? 'bg-gradient-to-b from-[#fef3c7] to-[#fde68a] border-[#b45309] hover:-translate-y-1 active:translate-y-0.5 cursor-pointer'
                  : 'bg-[#2d2547] border-[#4a3d6f] opacity-75 cursor-not-allowed'
              }`}
            >
              {/* Card Title Header */}
              <div className="text-center w-full">
                <div
                  className={`font-fredoka text-sm sm:text-base font-bold ${
                    unlocked ? 'text-[#78350f]' : 'text-slate-400'
                  }`}
                >
                  {room.roomName}
                </div>
                <div
                  className={`font-fredoka text-[11px] sm:text-xs font-semibold ${
                    unlocked ? 'text-[#92400e]' : 'text-slate-500'
                  }`}
                >
                  {room.difficulty}
                </div>
                <div
                  className={`inline-block font-fredoka text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5 border ${
                    unlocked
                      ? 'bg-amber-200/90 text-amber-900 border-amber-600/40 shadow-xs'
                      : 'bg-slate-800/80 text-slate-400 border-slate-700'
                  }`}
                >
                  50 Teka-Teki
                </div>
              </div>

              {/* Center Illustration Box */}
              <div
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl border flex items-center justify-center my-2 shadow-inner ${
                  unlocked
                    ? 'bg-[#fef9c3] border-[#ca8a04]/40 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]'
                    : 'bg-[#1e1834] border-[#3f345e]'
                }`}
              >
                {unlocked ? (
                  getCardIcon(room.id)
                ) : (
                  <Lock className="w-8 h-8 text-slate-500" />
                )}
              </div>

              {/* Bottom Stars or Lock Badge */}
              <div className="w-full text-center">
                {unlocked ? (
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#fef08a] border border-[#d97706]/40 rounded-full">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span className="font-fredoka text-xs font-bold text-[#78350f]">
                      {starsEarned}/3
                    </span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#1b152e] border border-[#3e345c] rounded-full text-slate-400">
                    <Lock className="w-3 h-3 text-slate-500" />
                    <span className="font-fredoka text-xs font-bold text-slate-500">
                      0/3
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Dots below */}
      <div className="relative z-10 flex items-center justify-center gap-2 mt-4 pb-2">
        {Array.from({ length: totalPages }).map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              sound.playClick();
              setCurrentPage(idx);
            }}
            className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
              currentPage === idx
                ? 'bg-amber-400 scale-125 shadow-md shadow-amber-400/50'
                : 'bg-purple-900/80 hover:bg-purple-700'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
