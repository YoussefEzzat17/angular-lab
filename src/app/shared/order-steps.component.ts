import { ChangeDetectionStrategy, Component, computed, input, linkedSignal, signal } from '@angular/core';

/** A starting order that is never already solved: rotate by two (swap, for a pair). */
export function startingOrder(count: number): number[] {
  if (count < 2) {
    return Array.from({ length: count }, (_, i) => i);
  }
  if (count === 2) {
    return [1, 0];
  }
  return Array.from({ length: count }, (_, i) => (i + 2) % count);
}

/**
 * "Put the steps in order": the steps start shuffled, the learner moves them with the arrow buttons
 * (keyboard and touch friendly) and checks. A wrong check only says how many are in the right place.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-order-steps',
  standalone: true,
  template: `
    <ol class="mt-4 space-y-2" data-testid="order-list">
      @for (stepIndex of order(); track stepIndex; let i = $index) {
        <li
          class="flex items-center gap-3 rounded-xl border px-3 py-2"
          [class]="rowClass(i)"
          [attr.data-testid]="'order-row-' + i"
        >
          <span class="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-stone-800 text-xs font-bold text-stone-300" aria-hidden="true">{{ i + 1 }}</span>
          <span class="min-w-0 flex-1 text-sm text-stone-100" data-testid="order-text">{{ steps()[stepIndex] }}</span>
          <span class="flex shrink-0 gap-1">
            <button
              type="button"
              [attr.data-testid]="'order-up-' + i"
              [attr.aria-label]="'Move ' + steps()[stepIndex] + ' up'"
              (click)="move(i, -1)"
              class="grid h-11 w-11 place-items-center rounded-lg border border-stone-700 text-stone-300 hover:bg-stone-800"
            >↑</button>
            <button
              type="button"
              [attr.data-testid]="'order-down-' + i"
              [attr.aria-label]="'Move ' + steps()[stepIndex] + ' down'"
              (click)="move(i, 1)"
              class="grid h-11 w-11 place-items-center rounded-lg border border-stone-700 text-stone-300 hover:bg-stone-800"
            >↓</button>
          </span>
        </li>
      }
    </ol>

    <div class="mt-4 flex flex-wrap items-center gap-3">
      <button
        type="button"
        data-testid="order-check"
        (click)="check()"
        class="min-h-11 rounded-xl bg-gold-500 px-4 text-sm font-semibold text-white transition hover:bg-gold-400"
      >
        Check order
      </button>
      <button
        type="button"
        data-testid="order-reset"
        (click)="reset()"
        class="min-h-11 rounded-xl border border-stone-600 px-4 text-sm font-semibold text-stone-200 hover:bg-stone-800"
      >
        Start over
      </button>
    </div>

    @if (checked()) {
      <div
        class="mt-4 rounded-xl p-4 text-sm"
        [class]="solved() ? 'bg-emerald-500/10 text-emerald-200' : 'bg-gold-500/10 text-stone-200'"
        role="status"
        aria-live="polite"
        data-testid="order-result"
      >
        @if (solved()) {
          <p class="font-semibold">That is the right order.</p>
          <p class="mt-1 text-stone-300">{{ explanation() }}</p>
        } @else {
          <p class="font-semibold">{{ rightCount() }} of {{ steps().length }} steps are in the right place.</p>
          <p class="mt-1 text-stone-300">The green ones are right. Move the others and check again.</p>
        }
      </div>
    }
  `,
})
export class OrderStepsComponent {
  /** The steps in their correct order. */
  readonly steps = input.required<string[]>();
  /** Shown once the order is right. */
  readonly explanation = input.required<string>();

  /** `order()[position]` is the index into `steps()` currently shown at that position. */
  protected readonly order = linkedSignal(() => startingOrder(this.steps().length));
  protected readonly checked = signal(false);

  protected readonly rightCount = computed(() => this.order().filter((stepIndex, position) => stepIndex === position).length);
  protected readonly solved = computed(() => this.rightCount() === this.steps().length);

  move(position: number, delta: -1 | 1): void {
    const target = position + delta;
    if (target < 0 || target >= this.order().length) {
      return;
    }
    this.order.update((order) => {
      const next = [...order];
      [next[position], next[target]] = [next[target], next[position]];
      return next;
    });
    this.checked.set(false);
  }

  check(): void {
    this.checked.set(true);
  }

  reset(): void {
    this.order.set(startingOrder(this.steps().length));
    this.checked.set(false);
  }

  protected rowClass(position: number): string {
    if (!this.checked()) {
      return 'border-stone-800 bg-stone-900';
    }
    return this.order()[position] === position ? 'border-emerald-400 bg-emerald-500/10' : 'border-stone-800 bg-stone-900';
  }
}
