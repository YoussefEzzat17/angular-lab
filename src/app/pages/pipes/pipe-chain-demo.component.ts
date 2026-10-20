import { LowerCasePipe, SlicePipe, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

export type StepId = 'uppercase' | 'lowercase' | 'titlecase' | 'slice' | 'truncate';

export interface PipeStep {
  id: StepId;
  /** How it is written after the | in a template. */
  syntax: string;
  apply: (value: string) => string;
}

const upper = new UpperCasePipe();
const lower = new LowerCasePipe();
const title = new TitleCasePipe();
const slice = new SlicePipe();

export const STEPS: PipeStep[] = [
  { id: 'uppercase', syntax: 'uppercase', apply: (v) => upper.transform(v) },
  { id: 'lowercase', syntax: 'lowercase', apply: (v) => lower.transform(v) },
  { id: 'titlecase', syntax: 'titlecase', apply: (v) => title.transform(v) },
  { id: 'slice', syntax: 'slice:0:8', apply: (v) => slice.transform(v, 0, 8) },
  { id: 'truncate', syntax: 'truncate:8', apply: (v) => (v.length > 8 ? v.slice(0, 8) + '...' : v) },
];

export interface ChainStage {
  /** The pipe that produced this value, or null for the starting value. */
  syntax: string | null;
  value: string;
}

/** Runs the value through the chosen pipes in order and keeps every stage, so each hand-over can be shown. Pure. */
export function runChain(value: string, chosen: StepId[]): ChainStage[] {
  const stages: ChainStage[] = [{ syntax: null, value }];
  let current = value;
  for (const id of chosen) {
    const step = STEPS.find((s) => s.id === id)!;
    current = step.apply(current);
    stages.push({ syntax: step.syntax, value: current });
  }
  return stages;
}

/** The template that would produce the chain, e.g. {{ title | uppercase | slice:0:8 }}. */
export function chainTemplate(chosen: StepId[]): string {
  return `{{ title${chosen.map((id) => ' | ' + STEPS.find((s) => s.id === id)!.syntax).join('')} }}`;
}

/** Pick pipes one after another and watch the value change at every station. The order you click is the order they run. */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-pipe-chain-demo',
  standalone: true,
  template: `
    <label class="mt-4 block text-sm font-semibold text-stone-200" for="chain-input">The raw value in your component</label>
    <input
      id="chain-input"
      data-testid="chain-input"
      [value]="text()"
      (input)="onType($event)"
      class="mt-2 w-full rounded-xl border border-stone-700 bg-stone-900 px-3 py-2.5 text-stone-100 focus:border-gold-400 focus:outline-none"
      autocomplete="off"
    />

    <p class="mt-4 text-xs font-bold tracking-wider text-stone-500">CLICK PIPES IN THE ORDER YOU WANT THEM TO RUN</p>
    <div class="mt-2 flex flex-wrap gap-2" role="group" aria-label="Pipes to add to the chain">
      @for (step of steps; track step.id) {
        <button
          type="button"
          [attr.data-testid]="'step-' + step.id"
          [attr.aria-pressed]="position(step.id) > 0"
          (click)="toggle(step.id)"
          class="min-h-11 rounded-xl border px-3 font-mono text-sm transition"
          [class]="position(step.id) > 0 ? 'border-gold-400 bg-gold-500/15 text-gold-300' : 'border-stone-700 text-stone-300 hover:bg-stone-800'"
        >
          @if (position(step.id) > 0) {
            <span class="mr-1 text-xs font-bold" data-testid="step-position">{{ position(step.id) }}.</span>
          }
          {{ step.syntax }}
        </button>
      }
      <button type="button" data-testid="chain-clear" (click)="chosen.set([])" class="min-h-11 rounded-xl px-3 text-sm font-semibold text-stone-400 hover:text-stone-200">Clear</button>
    </div>

    <pre class="mt-4 overflow-x-auto rounded-xl bg-stone-950 p-4 text-xs text-gold-200" data-testid="chain-template">{{ template() }}</pre>

    <ol class="mt-3 space-y-2" aria-label="The value after each pipe">
      @for (stage of stages(); track $index) {
        <li class="flex flex-wrap items-center gap-3 rounded-xl bg-stone-950 px-3 py-2 text-sm">
          <span class="w-28 shrink-0 font-mono text-xs text-stone-500">{{ stage.syntax ? '| ' + stage.syntax : 'starts as' }}</span>
          <span class="font-semibold" [class]="$last ? 'text-emerald-300' : 'text-stone-200'" [attr.data-testid]="'stage-' + $index">{{ stage.value || '(empty)' }}</span>
        </li>
      }
    </ol>
    <p class="mt-3 text-xs text-stone-500">The text in your component never changes. Only what the page shows does.</p>
  `,
})
export class PipeChainDemoComponent {
  readonly steps = STEPS;
  readonly text = signal('castle in the sky');
  readonly chosen = signal<StepId[]>([]);

  protected readonly stages = computed(() => runChain(this.text(), this.chosen()));
  protected readonly template = computed(() => chainTemplate(this.chosen()));

  protected position(id: StepId): number {
    return this.chosen().indexOf(id) + 1;
  }

  protected toggle(id: StepId): void {
    this.chosen.update((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]));
  }

  protected onType(event: Event): void {
    this.text.set((event.target as HTMLInputElement).value);
  }
}
