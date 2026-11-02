import React, { useState } from 'react';
import { Sparkles, RotateCcw, CheckCircle2 } from 'lucide-react';
import { sound } from '../../services/audio';

interface StarNode {
  id: number;
  x: number;
  y: number;
  label: string;
}

interface StarConstellationWidgetProps {
  instruction: string;
  question: string;
  detailPrompt: string;
  stars?: StarNode[];
  onSubmit: (sequence: string) => void;
  isSubmitting?: boolean;
}

const DEFAULT_STARS: StarNode[] = [
  { id: 1, x: 25, y: 75, label: '1. Rigel' },
  { id: 2, x: 75, y: 25, label: '2. Betelgeuse' },
  { id: 3, x: 30, y: 30, label: '3. Bellatrix' },
  { id: 4, x: 70, y: 80, label: '4. Saiph' },
  { id: 5, x: 50, y: 52, label: '5. Alnitak' },
];

export const StarConstellationWidget: React.FC<StarConstellationWidgetProps> = ({
  instruction,
  question,
  detailPrompt,
  stars = DEFAULT_STARS,
  onSubmit,
  isSubmitting = false,
}) => {
  const [connectedOrder, setConnectedOrder] = useState<number[]>([]);

  const handleStarClick = (starId: number) => {
    sound.playClick();
    if (!connectedOrder.includes(starId)) {
      setConnectedOrder(prev => [...prev, starId]);
    }
  };

  const handleReset = () => {
    sound.playClick();
    setConnectedOrder([]);
  };

  const handleSubmit = () => {
    sound.playClick();
    const code = connectedOrder.join('-');
    onSubmit(code);
  };

  // Build SVG path lines connecting stars in order
  const getPolylinePoints = () => {
    return connectedOrder
      .map(id => {
        const star = stars.find(s => s.id === id);
        return star ? `${star.x}%,${star.y}%` : '';
      })
      .filter(Boolean)
      .join(' ');
  };

  return (
    <div className="bg-slate-900/90 border border-amber-900/40 rounded-xl p-5 shadow-2xl backdrop-blur-md max-w-lg mx-auto">
      <div className="text-center mb-4">
        <h4 className="text-xs uppercase tracking-wider text-amber-500/90 font-medium mb-1">
          {instruction}
        </h4>
        <p className="text-sm text-slate-300 font-medium">{question}</p>
        <p className="text-xs text-slate-400 mt-1">{detailPrompt}</p>
      </div>

      {/* Star Constellation Interactive Celestial Canvas */}
      <div className="relative w-full h-72 md:h-80 bg-slate-950 rounded-xl border border-blue-900/40 overflow-hidden mb-4 shadow-inner">
        {/* Subtle celestial stars background dots */}
        <div className="absolute inset-0 opacity-40 pointer-events-none bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]" />

        {/* SVG Lines for connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          {connectedOrder.map((starId, idx) => {
            if (idx === 0) return null;
            const prevId = connectedOrder[idx - 1];
            const p1 = stars.find(s => s.id === prevId);
            const p2 = stars.find(s => s.id === starId);
            if (!p1 || !p2) return null;
            return (
              <line
                key={`${prevId}-${starId}`}
                x1={`${p1.x}%`}
                y1={`${p1.y}%`}
                x2={`${p2.x}%`}
                y2={`${p2.y}%`}
                stroke="#60a5fa"
                strokeWidth="2.5"
                strokeDasharray="4 2"
                className="animate-pulse"
              />
            );
          })}
        </svg>

        {/* Clickable Star Nodes */}
        {stars.map(star => {
          const isSelected = connectedOrder.includes(star.id);
          const orderIdx = connectedOrder.indexOf(star.id);

          return (
            <div
              key={star.id}
              onClick={() => handleStarClick(star.id)}
              style={{ left: `${star.x}%`, top: `${star.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 font-bold ring-4 ring-amber-400/40 scale-110 shadow-lg shadow-amber-400/50'
                    : 'bg-slate-800 text-slate-200 border-2 border-blue-400 group-hover:scale-110 group-hover:bg-blue-950 group-hover:border-amber-400'
                }`}
              >
                {isSelected ? (
                  <span className="text-xs font-bold font-mono-code">{orderIdx + 1}</span>
                ) : (
                  <Sparkles className="w-4 h-4 text-blue-300 group-hover:text-amber-300" />
                )}
              </div>
              <span className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-medium text-slate-300 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-700/80 pointer-events-none">
                {star.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress sequence readout */}
      <div className="flex items-center justify-between text-xs text-slate-400 mb-4 px-1">
        <span>Urutan Terpilih:</span>
        <span className="font-mono-code text-amber-300 font-bold tracking-wider">
          {connectedOrder.length > 0 ? connectedOrder.join(' → ') : 'Belum ada bintang'}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-3">
        <button
          type="button"
          onClick={handleReset}
          className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Pola</span>
        </button>
        <button
          type="button"
          disabled={isSubmitting || connectedOrder.length < stars.length}
          onClick={handleSubmit}
          className="col-span-2 py-2.5 px-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 active:scale-[0.99] disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Buka Kunci Prisma Rasi</span>
        </button>
      </div>
    </div>
  );
};
