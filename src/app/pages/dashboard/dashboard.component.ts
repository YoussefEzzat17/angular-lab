import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TOPICS } from '../../core/data/topics';
import { activityLabel, dayLabel, topicTitleOf } from '../../core/services/activity-history';
import { CLOCK } from '../../core/services/clock';
import { GamificationService } from '../../core/services/gamification.service';
import { LearningFacade } from '../../core/services/learning.facade';
import { ProgressService } from '../../core/services/progress.service';
import { TOPIC_STATUS_LABELS, TopicStatusIconComponent } from '../../learn/sidebar/topic-status-icon.component';
import { IconComponent, IconName } from '../../shared/icon.component';
import { GROUP_ICONS } from '../../shared/learning-icons';
import type { ActivityKind, TopicId } from '../../core/models/learning.models';

const ACTIVITY_ICONS: Record<ActivityKind, { icon: IconName; tone: string }> = {
  'section-done': { icon: 'check', tone: 'text-emerald-400' },
  'quiz-passed': { icon: 'help', tone: 'text-gold-300' },
  'quiz-failed': { icon: 'alert', tone: 'text-stone-400' },
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterLink, IconComponent, TopicStatusIconComponent],
  template: `
    <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">

      <!-- ── Hero: welcome + topic map ──────────────────────────────────── -->
      <div class="overflow-hidden rounded-3xl bg-gradient-to-br from-gold-950 via-stone-900 to-stone-950 ring-1 ring-gold-500/30">
        <div class="grid lg:grid-cols-2">

          <!-- Left: copy + stats -->
          <div class="px-6 py-10 sm:px-10 sm:py-12">
            <p class="text-xs font-bold uppercase tracking-widest text-gold-400">Dashboard</p>
            <h1 class="mt-2 text-3xl font-bold text-stone-100 sm:text-4xl">
              @if (facade.name()) {
                Welcome back, <span class="text-gold-400">{{ facade.name() }}</span> 👋
              } @else {
                Your learning<br/><span class="text-gold-400">dashboard</span>
              }
            </h1>

            @if (facade.streak() > 0) {
              <p class="mt-3 text-sm font-semibold text-gold-300">🔥 {{ facade.streak() }}-day streak!</p>
            }

            <!-- Progress bar -->
            <div class="mt-6 max-w-xs">
              <div class="flex items-center justify-between text-xs text-stone-400">
                <span>Overall progress</span>
                <span class="font-semibold text-gold-300">{{ facade.completedCount() }}/{{ facade.totalCount }}</span>
              </div>
              <div class="mt-2 h-2 w-full overflow-hidden rounded-full bg-stone-800">
                <div class="h-full rounded-full bg-gold-500 transition-all duration-700"
                     [style.width.%]="facade.percent()"></div>
              </div>
              <p class="mt-1 text-xs text-stone-500">{{ facade.percent() }}% complete</p>
            </div>

            <!-- CTA -->
            <div class="mt-7 flex flex-wrap gap-3">
              <a [routerLink]="facade.continueTarget()"
                 class="rounded-xl bg-gold-solid px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gold-solid-hover">
                {{ facade.completedCount() === 0 ? 'Start Learning →' : 'Continue →' }}
              </a>
              <a routerLink="/products"
                 class="rounded-xl border border-gold-400/30 px-5 py-2.5 text-sm font-semibold text-gold-200 transition hover:bg-gold-500/10">
                Demo app
              </a>
            </div>
          </div>

          <!-- Right: Large Progress Ring -->
          <div class="flex items-center justify-center border-t border-gold-500/10 p-8 lg:border-l lg:border-t-0">
            <div class="flex flex-col items-center gap-6">

              <!-- Big SVG ring -->
              <div class="relative">
                <svg width="160" height="160" viewBox="0 0 160 160"
                     role="progressbar"
                     [attr.aria-valuenow]="facade.percent()"
                     [attr.aria-valuetext]="facade.completedCount() + ' of ' + facade.totalCount + ' topics complete'"
                     class="-rotate-90">
                  <!-- Track — uses CSS var so it adapts to light/dark -->
                  <circle cx="80" cy="80" r="68" fill="none"
                          stroke="rgb(var(--stone-800))" stroke-width="12"/>
                  <!-- Progress arc — gold-500 CSS var -->
                  <circle cx="80" cy="80" r="68" fill="none"
                          stroke="rgb(var(--gold-500))"
                          stroke-width="12"
                          stroke-linecap="round"
                          [attr.stroke-dasharray]="circumference"
                          [attr.stroke-dashoffset]="dashOffset()"
                          style="transition: stroke-dashoffset 0.8s ease"/>
                </svg>
                <!-- Center text — stone tokens adapt automatically -->
                <div class="absolute inset-0 flex flex-col items-center justify-center rotate-0">
                  <span class="text-4xl font-bold text-stone-100 leading-none">{{ facade.completedCount() }}</span>
                  <span class="text-sm text-stone-400 mt-1">/{{ facade.totalCount }}</span>
                  <span class="text-xs font-semibold text-gold-400 mt-0.5">topics</span>
                </div>
              </div>

              <!-- Stats row below ring -->
              <div class="flex items-center gap-8 text-center">
                <div>
                  <p class="text-xl font-bold text-gold-400">{{ facade.percent() }}%</p>
                  <p class="text-xs text-stone-500">Complete</p>
                </div>
                <div class="h-8 w-px bg-stone-800"></div>
                <div>
                  <p class="text-xl font-bold text-stone-100">{{ facade.totalCount - facade.completedCount() }}</p>
                  <p class="text-xs text-stone-500">Remaining</p>
                </div>
                @if (facade.streak() > 0) {
                  <div class="h-8 w-px bg-stone-800"></div>
                  <div>
                    <p class="text-xl font-bold text-gold-400">🔥 {{ facade.streak() }}</p>
                    <p class="text-xs text-stone-500">Day streak</p>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Level and badges: the whole card opens the journey -->
      <a routerLink="/journey" data-testid="open-journey" class="card interactive-card mt-4 block p-5">
        <div class="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <p class="text-lg font-bold text-stone-100">
            Level {{ game.level().level.number }} · <span class="text-gold-300">{{ game.level().level.title }}</span>
          </p>
          <p class="text-sm text-stone-400">{{ game.xp() }} XP · {{ game.earnedCount() }} of {{ game.badges().length }} badges</p>
        </div>
        <div class="mt-3 h-2 overflow-hidden rounded-full bg-stone-800" aria-hidden="true">
          <div class="h-full rounded-full bg-gold-400" [style.width.%]="game.level().percent"></div>
        </div>
        <p class="mt-3 flex items-center gap-1 text-sm font-semibold text-gold-300">
          Open your journey <app-icon name="chevron-right" class="h-4 w-4" />
        </p>
      </a>

      <!-- Topics, by group -->
      <h2 class="mt-12 text-lg font-bold text-stone-100">Topics by group</h2>
      <div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        @for (group of facade.groups(); track group.id) {
          <div class="card flex flex-col p-5">
            <div class="flex items-center gap-2.5">
              <app-icon [name]="groupIcons[group.id]" class="h-5 w-5 shrink-0 text-gold-400" />
              <h3 class="flex-1 font-semibold text-stone-100">{{ group.title }}</h3>
              <span class="text-sm font-semibold tabular-nums text-gold-300">
                {{ group.completedCount }}/{{ group.topics.length }}<span class="sr-only"> topics completed</span>
              </span>
            </div>
            <div class="mt-3 h-1.5 overflow-hidden rounded-full bg-stone-800" aria-hidden="true">
              <div class="h-full rounded-full bg-gold-500" [style.width.%]="groupSectionPercent(group.id)"></div>
            </div>
            <ul class="-mx-2 mt-3 space-y-0.5">
              @for (topic of group.topics; track topic.id) {
                <li>
                  <a [routerLink]="['/learn', topic.id]" [attr.title]="topic.title"
                     class="flex min-h-11 items-center gap-2.5 rounded-xl px-2 text-sm text-stone-300 transition hover:bg-stone-800 hover:text-stone-100">
                    <app-topic-status-icon [status]="topic.status" [fraction]="topicFraction(topic.id)" />
                    <span class="min-w-0 flex-1 truncate">{{ topic.title }}</span>
                    <span class="sr-only">, {{ statusLabels[topic.status] }}</span>
                    <span class="shrink-0 text-xs tabular-nums text-stone-500" aria-hidden="true">{{ topicDone(topic.id) }}/{{ topic.sections.length }}</span>
                  </a>
                </li>
              }
            </ul>
          </div>
        }
      </div>

      @if (facade.recentActivity().length) {
        <div class="mt-12">
          <div class="flex items-center justify-between gap-3">
            <h2 class="text-lg font-bold text-stone-100">Recent activity</h2>
            <a routerLink="/history" data-testid="view-history"
               class="flex min-h-11 items-center gap-1 rounded-lg px-2 text-sm font-semibold text-gold-300 hover:text-gold-200">
              View full history <app-icon name="chevron-right" class="h-4 w-4" />
            </a>
          </div>
          <ul class="card mt-3 divide-y divide-stone-800 p-0">
            @for (entry of facade.recentActivity(); track entry.at + entry.kind + entry.topicId + (entry.sectionId ?? '')) {
              <li class="flex items-center gap-3 px-5 py-3 text-sm">
                <app-icon [name]="activityIcons[entry.kind].icon" class="h-4 w-4 shrink-0" [class]="activityIcons[entry.kind].tone" />
                <span class="min-w-0 flex-1 text-stone-300">
                  {{ activityLabel(entry.kind) }}
                  <span class="font-semibold text-stone-100">{{ topicTitleOf(entry.topicId) }}</span>
                </span>
                <span class="shrink-0 text-stone-500">{{ dayOf(entry.at) }}</span>
              </li>
            }
          </ul>
        </div>
      }

    </section>
  `,
})
export class DashboardComponent {
  readonly facade = inject(LearningFacade);
  readonly game = inject(GamificationService);
  private readonly progress = inject(ProgressService);
  private readonly clock = inject(CLOCK);

  protected readonly groupIcons = GROUP_ICONS;
  protected readonly statusLabels = TOPIC_STATUS_LABELS;
  protected readonly activityIcons = ACTIVITY_ICONS;

  // SVG ring: radius 68, circumference = 2π × 68 ≈ 427.3
  readonly circumference = 2 * Math.PI * 68;

  dashOffset(): number {
    return this.circumference * (1 - this.facade.percent() / 100);
  }

  topicDone(topicId: TopicId | string): number {
    const topic = TOPICS.find((t) => t.id === topicId);
    return topic ? topic.sections.filter((s) => this.progress.isSectionDone(topic.id, s.id)).length : 0;
  }

  topicFraction(topicId: TopicId | string): number {
    const topic = TOPICS.find((t) => t.id === topicId);
    return topic?.sections.length ? this.topicDone(topicId) / topic.sections.length : 0;
  }

  groupSectionPercent(groupId: string): number {
    const topics = TOPICS.filter((t) => t.group === groupId);
    const total = topics.reduce((sum, t) => sum + t.sections.length, 0);
    const done = topics.reduce((sum, t) => sum + this.topicDone(t.id), 0);
    return total ? (done / total) * 100 : 0;
  }

  readonly activityLabel = activityLabel;
  readonly topicTitleOf = topicTitleOf;

  dayOf(iso: string): string {
    const date = new Date(iso);
    return Number.isNaN(date.getTime()) ? '' : dayLabel(date, this.clock.now());
  }
}
