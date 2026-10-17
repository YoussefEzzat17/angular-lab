import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { GROUPED_TOPICS } from '../../core/data/topics';
import { LearningFacade } from '../../core/services/learning.facade';

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">

      <!-- ── Hero: welcome + topic map ──────────────────────────────────── -->
      <div class="theme-dark-scope overflow-hidden rounded-3xl bg-gradient-to-br from-gold-950 via-stone-900 to-stone-950 ring-1 ring-gold-500/30">
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
                 class="rounded-xl bg-gold-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gold-400">
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
                  <!-- Track -->
                  <circle cx="80" cy="80" r="68" fill="none"
                          stroke="rgb(41 37 36)" stroke-width="12"/>
                  <!-- Progress arc -->
                  <circle cx="80" cy="80" r="68" fill="none"
                          stroke="rgb(181 138 74)"
                          stroke-width="12"
                          stroke-linecap="round"
                          [attr.stroke-dasharray]="circumference"
                          [attr.stroke-dashoffset]="dashOffset()"
                          style="transition: stroke-dashoffset 0.8s ease"/>
                </svg>
                <!-- Center text -->
                <div class="absolute inset-0 flex flex-col items-center justify-center rotate-0">
                  <span class="text-4xl font-bold text-stone-100 leading-none">{{ facade.completedCount() }}</span>
                  <span class="text-sm text-stone-500 mt-1">/{{ facade.totalCount }}</span>
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

      <!-- ── Quick stats ─────────────────────────────────────────────────── -->
      <div class="mt-6 grid grid-cols-3 gap-3 sm:gap-4">
        <div class="rounded-2xl border border-stone-800 bg-stone-900 p-4 text-center">
          <p class="text-2xl font-bold text-emerald-400">{{ facade.completedCount() }}</p>
          <p class="mt-1 text-xs text-stone-400">Completed</p>
        </div>
        <div class="rounded-2xl border border-stone-800 bg-stone-900 p-4 text-center">
          <p class="text-2xl font-bold text-gold-400">{{ facade.totalCount - facade.completedCount() }}</p>
          <p class="mt-1 text-xs text-stone-400">Remaining</p>
        </div>
        <div class="rounded-2xl border border-stone-800 bg-stone-900 p-4 text-center">
          <p class="text-2xl font-bold text-gold-400">{{ facade.streak() > 0 ? facade.streak() : '—' }}</p>
          <p class="mt-1 text-xs text-stone-400">Day streak 🔥</p>
        </div>
      </div>

      <!-- ── Progress by group ─────────────────────────────────────────── -->
      <div class="mt-10">
        <h2 class="text-lg font-bold text-stone-100">Progress by Group</h2>
        <div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          @for (group of facade.groups(); track group.id) {
            <div class="rounded-2xl border border-stone-800 bg-stone-900 p-5">
              <div class="flex items-center justify-between gap-2">
                <p class="font-semibold text-stone-100">{{ group.title }}</p>
                <span class="text-sm font-semibold text-gold-300">{{ group.completedCount }}/{{ group.topics.length }}</span>
              </div>
              <div class="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-stone-800">
                <div class="h-full rounded-full bg-gold-500 transition-all duration-500"
                     [style.width.%]="group.topics.length ? (group.completedCount / group.topics.length) * 100 : 0"></div>
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

      <!-- ── Recent activity ───────────────────────────────────────────── -->
      @if (facade.recentActivity().length) {
        <div class="mt-10">
          <h2 class="text-lg font-bold text-stone-100">Recent Activity</h2>
          <div class="mt-4 space-y-2">
            @for (entry of facade.recentActivity(); track entry.at) {
              <div class="flex items-center gap-3 rounded-xl border border-stone-800 bg-stone-900 px-4 py-3 text-sm">
                <span class="text-lg">{{ entry.kind === 'quiz-passed' ? '🎉' : entry.kind === 'quiz-failed' ? '📝' : '✓' }}</span>
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
  readonly groups = GROUPED_TOPICS;

  // SVG ring: radius 68, circumference = 2π × 68 ≈ 427.3
  readonly circumference = 2 * Math.PI * 68;

  dashOffset(): number {
    return this.circumference * (1 - this.facade.percent() / 100);
  }

  activityLabel(kind: string): string {
    if (kind === 'quiz-passed') return 'Passed quiz — ';
    if (kind === 'quiz-failed') return 'Attempted quiz — ';
    return 'Completed section in ';
  }

  topicTitle(topicId: string): string {
    return this.facade.groups().flatMap(g => g.topics).find(t => t.id === topicId)?.title ?? topicId;
  }

  formatDate(iso: string): string {
    try { return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }); }
    catch { return ''; }
  }
}
