import { Component, input, output } from '@angular/core';
import type { QuizQuestion } from '../../core/models/learning.models';
import { CodeBlockDirective } from '../../shared/code-block.directive';

@Component({
  selector: 'app-quiz-question',
  standalone: true,
  imports: [CodeBlockDirective],
  template: `
    <div class="rounded-2xl border border-stone-800 bg-stone-900 p-6 sm:p-8">
      <p class="text-lg font-semibold text-stone-100 leading-snug">{{ question().prompt }}</p>
      @if (question().code) {
        <pre class="mt-4 overflow-x-auto rounded-xl bg-stone-950 p-4 text-xs text-gold-200">{{ question().code }}</pre>
      }
      <p class="mt-4 text-xs font-semibold uppercase tracking-wider text-stone-500">
        {{ question().type === 'multi' ? 'Select all that apply' : 'Select one' }}
      </p>
      <fieldset class="mt-3 space-y-2">
        <legend class="sr-only">{{ question().prompt }}</legend>
        @for (choice of question().choices; track choice.id) {
          <label
            class="flex cursor-pointer items-center gap-3 rounded-xl border border-stone-800 p-4 transition hover:border-gold-400/50 hover:bg-stone-800"
            [class.border-gold-400]="isSelected(choice.id)"
            [class.bg-gold-500/10]="isSelected(choice.id)"
          >
            @if (question().type === 'multi') {
              <input
                type="checkbox"
                [value]="choice.id"
                [checked]="isSelected(choice.id)"
                (change)="toggleMulti(choice.id)"
                class="h-4 w-4 rounded accent-gold-500"
              />
            } @else {
              <input
                type="radio"
                [name]="'q-' + question().id"
                [value]="choice.id"
                [checked]="isSelected(choice.id)"
                (change)="selectSingle(choice.id)"
                class="h-4 w-4 accent-gold-500"
              />
            }
            <span class="text-sm text-stone-200">{{ choice.text }}</span>
          </label>
        }
      </fieldset>
    </div>
  `,
})
export class QuizQuestionComponent {
  readonly question = input.required<QuizQuestion>();
  readonly answer = input<string[]>([]);
  readonly answerChange = output<string[]>();

  isSelected(choiceId: string): boolean { return (this.answer() ?? []).includes(choiceId); }

  selectSingle(choiceId: string): void { this.answerChange.emit([choiceId]); }

  toggleMulti(choiceId: string): void {
    const current = this.answer() ?? [];
    const next = current.includes(choiceId) ? current.filter((c) => c !== choiceId) : [...current, choiceId];
    this.answerChange.emit(next);
  }
}
