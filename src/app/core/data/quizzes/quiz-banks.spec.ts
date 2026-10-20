import { QUIZ_BANK_LOADERS } from '../../services/quiz.service';
import { TOPICS } from '../topics';
import type { QuizBank } from '../../models/learning.models';

describe('quiz banks', () => {
  const banks: [string, QuizBank][] = [];

  beforeAll(async () => {
    for (const [topicId, load] of Object.entries(QUIZ_BANK_LOADERS)) {
      banks.push([topicId, await load()]);
    }
  });

  it('has a bank for every topic and none for a topic that does not exist', () => {
    expect(Object.keys(QUIZ_BANK_LOADERS).sort()).toEqual(TOPICS.map((t) => t.id).sort());
  });

  it('keeps each bank to 10-15 questions with unique ids', () => {
    for (const [topicId, bank] of banks) {
      expect(bank.topicId).withContext(topicId).toBe(topicId);
      expect(bank.questions.length).withContext(topicId).toBeGreaterThanOrEqual(10);
      expect(bank.questions.length).withContext(topicId).toBeLessThanOrEqual(15);
      const ids = bank.questions.map((q) => q.id);
      expect(new Set(ids).size).withContext(topicId).toBe(ids.length);
    }
  });

  it('points every question at a section that exists in its topic', () => {
    for (const [topicId, bank] of banks) {
      const sections = TOPICS.find((t) => t.id === topicId)!.sections.map((s) => s.id);
      for (const q of bank.questions) {
        expect(sections).withContext(`${q.id} → ${q.sectionId}`).toContain(q.sectionId);
      }
    }
  });

  it('only marks choices that exist as correct, and has the right number of answers for each type', () => {
    for (const [, bank] of banks) {
      for (const q of bank.questions) {
        const choiceIds = q.choices.map((c) => c.id);
        expect(new Set(choiceIds).size).withContext(q.id).toBe(choiceIds.length);
        for (const answer of q.correct) {
          expect(choiceIds).withContext(`${q.id} answer ${answer}`).toContain(answer);
        }
        if (q.type === 'multi') {
          expect(q.correct.length).withContext(q.id).toBeGreaterThanOrEqual(2);
          expect(q.correct.length).withContext(q.id).toBeLessThan(q.choices.length);
        } else {
          expect(q.correct.length).withContext(q.id).toBe(1);
        }
        if (q.type === 'true-false') {
          expect(choiceIds).withContext(q.id).toEqual(['true', 'false']);
        }
      }
    }
  });

  it('gives every question a prompt and an explanation', () => {
    for (const [, bank] of banks) {
      for (const q of bank.questions) {
        expect(q.prompt.trim().length).withContext(q.id).toBeGreaterThan(5);
        expect(q.explanation.trim().length).withContext(q.id).toBeGreaterThan(20);
      }
    }
  });
});
