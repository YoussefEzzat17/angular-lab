import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface MockRoute {
  path: string;
  label: string;
  icon: string;
}

@Component({
  standalone: true,
  imports: [FormsModule],
  template: `
    <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p class="text-sm font-semibold text-gold-400">HANDS-ON WORKSHOP</p>
          <h1 class="mt-1 text-3xl font-bold sm:text-4xl">Routing</h1>
        </div>
        <a
          href="/pdfs/routing.pdf"
          download="routing.pdf"
          class="group inline-flex shrink-0 items-center gap-2.5 rounded-full border border-gold-400/40 bg-gold-500/10 py-2 pl-3 pr-4 text-sm font-semibold text-gold-300 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gold-400 hover:bg-gold-500/20 hover:shadow-lg hover:shadow-gold-500/20 active:translate-y-0 active:scale-95"
        >
          <span class="flex h-6 w-6 items-center justify-center rounded-full bg-gold-500/20 transition-colors group-hover:bg-gold-500/30">
            <svg class="h-3.5 w-3.5 text-gold-300 transition-transform duration-200 group-hover:translate-y-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 3v12" />
              <path d="M7 10l5 5 5-5" />
              <path d="M5 21h14" />
            </svg>
          </span>
          Download PDF Guide
        </a>
      </div>
      <p class="mt-3 max-w-3xl text-stone-400">
        A Single Page Application never actually reloads the browser — Angular's <strong class="text-gold-300">Router</strong> lets one page
        swap components based on the URL, giving you real navigation, bookmarkable links, and a back button that works.
      </p>

      <!-- 1 · ROUTES -->
      <article class="mt-10 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <p class="text-xs font-bold tracking-wider text-gold-300">1 · Routes — mapping URLs to components</p>
        <h2 class="mt-2 text-xl font-bold">A route is a rule: "when the URL looks like this, show that component"</h2>
        <pre class="mt-4 overflow-x-auto rounded-xl bg-stone-950 p-4 text-xs text-gold-200">export const routes: Routes = [
  &#123; path: 'dashboard', component: DashboardComponent &#125;,
  &#123; path: 'products',  component: ProductsComponent &#125;,
  &#123; path: 'login',     component: LoginComponent &#125;,
];</pre>
        <p class="mt-3 text-xs text-stone-500">Angular checks this list top to bottom and renders the first matching component.</p>
      </article>

      <!-- 2 · INTERACTIVE OUTLET DEMO -->
      <article class="mt-5 rounded-2xl border border-gold-400/30 bg-gold-950/20 p-6">
        <p class="text-xs font-bold tracking-wider text-gold-300">2 · Try it — a mock &lt;router-outlet&gt;</p>
        <h2 class="mt-2 text-xl font-bold">Click a nav link, watch only the outlet swap</h2>
        <p class="mt-2 text-sm text-stone-400">
          This is a simulation (it won't actually navigate away from this page) — but it behaves exactly like a real Angular Router: the navbar
          stays put, and only the content inside <code class="text-gold-300">&lt;router-outlet&gt;</code> changes.
        </p>

        <div class="mt-4 overflow-hidden rounded-xl border border-stone-800">
          <nav class="flex flex-wrap gap-1 border-b border-stone-800 bg-stone-900 p-2">
            @for (route of mockRoutes; track route.path) {
              <button
                type="button"
                (click)="navigateTo(route.path)"
                class="rounded-lg px-3 py-2 text-sm font-medium transition"
                [class.bg-gold-500]="currentPath() === route.path"
                [class.text-white]="currentPath() === route.path"
                [class.text-stone-300]="currentPath() !== route.path"
                [class.hover:bg-stone-800]="currentPath() !== route.path"
              >
                {{ route.icon }} {{ route.label }}
              </button>
            }
          </nav>
          <div class="min-h-[120px] bg-stone-900 p-5">
            <p class="text-xs text-stone-500">URL: <code class="text-gold-300">/{{ currentPath() }}</code> · &lt;router-outlet&gt; renders:</p>
            <div class="mt-3 rounded-lg border border-dashed border-gold-400/30 bg-gold-500/5 p-4">
              <p class="text-lg font-bold text-gold-200">{{ currentRouteLabel() }}Component</p>
              <p class="mt-1 text-sm text-stone-400">{{ currentRouteDescription() }}</p>
            </div>
          </div>
        </div>
        <p class="mt-3 text-xs text-stone-500">Navigations so far: {{ navCount() }} — notice the nav bar itself never re-rendered.</p>
      </article>

      <!-- 3 · TWO WAYS TO NAVIGATE -->
      <article class="mt-5 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <p class="text-xs font-bold tracking-wider text-gold-300">3 · Declarative vs. programmatic navigation</p>
        <h2 class="mt-2 text-xl font-bold">routerLink vs. the Router service</h2>
        <div class="mt-5 grid gap-4 sm:grid-cols-2">
          <div class="rounded-xl bg-stone-800 p-4">
            <p class="text-xs font-bold text-gold-300">Declarative — routerLink</p>
            <pre class="mt-2 overflow-x-auto text-[11px] leading-relaxed text-stone-300">&lt;a routerLink="/products"&gt;
  Products
&lt;/a&gt;</pre>
            <p class="mt-2 text-xs text-stone-500">Best for menus, nav bars, and plain links the user clicks.</p>
          </div>
          <div class="rounded-xl bg-gold-950/30 p-4">
            <p class="text-xs font-bold text-emerald-300">Programmatic — Router service</p>
            <pre class="mt-2 overflow-x-auto text-[11px] leading-relaxed text-gold-100">constructor(private router: Router) &#123;&#125;

goToLogin() &#123;
  this.router.navigate(['/login']);
&#125;</pre>
            <p class="mt-2 text-xs text-stone-500">Best after logic runs first — e.g. redirect once a form submits.</p>
          </div>
        </div>
      </article>

      <!-- 4 · ROUTE PARAMS -->
      <article class="mt-5 rounded-2xl border border-gold-400/30 bg-gold-950/20 p-6">
        <p class="text-xs font-bold tracking-wider text-gold-300">4 · Try it — route parameters</p>
        <h2 class="mt-2 text-xl font-bold">Passing data through the URL with <code>:id</code></h2>
        <p class="mt-2 text-sm text-stone-400">
          Route: <code class="text-gold-300">&#123; path: 'products/:id', component: ProductDetailComponent &#125;</code> — the colon marks a
          dynamic segment. One route definition, endless product pages.
        </p>
        <div class="mt-4 flex flex-wrap items-center gap-3">
          <label class="text-sm text-stone-400">
            Product id:
            <input
              type="number"
              [ngModel]="productId()"
              (ngModelChange)="productId.set($event)"
              class="ml-2 w-24 rounded-lg border border-stone-700 bg-stone-800 px-3 py-1.5 text-stone-100 focus:border-gold-400 focus:outline-none"
            />
          </label>
          <button
            type="button"
            (click)="visitProduct()"
            class="rounded-lg bg-gold-500 px-4 py-2 text-sm font-semibold text-white hover:bg-gold-400"
          >
            Visit /products/{{ productId() }}
          </button>
        </div>
        @if (visitedProductId() !== null) {
          <div class="mt-4 rounded-xl bg-stone-900 p-4">
            <p class="text-xs text-stone-400">Inside ProductDetailComponent:</p>
            <pre class="mt-2 text-xs text-gold-200">const id = this.route.snapshot.paramMap.get('id');
// id === '{{ visitedProductId() }}'</pre>
            <p class="mt-2 text-sm text-stone-300">→ Loaded details for product <strong class="text-gold-300">#{{ visitedProductId() }}</strong>.</p>
          </div>
        }
      </article>
    </section>
  `,
})
export class RoutingComponent {
  readonly mockRoutes: MockRoute[] = [
    { path: 'dashboard', label: 'Dashboard', icon: '📊' },
    { path: 'products', label: 'Products', icon: '🛒' },
    { path: 'login', label: 'Login', icon: '🔐' },
    { path: 'profile', label: 'Profile', icon: '👤' },
  ];

  private readonly descriptions: Record<string, string> = {
    dashboard: 'Overview cards and charts for the signed-in user.',
    products: 'A grid of products fetched from the API.',
    login: 'A form asking for email and password.',
    profile: 'The current user\'s account details and settings.',
  };

  readonly currentPath = signal('dashboard');
  readonly navCount = signal(0);

  readonly productId = signal(12);
  readonly visitedProductId = signal<number | null>(null);

  navigateTo(path: string): void {
    this.currentPath.set(path);
    this.navCount.update((n) => n + 1);
  }

  currentRouteLabel(): string {
    const route = this.mockRoutes.find((r) => r.path === this.currentPath());
    return route ? route.label.replace(/\s/g, '') : '';
  }

  currentRouteDescription(): string {
    return this.descriptions[this.currentPath()] ?? '';
  }

  visitProduct(): void {
    this.visitedProductId.set(this.productId());
  }
}
