import { computeStreak, dayKey } from './clock';

function daysAgo(n: number): string {
  return dayKey(new Date(Date.now() - n * 86400000));
}

describe('computeStreak', () => {
  it('returns 0 for no active days', () => {
    expect(computeStreak([], daysAgo(0))).toBe(0);
  });

  it('returns 1 when only today is active', () => {
    expect(computeStreak([daysAgo(0)], daysAgo(0))).toBe(1);
  });

  it('returns 2 for today and yesterday', () => {
    expect(computeStreak([daysAgo(1), daysAgo(0)], daysAgo(0))).toBe(2);
  });

  it('stops counting at a gap', () => {
    // today, yesterday, then a gap, then 4 days ago
    expect(computeStreak([daysAgo(4), daysAgo(1), daysAgo(0)], daysAgo(0))).toBe(2);
  });

  it('returns 0 when the only active days are older than yesterday', () => {
    expect(computeStreak([daysAgo(2), daysAgo(3)], daysAgo(0))).toBe(0);
  });
});
