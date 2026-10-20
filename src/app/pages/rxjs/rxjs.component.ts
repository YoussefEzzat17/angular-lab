import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, OnDestroy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CodeBlockDirective } from '../../shared/code-block.directive';
import { LessonCardComponent } from '../../shared/lesson-card.component';
import type { PredictChallenge } from '../../shared/predict-output.component';
import { PredictOutputComponent } from '../../shared/predict-output.component';
import { TermComponent } from '../../shared/term.component';
import { FlattenDemoComponent } from './flatten-demo.component';
import { SubjectRadioDemoComponent } from './subject-radio-demo.component';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { KnowledgeCheckComponent, KnowledgeCheckItem } from '../../shared/knowledge-check.component';
import { LessonPlayerComponent } from '../../learn/player/lesson-player.component';
import { LessonSectionDirective } from '../../learn/player/lesson-section.directive';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PredictOutputComponent, TermComponent, FormsModule, AsyncPipe, FlattenDemoComponent, SubjectRadioDemoComponent, CodeBlockDirective, KnowledgeCheckComponent, PageHeaderComponent, LessonCardComponent, LessonPlayerComponent, LessonSectionDirective],
  template: `
    <app-lesson-player [topicId]="'rxjs'" [section]="section()">
      <ng-template appLessonSection="observables">
      <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <app-page-header title="RxJS from Scratch" illustration="rxjs">
        RxJS is a library that helps you deal with anything that happens "over time" — a click, typing in an input, an API response — as one
        <strong class="text-gold-300"><app-term term="stream">data stream</app-term></strong> you can filter, transform and control, instead of handling each as a separate event.
        Try the examples below, and open the console to see what's happening under the hood.
      </app-page-header>

      <!-- 1 · WHY RXJS -->
      <app-lesson-card class="mt-10" label="1 · Why does RxJS exist?" heading="The problem before RxJS">
        <p class="mt-2 text-sm text-stone-400">
          When you have lots of events happening over time (typing, clicks, API replies), handling them with plain callbacks leads to a problem called
          <span class="text-gold-300">Callback Hell</span>: every event needs its own condition, you have to cancel the old one manually, and there's no unified way to combine, filter, or delay these events.
        </p>
        <div class="mt-5 grid gap-4 sm:grid-cols-2">
          <div class="min-w-0 rounded-xl bg-stone-800 p-4">
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
          <div class="min-w-0 rounded-xl bg-gold-950/30 p-4">
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
      </app-lesson-card>

      <!-- 2 · OBSERVABLE -->
      <app-lesson-card class="mt-5" label="2 · What is an Observable?" heading="A factory for values that arrive over time">
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
      </app-lesson-card>

      <app-lesson-card class="mt-5" variant="danger" label="COMMON MISTAKES" heading="Observable mistakes to avoid">
        <ul class="mt-3 list-disc space-y-2 pl-5 text-sm text-stone-300">
          <li><strong class="text-stone-100">Expecting something to happen without subscribe().</strong> A cold Observable does nothing until someone subscribes.</li>
          <li><strong class="text-stone-100">Subscribing inside a subscribe.</strong> Nested subscriptions are hard to cancel and easy to leak. Combine them with <code class="text-gold-300">switchMap</code> instead.</li>
          <li><strong class="text-stone-100">Using an Observable for simple local state.</strong> A <code class="text-gold-300">signal()</code> is less code for a counter or a toggle. Save Observables for streams of events over time.</li>
        </ul>
      </app-lesson-card>
      </section>
      </ng-template>

      <ng-template appLessonSection="operators">
      <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <!-- 3 · OPERATORS -->
      <app-lesson-card class="mt-5" label="3 · The most common operators" heading="map and filter — reshape the stream on the way through">
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
      </app-lesson-card>

      <!-- 4 · FLATTENING OPERATORS -->
      <app-lesson-card class="mt-5" label="4 · FLATTENING OPERATORS" heading="switchMap, mergeMap, concatMap — what happens when a new request arrives?">
        <p class="mt-2 text-sm text-stone-400">
          Some operators start a <strong class="text-stone-200">new async job for every value</strong> — for example, one HTTP call per keystroke. The question is what to do when a new
          job starts while the previous one is still running. The three operators answer it differently:
        </p>
        <ul class="mt-3 list-disc space-y-1 pl-5 text-sm text-stone-300">
          <li><code class="text-gold-300">switchMap</code> — <strong class="text-stone-100">cancel the old one</strong>. Use it for search boxes and "load the selected item".</li>
          <li><code class="text-gold-300">mergeMap</code> — <strong class="text-stone-100">run them all in parallel</strong>. Use it when the jobs are independent.</li>
          <li><code class="text-gold-300">concatMap</code> — <strong class="text-stone-100">queue them</strong>. Use it when order matters, like saving edits one by one.</li>
        </ul>
        <app-flatten-demo />
      </app-lesson-card>

      <!-- 7 · CHEAT SHEET -->
      <app-lesson-card class="mt-5" label="7 · Quick cheat sheet" heading="The operators you'll use every day">
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
      </app-lesson-card>
      </section>
      </ng-template>

      <ng-template appLessonSection="async-pipe">
      <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <!-- 6 · ASYNC PIPE -->
      <app-lesson-card
        class="mt-5"
        variant="success"
        label="6 · async pipe — the cleaner fix"
        heading="Let Angular subscribe/unsubscribe on your behalf"
      >
        <p class="mt-2 text-sm text-stone-400">
          Instead of calling <code class="text-emerald-300">.subscribe()</code> manually and remembering to call <code class="text-emerald-300">unsubscribe</code> in
          <code class="text-emerald-300">ngOnDestroy</code>, use <code class="text-emerald-300">| async</code> in the template. It subscribes automatically when
          the element appears, and unsubscribes automatically when it's removed — so a memory leak isn't even possible.
        </p>
        <div class="mt-5 grid gap-4 sm:grid-cols-2">
          <div class="min-w-0 rounded-xl bg-stone-900 p-4">
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
          <div class="min-w-0 rounded-xl bg-[rgb(var(--panel-success-bg))] p-4">
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
      </app-lesson-card>
      </section>
      </ng-template>

      <ng-template appLessonSection="subjects">
      <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <app-lesson-card class="mt-10" label="SUBJECTS · WHY THEY EXIST" heading="Sometimes you are the one who has to push the values">
        <p class="mt-2 text-sm text-stone-400">
          A normal Observable <em>produces</em> its own values — a timer ticks, an HTTP call answers. But some values come from <strong class="text-stone-200">your own code</strong>:
          a button in one component that another, unrelated component must react to. There is nothing for an Observable to "wrap" there.
        </p>
        <p class="mt-3 text-sm text-stone-400">
          A <code class="text-gold-300">Subject</code> solves it. It is an Observable <strong class="text-stone-200">plus</strong> a
          <code class="text-gold-300">next(value)</code> method: anyone can <code class="text-gold-300">subscribe()</code> to listen, and you call
          <code class="text-gold-300">next()</code> to broadcast.
        </p>
      </app-lesson-card>

      <app-lesson-card class="mt-5" label="THE MENTAL MODEL" heading="A live radio station" tone="amber">
        <ul class="mt-3 list-disc space-y-2 pl-5 text-sm text-stone-300">
          <li><strong class="text-stone-100">The station</strong> is the Subject. <code class="text-gold-300">next(song)</code> plays a song on air.</li>
          <li><strong class="text-stone-100">Listeners</strong> are subscribers. <code class="text-gold-300">subscribe()</code> tunes in, <code class="text-gold-300">unsubscribe()</code> switches off.</li>
          <li><strong class="text-stone-100">Everyone tuned in hears the same song at the same moment.</strong> That is called <app-term term="multicasting">multicasting</app-term>.</li>
          <li><strong class="text-stone-100">Live means live:</strong> if you tune in late, the songs that already played are gone — unless the station keeps a memory.</li>
        </ul>
        <p class="mt-3 text-sm text-stone-400">
          A plain Observable is the opposite: a recorded show where every listener gets their own copy, starting from the beginning.
        </p>
      </app-lesson-card>

      <app-lesson-card
        class="mt-5"
        variant="highlight"
        label="TRY IT · THE RADIO STATION"
        heading="Broadcast, tune in late, and see what each Subject remembers"
      >
        <ol class="mt-2 list-decimal space-y-1 pl-5 text-sm text-stone-400">
          <li>Press <strong class="text-stone-200">subscribe()</strong> on Ali, then broadcast two songs. Ali hears both.</li>
          <li>Now subscribe Sara. She joined late — what does she hear?</li>
          <li>Switch to <strong class="text-stone-200">BehaviorSubject</strong>, then <strong class="text-stone-200">ReplaySubject</strong>, and repeat steps 1–2.</li>
        </ol>
        <app-subject-radio-demo />
      </app-lesson-card>

      <app-lesson-card class="mt-5" label="THE FAMILY" heading="Which one should I pick?">
        <div class="mt-3 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-stone-950 p-4">
            <p class="font-bold text-stone-100">Subject</p>
            <p class="mt-1 text-xs text-stone-400">New subscriber gets: <strong class="text-stone-200">nothing from the past</strong></p>
            <p class="mt-2 text-sm text-stone-300">Events: a click, a "saved!" notification, a message that only matters right now.</p>
          </div>
          <div class="rounded-xl bg-stone-950 p-4">
            <p class="font-bold text-stone-100">BehaviorSubject</p>
            <p class="mt-1 text-xs text-stone-400">New subscriber gets: <strong class="text-stone-200">the current value, instantly</strong></p>
            <p class="mt-2 text-sm text-stone-300">State: the logged-in user, the cart count, the selected theme. Needs a starting value.</p>
          </div>
          <div class="rounded-xl bg-stone-950 p-4">
            <p class="font-bold text-stone-100">ReplaySubject(n)</p>
            <p class="mt-1 text-xs text-stone-400">New subscriber gets: <strong class="text-stone-200">the last n values</strong></p>
            <p class="mt-2 text-sm text-stone-300">History: the last 3 notifications, a chat catch-up, a recent-searches list.</p>
          </div>
          <div class="rounded-xl bg-stone-950 p-4">
            <p class="font-bold text-stone-100">Observable</p>
            <p class="mt-1 text-xs text-stone-400">New subscriber gets: <strong class="text-stone-200">its own fresh run</strong></p>
            <p class="mt-2 text-sm text-stone-300">Producers: HTTP calls, timers, Router events. You cannot call next() on it.</p>
          </div>
        </div>
      </app-lesson-card>

      <app-lesson-card class="mt-5" label="THE REAL-WORLD PATTERN" heading="A BehaviorSubject inside a service">
        <p class="mt-2 text-sm text-stone-400">
          Keep the Subject <strong class="text-stone-200">private</strong> and give everyone else a read-only view with
          <code class="text-gold-300">asObservable()</code>. Only the service can change the value.
        </p>
        <pre class="mt-4 overflow-x-auto rounded-xl bg-stone-950 p-4 text-xs text-gold-200">&#64;Injectable(&#123; providedIn: 'root' &#125;)
export class CartCountService &#123;
  private readonly count = new BehaviorSubject&lt;number&gt;(0);
  readonly count$ = this.count.asObservable();   // read-only for everyone else

  add(): void &#123; this.count.next(this.count.value + 1); &#125;
&#125;</pre>
        <pre ngNonBindable class="mt-3 overflow-x-auto rounded-xl bg-stone-950 p-4 text-xs text-gold-200">&lt;!-- any component, anywhere in the app --&gt;
&lt;span&gt;Cart: {{ cart.count$ | async }}&lt;/span&gt;</pre>
        <p class="mt-3 text-sm text-stone-400">
          The navbar badge and the product page never talk to each other, yet they always show the same number — because both listen to one station.
        </p>
      </app-lesson-card>

      <app-lesson-card class="mt-5" variant="danger" label="COMMON MISTAKES" heading="Where Subjects bite beginners">
        <ul class="mt-3 list-disc space-y-2 pl-5 text-sm text-stone-300">
          <li><strong class="text-stone-100">Exposing the Subject itself.</strong> If a component can call <code class="text-gold-300">next()</code> on your service's Subject, anyone can change shared state. Expose <code class="text-gold-300">asObservable()</code>.</li>
          <li><strong class="text-stone-100">Using a plain Subject for state.</strong> A component that loads later sees nothing and looks empty. State needs a BehaviorSubject.</li>
          <li><strong class="text-stone-100">Forgetting to unsubscribe.</strong> A Subject lives as long as the service, so a manual <code class="text-gold-300">subscribe()</code> in a component leaks. Prefer the <code class="text-gold-300">async</code> pipe.</li>
        </ul>
      </app-lesson-card>

      <app-lesson-card class="mt-5" variant="success" label="MODERN ANGULAR NOTE" heading="Subjects or signals?">
        <p class="mt-2 text-sm text-stone-300">
          For simple state that lives in one place, a <code class="text-gold-300">signal()</code> is usually less code than a BehaviorSubject. Reach for a Subject when the
          value is an <strong class="text-stone-100">event stream</strong> that you want to shape with operators like <code class="text-gold-300">debounceTime</code> or
          <code class="text-gold-300">switchMap</code> — like the search box in the next section. You can always bridge the two with <code class="text-gold-300">toSignal()</code>.
        </p>
      </app-lesson-card>

      <app-lesson-card class="mt-5" variant="highlight" label="PREDICT THE OUTPUT" heading="What does a late subscriber receive?">
        <app-predict-output [challenge]="behaviorChallenge" />
      </app-lesson-card>
      </section>
      </ng-template>

      <ng-template appLessonSection="memory-leaks">
      <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <!-- 5 · SUBSCRIBE & MEMORY LEAK -->
      <app-lesson-card
        class="mt-5"
        variant="danger"
        label="5 · subscribe() and the memory leak problem"
        heading="A subscription you forget to close keeps running forever"
      >
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
      </app-lesson-card>
      </section>
      </ng-template>

      <ng-template appLessonSection="try-it">
      <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <!-- 4 · SEARCH: debounce + switchMap -->
      <app-lesson-card
        class="mt-5"
        variant="highlight"
        label="4 · debounceTime + distinctUntilChanged + switchMap"
        heading="A real search box that cancels stale requests"
      >
        <p class="mt-2 text-sm text-stone-400">
          <code class="text-gold-300">debounceTime(400)</code> waits for 400ms of silence after typing before it sends. <code class="text-gold-300">distinctUntilChanged()</code>
          skips the search if the value hasn't changed. <code class="text-gold-300">switchMap</code> cancels the previous request the instant a new one comes in (critical so the order never gets mixed up).
        </p>
        <input
          aria-label="Search for a movie"
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
      </app-lesson-card>

      <app-knowledge-check [items]="checkItems" />
      </section>
      </ng-template>
    </app-lesson-player>
  `,
})
export class RxjsComponent implements OnDestroy {
  readonly section = input<string>();

  readonly behaviorChallenge: PredictChallenge = {
    question: 'What does this log?',
    code: 'const s = new BehaviorSubject(0);\ns.next(1);\ns.subscribe(v => console.log(v));\ns.next(2);',
    options: [
      { id: 'b', text: '0, 1, 2' },
      { id: 'c', text: '2' },
      { id: 'a', text: '1, 2' },
      { id: 'd', text: '0, 2' },
    ],
    correct: 'a',
    explanation: 'A BehaviorSubject keeps only its latest value. next(1) replaced the 0 before anyone subscribed, so the subscriber gets 1 straight away and then 2.',
  };

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

  readonly checkItems: KnowledgeCheckItem[] = [
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
