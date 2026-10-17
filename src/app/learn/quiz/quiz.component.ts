import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TOPICS } from '../../core/data/topics';
import { QuizService } from '../../core/services/quiz.service';
import { ProgressService } from '../../core/services/progress.service';
import { QuizQuestionComponent } from './quiz-question.component';
import { QuizResultComponent } from './quiz-result.component';
import type { TopicId, QuizQuestion, QuizAttempt } from '../../core/models/learning.models';

type QuizPhase = 'loading' | 'answering' | 'result';

@Component({
  standalone: true,
  imports: [QuizQuestionComponent, QuizResultComponent, RouterLink],
  template: `
    <div class="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      @switch (phase()) {
        @case ('loading') {
          <div class="flex items-center justify-center py-20 text-stone-400">Loading quiz…</div>
        }
        @case ('answering') {
          <div>
            <!-- Header -->
            <div class="mb-6 flex items-center justify-between">
              <a [routerLink]="['/learn', topicId]" class="text-sm text-stone-400 hover:text-gold-300">← Back to overview</a>
              <p class="text-sm font-semibold text-stone-400">
                Question {{ currentQuestionIndex() + 1 }} of {{ drawnQuestions().length }}
              </p>
            </div>
            <!-- Progress bar -->
            <div class="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-stone-800">
              <div class="h-full rounded-full bg-gold-500 transition-all duration-300"
                   [style.width.%]="((currentQuestionIndex() + 1) / drawnQuestions().length) * 100"></div>
            </div>
            <!-- Question -->
            @if (currentQuestion()) {
              <app-quiz-question
                [question]="currentQuestion()!"
                [answer]="answers()[currentQuestion()!.id]"
                (answerChange)="setAnswer(currentQuestion()!.id, $event)"
              />
            }
            <!-- Navigation -->
            <div class="mt-8 flex items-center justify-between gap-4">
              <button
                type="button"
                [disabled]="currentQuestionIndex() === 0"
                (click)="prev()"
                class="rounded-xl border border-stone-700 px-4 py-2 text-sm font-semibold text-stone-300 transition hover:bg-stone-800 disabled:opacity-40"
              >← Previous</button>
              @if (currentQuestionIndex() < drawnQuestions().length - 1) {
                <button
                  type="button"
                  (click)="next()"
                  class="rounded-xl bg-gold-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-gold-400"
                >Next →</button>
              } @else {
                <button
                  type="button"
                  [disabled]="!canSubmit()"
                  (click)="submit()"
                  class="rounded-xl bg-gold-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-gold-400 disabled:opacity-50"
                >Submit Quiz</button>
              }
            </div>
          </div>
        }
        @case ('result') {
          @if (attempt()) {
            <app-quiz-result
              [attempt]="attempt()!"
              [questions]="drawnQuestions()"
              [topicId]="topicId"
              (retry)="startQuiz()"
              (goComplete)="goToComplete()"
            />
          }
        }
      }
    </div>
  `,
})
export class QuizComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly quizService = inject(QuizService);
  private readonly progress = inject(ProgressService);

  /** Set on the parent topic route in learn.routes.ts (routes use literal topic segments, not a :topic param). */
  readonly topicId = this.route.snapshot.data['topicId'] as TopicId;
  readonly phase = signal<QuizPhase>('loading');
  readonly drawnQuestions = signal<QuizQuestion[]>([]);
  readonly currentQuestionIndex = signal(0);
  readonly answers = signal<Record<string, string[]>>({});
  readonly attempt = signal<QuizAttempt | null>(null);
  private bankVersion = 1;

  readonly currentQuestion = computed(() => this.drawnQuestions()[this.currentQuestionIndex()] ?? null);
  readonly canSubmit = computed(() => {
    const qs = this.drawnQuestions();
    const ans = this.answers();
    return qs.every((q) => (ans[q.id] ?? []).length > 0);
  });

  async ngOnInit() { await this.startQuiz(); }

  async startQuiz() {
    this.phase.set('loading');
    this.currentQuestionIndex.set(0);
    this.answers.set({});
    this.attempt.set(null);
    const bank = await this.quizService.load(this.topicId);
    this.bankVersion = bank.version;
    const drawn = this.quizService.draw(bank);
    this.drawnQuestions.set(drawn);
    this.phase.set('answering');
  }

  setAnswer(questionId: string, choices: string[]): void {
    this.answers.update((a) => ({ ...a, [questionId]: choices }));
  }

  prev(): void { this.currentQuestionIndex.update((i) => Math.max(0, i - 1)); }
  next(): void { this.currentQuestionIndex.update((i) => Math.min(this.drawnQuestions().length - 1, i + 1)); }

  submit(): void {
    const attempt = this.quizService.grade(this.drawnQuestions(), this.answers(), this.topicId, this.bankVersion);
    this.progress.recordQuizAttempt(attempt);
    this.attempt.set(attempt);
    this.phase.set('result');
  }

  goToComplete(): void {
    this.router.navigate(['/learn', this.topicId, 'complete']);
  }
}
