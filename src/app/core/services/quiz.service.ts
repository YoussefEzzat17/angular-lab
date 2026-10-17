import { Injectable } from '@angular/core';
import type { QuizBank, QuizAttempt, QuizQuestion, TopicId } from '../models/learning.models';
import { QUIZ_RULES } from '../models/learning.models';

// Loaders map — Phase 3 will populate these with real quiz banks.
// For now every topic returns an empty bank so the service compiles and can be tested.
const EMPTY_BANK = (id: TopicId): QuizBank => ({ topicId: id, version: 1, questions: [] });

export const QUIZ_BANK_LOADERS: Record<TopicId, () => Promise<QuizBank>> = {
  'binding':          () => Promise.resolve(EMPTY_BANK('binding')),
  'pipes':            () => Promise.resolve(EMPTY_BANK('pipes')),
  'directives':       () => Promise.resolve(EMPTY_BANK('directives')),
  'communication':    () => Promise.resolve(EMPTY_BANK('communication')),
  'forms':            () => Promise.resolve(EMPTY_BANK('forms')),
  'routing':          () => Promise.resolve(EMPTY_BANK('routing')),
  'guards':           () => Promise.resolve(EMPTY_BANK('guards')),
  'signals':          () => Promise.resolve(EMPTY_BANK('signals')),
  'rxjs':             () => Promise.resolve(EMPTY_BANK('rxjs')),
  'di':               () => Promise.resolve(EMPTY_BANK('di')),
  'movies':           () => Promise.resolve(EMPTY_BANK('movies')),
  'interceptor':      () => Promise.resolve(EMPTY_BANK('interceptor')),
  'facade':           () => Promise.resolve(EMPTY_BANK('facade')),
  'change-detection': () => Promise.resolve(EMPTY_BANK('change-detection')),
  'lazy-loading':     () => Promise.resolve(EMPTY_BANK('lazy-loading')),
};

@Injectable({ providedIn: 'root' })
export class QuizService {
  async load(topicId: TopicId): Promise<QuizBank> {
    return QUIZ_BANK_LOADERS[topicId]();
  }

  /** Draw QUIZ_RULES.draw questions randomly (Fisher-Yates). Shuffles choice order too (except true-false). */
  draw(bank: QuizBank, random = Math.random): QuizQuestion[] {
    const pool = [...bank.questions];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, QUIZ_RULES.draw).map((q) => ({
      ...q,
      choices: q.type === 'true-false' ? q.choices : this.shuffleChoices(q.choices, random),
    }));
  }

  /** Grade a set of drawn questions against user answers. */
  grade(drawn: QuizQuestion[], answers: Record<string, string[]>, topicId: TopicId, bankVersion: number): QuizAttempt {
    const correctIds: string[] = [];
    const choiceOrder: Record<string, string[]> = {};
    for (const q of drawn) {
      choiceOrder[q.id] = q.choices.map((c) => c.id);
      const userAns = new Set(answers[q.id] ?? []);
      const correctAns = new Set(q.correct);
      const isCorrect = userAns.size === correctAns.size && [...userAns].every((a) => correctAns.has(a));
      if (isCorrect) correctIds.push(q.id);
    }
    const score = correctIds.length;
    const total = drawn.length;
    const passed = score / total >= QUIZ_RULES.passRatio;
    return {
      id: crypto.randomUUID(), topicId, bankVersion,
      submittedAt: new Date().toISOString(),
      questionIds: drawn.map((q) => q.id), choiceOrder, answers,
      correctIds, score, total, passed,
    };
  }

  /** Which sections to review based on wrong answers. */
  reviewSections(drawn: QuizQuestion[], attempt: QuizAttempt): string[] {
    const wrong = drawn.filter((q) => !attempt.correctIds.includes(q.id));
    return [...new Set(wrong.map((q) => q.sectionId))];
  }

  private shuffleChoices<T>(arr: T[], random: () => number): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
}
