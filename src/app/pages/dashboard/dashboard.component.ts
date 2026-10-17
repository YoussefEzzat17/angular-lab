import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LearningFacade } from '../../core/services/learning.facade';
import { TOPICS, GROUPED_TOPICS } from '../../core/data/topics';

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
                Welcome back,<br/><span class="text-gold-400">{{ facade.name() }}</span> 👋
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

          <!-- Right: Topic Progress Map -->
          <div class="flex items-center justify-center border-t border-gold-500/10 p-6 lg:border-l lg:border-t-0">
            <div>
              <p class="mb-4 text-center text-xs font-bold uppercase tracking-widest text-stone-500">Topic Progress</p>
              <!-- 5 groups × 3 cols max, each topic is a colored node -->
              <div class="space-y-4">
                @for (group of groups; track group.id) {
                  <div>
                    <p class="mb-2 text-[10px] font-bold uppercase tracking-wider text-gold-400/60">{{ group.title }}</p>
                    <div class="flex flex-wrap gap-2">
                      @for (topic of group.topics; track topic.id) {
                        <a
                          [routerLink]="topic.path"
                          [title]="topic.title + ' — ' + topicStatusLabel(topic.id)"
                          class="group relative flex h-10 w-10 items-center justify-center rounded-xl text-lg transition-transform hover:scale-110"
                          [class]="topicNodeClass(topic.id)"
                        >
                          {{ topic.icon }}
                          <!-- Tiny status dot -->
                          <span class="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-stone-900"
                                [class]="topicDotClass(topic.id)"></span>
                        </a>
                      }
                    </div>
                  </div>
                }
              </div>
              <!-- Legend -->
              <div class="mt-5 flex items-center gap-4 text-[10px] text-stone-500">
                <span class="flex items-center gap-1.5"><span class="h-2 w-2 rounded-full bg-stone-700"></span> Not started</span>
                <span class="flex items-center gap-1.5"><span class="h-2 w-2 rounded-full bg-gold-500/60"></span> In progress</span>
                <span class="flex items-center gap-1.5"><span class="h-2 w-2 rounded-full bg-emerald-500"></span> Completed</span>
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

  topicNodeClass(topicId: string): string {
    const status = this.facade.groups()
      .flatMap(g => g.topics)
      .find(t => t.id === topicId)?.status ?? 'not-started';
    if (status === 'completed') return 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40';
    if (status === 'in-progress') return 'bg-gold-500/20 text-gold-300 ring-1 ring-gold-500/40';
    return 'bg-stone-800 text-stone-400 ring-1 ring-stone-700';
  }

  topicDotClass(topicId: string): string {
    const status = this.facade.groups()
      .flatMap(g => g.topics)
      .find(t => t.id === topicId)?.status ?? 'not-started';
    if (status === 'completed') return 'bg-emerald-500';
    if (status === 'in-progress') return 'bg-gold-500';
    return 'bg-stone-700';
  }

  topicStatusLabel(topicId: string): string {
    const status = this.facade.groups()
      .flatMap(g => g.topics)
      .find(t => t.id === topicId)?.status ?? 'not-started';
    if (status === 'completed') return 'Completed ✓';
    if (status === 'in-progress') return 'In progress';
    return 'Not started';
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
