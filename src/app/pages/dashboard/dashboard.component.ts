import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LearningFacade } from '../../core/services/learning.facade';
import { SignalNetworkComponent } from '../home/signal-network.component';

@Component({
  standalone: true,
  imports: [RouterLink, SignalNetworkComponent],
  template: `
    <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">

      <!-- ── Hero banner ─────────────────────────────────────────── -->
      <div class="grid items-center gap-8 overflow-hidden rounded-3xl bg-gradient-to-br from-gold-950 via-stone-900 to-stone-950 px-5 py-10 text-stone-100 ring-1 ring-gold-500/30 sm:gap-10 sm:px-12 sm:py-12 lg:grid-cols-2">

        <!-- Left: copy + progress -->
        <div>
          <p class="mb-3 text-sm font-semibold uppercase tracking-[.2em] text-gold-300">Angular Lab</p>
          <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">
            @if (facade.name()) {
              Welcome back, {{ facade.name() }}! 👋
            } @else {
              Learn Angular by building.
            }
          </h1>
          <p class="mt-4 max-w-lg text-stone-300">
            @if (facade.completedCount() === 0) {
              A hands-on playground for Angular's core concepts. Every topic is a real, interactive page.
            } @else {
              {{ facade.completedCount() }} of {{ facade.totalCount }} topics completed.
              @if (facade.streak() > 0) { 🔥 {{ facade.streak() }}-day streak! }
              Keep going!
            }
          </p>

          <div class="mt-7 flex flex-wrap gap-3">
            <a [routerLink]="facade.continueTarget()"
               class="rounded-xl bg-gold-500 px-5 py-3 font-semibold text-white transition hover:bg-gold-400">
              {{ facade.completedCount() === 0 ? 'Start Learning →' : 'Continue Learning →' }}
            </a>
            <a routerLink="/products"
               class="rounded-xl border border-gold-400/40 px-5 py-3 font-semibold text-gold-200 transition hover:bg-gold-500/10">
              See the demo app
            </a>
          </div>

          <!-- Progress bar -->
          <div class="mt-8 max-w-sm">
            <div class="flex items-center justify-between text-xs text-stone-400">
              <span>Your progress</span>
              <span class="font-semibold text-gold-300">{{ facade.completedCount() }}/{{ facade.totalCount }} topics</span>
            </div>
            <div class="mt-2 h-2 w-full overflow-hidden rounded-full bg-stone-800/80">
              <div class="h-full rounded-full bg-gold-500 transition-all duration-500" [style.width.%]="facade.percent()"></div>
            </div>
          </div>
        </div>

        <!-- Right: Signal Network SVG -->
        <div class="theme-dark-scope relative overflow-hidden rounded-2xl border border-gold-500/15 bg-gradient-to-br from-gold-950 via-stone-900 to-stone-950 p-4">
          <app-signal-network class="block h-[240px] w-full sm:h-[300px]" />
        </div>
      </div>

      <!-- ── Quick stats row ──────────────────────────────────────── -->
      <div class="mt-6 grid grid-cols-3 gap-3 sm:gap-4">
        <div class="rounded-2xl border border-stone-800 bg-stone-900 p-4 text-center">
          <p class="text-2xl font-bold text-gold-400">{{ facade.completedCount() }}</p>
          <p class="mt-1 text-xs text-stone-400">Completed</p>
        </div>
        <div class="rounded-2xl border border-stone-800 bg-stone-900 p-4 text-center">
          <p class="text-2xl font-bold text-gold-400">{{ facade.percent() }}%</p>
          <p class="mt-1 text-xs text-stone-400">Progress</p>
        </div>
        <div class="rounded-2xl border border-stone-800 bg-stone-900 p-4 text-center">
          <p class="text-2xl font-bold text-gold-400">{{ facade.streak() > 0 ? facade.streak() : '—' }}</p>
          <p class="mt-1 text-xs text-stone-400">Day streak 🔥</p>
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
