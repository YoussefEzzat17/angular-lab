import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LEVEL_LABEL } from '../../core/data/topics';
import { GamificationService } from '../../core/services/gamification.service';
import { LearningFacade } from '../../core/services/learning.facade';
import type { TopicStatus } from '../../core/models/learning.models';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <p class="text-xs font-bold uppercase tracking-widest text-gold-400">Your journey</p>
      <h1 class="mt-2 text-3xl font-bold text-stone-100">From Newcomer to Angular Wizard</h1>
      <p class="mt-2 text-sm text-stone-400">
        Finish sections to earn 10 XP each, pass a topic quiz for 50 XP, and score 100% for a 25 XP bonus. Follow the path from the top.
      </p>

      <!-- Level -->
      <div class="mt-6 rounded-2xl border border-gold-500/30 bg-gold-950/20 p-5">
        <div class="flex flex-wrap items-baseline justify-between gap-2">
          <p class="text-lg font-bold text-stone-100">
            Level {{ game.level().level.number }} · <span data-testid="level-title" class="text-gold-300">{{ game.level().level.title }}</span>
          </p>
          <p class="text-sm text-stone-400" data-testid="xp-text">{{ xpText() }}</p>
        </div>
        <div
          class="mt-3 h-3 overflow-hidden rounded-full bg-stone-800"
          role="progressbar"
          aria-label="Progress to the next level"
          aria-valuemin="0"
          aria-valuemax="100"
          [attr.aria-valuenow]="game.level().percent"
        >
          <div class="h-full rounded-full bg-gold-400 transition-[width] duration-500 motion-reduce:transition-none" [style.width.%]="game.level().percent"></div>
        </div>
      </div>

      <!-- Worlds and nodes -->
      @for (group of worlds(); track group.id; let w = $index) {
        <div class="mt-10">
          <div class="flex items-baseline justify-between gap-3">
            <h2 class="text-sm font-bold uppercase tracking-wider text-stone-300">World {{ w + 1 }} · {{ group.title }}</h2>
            <span class="text-xs font-semibold text-stone-500">{{ group.completedCount }}/{{ group.topics.length }} complete</span>
          </div>
          <p class="mt-1 text-xs text-stone-500">{{ group.blurb }}</p>

          <ol class="relative mt-4 space-y-4 border-l-2 border-stone-800 pl-6">
            @for (topic of group.topics; track topic.id; let i = $index) {
              <li class="relative" [class]="i % 2 === 1 ? 'sm:ml-10' : ''">
                <span
                  class="absolute -left-[2.15rem] top-4 grid h-6 w-6 place-items-center rounded-full border-2 bg-stone-950 text-xs font-bold"
                  [class]="nodeClass(topic.status, topic.id === nextTopicId())"
                  aria-hidden="true"
                >
                  {{ statusMark(topic.status) }}
                </span>
                <a
                  [routerLink]="topic.path"
                  [attr.data-testid]="'journey-node-' + topic.id"
                  class="flex items-center gap-3 rounded-2xl border bg-stone-900 p-4 transition hover:bg-stone-800/70"
                  [class]="topic.id === nextTopicId() ? 'border-gold-400/60' : 'border-stone-800'"
                >
                  <span class="text-2xl" aria-hidden="true">{{ topic.icon }}</span>
                  <span class="min-w-0 flex-1">
                    <span class="block font-semibold text-stone-100">{{ topic.title }}</span>
                    <span class="block truncate text-xs text-stone-500">{{ levelLabel[topic.level] }} · {{ statusText(topic.status) }}</span>
                  </span>
                  @if (topic.id === nextTopicId()) {
                    <span class="shrink-0 rounded-full bg-gold-500/20 px-2.5 py-1 text-xs font-bold text-gold-300">You are here</span>
                  } @else if (game.xpForTopic(topic.id) > 0) {
                    <span class="shrink-0 text-xs font-bold text-emerald-300">+{{ game.xpForTopic(topic.id) }} XP</span>
                  }
                </a>
              </li>
            }
          </ol>
        </div>
      }

      <!-- Badges -->
      <div class="mt-12">
        <div class="flex items-baseline justify-between gap-3">
          <h2 class="text-lg font-bold text-stone-100">Badges</h2>
          <span class="text-sm text-stone-400" data-testid="badge-count">{{ game.earnedCount() }} of {{ game.badges().length }} earned</span>
        </div>
        <ul class="mt-4 grid gap-3 sm:grid-cols-2">
          @for (badge of game.badges(); track badge.id) {
            <li
              class="flex items-center gap-3 rounded-2xl border p-4"
              [attr.data-testid]="'badge-' + badge.id"
              [attr.data-earned]="badge.isEarned"
              [class]="badge.isEarned ? 'border-gold-500/40 bg-gold-950/20' : 'border-stone-800 bg-stone-900 opacity-60'"
            >
              <span class="text-3xl" [class.grayscale]="!badge.isEarned" aria-hidden="true">{{ badge.icon }}</span>
              <span class="min-w-0">
                <span class="block font-semibold text-stone-100">{{ badge.title }}</span>
                <span class="block text-xs text-stone-400">{{ badge.description }}</span>
                <span class="mt-1 block text-xs font-bold" [class]="badge.isEarned ? 'text-emerald-300' : 'text-stone-500'">
                  {{ badge.isEarned ? '✓ Earned' : '🔒 Locked' }}
                </span>
              </span>
            </li>
          }
        </ul>
      </div>
    </section>
  `,
})
export class JourneyComponent {
  private readonly facade = inject(LearningFacade);
  readonly game = inject(GamificationService);

  readonly levelLabel = LEVEL_LABEL;
  readonly worlds = this.facade.groups;

  /** The first topic that is not complete yet: where the learner should go next. */
  readonly nextTopicId = computed(() => this.worlds().flatMap((g) => g.topics).find((t) => t.status !== 'completed')?.id);

  readonly xpText = computed(() => {
    const { next, xp, xpIntoLevel, xpForLevel } = this.game.level();
    return next ? `${xp} XP · ${xpIntoLevel}/${xpForLevel} to level ${next.number}` : `${xp} XP · top level reached`;
  });

  statusMark(status: TopicStatus): string {
    return status === 'completed' ? '✓' : status === 'in-progress' ? '◐' : '';
  }

  statusText(status: TopicStatus): string {
    return status === 'completed' ? 'Completed' : status === 'in-progress' ? 'In progress' : 'Not started';
  }

  nodeClass(status: TopicStatus, isNext: boolean): string {
    if (status === 'completed') {
      return 'border-emerald-400 text-emerald-300';
    }
    if (status === 'in-progress') {
      return 'border-gold-400 text-gold-300';
    }
    return isNext ? 'border-gold-400 motion-safe:animate-pulse' : 'border-stone-700';
  }
}
