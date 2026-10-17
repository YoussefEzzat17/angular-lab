import { TestBed } from '@angular/core/testing';

import { TOPICS } from '../data/topics';
import type { QuizAttempt, TopicId } from '../models/learning.models';
import { ProgressService } from './progress.service';

function attempt(topicId: TopicId, passed: boolean, score = passed ? 5 : 4): QuizAttempt {
  return {
    id: `a-${Math.random()}`, topicId, bankVersion: 1, submittedAt: new Date().toISOString(),
    questionIds: [], choiceOrder: {}, answers: {}, correctIds: [], score, total: 6, passed,
  };
}

describe('ProgressService (v2)', () => {
  let service: ProgressService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgressService);
  });

  it('status() returns not-started for an unknown id', () => {
    expect(service.status('nope' as TopicId)).toBe('not-started');
    expect(service.status('binding')).toBe('not-started');
  });

  it('completeSection() adds the section to sectionsDone and is idempotent', () => {
    service.completeSection('binding', 'interpolation');
    service.completeSection('binding', 'interpolation');

    expect(service.isSectionDone('binding', 'interpolation')).toBeTrue();
    expect(service.status('binding')).toBe('in-progress');
    expect(service.recentActivity().filter((a) => a.kind === 'section-done').length).toBe(2);
  });

  it('allSectionsDone() is true only when every section is done', () => {
    const topic = TOPICS.find((t) => t.id === 'binding')!;
    expect(service.allSectionsDone('binding')).toBeFalse();

    for (const s of topic.sections.slice(0, -1)) service.completeSection('binding', s.id);
    expect(service.allSectionsDone('binding')).toBeFalse();

    service.completeSection('binding', topic.sections[topic.sections.length - 1].id);
    expect(service.allSectionsDone('binding')).toBeTrue();
  });

  it('recordQuizAttempt() with passed=true sets completedAt and completedVia=quiz', () => {
    service.recordQuizAttempt(attempt('pipes', true));

    expect(service.status('pipes')).toBe('completed');
    expect(service.isCompleted('/pipes')).toBeTrue();
    expect(service.isCompleted('/learn/pipes')).toBeTrue();
    expect(service.completedCount()).toBe(1);
    expect(service.getBestScore('pipes')).toBe(5);
  });

  it('recordQuizAttempt() with passed=false does NOT set completedAt', () => {
    service.recordQuizAttempt(attempt('pipes', false));

    expect(service.status('pipes')).not.toBe('completed');
    expect(service.isCompleted('/pipes')).toBeFalse();
    expect(service.completedCount()).toBe(0);
    expect(service.getAttempts('pipes').length).toBe(1);
  });

  it('a failed attempt does not clear an existing completedAt', () => {
    service.recordQuizAttempt(attempt('pipes', true));
    service.recordQuizAttempt(attempt('pipes', false));

    expect(service.status('pipes')).toBe('completed');
    expect(service.completedCount()).toBe(1);
  });

  it('keeps only the last 5 attempts per topic', () => {
    for (let i = 0; i < 7; i++) service.recordQuizAttempt(attempt('rxjs', false));
    expect(service.getAttempts('rxjs').length).toBe(5);
  });

  it('toggleManualComplete() sets and clears completedAt without a quiz', () => {
    service.toggleManualComplete('di');
    expect(service.status('di')).toBe('completed');

    service.toggleManualComplete('di');
    expect(service.status('di')).not.toBe('completed');
    expect(service.completedCount()).toBe(0);
  });

  it('isVisited() is true after markVisited() and matches both legacy and new paths', () => {
    service.markVisited('signals');
    expect(service.isVisited('/signals')).toBeTrue();
    expect(service.isVisited('/learn/signals')).toBeTrue();
    expect(service.isVisited('/rxjs')).toBeFalse();
  });

  it('persists v2 state across a fresh service instance', () => {
    service.markVisited('signals');
    service.completeSection('signals', 'basics');

    const fresh = new ProgressService();

    expect(fresh.isVisited('/signals')).toBeTrue();
    expect(fresh.isSectionDone('signals', 'basics')).toBeTrue();
  });

  it('reset() clears everything', () => {
    service.markVisited('binding');
    service.completeSection('binding', 'interpolation');
    service.recordQuizAttempt(attempt('binding', true));

    service.reset();

    expect(service.completedCount()).toBe(0);
    expect(service.percent()).toBe(0);
    expect(service.status('binding')).toBe('not-started');
    expect(service.isVisited('/binding')).toBeFalse();
    expect(service.recentActivity().length).toBe(0);
  });
});
