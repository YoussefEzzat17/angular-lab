import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * A small browser-window frame around a live result, so the learner can tell "this is what the user sees"
 * from "this is the code". Decorative chrome only: the dots are hidden from screen readers.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-output-frame',
  standalone: true,
  host: { class: 'block min-w-0' },
  template: `
    <div class="overflow-hidden rounded-xl border border-stone-700 bg-stone-950 shadow-card" role="group" [attr.aria-label]="label()">
      <div class="flex items-center gap-3 border-b border-stone-800 bg-stone-900 px-3 py-2">
        <span class="flex gap-1.5" aria-hidden="true">
          <span class="h-2.5 w-2.5 rounded-full bg-stone-600"></span>
          <span class="h-2.5 w-2.5 rounded-full bg-stone-600"></span>
          <span class="h-2.5 w-2.5 rounded-full bg-gold-400"></span>
        </span>
        <span class="min-w-0 flex-1 truncate rounded-md bg-stone-950 px-2.5 py-1 text-center font-mono text-[11px] text-stone-400">{{ address() }}</span>
      </div>
      <div class="p-4 text-sm text-stone-200"><ng-content /></div>
    </div>
  `,
})
export class OutputFrameComponent {
  /** The text in the fake address bar, e.g. "localhost:4200". */
  readonly address = input('localhost:4200');
  /** How a screen reader names the frame. */
  readonly label = input('Result in the browser');
}
