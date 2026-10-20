import { Injectable, computed, inject, signal } from '@angular/core';
import { CLOCK, computeStreak, dayKey } from './clock';
import { readStored, writeStored } from './safe-storage';
import type { ProfileData } from '../models/learning.models';

const PROFILE_KEY = 'angular-lab:profile';

const DEFAULT_PROFILE: ProfileData = {
  version: 1, name: '', createdAt: new Date().toISOString(),
  onboardingDone: false, tourDone: false, activeDays: [],
};

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly clock = inject(CLOCK);
  private readonly profile = signal<ProfileData>(
    readStored<ProfileData>(PROFILE_KEY, DEFAULT_PROFILE)
  );

  readonly name = computed(() => this.profile().name);
  readonly initials = computed(() => {
    const n = this.profile().name.trim();
    if (!n) return '';
    return n.split(/\s+/).map((w) => w[0].toUpperCase()).slice(0, 2).join('');
  });
  readonly onboardingDone = computed(() => this.profile().onboardingDone);
  readonly tourDone = computed(() => this.profile().tourDone);
  readonly streak = computed(() => computeStreak(this.profile().activeDays, dayKey(this.clock.now())));

  setName(name: string): void { this.update((p) => ({ ...p, name: name.trim() })); }
  finishOnboarding(): void { this.update((p) => ({ ...p, onboardingDone: true })); }
  finishTour(): void { this.update((p) => ({ ...p, tourDone: true })); }

  recordActiveDay(): void {
    const today = dayKey(this.clock.now());
    const activeDays = this.profile().activeDays;
    if (activeDays[activeDays.length - 1] === today) return;
    this.update((p) => ({ ...p, activeDays: [...p.activeDays, today].slice(-400) }));
  }

  private update(fn: (p: ProfileData) => ProfileData): void {
    this.profile.update((p) => { const next = fn(p); writeStored(PROFILE_KEY, next); return next; });
  }
}
