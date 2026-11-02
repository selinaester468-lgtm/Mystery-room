import React from 'react';
import { LogOut, X, ShieldCheck } from 'lucide-react';
import { sound } from '../../services/audio';

interface ExitConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmExit: () => void;
}

export const ExitConfirmModal: React.FC<ExitConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirmExit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in select-none">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-[#2a1e47] via-[#21173d] to-[#1a1230] border-4 border-[#b45309] rounded-3xl p-6 text-center shadow-[0_15px_35px_rgba(0,0,0,0.8)]">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#342654] hover:bg-[#43326b] text-amber-300 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Exit Icon */}
        <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-b from-red-500 to-amber-700 p-0.5 shadow-lg flex items-center justify-center">
          <div className="w-full h-full bg-[#1e1533] rounded-[14px] flex items-center justify-center text-red-400">
            <LogOut className="w-7 h-7" />
          </div>
        </div>

        {/* Title */}
        <h3 className="font-fredoka text-xl font-bold text-amber-200 mb-2">
          Keluar dari Game?
        </h3>

        {/* Message */}
        <div className="bg-[#19102c]/80 border border-[#4a396e] rounded-2xl p-3.5 mb-5 text-left text-xs font-fredoka text-purple-200 space-y-1.5">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Progres Tersimpan Aman</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            Semua skor, level yang telah terbuka, dan bintang penyelidikanmu sudah tersimpan rapi di buku catatan detektif.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-fredoka text-sm font-bold rounded-2xl transition-colors cursor-pointer"
          >
            Lanjut Main
          </button>
          <button
            type="button"
            onClick={() => {
              sound.playDoorClose();
              onConfirmExit();
            }}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 active:scale-95 text-white font-fredoka text-sm font-bold rounded-2xl shadow-lg transition-transform cursor-pointer"
          >
            Ya, Keluar
          </button>
        </div>
      </div>
    </div>
  );
};
