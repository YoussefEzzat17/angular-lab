import type { ActivityEntry } from '../models/learning.models';
import {
  activityLink,
  dayLabel,
  filterActivity,
  groupActivityByDay,
  scoreText,
  sectionTitleOf,
  topicTitleOf,
} from './activity-history';

// Local-time dates so the day boundaries match how the app groups them.
const NOW = new Date(2026, 9, 19, 15, 0);
const at = (month: number, day: number, hour = 10) => new Date(2026, month, day, hour, 0).toISOString();

const entries: ActivityEntry[] = [
  { at: at(9, 19, 14), kind: 'quiz-passed', topicId: 'rxjs', score: 5 },
  { at: at(9, 19, 9), kind: 'section-done', topicId: 'rxjs', sectionId: 'subjects' },
  { at: at(9, 18, 20), kind: 'quiz-failed', topicId: 'signals', score: 3 },
  { at: at(9, 11, 8), kind: 'section-done', topicId: 'binding', sectionId: 'two-way' },
];

describe('activity history helpers', () => {
  describe('groupActivityByDay', () => {
    it('labels today and yesterday and gives older days a full date with the year', () => {
      const labels = groupActivityByDay(entries, NOW).map((g) => g.label);

      expect(labels[0]).toBe('Today');
      expect(labels[1]).toBe('Yesterday');
      expect(labels[2]).toContain('2026');
      expect(labels[2]).toContain('Oct 11');
    });

    it('keeps the order and puts entries from the same day in one group', () => {
      const groups = groupActivityByDay(entries, NOW);

      expect(groups.map((g) => g.entries.length)).toEqual([2, 1, 1]);
      expect(groups[0].entries[0].kind).toBe('quiz-passed');
    });

    it('skips entries with an unreadable date', () => {
      const groups = groupActivityByDay([{ at: 'not a date', kind: 'section-done', topicId: 'rxjs' }, ...entries], NOW);

      expect(groups.length).toBe(3);
    });

    it('returns no groups for no entries', () => {
      expect(groupActivityByDay([], NOW)).toEqual([]);
    });
  });

  describe('dayLabel', () => {
    it('calls the day before a month boundary "Yesterday"', () => {
      const firstOfMonth = new Date(2026, 10, 1, 12, 0);

      expect(dayLabel(new Date(2026, 9, 31, 22, 0), firstOfMonth)).toBe('Yesterday');
    });
  });

  describe('filterActivity', () => {
    it('keeps everything for the all/all filter', () => {
      expect(filterActivity(entries, { kind: 'all', topicId: 'all' }).length).toBe(4);
    });

    it('filters by kind', () => {
      const result = filterActivity(entries, { kind: 'section-done', topicId: 'all' });

      expect(result.map((e) => e.topicId)).toEqual(['rxjs', 'binding']);
    });

    it('filters by topic', () => {
      expect(filterActivity(entries, { kind: 'all', topicId: 'rxjs' }).length).toBe(2);
    });

    it('combines kind and topic', () => {
      expect(filterActivity(entries, { kind: 'quiz-passed', topicId: 'signals' })).toEqual([]);
    });
  });

  describe('labels and links', () => {
    it('finds topic and section titles and falls back to the id', () => {
      expect(topicTitleOf('rxjs')).toBe('RxJS');
      expect(sectionTitleOf('rxjs', 'subjects')).toBe('Subjects');
      expect(sectionTitleOf('rxjs', 'nope')).toBeUndefined();
      expect(sectionTitleOf('rxjs', undefined)).toBeUndefined();
    });

    it('links a section entry to the section and a quiz entry to the topic', () => {
      expect(activityLink(entries[1])).toEqual(['/learn', 'rxjs', 'subjects']);
      expect(activityLink(entries[0])).toEqual(['/learn', 'rxjs']);
    });

    it('shows a score out of the number of questions drawn', () => {
      expect(scoreText(entries[0])).toBe('5/6');
      expect(scoreText(entries[1])).toBeUndefined();
    });
  });
});
