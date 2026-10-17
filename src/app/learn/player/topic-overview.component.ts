import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TOPICS } from '../../core/data/topics';
import { ProgressService } from '../../core/services/progress.service';
import { ProgressRingComponent } from '../../shared/progress-ring.component';
import type { TopicId } from '../../core/models/learning.models';

@Component({
  standalone: true,
  imports: [RouterLink, ProgressRingComponent],
  template: `
    @if (topic(); as t) {
      <section class="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <!-- Header -->
        <div class="flex items-start gap-4">
          <span class="text-5xl">{{ t.icon }}</span>
          <div>
            <p class="text-sm font-semibold text-gold-400">{{ groupTitle() }}</p>
            <h1 class="mt-1 text-3xl font-bold sm:text-4xl">{{ t.title }}</h1>
            <p class="mt-2 text-stone-400">{{ t.description }}</p>
          </div>
        </div>

        <!-- Progress ring + stats -->
        <div class="mt-8 flex items-center gap-5 rounded-2xl border border-stone-800 bg-stone-900 p-5">
          <app-progress-ring [percent]="sectionPercent()" [ariaText]="sectionPercent() + '% complete'" [size]="56" [strokeWidth]="5" />
          <div>
            <p class="text-sm text-stone-400">{{ doneSections() }} of {{ t.sections.length }} sections done</p>
            <p class="mt-0.5 text-xs text-stone-500">~{{ totalMinutes() }} min · {{ t.sections.length }} sections</p>
          </div>
          <div class="ml-auto">
            <a [routerLink]="startPath()"
               class="rounded-xl bg-gold-500 px-5 py-2.5 font-semibold text-white transition hover:bg-gold-400">
              {{ doneSections() === 0 ? 'Start →' : 'Continue →' }}
            </a>
          </div>
        </div>

        <!-- Objectives -->
        @if (t.objectives.length) {
          <div class="mt-8">
            <h2 class="text-lg font-bold">What you'll learn</h2>
            <ul class="mt-3 space-y-2">
              @for (obj of t.objectives; track obj.text) {
                <li class="flex items-start gap-2 text-sm text-stone-300">
                  <span class="mt-0.5 text-gold-400">✓</span>
                  {{ obj.text }}
                </li>
              }
            </ul>
          </div>
        }

        <!-- Sections list -->
        <div class="mt-8">
          <h2 class="text-lg font-bold">Sections</h2>
          <div class="mt-3 space-y-2">
            @for (sec of t.sections; track sec.id; let i = $index) {
              <a [routerLink]="['/learn', t.id, sec.id]"
                 class="flex items-center gap-3 rounded-xl border border-stone-800 bg-stone-900 px-4 py-3 transition hover:border-gold-400/50 hover:bg-stone-800">
                <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                      [class]="isSectionDone(sec.id) ? 'bg-emerald-500/20 text-emerald-400' : 'bg-stone-800 text-stone-400'">
                  {{ isSectionDone(sec.id) ? '✓' : (i + 1) }}
                </span>
                <span class="flex-1 font-semibold text-stone-100">{{ sec.title }}</span>
                <span class="text-xs text-stone-500">{{ sec.minutes }} min</span>
              </a>
            }
          </div>
        </div>

        <!-- Quiz status -->
        <div class="mt-6 rounded-2xl border border-stone-800 bg-stone-900 p-5">
          <div class="flex items-center justify-between gap-4">
            <div>
              <p class="font-semibold">Final Quiz</p>
              <p class="mt-0.5 text-sm text-stone-400">
                @if (isCompleted()) {
                  Passed · Best score {{ bestScore() }}/6
                } @else if (allSectionsDone()) {
                  Ready to take — complete all sections first ✓
                } @else {
                  Complete all sections to unlock
                }
              </p>
            </div>
            @if (allSectionsDone()) {
              <a [routerLink]="['/learn', t.id, 'quiz']"
                 class="rounded-xl bg-gold-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gold-400">
                {{ isCompleted() ? 'Retake' : 'Take Quiz' }}
              </a>
            } @else {
              <span class="rounded-xl border border-stone-700 px-4 py-2 text-sm text-stone-500">🔒 Locked</span>
            }
          </div>
        </div>
      </section>
    }
  `,
})
export class TopicOverviewComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly progress = inject(ProgressService);
  private readonly router = inject(Router);

  /** Set on the parent route in learn.routes.ts. */
  private readonly topicId = this.route.snapshot.data['topicId'] as TopicId;

  protected readonly topic = computed(() => TOPICS.find((t) => t.id === this.topicId) ?? null);

  protected readonly groupTitle = computed(() => {
    const group = this.topic()?.group ?? '';
    return group.replace(/-/g, ' ').toUpperCase();
  });
  protected readonly totalMinutes = computed(() => this.topic()?.sections.reduce((s, x) => s + x.minutes, 0) ?? 0);
  protected readonly doneSections = computed(() => {
    const t = this.topic();
    if (!t) return 0;
    return t.sections.filter((s) => this.progress.isSectionDone(t.id, s.id)).length;
  });
  protected readonly sectionPercent = computed(() => {
    const t = this.topic();
    if (!t || !t.sections.length) return 0;
    return Math.round((this.doneSections() / t.sections.length) * 100);
  });
  protected readonly allSectionsDone = computed(() => {
    const t = this.topic();
    return t ? this.progress.allSectionsDone(t.id) : false;
  });
  protected readonly isCompleted = computed(() => {
    const t = this.topic();
    return t ? this.progress.status(t.id) === 'completed' : false;
  });
  protected readonly bestScore = computed(() => {
    const t = this.topic();
    return t ? (this.progress.getBestScore(t.id) ?? 0) : 0;
  });
  protected readonly startPath = computed<string | unknown[]>(() => {
    const t = this.topic();
    if (!t) return '/learn';
    const last = this.progress.getLastSection(t.id);
    const first = t.sections[0]?.id;
    return last ? ['/learn', t.id, last] : first ? ['/learn', t.id, first] : ['/learn', t.id];
  });

  constructor() {
    const t = this.topic();
    if (!t) {
      this.router.navigate(['/learn']);
      return;
    }
    this.progress.markVisited(t.id);
  }

  isSectionDone(sectionId: string): boolean {
    const t = this.topic();
    return t ? this.progress.isSectionDone(t.id, sectionId) : false;
  }
}
