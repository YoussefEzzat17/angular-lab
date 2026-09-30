import { Component, signal } from '@angular/core';

interface RouteChunk {
  path: string;
  label: string;
  kb: number;
}

@Component({
  standalone: true,
  template: `
    <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p class="text-sm font-semibold text-gold-400">HANDS-ON WORKSHOP</p>
          <h1 class="mt-1 text-3xl font-bold sm:text-4xl">Lazy Loading</h1>
        </div>
        <a
          href="/pdfs/lazy-loading.pdf"
          download="lazy-loading.pdf"
          class="group inline-flex shrink-0 items-center gap-2 rounded-full border border-gold-400/40 bg-gold-500/10 px-4 py-2 text-sm font-semibold text-gold-300 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gold-400 hover:bg-gold-500/20 hover:shadow-lg hover:shadow-gold-500/20 active:translate-y-0 active:scale-95"
        >
          <svg
            class="h-4 w-4 text-gold-300 transition-transform duration-200 group-hover:translate-y-0.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <path d="M12 18v-6" />
            <path d="m9 15 3 3 3-3" />
          </svg>
          Download PDF Guide
        </a>
      </div>
      <p class="mt-3 max-w-3xl text-stone-400">
        Lazy loading means a route's code is downloaded only <strong class="text-gold-300">when the user actually visits it</strong>, instead of
        shipping every page's component inside the main JavaScript bundle from the very first load.
      </p>

      <!-- 1 · THE PROBLEM -->
      <article class="mt-10 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <p class="text-xs font-bold tracking-wider text-gold-300">1 · The problem</p>
        <h2 class="mt-2 text-xl font-bold">Every route ships eagerly, whether it's visited or not</h2>
        <p class="mt-2 text-sm text-stone-400">
          With a normal eager <code class="text-gold-300">import</code>, Angular bundles a route's component straight into the main bundle — the file
          the browser must download and parse before the app can even start, even for pages the user may never open.
        </p>
      </article>

      <!-- 2 · BEFORE / AFTER -->
      <article class="mt-5 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <p class="text-xs font-bold tracking-wider text-gold-300">2 · One-line change, real payoff</p>
        <h2 class="mt-2 text-xl font-bold">Eager imports vs. loadComponent</h2>
        <div class="mt-5 grid gap-4 sm:grid-cols-2">
          <div class="rounded-xl bg-stone-800 p-4">
            <p class="text-xs font-bold text-rose-300">❌ Before — every component is in the main bundle</p>
            <pre class="mt-2 overflow-x-auto text-[11px] leading-relaxed text-stone-300">import &#123; Products &#125; from './exercises/product-card/product-card';
import &#123; Checkout &#125; from './exercises/checkout/checkout';

export const routes: Routes = [
  &#123; path: 'products', component: Products &#125;,
  &#123; path: 'checkout', component: Checkout &#125;,
];</pre>
          </div>
          <div class="rounded-xl bg-gold-950/30 p-4">
            <p class="text-xs font-bold text-emerald-300">✅ After — code loads only when the route is visited</p>
            <pre class="mt-2 overflow-x-auto text-[11px] leading-relaxed text-gold-100">export const routes: Routes = [
  &#123; path: 'products', loadComponent: () =&gt;
      import('./exercises/product-card/product-card')
        .then(m =&gt; m.Products) &#125;,
  &#123; path: 'checkout', loadComponent: () =&gt;
      import('./exercises/checkout/checkout')
        .then(m =&gt; m.Checkout) &#125;,
];</pre>
          </div>
        </div>
      </article>

      <!-- 3 · INTERACTIVE DEMO -->
      <article class="mt-5 rounded-2xl border border-gold-400/30 bg-gold-950/20 p-6">
        <p class="text-xs font-bold tracking-wider text-gold-300">3 · Try it — eager vs. lazy bundle</p>
        <h2 class="mt-2 text-xl font-bold">Watch what the browser has to download on first load</h2>
        <p class="mt-2 text-sm text-stone-400">
          Pick a loading strategy, then click a route. Eager mode counts every route's code toward the bundle the moment the app starts. Lazy mode
          only fetches a route's chunk the instant you actually navigate to it.
        </p>

        <div class="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            (click)="setStrategy('eager')"
            class="rounded-lg px-4 py-2 text-sm font-semibold transition"
            [class.bg-gold-500]="strategy() === 'eager'"
            [class.text-white]="strategy() === 'eager'"
            [class.bg-stone-800]="strategy() !== 'eager'"
            [class.text-stone-300]="strategy() !== 'eager'"
          >
            Eager imports
          </button>
          <button
            type="button"
            (click)="setStrategy('lazy')"
            class="rounded-lg px-4 py-2 text-sm font-semibold transition"
            [class.bg-gold-500]="strategy() === 'lazy'"
            [class.text-white]="strategy() === 'lazy'"
            [class.bg-stone-800]="strategy() !== 'lazy'"
            [class.text-stone-300]="strategy() !== 'lazy'"
          >
            loadComponent (lazy)
          </button>
        </div>

        <div class="mt-5 rounded-xl bg-stone-900 p-4">
          <p class="text-xs text-stone-400">Initial bundle downloaded on app start</p>
          <div class="mt-2 h-3 w-full overflow-hidden rounded-full bg-stone-800">
            <div class="h-full rounded-full bg-gold-500 transition-all duration-500" [style.width.%]="initialBundlePercent()"></div>
          </div>
          <p class="mt-2 text-sm text-stone-300">
            <strong class="text-gold-300">{{ initialBundleKb() }} KB</strong> in the main bundle
            <span class="text-stone-500">(core app shell = 40 KB{{ strategy() === 'eager' ? ' + every route' : '' }})</span>
          </p>
        </div>

        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          @for (route of routeChunks; track route.path) {
            <button
              type="button"
              (click)="navigateTo(route)"
              class="rounded-xl border border-stone-800 bg-stone-900 p-4 text-left transition hover:border-gold-400/50"
            >
              <p class="text-sm font-semibold text-stone-100">{{ route.label }}</p>
              <p class="mt-1 text-xs text-stone-500">{{ route.path }} · {{ route.kb }} KB chunk</p>
              @if (strategy() === 'lazy') {
                @if (loadedChunks().has(route.path)) {
                  <p class="mt-2 text-xs font-semibold text-emerald-400">✓ chunk loaded</p>
                } @else {
                  <p class="mt-2 text-xs font-semibold text-stone-500">not fetched yet — click to visit</p>
                }
              }
            </button>
          }
        </div>

        @if (lastEvent()) {
          <p class="mt-4 text-xs text-stone-500">{{ lastEvent() }}</p>
        }
      </article>

      <!-- 4 · WHY IT MATTERS -->
      <article class="mt-5 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <p class="text-xs font-bold tracking-wider text-gold-300">4 · Why it matters</p>
        <h2 class="mt-2 text-xl font-bold">Smaller initial bundle, faster first paint</h2>
        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          <div class="rounded-xl bg-stone-800 p-4">
            <p class="text-xs font-bold text-gold-300">Smaller main bundle</p>
            <p class="mt-1 text-xs text-stone-400">The browser downloads and parses less JavaScript before the app becomes interactive.</p>
          </div>
          <div class="rounded-xl bg-stone-800 p-4">
            <p class="text-xs font-bold text-gold-300">Loaded on demand</p>
            <p class="mt-1 text-xs text-stone-400">A route's chunk is fetched only the moment the user actually navigates to it.</p>
          </div>
          <div class="rounded-xl bg-stone-800 p-4">
            <p class="text-xs font-bold text-gold-300">One-line change</p>
            <p class="mt-1 text-xs text-stone-400"><code class="text-gold-300">component: X</code> becomes <code class="text-gold-300">loadComponent: () =&gt; import(...)</code>.</p>
          </div>
        </div>
      </article>
    </section>
  `,
})
export class LazyLoadingComponent {
  readonly routeChunks: RouteChunk[] = [
    { path: '/products', label: 'Products', kb: 38 },
    { path: '/checkout', label: 'Checkout', kb: 22 },
    { path: '/favorites', label: 'Favorites', kb: 14 },
  ];

  readonly strategy = signal<'eager' | 'lazy'>('eager');
  readonly loadedChunks = signal<Set<string>>(new Set());
  readonly lastEvent = signal('');

  private readonly totalChunkKb = this.routeChunks.reduce((sum, route) => sum + route.kb, 0);
  private readonly shellKb = 40;

  setStrategy(strategy: 'eager' | 'lazy'): void {
    this.strategy.set(strategy);
    this.loadedChunks.set(new Set());
    this.lastEvent.set(strategy === 'eager' ? 'Eager mode: every route is already in the main bundle.' : 'Lazy mode: nothing is fetched until you visit a route.');
  }

  navigateTo(route: RouteChunk): void {
    if (this.strategy() === 'eager') {
      this.lastEvent.set(`Navigated to ${route.path} — its code was already downloaded on app start.`);
      return;
    }
    const already = this.loadedChunks().has(route.path);
    this.loadedChunks.update((chunks) => new Set(chunks).add(route.path));
    this.lastEvent.set(
      already
        ? `Navigated to ${route.path} — chunk was already cached, no new download.`
        : `Navigated to ${route.path} — fetched its ${route.kb} KB chunk on demand.`,
    );
  }

  initialBundleKb(): number {
    return this.strategy() === 'eager' ? this.shellKb + this.totalChunkKb : this.shellKb;
  }

  initialBundlePercent(): number {
    const max = this.shellKb + this.totalChunkKb;
    return Math.round((this.initialBundleKb() / max) * 100);
  }
}
