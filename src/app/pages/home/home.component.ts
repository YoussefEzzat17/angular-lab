import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { GROUPED_TOPICS, TOPIC_GROUPS, TOPICS } from '../../core/data/topics';
import { ProgressService } from '../../core/services/progress.service';
import { SignalNetworkComponent } from './signal-network.component';

@Component({
  standalone: true,
  imports: [RouterLink, SignalNetworkComponent],
  template: `
    <!-- ── Hero ───────────────────────────────────────────────────────── -->
    <section class="border-b border-stone-800 bg-stone-950">
      <div class="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div class="grid items-center gap-12 lg:grid-cols-2">

          <!-- Left: copy -->
          <div>
            <h1 class="text-4xl font-bold leading-tight tracking-tight text-stone-100 sm:text-5xl lg:text-6xl">
              Learn Angular<br/>
              <span class="text-gold-400">by building.</span>
            </h1>
            <p class="mt-3 text-sm text-stone-500">by <a href="https://youssef-ezzat.vercel.app/" target="_blank" rel="noopener noreferrer" class="text-gold-400 hover:underline">Youssef Ezzat</a></p>
            <p class="mt-6 max-w-lg text-lg text-stone-400">
              A hands-on playground for Angular's core concepts. Every topic is a real, interactive page you can read, click and experiment with — not just slides.
            </p>

            <div class="mt-8 flex flex-wrap gap-3">
              <a [routerLink]="continuePath()"
                 class="rounded-xl bg-gold-500 px-6 py-3 font-semibold text-white shadow-lg shadow-gold-500/20 transition hover:bg-gold-400">
                {{ progress.completedCount() === 0 ? 'Start Learning →' : 'Continue Learning →' }}
              </a>
              <a routerLink="/dashboard"
                 class="rounded-xl border border-stone-700 px-6 py-3 font-semibold text-stone-300 transition hover:bg-stone-800">
                View Dashboard
              </a>
            </div>

            @if (progress.completedCount() > 0) {
              <div class="mt-8 max-w-sm">
                <div class="flex items-center justify-between text-xs text-stone-500">
                  <span>Your progress</span>
                  <span class="font-semibold text-gold-300">{{ progress.completedCount() }}/{{ progress.totalCount }} topics</span>
                </div>
                <div class="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-stone-800">
                  <div class="h-full rounded-full bg-gold-500 transition-all duration-500" [style.width.%]="progress.percent()"></div>
                </div>
              </div>
            }
          </div>

          <!-- Right: animated visual -->
          <div class="theme-dark-scope relative overflow-hidden rounded-2xl border border-gold-500/15 bg-gradient-to-br from-gold-950 via-stone-900 to-stone-950 p-6">
            <app-signal-network class="block h-[280px] w-full sm:h-[320px]" />
          </div>
        </div>
      </div>
    </section>

    <!-- ── Why Angular Lab ────────────────────────────────────────────── -->
    <section class="border-b border-stone-800 bg-stone-950/50">
      <div class="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div class="grid gap-6 sm:grid-cols-3">
          <div class="rounded-2xl border border-stone-800 bg-stone-900 p-6">
            <div class="mb-3 text-2xl">🧪</div>
            <h3 class="font-bold text-stone-100">Try it live</h3>
            <p class="mt-2 text-sm text-stone-400">Every topic has interactive demos you can modify and see update in real time.</p>
          </div>
          <div class="rounded-2xl border border-stone-800 bg-stone-900 p-6">
            <div class="mb-3 text-2xl">✅</div>
            <h3 class="font-bold text-stone-100">Quiz to complete</h3>
            <p class="mt-2 text-sm text-stone-400">Each topic ends with a quiz. Pass 75% to mark it complete and unlock the next.</p>
          </div>
          <div class="rounded-2xl border border-stone-800 bg-stone-900 p-6">
            <div class="mb-3 text-2xl">📈</div>
            <h3 class="font-bold text-stone-100">Track progress</h3>
            <p class="mt-2 text-sm text-stone-400">Your progress is saved locally. Pick up exactly where you left off, any time.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Topics ─────────────────────────────────────────────────────── -->
    <section class="bg-stone-950">
      <div class="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div class="mb-10">
          <p class="text-xs font-bold uppercase tracking-widest text-gold-400">Curriculum</p>
          <h2 class="mt-2 text-3xl font-bold text-stone-100">15 topics, one learning path</h2>
          <p class="mt-2 text-stone-400">From data binding to performance — each topic builds on the last.</p>
        </div>

        <div class="space-y-10">
          @for (group of groups; track group.id) {
            <div>
              <div class="mb-4 flex items-baseline gap-3">
                <h3 class="font-bold text-stone-100">{{ group.title }}</h3>
                <span class="text-xs text-stone-500">{{ group.blurb }}</span>
              </div>
              <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                @for (topic of group.topics; track topic.id) {
                  <a [routerLink]="topic.path"
                     class="group flex items-start gap-4 rounded-xl border border-stone-800 bg-stone-900 p-4 transition hover:border-gold-400/40 hover:bg-stone-800">
                    <span class="text-2xl">{{ topic.icon }}</span>
                    <div class="min-w-0 flex-1">
                      <div class="flex items-center justify-between gap-2">
                        <p class="font-semibold text-stone-100">{{ topic.title }}</p>
                        @if (progress.isCompleted(topic.path)) {
                          <span class="shrink-0 text-xs font-bold text-emerald-400">✓</span>
                        } @else {
                          <span class="text-gold-400 opacity-0 transition group-hover:opacity-100">→</span>
                        }
                      </div>
                      <p class="mt-0.5 text-xs text-stone-500 line-clamp-2">{{ topic.description }}</p>
                    </div>
                  </a>
                }
              </div>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- ── Demo app CTA ───────────────────────────────────────────────── -->
    <section class="border-t border-stone-800 bg-stone-900">
      <div class="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div class="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p class="text-xs font-bold uppercase tracking-widest text-gold-400">Bonus</p>
            <h2 class="mt-1 text-xl font-bold text-stone-100">A real demo app, built with these concepts</h2>
            <p class="mt-1 text-sm text-stone-400">Browse a movie catalog, add to My List — all powered by the Angular patterns you learn here.</p>
          </div>
          <div class="flex shrink-0 flex-wrap gap-3">
            <a routerLink="/products" class="rounded-xl bg-gold-500 px-5 py-2.5 font-semibold text-white transition hover:bg-gold-400">Browse titles →</a>
            <a routerLink="/favorites" class="rounded-xl border border-stone-700 px-5 py-2.5 font-semibold text-stone-200 transition hover:bg-stone-800">My List</a>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class HomeComponent {
  readonly progress = inject(ProgressService);
  readonly topics = TOPICS;
  readonly groups = GROUPED_TOPICS;

  continuePath(): string {
    const firstIncomplete = this.topics.find((t) => !this.progress.isCompleted(t.path));
    return firstIncomplete ? firstIncomplete.path : '/dashboard';
  }
}
