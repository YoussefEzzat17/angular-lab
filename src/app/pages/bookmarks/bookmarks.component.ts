import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BookmarkService } from '../../core/services/bookmark.service';
import { TOPICS } from '../../core/data/topics';
import type { TopicId } from '../../core/models/learning.models';

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <p class="text-sm font-semibold text-gold-400">MY BOOKMARKS</p>
      <h1 class="mt-1 text-3xl font-bold">Saved Sections</h1>
      <p class="mt-2 text-stone-400">{{ bookmarks.count() }} saved</p>

      @if (groupedBookmarks().length) {
        <div class="mt-8 space-y-8">
          @for (group of groupedBookmarks(); track group.topicId) {
            <div>
              <div class="flex items-center gap-2">
                <span class="text-xl">{{ group.topicIcon }}</span>
                <h2 class="font-bold text-stone-100">{{ group.topicTitle }}</h2>
              </div>
              <div class="mt-3 space-y-2">
                @for (item of group.sections; track item.sectionId) {
                  <div class="flex items-center gap-3 rounded-xl border border-stone-800 bg-stone-900 px-4 py-3">
                    <a [routerLink]="['/learn', group.topicId, item.sectionId]"
                       class="flex-1 text-sm font-semibold text-stone-200 transition hover:text-gold-300">
                      🔖 {{ item.sectionTitle }}
                    </a>
                    <button
                      type="button"
                      (click)="remove(group.topicId, item.sectionId)"
                      aria-label="Remove bookmark"
                      class="text-xs text-stone-500 transition hover:text-rose-400"
                    >✕</button>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      } @else {
        <div class="mt-10 rounded-3xl border border-stone-800 bg-stone-900 p-10 text-center">
          <p class="text-4xl">🔖</p>
          <h2 class="mt-3 text-xl font-bold">No bookmarks yet</h2>
          <p class="mt-2 text-stone-400">Tap the bookmark icon on any section to save it here.</p>
          <a routerLink="/learn" class="mt-6 inline-block rounded-xl bg-gold-500 px-5 py-3 font-semibold text-white transition hover:bg-gold-400">
            Start learning →
          </a>
        </div>
      }
    </section>
  `,
})
export class BookmarksComponent {
  readonly bookmarks = inject(BookmarkService);

  readonly groupedBookmarks = computed(() => {
    const items = this.bookmarks.all();
    const byTopic = new Map<TopicId, typeof items>();
    for (const item of items) {
      const list = byTopic.get(item.topicId) ?? [];
      list.push(item);
      byTopic.set(item.topicId, list);
    }
    return [...byTopic.entries()].map(([topicId, bms]) => {
      const topic = TOPICS.find((t) => t.id === topicId);
      return {
        topicId,
        topicTitle: topic?.title ?? topicId,
        topicIcon: topic?.icon ?? '📌',
        sections: bms.map((b) => ({
          sectionId: b.sectionId,
          sectionTitle: topic?.sections.find((s) => s.id === b.sectionId)?.title ?? b.sectionId,
        })),
      };
    });
  });

  remove(topicId: TopicId, sectionId: string): void {
    this.bookmarks.remove(topicId, sectionId);
  }
}
