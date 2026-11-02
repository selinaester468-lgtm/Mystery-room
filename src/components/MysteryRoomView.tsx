import React, { useState, useEffect, useRef } from 'react';
import { RoomLevel, PlayerStats } from '../types/game';
import { sound } from '../services/audio';
import { EvidenceInspector } from './EvidenceInspector';
import { KeypadWidget } from './puzzles/KeypadWidget';
import { SafeDialWidget } from './puzzles/SafeDialWidget';
import { WordLockWidget } from './puzzles/WordLockWidget';
import { SymbolDecoderWidget } from './puzzles/SymbolDecoderWidget';
import { StarConstellationWidget } from './puzzles/StarConstellationWidget';
import { DeductionBoardWidget } from './puzzles/DeductionBoardWidget';
import { HintModal } from './HintModal';
import { VictoryModal } from './VictoryModal';
import {
  ArrowLeft,
  Clock,
  HelpCircle,
  AlertTriangle,
  Sparkles,
  Trophy,
  Flame,
  Pause,
  Play,
  RotateCcw,
} from 'lucide-react';

interface MysteryRoomViewProps {
  room: RoomLevel;
  playerStats: PlayerStats;
  onRoomCompleted: (
    roomId: number,
    totalPoints: number,
    stars: number,
    timeSpent: number
  ) => void;
  onBackToMap: () => void;
  onNextLevel: () => void;
  hasNextLevel: boolean;
}

export const MysteryRoomView: React.FC<MysteryRoomViewProps> = ({
  room,
  playerStats,
  onRoomCompleted,
  onBackToMap,
  onNextLevel,
  hasNextLevel,
}) => {
  // Timer State
  const [timeLeft, setTimeLeft] = useState<number>(room.timeLimit);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isUntimed, setIsUntimed] = useState<boolean>(false);

  // Hints State
  const [isHintModalOpen, setIsHintModalOpen] = useState<boolean>(false);
  const [unlockedHintTiers, setUnlockedHintTiers] = useState<number[]>([]);
  const [totalHintPenalty, setTotalHintPenalty] = useState<number>(0);

  // Feedback & Attempts State
  const [feedbackMessage, setFeedbackMessage] = useState<{
    type: 'error' | 'info';
    text: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isVictoryModalOpen, setIsVictoryModalOpen] = useState<boolean>(false);

  // Calculated Victory Breakdown
  const [victoryBreakdown, setVictoryBreakdown] = useState({
    basePoints: room.basePoints,
    timeBonus: 0,
    hintPenalty: 0,
    streakBonus: 0,
    totalEarned: 0,
  });
  const [earnedStars, setEarnedStars] = useState<number>(3);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset or initialize state whenever room changes
  useEffect(() => {
    setTimeLeft(room.timeLimit);
    setIsPaused(false);
    setUnlockedHintTiers([]);
    setTotalHintPenalty(0);
    setFeedbackMessage(null);
    setIsVictoryModalOpen(false);
  }, [room.id]);

  // Main Escape Room Countdown Timer
  useEffect(() => {
    if (isPaused || isUntimed || isVictoryModalOpen) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          // Time expired alert, but don't hard crash: give gentle grace time so player can still solve!
          sound.playWrong();
          setFeedbackMessage({
            type: 'error',
            text: 'Waktu normal habis! Mode penyelidikan darurat aktif (bonus waktu menjadi 0).',
          });
          return 0;
        }
        if (prev <= 10) {
          sound.playTimerTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, isUntimed, isVictoryModalOpen]);

  // Handle Hint Unlock
  const handleUnlockHint = (tier: number, cost: number) => {
    if (!unlockedHintTiers.includes(tier)) {
      setUnlockedHintTiers(prev => [...prev, tier]);
      setTotalHintPenalty(prev => prev + cost);
    }
  };

  // Check Answer Handler
  const handleCheckAnswer = (answerGuess: string) => {
    setIsSubmitting(true);
    setFeedbackMessage(null);

    const cleanGuess = answerGuess.trim().toUpperCase();
    const isCorrect = room.puzzle.acceptedAnswers.some(
      ans => ans.trim().toUpperCase() === cleanGuess
    );

    if (isCorrect) {
      // Calculate Score & Stars
      // Time bonus: 5 points per remaining second
      const timeBonus = Math.max(0, timeLeft * 4);
      const streakMultiplier = playerStats.correctStreak > 0 ? playerStats.correctStreak * 100 : 0;
      const totalPoints = Math.max(
        100,
        room.basePoints + timeBonus - totalHintPenalty + streakMultiplier
      );

      // Star calculation:
      // 3 stars: no hints used & solved with > 40% time remaining
      // 2 stars: at most 1 hint used or solved in time
      // 1 star: solved
      let stars = 1;
      if (unlockedHintTiers.length === 0 && timeLeft > room.timeLimit * 0.35) {
        stars = 3;
      } else if (unlockedHintTiers.length <= 1) {
        stars = 2;
      }

      setEarnedStars(stars);
      setVictoryBreakdown({
        basePoints: room.basePoints,
        timeBonus,
        hintPenalty: totalHintPenalty,
        streakBonus: streakMultiplier,
        totalEarned: totalPoints,
      });

      setIsVictoryModalOpen(true);
      const timeSpent = room.timeLimit - timeLeft;
      onRoomCompleted(room.id, totalPoints, stars, timeSpent);
    } else {
      sound.playWrong();
      // Time penalty: -10 seconds
      setTimeLeft(prev => Math.max(0, prev - 10));
      setFeedbackMessage({
        type: 'error',
        text: 'Jawaban salah atau kombinasi belum tepat! Penalti -10 detik. Periksa kembali bukti di sebelah kiri.',
      });
    }

    setIsSubmitting(false);
  };

  // Replay room
  const handleReplay = () => {
    setTimeLeft(room.timeLimit);
    setUnlockedHintTiers([]);
    setTotalHintPenalty(0);
    setFeedbackMessage(null);
    setIsVictoryModalOpen(false);
  };

  // Calculate live current score
  const currentCalculatedScore = Math.max(
    100,
    room.basePoints + Math.max(0, timeLeft * 4) - totalHintPenalty
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6">
      {/* Top HUD Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-4 backdrop-blur-md shadow-lg">
        {/* Left: Back & Room Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToMap}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Kembali ke Peta Ruangan"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              <span className="text-amber-400 font-bold uppercase">Level {room.id}</span>
              <span>·</span>
              <span>{room.category}</span>
              <span>·</span>
              <span>{room.difficulty}</span>
            </div>
            <h2 className="font-cinzel text-base sm:text-lg font-bold text-slate-100">
              {room.roomName}
            </h2>
          </div>
        </div>

        {/* Center / Right: Timer & Score Meters */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Timer */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono-code transition-colors ${
              timeLeft <= 30 && !isUntimed
                ? 'bg-red-950/40 border-red-500/60 text-red-300 animate-pulse'
                : 'bg-slate-950/70 border-slate-700 text-slate-200'
            }`}
          >
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-sm sm:text-base tabular-nums">
              {isUntimed ? '∞ Santai' : `${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, '0')}`}
            </span>
            <button
              type="button"
              onClick={() => setIsPaused(prev => !prev)}
              className="text-slate-400 hover:text-slate-200 p-0.5 cursor-pointer"
              title={isPaused ? 'Lanjutkan Waktu' : 'Jeda Waktu'}
            >
              {isPaused ? <Play className="w-3.5 h-3.5 text-amber-400" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Current Live Potential Score */}
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Potensi Skor</span>
            <span className="font-mono-code text-sm font-bold text-amber-300">
              {currentCalculatedScore} Pts
            </span>
          </div>

          {/* Streak Indicator if active */}
          {playerStats.correctStreak > 0 && (
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-amber-950/30 border border-amber-600/30 rounded-lg text-xs text-amber-300">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Streak {playerStats.correctStreak}x</span>
            </div>
          )}

          {/* Hint Trigger Button */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setIsHintModalOpen(true);
            }}
            className="py-1.5 px-3 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-600/40 text-amber-300 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>Petunjuk ({unlockedHintTiers.length}/3)</span>
          </button>
        </div>
      </div>

      {/* Atmospheric Prologue Card */}
      <div className="bg-slate-950/80 border border-amber-900/30 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-mono-code text-amber-400 uppercase tracking-wider mb-1">
            Situasi Ruangan &amp; Misi
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
            {room.prologue}
          </p>
        </div>
        <div className="text-xs text-slate-400 font-medium shrink-0 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
          Target: {room.objective}
        </div>
      </div>

      {/* Error / Feedback Message Banner */}
      {feedbackMessage && (
        <div
          className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs font-medium animate-fade-in ${
            feedbackMessage.type === 'error'
              ? 'bg-red-950/40 border-red-500/50 text-red-200'
              : 'bg-amber-950/40 border-amber-500/50 text-amber-200'
          }`}
        >
          <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{feedbackMessage.text}</span>
        </div>
      )}

      {/* Interactive Main Area: Evidence & Clues on Left, Puzzle Interaction on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left / Top: Evidence Clue Inspector */}
        <div className="lg:col-span-7">
          <EvidenceInspector
            evidenceList={room.evidence}
            objective={room.objective}
          />
        </div>

        {/* Right / Bottom: Specific Dedicated Puzzle Mini-Game */}
        <div className="lg:col-span-5">
          {room.puzzle.type === 'keypad' && (
            <KeypadWidget
              instruction={room.puzzle.instruction}
              question={room.puzzle.question}
              detailPrompt={room.puzzle.detailPrompt}
              onSubmit={handleCheckAnswer}
              isSubmitting={isSubmitting}
            />
          )}

          {room.puzzle.type === 'safe_dial' && (
            <SafeDialWidget
              instruction={room.puzzle.instruction}
              question={room.puzzle.question}
              detailPrompt={room.puzzle.detailPrompt}
              onSubmit={handleCheckAnswer}
              isSubmitting={isSubmitting}
            />
          )}

          {room.puzzle.type === 'word_lock' && (
            <WordLockWidget
              instruction={room.puzzle.instruction}
              question={room.puzzle.question}
              detailPrompt={room.puzzle.detailPrompt}
              slotsCount={room.puzzle.options?.length || 4}
              onSubmit={handleCheckAnswer}
              isSubmitting={isSubmitting}
            />
          )}

          {room.puzzle.type === 'symbol_decoder' && (
            <SymbolDecoderWidget
              instruction={room.puzzle.instruction}
              question={room.puzzle.question}
              detailPrompt={room.puzzle.detailPrompt}
              symbols={room.puzzle.symbols}
              onSubmit={handleCheckAnswer}
              isSubmitting={isSubmitting}
            />
          )}

          {room.puzzle.type === 'star_constellation' && (
            <StarConstellationWidget
              instruction={room.puzzle.instruction}
              question={room.puzzle.question}
              detailPrompt={room.puzzle.detailPrompt}
              stars={room.puzzle.constellationStars}
              onSubmit={handleCheckAnswer}
              isSubmitting={isSubmitting}
            />
          )}

          {room.puzzle.type === 'deduction_board' && (
            <DeductionBoardWidget
              instruction={room.puzzle.instruction}
              question={room.puzzle.question}
              detailPrompt={room.puzzle.detailPrompt}
              suspects={room.puzzle.suspects}
              onSubmit={handleCheckAnswer}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
      </div>

      {/* Hint Modal */}
      <HintModal
        isOpen={isHintModalOpen}
        onClose={() => setIsHintModalOpen(false)}
        hints={room.hints}
        unlockedHintTiers={unlockedHintTiers}
        onUnlockHint={handleUnlockHint}
        currentRoomScore={currentCalculatedScore}
      />

      {/* Victory Escape Modal */}
      <VictoryModal
        isOpen={isVictoryModalOpen}
        roomTitle={room.title}
        roomName={room.roomName}
        explanation={room.puzzle.explanation}
        scoreBreakdown={victoryBreakdown}
        stars={earnedStars}
        hasNextLevel={hasNextLevel}
        onNextLevel={onNextLevel}
        onReplay={handleReplay}
        onBackToMap={onBackToMap}
      />
    </div>
  );
};
