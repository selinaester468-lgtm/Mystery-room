import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Star, Sparkles, ArrowRight, Download, Check } from 'lucide-react';
import { sound } from '../../services/audio';
import { GAME_IMAGES, downloadGameImage } from '../../services/assets';

interface BenarModalProps {
  isOpen: boolean;
  onNextLevel: () => void;
  starsEarned?: number;
  questionNumber?: number;
  totalQuestions?: number;
  explanation?: string;
  isLastQuestionInLevel?: boolean;
}

export const BenarModal: React.FC<BenarModalProps> = ({
  isOpen,
  onNextLevel,
  starsEarned = 3,
  questionNumber = 1,
  totalQuestions = 50,
  explanation = '',
  isLastQuestionInLevel = false,
}) => {
  useEffect(() => {
    if (isOpen) {
      sound.playSuccess();
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.5 },
          colors: ['#fbbf24', '#f59e0b', '#f472b6', '#a855f7', '#ffffff'],
        });
      } catch {
        // Safe fallback
      }
    }
  }, [isOpen]);

  const [isSaved, setIsSaved] = useState<boolean>(false);

  const handleSaveImage = () => {
    sound.playClick();
    downloadGameImage(GAME_IMAGES.chibiHappy, `chibi-detective-soal-${questionNumber}.jpg`);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in select-none">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-[#2a1e47] via-[#22183b] to-[#1a1230] border-4 border-[#eab308] rounded-3xl p-5 text-center shadow-[0_15px_35px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Golden sparkle rays backdrop */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-32 bg-amber-400/20 blur-2xl pointer-events-none" />

        {/* Top Floating Golden Star */}
        <div className="relative -mt-2 mb-1 flex justify-center">
          <div className="relative animate-bounce">
            <Star className="w-14 h-14 fill-amber-400 text-amber-500 drop-shadow-[0_4px_12px_rgba(245,158,11,0.8)]" />
            <Sparkles className="w-5 h-5 text-white absolute top-0.5 right-0.5 animate-spin" />
          </div>
        </div>

        {/* Big Playful "Benar!" Banner Matching Screen 4 */}
        <div className="mb-2">
          <h2 className="font-fredoka text-3xl sm:text-4xl font-black text-amber-300 drop-shadow-[0_4px_0_#b45309] tracking-wider">
            Benar!
          </h2>
          <div className="inline-block px-3 py-0.5 mt-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-fredoka text-xs font-bold">
            Soal {questionNumber} dari {totalQuestions} Selesai ✨
          </div>
        </div>

        {/* Happy Chibi Detective Character Sticker */}
        <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto mb-1 flex items-center justify-center relative group">
          <img
            src={GAME_IMAGES.chibiHappy}
            alt="Chibi Detective Celebrating"
            className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)] cursor-pointer"
            onClick={handleSaveImage}
            title="Klik untuk Simpan Gambar Stiker"
          />
        </div>

        {/* Small Save Sticker Button */}
        <div className="flex justify-center mb-2">
          <button
            type="button"
            onClick={handleSaveImage}
            className="px-2.5 py-1 rounded-full bg-[#1b1233]/70 hover:bg-[#2b1f4a] border border-amber-500/40 text-[10px] font-fredoka font-semibold text-amber-300 flex items-center gap-1 active:scale-95 transition-transform cursor-pointer"
            title="Simpan gambar stiker detektif ke galeri/perangkat"
          >
            {isSaved ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-300">Tersimpan!</span>
              </>
            ) : (
              <>
                <Download className="w-3 h-3" />
                <span>Simpan Gambar</span>
              </>
            )}
          </button>
        </div>

        {/* Explanation box */}
        {explanation && (
          <div className="bg-[#1b1233]/80 border border-amber-500/30 rounded-xl p-2.5 mb-3 text-left shadow-inner">
            <p className="font-fredoka text-[11px] sm:text-xs text-amber-200/90 leading-relaxed text-center">
              💡 {explanation}
            </p>
          </div>
        )}

        {/* Golden Button: "Lanjut ke Soal Berikutnya" or "Level Selesai!" */}
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onNextLevel();
          }}
          className="btn-cartoon-gold w-full py-3 px-5 rounded-full text-white font-fredoka text-base sm:text-lg font-bold tracking-wide flex items-center justify-center gap-2 cursor-pointer transition-transform"
        >
          <span>
            {isLastQuestionInLevel
              ? 'Selesai Level Ini!'
              : `Soal Berikutnya (${questionNumber + 1}/${totalQuestions})`}
          </span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
