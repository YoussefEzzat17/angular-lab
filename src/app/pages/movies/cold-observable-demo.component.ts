import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { Observable, Subscription, defer, delay, of, shareReplay } from 'rxjs';

export const REQUEST_MS = 500;

const FILMS = ['Castle in the Sky', 'Grave of the Fireflies', 'My Neighbor Totoro'];

/** A pretend getFilms(): the "network call" counter goes up each time the request really starts. */
export function createFilmsSource(onRequest: () => void, shared: boolean): Observable<string[]> {
  const request$ = defer(() => {
    onRequest();
    return of(FILMS).pipe(delay(REQUEST_MS));
  });
  return shared ? request$.pipe(shareReplay(1)) : request$;
}

type Listener = 'A' | 'B';

/**
 * An Observable from HttpClient is cold: it does nothing until someone subscribes, and every subscriber
 * starts its own request. Two components, two network calls, unless you share the result.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-cold-observable-demo',
  standalone: true,
  template: `
    <div class="mt-4 flex flex-wrap gap-2" role="group" aria-label="How the service returns the data">
      <button
        type="button"
        data-testid="mode-plain"
        [attr.aria-pressed]="!shared()"
        (click)="setShared(false)"
        class="min-h-11 rounded-xl border px-4 text-sm font-semibold transition"
        [class]="!shared() ? 'border-gold-400 bg-gold-500/15 text-gold-300' : 'border-stone-700 text-stone-300 hover:bg-stone-800'"
      >
        Plain http.get()
      </button>
      <button
        type="button"
        data-testid="mode-shared"
        [attr.aria-pressed]="shared()"
        (click)="setShared(true)"
        class="min-h-11 rounded-xl border px-4 text-sm font-semibold transition"
        [class]="shared() ? 'border-gold-400 bg-gold-500/15 text-gold-300' : 'border-stone-700 text-stone-300 hover:bg-stone-800'"
      >
        With shareReplay(1)
      </button>
    </div>

    <div class="mt-4 grid gap-3 sm:grid-cols-2">
      @for (who of listeners; track who) {
        <div class="rounded-xl bg-stone-950 p-4">
          <p class="text-sm font-semibold text-stone-100">Component {{ who }}</p>
          <button
            type="button"
            [attr.data-testid]="'subscribe-' + who"
            (click)="subscribe(who)"
            class="mt-2 min-h-11 rounded-lg border border-stone-600 px-3 text-sm font-semibold text-stone-100 hover:bg-stone-800"
          >
            subscribe()
          </button>
          <p class="mt-3 text-sm" [attr.data-testid]="'got-' + who" aria-live="polite">
            @if (received()[who]; as films) {
              <span class="text-emerald-300">Got {{ films.length }} films</span>
            } @else if (waiting()[who]) {
              <span class="text-gold-300">Waiting…</span>
            } @else {
              <span class="text-stone-500">Nothing yet</span>
            }
          </p>
        </div>
      }
    </div>

    <div class="mt-4 flex flex-wrap items-center gap-3 rounded-xl bg-stone-950 p-4">
      <p class="text-sm text-stone-300">
        Network calls made:
        <strong class="text-2xl text-gold-300" data-testid="network-calls">{{ calls() }}</strong>
      </p>
      <button
        type="button"
        data-testid="cold-reset"
        (click)="reset()"
        class="ml-auto min-h-11 rounded-xl px-4 text-sm font-semibold text-stone-400 hover:text-stone-200"
      >
        Reset
      </button>
    </div>
    <p class="mt-3 text-sm text-stone-300" data-testid="cold-note">{{ note() }}</p>
  `,
})
export class ColdObservableDemoComponent {
  readonly listeners: Listener[] = ['A', 'B'];
  readonly shared = signal(false);
  readonly calls = signal(0);
  protected readonly received = signal<Partial<Record<Listener, string[]>>>({});
  protected readonly waiting = signal<Partial<Record<Listener, boolean>>>({});
  protected readonly note = signal('Press subscribe() in Component A, then in Component B.');

  private source = createFilmsSource(() => this.calls.update((n) => n + 1), false);
  private readonly subscriptions = new Set<Subscription>();

  constructor() {
    inject(DestroyRef).onDestroy(() => this.clear());
  }

  setShared(shared: boolean): void {
    this.shared.set(shared);
    this.reset();
  }

  subscribe(who: Listener): void {
    this.waiting.update((w) => ({ ...w, [who]: true }));
    const subscription = this.source.subscribe((films) => {
      this.received.update((r) => ({ ...r, [who]: films }));
      this.waiting.update((w) => ({ ...w, [who]: false }));
    });
    this.subscriptions.add(subscription);

    const made = this.calls();
    this.note.set(
      this.shared() && made === 1 && Object.keys(this.received()).length + Object.values(this.waiting()).filter(Boolean).length > 1
        ? 'The second subscriber reused the first request: still one network call.'
        : `Component ${who} subscribed. Each subscription starts its own request unless the result is shared.`,
    );
  }

  reset(): void {
    this.clear();
    this.calls.set(0);
    this.received.set({});
    this.waiting.set({});
    this.source = createFilmsSource(() => this.calls.update((n) => n + 1), this.shared());
    this.note.set('Press subscribe() in Component A, then in Component B.');
  }

  private clear(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
    this.subscriptions.clear();
  }
}
