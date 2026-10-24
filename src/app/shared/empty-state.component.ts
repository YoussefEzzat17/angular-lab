import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ICON_NAMES, IconComponent, IconName } from './icon.component';

/**
 * Centered "nothing here yet" card with an optional call-to-action link.
 * Spacing from the surrounding layout is the parent's job — put `class="mt-8"` on the host.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-empty-state',
  standalone: true,
  imports: [RouterLink, IconComponent],
  host: { class: 'block' },
  template: `
    <div class="rounded-3xl border border-stone-800 bg-stone-900 p-10 text-center shadow-card">
      @if (iconName(); as name) {
        <app-icon [name]="name" class="mx-auto h-9 w-9 text-gold-400" />
      } @else if (icon()) {
        <p class="text-4xl" aria-hidden="true">{{ icon() }}</p>
      }
      <h2 class="mt-3 text-xl font-bold">{{ heading() }}</h2>
      <p class="mt-2 text-stone-400">{{ message() }}</p>
      @if (ctaLabel() && ctaLink()) {
        <a
          [routerLink]="ctaLink()"
          data-testid="empty-state-cta"
          class="btn-primary mt-6"
        >
          {{ ctaLabel() }}
        </a>
      }
    </div>
  `,
})
export class EmptyStateComponent {
  readonly heading = input.required<string>();
  readonly message = input.required<string>();
  /** An icon name from `app-icon` draws that icon; any other text (a symbol in the demo app) shows as it is. */
  readonly icon = input<string>();

  protected readonly iconName = computed(() => {
    const value = this.icon();
    return value && (ICON_NAMES as readonly string[]).includes(value) ? (value as IconName) : null;
  });
  readonly ctaLabel = input<string>();
  readonly ctaLink = input<string>();
}
