import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-title-preview',
  standalone: true,
  template: `
    <article class="rounded-2xl border border-gold-400/30 bg-stone-900 p-5">
      <p class="text-xs font-bold tracking-wider text-gold-300">CHILD COMPONENT</p>
      <h3 class="mt-2 text-xl font-bold">{{ title }}</h3>
      <p class="mt-2 text-sm text-stone-400">This title arrived from the parent using <code class="text-gold-300">@Input()</code>.</p>
      <button (click)="addToWatchlist.emit(title)" class="mt-4 rounded-xl bg-gold-500 px-4 py-2 text-sm font-semibold text-white hover:bg-gold-400">
        Add to watchlist
      </button>
    </article>
  `,
})
export class TitlePreviewComponent {
  @Input({ required: true }) title = '';
  @Output() addToWatchlist = new EventEmitter<string>();
}
