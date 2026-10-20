import { InjectionToken, Injectable, computed, effect, inject, untracked } from '@angular/core';

import { BADGES, BadgeContext, buildBadgeContext, computeXp, levelFor, topicXp } from './gamification-rules';
import type { BadgeDef } from './gamification-rules';
import { ProfileService } from './profile.service';
import { ProgressService } from './progress.service';
import { readStored, writeStored } from './safe-storage';
import { ToastService } from './toast.service';
import type { TopicId } from '../models/learning.models';

const KEY = 'angular-lab:gamification';

interface Celebrated {
  version: 1;
  badges: string[];
  level: number;
}

export interface BadgeState extends BadgeDef {
  isEarned: boolean;
}

/** Lazy-loads the confetti library only when there is something to celebrate, and respects reduced motion. */
export const FIRE_CONFETTI = new InjectionToken<() => void>('FIRE_CONFETTI', {
  providedIn: 'root',
  factory: () => () => {
    if (typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    void import('canvas-confetti').then(({ default: confetti }) =>
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.7 }, disableForReducedMotion: true }),
    );
  },
});

/**
 * XP, level and badges, all worked out from saved progress. The only thing stored here is what the
 * learner has already been congratulated for, so a reload never celebrates the same thing twice.
 */
@Injectable({ providedIn: 'root' })
export class GamificationService {
  private readonly progress = inject(ProgressService);
  private readonly profile = inject(ProfileService);
  private readonly toast = inject(ToastService);
  private readonly fireConfetti = inject(FIRE_CONFETTI);

  readonly xp = computed(() => computeXp(this.progress.topics()));
  readonly level = computed(() => levelFor(this.xp()));

  private readonly context = computed<BadgeContext>(() => buildBadgeContext(this.progress.topics(), this.profile.streak()));
  readonly badges = computed<BadgeState[]>(() => BADGES.map((b) => ({ ...b, isEarned: b.earned(this.context()) })));
  readonly earnedCount = computed(() => this.badges().filter((b) => b.isEarned).length);

  constructor() {
    effect(() => {
      const earned = this.badges().filter((b) => b.isEarned);
      const levelNumber = this.level().level.number;
      untracked(() => this.celebrate(earned, levelNumber));
    });
  }

  xpForTopic(topicId: TopicId): number {
    return topicXp(this.progress.topics()[topicId]);
  }

  private celebrate(earned: BadgeState[], levelNumber: number): void {
    const stored = readStored<Celebrated | null>(KEY, null);

    // First run: record where the learner already is without throwing a party for old progress.
    if (!stored) {
      writeStored(KEY, { version: 1, badges: earned.map((b) => b.id), level: levelNumber } satisfies Celebrated);
      return;
    }

    const earnedIds = earned.map((b) => b.id);
    const fresh = earned.filter((b) => !stored.badges.includes(b.id));
    const leveledUp = levelNumber > stored.level;

    // Keep only what is still true, so progress that was reset can be celebrated again later.
    const next: Celebrated = { version: 1, badges: [...stored.badges.filter((id) => earnedIds.includes(id)), ...fresh.map((b) => b.id)], level: Math.min(stored.level, levelNumber) };
    if (leveledUp) {
      next.level = levelNumber;
    }
    writeStored(KEY, next);

    for (const badge of fresh) {
      this.toast.success(`${badge.icon} Badge unlocked: ${badge.title}`, badge.description);
    }
    if (leveledUp) {
      this.toast.success(`⬆️ Level up!`, `You are now level ${levelNumber}: ${this.level().level.title}.`);
    }
    if (fresh.length || leveledUp) {
      this.fireConfetti();
    }
  }
}
