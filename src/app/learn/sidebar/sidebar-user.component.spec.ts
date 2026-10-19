import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { CLOCK } from '../../core/services/clock';
import { FIRE_CONFETTI } from '../../core/services/gamification.service';
import { ProgressService } from '../../core/services/progress.service';
import { SidebarUserComponent } from './sidebar-user.component';

describe('SidebarUserComponent', () => {
  function setup(opts: { name?: string; activeDays?: string[]; xpSections?: number } = {}) {
    localStorage.clear();
    localStorage.setItem(
      'angular-lab:profile',
      JSON.stringify({ version: 1, name: opts.name ?? '', createdAt: new Date().toISOString(), onboardingDone: true, tourDone: true, activeDays: opts.activeDays ?? [] }),
    );
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: FIRE_CONFETTI, useValue: () => undefined },
        { provide: CLOCK, useValue: { now: () => new Date(2026, 9, 19, 12, 0) } },
      ],
    });
    const progress = TestBed.inject(ProgressService);
    for (let i = 0; i < (opts.xpSections ?? 0); i++) {
      progress.completeSection('binding', `s-${i}`);
    }
    const fixture = TestBed.createComponent(SidebarUserComponent);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    return { root, text: (id: string) => root.querySelector(`[data-testid="${id}"]`)?.textContent?.replace(/\s+/g, ' ').trim() };
  }

  afterEach(() => localStorage.clear());

  it('shows the name and puts the streak on the same row, right beside it', () => {
    const { root, text } = setup({ name: 'Youssef', activeDays: ['2026-10-19'] });

    const name = root.querySelector('[data-testid="sidebar-name"]')!;
    const streak = root.querySelector('[data-testid="sidebar-streak"]')!;

    expect(text('sidebar-name')).toBe('Youssef');
    expect(text('sidebar-streak')).toContain('1');
    expect(name.parentElement).toBe(streak.parentElement);
  });

  it('describes the streak length in its tooltip', () => {
    const { root } = setup({ activeDays: ['2026-10-18', '2026-10-19'] });

    expect(root.querySelector('[data-testid="sidebar-streak"]')?.getAttribute('title')).toBe('2-day streak');
  });

  it('hides the streak when there is none and falls back to "Learner"', () => {
    const { root, text } = setup();

    expect(root.querySelector('[data-testid="sidebar-streak"]')).toBeNull();
    expect(text('sidebar-name')).toBe('Learner');
  });

  it('shows the level number on the avatar and the XP with how much is left', () => {
    const { text } = setup({ xpSections: 3 });

    expect(text('sidebar-level-badge')).toBe('1');
    expect(text('sidebar-next')).toBe('30 XP · 70 to go');
  });

  it('fills the ring in step with the progress to the next level', () => {
    const { root } = setup({ xpSections: 5 });

    const ring = root.querySelector('[data-testid="sidebar-ring"]')!;
    const length = Number(ring.getAttribute('stroke-dasharray'));
    const offset = Number(ring.getAttribute('stroke-dashoffset'));

    expect(offset / length).toBeCloseTo(0.5, 2);
  });

  it('keeps the long story for screen readers, and links the whole block to the journey', () => {
    const { root } = setup({ name: 'Youssef', activeDays: ['2026-10-19'], xpSections: 3 });

    const link = root.querySelector('[data-testid="sidebar-level"]')!;

    expect(link.getAttribute('href')).toBe('/journey');
    expect(link.getAttribute('aria-label')).toBe('Youssef, 1-day streak, level 1, Newcomer, 30 XP, 70 XP to level 2. Open your journey');
    expect(link.getAttribute('title')).toBe('Level 1 · Newcomer');
  });
});
