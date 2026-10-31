import { Injectable, computed, signal } from '@angular/core';
import { readStored, writeStored } from './safe-storage';
import type { Bookmark, TopicId } from '../models/learning.models';

const BOOKMARK_KEY = 'angular-lab:bookmarks';

@Injectable({ providedIn: 'root' })
export class BookmarkService {
  private readonly items = signal<Bookmark[]>(
    (() => {
      const stored = readStored<unknown>(BOOKMARK_KEY, []);
      return Array.isArray(stored) ? (stored as Bookmark[]) : [];
    })(),
  );

  readonly all = computed(() => this.items());
  readonly count = computed(() => this.items().length);

  isBookmarked(topicId: TopicId, sectionId: string): boolean {
    return this.items().some((b) => b.topicId === topicId && b.sectionId === sectionId);
  }

  toggle(topicId: TopicId, sectionId: string): void {
    const idx = this.items().findIndex((b) => b.topicId === topicId && b.sectionId === sectionId);
    const next = idx >= 0
      ? this.items().filter((_, i) => i !== idx)
      : [...this.items(), { topicId, sectionId, at: new Date().toISOString() }];
    this.items.set(next);
    writeStored(BOOKMARK_KEY, next);
  }

  remove(topicId: TopicId, sectionId: string): void {
    const next = this.items().filter((b) => !(b.topicId === topicId && b.sectionId === sectionId));
    this.items.set(next);
    writeStored(BOOKMARK_KEY, next);
  }
}
