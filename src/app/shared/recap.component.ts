import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { IconComponent } from './icon.component';

/** The end of a section: the few things to remember, as a short checklist. Keep it to three points. */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-recap',
  standalone: true,
  imports: [IconComponent],
  host: { class: 'block min-w-0' },
  template: `
    <section class="rounded-2xl border border-gold-400/50 bg-stone-900 p-6 shadow-featured" aria-label="Recap">
      <p class="text-xs font-bold tracking-wider text-gold-300">REMEMBER</p>
      <ul class="mt-3 space-y-2">
        @for (item of items(); track item) {
          <li class="flex items-start gap-2.5 text-sm text-stone-200">
            <app-icon name="check" class="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
            <span>{{ item }}</span>
          </li>
        }
      </ul>
    </section>
  `,
})
export class RecapComponent {
  readonly items = input.required<string[]>();
}
