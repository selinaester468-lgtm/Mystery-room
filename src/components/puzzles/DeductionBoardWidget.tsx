import React, { useState } from 'react';
import { ShieldAlert, UserCheck, AlertTriangle, Scale } from 'lucide-react';
import { Suspect } from '../../types/game';
import { sound } from '../../services/audio';

interface DeductionBoardWidgetProps {
  instruction: string;
  question: string;
  detailPrompt: string;
  suspects?: Suspect[];
  onSubmit: (suspectName: string) => void;
  isSubmitting?: boolean;
}

export const DeductionBoardWidget: React.FC<DeductionBoardWidgetProps> = ({
  instruction,
  question,
  detailPrompt,
  suspects = [],
  onSubmit,
  isSubmitting = false,
}) => {
  const [selectedSuspectId, setSelectedSuspectId] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    sound.playClick();
    setSelectedSuspectId(id);
  };

  const handleSubmit = () => {
    if (!selectedSuspectId) return;
    sound.playClick();
    const suspect = suspects.find(s => s.id === selectedSuspectId);
    if (suspect) {
      onSubmit(suspect.name);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-amber-900/40 rounded-xl p-5 shadow-2xl backdrop-blur-md max-w-2xl mx-auto">
      <div className="text-center mb-5">
        <h4 className="text-xs uppercase tracking-wider text-amber-500/90 font-medium mb-1">
          {instruction}
        </h4>
        <p className="text-sm text-slate-300 font-medium">{question}</p>
        <p className="text-xs text-slate-400 mt-1">{detailPrompt}</p>
      </div>

      {/* Suspects Dossier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
        {suspects.map(suspect => {
          const isSelected = selectedSuspectId === suspect.id;

          return (
            <div
              key={suspect.id}
              onClick={() => handleSelect(suspect.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer text-left relative flex flex-col justify-between ${
                isSelected
                  ? 'border-amber-500 bg-amber-950/30 ring-2 ring-amber-500/40 shadow-lg'
                  : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900/80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h5 className="font-semibold text-slate-200 text-sm">{suspect.name}</h5>
                    <span className="text-[11px] text-amber-400/80 font-medium">{suspect.role}</span>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                      isSelected
                        ? 'border-amber-400 bg-amber-500 text-slate-950'
                        : 'border-slate-700 text-transparent'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <p className="text-slate-300 italic bg-slate-900/80 p-2 rounded border border-slate-800">
                    "{suspect.statement}"
                  </p>
                  <p className="text-slate-400">
                    <strong className="text-slate-300">Catatan Alibi:</strong> {suspect.alibi}
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-amber-300/80 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                <span className="truncate">{suspect.clueSuspicious}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Indictment Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="text-xs text-slate-400">
          Tersangka Dipilih:{' '}
          <span className="text-amber-300 font-semibold">
            {suspects.find(s => s.id === selectedSuspectId)?.name || 'Belum dipilih'}
          </span>
        </div>

        <button
          type="button"
          disabled={isSubmitting || !selectedSuspectId}
          onClick={handleSubmit}
          className="w-full sm:w-auto py-3 px-6 bg-gradient-to-r from-red-700 to-amber-700 hover:from-red-600 hover:to-amber-600 active:scale-[0.99] disabled:opacity-50 text-white rounded-lg text-sm font-semibold transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
        >
          <Scale className="w-4 h-4" />
          <span>Tetapkan Terdakwa &amp; Buka Pintu</span>
        </button>
      </div>
    </div>
  );
};
