import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { TOPICS } from '../../core/data/topics';
import { FIRE_CONFETTI } from '../../core/services/gamification.service';
import { ProgressService } from '../../core/services/progress.service';
import { JourneyComponent } from './journey.component';

describe('JourneyComponent', () => {
  function setup(seed?: (progress: ProgressService) => void) {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideRouter([]), { provide: FIRE_CONFETTI, useValue: () => undefined }] });
    seed?.(TestBed.inject(ProgressService));
    const fixture = TestBed.createComponent(JourneyComponent);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    return { root, text: (testId: string) => root.querySelector(`[data-testid="${testId}"]`)?.textContent?.replace(/\s+/g, ' ').trim() };
  }

  afterEach(() => localStorage.clear());

  it('shows a node for every topic, linked to the topic', () => {
    const { root } = setup();

    const links = Array.from(root.querySelectorAll('[data-testid^="journey-node-"]')).map((a) => a.getAttribute('href'));

    expect(links).toEqual(TOPICS.map((t) => t.path));
  });

  it('starts at level 1 and marks the first topic as where the learner is', () => {
    const { root, text } = setup();

    expect(text('level-title')).toBe('Newcomer');
    expect(text('journey-node-binding')).toContain('You are here');
    expect(root.textContent?.match(/You are here/g)?.length).toBe(1);
  });

  it('moves "You are here" to the next topic once the first is complete', () => {
    const { text } = setup((progress) => progress.toggleManualComplete('binding'));

    expect(text('journey-node-binding')).toContain('Completed');
    expect(text('journey-node-pipes')).toContain('You are here');
  });

  it('shows XP earned in a topic and the progress toward the next level', () => {
    const { text } = setup((progress) => {
      progress.completeSection('pipes', 'builtin');
      progress.completeSection('pipes', 'custom');
    });

    expect(text('journey-node-pipes')).toContain('+20 XP');
    expect(text('xp-text')).toBe('20 XP · 20/100 to level 2');
  });

  it('lists the badges and marks the earned ones', () => {
    const { root, text } = setup((progress) => progress.completeSection('binding', 'interpolation'));

    expect(root.querySelector('[data-testid="badge-first-step"]')?.getAttribute('data-earned')).toBe('true');
    expect(root.querySelector('[data-testid="badge-graduate"]')?.getAttribute('data-earned')).toBe('false');
    expect(text('badge-count')).toBe('1 of 8 earned');
  });
});
