import { Injectable, computed, signal } from '@angular/core';

import { TOPICS } from '../data/topics';

const VISITED_KEY = 'angular-lab:visited-topics';
const COMPLETED_KEY = 'angular-lab:completed-topics';

function readStoredPaths(key: string): Set<string> {
  try {
    const raw = localStorage.getItem(key);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

/**
 * Two separate signals on purpose:
 * - "visited" is set automatically the moment a topic page loads — a light "you've been here" trail.
 * - "completed" only ever changes when the student clicks "Mark as Complete" themselves, so the
 *   progress bar reflects actual intent instead of a page that was opened and immediately left.
 */
@Injectable({ providedIn: 'root' })
export class ProgressService {
  private readonly visited = signal<Set<string>>(readStoredPaths(VISITED_KEY));
  private readonly completed = signal<Set<string>>(readStoredPaths(COMPLETED_KEY));

  readonly visitedCount = computed(() => this.visited().size);
  readonly completedCount = computed(() => this.completed().size);
  readonly totalCount = TOPICS.length;
  readonly percent = computed(() => Math.round((this.completedCount() / this.totalCount) * 100));

  isVisited(path: string): boolean {
    return this.visited().has(path);
  }

  isCompleted(path: string): boolean {
    return this.completed().has(path);
  }

  markVisited(path: string): void {
    if (this.visited().has(path)) {
      return;
    }
    const next = new Set(this.visited());
    next.add(path);
    this.visited.set(next);
    this.persist(VISITED_KEY, next);
  }

  toggleCompleted(path: string): void {
    const next = new Set(this.completed());
    if (next.has(path)) {
      next.delete(path);
    } else {
      next.add(path);
    }
    this.completed.set(next);
    this.persist(COMPLETED_KEY, next);
  }

  reset(): void {
    this.visited.set(new Set());
    this.completed.set(new Set());
    this.persist(VISITED_KEY, new Set());
    this.persist(COMPLETED_KEY, new Set());
  }

  private persist(key: string, paths: Set<string>): void {
    try {
      localStorage.setItem(key, JSON.stringify([...paths]));
    } catch {
      // localStorage unavailable (private mode, etc.) — progress just won't persist.
    }
  }
}
