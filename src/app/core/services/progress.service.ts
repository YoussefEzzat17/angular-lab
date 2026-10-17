import { Injectable, computed, signal } from '@angular/core';
import { TOPICS } from '../data/topics';
import type { TopicId, TopicProgress, ProgressStateV2, QuizAttempt, ActivityEntry, TopicStatus } from '../models/learning.models';
import { readStored, writeStored } from './safe-storage';
import { migrateProgress } from './progress-migration';

const PROGRESS_KEY = 'angular-lab:progress';

@Injectable({ providedIn: 'root' })
export class ProgressService {
  private readonly state = signal<ProgressStateV2>(this.load());

  readonly totalCount = TOPICS.length;
  readonly completedCount = computed(() =>
    Object.values(this.state().topics).filter((t) => t?.completedAt).length
  );
  readonly percent = computed(() =>
    Math.round((this.completedCount() / this.totalCount) * 100)
  );
  readonly recentActivity = computed(() => this.state().activity.slice(-10).reverse());

  status(id: TopicId): TopicStatus {
    const t = this.state().topics[id];
    if (!t) return 'not-started';
    if (t.completedAt) return 'completed';
    if (t.sectionsDone.length > 0 || t.firstVisitedAt) return 'in-progress';
    return 'not-started';
  }

  isCompleted(path: string): boolean {
    const topic = TOPICS.find((t) => t.legacyPath === path || t.path === path);
    if (!topic) return false;
    return this.status(topic.id) === 'completed';
  }

  isVisited(path: string): boolean {
    const topic = TOPICS.find((t) => t.legacyPath === path || t.path === path);
    if (!topic) return false;
    const t = this.state().topics[topic.id];
    return !!t?.firstVisitedAt;
  }

  isSectionDone(topicId: TopicId, sectionId: string): boolean {
    return this.state().topics[topicId]?.sectionsDone.includes(sectionId) ?? false;
  }

  allSectionsDone(topicId: TopicId): boolean {
    const topic = TOPICS.find((t) => t.id === topicId);
    if (!topic) return false;
    const done = this.state().topics[topicId]?.sectionsDone ?? [];
    return topic.sections.every((s) => done.includes(s.id));
  }

  firstIncompleteSection(topicId: TopicId): string | null {
    const topic = TOPICS.find((t) => t.id === topicId);
    if (!topic) return null;
    const done = this.state().topics[topicId]?.sectionsDone ?? [];
    return topic.sections.find((s) => !done.includes(s.id))?.id ?? null;
  }

  getLastSection(topicId: TopicId): string | undefined {
    return this.state().topics[topicId]?.lastSectionId;
  }

  getBestScore(topicId: TopicId): number | undefined {
    return this.state().topics[topicId]?.bestScore;
  }

  getAttempts(topicId: TopicId): QuizAttempt[] {
    return this.state().topics[topicId]?.attempts ?? [];
  }

  markVisited(topicId: TopicId): void {
    this.patch(topicId, (t) => {
      if (t.firstVisitedAt) return t;
      return { ...t, firstVisitedAt: new Date().toISOString(), lastVisitedAt: new Date().toISOString() };
    });
  }

  setLastSection(topicId: TopicId, sectionId: string): void {
    this.patch(topicId, (t) => ({ ...t, lastSectionId: sectionId, lastVisitedAt: new Date().toISOString() }));
  }

  completeSection(topicId: TopicId, sectionId: string): void {
    this.patch(topicId, (t) => {
      if (t.sectionsDone.includes(sectionId)) return t;
      const sectionsDone = [...t.sectionsDone, sectionId];
      return { ...t, sectionsDone, lastVisitedAt: new Date().toISOString() };
    });
    this.addActivity({ kind: 'section-done', topicId, sectionId, at: new Date().toISOString() });
  }

  /**
   * Manual "Mark as Complete" toggle used by the existing topic pages until the quiz gate ships.
   * It sets or clears completedAt only; completedVia stays unset, so it is never mistaken for a quiz pass.
   */
  toggleManualComplete(topicId: TopicId): void {
    this.patch(topicId, (t) => {
      if (t.completedAt) {
        return { ...t, completedAt: undefined, completedVia: undefined };
      }
      return { ...t, completedAt: new Date().toISOString() };
    });
  }

  recordQuizAttempt(attempt: QuizAttempt): void {
    this.patch(attempt.topicId, (t) => {
      const attempts = [...t.attempts, attempt].slice(-5);
      const bestScore = Math.max(t.bestScore ?? 0, attempt.score);
      const completedAt = attempt.passed ? (t.completedAt ?? new Date().toISOString()) : t.completedAt;
      const completedVia = attempt.passed ? (t.completedVia ?? 'quiz') : t.completedVia;
      return { ...t, attempts, bestScore, completedAt, completedVia };
    });
    this.addActivity({
      kind: attempt.passed ? 'quiz-passed' : 'quiz-failed',
      topicId: attempt.topicId, score: attempt.score, at: attempt.submittedAt,
    });
  }

  reset(): void {
    const fresh: ProgressStateV2 = { version: 2, topics: {}, activity: [] };
    this.state.set(fresh);
    writeStored(PROGRESS_KEY, fresh);
  }

  private patch(topicId: TopicId, fn: (t: TopicProgress) => TopicProgress): void {
    this.state.update((s) => {
      const existing: TopicProgress = s.topics[topicId] ?? { sectionsDone: [], attempts: [] };
      const next = { ...s, topics: { ...s.topics, [topicId]: fn(existing) } };
      writeStored(PROGRESS_KEY, next);
      return next;
    });
  }

  private addActivity(entry: Omit<ActivityEntry, 'at'> & { at: string }): void {
    this.state.update((s) => {
      const activity = [...s.activity, entry as ActivityEntry].slice(-30);
      const next = { ...s, activity };
      writeStored(PROGRESS_KEY, next);
      return next;
    });
  }

  private load(): ProgressStateV2 {
    const stored = readStored<unknown>(PROGRESS_KEY, null);
    if (stored && typeof stored === 'object' && (stored as { version?: unknown }).version === 2) {
      return stored as ProgressStateV2;
    }
    // Attempt migration from old keys
    const migrated = migrateProgress();
    writeStored(PROGRESS_KEY, migrated);
    return migrated;
  }
}
