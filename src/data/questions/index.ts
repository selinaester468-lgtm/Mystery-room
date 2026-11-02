import { RiddleQuestion } from './types';
import { LEVEL_1_QUESTIONS } from './level1';
import { LEVEL_2_QUESTIONS } from './level2';
import { LEVEL_3_QUESTIONS } from './level3';
import { LEVEL_4_QUESTIONS } from './level4';
import { LEVEL_5_QUESTIONS } from './level5';
import { LEVEL_6_QUESTIONS } from './level6';
import { LEVEL_7_QUESTIONS } from './level7';
import { LEVEL_8_QUESTIONS } from './level8';

export * from './types';
export {
  LEVEL_1_QUESTIONS,
  LEVEL_2_QUESTIONS,
  LEVEL_3_QUESTIONS,
  LEVEL_4_QUESTIONS,
  LEVEL_5_QUESTIONS,
  LEVEL_6_QUESTIONS,
  LEVEL_7_QUESTIONS,
  LEVEL_8_QUESTIONS,
};

export const ALL_LEVEL_QUESTIONS: Record<number, RiddleQuestion[]> = {
  1: LEVEL_1_QUESTIONS,
  2: LEVEL_2_QUESTIONS,
  3: LEVEL_3_QUESTIONS,
  4: LEVEL_4_QUESTIONS,
  5: LEVEL_5_QUESTIONS,
  6: LEVEL_6_QUESTIONS,
  7: LEVEL_7_QUESTIONS,
  8: LEVEL_8_QUESTIONS,
};

export function getQuestionsForLevel(levelId: number): RiddleQuestion[] {
  return ALL_LEVEL_QUESTIONS[levelId] || LEVEL_1_QUESTIONS;
}
