import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { CodeBlockDirective } from './code-block.directive';
import { OutputFrameComponent } from './output-frame.component';

/**
 * The code next to what it produces. The code goes in `code`; the live result is projected into the frame.
 * Side by side from md up, stacked on phones (code first, result under it).
 *
 *   <app-code-output [code]="snippet"><p>{{ price | currency }}</p></app-code-output>
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-code-output',
  standalone: true,
  imports: [CodeBlockDirective, OutputFrameComponent],
  host: { class: 'block min-w-0' },
  template: `
    <div class="grid min-w-0 items-start gap-4 md:grid-cols-2">
      <div class="min-w-0">
        <p class="mb-2 text-xs font-bold tracking-wider text-gold-300">CODE</p>
        <pre [appCode]="code()"></pre>
      </div>
      <div class="min-w-0">
        <p class="mb-2 text-xs font-bold tracking-wider text-emerald-300">WHAT THE USER SEES</p>
        <app-output-frame [address]="address()"><ng-content /></app-output-frame>
      </div>
    </div>
    @if (caption()) {
      <p class="mt-3 max-w-[60ch] text-sm text-stone-400">{{ caption() }}</p>
    }
  `,
})
export class CodeOutputComponent {
  readonly code = input.required<string>();
  readonly address = input('localhost:4200');
  readonly caption = input<string>();
}
