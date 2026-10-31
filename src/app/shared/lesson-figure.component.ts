import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * A picture with a caption. Project an inline SVG (drawn with theme tokens so it follows light and dark mode).
 * `description` is what a screen reader says in place of the picture, so write what it shows, not "diagram".
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-lesson-figure',
  standalone: true,
  host: { class: 'block min-w-0' },
  template: `
    <figure class="m-0 rounded-2xl border border-stone-800 bg-stone-900 p-4 shadow-card">
      <div role="img" [attr.aria-label]="description()" class="mx-auto max-w-xl [&>svg]:h-auto [&>svg]:w-full"><ng-content /></div>
      <figcaption class="mt-3 text-center text-sm text-stone-400">{{ caption() }}</figcaption>
    </figure>
  `,
})
export class LessonFigureComponent {
  readonly caption = input.required<string>();
  readonly description = input.required<string>();
}
