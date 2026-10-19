import { TOPICS } from '../data/topics';
import type { TopicId, TopicProgress } from '../models/learning.models';
import { BADGES, LEVELS, XP, buildBadgeContext, computeXp, levelFor, topicXp } from './gamification-rules';

const progress = (over: Partial<TopicProgress> = {}): TopicProgress => ({ sectionsDone: [], attempts: [], ...over });
const earnedIds = (topics: Partial<Record<TopicId, TopicProgress>>, streak = 0) => {
  const ctx = buildBadgeContext(topics, streak);
  return BADGES.filter((b) => b.earned(ctx)).map((b) => b.id);
};

describe('gamification rules', () => {
  describe('XP', () => {
    it('gives 10 XP per finished section', () => {
      expect(topicXp(progress({ sectionsDone: ['a', 'b', 'c'] }))).toBe(3 * XP.section);
    });

    it('adds the quiz bonus only for a quiz pass, not a manual completion', () => {
      const passed = progress({ sectionsDone: ['a'], completedVia: 'quiz', completedAt: 'x', bestScore: 5 });
      const manual = progress({ sectionsDone: ['a'], completedAt: 'x' });

      expect(topicXp(passed)).toBe(XP.section + XP.quizPass);
      expect(topicXp(manual)).toBe(XP.section);
    });

    it('adds the perfect bonus for a full-marks quiz pass', () => {
      const perfect = progress({ completedVia: 'quiz', completedAt: 'x', bestScore: 6 });

      expect(topicXp(perfect)).toBe(XP.quizPass + XP.perfectBonus);
    });

    it('adds up across topics and is 0 for no progress', () => {
      expect(computeXp({})).toBe(0);
      expect(topicXp(undefined)).toBe(0);
      expect(computeXp({ binding: progress({ sectionsDone: ['a'] }), pipes: progress({ sectionsDone: ['a', 'b'] }) })).toBe(30);
    });
  });

  describe('levels', () => {
    it('starts at level 1 with 0 XP', () => {
      const result = levelFor(0);

      expect(result.level.number).toBe(1);
      expect(result.next?.number).toBe(2);
      expect(result.percent).toBe(0);
    });

    it('moves up exactly at a threshold and reports progress inside the level', () => {
      const atTwo = levelFor(LEVELS[1].minXp);
      const middle = levelFor(LEVELS[1].minXp + 75);

      expect(atTwo.level.number).toBe(2);
      expect(atTwo.xpIntoLevel).toBe(0);
      expect(middle.xpIntoLevel).toBe(75);
      expect(middle.xpForLevel).toBe(150);
      expect(middle.percent).toBe(50);
    });

    it('stays at the top level at 100% with no next level', () => {
      const top = levelFor(99999);

      expect(top.level.number).toBe(LEVELS.length);
      expect(top.next).toBeUndefined();
      expect(top.percent).toBe(100);
    });

    it('can be reached with the XP the course offers', () => {
      const maxXp = TOPICS.reduce((sum, t) => sum + t.sections.length * XP.section + XP.quizPass + XP.perfectBonus, 0);

      expect(maxXp).toBeGreaterThanOrEqual(LEVELS[LEVELS.length - 1].minXp);
    });
  });

  describe('badges', () => {
    it('has unique ids', () => {
      expect(new Set(BADGES.map((b) => b.id)).size).toBe(BADGES.length);
    });

    it('earns nothing with no progress', () => {
      expect(earnedIds({})).toEqual([]);
    });

    it('earns First Step after one section', () => {
      expect(earnedIds({ binding: progress({ sectionsDone: ['a'] }) })).toEqual(['first-step']);
    });

    it('earns Quiz Taker and Perfectionist for a perfect quiz pass', () => {
      const ids = earnedIds({ binding: progress({ completedVia: 'quiz', completedAt: 'x', bestScore: 6 }) });

      expect(ids).toContain('quiz-taker');
      expect(ids).toContain('perfectionist');
    });

    it('earns the streak badges from the streak length', () => {
      expect(earnedIds({}, 2)).toEqual([]);
      expect(earnedIds({}, 3)).toEqual(['streak-3']);
      expect(earnedIds({}, 7)).toEqual(['streak-3', 'streak-7']);
    });

    it('earns Solid Foundations only when every Fundamentals topic is complete', () => {
      const fundamentals = TOPICS.filter((t) => t.group === 'fundamentals').map((t) => t.id);
      const all = Object.fromEntries(fundamentals.map((id) => [id, progress({ completedAt: 'x' })]));
      const missingOne = { ...all };
      delete missingOne[fundamentals[0]];

      expect(earnedIds(all)).toContain('fundamentals');
      expect(earnedIds(missingOne)).not.toContain('fundamentals');
    });

    it('earns Graduate when every topic is complete', () => {
      const all = Object.fromEntries(TOPICS.map((t) => [t.id, progress({ completedAt: 'x' })]));

      expect(earnedIds(all)).toContain('graduate');
    });
  });
});
