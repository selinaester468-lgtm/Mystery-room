import React, { useState } from 'react';
import { RoomLevel, PuzzleCategory, PlayerStats } from '../types/game';
import { sound } from '../services/audio';
import { GAME_IMAGES } from '../services/assets';
import { Lock, Play, Star, Sparkles, Clock, Trophy, ChevronRight } from 'lucide-react';

interface RoomSelectorProps {
  rooms: RoomLevel[];
  playerStats: PlayerStats;
  onSelectRoom: (room: RoomLevel) => void;
  onOpenGuide: () => void;
  onOpenLeaderboard: () => void;
}

export const RoomSelector: React.FC<RoomSelectorProps> = ({
  rooms,
  playerStats,
  onSelectRoom,
  onOpenGuide,
  onOpenLeaderboard,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredRooms = rooms.filter(room => {
    if (selectedCategory === 'all') return true;
    return room.category === selectedCategory;
  });

  const isRoomUnlocked = (roomId: number) => {
    // Room 1 is always unlocked; subsequent rooms unlocked if previous level completed
    if (roomId === 1) return true;
    return playerStats.levelsCompleted.includes(roomId - 1);
  };

  const handleRoomClick = (room: RoomLevel) => {
    if (!isRoomUnlocked(room.id)) {
      sound.playWrong();
      return;
    }
    sound.playClick();
    onSelectRoom(room);
  };

  // Find the next active room to resume
  const nextActiveRoom = rooms.find(r => !playerStats.levelsCompleted.includes(r.id) && isRoomUnlocked(r.id)) || rooms[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* Hero Showcase Banner with Real Generated Asset */}
      <div className="relative rounded-2xl overflow-hidden border border-amber-900/40 shadow-2xl bg-slate-950">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[340px]">
          {/* Left Text / Play CTA Section */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between z-10 bg-gradient-to-r from-slate-950 via-slate-950/95 to-slate-950/60">
            <div>
              <div className="flex items-center gap-2 text-xs text-amber-400 font-medium tracking-wider uppercase mb-2">
                <span>Ekspedisi Escape Room</span>
                <span aria-hidden="true">·</span>
                <span>8 Ruangan Misteri</span>
                <span aria-hidden="true">·</span>
                <span>Asah Otak &amp; Logika</span>
              </div>

              <h1 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-100 tracking-tight mb-4 [text-wrap:balance]">
                Pecahkan Teka-Teki. Temukan Kunci. Bebaskan Dirimu.
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed mb-6">
                Uji kemampuan berpikir kritis, ketelitian observasi, dan deduksi logismu melalui 5 kategori teka-teki: gambar, angka, kata-kata, simbol kuno, hingga pengusutan kasus kriminal.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => handleRoomClick(nextActiveRoom)}
                className="py-3 px-6 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 active:scale-[0.99] text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-amber-950/60 flex items-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>
                  {playerStats.levelsCompleted.length === 0
                    ? 'Mulai Ekspedisi (Level 1)'
                    : `Lanjutkan (${nextActiveRoom.roomName})`}
                </span>
              </button>

              <button
                type="button"
                onClick={onOpenGuide}
                className="py-3 px-5 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-xl text-sm font-medium transition-colors cursor-pointer"
              >
                Pelajari 5 Jenis Teka-Teki
              </button>
            </div>
          </div>

          {/* Right Thematic Image Showcase */}
          <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full overflow-hidden">
            <img
              src={GAME_IMAGES.cozyBg}
              alt="Ruang Studi Misteri Klasik"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center filter brightness-90 contrast-105"
            />
            {/* Measured Gradient Scrim (§1.F) */}
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-l from-transparent via-slate-950/40 to-slate-950" />

            {/* Inset Seal Badge */}
            <div className="absolute bottom-4 right-4 bg-slate-950/80 border border-amber-600/40 rounded-xl p-3 backdrop-blur-md flex items-center gap-3 shadow-xl">
              <img
                src={GAME_IMAGES.chibiHappy}
                alt="Segel Detektif"
                className="w-10 h-10 rounded-full border border-amber-500/60 object-cover"
              />
              <div className="text-left">
                <div className="text-[10px] uppercase font-mono-code text-amber-400">Status Penyelidik</div>
                <div className="text-xs font-bold text-slate-100">{playerStats.playerName}</div>
                <div className="text-[11px] text-slate-400 font-mono-code">{playerStats.totalScore.toLocaleString()} Pts</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Buttons (Functional Segmented Control §1.A) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-slate-100">
            Daftar Ruangan Terkunci
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Setiap ruangan memiliki teka-teki khas dan tingkat kesulitan bertingkat.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          {[
            { id: 'all', label: 'Semua (8)' },
            { id: 'gambar', label: 'Gambar' },
            { id: 'angka', label: 'Angka' },
            { id: 'kata', label: 'Kata-kata' },
            { id: 'simbol', label: 'Simbol' },
            { id: 'misteri', label: 'Misteri' },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                sound.playClick();
                setSelectedCategory(tab.id);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                selectedCategory === tab.id
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredRooms.map(room => {
          const unlocked = isRoomUnlocked(room.id);
          const completed = playerStats.levelsCompleted.includes(room.id);
          const starsEarned = playerStats.levelStars[room.id] || 0;
          const highScore = playerStats.levelHighScores[room.id] || 0;

          return (
            <div
              key={room.id}
              onClick={() => handleRoomClick(room)}
              className={`group rounded-xl border p-5 transition-all flex flex-col justify-between relative ${
                unlocked
                  ? completed
                    ? 'bg-slate-900/90 border-amber-800/50 hover:border-amber-500 shadow-md hover:shadow-amber-950/40 cursor-pointer'
                    : 'bg-slate-900/90 border-slate-700 hover:border-amber-500 shadow-md hover:shadow-amber-950/40 cursor-pointer'
                  : 'bg-slate-950/60 border-slate-900 opacity-60 cursor-not-allowed'
              }`}
            >
              <div>
                {/* Top Row: Unboxed clean metadata (§1.A) */}
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-medium">
                  <div className="flex items-center gap-1.5">
                    <span className="text-amber-400 uppercase font-bold">Level {room.id}</span>
                    <span aria-hidden="true">·</span>
                    <span className="capitalize">{room.category}</span>
                  </div>

                  {unlocked ? (
                    <span className="text-xs text-slate-400">{room.difficulty}</span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] text-slate-500">
                      <Lock className="w-3.5 h-3.5" /> Terkunci
                    </span>
                  )}
                </div>

                {/* Room Title */}
                <h3 className="font-cinzel text-base font-bold text-slate-100 group-hover:text-amber-300 transition-colors mb-2 line-clamp-1">
                  {room.roomName}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                  {room.prologue}
                </p>
              </div>

              {/* Card Bottom Meta */}
              <div className="pt-3 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-xs mb-3">
                  <div className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span className="font-mono-code">{room.timeLimit}s</span>
                  </div>

                  {/* Stars if completed */}
                  {completed ? (
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3].map(s => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= starsEarned ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                  ) : (
                    <span className="font-mono-code text-amber-500/80">+{room.basePoints} Pts</span>
                  )}
                </div>

                {/* Action CTA */}
                {unlocked ? (
                  <button
                    type="button"
                    className="w-full py-2 px-3 bg-slate-800 group-hover:bg-amber-600 group-hover:text-white text-slate-300 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>{completed ? 'Mainkan Ulang' : 'Masuk Ruangan'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <div className="text-center py-1.5 text-[11px] text-slate-600 font-medium">
                    Selesaikan Level {room.id - 1} untuk membuka
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
