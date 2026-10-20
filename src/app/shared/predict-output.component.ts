import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

import { CodeBlockDirective } from './code-block.directive';

export interface PredictOption {
  id: string;
  text: string;
}

export interface PredictChallenge {
  question: string;
  code: string;
  options: PredictOption[];
  /** The id of the right option. */
  correct: string;
  explanation: string;
}

/**
 * "Predict the output": show a few lines of code, let the learner commit to an answer,
 * then reveal whether they were right and why. Nothing is revealed until they choose.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-predict-output',
  standalone: true,
  imports: [CodeBlockDirective],
  template: `
    <p class="mt-3 text-sm font-semibold text-stone-100" data-testid="predict-question">{{ challenge().question }}</p>
    <pre class="mt-3 overflow-x-auto rounded-xl bg-stone-950 p-4 text-xs text-gold-200">{{ challenge().code }}</pre>

    <div class="mt-4 grid gap-2" role="radiogroup" [attr.aria-label]="challenge().question">
      @for (option of challenge().options; track option.id) {
        <button
          type="button"
          role="radio"
          [attr.data-testid]="'predict-option-' + option.id"
          [attr.aria-checked]="selected() === option.id"
          (click)="choose(option.id)"
          class="min-h-11 rounded-xl border px-4 py-2 text-left font-mono text-sm transition"
          [class]="optionClass(option.id)"
        >
          {{ option.text }}
        </button>
      }
    </div>

    <div class="mt-4 flex flex-wrap items-center gap-3">
      @if (!checked()) {
        <button
          type="button"
          data-testid="predict-check"
          (click)="check()"
          class="min-h-11 rounded-xl bg-gold-solid px-4 text-sm font-semibold text-white transition hover:bg-gold-solid-hover"
        >
          Check my answer
        </button>
      } @else {
        <button
          type="button"
          data-testid="predict-retry"
          (click)="reset()"
          class="min-h-11 rounded-xl border border-stone-600 px-4 text-sm font-semibold text-stone-200 hover:bg-stone-800"
        >
          Try again
        </button>
      }
      @if (error()) {
        <p class="text-sm text-rose-300" role="alert" data-testid="predict-error">{{ error() }}</p>
      }
    </div>

    @if (checked()) {
      <div
        class="mt-4 rounded-xl p-4 text-sm"
        [class]="isRight() ? 'bg-emerald-500/10 text-emerald-200' : 'bg-rose-500/10 text-rose-200'"
        role="status"
        aria-live="polite"
        data-testid="predict-result"
      >
        <p class="font-semibold">{{ isRight() ? 'Correct.' : 'Not quite.' }}</p>
        <p class="mt-1 text-stone-300">{{ challenge().explanation }}</p>
      </div>
    }
  `,
})
export class PredictOutputComponent {
  readonly challenge = input.required<PredictChallenge>();

  protected readonly selected = signal<string | null>(null);
  protected readonly checked = signal(false);
  protected readonly error = signal('');

  protected readonly isRight = computed(() => this.selected() === this.challenge().correct);

  choose(id: string): void {
    if (this.checked()) {
      return;
    }
    this.selected.set(id);
    this.error.set('');
  }

  check(): void {
    if (this.selected() === null) {
      this.error.set('Pick an answer first.');
      return;
    }
    this.checked.set(true);
  }

  reset(): void {
    this.selected.set(null);
    this.checked.set(false);
    this.error.set('');
  }

  protected optionClass(id: string): string {
    if (this.checked()) {
      if (id === this.challenge().correct) {
        return 'border-emerald-400 bg-emerald-500/10 text-emerald-200';
      }
      if (id === this.selected()) {
        return 'border-rose-400 bg-rose-500/10 text-rose-200';
      }
      return 'border-stone-800 text-stone-500';
    }
    return this.selected() === id ? 'border-gold-400 bg-gold-500/15 text-gold-200' : 'border-stone-700 text-stone-200 hover:bg-stone-800';
  }
}
