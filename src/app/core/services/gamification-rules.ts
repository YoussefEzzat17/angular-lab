import { TOPICS } from '../data/topics';
import { QUIZ_RULES } from '../models/learning.models';
import type { TopicId, TopicProgress } from '../models/learning.models';

export type TopicsState = Partial<Record<TopicId, TopicProgress>>;

/** XP is worked out from saved progress, so there is nothing extra to store or migrate. */
export const XP = { section: 10, quizPass: 50, perfectBonus: 25 } as const;

export interface Level {
  /** 1-based. */
  number: number;
  title: string;
  minXp: number;
}

export const LEVELS: Level[] = [
  { number: 1, title: 'Newcomer', minXp: 0 },
  { number: 2, title: 'Explorer', minXp: 100 },
  { number: 3, title: 'Builder', minXp: 250 },
  { number: 4, title: 'Craftsman', minXp: 450 },
  { number: 5, title: 'Architect', minXp: 750 },
  { number: 6, title: 'Expert', minXp: 1100 },
  { number: 7, title: 'Angular Wizard', minXp: 1500 },
];

export interface LevelProgress {
  level: Level;
  next: Level | undefined;
  xp: number;
  /** XP earned since this level started. */
  xpIntoLevel: number;
  /** XP the whole level is worth (0 at the top level). */
  xpForLevel: number;
  /** 0–100 progress to the next level; 100 at the top level. */
  percent: number;
}

export interface BadgeContext {
  sectionsDone: number;
  quizzesPassed: number;
  perfectQuizzes: number;
  completedTopics: number;
  completedIds: Set<TopicId>;
  streak: number;
}

export interface BadgeDef {
  id: string;
  icon: string;
  title: string;
  description: string;
  earned: (ctx: BadgeContext) => boolean;
}

const fundamentalsIds = TOPICS.filter((t) => t.group === 'fundamentals').map((t) => t.id);

export const BADGES: BadgeDef[] = [
  { id: 'first-step', icon: '👣', title: 'First Step', description: 'Finish your first section.', earned: (c) => c.sectionsDone >= 1 },
  { id: 'quiz-taker', icon: '✅', title: 'Quiz Taker', description: 'Pass your first quiz.', earned: (c) => c.quizzesPassed >= 1 },
  { id: 'perfectionist', icon: '💯', title: 'Perfectionist', description: 'Score 100% on a quiz.', earned: (c) => c.perfectQuizzes >= 1 },
  { id: 'streak-3', icon: '🔥', title: 'On a Roll', description: 'Learn 3 days in a row.', earned: (c) => c.streak >= 3 },
  { id: 'streak-7', icon: '🌟', title: 'Week Warrior', description: 'Learn 7 days in a row.', earned: (c) => c.streak >= 7 },
  { id: 'five-topics', icon: '🧭', title: 'Explorer', description: 'Complete 5 topics.', earned: (c) => c.completedTopics >= 5 },
  {
    id: 'fundamentals',
    icon: '🏗️',
    title: 'Solid Foundations',
    description: 'Complete every Fundamentals topic.',
    earned: (c) => fundamentalsIds.every((id) => c.completedIds.has(id)),
  },
  { id: 'graduate', icon: '🎓', title: 'Graduate', description: 'Complete every topic.', earned: (c) => c.completedTopics >= TOPICS.length },
];

export function topicXp(progress: TopicProgress | undefined): number {
  if (!progress) {
    return 0;
  }
  let xp = progress.sectionsDone.length * XP.section;
  if (progress.completedVia === 'quiz') {
    xp += XP.quizPass;
  }
  if ((progress.bestScore ?? 0) >= QUIZ_RULES.draw && progress.completedVia === 'quiz') {
    xp += XP.perfectBonus;
  }
  return xp;
}

export function computeXp(topics: TopicsState): number {
  return Object.values(topics).reduce((sum, progress) => sum + topicXp(progress), 0);
}

export function levelFor(xp: number): LevelProgress {
  const level = [...LEVELS].reverse().find((l) => xp >= l.minXp) ?? LEVELS[0];
  const next = LEVELS.find((l) => l.minXp > level.minXp);
  const xpIntoLevel = xp - level.minXp;
  const xpForLevel = next ? next.minXp - level.minXp : 0;
  const percent = next ? Math.min(100, Math.round((xpIntoLevel / xpForLevel) * 100)) : 100;
  return { level, next, xp, xpIntoLevel, xpForLevel, percent };
}

export function buildBadgeContext(topics: TopicsState, streak: number): BadgeContext {
  const entries = Object.entries(topics) as [TopicId, TopicProgress][];
  return {
    sectionsDone: entries.reduce((n, [, p]) => n + p.sectionsDone.length, 0),
    quizzesPassed: entries.filter(([, p]) => p.completedVia === 'quiz').length,
    perfectQuizzes: entries.filter(([, p]) => (p.bestScore ?? 0) >= QUIZ_RULES.draw).length,
    completedTopics: entries.filter(([, p]) => !!p.completedAt).length,
    completedIds: new Set(entries.filter(([, p]) => !!p.completedAt).map(([id]) => id)),
    streak,
  };
}
