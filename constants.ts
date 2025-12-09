import { Achievement } from './types';

export const INITIAL_USER_STATE = {
  xp: 1240,
  streak: 5,
  hearts: 5,
  currentLevel: 2,
  targetLanguage: 'fr' as const,
  nativeLanguage: 'en' as const,
  gems: 450,
  name: "Learner",
};

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  {
    id: '1',
    title: 'Wildfire',
    description: 'Reach a 7 day streak',
    icon: '🔥',
    unlocked: false,
    progress: 5,
    maxProgress: 7,
  },
  {
    id: '2',
    title: 'Sage',
    description: 'Earn 1000 XP',
    icon: '🎓',
    unlocked: true,
    progress: 1240,
    maxProgress: 1000,
  },
  {
    id: '3',
    title: 'Scholar',
    description: 'Learn 50 new words',
    icon: '📚',
    unlocked: false,
    progress: 34,
    maxProgress: 50,
  }
];

export const LEVEL_NODES = [
  { id: 1, topic: 'Basics 1', icon: '🥚', color: 'brand-green' },
  { id: 2, topic: 'Greetings', icon: '👋', color: 'brand-blue' },
  { id: 3, topic: 'Travel', icon: '✈️', color: 'brand-purple' },
  { id: 4, topic: 'Food', icon: '🥐', color: 'brand-red' },
  { id: 5, topic: 'Family', icon: '👨‍👩‍👧', color: 'brand-yellow' },
  { id: 6, topic: 'Shopping', icon: '🛍️', color: 'brand-green' },
  { id: 7, topic: 'Activities', icon: '⚽', color: 'brand-blue' },
];