import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CodeBlockDirective } from '../../shared/code-block.directive';
import { LessonCardComponent } from '../../shared/lesson-card.component';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { RecapComponent, RecapItem } from '../../shared/recap.component';
import { TopicNavComponent } from '../../shared/topic-nav.component';

interface MockRoute {
  path: string;
  label: string;
  icon: string;
}

@Component({
  standalone: true,
  imports: [FormsModule, CodeBlockDirective, RecapComponent, TopicNavComponent, PageHeaderComponent, LessonCardComponent],
  template: `
    <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <app-page-header title="Routing" pdf="routing.pdf">
        A Single Page Application never actually reloads the browser — Angular's <strong class="text-gold-300">Router</strong> lets one page
        swap components based on the URL, giving you real navigation, bookmarkable links, and a back button that works.
      </app-page-header>

      <!-- 1 · ROUTES -->
      <app-lesson-card
        class="mt-10"
        label="1 · Routes — mapping URLs to components"
        heading="A route is a rule: &quot;when the URL looks like this, show that component&quot;"
      >
        <pre class="mt-4 overflow-x-auto rounded-xl bg-stone-950 p-4 text-xs text-gold-200">export const routes: Routes = [
  &#123; path: 'dashboard', component: DashboardComponent &#125;,
  &#123; path: 'products',  component: ProductsComponent &#125;,
  &#123; path: 'login',     component: LoginComponent &#125;,
];</pre>
        <p class="mt-3 text-xs text-stone-500">Angular checks this list top to bottom and renders the first matching component.</p>
      </app-lesson-card>

      <!-- 2 · INTERACTIVE OUTLET DEMO -->
      <app-lesson-card
        class="mt-5"
        variant="highlight"
        label="2 · Try it — a mock &lt;router-outlet&gt;"
        heading="Click a nav link, watch only the outlet swap"
      >
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
      </app-lesson-card>

      <!-- 3 · TWO WAYS TO NAVIGATE -->
      <app-lesson-card class="mt-5" label="3 · Declarative vs. programmatic navigation" heading="routerLink vs. the Router service">
        <div class="mt-5 grid gap-4 sm:grid-cols-2">
          <div class="min-w-0 rounded-xl bg-stone-800 p-4">
            <p class="text-xs font-bold text-gold-300">Declarative — routerLink</p>
            <pre class="mt-2 overflow-x-auto text-[11px] leading-relaxed text-stone-300">&lt;a routerLink="/products"&gt;
  Products
&lt;/a&gt;</pre>
            <p class="mt-2 text-xs text-stone-500">Best for menus, nav bars, and plain links the user clicks.</p>
          </div>
          <div class="min-w-0 rounded-xl bg-gold-950/30 p-4">
            <p class="text-xs font-bold text-emerald-300">Programmatic — Router service</p>
            <pre class="mt-2 overflow-x-auto text-[11px] leading-relaxed text-gold-100">constructor(private router: Router) &#123;&#125;

goToLogin() &#123;
  this.router.navigate(['/login']);
&#125;</pre>
            <p class="mt-2 text-xs text-stone-500">Best after logic runs first — e.g. redirect once a form submits.</p>
          </div>
        </div>
      </app-lesson-card>

      <!-- 4 · ROUTE PARAMS -->
      <app-lesson-card class="mt-5" variant="highlight" label="4 · Try it — route parameters">
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
      </app-lesson-card>

      <app-recap [items]="recapItems" />
      <app-topic-nav />
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

  readonly recapItems: RecapItem[] = [
    {
      question: 'What decides which component renders inside <router-outlet>?',
      answer: 'The Router — it matches the current URL against the routes array, top to bottom, and renders the first match into the outlet.',
    },
    {
      question: 'When would you use Router.navigate() instead of routerLink?',
      answer: 'When navigation needs to happen after some logic runs first — like redirecting once a form submits successfully.',
    },
    {
      question: "What does the colon in path: 'products/:id' mean?",
      answer: 'It marks a dynamic segment — one route definition matches /products/12, /products/45, or any id, and ActivatedRoute lets the component read which one activated it.',
    },
  ];
}
