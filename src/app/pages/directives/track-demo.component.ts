import { ChangeDetectionStrategy, Component, DestroyRef, Injectable, inject, input, signal } from '@angular/core';

export interface FilmItem {
  id: number;
  title: string;
}

export type TrackMode = 'id' | 'index';

export const INITIAL_FILMS: FilmItem[] = [
  { id: 1, title: 'Castle in the Sky' },
  { id: 2, title: 'Totoro' },
  { id: 3, title: 'Spirited Away' },
  { id: 4, title: 'Ponyo' },
];

/** Counts how many rows were really built and thrown away, so the lesson can show the cost of the wrong track. */
@Injectable()
export class TrackStats {
  readonly created = signal(0);
  readonly destroyed = signal(0);
}

/** One row with a note field the learner can type in: a stand-in for any state that lives inside a row. */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-track-row',
  standalone: true,
  template: `
    <li class="flex flex-wrap items-center gap-3 rounded-xl bg-stone-950 px-3 py-2" data-testid="track-row">
      <span class="w-44 shrink-0 text-sm font-semibold text-stone-100" data-testid="track-row-title">{{ item().title }}</span>
      <input
        type="text"
        data-testid="track-row-note"
        [attr.aria-label]="'Note for position ' + position()"
        placeholder="Type a note"
        class="min-w-0 flex-1 rounded-lg border border-stone-700 bg-stone-900 px-2 py-1.5 text-sm text-stone-100 focus:border-gold-400 focus:outline-none"
      />
    </li>
  `,
})
export class TrackRowComponent {
  readonly item = input.required<FilmItem>();
  readonly position = input.required<number>();

  constructor() {
    const stats = inject(TrackStats);
    stats.created.update((n) => n + 1);
    inject(DestroyRef).onDestroy(() => stats.destroyed.update((n) => n + 1));
  }
}

/**
 * Type a note in a row, then remove the first film. With `track item.id` the note stays with its film.
 * With `track $index` the row is reused for a different film, and the note ends up on the wrong one.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-track-demo',
  standalone: true,
  imports: [TrackRowComponent],
  providers: [TrackStats],
  template: `
    <div class="mt-4 flex flex-wrap gap-2" role="group" aria-label="What the list is tracked by">
      <button
        type="button"
        data-testid="track-id"
        [attr.aria-pressed]="mode() === 'id'"
        (click)="setMode('id')"
        class="min-h-11 rounded-xl border px-4 font-mono text-sm transition"
        [class]="mode() === 'id' ? 'border-gold-400 bg-gold-500/15 text-gold-300' : 'border-stone-700 text-stone-300 hover:bg-stone-800'"
      >
        track item.id
      </button>
      <button
        type="button"
        data-testid="track-index"
        [attr.aria-pressed]="mode() === 'index'"
        (click)="setMode('index')"
        class="min-h-11 rounded-xl border px-4 font-mono text-sm transition"
        [class]="mode() === 'index' ? 'border-gold-400 bg-gold-500/15 text-gold-300' : 'border-stone-700 text-stone-300 hover:bg-stone-800'"
      >
        track $index
      </button>
    </div>

    <ul class="mt-4 space-y-2" aria-label="Films">
      @if (mode() === 'id') {
        @for (item of films(); track item.id; let i = $index) {
          <app-track-row [item]="item" [position]="i + 1" />
        }
      } @else {
        @for (item of films(); track $index) {
          <app-track-row [item]="item" [position]="$index + 1" />
        }
      }
    </ul>

    <div class="mt-3 flex flex-wrap gap-2">
      <button type="button" data-testid="track-remove" (click)="removeFirst()" class="min-h-11 rounded-xl border border-stone-600 px-4 text-sm font-semibold text-stone-100 hover:bg-stone-800">Remove the first film</button>
      <button type="button" data-testid="track-reload" (click)="reload()" class="min-h-11 rounded-xl border border-stone-600 px-4 text-sm font-semibold text-stone-100 hover:bg-stone-800">Reload (same films, new objects)</button>
      <button type="button" data-testid="track-reset" (click)="reset()" class="min-h-11 rounded-xl px-4 text-sm font-semibold text-stone-400 hover:text-stone-200">Reset</button>
    </div>

    <p class="mt-3 rounded-xl bg-stone-950 p-3 text-sm text-stone-300" aria-live="polite">
      Rows built: <strong class="text-gold-300" data-testid="track-created">{{ stats.created() }}</strong>
      · Rows thrown away: <strong class="text-rose-300" data-testid="track-destroyed">{{ stats.destroyed() }}</strong>
    </p>
  `,
})
export class TrackDemoComponent {
  protected readonly stats = inject(TrackStats);
  readonly mode = signal<TrackMode>('id');
  readonly films = signal<FilmItem[]>(INITIAL_FILMS.map((f) => ({ ...f })));

  setMode(mode: TrackMode): void {
    // Switching the loop swaps one list for another: the old rows are destroyed and 4 new ones built.
    // That rebuild is not what the lesson measures, so the counters start pre-compensated to show 0 destroyed.
    if (mode === this.mode()) {
      return;
    }
    const oldRows = this.films().length;
    this.mode.set(mode);
    this.films.set(INITIAL_FILMS.map((f) => ({ ...f })));
    this.stats.created.set(0);
    this.stats.destroyed.set(-oldRows);
  }

  removeFirst(): void {
    this.films.update((list) => list.slice(1));
  }

  /** The same films, but brand-new objects, like a list that was fetched again from a server. */
  reload(): void {
    this.films.update((list) => list.map((f) => ({ ...f })));
  }

  reset(): void {
    this.films.set(INITIAL_FILMS.map((f) => ({ ...f })));
  }
}
