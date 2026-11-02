import React, { useState, useEffect } from 'react';
import { ROOMS_DATA } from './data/rooms';
import { RoomLevel, PlayerStats, LeaderboardEntry } from './types/game';
import {
  loadPlayerStats,
  savePlayerStats,
  loadLeaderboard,
  addOrUpdateLeaderboard,
  INITIAL_PLAYER_STATS,
} from './services/storage';
import { sound } from './services/audio';

// Cozy Cartoon Game Screens matching reference screenshot + Exit Screen
import { TitleScreen } from './components/cozy/TitleScreen';
import { LevelSelectScreen } from './components/cozy/LevelSelectScreen';
import { GamePlayScreen } from './components/cozy/GamePlayScreen';
import { BenarModal } from './components/cozy/BenarModal';
import { PetunjukModal } from './components/cozy/PetunjukModal';
import { PeringkatModal } from './components/cozy/PeringkatModal';
import { PengaturanModal } from './components/cozy/PengaturanModal';
import { ExitConfirmModal } from './components/cozy/ExitConfirmModal';
import { ExitScreen } from './components/cozy/ExitScreen';

export default function App() {
  const [playerStats, setPlayerStats] = useState<PlayerStats>(() => loadPlayerStats());
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => loadLeaderboard());

  // Active game view: 'title' | 'level_select' | 'gameplay' | 'exit'
  const [currentView, setCurrentView] = useState<'title' | 'level_select' | 'gameplay' | 'exit'>('title');
  const [activeRoom, setActiveRoom] = useState<RoomLevel>(ROOMS_DATA[0]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);

  // Audio / Music state
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(false);

  // Modals state
  const [isBenarModalOpen, setIsBenarModalOpen] = useState<boolean>(false);
  const [isPetunjukModalOpen, setIsPetunjukModalOpen] = useState<boolean>(false);
  const [isPeringkatModalOpen, setIsPeringkatModalOpen] = useState<boolean>(false);
  const [isPengaturanModalOpen, setIsPengaturanModalOpen] = useState<boolean>(false);
  const [isExitConfirmOpen, setIsExitConfirmOpen] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Hints tracker per room
  const [hintsUsedInRoom, setHintsUsedInRoom] = useState<number>(0);
  const maxHintsPerRoom = 3;

  // Persist stats whenever updated
  useEffect(() => {
    savePlayerStats(playerStats);
  }, [playerStats]);

  // Sound FX Mute Toggle
  const handleToggleMute = () => {
    const next = !isAudioMuted;
    setIsAudioMuted(next);
    sound.setMuted(next);
    if (!next) sound.playClick();
  };

  // Cozy Mystery Background Music Toggle
  const handleToggleMusic = () => {
    const nextState = sound.toggleMusic();
    setIsMusicPlaying(nextState);
  };

  // Start Game handler: resume uncompleted level or start Level 1
  const handleStartGame = () => {
    if (!isMusicPlaying) {
      const playing = sound.toggleMusic();
      setIsMusicPlaying(playing);
    }

    const nextRoom =
      ROOMS_DATA.find(r => !playerStats.levelsCompleted.includes(r.id)) ||
      ROOMS_DATA[0];
    setActiveRoom(nextRoom);
    const savedIdx = playerStats.levelQuestionProgress?.[nextRoom.id] || 0;
    setActiveQuestionIndex(savedIdx);
    setHintsUsedInRoom(0);
    setIsPaused(false);
    setCurrentView('gameplay');
  };

  // Level Selection
  const handleSelectLevel = (room: RoomLevel) => {
    if (!isMusicPlaying) {
      const playing = sound.toggleMusic();
      setIsMusicPlaying(playing);
    }
    setActiveRoom(room);
    const savedIdx = playerStats.levelQuestionProgress?.[room.id] || 0;
    setActiveQuestionIndex(savedIdx);
    setHintsUsedInRoom(0);
    setIsPaused(false);
    setCurrentView('gameplay');
  };

  // Active question in room
  const activeQuestion = activeRoom.questions?.[activeQuestionIndex] || activeRoom.questions?.[0];

  // Answer Correct! Trigger "Benar!" modal matching Screen 4
  const handleAnswerCorrect = (timeSpent: number) => {
    const roomId = activeRoom.id;
    const basePts = 100;
    const timeBonus = Math.max(0, Math.floor((activeRoom.timeLimit - timeSpent) / 2));
    const hintDeduction = hintsUsedInRoom * 20;
    const earnedPoints = Math.max(50, basePts + timeBonus - hintDeduction);

    const questionsCount = activeRoom.questions?.length || 50;

    setPlayerStats(prev => {
      const currentSolved = prev.levelSolvedCount?.[roomId] || 0;
      const newSolvedCount = Math.min(questionsCount, Math.max(currentSolved, activeQuestionIndex + 1));
      const isLevelFullyCompleted = newSolvedCount >= questionsCount;

      const newLevelsCompleted = isLevelFullyCompleted
        ? (prev.levelsCompleted.includes(roomId) ? prev.levelsCompleted : [...prev.levelsCompleted, roomId])
        : prev.levelsCompleted;

      const prevStars = prev.levelStars[roomId] || 0;
      const starsEarned = newSolvedCount >= 40 ? 3 : newSolvedCount >= 20 ? 2 : 1;
      const newStars = Math.max(prevStars, starsEarned);

      const prevHighScore = prev.levelHighScores[roomId] || 0;
      const newHighScore = Math.max(prevHighScore, earnedPoints);

      const updated: PlayerStats = {
        ...prev,
        totalScore: prev.totalScore + earnedPoints,
        levelsCompleted: newLevelsCompleted,
        levelStars: {
          ...prev.levelStars,
          [roomId]: newStars,
        },
        levelHighScores: {
          ...prev.levelHighScores,
          [roomId]: newHighScore,
        },
        levelSolvedCount: {
          ...(prev.levelSolvedCount || {}),
          [roomId]: newSolvedCount,
        },
        levelQuestionProgress: {
          ...(prev.levelQuestionProgress || {}),
          [roomId]: Math.min(questionsCount - 1, activeQuestionIndex + 1),
        },
        correctStreak: prev.correctStreak + 1,
      };

      // Sync leaderboard
      const updatedLeaderboard = addOrUpdateLeaderboard(
        updated.playerName,
        updated.totalScore,
        updated.levelsCompleted.length
      );
      setLeaderboard(updatedLeaderboard);

      return updated;
    });

    setIsBenarModalOpen(true);
  };

  // Next Question / Next Level from "Benar!" modal
  const handleNextLevel = () => {
    setIsBenarModalOpen(false);
    const questionsCount = activeRoom.questions?.length || 50;

    if (activeQuestionIndex < questionsCount - 1) {
      // Advance to next question in this level!
      setActiveQuestionIndex(prev => prev + 1);
      setHintsUsedInRoom(0);
      setIsPaused(false);
    } else {
      // Advance to next level!
      const nextRoom = ROOMS_DATA.find(r => r.id === activeRoom.id + 1);
      if (nextRoom) {
        setActiveRoom(nextRoom);
        setActiveQuestionIndex(0);
        setHintsUsedInRoom(0);
        setIsPaused(false);
      } else {
        setCurrentView('level_select');
      }
    }
  };

  // Open Hint Modal
  const handleOpenHint = () => {
    if (hintsUsedInRoom < maxHintsPerRoom) {
      setHintsUsedInRoom(prev => prev + 1);
    }
    sound.playHintReveal();
    setIsPetunjukModalOpen(true);
  };

  // Get current hint text
  const currentHintIndex = Math.min(
    Math.max(0, hintsUsedInRoom > 0 ? hintsUsedInRoom - 1 : 0),
    2
  );
  const currentHintText =
    activeQuestion?.hints?.[currentHintIndex] ||
    activeRoom.hints?.[currentHintIndex]?.text ||
    'Perhatikan kata kunci dari teka-teki dengan cermat.';

  // Update Player Name
  const handleUpdatePlayerName = (newName: string) => {
    setPlayerStats(prev => {
      const updated = { ...prev, playerName: newName };
      const updatedLeaderboard = addOrUpdateLeaderboard(
        newName,
        updated.totalScore,
        updated.levelsCompleted.length
      );
      setLeaderboard(updatedLeaderboard);
      return updated;
    });
  };

  // Reset Progress
  const handleResetProgress = () => {
    setPlayerStats(INITIAL_PLAYER_STATS);
    savePlayerStats(INITIAL_PLAYER_STATS);
    setCurrentView('title');
  };

  // Confirm Exit Game
  const handleConfirmExit = () => {
    setIsExitConfirmOpen(false);
    setIsPaused(false);
    sound.stopMusic();
    setIsMusicPlaying(false);
    setCurrentView('exit');
  };

  return (
    <div className="min-h-screen bg-[#0e0a1b] text-slate-100 flex flex-col items-center justify-center p-0 sm:p-4 selection:bg-amber-400 selection:text-slate-950 font-quicksand">
      {/* Background ambient cozy stars */}
      <div className="fixed inset-0 bg-[radial-gradient(#4a2b7a_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none" />

      {/* Mobile-First Phone Screen Container */}
      <div className="relative w-full h-[100dvh] max-w-[430px] bg-[#1a142e] sm:my-auto sm:h-[844px] sm:max-h-[96vh] sm:rounded-[44px] sm:border-[8px] sm:border-[#382b57] sm:shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(110,68,168,0.3)] overflow-hidden flex flex-col">
        {/* Subtle camera punch hole aesthetic on desktop simulator */}
        <div className="hidden sm:block absolute top-2.5 left-1/2 -translate-x-1/2 w-14 h-3.5 bg-[#0e0a1b] rounded-full z-40 pointer-events-none" />

        {/* Dynamic Game View */}
        <div className="flex-1 w-full h-full relative overflow-hidden flex flex-col">
          {currentView === 'title' && (
            <TitleScreen
              onStartGame={handleStartGame}
              onOpenLevelSelect={() => setCurrentView('level_select')}
              onOpenLeaderboard={() => setIsPeringkatModalOpen(true)}
              onOpenSettings={() => setIsPengaturanModalOpen(true)}
              onExitGame={() => setIsExitConfirmOpen(true)}
              isMusicPlaying={isMusicPlaying}
              onToggleMusic={handleToggleMusic}
            />
          )}

          {currentView === 'level_select' && (
            <LevelSelectScreen
              rooms={ROOMS_DATA}
              playerStats={playerStats}
              onSelectLevel={handleSelectLevel}
              onBackToTitle={() => setCurrentView('title')}
            />
          )}

          {currentView === 'gameplay' && (
            <GamePlayScreen
              room={activeRoom}
              playerStats={playerStats}
              questionIndex={activeQuestionIndex}
              totalQuestions={activeRoom.questions?.length || 50}
              onSelectQuestionIndex={(idx) => {
                setActiveQuestionIndex(idx);
                setHintsUsedInRoom(0);
              }}
              onAnswerCorrect={handleAnswerCorrect}
              onOpenHint={handleOpenHint}
              onPauseToggle={() => setIsPaused(prev => !prev)}
              isPaused={isPaused}
              hintsLeft={Math.max(0, maxHintsPerRoom - hintsUsedInRoom)}
              onReturnToLevelSelect={() => {
                setIsPaused(false);
                setCurrentView('level_select');
              }}
              onReturnToTitle={() => {
                setIsPaused(false);
                setCurrentView('title');
              }}
              isMusicPlaying={isMusicPlaying}
              onToggleMusic={handleToggleMusic}
            />
          )}

          {currentView === 'exit' && (
            <ExitScreen
              playerStats={playerStats}
              onReEnterGame={() => {
                setCurrentView('title');
              }}
            />
          )}
        </div>
      </div>

      {/* Modals from Reference Screenshot */}

      {/* Screen 4: "Benar!" Victory Modal */}
      <BenarModal
        isOpen={isBenarModalOpen}
        onNextLevel={handleNextLevel}
        questionNumber={activeQuestionIndex + 1}
        totalQuestions={activeRoom.questions?.length || 50}
        explanation={activeQuestion?.explanation}
        isLastQuestionInLevel={activeQuestionIndex >= (activeRoom.questions?.length || 50) - 1}
      />

      {/* Screen 5: "Petunjuk" Hint Modal */}
      <PetunjukModal
        isOpen={isPetunjukModalOpen}
        onClose={() => setIsPetunjukModalOpen(false)}
        hintText={currentHintText}
      />

      {/* Screen 6: "Peringkat" Leaderboard Modal */}
      <PeringkatModal
        isOpen={isPeringkatModalOpen}
        onClose={() => setIsPeringkatModalOpen(false)}
        entries={leaderboard}
        playerStats={playerStats}
      />

      {/* "Pengaturan" Settings Modal */}
      <PengaturanModal
        isOpen={isPengaturanModalOpen}
        onClose={() => setIsPengaturanModalOpen(false)}
        isAudioMuted={isAudioMuted}
        onToggleMute={handleToggleMute}
        isAmbientActive={isMusicPlaying}
        onToggleAmbient={handleToggleMusic}
        playerName={playerStats.playerName}
        onUpdatePlayerName={handleUpdatePlayerName}
        onResetProgress={handleResetProgress}
      />

      {/* Exit Game Confirmation Modal */}
      <ExitConfirmModal
        isOpen={isExitConfirmOpen}
        onClose={() => setIsExitConfirmOpen(false)}
        onConfirmExit={handleConfirmExit}
      />
    </div>
  );
}
