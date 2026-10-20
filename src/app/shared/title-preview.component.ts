import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/** The "child" in the Component Communication lesson: it receives a title with input() and reports a click with output(). */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-title-preview',
  standalone: true,
  template: `
    <article class="rounded-2xl border border-gold-400/30 bg-stone-900 p-5" data-testid="title-preview">
      <p class="text-xs font-bold tracking-wider text-gold-300">CHILD COMPONENT</p>
      <h3 class="mt-2 text-xl font-bold" data-testid="title-preview-title">{{ title() }}</h3>
      <p class="mt-2 text-sm text-stone-400">This title arrived from the parent through <code class="text-gold-300">input()</code>.</p>
      <button
        type="button"
        data-testid="title-preview-add"
        (click)="addToWatchlist.emit(title())"
        class="mt-4 rounded-xl bg-gold-solid px-4 py-2 text-sm font-semibold text-white hover:bg-gold-solid-hover"
      >
        Add to watchlist
      </button>
    </article>
  `,
})
export class TitlePreviewComponent {
  readonly title = input.required<string>();
  readonly addToWatchlist = output<string>();
}
