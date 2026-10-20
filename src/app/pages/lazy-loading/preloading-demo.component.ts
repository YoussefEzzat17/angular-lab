import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

export type PreloadStrategy = 'none' | 'all' | 'selective';

export interface LazyRoute {
  path: string;
  kb: number;
  /** Set as `data: { preload: true }` on the route; only the selective strategy reads it. */
  preload: boolean;
}

export const LAZY_ROUTES: LazyRoute[] = [
  { path: '/products', kb: 38, preload: true },
  { path: '/checkout', kb: 22, preload: true },
  { path: '/admin', kb: 60, preload: false },
];

/** Milliseconds it takes to download one kilobyte on the pretend connection. */
export const MS_PER_KB = 10;

export const STRATEGIES: { id: PreloadStrategy; label: string; code: string; blurb: string }[] = [
  { id: 'none', label: 'No preloading', code: 'provideRouter(routes)', blurb: 'Nothing is downloaded until the user navigates. Smallest first load, but the first click on each page waits.' },
  { id: 'all', label: 'PreloadAllModules', code: 'provideRouter(routes, withPreloading(PreloadAllModules))', blurb: 'After the first page is ready, every lazy chunk is fetched in the background. Fast clicks, but it downloads pages nobody may visit.' },
  { id: 'selective', label: 'Selective', code: 'provideRouter(routes, withPreloading(SelectivePreload))', blurb: 'A custom strategy preloads only routes marked data: { preload: true }, the pages most people actually open next.' },
];

export function isPreloaded(strategy: PreloadStrategy, route: LazyRoute): boolean {
  switch (strategy) {
    case 'all':
      return true;
    case 'selective':
      return route.preload;
    default:
      return false;
  }
}

/** How long the user waits after clicking a link to this route. */
export function waitFor(strategy: PreloadStrategy, route: LazyRoute, alreadyLoaded: boolean): number {
  return alreadyLoaded || isPreloaded(strategy, route) ? 0 : route.kb * MS_PER_KB;
}

/** Kilobytes downloaded in the background before the user clicked anything. */
export function backgroundKb(strategy: PreloadStrategy, routes: LazyRoute[] = LAZY_ROUTES): number {
  return routes.filter((r) => isPreloaded(strategy, r)).reduce((sum, r) => sum + r.kb, 0);
}

/** Pick a preloading strategy, then click the pages and compare the waiting time with the data spent in the background. */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-preloading-demo',
  standalone: true,
  template: `
    <div class="mt-4 flex flex-wrap gap-2" role="group" aria-label="Preloading strategy">
      @for (s of strategies; track s.id) {
        <button
          type="button"
          [attr.data-testid]="'strategy-' + s.id"
          [attr.aria-pressed]="strategy() === s.id"
          (click)="setStrategy(s.id)"
          class="min-h-11 rounded-xl border px-4 text-sm font-semibold"
          [class]="strategy() === s.id ? 'border-gold-400 bg-gold-500/15 text-gold-300' : 'border-stone-700 text-stone-300 hover:bg-stone-800'"
        >
          {{ s.label }}
        </button>
      }
    </div>
    <p class="mt-3 text-sm text-stone-400" data-testid="strategy-blurb">{{ current().blurb }}</p>
    <pre class="mt-2 overflow-x-auto rounded-xl bg-stone-950 p-3 text-xs text-gold-200">{{ current().code }}</pre>

    <div class="mt-4 grid gap-3 sm:grid-cols-3">
      @for (route of routes; track route.path) {
        <button
          type="button"
          [attr.data-testid]="'visit-' + route.path.slice(1)"
          (click)="visit(route)"
          class="rounded-xl border border-stone-800 bg-stone-900 p-3 text-left hover:bg-stone-800"
        >
          <p class="font-mono text-sm font-semibold text-stone-100">{{ route.path }}</p>
          <p class="mt-1 text-xs text-stone-500">{{ route.kb }} KB chunk</p>
          <p class="mt-2 text-xs font-semibold" [class]="stateOf(route) === 'ready' ? 'text-emerald-300' : 'text-stone-500'" [attr.data-testid]="'state-' + route.path.slice(1)">
            {{ stateOf(route) === 'ready' ? '✓ already downloaded' : 'not downloaded yet' }}
          </p>
        </button>
      }
    </div>

    <div class="mt-4 rounded-xl bg-stone-950 p-4 text-sm text-stone-300" aria-live="polite">
      <p>Downloaded in the background: <strong class="text-gold-300" data-testid="background-kb">{{ background() }} KB</strong></p>
      <p class="mt-1" data-testid="visit-result">{{ result() }}</p>
    </div>
  `,
})
export class PreloadingDemoComponent {
  readonly strategies = STRATEGIES;
  readonly routes = LAZY_ROUTES;
  readonly strategy = signal<PreloadStrategy>('none');
  private readonly visited = signal<Set<string>>(new Set());
  readonly result = signal('Click a page to see how long the user waits.');

  readonly current = computed(() => STRATEGIES.find((s) => s.id === this.strategy()) ?? STRATEGIES[0]);
  readonly background = computed(() => backgroundKb(this.strategy()));

  setStrategy(strategy: PreloadStrategy): void {
    this.strategy.set(strategy);
    this.visited.set(new Set());
    this.result.set('Click a page to see how long the user waits.');
  }

  stateOf(route: LazyRoute): 'ready' | 'waiting' {
    return isPreloaded(this.strategy(), route) || this.visited().has(route.path) ? 'ready' : 'waiting';
  }

  visit(route: LazyRoute): void {
    const wait = waitFor(this.strategy(), route, this.visited().has(route.path));
    this.visited.update((set) => new Set(set).add(route.path));
    this.result.set(
      wait === 0 ? `${route.path} opened instantly, its chunk was already in the browser.` : `${route.path} made the user wait about ${wait} ms while its ${route.kb} KB chunk downloaded.`,
    );
  }
}
