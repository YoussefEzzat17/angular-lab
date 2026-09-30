import { AsyncPipe } from '@angular/common';
import { Component, OnDestroy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CodeBlockDirective } from '../../shared/code-block.directive';
import { RecapComponent, RecapItem } from '../../shared/recap.component';
import { TopicNavComponent } from '../../shared/topic-nav.component';
import {
  Observable,
  Subject,
  Subscription,
  debounceTime,
  delay,
  distinctUntilChanged,
  filter,
  interval,
  map,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';

@Component({
  standalone: true,
  imports: [FormsModule, AsyncPipe, CodeBlockDirective, RecapComponent, TopicNavComponent],
  template: `
    <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p class="text-sm font-semibold text-gold-400">HANDS-ON WORKSHOP</p>
          <h1 class="mt-1 text-3xl font-bold sm:text-4xl">RxJS from Scratch</h1>
        </div>
        <a
          href="/pdfs/rxjs-cheat-sheet.pdf"
          download="rxjs-cheat-sheet.pdf"
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
        RxJS is a library that helps you deal with anything that happens "over time" — a click, typing in an input, an API response — as one
        <strong class="text-gold-300">data stream</strong> you can filter, transform and control, instead of handling each as a separate event.
        Try the examples below, and open the console to see what's happening under the hood.
      </p>

      <!-- 1 · WHY RXJS -->
      <article class="mt-10 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <p class="text-xs font-bold tracking-wider text-gold-300">1 · Why does RxJS exist?</p>
        <h2 class="mt-2 text-xl font-bold">The problem before RxJS</h2>
        <p class="mt-2 text-sm text-stone-400">
          When you have lots of events happening over time (typing, clicks, API replies), handling them with plain callbacks leads to a problem called
          <span class="text-gold-300">Callback Hell</span>: every event needs its own condition, you have to cancel the old one manually, and there's no unified way to combine, filter, or delay these events.
        </p>
        <div class="mt-5 grid gap-4 sm:grid-cols-2">
          <div class="rounded-xl bg-stone-800 p-4">
            <p class="text-xs font-bold text-rose-300">❌ Without RxJS</p>
            <pre class="mt-2 overflow-x-auto text-[11px] leading-relaxed text-stone-300">input.addEventListener('input', () =&gt; &#123;
  clearTimeout(timer);
  timer = setTimeout(() =&gt; &#123;
    fetch('/api?q=' + input.value)
      .then(res =&gt; res.json())
      .then(data =&gt; &#123;
        // a stale response can arrive after a fresh one and break the order
      &#125;);
  &#125;, 400);
&#125;);</pre>
          </div>
          <div class="rounded-xl bg-gold-950/30 p-4">
            <p class="text-xs font-bold text-emerald-300">✅ With RxJS</p>
            <pre class="mt-2 overflow-x-auto text-[11px] leading-relaxed text-gold-100">searchTerm$.pipe(
  debounceTime(400),
  distinctUntilChanged(),
  switchMap(q => this.api.search(q))
).subscribe(results => this.results = results);
// switchMap cancels any stale request automatically 👍</pre>
          </div>
        </div>
        <p class="mt-4 text-sm text-stone-400">
          So RxJS doesn't just make the code shorter — it solves things that are hard to do by hand: cancelling a stale request, delaying a response, combining multiple data sources, and preventing duplicate events.
        </p>
      </article>

      <!-- 2 · OBSERVABLE -->
      <article class="mt-5 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <p class="text-xs font-bold tracking-wider text-gold-300">2 · What is an Observable?</p>
        <h2 class="mt-2 text-xl font-bold">A factory for values that arrive over time</h2>
        <p class="mt-2 text-sm text-stone-400">
          An <code class="text-gold-300">Observable</code> is a "promise" of values that will arrive one after another, not a single value like a Promise. Until you call
          <code class="text-gold-300">.subscribe()</code> it does nothing at all — like a Netflix show that doesn't stream until you hit Play.
        </p>
        <pre class="mt-4 overflow-x-auto rounded-xl bg-stone-950 p-4 text-xs text-gold-200">Producer  ──▶  [ Observable Stream ]  ──▶  Subscriber
                 ──1──2──3──4──5──X (complete)
                     ↑ map/filter/… can transform each value before it reaches you</pre>

        <div class="mt-5 rounded-xl bg-stone-800 p-4">
          <div class="flex flex-wrap items-center gap-3">
            <button
              type="button"
              (click)="startTicker()"
              [disabled]="tickerRunning()"
              class="rounded-lg bg-gold-500 px-4 py-2 font-semibold text-white hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ▶ subscribe()
            </button>
            <button
              type="button"
              (click)="stopTicker()"
              [disabled]="!tickerRunning()"
              class="rounded-lg border border-rose-400/50 px-4 py-2 font-semibold text-rose-300 hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ■ unsubscribe()
            </button>
            <span class="text-sm text-stone-400">
              Status: <strong [class.text-emerald-400]="tickerRunning()" [class.text-stone-500]="!tickerRunning()">{{ tickerRunning() ? 'running 🟢' : 'stopped ⚪' }}</strong>
            </span>
          </div>
          <p class="mt-4 text-sm text-stone-300">Values received: <span class="text-gold-300">{{ tickerValues().join(', ') || '—' }}</span></p>
          <p class="mt-2 text-xs text-stone-500">Click subscribe, let a few numbers come in, then click unsubscribe — notice it stops instantly, just like pausing the show.</p>
        </div>
      </article>

      <!-- 3 · OPERATORS -->
      <article class="mt-5 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <p class="text-xs font-bold tracking-wider text-gold-300">3 · The most common operators</p>
        <h2 class="mt-2 text-xl font-bold">map and filter — reshape the stream on the way through</h2>
        <p class="mt-2 text-sm text-stone-400">
          Operators are functions that go inside <code class="text-gold-300">.pipe()</code>, and each one takes the value coming from above and produces a new value that flows down — like stations on a factory line.
        </p>
        <pre class="mt-4 overflow-x-auto rounded-xl bg-stone-950 p-4 text-xs text-gold-200">source:  1──2──3──4──5──6──7──8──9──10
filter(even):    2────4────6────8────10
map(x => x*10):  20───40───60───80───100
take(3):         20───40───60|  (completes after 3 values)</pre>
        <button
          type="button"
          (click)="runOperatorsDemo()"
          [disabled]="operatorsRunning()"
          class="mt-4 rounded-lg bg-gold-500 px-4 py-2 font-semibold text-white hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Run: source → filter(even) → map(×10) → take(3)
        </button>
        <div class="mt-4 rounded-xl bg-stone-800 p-4 text-sm text-stone-300">
          Result: <span class="text-gold-300">{{ operatorsResult().join(', ') || '—' }}</span>
        </div>
      </article>

      <!-- 4 · SEARCH: debounce + switchMap -->
      <article class="mt-5 rounded-2xl border border-gold-400/30 bg-gold-950/20 p-6">
        <p class="text-xs font-bold tracking-wider text-gold-300">4 · debounceTime + distinctUntilChanged + switchMap</p>
        <h2 class="mt-2 text-xl font-bold">A real search box that cancels stale requests</h2>
        <p class="mt-2 text-sm text-stone-400">
          <code class="text-gold-300">debounceTime(400)</code> waits for 400ms of silence after typing before it sends. <code class="text-gold-300">distinctUntilChanged()</code>
          skips the search if the value hasn't changed. <code class="text-gold-300">switchMap</code> cancels the previous request the instant a new one comes in (critical so the order never gets mixed up).
        </p>
        <input
          type="text"
          [ngModel]="searchInputValue()"
          (ngModelChange)="onSearchInput($event)"
          placeholder="Type a movie name... try typing fast"
          class="mt-4 w-full rounded-xl border border-stone-700 bg-stone-900 px-4 py-2.5 text-stone-100 placeholder:text-stone-500 focus:border-gold-400 focus:outline-none"
        />
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-stone-900 p-4">
            <p class="text-xs text-stone-400">Number of "API calls" made</p>
            <strong class="text-2xl text-gold-300">{{ apiCallCount() }}</strong>
            <p class="mt-1 text-xs text-stone-500">Notice it doesn't grow with every keystroke — thanks to debounce</p>
          </div>
          <div class="rounded-xl bg-stone-900 p-4">
            <p class="text-xs text-stone-400">Latest result received (never a stale one)</p>
            <strong class="text-lg text-emerald-300">{{ searchResult() || '—' }}</strong>
          </div>
        </div>
      </article>

      <!-- 5 · SUBSCRIBE & MEMORY LEAK -->
      <article class="mt-5 rounded-2xl border border-[rgb(var(--panel-danger-heading))]/30 bg-[rgb(var(--panel-danger-bg))] p-6">
        <p class="text-xs font-bold tracking-wider text-rose-300">5 · subscribe() and the memory leak problem</p>
        <h2 class="mt-2 text-xl font-bold">A subscription you forget to close keeps running forever</h2>
        <p class="mt-2 text-sm text-stone-400">
          When you call <code class="text-rose-300">.subscribe()</code> on an Observable that's still live (like interval or Router events), that subscription stays
          "alive" in memory even after the component is destroyed. The result: memory builds up, and sometimes code keeps running against an element that no longer exists.
        </p>
        <pre class="mt-4 overflow-x-auto rounded-xl bg-stone-950 p-4 text-xs text-rose-300">Open page   ──▶  subscribe()  ──▶  ✅ running
Close page  ──▶  nobody unsubscribed ──▶  ⚠️ still running in memory!
Open it again ──▶  subscribe() again ──▶  ⚠️⚠️ now 2 copies running together
...and so on: memory leak</pre>

        <div class="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            (click)="createLeakySubscription()"
            class="rounded-lg bg-rose-500 px-4 py-2 font-semibold text-white hover:bg-rose-400"
          >
            💥 Open the page (subscribe with no cleanup)
          </button>
          <button
            type="button"
            (click)="cleanupLeaks()"
            [disabled]="leakedSubscriptionsCount() === 0"
            class="rounded-lg border border-emerald-400/50 px-4 py-2 font-semibold text-emerald-300 hover:bg-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            🧹 Clean up all subscriptions (ngOnDestroy)
          </button>
          <span class="text-sm">
            Forgotten subscriptions still running:
            <strong class="text-lg" [class.text-rose-400]="leakedSubscriptionsCount() > 0" [class.text-emerald-400]="leakedSubscriptionsCount() === 0">
              {{ leakedSubscriptionsCount() }}
            </strong>
          </span>
        </div>
        <p class="mt-4 text-sm text-stone-400">
          The classic fix: store every subscription and clear them in <code class="text-rose-300">ngOnDestroy()</code>:
        </p>
        <pre class="mt-2 overflow-x-auto rounded-xl bg-stone-950 p-4 text-xs text-stone-300">private sub = new Subscription();

ngOnInit() &#123;
  this.sub.add(this.someObservable$.subscribe(...));
&#125;

ngOnDestroy() &#123;
  this.sub.unsubscribe(); // closes every subscription that was added
&#125;</pre>
      </article>

      <!-- 6 · ASYNC PIPE -->
      <article class="mt-5 rounded-2xl border border-emerald-500/30 bg-[rgb(var(--panel-success-bg))] p-6">
        <p class="text-xs font-bold tracking-wider text-emerald-300">6 · async pipe — the cleaner fix</p>
        <h2 class="mt-2 text-xl font-bold">Let Angular subscribe/unsubscribe on your behalf</h2>
        <p class="mt-2 text-sm text-stone-400">
          Instead of calling <code class="text-emerald-300">.subscribe()</code> manually and remembering to call <code class="text-emerald-300">unsubscribe</code> in
          <code class="text-emerald-300">ngOnDestroy</code>, use <code class="text-emerald-300">| async</code> in the template. It subscribes automatically when
          the element appears, and unsubscribes automatically when it's removed — so a memory leak isn't even possible.
        </p>
        <div class="mt-5 grid gap-4 sm:grid-cols-2">
          <div class="rounded-xl bg-stone-900 p-4">
            <p class="text-xs font-bold text-rose-300">❌ The manual way</p>
            <pre class="mt-2 overflow-x-auto text-[11px] leading-relaxed text-stone-300">movies$: Observable&lt;Movie[]&gt;;
movies: Movie[] = [];
private sub!: Subscription;

ngOnInit() &#123;
  this.sub = this.movies$.subscribe(
    m =&gt; this.movies = m
  );
&#125;

ngOnDestroy() &#123;
  this.sub.unsubscribe(); // easy to forget!
&#125;</pre>
          </div>
          <div class="rounded-xl bg-[rgb(var(--panel-success-bg))] p-4">
            <p class="text-xs font-bold text-emerald-300">✅ With async pipe</p>
            <pre class="mt-2 overflow-x-auto text-[11px] leading-relaxed text-emerald-300">movies$ = this.api.getMovies();

// in the template, that's it:
&#64;for (m of movies$ | async; track m.id) &#123;
  ...
&#125;
// no subscribe, no unsubscribe 🎉</pre>
          </div>
        </div>

        <div class="mt-5 rounded-xl bg-stone-800 p-4">
          <p class="text-xs text-stone-400">A working example right now (the same ticker from above, but with async pipe):</p>
          <p class="mt-2 text-sm">
            Current value: <strong class="text-emerald-300">{{ asyncDemo$ | async }}</strong>
          </p>
          <p class="mt-2 text-xs text-stone-500">No subscribe or unsubscribe button here — the pipe handles it on its own for as long as the page is open.</p>
        </div>
      </article>

      <!-- 7 · CHEAT SHEET -->
      <article class="mt-5 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <p class="text-xs font-bold tracking-wider text-gold-300">7 · Quick cheat sheet</p>
        <h2 class="mt-2 text-xl font-bold">The operators you'll use every day</h2>
        <div class="mt-4 overflow-x-auto rounded-xl border border-stone-800">
          <table class="w-full text-left text-sm">
            <thead class="bg-stone-800 text-stone-300">
              <tr>
                <th class="px-4 py-2 font-semibold">Operator</th>
                <th class="px-4 py-2 font-semibold">What it does</th>
                <th class="px-4 py-2 font-semibold">Example</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-stone-800 text-stone-400">
              @for (row of cheatSheet; track row.op) {
                <tr>
                  <td class="whitespace-nowrap px-4 py-2 font-mono text-gold-300">{{ row.op }}</td>
                  <td class="px-4 py-2">{{ row.desc }}</td>
                  <td class="whitespace-nowrap px-4 py-2 font-mono text-xs text-stone-500">{{ row.use }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </article>

      <app-recap [items]="recapItems" />
      <app-topic-nav />
    </section>
  `,
})
export class RxjsComponent implements OnDestroy {
  // ── 2 · Observable ticker demo ──────────────────────────────
  readonly tickerRunning = signal(false);
  readonly tickerValues = signal<number[]>([]);
  private tickerSub?: Subscription;

  startTicker(): void {
    this.tickerValues.set([]);
    this.tickerRunning.set(true);
    this.tickerSub = interval(500)
      .pipe(map((n) => n + 1))
      .subscribe((value) => this.tickerValues.update((values) => [...values, value]));
  }

  stopTicker(): void {
    this.tickerSub?.unsubscribe();
    this.tickerRunning.set(false);
  }

  // ── 3 · operators playground ────────────────────────────────
  readonly operatorsRunning = signal(false);
  readonly operatorsResult = signal<number[]>([]);

  runOperatorsDemo(): void {
    this.operatorsResult.set([]);
    this.operatorsRunning.set(true);
    interval(300)
      .pipe(
        map((n) => n + 1),
        filter((n) => n % 2 === 0),
        map((n) => n * 10),
        take(3),
      )
      .subscribe({
        next: (value) => this.operatorsResult.update((values) => [...values, value]),
        complete: () => this.operatorsRunning.set(false),
      });
  }

  // ── 4 · debounce + switchMap search demo ────────────────────
  readonly searchInputValue = signal('');
  readonly apiCallCount = signal(0);
  readonly searchResult = signal('');
  private readonly searchTerm$ = new Subject<string>();

  private readonly searchSub = this.searchTerm$
    .pipe(
      debounceTime(400),
      distinctUntilChanged(),
      tap(() => this.apiCallCount.update((count) => count + 1)),
      switchMap((term) => this.fakeSearchApi(term)),
    )
    .subscribe((result) => this.searchResult.set(result));

  onSearchInput(value: string): void {
    this.searchInputValue.set(value);
    this.searchTerm$.next(value);
  }

  private fakeSearchApi(term: string): Observable<string> {
    if (!term.trim()) {
      return of('');
    }
    return of(`Results for "${term}" ✅`).pipe(delay(500));
  }

  // ── 5 · memory leak demo ────────────────────────────────────
  readonly leakedSubscriptionsCount = signal(0);
  private readonly leakedSubscriptions: Subscription[] = [];

  createLeakySubscription(): void {
    const sub = interval(1000).subscribe();
    this.leakedSubscriptions.push(sub);
    this.leakedSubscriptionsCount.set(this.leakedSubscriptions.length);
  }

  cleanupLeaks(): void {
    this.leakedSubscriptions.forEach((sub) => sub.unsubscribe());
    this.leakedSubscriptions.length = 0;
    this.leakedSubscriptionsCount.set(0);
  }

  // ── 6 · async pipe demo ─────────────────────────────────────
  readonly asyncDemo$ = interval(700).pipe(map((n) => `tick #${n + 1}`));

  readonly cheatSheet = [
    { op: 'map', desc: 'Transforms every value into a new one', use: 'map(x => x * 2)' },
    { op: 'filter', desc: 'Keeps only the values that pass a condition', use: 'filter(x => x > 0)' },
    { op: 'tap', desc: 'Runs a side effect (like console.log) without changing the value', use: 'tap(x => console.log(x))' },
    { op: 'debounceTime', desc: 'Waits for a period of silence before emitting the value', use: 'debounceTime(400)' },
    { op: 'distinctUntilChanged', desc: 'Skips a value that repeats the previous one', use: 'distinctUntilChanged()' },
    { op: 'switchMap', desc: 'Switches to a new Observable and cancels the old one instantly (ideal for search)', use: 'switchMap(q => api.search(q))' },
    { op: 'mergeMap', desc: 'Runs every request in parallel, with no cancelling', use: 'mergeMap(id => api.get(id))' },
    { op: 'concatMap', desc: 'Runs requests one after another, in order', use: 'concatMap(job => run(job))' },
    { op: 'combineLatest', desc: 'Combines the latest value from several Observables', use: 'combineLatest([a$, b$])' },
    { op: 'take(n)', desc: 'Takes the first n values, then completes the stream', use: 'take(3)' },
    { op: 'takeUntil', desc: 'Closes the stream when another Observable emits (great in ngOnDestroy)', use: 'takeUntil(this.destroy$)' },
    { op: 'catchError', desc: 'Catches a stream error and returns a fallback instead of breaking everything', use: 'catchError(() => of([]))' },
  ];

  ngOnDestroy(): void {
    this.tickerSub?.unsubscribe();
    this.searchSub.unsubscribe();
    this.cleanupLeaks();
  }

  readonly recapItems: RecapItem[] = [
    {
      question: 'Why does switchMap cancel the previous request instead of letting it finish?',
      answer: "So a stale response (from an earlier keystroke) can't arrive after a newer one and overwrite it with outdated data.",
    },
    {
      question: 'What problem does debounceTime(400) solve in a search box?',
      answer: 'It waits for a pause in typing before firing a request, instead of sending one API call per keystroke.',
    },
    {
      question: 'Why prefer the async pipe over manually calling .subscribe() in ngOnInit?',
      answer: "Angular subscribes and unsubscribes automatically as the element appears and is destroyed — a memory leak isn't even possible.",
    },
  ];
}
