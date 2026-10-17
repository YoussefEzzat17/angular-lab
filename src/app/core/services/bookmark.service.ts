import { Injectable, computed, signal } from '@angular/core';
import { readStored, writeStored } from './safe-storage';
import type { Bookmark, TopicId } from '../models/learning.models';

const BOOKMARK_KEY = 'angular-lab:bookmarks';

@Injectable({ providedIn: 'root' })
export class BookmarkService {
  private readonly items = signal<Bookmark[]>(readStored<Bookmark[]>(BOOKMARK_KEY, []));

  readonly all = computed(() => this.items());
  readonly count = computed(() => this.items().length);

  isBookmarked(topicId: TopicId, sectionId: string): boolean {
    return this.items().some((b) => b.topicId === topicId && b.sectionId === sectionId);
  }

  toggle(topicId: TopicId, sectionId: string): void {
    this.items.update((list) => {
      const idx = list.findIndex((b) => b.topicId === topicId && b.sectionId === sectionId);
      const next = idx >= 0
        ? list.filter((_, i) => i !== idx)
        : [...list, { topicId, sectionId, at: new Date().toISOString() }];
      writeStored(BOOKMARK_KEY, next);
      return next;
    });
  }

  remove(topicId: TopicId, sectionId: string): void {
    this.items.update((list) => {
      const next = list.filter((b) => !(b.topicId === topicId && b.sectionId === sectionId));
      writeStored(BOOKMARK_KEY, next);
      return next;
    });
  }
}
