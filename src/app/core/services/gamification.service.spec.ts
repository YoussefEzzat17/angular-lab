import { TestBed } from '@angular/core/testing';

import type { QuizAttempt, TopicId } from '../models/learning.models';
import { FIRE_CONFETTI, GamificationService } from './gamification.service';
import { ProgressService } from './progress.service';
import { ToastService } from './toast.service';

function attempt(topicId: TopicId, score: number): QuizAttempt {
  return {
    id: `a-${topicId}`, topicId, bankVersion: 1, submittedAt: new Date().toISOString(),
    questionIds: [], choiceOrder: {}, answers: {}, correctIds: [], score, total: 6, passed: score >= 5,
  };
}

describe('GamificationService', () => {
  let confetti: jasmine.Spy;
  let progress: ProgressService;
  let service: GamificationService;
  let toast: ToastService;

  const setup = (seed?: () => void) => {
    localStorage.clear();
    confetti = jasmine.createSpy('confetti');
    TestBed.configureTestingModule({ providers: [{ provide: FIRE_CONFETTI, useValue: confetti }] });
    progress = TestBed.inject(ProgressService);
    seed?.();
    toast = TestBed.inject(ToastService);
    service = TestBed.inject(GamificationService);
    TestBed.tick();
  };
  const titles = () => toast.toasts().map((t) => t.title);

  afterEach(() => localStorage.clear());

  it('starts at level 1 with no XP and no badges', () => {
    setup();

    expect(service.xp()).toBe(0);
    expect(service.level().level.number).toBe(1);
    expect(service.earnedCount()).toBe(0);
  });

  it('does not celebrate progress that already existed when the app started', () => {
    setup(() => progress.completeSection('binding', 'interpolation'));

    expect(service.badges().find((b) => b.id === 'first-step')?.isEarned).toBeTrue();
    expect(titles()).toEqual([]);
    expect(confetti).not.toHaveBeenCalled();
  });

  it('celebrates a newly earned badge with a toast and confetti', () => {
    setup();

    progress.completeSection('binding', 'interpolation');
    TestBed.tick();

    expect(titles()).toContain('👣 Badge unlocked: First Step');
    expect(confetti).toHaveBeenCalledTimes(1);
  });

  it('adds XP for sections and quiz passes', () => {
    setup();

    progress.completeSection('binding', 'a');
    progress.completeSection('binding', 'b');
    progress.recordQuizAttempt(attempt('binding', 5));

    expect(service.xp()).toBe(2 * 10 + 50);
    expect(service.xpForTopic('binding')).toBe(70);
    expect(service.xpForTopic('pipes')).toBe(0);
  });

  it('announces a level up once, when the XP crosses the threshold', () => {
    setup();

    for (let i = 0; i < 10; i++) {
      progress.completeSection('binding', `s-${i}`);
    }
    TestBed.tick();

    expect(service.level().level.number).toBe(2);
    expect(titles()).toContain('⬆️ Level up!');
  });

  it('does not repeat a celebration after the same state is evaluated again', () => {
    setup();
    progress.completeSection('binding', 'interpolation');
    TestBed.tick();
    const before = toast.toasts().length;

    progress.completeSection('binding', 'interpolation');
    TestBed.tick();

    expect(toast.toasts().length).toBe(before);
    expect(confetti).toHaveBeenCalledTimes(1);
  });
});
