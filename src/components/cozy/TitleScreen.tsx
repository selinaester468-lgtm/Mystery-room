import React from 'react';
import { Play, Grid, Trophy, Settings, Search, Sparkles, LogOut, Music, Music2 } from 'lucide-react';
import { sound } from '../../services/audio';

interface TitleScreenProps {
  onStartGame: () => void;
  onOpenLevelSelect: () => void;
  onOpenLeaderboard: () => void;
  onOpenSettings: () => void;
  onExitGame: () => void;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStartGame,
  onOpenLevelSelect,
  onOpenLeaderboard,
  onOpenSettings,
  onExitGame,
  isMusicPlaying,
  onToggleMusic,
}) => {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-3 sm:p-6 overflow-hidden select-none">
      {/* Cozy night mystery study background */}
      <img
        src="/src/assets/images/mystery_room_cozy_bg_1793627597939.jpg"
        alt="Mystery Room Background"
        className="absolute inset-0 w-full h-full object-cover filter brightness-[0.72] contrast-105 pointer-events-none"
      />
      {/* Atmospheric vignette scrim */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#130f24] via-transparent to-[#1a142e]/60 pointer-events-none" />

      {/* Floating Sparkles & Constellation Dust */}
      <div className="absolute top-8 left-8 text-amber-300/80 animate-pulse pointer-events-none">
        <Sparkles className="w-4 h-4" />
      </div>

      {/* Quick Music Toggle on Top Right */}
      <div className="absolute top-3 right-3 z-20">
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onToggleMusic();
          }}
          className={`px-2.5 py-1 rounded-full border text-[11px] font-fredoka font-bold flex items-center gap-1.5 shadow-lg transition-transform active:scale-95 cursor-pointer ${
            isMusicPlaying
              ? 'bg-purple-900/90 border-purple-400 text-amber-300 shadow-purple-900/50'
              : 'bg-[#251b3d]/90 border-[#584282] text-slate-300'
          }`}
          title={isMusicPlaying ? 'Matikan Musik' : 'Putar Lagu Cozy Mystery'}
        >
          {isMusicPlaying ? (
            <Music className="w-3 h-3 text-amber-400 animate-bounce" />
          ) : (
            <Music2 className="w-3 h-3 text-slate-400" />
          )}
          <span>{isMusicPlaying ? 'Musik: ON' : 'Musik: OFF'}</span>
        </button>
      </div>

      {/* Top Header / Title Section */}
      <div className="relative z-10 flex flex-col items-center mt-4 sm:mt-6 text-center">
        {/* Detective Cap & Magnifying Glass Title Lockup */}
        <div className="relative inline-block mb-1">
          {/* Magnifying Glass graphic on right */}
          <div className="absolute -top-2 -right-5 text-amber-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
            <Search className="w-6 h-6 sm:w-8 sm:h-8 text-amber-300 rotate-12" />
          </div>

          <h1 className="font-fredoka text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-wider text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] [text-shadow:_0_3px_0_#4a287a,_0_6px_12px_rgba(0,0,0,0.7)] leading-tight">
            MYSTERY
            <br />
            ROOM
          </h1>
        </div>

        {/* Subtitle Parchment Banner */}
        <div className="relative mt-1 px-4 py-1 sm:px-5 sm:py-1.5 bg-gradient-to-r from-[#fef3c7] via-[#fde68a] to-[#fef3c7] border-2 border-[#b45309] rounded-full shadow-[0_3px_8px_rgba(0,0,0,0.5)]">
          <p className="font-fredoka text-[11px] sm:text-xs font-semibold text-[#78350f] tracking-wide">
            Pecahkan Teka-Teki, Temukan Jawabannya!
          </p>
        </div>
      </div>

      {/* Center Character Peek */}
      <div className="relative z-10 my-auto py-1">
        <div className="w-20 h-20 sm:w-26 sm:h-26 rounded-full p-1 bg-gradient-to-b from-amber-400/40 to-purple-600/40 backdrop-blur-sm shadow-xl flex items-center justify-center">
          <img
            src="/src/assets/images/chibi_detective_happy_1793627597581.jpg"
            alt="Chibi Detective"
            className="w-full h-full rounded-full object-cover shadow-inner"
          />
        </div>
      </div>

      {/* Bottom Menu Buttons Matching Reference Screenshot + Keluar Game */}
      <div className="relative z-10 w-full max-w-[280px] sm:max-w-xs flex flex-col gap-2 mb-3 sm:mb-4">
        {/* 1. Mulai Game (Pink/Magenta Primary Button) */}
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onStartGame();
          }}
          className="btn-cartoon-pink w-full py-2.5 px-5 rounded-full text-white font-fredoka text-sm sm:text-base font-bold tracking-wide flex items-center justify-center gap-2 transition-transform cursor-pointer"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Mulai Game</span>
        </button>

        {/* 2. Pilih Level (Parchment Cream Button) */}
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onOpenLevelSelect();
          }}
          className="btn-cartoon-parchment w-full py-2 px-5 rounded-full font-fredoka text-xs sm:text-sm font-bold tracking-wide flex items-center justify-center gap-2 transition-transform cursor-pointer border border-[#d97706]/40"
        >
          <Grid className="w-3.5 h-3.5 text-[#78350f]" />
          <span>Pilih Level</span>
        </button>

        {/* 3. Peringkat (Parchment Cream Button) */}
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onOpenLeaderboard();
          }}
          className="btn-cartoon-parchment w-full py-2 px-5 rounded-full font-fredoka text-xs sm:text-sm font-bold tracking-wide flex items-center justify-center gap-2 transition-transform cursor-pointer border border-[#d97706]/40"
        >
          <Trophy className="w-3.5 h-3.5 text-[#78350f]" />
          <span>Peringkat</span>
        </button>

        {/* 4. Pengaturan (Parchment Cream Button) */}
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onOpenSettings();
          }}
          className="btn-cartoon-parchment w-full py-2 px-5 rounded-full font-fredoka text-xs sm:text-sm font-bold tracking-wide flex items-center justify-center gap-2 transition-transform cursor-pointer border border-[#d97706]/40"
        >
          <Settings className="w-3.5 h-3.5 text-[#78350f]" />
          <span>Pengaturan</span>
        </button>

        {/* 5. Keluar Game */}
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onExitGame();
          }}
          className="w-full py-1.5 px-5 rounded-full font-fredoka text-[11px] font-bold tracking-wide flex items-center justify-center gap-1.5 transition-all cursor-pointer bg-[#2c1d3d] hover:bg-[#3d2454] border border-[#6b3b82] text-rose-300 active:scale-95"
        >
          <LogOut className="w-3 h-3 text-rose-400" />
          <span>Keluar Game</span>
        </button>
      </div>
    </div>
  );
};
