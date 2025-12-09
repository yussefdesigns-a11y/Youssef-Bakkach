export type Language = 'en' | 'fr';

export interface UserState {
  xp: number;
  streak: number;
  hearts: number;
  currentLevel: number; // 1-based index of unlocked nodes
  targetLanguage: Language;
  nativeLanguage: Language;
  gems: number;
  name: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  xpReward: number;
}

export enum QuestionType {
  TRANSLATE_TO_TARGET = 'translate_to_target',
  TRANSLATE_TO_NATIVE = 'translate_to_native',
  MULTIPLE_CHOICE = 'multiple_choice',
  LISTENING = 'listening',
}

export interface Question {
  id: string;
  type: QuestionType;
  prompt: string;
  correctAnswer: string;
  options?: string[]; // For multiple choice
  audioText?: string; // For listening
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}
