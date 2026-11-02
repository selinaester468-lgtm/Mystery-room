import React, { useState, useEffect, useRef } from 'react';
import { RoomLevel, PlayerStats } from '../../types/game';
import { RiddleQuestion } from '../../data/questions/types';
import { sound } from '../../services/audio';
import {
  ArrowLeft,
  Pause,
  Play,
  Clock,
  Star,
  Lightbulb,
  AlertCircle,
  Home,
  LogOut,
  Music,
  Music2,
  Grid,
  ChevronLeft,
  ChevronRight,
  ListOrdered,
  CheckCircle2,
  X,
} from 'lucide-react';
import { WaktuHabisModal } from './WaktuHabisModal';

interface GamePlayScreenProps {
  room: RoomLevel;
  playerStats: PlayerStats;
  questionIndex?: number;
  totalQuestions?: number;
  onSelectQuestionIndex?: (idx: number) => void;
  onAnswerCorrect: (timeSpent: number) => void;
  onOpenHint: () => void;
  onPauseToggle: () => void;
  isPaused: boolean;
  hintsLeft: number;
  onReturnToLevelSelect: () => void;
  onReturnToTitle: () => void;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
  onTimeUp?: () => void;
}

export const GamePlayScreen: React.FC<GamePlayScreenProps> = ({
  room,
  playerStats,
  questionIndex = 0,
  totalQuestions = 50,
  onSelectQuestionIndex,
  onAnswerCorrect,
  onOpenHint,
  onPauseToggle,
  isPaused,
  hintsLeft,
  onReturnToLevelSelect,
  onReturnToTitle,
  isMusicPlaying,
  onToggleMusic,
  onTimeUp,
}) => {
  const [inputVal, setInputVal] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(room.timeLimit);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [isTimeUpModalOpen, setIsTimeUpModalOpen] = useState<boolean>(false);
  const [isExitPromptOpen, setIsExitPromptOpen] = useState<boolean>(false);
  const [isQuestionListOpen, setIsQuestionListOpen] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Active question from level's 50-question bank
  const activeQuestion: RiddleQuestion =
    room.questions && room.questions[questionIndex]
      ? room.questions[questionIndex]
      : {
          id: questionIndex + 1,
          question: room.puzzle.question,
          detailPrompt: room.puzzle.detailPrompt,
          acceptedAnswers: room.puzzle.acceptedAnswers,
          explanation: room.puzzle.explanation,
          hints: ['Perhatikan kata kunci soal.', 'Amati huruf awal dan akhir.', 'Jawaban ada di sekitar kita.'],
        };

  // Reset input and timer when question or room changes
  useEffect(() => {
    setTimeLeft(room.timeLimit);
    setInputVal('');
    setErrorMessage(null);
    setIsTimeUpModalOpen(false);
  }, [room.id, questionIndex]);

  // Escape room countdown timer
  useEffect(() => {
    if (isPaused || isTimeUpModalOpen || isExitPromptOpen || isQuestionListOpen) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setIsTimeUpModalOpen(true);
          if (onTimeUp) onTimeUp();
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
  }, [isPaused, isTimeUpModalOpen, isExitPromptOpen, isQuestionListOpen, onTimeUp]);

  const handleRetry = () => {
    setTimeLeft(room.timeLimit);
    setInputVal('');
    setErrorMessage(null);
    setIsTimeUpModalOpen(false);
  };

  const handlePrevQuestion = () => {
    if (questionIndex > 0 && onSelectQuestionIndex) {
      sound.playClick();
      onSelectQuestionIndex(questionIndex - 1);
    }
  };

  const handleNextQuestion = () => {
    if (questionIndex < totalQuestions - 1 && onSelectQuestionIndex) {
      sound.playClick();
      onSelectQuestionIndex(questionIndex + 1);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim()) return;

    sound.playClick();
    const rawClean = inputVal.trim().toUpperCase();
    const clean = rawClean
      .replace(/[.,!?;:'"“”(){}[\]]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const isCorrect = activeQuestion.acceptedAnswers.some(ans => {
      const normAns = ans
        .trim()
        .toUpperCase()
        .replace(/[.,!?;:'"“”(){}[\]]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      if (clean === normAns) return true;
      const tokens = clean.split(' ');
      if (tokens.includes(normAns)) return true;
      return false;
    });

    if (isCorrect) {
      setErrorMessage(null);
      const timeSpent = room.timeLimit - timeLeft;
      onAnswerCorrect(timeSpent);
    } else {
      sound.playWrong();
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      setErrorMessage('Jawaban salah! Coba periksa petunjuk atau sinonim kata lain.');
      setTimeLeft(prev => Math.max(0, prev - 5));
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const currentLevelStars = playerStats.levelStars[room.id] || 0;
  const solvedCount = playerStats.levelSolvedCount?.[room.id] || 0;

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-3 sm:p-5 select-none bg-[#1d1733] overflow-hidden">
      {/* Background with cozy night room illustration */}
      <img
        src="/src/assets/images/mystery_room_cozy_bg_1793627597939.jpg"
        alt="Mystery Room Background"
        className="absolute inset-0 w-full h-full object-cover filter brightness-[0.4] pointer-events-none"
      />
      <div className="absolute inset-0 bg-[#1a1330]/85 pointer-events-none" />

      {/* Top HUD Bar with dedicated Keluar Button */}
      <div className="relative z-10 flex items-center justify-between mb-2 sm:mb-3 gap-2">
        {/* Left Side: Tombol Keluar Langsung & Tombol Jeda */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Tombol Keluar dari Mainan Game */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setIsExitPromptOpen(true);
            }}
            className="h-9 sm:h-10 px-2.5 sm:px-3 rounded-full bg-[#2d224d] border-2 border-[#584282] hover:bg-[#3d2f66] active:scale-95 text-rose-300 flex items-center gap-1 shadow-lg transition-transform cursor-pointer"
            title="Keluar dari Game / Ruangan"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400" />
            <span className="font-fredoka text-[11px] sm:text-xs font-bold">Keluar</span>
          </button>

          {/* Pause Button */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onPauseToggle();
            }}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#2d224d] border-2 border-[#584282] hover:bg-[#3d2f66] active:scale-95 text-amber-300 flex items-center justify-center shadow-lg transition-transform cursor-pointer"
            title={isPaused ? 'Lanjutkan Game' : 'Jeda Game'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-300" /> : <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          </button>
        </div>

        {/* Center: Question Selector Pill & Progress Indicator */}
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            setIsQuestionListOpen(true);
          }}
          className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-[#2d224d] via-[#3b2d66] to-[#2d224d] border-2 border-[#f59e0b]/60 rounded-full shadow-lg hover:border-amber-400 active:scale-95 transition-transform cursor-pointer"
          title="Buka Daftar 50 Soal"
        >
          <ListOrdered className="w-3.5 h-3.5 text-amber-300" />
          <span className="font-fredoka text-xs sm:text-sm font-bold text-amber-200">
            Soal {questionIndex + 1}/{totalQuestions}
          </span>
          <span className="text-[10px] text-amber-400/80">▾</span>
        </button>

        {/* Right Timer Pill */}
        <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 bg-[#2d224d] border-2 border-[#584282] rounded-full shadow-lg">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-fredoka text-xs sm:text-sm font-bold text-amber-300 tabular-nums">
            {timeFormatted}
          </span>
        </div>
      </div>

      {/* Main Parchment Question Board matching Screen 3 */}
      <div
        className={`relative z-10 my-auto w-full max-w-md mx-auto bg-gradient-to-b from-[#fef3c7] via-[#fde68a] to-[#fef08a] border-4 border-[#b45309] rounded-3xl p-4 sm:p-5 shadow-[0_10px_25px_rgba(0,0,0,0.6)] ${
          isShaking ? 'animate-bounce' : ''
        }`}
      >
        {/* Header subtitle with Question Navigation arrows */}
        <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#b45309]/30">
          <button
            type="button"
            onClick={handlePrevQuestion}
            disabled={questionIndex <= 0}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
              questionIndex > 0
                ? 'bg-[#b45309]/20 hover:bg-[#b45309]/30 text-[#78350f] active:scale-95 cursor-pointer'
                : 'text-amber-900/20 cursor-not-allowed'
            }`}
            title="Soal Sebelumnya"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="text-center">
            <span className="font-fredoka text-[11px] sm:text-xs font-bold text-[#78350f] uppercase tracking-wide">
              {room.roomName} • Soal {questionIndex + 1} dari {totalQuestions}
            </span>
          </div>

          <button
            type="button"
            onClick={handleNextQuestion}
            disabled={questionIndex >= totalQuestions - 1}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
              questionIndex < totalQuestions - 1
                ? 'bg-[#b45309]/20 hover:bg-[#b45309]/30 text-[#78350f] active:scale-95 cursor-pointer'
                : 'text-amber-900/20 cursor-not-allowed'
            }`}
            title="Soal Selanjutnya"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Level Progress Bar */}
        <div className="w-full bg-[#78350f]/15 h-1.5 rounded-full mb-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-600 to-amber-500 rounded-full transition-all duration-300"
            style={{ width: `${Math.max(2, ((questionIndex + 1) / totalQuestions) * 100)}%` }}
          />
        </div>

        {/* Riddle content with mini detective polaroid on left */}
        <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
          {/* Mini Detective Polaroid */}
          <div className="shrink-0 p-1 bg-white rounded-lg shadow-md border border-[#d97706]/40 rotate-[-3deg]">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded overflow-hidden bg-slate-900">
              <img
                src="/src/assets/images/chibi_detective_happy_1793627597581.jpg"
                alt="Detective Avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Riddle Text with Question Marks */}
          <div className="flex-1 relative">
            <span className="absolute -top-3 -right-2 text-2xl font-fredoka font-bold text-[#d97706]/30">
              ?
            </span>
            <p className="font-fredoka text-sm sm:text-base font-bold text-[#451a03] leading-snug">
              {activeQuestion.question}
            </p>
          </div>
        </div>

        {/* Error message banner if guess was wrong */}
        {errorMessage && (
          <div className="mb-3 p-2 bg-red-100 border border-red-400 rounded-xl text-center text-xs font-semibold text-red-700 flex items-center justify-center gap-1.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Input Field matching reference screenshot */}
        <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-3">
          <div className="relative">
            <input
              type="text"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              placeholder="Masukkan jawaban..."
              className="w-full py-2.5 sm:py-3 px-4 bg-[#fffbeb] border-2 border-[#b45309] rounded-2xl font-fredoka text-sm sm:text-base text-[#78350f] placeholder-[#a16207]/60 outline-none text-center shadow-inner focus:border-purple-600 transition-colors"
            />
          </div>

          {/* Submit Button (Purple rounded button) */}
          <button
            type="submit"
            disabled={!inputVal.trim()}
            className="btn-cartoon-purple w-full py-2.5 sm:py-3 px-6 rounded-2xl text-white font-fredoka text-base font-bold tracking-wide transition-transform cursor-pointer disabled:opacity-50"
          >
            Submit
          </button>
        </form>
      </div>

      {/* Bottom Bar: Hint Button & Total Progress */}
      <div className="relative z-10 flex items-center justify-between mt-2 sm:mt-3">
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onOpenHint();
          }}
          className="relative px-3.5 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-b from-[#fef08a] to-[#f59e0b] border-2 border-[#b45309] rounded-2xl shadow-lg flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
        >
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-400 border border-amber-600 flex items-center justify-center shadow-sm">
            <Lightbulb className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-950 fill-amber-300" />
          </div>
          <span className="font-fredoka text-xs font-bold text-[#78350f]">
            {hintsLeft} Hint
          </span>
        </button>

        {/* Fast Question List Launcher */}
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            setIsQuestionListOpen(true);
          }}
          className="text-xs font-fredoka font-semibold text-purple-200 px-3 py-1.5 bg-[#2b204a] hover:bg-[#3d2f66] rounded-full border border-[#584282] shadow-md flex items-center gap-1.5 active:scale-95 transition-transform cursor-pointer"
        >
          <Grid className="w-3.5 h-3.5 text-amber-300" />
          <span>Daftar 50 Soal</span>
        </button>
      </div>

      {/* 50-Question Selector Modal (Allows jumping to any of the 50 questions!) */}
      {isQuestionListOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in select-none">
          <div className="relative w-full max-w-sm max-h-[85vh] flex flex-col bg-gradient-to-b from-[#2a1e47] via-[#21173d] to-[#1a1230] border-4 border-[#b45309] rounded-3xl p-4 sm:p-5 text-center shadow-[0_15px_35px_rgba(0,0,0,0.8)]">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#584282]">
              <div className="text-left">
                <h3 className="font-fredoka text-base sm:text-lg font-bold text-amber-300">
                  {room.title}
                </h3>
                <p className="font-fredoka text-[10px] sm:text-xs text-purple-300">
                  Pilih salah satu dari 50 teka-teki
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setIsQuestionListOpen(false);
                }}
                className="w-8 h-8 rounded-full bg-[#3d2f66] hover:bg-[#4d3a82] text-amber-200 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 50 Questions Number Grid */}
            <div className="grid grid-cols-5 gap-2 overflow-y-auto p-1 my-2 max-h-[50vh] pr-1 scrollbar-thin">
              {Array.from({ length: totalQuestions }, (_, i) => {
                const isCurrent = i === questionIndex;
                const isSolved = i < solvedCount;

                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      if (onSelectQuestionIndex) {
                        onSelectQuestionIndex(i);
                      }
                      setIsQuestionListOpen(false);
                    }}
                    className={`h-10 rounded-xl font-fredoka text-xs font-bold transition-all flex items-center justify-center relative cursor-pointer ${
                      isCurrent
                        ? 'bg-amber-400 text-amber-950 ring-2 ring-white scale-105 shadow-md'
                        : isSolved
                        ? 'bg-emerald-600/80 hover:bg-emerald-500 text-white border border-emerald-400/50'
                        : 'bg-[#3b2d66] hover:bg-[#4b3a82] text-purple-200 border border-[#584282]'
                    }`}
                  >
                    <span>{i + 1}</span>
                    {isSolved && !isCurrent && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-950" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Modal Bottom Close */}
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setIsQuestionListOpen(false);
              }}
              className="btn-cartoon-purple w-full py-2.5 rounded-2xl text-white font-fredoka text-xs font-bold mt-2 cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Cozy Pause Menu Overlay */}
      {isPaused && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in select-none">
          <div className="relative w-full max-w-sm bg-gradient-to-b from-[#2a1e47] via-[#21173d] to-[#1a1230] border-4 border-[#b45309] rounded-3xl p-6 text-center shadow-[0_15px_35px_rgba(0,0,0,0.8)]">
            <h3 className="font-fredoka text-2xl font-bold text-amber-200 mb-2">
              Game Dijeda
            </h3>
            <p className="font-fredoka text-xs text-purple-300 mb-5">
              Timer waktu ruangan berhenti sementara.
            </p>

            <div className="flex flex-col gap-2.5">
              {/* Lanjutkan */}
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onPauseToggle();
                }}
                className="btn-cartoon-pink w-full py-3 px-6 rounded-2xl text-white font-fredoka text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Lanjutkan Penyelidikan</span>
              </button>

              {/* Music Toggle */}
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onToggleMusic();
                }}
                className="btn-cartoon-parchment w-full py-2.5 px-6 rounded-2xl font-fredoka text-xs font-bold flex items-center justify-center gap-2 cursor-pointer border border-[#d97706]/40"
              >
                {isMusicPlaying ? (
                  <Music className="w-4 h-4 text-[#78350f] animate-pulse" />
                ) : (
                  <Music2 className="w-4 h-4 text-slate-500" />
                )}
                <span>Musik: {isMusicPlaying ? 'NYALA' : 'MATI'}</span>
              </button>

              {/* Pilih Level Lain */}
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onReturnToLevelSelect();
                }}
                className="btn-cartoon-parchment w-full py-2.5 px-6 rounded-2xl font-fredoka text-xs font-bold flex items-center justify-center gap-2 cursor-pointer border border-[#d97706]/40"
              >
                <Grid className="w-4 h-4 text-[#78350f]" />
                <span>Pilih Level Lain</span>
              </button>

              {/* Keluar ke Menu Utama */}
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onReturnToTitle();
                }}
                className="w-full py-2 px-6 rounded-2xl font-fredoka text-xs font-bold flex items-center justify-center gap-2 cursor-pointer bg-[#2c1d3d] hover:bg-[#3d2454] border border-[#6b3b82] text-rose-300 mt-1"
              >
                <Home className="w-4 h-4" />
                <span>Menu Utama</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Screen: "Waktu Habis!" Modal matching user reference screenshot IMG_2343 */}
      <WaktuHabisModal
        isOpen={isTimeUpModalOpen}
        onRetry={handleRetry}
        onReturnToTitle={onReturnToTitle}
      />

      {/* Pop-up Dialog: Keluar dari Permainan / Ruangan */}
      {isExitPromptOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in select-none">
          <div className="relative w-full max-w-sm bg-gradient-to-b from-[#2a1e47] via-[#21173d] to-[#1a1230] border-4 border-[#b45309] rounded-3xl p-6 text-center shadow-[0_15px_35px_rgba(0,0,0,0.8)]">
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-b from-rose-500 to-amber-700 p-0.5 shadow-lg flex items-center justify-center">
              <div className="w-full h-full bg-[#1e1533] rounded-[14px] flex items-center justify-center text-rose-400">
                <LogOut className="w-7 h-7" />
              </div>
            </div>

            <h3 className="font-fredoka text-xl font-bold text-amber-200 mb-2">
              Keluar dari Mainan Game?
            </h3>
            <p className="font-fredoka text-xs text-purple-200/90 mb-5 leading-relaxed">
              Kamu bisa memilih untuk kembali ke daftar level atau kembali ke menu utama.
            </p>

            <div className="flex flex-col gap-2.5">
              {/* Kembali ke Pilih Level */}
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setIsExitPromptOpen(false);
                  onReturnToLevelSelect();
                }}
                className="btn-cartoon-parchment w-full py-3 px-4 rounded-2xl font-fredoka text-xs font-bold flex items-center justify-center gap-2 cursor-pointer border border-[#d97706]/40"
              >
                <Grid className="w-4 h-4 text-[#78350f]" />
                <span>Kembali ke Pilih Level</span>
              </button>

              {/* Kembali ke Menu Utama */}
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setIsExitPromptOpen(false);
                  onReturnToTitle();
                }}
                className="btn-cartoon-gold w-full py-3 px-4 rounded-2xl font-fredoka text-xs font-bold text-white flex items-center justify-center gap-2 cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Kembali ke Menu Utama</span>
              </button>

              {/* Batal / Tetap Bermain */}
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setIsExitPromptOpen(false);
                }}
                className="w-full py-2.5 px-4 rounded-2xl font-fredoka text-xs font-semibold text-purple-300 hover:text-white transition-colors cursor-pointer"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
