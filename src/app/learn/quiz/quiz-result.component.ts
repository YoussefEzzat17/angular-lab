import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../shared/icon.component';
import { ProgressRingComponent } from '../../shared/progress-ring.component';
import type { QuizAttempt, QuizQuestion, TopicId } from '../../core/models/learning.models';
import { TOPICS } from '../../core/data/topics';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-quiz-result',
  standalone: true,
  imports: [RouterLink, ProgressRingComponent, IconComponent],
  template: `
    <div>
      <!-- Score card -->
      <div class="rounded-2xl border p-6 text-center shadow-card"
           [class.border-emerald-500]="attempt().passed"
           [class.bg-emerald-500/5]="attempt().passed"
           [class.border-stone-700]="!attempt().passed"
           [class.bg-stone-900]="!attempt().passed">
        <div class="flex justify-center">
          <app-progress-ring
            [percent]="scorePercent()"
            [ariaText]="attempt().score + ' of ' + attempt().total + ' correct'"
            [size]="80"
            [strokeWidth]="7"
          />
        </div>
        <p class="mt-4 text-3xl font-bold">{{ attempt().score }}/{{ attempt().total }}</p>
        <p class="mt-1 text-lg font-semibold" [class.text-emerald-400]="attempt().passed" [class.text-stone-300]="!attempt().passed">
          {{ attempt().passed ? 'Passed!' : 'Keep going — you can do it!' }}
        </p>
        <p class="mt-2 text-sm text-stone-400">
          {{ attempt().passed ? 'You scored ' + scorePercent() + '% — great work!' : 'You need 75% to pass. Review the sections below and try again.' }}
        </p>
      </div>

      <!-- Actions -->
      <div class="mt-6 flex flex-wrap gap-3 justify-center">
        @if (attempt().passed) {
          <button type="button" (click)="goComplete.emit()" class="btn-primary">
            Continue <app-icon name="chevron-right" class="h-4 w-4" />
          </button>
        }
        <button type="button" (click)="retry.emit()" class="btn-secondary">Retry quiz</button>
        <a [routerLink]="['/learn', topicId()]" class="btn-secondary">Back to overview</a>
      </div>

      <!-- Sections to review (on failure) -->
      @if (!attempt().passed && reviewSections().length) {
        <div class="mt-8">
          <h2 class="font-semibold text-stone-200">Review these sections:</h2>
          <div class="mt-3 space-y-2">
            @for (sec of reviewSections(); track sec.id) {
              <a [routerLink]="['/learn', topicId(), sec.id]"
                 class="card interactive-card flex min-h-12 items-center gap-3 px-4 py-3 text-sm">
                <app-icon name="chevron-right" class="h-4 w-4 shrink-0 text-gold-400" />
                <span class="font-semibold text-stone-200">{{ sec.title }}</span>
              </a>
            }
          </div>
        </div>
      }

      <!-- Question review -->
      <div class="mt-8 space-y-4">
        <h2 class="font-semibold text-stone-200">Question Review</h2>
        @for (q of questions(); track q.id) {
          <div class="rounded-xl border p-4"
               [class.border-emerald-500/40]="isCorrect(q.id)"
               [class.bg-emerald-500/5]="isCorrect(q.id)"
               [class.border-stone-700]="!isCorrect(q.id)"
               [class.bg-stone-900]="!isCorrect(q.id)">
            <div class="flex items-start gap-3">
              @if (isCorrect(q.id)) {
                <app-icon name="check" class="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
              } @else {
                <app-icon name="close" class="mt-0.5 h-5 w-5 shrink-0 text-rose-400" />
              }
              <span class="sr-only">{{ isCorrect(q.id) ? 'Correct:' : 'Incorrect:' }}</span>
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-stone-100 text-sm">{{ q.prompt }}</p>
                <p class="mt-2 text-xs text-stone-400">{{ q.explanation }}</p>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class QuizResultComponent {
  readonly attempt = input.required<QuizAttempt>();
  readonly questions = input.required<QuizQuestion[]>();
  readonly topicId = input.required<TopicId>();
  readonly retry = output<void>();
  readonly goComplete = output<void>();

  protected readonly scorePercent = computed(() =>
    Math.round((this.attempt().score / this.attempt().total) * 100)
  );

  protected readonly reviewSections = computed(() => {
    const topic = TOPICS.find((t) => t.id === this.topicId());
    if (!topic) return [];
    const wrongSectionIds = [...new Set(
      this.questions()
        .filter((q) => !this.attempt().correctIds.includes(q.id))
        .map((q) => q.sectionId)
    )];
    return topic.sections.filter((s) => wrongSectionIds.includes(s.id));
  });

  isCorrect(questionId: string): boolean {
    return this.attempt().correctIds.includes(questionId);
  }
}
