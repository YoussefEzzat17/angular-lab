import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { CodeBlockDirective } from './code-block.directive';

/** "A mistake beginners make": the wrong code beside the right code, and why (projected text) underneath. */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-common-mistake',
  standalone: true,
  imports: [CodeBlockDirective],
  host: { class: 'block min-w-0' },
  template: `
    <section class="rounded-2xl border border-stone-800 bg-stone-900 p-6 shadow-card" [attr.aria-label]="'Common mistake: ' + title()">
      <p class="text-xs font-bold tracking-wider text-rose-300">COMMON MISTAKE</p>
      <h3 class="mt-2 text-lg font-bold text-stone-100">{{ title() }}</h3>
      <div class="mt-4 grid min-w-0 gap-4 md:grid-cols-2">
        <div class="min-w-0">
          <p class="mb-2 text-xs font-bold text-rose-300">✕ Avoid</p>
          <pre [appCode]="wrong()"></pre>
        </div>
        <div class="min-w-0">
          <p class="mb-2 text-xs font-bold text-emerald-300">✓ Do this</p>
          <pre [appCode]="right()"></pre>
        </div>
      </div>
      <div class="mt-4 max-w-[60ch] text-sm text-stone-400"><ng-content /></div>
    </section>
  `,
})
export class CommonMistakeComponent {
  readonly title = input.required<string>();
  readonly wrong = input.required<string>();
  readonly right = input.required<string>();
}
