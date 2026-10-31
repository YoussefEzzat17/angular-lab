import { Injectable } from '@angular/core';
import type { QuizBank, QuizAttempt, QuizQuestion, TopicId } from '../models/learning.models';
import { QUIZ_RULES } from '../models/learning.models';

export const QUIZ_BANK_LOADERS: Record<TopicId, () => Promise<QuizBank>> = {
  'binding':          () => import('../data/quizzes/binding.quiz').then((m) => m.BINDING_QUIZ),
  'pipes':            () => import('../data/quizzes/pipes.quiz').then((m) => m.PIPES_QUIZ),
  'directives':       () => import('../data/quizzes/directives.quiz').then((m) => m.DIRECTIVES_QUIZ),
  'communication':    () => import('../data/quizzes/communication.quiz').then((m) => m.COMMUNICATION_QUIZ),
  'forms':            () => import('../data/quizzes/forms.quiz').then((m) => m.FORMS_QUIZ),
  'routing':          () => import('../data/quizzes/routing.quiz').then((m) => m.ROUTING_QUIZ),
  'guards':           () => import('../data/quizzes/guards.quiz').then((m) => m.GUARDS_QUIZ),
  'signals':          () => import('../data/quizzes/signals.quiz').then((m) => m.SIGNALS_QUIZ),
  'rxjs':             () => import('../data/quizzes/rxjs.quiz').then((m) => m.RXJS_QUIZ),
  'di':               () => import('../data/quizzes/di.quiz').then((m) => m.DI_QUIZ),
  'movies':           () => import('../data/quizzes/movies.quiz').then((m) => m.MOVIES_QUIZ),
  'interceptor':      () => import('../data/quizzes/interceptor.quiz').then((m) => m.INTERCEPTOR_QUIZ),
  'facade':           () => import('../data/quizzes/facade.quiz').then((m) => m.FACADE_QUIZ),
  'change-detection': () => import('../data/quizzes/change-detection.quiz').then((m) => m.CHANGE_DETECTION_QUIZ),
  'lazy-loading':     () => import('../data/quizzes/lazy-loading.quiz').then((m) => m.LAZY_LOADING_QUIZ),
  'content-projection': () => import('../data/quizzes/content-projection.quiz').then((m) => m.CONTENT_PROJECTION_QUIZ),
  'resource':         () => import('../data/quizzes/resource.quiz').then((m) => m.RESOURCE_QUIZ),
  'defer':            () => import('../data/quizzes/defer.quiz').then((m) => m.DEFER_QUIZ),
  'getting-started':  () => import('../data/quizzes/getting-started.quiz').then((m) => m.GETTING_STARTED_QUIZ),
  'components':       () => import('../data/quizzes/components.quiz').then((m) => m.COMPONENTS_QUIZ),
  'lifecycle':        () => import('../data/quizzes/lifecycle.quiz').then((m) => m.LIFECYCLE_QUIZ),
  'template-tools':   () => import('../data/quizzes/template-tools.quiz').then((m) => m.TEMPLATE_TOOLS_QUIZ),
  'signal-forms':     () => import('../data/quizzes/signal-forms.quiz').then((m) => m.SIGNAL_FORMS_QUIZ),
  'testing':          () => import('../data/quizzes/testing.quiz').then((m) => m.TESTING_QUIZ),
  'accessibility':    () => import('../data/quizzes/accessibility.quiz').then((m) => m.ACCESSIBILITY_QUIZ),
  'security':         () => import('../data/quizzes/security.quiz').then((m) => m.SECURITY_QUIZ),
  'error-handling':   () => import('../data/quizzes/error-handling.quiz').then((m) => m.ERROR_HANDLING_QUIZ),
  'animations':       () => import('../data/quizzes/animations.quiz').then((m) => m.ANIMATIONS_QUIZ),
  'images':           () => import('../data/quizzes/images.quiz').then((m) => m.IMAGES_QUIZ),
  'dynamic-components': () => import('../data/quizzes/dynamic-components.quiz').then((m) => m.DYNAMIC_COMPONENTS_QUIZ),
  'drag-drop':        () => import('../data/quizzes/drag-drop.quiz').then((m) => m.DRAG_DROP_QUIZ),
  'i18n':             () => import('../data/quizzes/i18n.quiz').then((m) => m.I18N_QUIZ),
  'ssr':              () => import('../data/quizzes/ssr.quiz').then((m) => m.SSR_QUIZ),
  'devtools':         () => import('../data/quizzes/devtools.quiz').then((m) => m.DEVTOOLS_QUIZ),
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
