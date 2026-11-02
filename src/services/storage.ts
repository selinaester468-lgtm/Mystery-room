import { PlayerStats, LeaderboardEntry } from '../types/game';

const STATS_KEY = 'mystery_room_player_stats_v1';
const LEADERBOARD_KEY = 'mystery_room_leaderboard_v1';

export const INITIAL_PLAYER_STATS: PlayerStats = {
  playerName: 'Detektif Pemula',
  totalScore: 0,
  levelsCompleted: [],
  levelStars: {},
  levelHighScores: {},
  hintsUsedCount: 0,
  correctStreak: 0,
  achievements: [],
};

export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  { id: 'lb-1', name: 'Selestia', score: 1250, rankTitle: 'Master Deduksi', roomsCleared: 8, timestamp: Date.now() - 86400000 * 1 },
  { id: 'lb-2', name: 'Player02', score: 980, rankTitle: 'Pemecah Sandi Ulung', roomsCleared: 6, timestamp: Date.now() - 86400000 * 2 },
  { id: 'lb-3', name: 'Player03', score: 870, rankTitle: 'Pemecah Sandi Ulung', roomsCleared: 5, timestamp: Date.now() - 86400000 * 3 },
  { id: 'lb-4', name: 'Player04', score: 720, rankTitle: 'Penyelidik Cermat', roomsCleared: 4, timestamp: Date.now() - 86400000 * 4 },
  { id: 'lb-5', name: 'Player05', score: 690, rankTitle: 'Penyelidik Cermat', roomsCleared: 4, timestamp: Date.now() - 86400000 * 5 },
];

export function getRankTitle(score: number): string {
  if (score >= 12000) return 'Legenda Ruang Misteri';
  if (score >= 8000) return 'Master Deduksi';
  if (score >= 4500) return 'Pemecah Sandi Ulung';
  if (score >= 1800) return 'Penyelidik Cermat';
  return 'Magang Detektif';
}

export function loadPlayerStats(): PlayerStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (raw) {
      return { ...INITIAL_PLAYER_STATS, ...JSON.parse(raw) };
    }
  } catch {
    // Ignore error
  }
  return INITIAL_PLAYER_STATS;
}

export function savePlayerStats(stats: PlayerStats) {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    // Ignore error
  }
}

export function loadLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.sort((a, b) => b.score - a.score);
      }
    }
  } catch {
    // Ignore error
  }
  return INITIAL_LEADERBOARD;
}

export function saveLeaderboard(entries: LeaderboardEntry[]) {
  try {
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries));
  } catch {
    // Ignore error
  }
}

export function addOrUpdateLeaderboard(name: string, score: number, roomsCleared: number) {
  const current = loadLeaderboard();
  const existingIdx = current.findIndex(e => e.name.toLowerCase() === name.toLowerCase());

  const newEntry: LeaderboardEntry = {
    id: 'lb-' + Date.now(),
    name,
    score,
    rankTitle: getRankTitle(score),
    roomsCleared,
    timestamp: Date.now(),
  };

  if (existingIdx >= 0) {
    if (score > current[existingIdx].score) {
      current[existingIdx] = newEntry;
    }
  } else {
    current.push(newEntry);
  }

  const sorted = current.sort((a, b) => b.score - a.score).slice(0, 20);
  saveLeaderboard(sorted);
  return sorted;
}
