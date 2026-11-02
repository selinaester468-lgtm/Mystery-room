import React, { useEffect } from 'react';
import { RotateCcw, Home, Hourglass, Sparkles } from 'lucide-react';
import { sound } from '../../services/audio';
import { GAME_IMAGES } from '../../services/assets';

interface WaktuHabisModalProps {
  isOpen: boolean;
  onRetry: () => void;
  onReturnToTitle: () => void;
}

export const WaktuHabisModal: React.FC<WaktuHabisModalProps> = ({
  isOpen,
  onRetry,
  onReturnToTitle,
}) => {
  useEffect(() => {
    if (isOpen) {
      sound.playWrong();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in select-none">
      <div className="relative w-full max-w-sm sm:max-w-md pt-12 sm:pt-14">
        {/* Top Floating Elements matching screenshot: Hourglass on Left, "Waktu Habis!" in center, Crying Detective on Right */}
        <div className="absolute top-0 left-0 right-0 flex items-end justify-between px-3 z-20 pointer-events-none">
          {/* Hourglass on Left */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#a855f7] to-[#6b21a8] p-1.5 rounded-2xl border-2 border-[#d8b4fe] shadow-xl rotate-[-12deg] flex items-center justify-center mb-1">
            <Hourglass className="w-10 h-10 sm:w-12 sm:h-12 text-amber-300 animate-pulse fill-amber-200/50" />
          </div>

          {/* Center Badge: "Waktu Habis!" */}
          <div className="px-5 py-2 sm:px-6 sm:py-2.5 bg-gradient-to-b from-[#a855f7] via-[#9333ea] to-[#7e22ce] border-3 border-white rounded-2xl shadow-[0_6px_16px_rgba(0,0,0,0.6)] mb-2">
            <h2 className="font-fredoka text-xl sm:text-2xl font-black text-white tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] whitespace-nowrap">
              Waktu Habis!
            </h2>
          </div>

          {/* Crying Chibi Detective on Right */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 relative mb-0">
            {/* Stress sweat spiral */}
            <div className="absolute -top-1 -right-1 text-purple-300 font-bold text-xs animate-spin">
              🌀
            </div>
            <img
              src={GAME_IMAGES.chibiCrying}
              alt="Detective Crying"
              className="w-full h-full object-contain filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)]"
            />
          </div>
        </div>

        {/* Main Parchment Modal Body */}
        <div className="relative bg-gradient-to-b from-[#fef3c7] via-[#fde68a] to-[#fef08a] border-4 border-[#b45309] rounded-3xl p-5 sm:p-6 text-center shadow-[0_15px_35px_rgba(0,0,0,0.8)] pt-8">
          {/* Decorative Sparkles */}
          <div className="absolute top-4 left-4 text-[#d97706]/40">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="absolute top-4 right-4 text-[#d97706]/40">
            <Sparkles className="w-4 h-4" />
          </div>

          {/* Time Expired Notice Message matching screenshot text */}
          <div className="mb-5 px-2">
            <p className="font-fredoka text-sm sm:text-base font-bold text-[#78350f] leading-relaxed">
              Waktu untuk menyelesaikan
              <br />
              teka-teki sudah berakhir.
              <br />
              <span className="text-[#92400e]">
                Coba lagi dan pecahkan tantangannya!
              </span>
            </p>
          </div>

          {/* Action Buttons: [🔄 Coba Lagi] and [🏠 Menu Utama] */}
          <div className="flex gap-2.5 sm:gap-3">
            {/* Coba Lagi (Purple Cartoon Button) */}
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onRetry();
              }}
              className="btn-cartoon-purple flex-1 py-3 px-4 rounded-2xl text-white font-fredoka text-xs sm:text-sm font-bold tracking-wide flex items-center justify-center gap-1.5 transition-transform cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Coba Lagi</span>
            </button>

            {/* Menu Utama (Peach/Warm Gold Cartoon Button) */}
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onReturnToTitle();
              }}
              className="btn-cartoon-gold flex-1 py-3 px-4 rounded-2xl text-white font-fredoka text-xs sm:text-sm font-bold tracking-wide flex items-center justify-center gap-1.5 transition-transform cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>Menu Utama</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
