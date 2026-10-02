import { Component, signal } from '@angular/core';

import { CodeBlockDirective } from '../../shared/code-block.directive';
import { LessonCardComponent } from '../../shared/lesson-card.component';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { RecapComponent, RecapItem } from '../../shared/recap.component';
import { TopicNavComponent } from '../../shared/topic-nav.component';

interface RouteChunk {
  path: string;
  label: string;
  kb: number;
}

@Component({
  standalone: true,
  imports: [CodeBlockDirective, RecapComponent, TopicNavComponent, PageHeaderComponent, LessonCardComponent],
  template: `
    <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <app-page-header title="Lazy Loading" illustration="lazy" pdf="lazy-loading.pdf">
        Lazy loading means a route's code is downloaded only <strong class="text-gold-300">when the user actually visits it</strong>, instead of
        shipping every page's component inside the main JavaScript bundle from the very first load.
      </app-page-header>

      <!-- 1 · THE PROBLEM -->
      <app-lesson-card class="mt-10" label="1 · The problem" heading="Every route ships eagerly, whether it's visited or not">
        <p class="mt-2 text-sm text-stone-400">
          With a normal eager <code class="text-gold-300">import</code>, Angular bundles a route's component straight into the main bundle — the file
          the browser must download and parse before the app can even start, even for pages the user may never open.
        </p>
      </app-lesson-card>

      <!-- 2 · BEFORE / AFTER -->
      <app-lesson-card class="mt-5" label="2 · One-line change, real payoff" heading="Eager imports vs. loadComponent">
        <div class="mt-5 grid gap-4 sm:grid-cols-2">
          <div class="min-w-0 rounded-xl bg-stone-800 p-4">
            <p class="text-xs font-bold text-rose-300">❌ Before — every component is in the main bundle</p>
            <pre class="mt-2 overflow-x-auto text-[11px] leading-relaxed text-stone-300">import &#123; Products &#125; from './exercises/product-card/product-card';
import &#123; Checkout &#125; from './exercises/checkout/checkout';

export const routes: Routes = [
  &#123; path: 'products', component: Products &#125;,
  &#123; path: 'checkout', component: Checkout &#125;,
];</pre>
          </div>
          <div class="min-w-0 rounded-xl bg-gold-950/30 p-4">
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
      </app-lesson-card>

      <!-- 3 · INTERACTIVE DEMO -->
      <app-lesson-card
        class="mt-5"
        variant="highlight"
        label="3 · Try it — eager vs. lazy bundle"
        heading="Watch what the browser has to download on first load"
      >
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
      </app-lesson-card>

      <!-- 4 · WHY IT MATTERS -->
      <app-lesson-card class="mt-5" label="4 · Why it matters" heading="Smaller initial bundle, faster first paint">
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
      </app-lesson-card>

      <app-recap [items]="recapItems" />
      <app-topic-nav />
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

  readonly recapItems: RecapItem[] = [
    {
      question: "What's the one-line change that turns an eager route into a lazy one?",
      answer: "component: X becomes loadComponent: () => import('./path').then(m => m.X).",
    },
    {
      question: 'Why does a resolver remove the need for a manual loading spinner in the component?',
      answer: 'The Router waits for the resolver to fetch the data before activating the route, so the component starts with the data already in hand.',
    },
    {
      question: "What can a guard's CanActivateFn return, and what does each mean?",
      answer: 'true (allow), false (block), or a UrlTree (redirect) — returning a UrlTree avoids a flash of the blocked page before redirecting.',
    },
  ];
}
