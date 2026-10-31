import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CodeBlockDirective } from '../../shared/code-block.directive';
import { CodeOutputComponent } from '../../shared/code-output.component';
import { CommonMistakeComponent } from '../../shared/common-mistake.component';
import { RecapComponent } from '../../shared/recap.component';
import { LessonCardComponent } from '../../shared/lesson-card.component';
import type { PredictChallenge } from '../../shared/predict-output.component';
import { PredictOutputComponent } from '../../shared/predict-output.component';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { RouteMatcherDemoComponent } from './route-matcher-demo.component';
import { KnowledgeCheckComponent, KnowledgeCheckItem } from '../../shared/knowledge-check.component';
import { LessonPlayerComponent } from '../../learn/player/lesson-player.component';
import { LessonSectionDirective } from '../../learn/player/lesson-section.directive';

interface MockRoute {
  path: string;
  label: string;
  icon: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CodeOutputComponent, CommonMistakeComponent, RecapComponent, RouteMatcherDemoComponent, PredictOutputComponent, FormsModule, CodeBlockDirective, KnowledgeCheckComponent, PageHeaderComponent, LessonCardComponent, LessonPlayerComponent, LessonSectionDirective],
  template: `
    <app-lesson-player [topicId]="'routing'" [section]="section()">
      <ng-template appLessonSection="basics">
      <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <app-page-header title="Routing" illustration="routing">
        A Single Page Application never actually reloads the browser — Angular's <strong class="text-gold-300">Router</strong> lets one page
        swap components based on the URL, giving you real navigation, bookmarkable links, and a back button that works.
      </app-page-header>

      <app-lesson-card class="mt-10" label="THE PROBLEM" heading="One page, many screens">
        <p class="mt-2 text-sm text-stone-400">
          An Angular app is one HTML page. Without a router, every "screen" would have to live on that one page and you could not link to it, bookmark it or use the back button. The router ties
          each <strong class="text-stone-200">URL</strong> to a <strong class="text-stone-200">component</strong>, so the address bar always says where you are.
        </p>
      </app-lesson-card>

      <app-lesson-card class="mt-5" label="THE MENTAL MODEL" heading="A receptionist with a directory" tone="amber">
        <ul class="mt-3 list-disc space-y-2 pl-5 text-sm text-stone-300">
          <li><strong class="text-stone-100">The URL</strong> is the name of the room you ask for.</li>
          <li><strong class="text-stone-100">The routes</strong> are the receptionist's directory: "products/:id is room 4".</li>
          <li><strong class="text-stone-100">The router</strong> reads the directory top to bottom and sends you to the first room that fits.</li>
          <li><strong class="text-stone-100">&lt;router-outlet&gt;</strong> is the room itself: the one spot on the page where the component appears. The rest of the building (the nav bar) stays put.</li>
        </ul>
      </app-lesson-card>

      <app-lesson-card class="mt-5" label="SET IT UP" heading="Give the app its routes and an outlet">
        <pre class="mt-3 overflow-x-auto rounded-xl bg-stone-950 p-4 text-xs text-gold-200">{{ setupCode }}</pre>
      </app-lesson-card>

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
                [class.bg-gold-solid]="currentPath() === route.path"
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
      <app-recap class="mt-5" [items]="recapBasics" />
      </section>
      </ng-template>

      <ng-template appLessonSection="matching">
      <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <app-lesson-card class="mt-10" label="HOW A URL IS MATCHED" heading="Top to bottom, first match wins">
        <ul class="mt-3 list-disc space-y-2 pl-5 text-sm text-stone-300">
          <li>The router walks the list from the first route down and <strong class="text-stone-100">stops at the first one that fits</strong>.</li>
          <li><code class="text-gold-300">products/:id</code> fits <code class="text-gold-300">products/42</code> and captures <code class="text-gold-300">id = '42'</code>. The colon marks a dynamic part.</li>
          <li>A route like <code class="text-gold-300">products</code> must use up the whole URL, so it does not catch <code class="text-gold-300">products/42</code>.</li>
          <li><code class="text-gold-300">**</code> fits anything. It belongs <strong class="text-stone-100">last</strong>, as the "page not found" catch-all.</li>
          <li>Query parameters (<code class="text-gold-300">?tab=reviews</code>) are not part of the match. They ride along beside it.</li>
        </ul>
      </app-lesson-card>

      <app-lesson-card class="mt-5" variant="highlight" label="TRY IT" heading="Type a URL and watch the router search">
        <ol class="mt-2 list-decimal space-y-1 pl-5 text-sm text-stone-400">
          <li>Try <strong class="text-stone-200">/products/42</strong>. Which route wins, and what does it capture?</li>
          <li>Try <strong class="text-stone-200">/settings</strong>. Every route says "no match" until the wildcard.</li>
          <li>Tick the checkbox to put <strong class="text-stone-200">**</strong> first, and try the same URLs again.</li>
        </ol>
        <app-route-matcher-demo />
      </app-lesson-card>
      <app-recap class="mt-5" [items]="recapMatch" />
      </section>
      </ng-template>

      <ng-template appLessonSection="navigation">
      <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
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
            <pre class="mt-2 overflow-x-auto text-[11px] leading-relaxed text-gold-100">private router = inject(Router);

goToLogin() &#123;
  this.router.navigate(['/login']);
&#125;</pre>
            <p class="mt-2 text-xs text-stone-500">Best after logic runs first — e.g. redirect once a form submits.</p>
          </div>
        </div>
      </app-lesson-card>

      <app-lesson-card class="mt-5" label="LINKS WITH DATA" heading="Path pieces, query params and the active link">
        <pre class="mt-3 overflow-x-auto rounded-xl bg-stone-950 p-4 text-xs text-gold-200">{{ linksCode }}</pre>
        <p class="mt-3 text-sm text-stone-400">
          Give <code class="text-gold-300">routerLink</code> an array instead of a string and Angular builds the URL for you, so an id with a slash in it cannot break the path.
          <code class="text-gold-300">routerLinkActive</code> adds a class to the link of the page you are on, which is how nav bars highlight the current page.
        </p>
      </app-lesson-card>

      <app-lesson-card class="mt-5" variant="highlight" label="PREDICT THE OUTPUT" heading="Which URL does this go to?">
        <app-predict-output [challenge]="navigateChallenge" />
      </app-lesson-card>
      <app-recap class="mt-5" [items]="recapNav" />
      </section>
      </ng-template>

      <ng-template appLessonSection="params">
      <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
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
            class="rounded-lg bg-gold-solid px-4 py-2 text-sm font-semibold text-white hover:bg-gold-solid-hover"
          >
            Visit /products/{{ productId() }}
          </button>
        </div>
        @if (visitedProductId() !== null) {
          <div class="mt-4 rounded-xl bg-stone-900 p-4">
            <p class="text-xs text-stone-400">Inside ProductDetailComponent:</p>
            <pre class="mt-2 text-xs text-gold-200">id = input.required&lt;string&gt;();
// id() === '{{ visitedProductId() }}'</pre>
            <p class="mt-2 text-sm text-stone-300">→ Loaded details for product <strong class="text-gold-300">#{{ visitedProductId() }}</strong>.</p>
          </div>
        }
      </app-lesson-card>

      <app-lesson-card class="mt-5" label="READING THE PARAMETER" heading="Three ways, and the one to prefer">
        <pre class="mt-3 overflow-x-auto rounded-xl bg-stone-950 p-4 text-xs text-gold-200">{{ paramsCode }}</pre>
        <p class="mt-3 text-sm text-stone-400">
          With <code class="text-gold-300">withComponentInputBinding()</code> turned on in <code class="text-gold-300">provideRouter</code>, route params and query params arrive as plain
          <code class="text-gold-300">input()</code>s. That is the shortest way, it is a signal, and it updates when the id changes.
        </p>
      </app-lesson-card>

      <app-common-mistake class="mt-5" title="Reading the route parameter only once" [wrong]="mistakeSnapshotWrong" [right]="mistakeSnapshotRight">
        Going from <code class="text-gold-300">/product/1</code> to <code class="text-gold-300">/product/2</code> reuses the same component, so a snapshot taken at the start goes stale. Use an input or an observable that updates.
      </app-common-mistake>

      <app-common-mistake class="mt-5" title="Using a plain link for navigation" [wrong]="mistakeLinkWrong" [right]="mistakeLinkRight">
        A plain <code class="text-gold-300">href</code> asks the browser to load a new page, so the whole app restarts and all state is lost. <code class="text-gold-300">routerLink</code> changes only the outlet.
      </app-common-mistake>

      <app-lesson-card class="mt-5" variant="danger" label="ONE MORE" heading="A routing mistake to avoid">
        <ul class="mt-3 list-disc space-y-2 pl-5 text-sm text-stone-300">
          <li><strong class="text-stone-100">Putting the wildcard route first.</strong> The <code class="text-gold-300">**</code> route matches everything, so it must be the last one in the list.</li>
        </ul>
      </app-lesson-card>
      <app-recap class="mt-5" [items]="recapParams" />
      </section>
      </ng-template>

      <ng-template appLessonSection="nested">
      <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <app-lesson-card class="mt-10" label="NESTED ROUTES" heading="A layout that stays while its pages change">
        <p class="mt-2 text-sm text-stone-400">
          Routes can have <code class="text-gold-300">children</code>. The parent component holds the shared part, such as a menu, and its own
          <code class="text-gold-300">&lt;router-outlet&gt;</code> shows the child. The URL gets longer as you go deeper.
        </p>
      </app-lesson-card>

      <app-lesson-card class="mt-5" variant="highlight" label="SEE IT" heading="Switch the child, keep the layout">
        <div class="mt-3 flex gap-2" role="group" aria-label="Account page">
          @for (page of accountPages; track page) {
            <button type="button" [attr.aria-pressed]="accountPage() === page" (click)="accountPage.set(page)"
                    class="min-h-11 rounded-xl border px-4 text-sm font-semibold transition"
                    [class]="accountPage() === page ? 'border-gold-400 bg-gold-500/15 text-gold-200' : 'border-stone-700 text-stone-300 hover:bg-stone-800'">{{ page }}</button>
          }
        </div>
        <app-code-output class="mt-4 block" [code]="nestedCode" [address]="'localhost:4200/account/' + accountPage()" caption="The Account layout never re-renders. Only the child inside its outlet changes.">
          <div class="rounded-lg border border-stone-700">
            <p class="border-b border-stone-700 bg-stone-900 px-3 py-2 text-xs font-bold tracking-wider text-gold-300">ACCOUNT LAYOUT (parent)</p>
            <div class="p-3">
              <p class="text-xs text-stone-500">&lt;router-outlet&gt; shows:</p>
              <p class="mt-2 rounded-lg border border-dashed border-gold-400/30 bg-gold-500/5 p-3 text-sm text-gold-200">{{ accountPage() }}Component</p>
            </div>
          </div>
        </app-code-output>
      </app-lesson-card>

      <app-lesson-card class="mt-5" label="RESOLVERS" heading="Get the data before the page opens">
        <p class="mt-2 text-sm text-stone-400">
          Normally the page opens first and then fetches its data, so the user sees an empty page for a moment. A <strong class="text-stone-200">resolver</strong> is a function
          the router runs <em>before</em> it activates the route. The page opens with its data already there.
        </p>
        <pre class="mt-3" [appCode]="resolverCode"></pre>
      </app-lesson-card>

      <app-lesson-card class="mt-5" variant="highlight" label="TRY IT" heading="With and without a resolver">
        <div class="mt-3 flex flex-wrap items-center gap-2">
          <div class="flex gap-2" role="group" aria-label="Resolver">
            <button type="button" [attr.aria-pressed]="useResolver()" (click)="useResolver.set(true)"
                    class="min-h-11 rounded-xl border px-4 text-sm font-semibold transition"
                    [class]="useResolver() ? 'border-gold-400 bg-gold-500/15 text-gold-200' : 'border-stone-700 text-stone-300 hover:bg-stone-800'">With a resolver</button>
            <button type="button" [attr.aria-pressed]="!useResolver()" (click)="useResolver.set(false)"
                    class="min-h-11 rounded-xl border px-4 text-sm font-semibold transition"
                    [class]="!useResolver() ? 'border-gold-400 bg-gold-500/15 text-gold-200' : 'border-stone-700 text-stone-300 hover:bg-stone-800'">Without</button>
          </div>
          <button type="button" (click)="openUser()" class="min-h-11 rounded-xl bg-gold-solid px-4 text-sm font-semibold text-white hover:bg-gold-solid-hover">Open /users/7</button>
          <button type="button" (click)="backHome()" class="min-h-11 rounded-xl border border-stone-600 px-4 text-sm font-semibold text-stone-200 hover:bg-stone-800">Back to /home</button>
        </div>
        <div class="mt-4 rounded-xl border border-stone-700 bg-stone-900 p-4" aria-live="polite">
          <p class="text-xs text-stone-500">URL: <code class="text-gold-300">{{ url() }}</code>
            @if (waiting()) { <span class="ml-2 text-amber-300">router is waiting for the resolver…</span> }
          </p>
          <p class="mt-3 text-lg font-bold text-gold-200">{{ pageTitle() }}</p>
          <p class="mt-1 text-sm text-stone-400">{{ pageBody() }}</p>
        </div>
      </app-lesson-card>

      <app-common-mistake class="mt-5" title="Fetching in the page when the layout needs the data first" [wrong]="mistakeResolveWrong" [right]="mistakeResolveRight">
        If the page cannot show anything useful without its data, a resolver keeps the old page on screen until the data is ready, instead of flashing an empty one.
        For data that can load while the page is already visible, fetching inside the page is fine.
      </app-common-mistake>

      <app-recap class="mt-5" [items]="recapNested" />
      </section>
      </ng-template>

      <ng-template appLessonSection="guards-preview">
      <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <app-lesson-card class="mt-10" label="GUARDS · PREVIEW" heading="Stop a route before it opens">
          <p class="mt-2 text-sm text-stone-400">
            A guard is a function the router runs before it activates a route. It can allow the navigation, or return a
            <code class="text-gold-300">UrlTree</code> to redirect the user somewhere else. The next topic covers guards in detail.
          </p>
          <pre class="mt-4 overflow-x-auto rounded-xl bg-stone-950 p-4 text-xs text-gold-200">&#123; path: 'admin', canActivate: [adminGuard], component: AdminComponent &#125;</pre>
        </app-lesson-card>

      <app-recap class="mt-5" [items]="recapGuards" />
      <app-knowledge-check [items]="checkItems" />
      </section>
      </ng-template>
    </app-lesson-player>
  `,
})
export class RoutingComponent {
  readonly section = input<string>();

  protected readonly setupCode = `// app.routes.ts
export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: '**', component: NotFoundComponent },
];

// app.config.ts
providers: [provideRouter(routes, withComponentInputBinding())]

// app.component.html: the one place the pages appear
<nav>…links…</nav>
<router-outlet />`;

  protected readonly linksCode = `<a [routerLink]="['/products', product.id]">Details</a>          <!-- /products/42 -->
<a routerLink="/products" [queryParams]="{ page: 2 }">Next</a>      <!-- /products?page=2 -->
<a routerLink="/products" routerLinkActive="text-gold-300">Products</a>

this.router.navigate(['/products', 42], { queryParams: { tab: 'reviews' } });`;

  protected readonly paramsCode = `// 1. an input (preferred): needs withComponentInputBinding()
id = input.required<string>();

// 2. an Observable: updates when the id changes
id = toSignal(inject(ActivatedRoute).paramMap.pipe(map((p) => p.get('id'))));

// 3. a snapshot: read once, goes stale if /product/1 becomes /product/2
const id = inject(ActivatedRoute).snapshot.paramMap.get('id');`;

  protected readonly accountPages = ['Profile', 'Security', 'Billing'] as const;
  protected readonly accountPage = signal<'Profile' | 'Security' | 'Billing'>('Profile');

  protected readonly nestedCode = `export const routes: Routes = [
  {
    path: 'account',
    component: AccountLayoutComponent,        // has its own <router-outlet />
    children: [
      { path: 'profile', component: ProfileComponent },
      { path: 'security', component: SecurityComponent },
      { path: 'billing', component: BillingComponent },
    ],
  },
];`;

  protected readonly resolverCode = `export const userResolver: ResolveFn<User> = (route) =>
  inject(UsersService).get(route.paramMap.get('id')!);

{ path: 'users/:id', component: UserComponent, resolve: { user: userResolver } }

// in UserComponent, with withComponentInputBinding():
user = input.required<User>();`;

  // Resolver simulation
  private readonly destroyRef = inject(DestroyRef);
  private timer: ReturnType<typeof setTimeout> | undefined;
  protected readonly useResolver = signal(true);
  protected readonly url = signal('/home');
  protected readonly waiting = signal(false);
  protected readonly pageTitle = signal('HomeComponent');
  protected readonly pageBody = signal('The page you are on.');

  protected openUser(): void {
    clearTimeout(this.timer);
    if (this.useResolver()) {
      this.waiting.set(true);
      this.timer = setTimeout(() => {
        this.waiting.set(false);
        this.url.set('/users/7');
        this.pageTitle.set('UserComponent');
        this.pageBody.set('Ada Lovelace, ready the moment the page opened.');
      }, 900);
    } else {
      this.url.set('/users/7');
      this.pageTitle.set('UserComponent');
      this.pageBody.set('Loading…');
      this.timer = setTimeout(() => this.pageBody.set('Ada Lovelace, after a flash of "Loading…".'), 900);
    }
  }

  protected backHome(): void {
    clearTimeout(this.timer);
    this.waiting.set(false);
    this.url.set('/home');
    this.pageTitle.set('HomeComponent');
    this.pageBody.set('The page you are on.');
  }

  constructor() {
    this.destroyRef.onDestroy(() => clearTimeout(this.timer));
  }

  protected readonly mistakeResolveWrong = `ngOnInit() {
  this.users.get(this.id()).subscribe(u => this.user = u);   // page opens empty first
}`;
  protected readonly mistakeResolveRight = `{ path: 'users/:id', component: UserComponent, resolve: { user: userResolver } }`;

  protected readonly mistakeSnapshotWrong = `const id = inject(ActivatedRoute).snapshot.paramMap.get('id');   // read once`;
  protected readonly mistakeSnapshotRight = `id = input.required<string>();      // updates whenever the URL changes`;
  protected readonly mistakeLinkWrong = '<a href="/products">Products</a>   <!-- reloads the whole app -->';
  protected readonly mistakeLinkRight = '<a routerLink="/products">Products</a>';

  protected readonly recapBasics = [
    'A route maps a URL to a component.',
    'The router-outlet is the one spot where the matched component appears.',
    'Only the outlet changes; the rest of the page stays.',
  ];
  protected readonly recapMatch = [
    'The router goes top to bottom and stops at the first match.',
    ':id captures a value; ** catches everything and goes last.',
    'Query parameters are not part of the match.',
  ];
  protected readonly recapNav = [
    'routerLink is for links the user clicks.',
    'router.navigate() is for navigation after some logic.',
    'routerLinkActive highlights the link of the current page.',
  ];
  protected readonly recapParams = [
    'A colon makes a dynamic segment: products/:id.',
    'Prefer an input() with withComponentInputBinding(); it stays up to date.',
    'A snapshot is read once and can go stale.',
  ];
  protected readonly recapNested = [
    'children put pages inside a parent layout with its own outlet.',
    'A resolver loads data before the route opens.',
    'Use a resolver when the page is useless without its data.',
  ];
  protected readonly recapGuards = [
    'A guard runs before a route opens and can allow it or redirect.',
    'Guards come next, with a live login demo.',
    'canActivate is the most common one.',
  ];

  readonly navigateChallenge: PredictChallenge = {
    question: 'Which URL does this navigate to?',
    code: "this.router.navigate(['/users', 5, 'edit']);",
    options: [
      { id: 'b', text: '/users,5,edit' },
      { id: 'c', text: '/users/5' },
      { id: 'd', text: '/users5edit' },
      { id: 'a', text: '/users/5/edit' },
    ],
    correct: 'a',
    explanation: 'Each item in the array becomes one segment of the path, and Angular joins the segments with slashes.',
  };
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

  readonly checkItems: KnowledgeCheckItem[] = [
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
