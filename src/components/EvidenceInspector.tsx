import React, { useState } from 'react';
import { EvidenceItem } from '../types/game';
import { sound } from '../services/audio';
import { Eye, Sun, Moon, FileText, Search, PenLine, Sparkles, BookOpen } from 'lucide-react';

interface EvidenceInspectorProps {
  evidenceList: EvidenceItem[];
  objective: string;
}

export const EvidenceInspector: React.FC<EvidenceInspectorProps> = ({
  evidenceList,
  objective,
}) => {
  const [selectedId, setSelectedId] = useState<string>(evidenceList[0]?.id || '');
  const [isUvActive, setIsUvActive] = useState<boolean>(false);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>('');
  const [showNotes, setShowNotes] = useState<boolean>(false);

  const activeEvidence = evidenceList.find(e => e.id === selectedId) || evidenceList[0];

  const handleTabClick = (id: string) => {
    sound.playClick();
    setSelectedId(id);
  };

  const toggleUv = () => {
    sound.playClick();
    setIsUvActive(prev => !prev);
  };

  const toggleZoom = () => {
    sound.playClick();
    setIsZoomed(prev => !prev);
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-xl backdrop-blur-sm">
      {/* Inspector Header & Tools Toolbar */}
      <div className="p-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-950/60">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs uppercase font-semibold text-slate-300 tracking-wider">
            Alat Investigasi &amp; Berkas Bukti
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {/* UV Blacklight Toggle */}
          <button
            type="button"
            onClick={toggleUv}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              isUvActive
                ? 'bg-purple-900/80 text-purple-200 border border-purple-500 shadow-lg shadow-purple-900/40'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
            title="Gunakan senter sinar UV untuk mengungkap tinta rahasia fosfor"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isUvActive ? 'text-purple-300 animate-spin' : ''}`} />
            <span>Sinar UV {isUvActive ? 'ON' : 'OFF'}</span>
          </button>

          {/* Magnifying Glass Zoom */}
          <button
            type="button"
            onClick={toggleZoom}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              isZoomed
                ? 'bg-amber-900/80 text-amber-200 border border-amber-500'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
            title="Perbesar tampilan teks atau barang bukti"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Kaca Pembesar</span>
          </button>

          {/* Detective Scratchpad Toggle */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setShowNotes(prev => !prev);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              showNotes
                ? 'bg-amber-700 text-white border border-amber-500'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
            title="Buka buku catatan penyelidikan"
          >
            <PenLine className="w-3.5 h-3.5" />
            <span>Catatan</span>
          </button>
        </div>
      </div>

      {/* Room Objective Banner */}
      <div className="px-4 py-2 bg-amber-950/20 border-b border-amber-900/20 text-xs text-amber-300/90 flex items-center gap-2">
        <span className="font-semibold text-amber-400 shrink-0">Sasaran:</span>
        <span className="truncate">{objective}</span>
      </div>

      {/* Main Inspector Grid: Evidence Tabs on Left, Content on Right */}
      <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-800 min-h-[300px]">
        {/* Left Column: Evidence List */}
        <div className="md:col-span-4 p-3 space-y-2 bg-slate-950/40">
          <div className="text-[11px] font-medium text-slate-400 px-1 uppercase tracking-wider">
            Daftar Temuan ({evidenceList.length})
          </div>
          <div className="space-y-1.5">
            {evidenceList.map(item => {
              const isSelected = item.id === selectedId;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full text-left p-2.5 rounded-lg transition-all flex items-start gap-2.5 cursor-pointer ${
                    isSelected
                      ? 'bg-amber-950/40 border border-amber-500/50 text-amber-200 shadow-sm'
                      : 'bg-slate-900/40 hover:bg-slate-800/60 border border-slate-800/80 text-slate-300'
                  }`}
                >
                  <FileText className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                  <div className="min-w-0">
                    <div className="text-xs font-semibold truncate">{item.name}</div>
                    <div className="text-[11px] text-slate-400 truncate">{item.shortDesc}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Scratchpad Quick View if opened */}
          {showNotes && (
            <div className="mt-4 pt-3 border-t border-slate-800">
              <div className="text-[11px] font-medium text-amber-400 px-1 mb-1.5 flex items-center justify-between">
                <span>Catatan Investigasi Anda:</span>
                <span className="text-[10px] text-slate-500">Tersimpan otomatis</span>
              </div>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Tulis kalkulasi angka, petunjuk, atau hipotesis di sini..."
                rows={4}
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-lg p-2 text-xs text-amber-100 placeholder-slate-500 outline-none resize-none font-mono-code"
              />
            </div>
          )}
        </div>

        {/* Right Column: Detailed Clue Viewer */}
        <div className={`md:col-span-8 p-5 relative transition-all ${isUvActive ? 'bg-purple-950/30' : 'bg-slate-900/50'}`}>
          {activeEvidence ? (
            <div>
              {/* Evidence Title & Category */}
              <div className="flex items-center justify-between gap-3 mb-3 pb-2 border-b border-slate-800">
                <div>
                  <h4 className="font-cinzel text-base md:text-lg font-bold text-amber-200">
                    {activeEvidence.name}
                  </h4>
                  <p className="text-xs text-slate-400">{activeEvidence.shortDesc}</p>
                </div>
                {activeEvidence.uvContent && (
                  <span className="text-[11px] text-purple-400 border border-purple-500/40 bg-purple-950/40 px-2 py-0.5 rounded">
                    Reaktif UV
                  </span>
                )}
              </div>

              {/* Main Content Box with Optional UV Filter */}
              <div
                className={`rounded-lg p-4 transition-all leading-relaxed whitespace-pre-line border ${
                  isUvActive
                    ? 'bg-purple-950/40 border-purple-600/50 text-purple-200 shadow-inner'
                    : 'bg-slate-950/60 border-slate-800 text-slate-200'
                } ${isZoomed ? 'text-base md:text-lg' : 'text-sm'}`}
              >
                {activeEvidence.fullContent}

                {/* Secret UV Inscriptions */}
                {isUvActive && (
                  <div className="mt-4 pt-3 border-t border-purple-800/80 bg-purple-900/30 p-3 rounded text-purple-300 animate-pulse text-xs md:text-sm">
                    <div className="text-[10px] uppercase tracking-widest text-purple-400 font-bold mb-1 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Tulisan Tersembunyi (Sinar UV Terdeteksi)</span>
                    </div>
                    {activeEvidence.uvContent || 'Tidak ada bekas tinta fosfor pada benda ini.'}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center text-slate-500 py-12 text-sm">
              Pilih berkas bukti di sebelah kiri untuk memeriksa.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
