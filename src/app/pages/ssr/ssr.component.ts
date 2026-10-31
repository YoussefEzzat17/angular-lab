import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, PLATFORM_ID, signal } from '@angular/core';

import { LessonPlayerComponent } from '../../learn/player/lesson-player.component';
import { LessonSectionDirective } from '../../learn/player/lesson-section.directive';
import { CodeBlockDirective } from '../../shared/code-block.directive';
import { CodeOutputComponent } from '../../shared/code-output.component';
import { CommonMistakeComponent } from '../../shared/common-mistake.component';
import { KnowledgeCheckComponent, KnowledgeCheckItem } from '../../shared/knowledge-check.component';
import { LessonCardComponent } from '../../shared/lesson-card.component';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { PredictChallenge, PredictOutputComponent } from '../../shared/predict-output.component';
import { RecapComponent } from '../../shared/recap.component';

interface Mode {
  id: 'csr' | 'ssr' | 'ssg';
  label: string;
  where: string;
  htmlMs: number;
  visibleMs: number;
  interactiveMs: number;
  good: string;
  cost: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CodeBlockDirective,
    CodeOutputComponent,
    CommonMistakeComponent,
    KnowledgeCheckComponent,
    LessonCardComponent,
    LessonPlayerComponent,
    LessonSectionDirective,
    PageHeaderComponent,
    PredictOutputComponent,
    RecapComponent,
  ],
  template: `
    <app-lesson-player [topicId]="'ssr'" [section]="section()">
      <!-- ── Why ── -->
      <ng-template appLessonSection="why">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-page-header title="SSR and Hydration" illustration="ssr">
            By default an Angular app is built in the browser: the server sends an almost empty page and a lot of JavaScript, and the JavaScript draws everything.
            <strong class="text-stone-200">Server-side rendering (SSR)</strong> draws the first version of the page on a server, so the visitor sees real content right away.
          </app-page-header>

          <app-lesson-card class="mt-10" label="1 · THE PROBLEM" heading="A blank page while the JavaScript arrives">
            <p class="mt-2 text-sm text-stone-400">
              With client-side rendering, the visitor waits for the JavaScript to download and run before anything appears. On a slow phone that can be seconds of white screen.
              Search engines and link previews may also see an empty page, because they do not always run your JavaScript.
            </p>
          </app-lesson-card>

          <app-lesson-card class="mt-5" tone="amber" label="2 · THE MENTAL MODEL" heading="A meal served ready, then the table gets its cutlery">
            <ul class="mt-3 list-disc space-y-2 pl-5 text-sm text-stone-300">
              <li><strong class="text-stone-100">The server</strong> cooks the dish (the HTML) and sends it, so the guest can start looking at it at once.</li>
              <li><strong class="text-stone-100">The browser</strong> then loads Angular and <em>hydrates</em> the page: it attaches the click handlers to the HTML that is already there.</li>
              <li><strong class="text-stone-100">No redraw.</strong> Hydration reuses the existing HTML instead of throwing it away.</li>
            </ul>
          </app-lesson-card>

          <app-lesson-card class="mt-5" label="3 · THIS SITE" heading="Angular Lab is client-rendered">
            <p class="mt-2 text-sm text-stone-400">
              This site has no server, only files on a CDN, so it uses client-side rendering. That is a good fit for a learning app. The rest of this lesson shows what changes when you add a server.
            </p>
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="highlight" label="PREDICT" heading="What does a search engine see?">
            <app-predict-output [challenge]="seoChallenge" />
          </app-lesson-card>

          <app-recap class="mt-5" [items]="recapWhy" />
        </section>
      </ng-template>

      <!-- ── Modes ── -->
      <ng-template appLessonSection="modes">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card class="mt-10" variant="highlight" label="TRY IT" heading="Compare three ways to render">
            <div class="mt-3 flex flex-wrap gap-2" role="group" aria-label="Rendering mode">
              @for (m of modes; track m.id) {
                <button type="button" [attr.aria-pressed]="mode().id === m.id" (click)="mode.set(m)"
                        class="min-h-11 rounded-xl border px-4 text-sm font-semibold transition"
                        [class]="mode().id === m.id ? 'border-gold-400 bg-gold-500/15 text-gold-200' : 'border-stone-700 text-stone-300 hover:bg-stone-800'">{{ m.label }}</button>
              }
            </div>
            <p class="mt-3 text-sm text-stone-300">{{ mode().where }}</p>
            <div class="mt-4 space-y-3" role="img" [attr.aria-label]="barsDescription()">
              @for (bar of bars(); track bar.name) {
                <div>
                  <div class="flex justify-between text-xs text-stone-400"><span>{{ bar.name }}</span><span>{{ bar.ms }} ms</span></div>
                  <div class="mt-1 h-3 overflow-hidden rounded-full bg-stone-800">
                    <div class="h-full rounded-full bg-gold-400 transition-[width] duration-500 motion-reduce:transition-none" [style.width.%]="bar.percent"></div>
                  </div>
                </div>
              }
            </div>
            <p class="mt-2 text-xs text-stone-500">Illustrative numbers for a slow phone, to show the shape of each mode. Real timings depend on your app and network.</p>
            <dl class="mt-4 grid gap-3 sm:grid-cols-2">
              <div class="rounded-xl bg-stone-800 p-3"><dt class="text-xs font-bold text-emerald-300">Good for</dt><dd class="mt-1 text-sm text-stone-200">{{ mode().good }}</dd></div>
              <div class="rounded-xl bg-stone-800 p-3"><dt class="text-xs font-bold text-rose-300">Costs</dt><dd class="mt-1 text-sm text-stone-200">{{ mode().cost }}</dd></div>
            </dl>
          </app-lesson-card>

          <app-lesson-card class="mt-5" label="HYDRATION" heading="Attach to the HTML, do not rebuild it">
            <p class="mt-2 text-sm text-stone-400">
              Turn it on with one provider. <code class="text-gold-300">withEventReplay()</code> remembers clicks made before Angular finished loading and replays them, so an early click is not lost.
            </p>
            <pre class="mt-3" [appCode]="hydrationCode"></pre>
          </app-lesson-card>

          <app-recap class="mt-5" [items]="recapModes" />
        </section>
      </ng-template>

      <!-- ── Browser only ── -->
      <ng-template appLessonSection="browser-only">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card class="mt-10" label="THE CATCH" heading="On a server there is no window">
            <p class="mt-2 text-sm text-stone-400">
              The first render runs in Node.js, not in a browser. There is no <code class="text-gold-300">window</code>, no screen, no <code class="text-gold-300">localStorage</code>.
              Code that touches them crashes the render. The fix is to ask Angular where you are, or to run that code only after rendering in a browser.
            </p>
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="highlight" label="TRY IT" heading="Where is this code running?">
            <label class="flex min-h-11 cursor-pointer items-center gap-2 text-sm text-stone-200">
              <input type="checkbox" [checked]="pretendServer()" (change)="pretendServer.set($any($event.target).checked)" class="h-4 w-4 accent-[rgb(var(--gold-400))]" />
              Pretend this code runs on the server
            </label>
            <app-code-output class="mt-4 block" [code]="guardCode" caption="The guard asks Angular for the platform. On the server it skips the browser-only work.">
              <p class="text-sm text-stone-200">
                Platform: <strong class="text-gold-300" data-testid="platform">{{ platformName() }}</strong>
              </p>
              <p class="mt-2 text-sm text-stone-200">Window width: <strong class="text-gold-300" data-testid="width">{{ width() }}</strong></p>
              <button type="button" (click)="measure()" class="mt-3 min-h-11 rounded-xl bg-gold-solid px-4 text-sm font-semibold text-white hover:bg-gold-solid-hover">Measure the window</button>
            </app-code-output>
          </app-lesson-card>

          <app-lesson-card class="mt-5" label="SAFE HABITS" heading="Three ways to stay safe">
            <ul class="mt-3 list-disc space-y-2 pl-5 text-sm text-stone-300">
              <li><strong class="text-stone-100">Inject, do not reach for globals.</strong> Use <code class="text-gold-300">inject(DOCUMENT)</code> instead of <code class="text-gold-300">document</code>.</li>
              <li><strong class="text-stone-100">Wait for the browser.</strong> Put DOM work in <code class="text-gold-300">afterNextRender()</code>, which never runs on the server.</li>
              <li><strong class="text-stone-100">Check the platform</strong> with <code class="text-gold-300">isPlatformBrowser(inject(PLATFORM_ID))</code> when you must branch.</li>
            </ul>
          </app-lesson-card>

          <app-common-mistake class="mt-5" title="Reading window in a constructor" [wrong]="mistakeWindowWrong" [right]="mistakeWindowRight">
            The constructor runs on the server too, where <code class="text-gold-300">window</code> does not exist. Move the work to <code class="text-gold-300">afterNextRender()</code>.
          </app-common-mistake>

          <app-recap class="mt-5" [items]="recapBrowser" />
        </section>
      </ng-template>

      <!-- ── Routes ── -->
      <ng-template appLessonSection="routes">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card class="mt-10" label="PER ROUTE" heading="Choose a mode for each page">
            <p class="mt-2 text-sm text-stone-400">
              You do not have to pick one mode for the whole app. A list of server routes says how each URL is rendered:
              <code class="text-gold-300">Prerender</code> at build time, <code class="text-gold-300">Server</code> on every request, or <code class="text-gold-300">Client</code> in the browser.
            </p>
            <pre class="mt-3" [appCode]="routesCode"></pre>
          </app-lesson-card>

          <app-lesson-card class="mt-5" label="SETUP" heading="Adding SSR to a project">
            <pre class="mt-3" [appCode]="addCode"></pre>
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="highlight" label="PREDICT" heading="Which mode fits this page?">
            <app-predict-output [challenge]="routeChallenge" />
          </app-lesson-card>

          <app-recap class="mt-5" [items]="recapRoutes" />
          <app-knowledge-check [items]="checkItems" />
        </section>
      </ng-template>
    </app-lesson-player>
  `,
})
export class SsrComponent {
  readonly section = input<string>();
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);

  protected readonly modes: Mode[] = [
    {
      id: 'csr',
      label: 'Client (CSR)',
      where: 'The server sends an empty shell and JavaScript. The browser downloads it and draws the page.',
      htmlMs: 100,
      visibleMs: 1400,
      interactiveMs: 1400,
      good: 'Apps behind a login, dashboards and tools. The simplest to host.',
      cost: 'A blank screen until the JavaScript runs, and weaker for search engines and link previews.',
    },
    {
      id: 'ssr',
      label: 'Server (SSR)',
      where: 'A server renders the HTML for every request, then the browser hydrates it.',
      htmlMs: 600,
      visibleMs: 650,
      interactiveMs: 1500,
      good: 'Pages that differ per visitor or change often, and that search engines should read.',
      cost: 'You need a server, and each request waits for it to render.',
    },
    {
      id: 'ssg',
      label: 'Prerender (SSG)',
      where: 'The HTML is built once, at build time, and served as a plain file from a CDN. The browser then hydrates it.',
      htmlMs: 80,
      visibleMs: 120,
      interactiveMs: 1000,
      good: 'Pages that are the same for everyone: marketing pages, docs, blogs. Fast and cheap.',
      cost: 'The page is only as fresh as the last build.',
    },
  ];
  protected readonly mode = signal(this.modes[0]);

  protected bars(): { name: string; ms: number; percent: number }[] {
    const m = this.mode();
    const max = 1600;
    return [
      { name: 'HTML arrives', ms: m.htmlMs, percent: (m.htmlMs / max) * 100 },
      { name: 'Content visible', ms: m.visibleMs, percent: (m.visibleMs / max) * 100 },
      { name: 'Page interactive', ms: m.interactiveMs, percent: (m.interactiveMs / max) * 100 },
    ];
  }

  protected barsDescription(): string {
    const m = this.mode();
    return `${m.label}: HTML at ${m.htmlMs} ms, content visible at ${m.visibleMs} ms, interactive at ${m.interactiveMs} ms.`;
  }

  // ── browser-only ──
  protected readonly pretendServer = signal(false);
  protected readonly width = signal('not measured');

  protected platformName(): string {
    if (this.pretendServer()) return 'server (pretend)';
    return isPlatformBrowser(this.platformId) ? 'browser' : 'server';
  }

  protected measure(): void {
    if (this.pretendServer() || !isPlatformBrowser(this.platformId)) {
      this.width.set('skipped: no window on the server');
      return;
    }
    const view = this.document.defaultView;
    this.width.set(view ? `${view.innerWidth}px` : 'unknown');
  }

  protected readonly seoChallenge: PredictChallenge = {
    question: 'A crawler fetches your client-rendered page but does not run JavaScript. What does it see?',
    options: [
      { id: 'a', text: 'The full page, with all its content' },
      { id: 'b', text: 'Mostly an empty shell' },
      { id: 'c', text: 'An error page' },
      { id: 'd', text: 'Only the images' },
    ],
    correct: 'b',
    explanation: 'The HTML that arrives is nearly empty, and the content appears only after the JavaScript runs. With SSR or prerendering the content is already in the HTML.',
  };

  protected readonly routeChallenge: PredictChallenge = {
    question: 'The "About us" page is the same for everyone and changes twice a year. Which mode fits best?',
    options: [
      { id: 'a', text: 'Client' },
      { id: 'b', text: 'Server, on every request' },
      { id: 'c', text: 'Prerender at build time' },
      { id: 'd', text: 'None of them' },
    ],
    correct: 'c',
    explanation: 'It is the same for everyone and rarely changes, so build it once and serve a plain file. That is the fastest and cheapest option.',
  };

  protected readonly hydrationCode = `// app.config.ts
providers: [
  provideClientHydration(withEventReplay()),
]`;

  protected readonly guardCode = `private platformId = inject(PLATFORM_ID);

measure() {
  if (!isPlatformBrowser(this.platformId)) return;   // on the server: skip
  this.width = window.innerWidth;
}`;

  protected readonly routesCode = `// app.routes.server.ts
export const serverRoutes: ServerRoute[] = [
  { path: '',            renderMode: RenderMode.Prerender },   // built once
  { path: 'learn/:topic', renderMode: RenderMode.Server },    // rendered per request
  { path: 'dashboard',   renderMode: RenderMode.Client },     // browser only
  { path: '**',          renderMode: RenderMode.Server },
];`;

  protected readonly addCode = `ng add @angular/ssr          # adds the server, the config and hydration
ng build                     # builds the browser and the server
node dist/my-app/server/server.mjs`;

  protected readonly mistakeWindowWrong = `constructor() {
  this.width = window.innerWidth;     // crashes on the server
}`;
  protected readonly mistakeWindowRight = `constructor() {
  afterNextRender(() => (this.width = window.innerWidth));   // browser only
}`;

  protected readonly recapWhy = [
    'Client rendering sends an empty shell and draws everything with JavaScript.',
    'SSR sends ready HTML, so the page is visible sooner and easier for crawlers.',
    'Hydration then attaches Angular to that HTML without redrawing it.',
  ];
  protected readonly recapModes = [
    'Client: simplest to host. Server: fresh per request. Prerender: built once, fastest.',
    'Content appears sooner with SSR and prerendering; interactivity still waits for hydration.',
    'withEventReplay() keeps clicks made before hydration finished.',
  ];
  protected readonly recapBrowser = [
    'The first render runs in Node.js, where there is no window or localStorage.',
    'Use inject(DOCUMENT), afterNextRender or isPlatformBrowser.',
    'Never touch window in a constructor.',
  ];
  protected readonly recapRoutes = [
    'Choose a render mode per route: Prerender, Server or Client.',
    'Pages that are the same for everyone are best prerendered.',
    'ng add @angular/ssr sets everything up.',
  ];

  protected readonly checkItems: KnowledgeCheckItem[] = [
    { question: 'What does hydration do?', answer: 'It attaches Angular to the HTML the server already sent, so the page becomes interactive without being drawn again.' },
    { question: 'Why can reading window in a constructor break SSR?', answer: 'The first render runs in Node.js, where window does not exist, so the code throws. Use afterNextRender or a platform check.' },
    { question: 'Which mode suits a page that is the same for everyone?', answer: 'Prerender (static generation): build it once and serve a plain file, which is fast and cheap.' },
  ];
}
