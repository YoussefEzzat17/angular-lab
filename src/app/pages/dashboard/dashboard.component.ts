import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LearningFacade } from '../../core/services/learning.facade';
import { ProgressRingComponent } from '../../shared/progress-ring.component';

@Component({
  standalone: true,
  imports: [RouterLink, ProgressRingComponent],
  template: `
    <section class="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">

      <!-- Welcome header -->
      <div class="mb-10">
        <p class="text-sm font-semibold text-gold-400">DASHBOARD</p>
        <h1 class="mt-1 text-3xl font-bold sm:text-4xl">
          Welcome back{{ facade.name() ? ', ' + facade.name() : '' }}! 👋
        </h1>
        <p class="mt-2 text-stone-400">Here's where you left off.</p>
      </div>

      <!-- Continue card -->
      <div class="rounded-2xl border border-gold-400/30 bg-gradient-to-br from-gold-950 via-stone-900 to-stone-950 p-6 sm:p-8">
        <div class="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center gap-5">
            <app-progress-ring
              [percent]="facade.percent()"
              [ariaText]="facade.completedCount() + ' of ' + facade.totalCount + ' topics complete'"
              [size]="72"
              [strokeWidth]="6"
            />
            <div>
              <p class="text-2xl font-bold text-stone-100">{{ facade.completedCount() }}/{{ facade.totalCount }}</p>
              <p class="text-sm text-stone-400">topics completed · {{ facade.percent() }}%</p>
              @if (facade.streak() > 0) {
                <p class="mt-1 text-sm font-semibold text-gold-300">🔥 {{ facade.streak() }}-day streak!</p>
              }
            </div>
          </div>
          <a [routerLink]="facade.continueTarget()"
             class="shrink-0 rounded-xl bg-gold-500 px-6 py-3 font-semibold text-white transition hover:bg-gold-400">
            {{ facade.completedCount() === 0 ? 'Start Learning →' : 'Continue Learning →' }}
          </a>
        </div>
      </div>

      <!-- Progress by group -->
      <div class="mt-10">
        <h2 class="text-lg font-bold">Progress by Section</h2>
        <div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          @for (group of facade.groups(); track group.id) {
            <div class="rounded-2xl border border-stone-800 bg-stone-900 p-5">
              <div class="flex items-center justify-between gap-2">
                <p class="font-semibold text-stone-100">{{ group.title }}</p>
                <span class="text-sm font-semibold text-gold-300">{{ group.completedCount }}/{{ group.topics.length }}</span>
              </div>
              <div class="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-stone-800">
                <div
                  class="h-full rounded-full bg-gold-500 transition-all duration-500"
                  [style.width.%]="group.topics.length ? (group.completedCount / group.topics.length) * 100 : 0"
                ></div>
              </div>
              <div class="mt-4 space-y-1.5">
                @for (topic of group.topics; track topic.id) {
                  <a [routerLink]="['/learn', topic.id]"
                     class="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition hover:bg-stone-800">
                    <span class="text-base">{{ topic.icon }}</span>
                    <span class="flex-1 truncate text-stone-300">{{ topic.title }}</span>
                    <span class="text-xs"
                          [class.text-emerald-400]="topic.status === 'completed'"
                          [class.text-gold-400]="topic.status === 'in-progress'"
                          [class.text-stone-600]="topic.status === 'not-started'">
                      {{ topic.status === 'completed' ? '✓' : topic.status === 'in-progress' ? '◐' : '○' }}
                    </span>
                  </a>
                }
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Recent activity -->
      @if (facade.recentActivity().length) {
        <div class="mt-10">
          <h2 class="text-lg font-bold">Recent Activity</h2>
          <div class="mt-4 space-y-2">
            @for (entry of facade.recentActivity(); track entry.at) {
              <div class="flex items-center gap-3 rounded-xl border border-stone-800 bg-stone-900 px-4 py-3 text-sm">
                <span class="text-lg">
                  {{ entry.kind === 'quiz-passed' ? '🎉' : entry.kind === 'quiz-failed' ? '📝' : '✓' }}
                </span>
                <span class="flex-1 text-stone-300">
                  {{ activityLabel(entry.kind) }}
                  <span class="font-semibold text-stone-100">{{ topicTitle(entry.topicId) }}</span>
                </span>
                <span class="shrink-0 text-stone-500">{{ formatDate(entry.at) }}</span>
              </div>
            }
          </div>
        </div>
      }

    </section>
  `,
})
export class DashboardComponent {
  readonly facade = inject(LearningFacade);

  activityLabel(kind: string): string {
    if (kind === 'quiz-passed') return 'Passed quiz — ';
    if (kind === 'quiz-failed') return 'Attempted quiz — ';
    return 'Completed section in ';
  }

  topicTitle(topicId: string): string {
    const group = this.facade.groups().flatMap((g) => g.topics).find((t) => t.id === topicId);
    return group?.title ?? topicId;
  }

  formatDate(iso: string): string {
    try { return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }); }
    catch { return ''; }
  }
}
