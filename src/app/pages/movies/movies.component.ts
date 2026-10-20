import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';

import { Movie } from '../../core/models/movie.model';
import { MovieService } from '../../core/services/movie.service';
import { CodeBlockDirective } from '../../shared/code-block.directive';
import { FlowDiagramComponent } from '../../shared/flow-diagram.component';
import { OrderStepsComponent } from '../../shared/order-steps.component';
import { PredictOutputComponent } from '../../shared/predict-output.component';
import type { PredictChallenge } from '../../shared/predict-output.component';
import { ColdObservableDemoComponent } from './cold-observable-demo.component';
import { HttpLabDemoComponent } from './http-lab-demo.component';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { KnowledgeCheckComponent, KnowledgeCheckItem } from '../../shared/knowledge-check.component';
import { LessonCardComponent } from '../../shared/lesson-card.component';
import { LessonPlayerComponent } from '../../learn/player/lesson-player.component';
import { LessonSectionDirective } from '../../learn/player/lesson-section.directive';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CodeBlockDirective, ColdObservableDemoComponent, HttpLabDemoComponent, OrderStepsComponent, PredictOutputComponent, FlowDiagramComponent, KnowledgeCheckComponent, PageHeaderComponent, LessonCardComponent, LessonPlayerComponent, LessonSectionDirective],
  template: `
    <app-lesson-player [topicId]="'movies'" [section]="section()">
      <ng-template appLessonSection="httpclient">
      <section class="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <app-page-header title="Fetch API &amp; HTTP Client" illustration="http">
        Real apps get their data from a server, not a hardcoded array. Angular's <code class="text-gold-300">HttpClient</code> — injected
        into a service, not the component — makes that request and returns an Observable. These films come from a real public API. Type
        below to see property binding, event binding, a signal, and a computed value all working together on live data.
      </app-page-header>

      <aside class="mt-10 rounded-2xl border border-gold-400/20 bg-gold-950/30 p-6 text-sm text-stone-300">
        <h2 class="font-bold text-gold-200">Follow the data flow</h2>
        <p class="mt-2">This component never calls the API directly — a service does, and hands back an Observable of values.</p>
        <div class="mt-4 flex flex-wrap items-center gap-x-3 gap-y-3">
          <app-flow-diagram from="MovieService" to="HttpClient.get()" direction="right" />
          <app-flow-diagram from="public API" to="Observable" direction="right" />
          <app-flow-diagram from=".subscribe()" to="signal.set()" direction="right" />
        </div>
        <p class="mt-4 text-xs text-stone-400">
          <code class="text-gold-300">signal.set()</code> triggers <code class="text-gold-300">computed()</code> to recalculate
          <code class="text-gold-300">filteredMovies()</code>, and Angular re-renders only the cards that actually changed.
        </p>
      </aside>

      <app-lesson-card class="mt-5" label="1 · THE PROBLEM" heading="The data is somewhere else, and it takes time">
        <p class="mt-2 text-sm text-stone-400">
          A list of films does not live in your app. It lives on a server, and your app has to <strong class="text-stone-200">ask for it over HTTP</strong> and wait. While it waits, the page still has
          to show something. That waiting is why HTTP in Angular is asynchronous, and why you get an Observable instead of the data itself.
        </p>
      </app-lesson-card>

      <app-lesson-card class="mt-5" label="2 · THE MENTAL MODEL" heading="Ordering at a restaurant" tone="amber">
        <ul class="mt-3 list-disc space-y-2 pl-5 text-sm text-stone-300">
          <li><strong class="text-stone-100">You</strong> are the component. You decide what you want, but you do not go into the kitchen.</li>
          <li><strong class="text-stone-100">The waiter</strong> is the service. You give the order, and the waiter knows how to talk to the kitchen.</li>
          <li><strong class="text-stone-100">The kitchen</strong> is the server. It takes a while, and it can say "we are out of that" (an error).</li>
          <li><strong class="text-stone-100">The order slip</strong> is the Observable. Nothing is cooked until the slip is handed in: that is <code class="text-gold-300">subscribe()</code>.</li>
        </ul>
      </app-lesson-card>

      <app-lesson-card class="mt-5" label="3 · SET IT UP" heading="Provide HttpClient once, inject it where you need it">
        <pre class="mt-3 overflow-x-auto rounded-xl bg-stone-950 p-4 text-xs text-gold-200">{{ setupCode }}</pre>
        <p class="mt-3 text-sm text-stone-400">
          <code class="text-gold-300">provideHttpClient()</code> goes in the app config one time. After that any service can ask for <code class="text-gold-300">HttpClient</code> with
          <code class="text-gold-300">inject()</code>. This is also where interceptors are added.
        </p>
      </app-lesson-card>
      </section>
      </ng-template>

      <ng-template appLessonSection="request-anatomy">
      <section class="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <app-lesson-card class="mt-10" label="4 · ANATOMY" heading="A request goes out, a status code comes back">
        <p class="mt-2 text-sm text-stone-400">
          Every HTTP request has a method (GET to read, POST to create), a URL and sometimes a body. Every response has a <strong class="text-stone-200">status code</strong>:
          2xx means it worked, 4xx means you asked for something wrong, 5xx means the server failed.
        </p>
      </app-lesson-card>

      <app-lesson-card class="mt-5" variant="highlight" label="5 · TRY IT" heading="Send requests to a pretend server">
        <ol class="mt-2 list-decimal space-y-1 pl-5 text-sm text-stone-400">
          <li>Load all films and see the 200 and the JSON body.</li>
          <li>Load film 99. The server answers 404, and your code gets <strong class="text-stone-200">error()</strong> instead of <strong class="text-stone-200">next()</strong>.</li>
          <li>Try the server crash, then Add a film (a POST with a body).</li>
        </ol>
        <app-http-lab-demo />
      </app-lesson-card>

      <app-lesson-card class="mt-5" label="6 · STATUS CODES" heading="What HttpClient does with each one">
        <div class="mt-4 overflow-x-auto rounded-xl border border-stone-800">
          <table class="w-full text-left text-sm">
            <thead class="bg-stone-800 text-stone-300">
              <tr>
                <th class="px-4 py-2 font-semibold">Status</th>
                <th class="px-4 py-2 font-semibold">Meaning</th>
                <th class="px-4 py-2 font-semibold">Your code gets</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-stone-800 text-stone-400">
              @for (row of statusRows; track row.status) {
                <tr>
                  <td class="whitespace-nowrap px-4 py-2 font-mono text-gold-300">{{ row.status }}</td>
                  <td class="px-4 py-2">{{ row.meaning }}</td>
                  <td class="whitespace-nowrap px-4 py-2 font-mono text-xs">{{ row.callback }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </app-lesson-card>
      </section>
      </ng-template>

      <ng-template appLessonSection="service-pattern">
      <section class="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <app-lesson-card class="mt-10" label="SERVICE PATTERN" heading="Keep HTTP in a service">
        <p class="mt-2 text-sm text-stone-400">
          The component asks a service for data and never builds the URL itself. The service wraps <code class="text-gold-300">HttpClient</code>
          and returns an Observable, so the same call can be reused and tested on its own.
        </p>
        <pre class="mt-4 overflow-x-auto rounded-xl bg-stone-950 p-4 text-xs text-gold-200">getMovies(): Observable&lt;MoviesResponse&gt; &#123;
  return this.http.get&lt;MoviesResponse&gt;(this.apiUrl);
&#125;</pre>
      </app-lesson-card>

      <app-lesson-card class="mt-5" label="TYPE THE RESPONSE" heading="Tell TypeScript what comes back">
        <p class="mt-2 text-sm text-stone-400">
          The angle brackets in <code class="text-gold-300">get&lt;Movie[]&gt;()</code> tell TypeScript the shape of the JSON. It is a promise you make, not a check: if the server sends something else,
          nothing stops it at runtime. That is why the error and empty states below matter.
        </p>
        <pre class="mt-4 overflow-x-auto rounded-xl bg-stone-950 p-4 text-xs text-gold-200">{{ typedCode }}</pre>
      </app-lesson-card>
      </section>
      </ng-template>

      <ng-template appLessonSection="cold">
      <section class="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <app-lesson-card class="mt-10" label="COLD OBSERVABLES" heading="Every subscriber starts its own request">
        <p class="mt-2 text-sm text-stone-400">
          An Observable from <code class="text-gold-300">HttpClient</code> is a <strong class="text-stone-200">recipe</strong>, not a result. Each time something subscribes, the recipe runs again.
          Two components that both subscribe cause <strong class="text-stone-200">two network calls</strong> for the same data.
        </p>
      </app-lesson-card>

      <app-lesson-card class="mt-5" variant="highlight" label="TRY IT" heading="Count the network calls">
        <ol class="mt-2 list-decimal space-y-1 pl-5 text-sm text-stone-400">
          <li>With the plain request, press subscribe() in Component A and then in B. Two calls.</li>
          <li>Switch to <strong class="text-stone-200">shareReplay(1)</strong> and do it again. One call, and B still gets the data.</li>
        </ol>
        <app-cold-observable-demo />
      </app-lesson-card>

      <app-lesson-card class="mt-5" label="THE FIXES" heading="Load once, share the result">
        <pre class="mt-3 overflow-x-auto rounded-xl bg-stone-950 p-4 text-xs text-gold-200">{{ shareCode }}</pre>
        <p class="mt-3 text-sm text-stone-400">
          In a modern app the simplest fix is to subscribe once, in one place, and keep the result in a signal that every component reads. The Resource API lesson goes further and
          does the loading, the error state and the cancelling for you.
        </p>
      </app-lesson-card>
      </section>
      </ng-template>

      <ng-template appLessonSection="states">
      <section class="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <label class="mt-8 block max-w-xl" for="movie-search">
        <span class="text-sm font-semibold text-stone-200">Filter loaded movies</span>
        <input
          id="movie-search"
          [value]="searchTerm()"
          (input)="updateSearch($event)"
          class="mt-2 w-full rounded-xl border border-stone-700 bg-stone-900 px-4 py-3 text-stone-100 outline-none placeholder:text-stone-500 focus:border-gold-400"
          placeholder="Try 'castle' or 'wind'"
        />
      </label>

      @if (isLoading()) {
        <div class="mt-8 rounded-2xl border border-gold-400/20 bg-gold-950/30 p-6 text-gold-100">
          Loading films from the API…
        </div>
      } @else if (error()) {
        <div class="mt-8 rounded-2xl border border-[rgb(var(--panel-danger-heading))]/30 bg-[rgb(var(--panel-danger-bg))] p-6">
          <p class="font-bold text-[rgb(var(--panel-danger-heading))]">The movie request did not complete.</p>
          <p class="mt-1 text-sm text-stone-300">{{ error() }}</p>
          <button (click)="loadMovies()" class="mt-4 rounded-xl bg-gold-solid px-4 py-2 font-semibold text-white hover:bg-gold-solid-hover">
            Try again
          </button>
        </div>
      } @else if (movies().length === 0) {
        <div class="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6 text-stone-300">
          No movies have been loaded yet.
        </div>
      } @else if (filteredMovies().length === 0) {
        <div class="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6 text-stone-300">
          No loaded movies match “{{ searchTerm() }}”.
        </div>
      } @else {
        <p class="mt-8 text-sm text-stone-400">Showing {{ filteredMovies().length }} of {{ movies().length }} films</p>
        <div class="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          @for (movie of filteredMovies(); track movie.id) {
            <article class="overflow-hidden rounded-2xl bg-stone-900 ring-1 ring-stone-800">
              <img [src]="movie.image" [alt]="movie.title + ' poster'" class="h-80 w-full object-cover" />
              <div class="p-5">
                <div class="flex items-start justify-between gap-3">
                  <h2 class="text-xl font-bold">{{ movie.title }}</h2>
                  <span class="shrink-0 rounded-full bg-amber-400/15 px-2.5 py-1 text-xs font-bold text-amber-300">★ {{ movie.rt_score }}</span>
                </div>
                <p class="mt-1 text-sm text-gold-300">{{ movie.release_date }} · {{ movie.director }}</p>
                <p class="mt-4 text-sm leading-6 text-stone-400">{{ movie.description }}</p>
              </div>
            </article>
          }
        </div>
      }

      <app-lesson-card class="mt-5" variant="danger" label="COMMON MISTAKES" heading="HTTP mistakes to avoid">
        <ul class="mt-3 list-disc space-y-2 pl-5 text-sm text-stone-300">
          <li><strong class="text-stone-100">Calling http.get() and never subscribing.</strong> An Observable is lazy — no subscription, no request.</li>
          <li><strong class="text-stone-100">Only handling the success case.</strong> Real users see loading, empty and error states too. Without them the page just looks broken.</li>
          <li><strong class="text-stone-100">Subscribing twice by accident.</strong> Using the same Observable in an <code class="text-gold-300">async</code> pipe and in a manual <code class="text-gold-300">subscribe()</code> sends the request two times.</li>
          <li><strong class="text-stone-100">Hard-coding URLs in components.</strong> Keep them in the service so there is one place to change.</li>
        </ul>
      </app-lesson-card>
      </section>
      </ng-template>

      <ng-template appLessonSection="try-it">
      <section class="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <app-lesson-card class="mt-10" variant="highlight" label="TRY IT" heading="Add a rating filter">
        <p class="mt-2 text-sm text-stone-400">
          Add a <code class="text-gold-300">minRating</code> signal and extend <code class="text-gold-300">filteredMovies</code> so it also drops
          films whose <code class="text-gold-300">rt_score</code> is below it. Convert <code class="text-gold-300">rt_score</code> to a number before you compare.
        </p>
      </app-lesson-card>

      <app-lesson-card class="mt-5" variant="highlight" label="PREDICT" heading="How many requests are sent?">
        <app-predict-output [challenge]="neverSubscribeChallenge" />
      </app-lesson-card>

      <app-lesson-card class="mt-5" variant="highlight" label="PUT IT IN ORDER" heading="From the click to the screen">
        <p class="mt-2 text-sm text-stone-400">Put these five steps in the order they happen when this page loads the films.</p>
        <app-order-steps
          [steps]="flowSteps"
          explanation="The service only builds the recipe. Nothing goes over the network until subscribe(). When the server answers, next() runs, the signal changes and Angular updates only what depends on it."
        />
      </app-lesson-card>

      <app-knowledge-check [items]="checkItems" />
      </section>
      </ng-template>
    </app-lesson-player>
  `,
})
export class MoviesComponent {
  readonly section = input<string>();
  private readonly movieService = inject(MovieService);

  // Signals hold state that the template reads with parentheses, for example movies().
  readonly movies = signal<Movie[]>([]);
  readonly isLoading = signal(false);
  readonly error = signal('');
  readonly searchTerm = signal('');

  // This is derived state: Angular recalculates it when movies() or searchTerm() changes.
  readonly filteredMovies = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    return this.movies().filter((movie) =>
      !term || movie.title.toLowerCase().includes(term) || movie.director.toLowerCase().includes(term),
    );
  });

  constructor() {
    this.loadMovies();
  }

  loadMovies(): void {
    this.isLoading.set(true);
    this.error.set('');

    // HttpClient returns an Observable. subscribe() starts the request and handles its events.
    this.movieService.getMovies().subscribe({
      next: (movies) => this.movies.set(movies),
      error: () => {
        this.error.set('We could not reach the public movie API. Check your connection and try again.');
      },
      complete: () => this.isLoading.set(false),
    });
  }

  updateSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  readonly setupCode = `// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient()],
};

// movie.service.ts
@Injectable({ providedIn: 'root' })
export class MovieService {
  private readonly http = inject(HttpClient);

  getMovies() {
    return this.http.get<Movie[]>('/api/films');
  }
}`;

  readonly typedCode = `interface Movie {
  id: string;
  title: string;
  rt_score: string;
}

getMovies(): Observable<Movie[]> {
  return this.http.get<Movie[]>(this.apiUrl);   // the compiler now knows each item has a title
}`;

  readonly shareCode = `// 1. share the one request between every subscriber
films$ = this.http.get<Movie[]>(url).pipe(shareReplay(1));

// 2. or subscribe once and keep the result in a signal
films = toSignal(this.http.get<Movie[]>(url), { initialValue: [] });`;

  readonly statusRows = [
    { status: '200 OK', meaning: 'The request worked.', callback: 'next(body)' },
    { status: '201 Created', meaning: 'A POST made something new.', callback: 'next(body)' },
    { status: '400 Bad Request', meaning: 'The server did not understand what you sent.', callback: 'error(...)' },
    { status: '401 / 403', meaning: 'Not logged in, or not allowed.', callback: 'error(...)' },
    { status: '404 Not Found', meaning: 'There is nothing at that URL.', callback: 'error(...)' },
    { status: '500', meaning: 'The server itself failed.', callback: 'error(...)' },
    { status: '0', meaning: 'The request never got an answer, for example the network is down.', callback: 'error(...)' },
  ];

  readonly neverSubscribeChallenge: PredictChallenge = {
    question: 'The service builds the request but nothing ever subscribes. How many requests go over the network?',
    code: "getMovies() {\n  return this.http.get<Movie[]>('/api/films');\n}\n\n// somewhere else:\nconst films$ = this.movieService.getMovies();",
    options: [
      { id: 'one', text: 'One' },
      { id: 'two', text: 'Two' },
      { id: 'zero', text: 'None' },
      { id: 'cache', text: 'One, and the result is cached' },
    ],
    correct: 'zero',
    explanation: 'The Observable is only a recipe. HttpClient sends nothing until something calls subscribe(), or an async pipe does it for you.',
  };

  readonly flowSteps = [
    'The component calls movieService.getMovies()',
    'HttpClient returns a cold Observable and sends nothing yet',
    'The component calls subscribe() and the request goes out',
    'The server answers 200 with the JSON',
    'next() runs, the signal changes and the template updates',
  ];

  readonly checkItems: KnowledgeCheckItem[] = [
    {
      question: "Why does a Service's method usually return the Observable from http.get() instead of subscribing itself?",
      answer: 'So the caller controls when the request actually runs and can unsubscribe/cancel it — the Service just hands back the "recipe".',
    },
    {
      question: "What does providedIn: 'root' give you?",
      answer: 'A singleton — the Service is created once and that same instance is shared by every component that injects it.',
    },
    {
      question: 'Why use an interceptor instead of adding the auth header manually inside every Service method?',
      answer: 'One place handles it for every request automatically, instead of repeating (and risking forgetting) the same code everywhere.',
    },
  ];
}
