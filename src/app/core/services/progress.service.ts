import { Injectable, computed, signal } from '@angular/core';
import { TOPICS } from '../data/topics';
import type { TopicId, TopicProgress, ProgressStateV2, QuizAttempt, ActivityEntry, TopicStatus } from '../models/learning.models';
import { ACTIVITY_LIMIT, PREVIEW_SIZE } from './activity-history';
import { readStored, writeStored } from './safe-storage';
import { migrateProgress } from './progress-migration';

const PROGRESS_KEY = 'angular-lab:progress';

@Injectable({ providedIn: 'root' })
export class ProgressService {
  private readonly state = signal<ProgressStateV2>(this.load());

  /** Read-only view of every topic's saved progress (used to work out XP and badges). */
  readonly topics = computed(() => this.state().topics);
  readonly totalCount = TOPICS.length;
  readonly completedCount = computed(() =>
    Object.values(this.state().topics).filter((t) => t?.completedAt).length
  );
  readonly percent = computed(() =>
    Math.round((this.completedCount() / this.totalCount) * 100)
  );
  /** The newest few entries, newest first — for the dashboard preview. */
  readonly recentActivity = computed(() => this.state().activity.slice(-PREVIEW_SIZE).reverse());
  /** Every stored entry (up to ACTIVITY_LIMIT), newest first — for the history page. */
  readonly allActivity = computed(() => [...this.state().activity].reverse());

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
    let wasNew = false;
    this.patch(topicId, (t) => {
      if (t.sectionsDone.includes(sectionId)) return t;
      wasNew = true;
      const sectionsDone = [...t.sectionsDone, sectionId];
      return { ...t, sectionsDone, lastVisitedAt: new Date().toISOString() };
    });
    if (wasNew) {
      this.addActivity({ kind: 'section-done', topicId, sectionId, at: new Date().toISOString() });
    }
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
    const activityEntry: ActivityEntry = {
      kind: attempt.passed ? 'quiz-passed' : 'quiz-failed',
      topicId: attempt.topicId, score: attempt.score, at: attempt.submittedAt,
    };
    let next: ProgressStateV2 | undefined;
    this.state.update((s) => {
      const t = s.topics[attempt.topicId] ?? { sectionsDone: [], attempts: [] };
      const attempts = [...t.attempts, attempt].slice(-5);
      const bestScore = Math.max(t.bestScore ?? 0, attempt.score);
      const completedAt = attempt.passed ? (t.completedAt ?? new Date().toISOString()) : t.completedAt;
      const completedVia = attempt.passed ? (t.completedVia ?? 'quiz') : t.completedVia;
      const updatedTopic: TopicProgress = { ...t, attempts, bestScore, completedAt, completedVia };
      const activity = [...s.activity, activityEntry].slice(-ACTIVITY_LIMIT);
      next = { ...s, topics: { ...s.topics, [attempt.topicId]: updatedTopic }, activity };
      return next;
    });
    if (next) writeStored(PROGRESS_KEY, next);
  }

  reset(): void {
    const fresh: ProgressStateV2 = { version: 2, topics: {}, activity: [] };
    this.state.set(fresh);
    writeStored(PROGRESS_KEY, fresh);
  }

  private patch(topicId: TopicId, fn: (t: TopicProgress) => TopicProgress): void {
    let next: ProgressStateV2 | undefined;
    this.state.update((s) => {
      const existing: TopicProgress = s.topics[topicId] ?? { sectionsDone: [], attempts: [] };
      next = { ...s, topics: { ...s.topics, [topicId]: fn(existing) } };
      return next;
    });
    if (next) writeStored(PROGRESS_KEY, next);
  }

  private addActivity(entry: Omit<ActivityEntry, 'at'> & { at: string }): void {
    let next: ProgressStateV2 | undefined;
    this.state.update((s) => {
      const activity = [...s.activity, entry as ActivityEntry].slice(-ACTIVITY_LIMIT);
      next = { ...s, activity };
      return next;
    });
    if (next) writeStored(PROGRESS_KEY, next);
  }

  private load(): ProgressStateV2 {
    const stored = readStored<unknown>(PROGRESS_KEY, null);
    if (
      stored &&
      typeof stored === 'object' &&
      (stored as { version?: unknown }).version === 2 &&
      typeof (stored as { topics?: unknown }).topics === 'object' &&
      (stored as { topics: unknown }).topics !== null &&
      Array.isArray((stored as { activity?: unknown }).activity)
    ) {
      return stored as ProgressStateV2;
    }
    // Attempt migration from old keys
    const migrated = migrateProgress();
    writeStored(PROGRESS_KEY, migrated);
    return migrated;
  }
}
