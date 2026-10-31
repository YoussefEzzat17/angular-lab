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
  const anchor = sorted[0];
  // Derive yesterday from the today string using calendar arithmetic (DST-safe)
  const [y, m, d] = today.split('-').map(Number);
  const yesterday = dayKey(new Date(y, m - 1, d - 1));
  if (anchor !== today && anchor !== yesterday) return 0;
  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const [py, pm, pd] = sorted[i - 1].split('-').map(Number);
    const [cy, cm, cd] = sorted[i].split('-').map(Number);
    const prevDate = new Date(py, pm - 1, pd);
    const currDate = new Date(cy, cm - 1, cd);
    const diffDays = Math.round((prevDate.getTime() - currDate.getTime()) / 86400000);
    if (diffDays === 1) { streak++; } else { break; }
  }
  return streak;
}
