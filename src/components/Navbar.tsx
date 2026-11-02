import React from 'react';
import { Volume2, VolumeX, Music, Music2 } from 'lucide-react';
import { sound } from '../services/audio';

interface NavbarProps {
  onNavClick: (tab: 'rooms' | 'guide' | 'leaderboard' | 'profile') => void;
  activeTab: 'rooms' | 'guide' | 'leaderboard' | 'profile' | 'playing';
  isAudioMuted: boolean;
  onToggleMute: () => void;
  isAmbientActive: boolean;
  onToggleAmbient: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavClick,
  activeTab,
  isAudioMuted,
  onToggleMute,
  isAmbientActive,
  onToggleAmbient,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#090d16]/90 backdrop-blur-md border-b border-amber-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element in display face) */}
        <button
          type="button"
          onClick={() => onNavClick('rooms')}
          className="font-cinzel text-lg sm:text-xl font-bold tracking-wider text-amber-200 hover:text-amber-100 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer"
        >
          <span>Mystery Room</span>
        </button>

        {/* Zone 2: 4 Clean Single-Line Text Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-wider font-medium text-slate-300">
          <button
            type="button"
            onClick={() => onNavClick('rooms')}
            className={`whitespace-nowrap shrink-0 hover:text-amber-400 transition-colors cursor-pointer ${
              activeTab === 'rooms' || activeTab === 'playing' ? 'text-amber-300 font-semibold' : ''
            }`}
          >
            Pilihan Ruangan
          </button>
          <button
            type="button"
            onClick={() => onNavClick('guide')}
            className={`whitespace-nowrap shrink-0 hover:text-amber-400 transition-colors cursor-pointer ${
              activeTab === 'guide' ? 'text-amber-300 font-semibold' : ''
            }`}
          >
            Cara Bermain
          </button>
          <button
            type="button"
            onClick={() => onNavClick('leaderboard')}
            className={`whitespace-nowrap shrink-0 hover:text-amber-400 transition-colors cursor-pointer ${
              activeTab === 'leaderboard' ? 'text-amber-300 font-semibold' : ''
            }`}
          >
            Papan Peringkat
          </button>
          <button
            type="button"
            onClick={() => onNavClick('profile')}
            className={`whitespace-nowrap shrink-0 hover:text-amber-400 transition-colors cursor-pointer ${
              activeTab === 'profile' ? 'text-amber-300 font-semibold' : ''
            }`}
          >
            Profil Detektif
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action (Audio Ambience / Sound Toggle) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick Sound Mute Toggle */}
          <button
            type="button"
            onClick={onToggleMute}
            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
              isAudioMuted
                ? 'bg-slate-800 text-slate-500 border-slate-700'
                : 'bg-amber-950/40 text-amber-300 border-amber-600/40 hover:bg-amber-900/40'
            }`}
            title={isAudioMuted ? 'Nyalakan Efek Suara' : 'Bisukan Efek Suara'}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Atmospheric Noir Drone Music Toggle */}
          <button
            type="button"
            onClick={onToggleAmbient}
            className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
              isAmbientActive
                ? 'bg-amber-600 text-white border-amber-500 shadow-md shadow-amber-900/30'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
            title="Nyalakan / Matikan Musik Suasana Noir Ruangan"
          >
            {isAmbientActive ? <Music className="w-3.5 h-3.5 animate-pulse" /> : <Music2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Suasana {isAmbientActive ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
