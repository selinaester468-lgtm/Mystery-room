import React from 'react';
import { Lightbulb, X } from 'lucide-react';
import { sound } from '../../services/audio';

interface PetunjukModalProps {
  isOpen: boolean;
  onClose: () => void;
  hintText: string;
}

export const PetunjukModal: React.FC<PetunjukModalProps> = ({
  isOpen,
  onClose,
  hintText,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in select-none">
      {/* Parchment Dialogue Box Matching Screen 5 */}
      <div className="relative w-full max-w-sm bg-gradient-to-b from-[#fef3c7] via-[#fde68a] to-[#fef08a] border-4 border-[#b45309] rounded-3xl p-6 text-center shadow-[0_15px_35px_rgba(0,0,0,0.8)]">
        {/* Top Header with Lightbulb & Close Button */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-400 border-2 border-[#b45309] flex items-center justify-center shadow-sm">
              <Lightbulb className="w-5 h-5 text-amber-950 fill-amber-200" />
            </div>
            <h3 className="font-fredoka text-lg font-bold text-[#78350f]">
              Petunjuk
            </h3>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-[#fde68a] hover:bg-[#fcd34d] border border-[#b45309]/50 text-[#78350f] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Hint text content */}
        <div className="bg-[#fffbeb]/90 border-2 border-[#d97706]/40 rounded-2xl p-4 mb-5 shadow-inner">
          <p className="font-fredoka text-sm sm:text-base font-semibold text-[#5a2707] leading-relaxed">
            {hintText || 'Coba amati kembali petunjuk teka-teki dengan teliti.'}
          </p>
        </div>

        {/* "Oke" Purple Button Matching Screen 5 */}
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="btn-cartoon-purple w-full py-3 px-6 rounded-2xl text-white font-fredoka text-base font-bold tracking-wide transition-transform cursor-pointer"
        >
          Oke
        </button>
      </div>
    </div>
  );
};
