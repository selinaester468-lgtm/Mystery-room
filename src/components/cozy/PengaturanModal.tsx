import React, { useState } from 'react';
import { Settings, Volume2, VolumeX, Music, Music2, RotateCcw, X, User } from 'lucide-react';
import { sound } from '../../services/audio';

interface PengaturanModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAudioMuted: boolean;
  onToggleMute: () => void;
  isAmbientActive: boolean;
  onToggleAmbient: () => void;
  playerName: string;
  onUpdatePlayerName: (name: string) => void;
  onResetProgress: () => void;
}

export const PengaturanModal: React.FC<PengaturanModalProps> = ({
  isOpen,
  onClose,
  isAudioMuted,
  onToggleMute,
  isAmbientActive,
  onToggleAmbient,
  playerName,
  onUpdatePlayerName,
  onResetProgress,
}) => {
  const [nameInput, setNameInput] = useState<string>(playerName);
  const [showConfirmReset, setShowConfirmReset] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleNameSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    sound.playClick();
    onUpdatePlayerName(nameInput.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in select-none">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-[#2a1e47] to-[#1c1333] border-4 border-[#5a4282] rounded-3xl p-5 sm:p-6 text-center shadow-[0_15px_35px_rgba(0,0,0,0.8)]">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#fde68a] border-2 border-[#b45309] flex items-center justify-center shadow-sm">
              <Settings className="w-5 h-5 text-[#78350f]" />
            </div>
            <h3 className="font-fredoka text-lg font-bold text-amber-200">
              Pengaturan
            </h3>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-[#2d224d] hover:bg-[#3d2f66] text-amber-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Settings Items */}
        <div className="space-y-3 mb-5 text-left font-fredoka">
          {/* Player Name Form */}
          <form onSubmit={handleNameSave} className="bg-[#21173d] p-3 rounded-2xl border border-[#4a3a6b]">
            <label className="text-xs font-semibold text-purple-200 block mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span>Nama Pemain:</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                maxLength={20}
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                className="flex-1 px-3 py-1.5 bg-[#170f2b] border border-[#584282] rounded-xl text-xs text-amber-200 outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Simpan
              </button>
            </div>
          </form>

          {/* Sound FX Toggle */}
          <div className="flex items-center justify-between p-3 bg-[#21173d] rounded-2xl border border-[#4a3a6b]">
            <div className="flex items-center gap-2.5">
              {isAudioMuted ? (
                <VolumeX className="w-5 h-5 text-slate-400" />
              ) : (
                <Volume2 className="w-5 h-5 text-amber-400" />
              )}
              <span className="text-sm font-semibold text-purple-100">Efek Suara (SFX)</span>
            </div>
            <button
              type="button"
              onClick={onToggleMute}
              className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer ${
                !isAudioMuted ? 'bg-amber-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-1 ${
                  !isAudioMuted ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Music Toggle */}
          <div className="flex items-center justify-between p-3 bg-[#21173d] rounded-2xl border border-[#4a3a6b]">
            <div className="flex items-center gap-2.5">
              {isAmbientActive ? (
                <Music className="w-5 h-5 text-amber-400 animate-pulse" />
              ) : (
                <Music2 className="w-5 h-5 text-slate-400" />
              )}
              <span className="text-sm font-semibold text-purple-100">Musik Latar Noir</span>
            </div>
            <button
              type="button"
              onClick={onToggleAmbient}
              className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer ${
                isAmbientActive ? 'bg-amber-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-1 ${
                  isAmbientActive ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Reset Progress */}
          <div className="p-3 bg-[#21173d] rounded-2xl border border-[#4a3a6b]">
            {showConfirmReset ? (
              <div className="text-center space-y-2">
                <p className="text-xs text-red-300">
                  Hapus seluruh skor dan bintang yang telah diraih?
                </p>
                <div className="flex gap-2 justify-center">
                  <button
                    type="button"
                    onClick={() => setShowConfirmReset(false)}
                    className="px-3 py-1 bg-slate-700 text-slate-200 rounded-lg text-xs"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onResetProgress();
                      setShowConfirmReset(false);
                      onClose();
                    }}
                    className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-bold"
                  >
                    Ya, Reset
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowConfirmReset(true)}
                className="w-full text-xs text-purple-300 hover:text-red-300 flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Atur Ulang Progres Permainan</span>
              </button>
            )}
          </div>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="btn-cartoon-parchment w-full py-2.5 px-6 rounded-2xl font-fredoka text-sm font-bold tracking-wide transition-transform cursor-pointer border border-[#d97706]/40"
        >
          Tutup
        </button>
      </div>
    </div>
  );
};
