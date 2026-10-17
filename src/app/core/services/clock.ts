import { InjectionToken } from '@angular/core';

export interface Clock {
  now(): Date;
}

export const CLOCK = new InjectionToken<Clock>('Clock', {
  providedIn: 'root',
  factory: () => ({ now: () => new Date() }),
});

export function dayKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function computeStreak(activeDays: string[], today: string): number {
  if (activeDays.length === 0) return 0;
  const sorted = [...new Set(activeDays)].sort().reverse();
  // Streak counts if today or yesterday is the most recent active day
  const anchor = sorted[0];
  if (anchor !== today) {
    // Check if yesterday
    const yesterday = dayKey(new Date(Date.now() - 86400000));
    if (anchor !== yesterday) return 0;
  }
  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diffDays = Math.round((prev.getTime() - curr.getTime()) / 86400000);
    if (diffDays === 1) { streak++; } else { break; }
  }
  return streak;
}
