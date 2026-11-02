import { RiddleQuestion } from '../data/questions/types';

export type PuzzleCategory = 'gambar' | 'angka' | 'kata' | 'simbol' | 'misteri';

export type DifficultyLevel = 'Mudah' | 'Menengah' | 'Sulit' | 'Master';

export interface Hint {
  tier: number;
  label: string;
  text: string;
  cost: number;
}

export interface EvidenceItem {
  id: string;
  name: string;
  type: 'note' | 'artifact' | 'photo' | 'cipher' | 'tool';
  shortDesc: string;
  fullContent: string;
  uvContent?: string;
  iconName?: string;
}

export interface Suspect {
  id: string;
  name: string;
  role: string;
  statement: string;
  alibi: string;
  clueSuspicious: string;
  isGuilty: boolean;
}

export interface PuzzleConfig {
  type: 'keypad' | 'safe_dial' | 'symbol_decoder' | 'word_lock' | 'star_constellation' | 'deduction_board';
  instruction: string;
  question: string;
  detailPrompt: string;
  acceptedAnswers: string[];
  explanation: string;
  options?: { id: string; label: string; text?: string }[];
  symbols?: { id: string; symbol: string; name: string; value: number }[];
  dialTarget?: number[];
  constellationStars?: { id: number; x: number; y: number; label: string }[];
  suspects?: Suspect[];
  keypadLength?: number;
}

export interface RoomLevel {
  id: number;
  slug: string;
  title: string;
  roomName: string;
  category: PuzzleCategory;
  difficulty: DifficultyLevel;
  timeLimit: number; // in seconds
  basePoints: number;
  prologue: string;
  objective: string;
  bgType: 'study' | 'vault' | 'alchemy' | 'observatory' | 'archive' | 'court' | 'clocktower' | 'sanctum';
  evidence: EvidenceItem[];
  puzzle: PuzzleConfig;
  hints: Hint[];
  questions: RiddleQuestion[];
}

export interface PlayerStats {
  playerName: string;
  totalScore: number;
  levelsCompleted: number[];
  levelStars: Record<number, number>; // levelId -> stars (1-3)
  levelHighScores: Record<number, number>;
  levelQuestionProgress?: Record<number, number>; // levelId -> question index (0 to 49)
  levelSolvedCount?: Record<number, number>; // levelId -> number of solved questions (0 to 50)
  hintsUsedCount: number;
  correctStreak: number;
  achievements: string[];
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  rankTitle: string;
  roomsCleared: number;
  timestamp: number;
}
