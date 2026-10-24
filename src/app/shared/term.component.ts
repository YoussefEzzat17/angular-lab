import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

import { GLOSSARY } from '../core/data/glossary';

let nextId = 1;

/**
 * Wraps a hard word and explains it in plain language on hover, focus or tap:
 * `<app-term term="injector">injector</app-term>`. Press Escape or tap again to close.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-term',
  standalone: true,
  host: {
    class: 'relative inline-block',
    '(mouseenter)': 'open.set(true)',
    '(mouseleave)': 'open.set(false)',
    '(document:keydown.escape)': 'open.set(false)',
  },
  template: `
    <button
      type="button"
      data-testid="term-button"
      class="cursor-help border-b border-dotted border-gold-400 text-inherit"
      [attr.aria-expanded]="open()"
      [attr.aria-describedby]="open() && entry() ? tooltipId : null"
      (click)="open.set(!open())"
      (focus)="open.set(true)"
      (blur)="open.set(false)"
    >
      <ng-content />
    </button>
    @if (open() && entry(); as e) {
      <span
        role="tooltip"
        data-testid="term-tooltip"
        [id]="tooltipId"
        class="absolute left-0 top-full z-30 mt-1 w-64 max-w-[80vw] rounded-xl border border-stone-700 bg-stone-950 p-3 text-left text-xs font-normal leading-relaxed text-stone-200 shadow-float-xl"
      >
        <strong class="block text-gold-300">{{ e.title }}</strong>
        {{ e.text }}
      </span>
    }
  `,
})
export class TermComponent {
  /** Key in the glossary, e.g. "injector". */
  readonly term = input.required<string>();

  protected readonly open = signal(false);
  protected readonly tooltipId = `term-tip-${nextId++}`;
  protected readonly entry = computed(() => GLOSSARY[this.term()] ?? null);
}
