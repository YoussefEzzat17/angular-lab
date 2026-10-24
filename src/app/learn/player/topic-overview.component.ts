import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LEVEL_LABEL, TOPICS, TOPIC_GROUPS } from '../../core/data/topics';
import { ProgressService } from '../../core/services/progress.service';
import { ProgressRingComponent } from '../../shared/progress-ring.component';
import { IconComponent } from '../../shared/icon.component';
import { GROUP_ICONS, SECTION_KIND_ICONS, SECTION_KIND_LABELS } from '../../shared/learning-icons';
import { TopicStatusIconComponent } from '../sidebar/topic-status-icon.component';
import type { TopicId } from '../../core/models/learning.models';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterLink, ProgressRingComponent, IconComponent, TopicStatusIconComponent],
  template: `
    @if (topic(); as t) {
      <section class="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <!-- Header -->
        <nav aria-label="Breadcrumb">
          <ol class="flex flex-wrap items-center gap-x-1.5 text-sm text-stone-400">
            <li class="flex items-center gap-1.5"><app-icon [name]="groupIcon()" class="h-4 w-4 text-gold-400" />{{ groupTitle() }}</li>
            <li aria-hidden="true"><app-icon name="chevron-right" class="h-3.5 w-3.5 text-stone-600" /></li>
            <li aria-current="page" class="text-stone-200">{{ t.title }}</li>
          </ol>
        </nav>
        <h1 class="mt-3 text-3xl font-bold text-stone-100 [text-wrap:balance] sm:text-4xl">{{ t.title }}</h1>
        <p class="mt-2 max-w-[60ch] text-stone-400">{{ t.description }}</p>
        <p class="mt-3 flex flex-wrap items-center gap-2 text-sm text-stone-400">
          <span class="rounded-full border border-stone-700 px-3 py-1 text-xs font-semibold text-stone-300" data-testid="topic-level">{{ levelLabel[t.level] }}</span>
          <span>~{{ totalMinutes() }} min · {{ t.sections.length }} sections</span>
        </p>
        <!-- Before you start -->
        @if (prerequisites().length) {
          <div class="card mt-6 p-5" data-testid="prerequisites">
            <p class="font-semibold text-stone-100">Before you start</p>
            <p class="mt-0.5 text-sm text-stone-400">
              {{ allPrerequisitesDone() ? 'You have finished the topics this one builds on.' : 'This topic builds on these. Finishing them first makes it easier (you can still start now).' }}
            </p>
            <ul class="mt-3 flex flex-wrap gap-2">
              @for (pre of prerequisites(); track pre.topic.id) {
                <li>
                  <a [routerLink]="pre.topic.path" [attr.data-testid]="'prereq-' + pre.topic.id"
                     class="inline-flex min-h-11 items-center gap-2 rounded-full border px-3.5 text-sm transition hover:bg-stone-800"
                     [class]="pre.done ? 'border-emerald-500/40 text-emerald-300' : 'border-stone-700 text-stone-300'">
                    <app-topic-status-icon [status]="pre.status" [fraction]="pre.fraction" />
                    {{ pre.topic.title }}<span class="sr-only">{{ pre.done ? ' (finished)' : ' (not finished yet)' }}</span>
                  </a>
                </li>
              }
            </ul>
          </div>
        }

        <!-- Progress + start -->
        <div class="card mt-8 flex flex-wrap items-center gap-4 p-5">
          <app-progress-ring [percent]="sectionPercent()" [ariaText]="doneSections() + ' of ' + t.sections.length + ' sections done'" [size]="56" [strokeWidth]="5" />
          <div class="min-w-0 flex-1">
            <p class="font-semibold text-stone-100">{{ doneSections() }} of {{ t.sections.length }} sections done</p>
            <p class="mt-0.5 text-sm text-stone-400">{{ doneSections() === 0 ? 'Each section takes a few minutes.' : 'Pick up at the next section.' }}</p>
          </div>
          <a [routerLink]="startPath()" class="btn-primary w-full sm:w-auto">
            {{ doneSections() === 0 ? 'Start' : 'Continue' }}
            <app-icon name="chevron-right" class="h-4 w-4" />
          </a>
        </div>
        <!-- Objectives -->
        @if (t.objectives.length) {
          <div class="mt-8">
            <h2 class="text-lg font-bold">What you'll learn</h2>
            <ul class="mt-3 space-y-2">
              @for (obj of t.objectives; track obj.text) {
                <li class="flex items-start gap-2.5 text-sm text-stone-300">
                  <app-icon name="check" class="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
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
                 class="card interactive-card flex min-h-14 items-center gap-3 px-4 py-3">
                <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold tabular-nums"
                      [class]="isSectionDone(sec.id) ? 'bg-emerald-500/20 text-emerald-400' : 'bg-stone-800 text-stone-400'" aria-hidden="true">
                  @if (isSectionDone(sec.id)) {
                    <app-icon name="check" class="h-4 w-4" />
                  } @else {
                    {{ i + 1 }}
                  }
                </span>
                <span class="min-w-0 flex-1">
                  <span class="block font-semibold text-stone-100">{{ sec.title }}</span>
                  <span class="mt-0.5 flex items-center gap-1.5 text-xs text-stone-500">
                    <app-icon [name]="kindIcons[sec.kind]" class="h-3.5 w-3.5" />{{ kindLabels[sec.kind] }} · {{ sec.minutes }} min
                  </span>
                </span>
                @if (isSectionDone(sec.id)) {
                  <span class="sr-only">, done</span>
                }
              </a>
            }
          </div>
        </div>

        <!-- Quiz status -->
        <div class="card mt-6 p-5">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p class="font-semibold">Final Quiz</p>
              <p class="mt-0.5 text-sm text-stone-400">
                @if (isCompleted()) {
                  Passed · Best score {{ bestScore() }}/6
                } @else if (allSectionsDone()) {
                  Every section is done: you're ready
                } @else {
                  Complete all sections to unlock
                }
              </p>
            </div>
            @if (allSectionsDone()) {
              <a [routerLink]="['/learn', t.id, 'quiz']" class="btn-secondary">
                <app-icon name="help" class="h-4 w-4" />
                {{ isCompleted() ? 'Retake quiz' : 'Take the quiz' }}
              </a>
            } @else {
              <span class="inline-flex min-h-11 items-center gap-2 rounded-xl border border-stone-800 px-4 text-sm text-stone-500">
                <app-icon name="lock" class="h-4 w-4" /> Locked
              </span>
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

  protected readonly levelLabel = LEVEL_LABEL;

  protected readonly topic = computed(() => TOPICS.find((t) => t.id === this.topicId) ?? null);

  protected readonly kindIcons = SECTION_KIND_ICONS;
  protected readonly kindLabels = SECTION_KIND_LABELS;
  protected readonly groupTitle = computed(() => TOPIC_GROUPS.find((g) => g.id === this.topic()?.group)?.title ?? '');
  protected readonly groupIcon = computed(() => GROUP_ICONS[this.topic()?.group ?? 'fundamentals']);
  protected readonly prerequisites = computed(() =>
    (this.topic()?.prerequisites ?? []).flatMap((id) => {
      const topic = TOPICS.find((t) => t.id === id);
      if (!topic) return [];
      const doneCount = topic.sections.filter((s) => this.progress.isSectionDone(topic.id, s.id)).length;
      const status = this.progress.status(id);
      return [{ topic, status, done: status === 'completed', fraction: topic.sections.length ? doneCount / topic.sections.length : 0 }];
    }),
  );
  protected readonly allPrerequisitesDone = computed(() => this.prerequisites().every((p) => p.done));
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
