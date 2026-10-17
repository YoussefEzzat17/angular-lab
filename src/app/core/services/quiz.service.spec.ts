import { TestBed } from '@angular/core/testing';

import type { QuizBank, QuizQuestion } from '../models/learning.models';
import { QuizService } from './quiz.service';

function makeQuestion(i: number, sectionId = `sec-${i % 3}`): QuizQuestion {
  return {
    id: `t-${String(i).padStart(2, '0')}`,
    type: 'single',
    prompt: `Question ${i}`,
    choices: [
      { id: 'a', text: 'A' },
      { id: 'b', text: 'B' },
      { id: 'c', text: 'C' },
    ],
    correct: ['a'],
    explanation: 'because',
    sectionId,
  };
}

function makeBank(count: number): QuizBank {
  return { topicId: 'binding', version: 1, questions: Array.from({ length: count }, (_, i) => makeQuestion(i + 1)) };
}

/** Deterministic PRNG (mulberry32) so draws are repeatable in tests. */
function seeded(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

describe('QuizService', () => {
  let service: QuizService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuizService);
  });

  it('draw() returns at most 6 questions', () => {
    expect(service.draw(makeBank(12)).length).toBe(6);
    expect(service.draw(makeBank(4)).length).toBe(4);
  });

  it('draw() with a seeded random is deterministic', () => {
    const bank = makeBank(12);
    const first = service.draw(bank, seeded(42)).map((q) => q.id);
    const second = service.draw(bank, seeded(42)).map((q) => q.id);
    expect(first).toEqual(second);
  });

  it('grade() with all answers correct passes with score === total', () => {
    const drawn = service.draw(makeBank(6), seeded(1));
    const answers = Object.fromEntries(drawn.map((q) => [q.id, ['a']]));
    const attempt = service.grade(drawn, answers, 'binding', 1);

    expect(attempt.score).toBe(attempt.total);
    expect(attempt.passed).toBeTrue();
  });

  it('grade() with 4 of 6 correct does not pass (66.7% < 75%)', () => {
    const drawn = service.draw(makeBank(6), seeded(2));
    const answers = Object.fromEntries(drawn.map((q, i) => [q.id, [i < 4 ? 'a' : 'b']]));
    const attempt = service.grade(drawn, answers, 'binding', 1);

    expect(attempt.score).toBe(4);
    expect(attempt.passed).toBeFalse();
  });

  it('grade() with 5 of 6 correct passes (83.3% >= 75%)', () => {
    const drawn = service.draw(makeBank(6), seeded(3));
    const answers = Object.fromEntries(drawn.map((q, i) => [q.id, [i < 5 ? 'a' : 'b']]));
    const attempt = service.grade(drawn, answers, 'binding', 1);

    expect(attempt.score).toBe(5);
    expect(attempt.passed).toBeTrue();
  });

  it('reviewSections() returns unique section ids of the wrong answers', () => {
    const drawn = [
      makeQuestion(1, 'interpolation'),
      makeQuestion(2, 'interpolation'),
      makeQuestion(3, 'event-binding'),
      makeQuestion(4, 'two-way'),
    ];
    const answers = { 't-01': ['b'], 't-02': ['b'], 't-03': ['b'], 't-04': ['a'] };
    const attempt = service.grade(drawn, answers, 'binding', 1);

    expect(service.reviewSections(drawn, attempt)).toEqual(['interpolation', 'event-binding']);
  });
});
