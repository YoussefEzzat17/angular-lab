import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

export type BindingKind = 'interpolation' | 'property' | 'event' | 'two-way';

export interface BindingInfo {
  id: BindingKind;
  snippet: string;
  name: string;
  /** Which way the data moves. */
  direction: 'down' | 'up' | 'both';
  directionText: string;
  angularDoes: string;
  useFor: string;
}

export const BINDINGS: BindingInfo[] = [
  {
    id: 'interpolation',
    snippet: '{{ title }}',
    name: 'Interpolation',
    direction: 'down',
    directionText: 'class → template',
    angularDoes: 'Puts the value in the page as text, and updates the text whenever the value changes.',
    useFor: 'Showing something: a name, a price, a count.',
  },
  {
    id: 'property',
    snippet: '[disabled]="busy"',
    name: 'Property binding',
    direction: 'down',
    directionText: 'class → template',
    angularDoes: 'Sets a property of the element to the real value, so a boolean stays a boolean.',
    useFor: 'Controlling an element: disabled, hidden, src, a CSS class.',
  },
  {
    id: 'event',
    snippet: '(click)="save()"',
    name: 'Event binding',
    direction: 'up',
    directionText: 'template → class',
    angularDoes: 'Listens for the event and runs your method when it happens. $event holds the event details.',
    useFor: 'Reacting to the user: a click, a key, an input change.',
  },
  {
    id: 'two-way',
    snippet: '[(ngModel)]="name"',
    name: 'Two-way binding',
    direction: 'both',
    directionText: 'class ↔ template',
    angularDoes: 'Shows the value in the input and writes every change back into the class: a property binding and an event binding in one.',
    useFor: 'Form fields where the user edits a value you also show.',
  },
];

/** Pick a binding and see its syntax, which way the data flows and what it is for. */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-binding-decoder-demo',
  standalone: true,
  template: `
    <div class="mt-4 grid gap-2 sm:grid-cols-2" role="group" aria-label="Binding syntax">
      @for (b of bindings; track b.id) {
        <button
          type="button"
          [attr.data-testid]="'binding-' + b.id"
          [attr.aria-pressed]="selectedId() === b.id"
          (click)="selectedId.set(b.id)"
          class="min-h-11 rounded-xl border px-4 py-2 text-left font-mono text-sm transition"
          [class]="selectedId() === b.id ? 'border-gold-400 bg-gold-500/15 text-gold-300' : 'border-stone-700 text-stone-200 hover:bg-stone-800'"
        >
          {{ b.snippet }}
        </button>
      }
    </div>

    <div class="mt-4 rounded-xl bg-stone-950 p-4" role="status" aria-live="polite">
      <p class="text-lg font-bold text-stone-100" data-testid="decoder-name">{{ current().name }}</p>

      <div class="mt-3 flex items-center gap-3 text-sm" data-testid="decoder-flow">
        <span class="rounded-lg border border-stone-700 px-3 py-1.5 text-stone-200">Class</span>
        <span class="text-2xl text-gold-300" aria-hidden="true">{{ arrow() }}</span>
        <span class="rounded-lg border border-stone-700 px-3 py-1.5 text-stone-200">Template</span>
        <span class="text-stone-400" data-testid="decoder-direction">{{ current().directionText }}</span>
      </div>

      <p class="mt-3 text-sm text-stone-300"><strong class="text-stone-100">Angular:</strong> <span data-testid="decoder-does">{{ current().angularDoes }}</span></p>
      <p class="mt-1 text-sm text-stone-300"><strong class="text-stone-100">Use it for:</strong> {{ current().useFor }}</p>
    </div>
  `,
})
export class BindingDecoderDemoComponent {
  readonly bindings = BINDINGS;
  readonly selectedId = signal<BindingKind>('interpolation');
  protected readonly current = computed(() => BINDINGS.find((b) => b.id === this.selectedId())!);
  protected readonly arrow = computed(() => ({ down: '→', up: '←', both: '↔' })[this.current().direction]);
}
