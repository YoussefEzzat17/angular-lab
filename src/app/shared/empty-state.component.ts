import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Centered "nothing here yet" card with an optional call-to-action link.
 * Spacing from the surrounding layout is the parent's job — put `class="mt-8"` on the host.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-empty-state',
  standalone: true,
  imports: [RouterLink],
  host: { class: 'block' },
  template: `
    <div class="rounded-3xl border border-stone-800 bg-stone-900 p-10 text-center">
      @if (icon()) {
        <p class="text-4xl" aria-hidden="true">{{ icon() }}</p>
      }
      <h2 class="mt-3 text-xl font-bold">{{ heading() }}</h2>
      <p class="mt-2 text-stone-400">{{ message() }}</p>
      @if (ctaLabel() && ctaLink()) {
        <a
          [routerLink]="ctaLink()"
          data-testid="empty-state-cta"
          class="mt-6 inline-block rounded-xl bg-gold-solid px-5 py-3 font-semibold text-white transition hover:bg-gold-solid-hover"
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
  readonly icon = input<string>();
  readonly ctaLabel = input<string>();
  readonly ctaLink = input<string>();
}
