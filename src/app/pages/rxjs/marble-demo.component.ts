import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { Observable, debounceTime, filter, map, scan, take } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

export type OperatorId = 'map' | 'filter' | 'debounce' | 'take' | 'scan';

export interface Marble {
  frame: number;
  value: number;
}

export interface Timeline {
  marbles: Marble[];
  /** Frame at which the stream completed, or null if it never did. */
  complete: number | null;
}

export interface OperatorOption {
  id: OperatorId;
  label: string;
  code: string;
  blurb: string;
}

export const OPERATORS: OperatorOption[] = [
  { id: 'map', label: 'map', code: 'map(v => v * 10)', blurb: 'Transforms every value. One in, one out, at the same moment.' },
  { id: 'filter', label: 'filter', code: 'filter(v => v % 2 === 0)', blurb: 'Lets only the matching values through and silently drops the rest.' },
  { id: 'debounce', label: 'debounceTime(3)', code: 'debounceTime(3)', blurb: 'Waits until 3 frames pass with no new value, then emits the last one. This is the search box operator.' },
  { id: 'take', label: 'take(2)', code: 'take(2)', blurb: 'Takes the first 2 values and then completes, which also unsubscribes from the source.' },
  { id: 'scan', label: 'scan (running sum)', code: 'scan((sum, v) => sum + v, 0)', blurb: 'Like reduce, but it emits the running total after every value.' },
];

export const INPUTS: { id: string; label: string; marble: string }[] = [
  { id: 'steady', label: 'Steady', marble: 'a-b-c-d-e-|' },
  { id: 'burst', label: 'Burst then pause', marble: 'a-b-c----d-e---|' },
];

const VALUES: Record<string, number> = { a: 1, b: 2, c: 3, d: 4, e: 5 };

/** Reads a marble string: one character is one frame, letters are values, - is nothing and | is completion. */
export function parseMarble(marble: string): Timeline {
  const marbles: Marble[] = [];
  let complete: number | null = null;
  [...marble].forEach((ch, frame) => {
    if (ch === '|') {
      complete = frame;
    } else if (ch in VALUES) {
      marbles.push({ frame, value: VALUES[ch] });
    }
  });
  return { marbles, complete };
}

function pipeFor(id: OperatorId): (source: Observable<number>) => Observable<number> {
  switch (id) {
    case 'map':
      return (s) => s.pipe(map((v) => v * 10));
    case 'filter':
      return (s) => s.pipe(filter((v) => v % 2 === 0));
    case 'debounce':
      return (s) => s.pipe(debounceTime(3));
    case 'take':
      return (s) => s.pipe(take(2));
    case 'scan':
      return (s) => s.pipe(scan((sum, v) => sum + v, 0));
  }
}

/** Runs the real operator on a virtual clock, so one frame costs no real time. */
export function runOperator(inputMarble: string, id: OperatorId): Timeline {
  const marbles: Marble[] = [];
  let complete: number | null = null;
  const scheduler = new TestScheduler(() => undefined);

  scheduler.run(({ cold, flush }) => {
    pipeFor(id)(cold<number>(inputMarble, VALUES)).subscribe({
      next: (value) => marbles.push({ frame: scheduler.now(), value }),
      complete: () => (complete = scheduler.now()),
    });
    flush();
  });

  return { marbles, complete };
}

/** Two timelines, the stream going in and the stream coming out, drawn from the real operator running. */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-marble-demo',
  standalone: true,
  template: `
    <div class="mt-4 flex flex-wrap gap-2" role="group" aria-label="Operator">
      @for (op of operators; track op.id) {
        <button
          type="button"
          [attr.data-testid]="'op-' + op.id"
          [attr.aria-pressed]="operator() === op.id"
          (click)="operator.set(op.id)"
          class="min-h-11 rounded-xl border px-4 font-mono text-sm"
          [class]="operator() === op.id ? 'border-gold-400 bg-gold-500/15 text-gold-300' : 'border-stone-700 text-stone-300 hover:bg-stone-800'"
        >
          {{ op.label }}
        </button>
      }
    </div>
    <div class="mt-2 flex flex-wrap gap-2" role="group" aria-label="Input stream">
      @for (input of inputs; track input.id) {
        <button
          type="button"
          [attr.data-testid]="'input-' + input.id"
          [attr.aria-pressed]="inputId() === input.id"
          (click)="inputId.set(input.id)"
          class="min-h-11 rounded-xl border px-4 text-sm"
          [class]="inputId() === input.id ? 'border-emerald-400 text-emerald-300' : 'border-stone-700 text-stone-300 hover:bg-stone-800'"
        >
          {{ input.label }} <span class="font-mono text-xs text-stone-500">{{ input.marble }}</span>
        </button>
      }
    </div>

    <p class="mt-3 text-sm text-stone-400" data-testid="op-blurb">{{ current().blurb }}</p>
    <pre class="mt-2 overflow-x-auto rounded-xl bg-stone-950 p-3 text-xs text-gold-200">source$.pipe({{ current().code }})</pre>

    <div class="mt-4 overflow-x-auto rounded-xl bg-stone-950 p-4">
      <p class="font-mono text-xs text-stone-500">in</p>
      <div class="relative mt-1 h-10" [style.width.px]="width()" data-testid="timeline-in" aria-hidden="true">
        <div class="absolute left-0 right-0 top-1/2 h-px bg-stone-700"></div>
        @for (m of source().marbles; track m.frame) {
          <span class="absolute top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-300 ring-1 ring-emerald-400" [style.left.px]="x(m.frame)">{{ m.value }}</span>
        }
        @if (source().complete !== null) {
          <span class="absolute top-1/2 h-6 w-0.5 -translate-y-1/2 bg-stone-400" [style.left.px]="x(source().complete!) + 13"></span>
        }
      </div>
      <p class="mt-3 font-mono text-xs text-stone-500">out</p>
      <div class="relative mt-1 h-10" [style.width.px]="width()" data-testid="timeline-out" aria-hidden="true">
        <div class="absolute left-0 right-0 top-1/2 h-px bg-stone-700"></div>
        @for (m of result().marbles; track m.frame + '-' + m.value) {
          <span class="absolute top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full bg-gold-500/20 text-xs font-bold text-gold-300 ring-1 ring-gold-400" [style.left.px]="x(m.frame)">{{ m.value }}</span>
        }
        @if (result().complete !== null) {
          <span class="absolute top-1/2 h-6 w-0.5 -translate-y-1/2 bg-stone-400" [style.left.px]="x(result().complete!) + 13"></span>
        }
      </div>
    </div>
    <p class="mt-3 rounded-xl bg-stone-950 p-3 text-sm text-stone-300" data-testid="marble-summary">
      In: <strong class="text-emerald-300">{{ values(source()) }}</strong> · Out: <strong class="text-gold-300">{{ values(result()) }}</strong>
    </p>
  `,
})
export class MarbleDemoComponent {
  readonly operators = OPERATORS;
  readonly inputs = INPUTS;
  readonly operator = signal<OperatorId>('map');
  readonly inputId = signal('steady');

  readonly current = computed(() => OPERATORS.find((o) => o.id === this.operator()) ?? OPERATORS[0]);
  private readonly inputMarble = computed(() => (INPUTS.find((i) => i.id === this.inputId()) ?? INPUTS[0]).marble);
  readonly source = computed(() => parseMarble(this.inputMarble()));
  readonly result = computed(() => runOperator(this.inputMarble(), this.operator()));

  private readonly step = 28;

  x(frame: number): number {
    return frame * this.step;
  }

  width(): number {
    const last = Math.max(this.source().complete ?? 0, this.result().complete ?? 0, ...this.result().marbles.map((m) => m.frame));
    return (last + 1) * this.step + 16;
  }

  values(t: Timeline): string {
    return t.marbles.length ? t.marbles.map((m) => m.value).join(', ') : 'nothing';
  }
}
