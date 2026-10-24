import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TOPICS } from '../../core/data/topics';
import { ProgressService } from '../../core/services/progress.service';
import { IconComponent } from '../../shared/icon.component';
import { QUIZ_RULES, type TopicId } from '../../core/models/learning.models';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterLink, IconComponent],
  template: `
    @if (topic(); as t) {
      <section class="mx-auto max-w-2xl px-4 py-16 sm:px-6 text-center">
        <!-- Completion badge (pops in; still under reduced motion) -->
        <span class="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-500/15 text-emerald-400 shadow-card" aria-hidden="true" style="animation: pop 0.4s ease-out">
          <app-icon name="check" class="h-10 w-10" />
        </span>
        <h1 class="mt-6 text-3xl font-bold sm:text-4xl">Topic Complete!</h1>
        <p class="mt-3 text-xl font-semibold text-gold-400">{{ t.title }}</p>
        <p class="mt-4 text-stone-400">You've completed all sections and passed the quiz. Excellent work!</p>

        @if (bestScore() !== undefined) {
          <div class="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-5 py-2 text-emerald-400">
            <app-icon name="check" class="h-4 w-4" />
            <span class="font-semibold">Best score: {{ bestScore() }}/{{ quizSize }}</span>
          </div>
        }

        <!-- Next topic -->
        @if (nextTopic(); as next) {
          <div class="card mt-10">
            <p class="text-sm font-semibold text-gold-400">UP NEXT</p>
            <p class="mt-2 text-xl font-bold">{{ next.title }}</p>
            <p class="mt-1 text-sm text-stone-400">{{ next.description }}</p>
            <a [routerLink]="['/learn', next.id]"
               class="btn-primary mt-5">
              Start {{ next.title }} <app-icon name="chevron-right" class="h-4 w-4" />
            </a>
          </div>
        } @else {
          <div class="mt-10 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6">
            <p class="text-2xl font-bold text-emerald-400">You've completed all topics!</p>
            <a routerLink="/" class="btn-primary mt-5">
              Back to Home
            </a>
          </div>
        }

        <div class="mt-8 flex justify-center gap-4">
          <a [routerLink]="['/learn', t.id]"
             class="btn-secondary">
            Review topic
          </a>
        </div>
      </section>
    }
  `,
  styles: [`
    @keyframes pop { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
  `],
})
export class TopicCompleteComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly progress = inject(ProgressService);

  /** Set on the parent topic route in learn.routes.ts. */
  private readonly topicId = this.route.snapshot.data['topicId'] as TopicId;

  protected readonly quizSize = QUIZ_RULES.draw;

  protected readonly topic = computed(() => TOPICS.find((t) => t.id === this.topicId) ?? null);

  protected readonly nextTopic = computed(() => {
    const t = this.topic();
    if (!t) return null;
    const idx = TOPICS.findIndex((x) => x.id === t.id);
    return idx >= 0 && idx < TOPICS.length - 1 ? TOPICS[idx + 1] : null;
  });

  protected readonly bestScore = computed(() => {
    const t = this.topic();
    return t ? this.progress.getBestScore(t.id) : undefined;
  });
}
