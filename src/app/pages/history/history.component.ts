import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TOPICS } from '../../core/data/topics';
import {
  ACTIVITY_LIMIT,
  ActivityKindFilter,
  HISTORY_PAGE_SIZE,
  KIND_FILTERS,
  activityIcon,
  activityLabel,
  activityLink,
  filterActivity,
  groupActivityByDay,
  scoreText,
  sectionTitleOf,
  timeLabel,
  topicTitleOf,
} from '../../core/services/activity-history';
import { CLOCK } from '../../core/services/clock';
import { LearningFacade } from '../../core/services/learning.facade';
import type { TopicId } from '../../core/models/learning.models';
import { EmptyStateComponent } from '../../shared/empty-state.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterLink, EmptyStateComponent],
  template: `
    <section class="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <a routerLink="/dashboard" class="text-sm font-semibold text-gold-400 hover:text-gold-300">← Back to dashboard</a>
      <h1 class="mt-3 text-3xl font-bold text-stone-100">History</h1>
      <p class="mt-2 text-sm text-stone-400">
        Everything you have done, newest first. The last {{ limit }} activities are kept on this device.
      </p>

      @if (total() === 0) {
        <app-empty-state
          class="mt-8"
          icon="🕑"
          heading="No history yet"
          message="Finish a section or take a quiz and it will show up here."
          ctaLabel="Start learning →"
          ctaLink="/learn"
        />
      } @else {
        <div class="mt-6 flex flex-wrap items-center gap-2" role="group" aria-label="Filter by activity type">
          @for (f of kinds; track f.id) {
            <button
              type="button"
              [attr.data-testid]="'kind-' + f.id"
              [attr.aria-pressed]="kind() === f.id"
              (click)="setKind(f.id)"
              class="min-h-11 rounded-full border px-4 text-sm font-semibold transition"
              [class]="
                kind() === f.id ? 'border-gold-400 bg-gold-500/15 text-gold-300' : 'border-stone-700 text-stone-300 hover:bg-stone-800'
              "
            >
              {{ f.label }}
            </button>
          }
          <label class="ml-auto flex items-center gap-2 text-sm text-stone-400">
            <span class="sr-only sm:not-sr-only">Topic</span>
            <select
              data-testid="topic-filter"
              [value]="topic()"
              (change)="setTopic($event)"
              class="min-h-11 rounded-xl border border-stone-700 bg-stone-900 px-3 text-sm text-stone-100 focus:border-gold-400 focus:outline-none"
            >
              <option value="all">All topics</option>
              @for (t of topics; track t.id) {
                <option [value]="t.id">{{ t.title }}</option>
              }
            </select>
          </label>
        </div>

        <p class="mt-4 text-xs text-stone-500" data-testid="history-count" aria-live="polite">
          Showing {{ visibleCount() }} of {{ filteredCount() }}
          {{ filteredCount() === 1 ? 'activity' : 'activities' }}
        </p>

        @for (group of groups(); track group.key) {
          <h2 class="mt-6 text-sm font-bold uppercase tracking-wider text-stone-400" [attr.data-testid]="'day-' + group.key">{{ group.label }}</h2>
          <ul class="mt-2 space-y-2">
            @for (entry of group.entries; track entry.at + entry.kind + entry.topicId + (entry.sectionId ?? '')) {
              <li>
                <a
                  [routerLink]="linkOf(entry)"
                  data-testid="history-entry"
                  class="flex items-center gap-3 rounded-xl border border-stone-800 bg-stone-900 px-4 py-3 text-sm transition hover:border-stone-700 hover:bg-stone-800/60"
                >
                  <span class="text-lg" aria-hidden="true">{{ iconOf(entry.kind) }}</span>
                  <span class="min-w-0 flex-1 text-stone-300">
                    {{ labelOf(entry.kind) }}<span class="font-semibold text-stone-100">{{ topicOf(entry.topicId) }}</span>
                    @if (sectionOf(entry.topicId, entry.sectionId); as section) {
                      <span class="text-stone-500"> · {{ section }}</span>
                    }
                    @if (scoreOf(entry); as score) {
                      <span class="text-stone-500"> · {{ score }}</span>
                    }
                  </span>
                  <span class="shrink-0 text-xs text-stone-500">{{ timeOf(entry.at) }}</span>
                </a>
              </li>
            }
          </ul>
        } @empty {
          <app-empty-state
            class="mt-8"
            icon="🔎"
            heading="Nothing matches these filters"
            message="Try a different activity type or topic."
          />
        }

        @if (remaining() > 0) {
          <div class="mt-6 text-center">
            <button
              type="button"
              data-testid="show-more"
              (click)="showMore()"
              class="min-h-11 rounded-xl border border-stone-600 px-5 text-sm font-semibold text-stone-200 hover:bg-stone-800"
            >
              Show {{ nextBatch() }} more ({{ remaining() }} left)
            </button>
          </div>
        }
      }
    </section>
  `,
})
export class HistoryComponent {
  private readonly facade = inject(LearningFacade);
  private readonly clock = inject(CLOCK);

  readonly limit = ACTIVITY_LIMIT;
  readonly kinds = KIND_FILTERS;
  readonly topics = TOPICS;

  readonly kind = signal<ActivityKindFilter>('all');
  readonly topic = signal<TopicId | 'all'>('all');
  private readonly shown = signal(HISTORY_PAGE_SIZE);

  readonly total = computed(() => this.facade.allActivity().length);
  private readonly filtered = computed(() =>
    filterActivity(this.facade.allActivity(), { kind: this.kind(), topicId: this.topic() }),
  );
  readonly filteredCount = computed(() => this.filtered().length);
  private readonly visible = computed(() => this.filtered().slice(0, this.shown()));
  readonly visibleCount = computed(() => this.visible().length);
  readonly groups = computed(() => groupActivityByDay(this.visible(), this.clock.now()));
  readonly remaining = computed(() => this.filteredCount() - this.visibleCount());
  readonly nextBatch = computed(() => Math.min(HISTORY_PAGE_SIZE, this.remaining()));

  readonly labelOf = activityLabel;
  readonly iconOf = activityIcon;
  readonly topicOf = topicTitleOf;
  readonly sectionOf = sectionTitleOf;
  readonly scoreOf = scoreText;
  readonly linkOf = activityLink;
  readonly timeOf = timeLabel;

  setKind(kind: ActivityKindFilter): void {
    this.kind.set(kind);
    this.shown.set(HISTORY_PAGE_SIZE);
  }

  setTopic(event: Event): void {
    this.topic.set((event.target as HTMLSelectElement).value as TopicId | 'all');
    this.shown.set(HISTORY_PAGE_SIZE);
  }

  showMore(): void {
    this.shown.update((n) => n + HISTORY_PAGE_SIZE);
  }
}
