import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

export interface RouteRule {
  path: string;
  /** What is shown, or where it redirects to. */
  component?: string;
  redirectTo?: string;
}

export type CheckState = 'matched' | 'skipped' | 'not-reached';

export interface MatchResult {
  /** Index of the first route that matched, or -1. */
  index: number;
  route: RouteRule | null;
  params: Record<string, string>;
  query: Record<string, string>;
  /** One entry per route, in order. */
  checks: CheckState[];
  /** The URL after a redirect, if the matching route redirects. */
  redirectedTo?: string;
}

export const ROUTES: RouteRule[] = [
  { path: '', redirectTo: 'dashboard' },
  { path: 'dashboard', component: 'DashboardComponent' },
  { path: 'products', component: 'ProductsComponent' },
  { path: 'products/:id', component: 'ProductDetailComponent' },
  { path: '**', component: 'NotFoundComponent' },
];

export const EXAMPLE_URLS = ['/', '/products', '/products/42', '/products/42?tab=reviews', '/settings'];

function segmentsOf(path: string): string[] {
  return path.split('/').filter(Boolean);
}

/**
 * How the router picks a page: it walks the list from the top and stops at the first route that fits.
 * A route without children must use up every segment of the URL, `:name` captures a segment, `**` fits anything.
 */
export function matchRoute(url: string, routes: RouteRule[]): MatchResult {
  const [pathPart, queryPart = ''] = url.split('?');
  const segments = segmentsOf(pathPart);
  const query: Record<string, string> = {};
  for (const pair of queryPart.split('&').filter(Boolean)) {
    const [key, value = ''] = pair.split('=');
    query[decodeURIComponent(key)] = decodeURIComponent(value);
  }

  const checks: CheckState[] = routes.map(() => 'not-reached');
  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    let params: Record<string, string> | null = null;

    if (route.path === '**') {
      params = {};
    } else {
      const wanted = segmentsOf(route.path);
      if (wanted.length === segments.length) {
        const found: Record<string, string> = {};
        const fits = wanted.every((part, at) => {
          if (part.startsWith(':')) {
            found[part.slice(1)] = decodeURIComponent(segments[at]);
            return true;
          }
          return part === segments[at];
        });
        params = fits ? found : null;
      }
    }

    if (params) {
      checks[i] = 'matched';
      return {
        index: i,
        route,
        params,
        query,
        checks,
        redirectedTo: route.redirectTo ? `/${route.redirectTo}` : undefined,
      };
    }
    checks[i] = 'skipped';
  }
  return { index: -1, route: null, params: {}, query, checks };
}

/** Type a URL and see which route of a small route table wins, what it captures, and what is never reached. */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-route-matcher-demo',
  standalone: true,
  template: `
    <label class="mt-4 block text-sm font-semibold text-stone-200" for="matcher-url">URL in the address bar</label>
    <input
      id="matcher-url"
      data-testid="matcher-url"
      [value]="url()"
      (input)="onType($event)"
      class="mt-2 w-full rounded-xl border border-stone-700 bg-stone-900 px-3 py-2.5 font-mono text-sm text-stone-100 focus:border-gold-400 focus:outline-none"
      autocomplete="off"
      spellcheck="false"
    />
    <div class="mt-3 flex flex-wrap gap-2" role="group" aria-label="Example URLs">
      @for (example of examples; track example) {
        <button
          type="button"
          [attr.data-testid]="'example-' + example"
          (click)="url.set(example)"
          class="min-h-11 rounded-lg border border-stone-700 px-3 font-mono text-xs text-stone-300 hover:bg-stone-800"
        >
          {{ example }}
        </button>
      }
    </div>

    <label class="mt-4 flex min-h-11 items-center gap-2 text-sm text-stone-300">
      <input type="checkbox" data-testid="wildcard-first" [checked]="wildcardFirst()" (change)="wildcardFirst.set(!wildcardFirst())" class="h-4 w-4" />
      Put the <code class="text-gold-300">**</code> route first (the classic mistake)
    </label>

    <ol class="mt-3 space-y-2" data-testid="route-table">
      @for (route of routes(); track route.path; let i = $index) {
        <li
          class="flex flex-wrap items-center gap-3 rounded-xl border px-3 py-2 text-sm"
          [class]="rowClass(i)"
          [attr.data-testid]="'route-' + i"
        >
          <span class="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-stone-800 text-xs font-bold text-stone-300" aria-hidden="true">{{ i + 1 }}</span>
          <code class="font-mono text-gold-300">path: '{{ route.path }}'</code>
          <span class="text-stone-400">{{ route.redirectTo ? '→ redirects to ' + route.redirectTo : route.component }}</span>
          <span class="ml-auto text-xs font-bold" [attr.data-testid]="'route-state-' + i">{{ stateLabel(i) }}</span>
        </li>
      }
    </ol>

    <div class="mt-4 rounded-xl bg-stone-950 p-4 text-sm" role="status" aria-live="polite">
      @if (result().route; as route) {
        @if (result().redirectedTo; as target) {
          <p class="text-gold-200" data-testid="matcher-result">The router redirects to <code>{{ target }}</code> and matches again.</p>
        } @else {
          <p class="text-emerald-300" data-testid="matcher-result">Shows <strong>{{ route.component }}</strong></p>
        }
      } @else {
        <p class="text-rose-300" data-testid="matcher-result">No route matched, and there is no ** route, so the navigation fails.</p>
      }
      <p class="mt-2 text-stone-400">Route params: <code class="text-gold-300" data-testid="matcher-params">{{ paramsText() }}</code></p>
      <p class="mt-1 text-stone-400">Query params: <code class="text-gold-300" data-testid="matcher-query">{{ queryText() }}</code></p>
    </div>
  `,
})
export class RouteMatcherDemoComponent {
  readonly examples = EXAMPLE_URLS;
  readonly url = signal('/products/42?tab=reviews');
  readonly wildcardFirst = signal(false);

  protected readonly routes = computed(() => {
    if (!this.wildcardFirst()) {
      return ROUTES;
    }
    const wildcard = ROUTES.find((r) => r.path === '**')!;
    return [wildcard, ...ROUTES.filter((r) => r !== wildcard)];
  });
  protected readonly result = computed(() => matchRoute(this.url(), this.routes()));
  protected readonly paramsText = computed(() => JSON.stringify(this.result().params));
  protected readonly queryText = computed(() => JSON.stringify(this.result().query));

  protected onType(event: Event): void {
    this.url.set((event.target as HTMLInputElement).value);
  }

  protected stateLabel(index: number): string {
    switch (this.result().checks[index]) {
      case 'matched':
        return '✓ matches, the search stops';
      case 'skipped':
        return 'no match';
      default:
        return 'never checked';
    }
  }

  protected rowClass(index: number): string {
    switch (this.result().checks[index]) {
      case 'matched':
        return 'border-emerald-400/60 bg-emerald-500/10 text-emerald-200';
      case 'skipped':
        return 'border-stone-800 bg-stone-900';
      default:
        return 'border-stone-800 bg-stone-950 opacity-70';
    }
  }
}
