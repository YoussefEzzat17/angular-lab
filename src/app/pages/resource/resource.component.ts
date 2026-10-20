import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { LessonPlayerComponent } from '../../learn/player/lesson-player.component';
import { LessonSectionDirective } from '../../learn/player/lesson-section.directive';
import { CodeBlockDirective } from '../../shared/code-block.directive';
import { KnowledgeCheckComponent, KnowledgeCheckItem } from '../../shared/knowledge-check.component';
import { LessonCardComponent } from '../../shared/lesson-card.component';
import { OrderStepsComponent } from '../../shared/order-steps.component';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { PredictOutputComponent } from '../../shared/predict-output.component';
import type { PredictChallenge } from '../../shared/predict-output.component';
import { ResourceDemoComponent } from './resource-demo.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CodeBlockDirective,
    KnowledgeCheckComponent,
    LessonCardComponent,
    LessonPlayerComponent,
    LessonSectionDirective,
    OrderStepsComponent,
    PageHeaderComponent,
    PredictOutputComponent,
    ResourceDemoComponent,
  ],
  template: `
    <app-lesson-player [topicId]="'resource'" [section]="section()">
      <ng-template appLessonSection="basics">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-page-header title="Resource API">
            Almost every page loads something: a user, a list, a product. Each time you end up writing the same three signals by hand (the data, a loading flag, an error)
            and the same careful code to keep them in step. A <strong class="text-stone-200">resource</strong> does that bookkeeping for you and hands back the result as signals.
          </app-page-header>

          <app-lesson-card class="mt-10" label="1 · THE PROBLEM" heading="Three signals and a lot of care">
            <pre class="mt-3 overflow-x-auto rounded-xl bg-stone-950 p-4 text-xs text-gold-200">{{ manualCode }}</pre>
            <p class="mt-3 text-sm text-stone-400">
              And that version still forgets things: what if the user clicks another id before the first request answers? Then an old answer can arrive last and overwrite the new one.
            </p>
          </app-lesson-card>

          <app-lesson-card class="mt-5" label="2 · THE RESOURCE" heading="Say what to load, and what it depends on">
            <p class="mt-2 text-sm text-stone-400">
              <code class="text-gold-300">params</code> is a function that reads signals. When one changes, the resource loads again. <code class="text-gold-300">loader</code> does the work and
              returns a Promise. You get <code class="text-gold-300">value()</code>, <code class="text-gold-300">isLoading()</code>, <code class="text-gold-300">error()</code> and
              <code class="text-gold-300">status()</code> for free.
            </p>
            <pre class="mt-4 overflow-x-auto rounded-xl bg-stone-950 p-4 text-xs text-gold-200">{{ resourceCode }}</pre>
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="highlight" label="3 · TRY IT" heading="A real resource against a pretend server">
            <ol class="mt-2 list-decimal space-y-1 pl-5 text-sm text-stone-400">
              <li>Pick a user and watch <strong class="text-stone-200">status()</strong> go from loading to resolved.</li>
              <li>Click two users quickly. The first request is cancelled.</li>
              <li>Turn on "fail", press Reload, and see the error state.</li>
            </ol>
            <app-resource-demo />
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="danger" label="EXPERIMENTAL" heading="These APIs can still change">
            <p class="mt-2 text-sm text-stone-300">
              In Angular 20, <code class="text-gold-300">resource</code>, <code class="text-gold-300">rxResource</code> and <code class="text-gold-300">httpResource</code> are marked experimental.
              They work and are worth learning, but names and options may change in a later version. For example, the option that holds the signals to watch was called
              <code class="text-gold-300">request</code> in Angular 19 and is <code class="text-gold-300">params</code> now.
            </p>
          </app-lesson-card>
        </section>
      </ng-template>

      <ng-template appLessonSection="states">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card class="mt-10" label="STATUSES" heading="Six states, one signal">
            <p class="mt-2 text-sm text-stone-400">Instead of juggling flags, read <code class="text-gold-300">status()</code>. It is always exactly one of these:</p>
            <div class="mt-4 overflow-x-auto rounded-xl border border-stone-800">
              <table class="w-full text-left text-sm">
                <thead class="bg-stone-800 text-stone-300">
                  <tr><th class="px-4 py-2 font-semibold">Status</th><th class="px-4 py-2 font-semibold">When</th></tr>
                </thead>
                <tbody class="divide-y divide-stone-800 text-stone-400">
                  @for (row of statuses; track row.status) {
                    <tr>
                      <td class="whitespace-nowrap px-4 py-2 font-mono text-gold-300">{{ row.status }}</td>
                      <td class="px-4 py-2">{{ row.when }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </app-lesson-card>

          <app-lesson-card class="mt-5" label="CANCELLING" heading="A newer request replaces an older one">
            <p class="mt-2 text-sm text-stone-400">
              The loader receives an <code class="text-gold-300">abortSignal</code>. When the params change while a request is still running, the resource aborts the old one. Pass the signal on
              (for example to <code class="text-gold-300">fetch</code>) and a slow old answer can never overwrite a newer one.
            </p>
            <pre class="mt-4 overflow-x-auto rounded-xl bg-stone-950 p-4 text-xs text-gold-200">{{ abortCode }}</pre>
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="danger" label="COMMON MISTAKES" heading="Where resources bite beginners">
            <ul class="mt-3 list-disc space-y-2 pl-5 text-sm text-stone-300">
              <li><strong class="text-stone-100">Reading value() when there was an error.</strong> It throws. Check <code class="text-gold-300">hasValue()</code> or <code class="text-gold-300">error()</code> first.</li>
              <li><strong class="text-stone-100">Reading a signal inside the loader and expecting a reload.</strong> Only the signals read in <code class="text-gold-300">params</code> are watched.</li>
              <li><strong class="text-stone-100">Wondering why nothing loads.</strong> If <code class="text-gold-300">params</code> returns <code class="text-gold-300">undefined</code>, the resource stays <code class="text-gold-300">idle</code> on purpose. Use that for "wait until an id is chosen".</li>
            </ul>
          </app-lesson-card>
        </section>
      </ng-template>

      <ng-template appLessonSection="http-rx">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card class="mt-10" label="THREE WAYS IN" heading="Same result, different loader">
            <p class="mt-2 text-sm text-stone-400">All three give you the same signals. They only differ in how the data is fetched.</p>
            <div class="mt-4 overflow-x-auto rounded-xl border border-stone-800">
              <table class="w-full text-left text-sm">
                <thead class="bg-stone-800 text-stone-300">
                  <tr>
                    <th class="px-4 py-2 font-semibold">Function</th>
                    <th class="px-4 py-2 font-semibold">You give it</th>
                    <th class="px-4 py-2 font-semibold">Good for</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-stone-800 text-stone-400">
                  @for (row of flavours; track row.fn) {
                    <tr>
                      <td class="whitespace-nowrap px-4 py-2 font-mono text-gold-300">{{ row.fn }}</td>
                      <td class="px-4 py-2">{{ row.gives }}</td>
                      <td class="px-4 py-2">{{ row.good }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </app-lesson-card>

          <app-lesson-card class="mt-5" label="httpResource" heading="The shortest version for a GET request">
            <p class="mt-2 text-sm text-stone-400">
              Give it a function that returns a URL. It uses <code class="text-gold-300">HttpClient</code> underneath, so your interceptors still run. When a signal in the URL changes, it loads again.
            </p>
            <pre class="mt-4 overflow-x-auto rounded-xl bg-stone-950 p-4 text-xs text-gold-200">{{ httpCode }}</pre>
          </app-lesson-card>

          <app-lesson-card class="mt-5" label="rxResource" heading="When you already have an Observable">
            <p class="mt-2 text-sm text-stone-400">It takes <code class="text-gold-300">stream</code> instead of <code class="text-gold-300">loader</code>, and the stream is an Observable.</p>
            <pre class="mt-4 overflow-x-auto rounded-xl bg-stone-950 p-4 text-xs text-gold-200">{{ rxCode }}</pre>
          </app-lesson-card>
        </section>
      </ng-template>

      <ng-template appLessonSection="try-it">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card class="mt-10" variant="highlight" label="PUT IT IN ORDER" heading="What happens when a param changes?">
            <p class="mt-2 text-sm text-stone-400">Put these five steps in the order they happen.</p>
            <app-order-steps
              [steps]="paramSteps"
              explanation="The resource watches params. A change starts a new load, the loader runs with the new value, and when it resolves the signals update."
            />
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="highlight" label="PREDICT" heading="What is the status during a reload?">
            <app-predict-output [challenge]="reloadChallenge" />
          </app-lesson-card>

          <app-knowledge-check [items]="checkItems" />
        </section>
      </ng-template>
    </app-lesson-player>
  `,
})
export class ResourceComponent {
  readonly section = input<string>();

  protected readonly statuses = [
    { status: 'idle', when: 'params() returned undefined, so there is nothing to load.' },
    { status: 'loading', when: 'The first load, or the params changed.' },
    { status: 'reloading', when: 'reload() was called and a value is already there.' },
    { status: 'resolved', when: 'The loader finished. value() holds the result.' },
    { status: 'error', when: 'The loader failed. error() holds the reason, and value() throws.' },
    { status: 'local', when: 'You changed the value yourself with set() or update().' },
  ];

  protected readonly flavours = [
    { fn: 'resource()', gives: 'A loader that returns a Promise', good: 'fetch, or any Promise-based API' },
    { fn: 'rxResource()', gives: 'A stream that returns an Observable', good: 'Existing RxJS services' },
    { fn: 'httpResource()', gives: 'A function that returns a URL', good: 'A plain GET with HttpClient' },
  ];

  protected readonly manualCode = `user = signal<User | undefined>(undefined);
loading = signal(false);
error = signal<string | undefined>(undefined);

load(id: number) {
  this.loading.set(true);
  this.error.set(undefined);
  this.http.get<User>(\`/api/users/\${id}\`).subscribe({
    next: (user) => { this.user.set(user); this.loading.set(false); },
    error: () => { this.error.set('Failed'); this.loading.set(false); },
  });
}`;

  protected readonly resourceCode = `userId = signal(1);

user = resource({
  params: () => this.userId(),
  loader: ({ params: id, abortSignal }) =>
    fetch(\`/api/users/\${id}\`, { signal: abortSignal }).then((r) => r.json()),
});

// in the template
@if (user.isLoading()) { <p>Loading…</p> }
@if (user.error()) { <p>Something went wrong.</p> }
@if (user.hasValue()) { <p>{{ user.value().name }}</p> }`;

  protected readonly abortCode = `loader: ({ params: id, abortSignal }) =>
  fetch(\`/api/users/\${id}\`, { signal: abortSignal })   // cancelled for you
    .then((r) => r.json())`;

  protected readonly httpCode = `userId = signal(1);

user = httpResource<User>(() => \`/api/users/\${this.userId()}\`);

// the same signals: user.value(), user.status(), user.error(), user.isLoading(), user.reload()`;

  protected readonly rxCode = `user = rxResource({
  params: () => this.userId(),
  stream: ({ params: id }) => this.http.get<User>(\`/api/users/\${id}\`),
});`;

  protected readonly paramSteps = [
    'A signal read inside params() changes',
    "The resource starts loading and status() becomes 'loading'",
    'The loader runs with the new params',
    "The loader's Promise resolves",
    "status() becomes 'resolved' and value() holds the result",
  ];

  protected readonly reloadChallenge: PredictChallenge = {
    question: 'The resource has finished loading. What does status() return right after reload()?',
    code: 'const user = resource({ params: () => id(), loader });\n// ...it finished loading, status() is "resolved"\nuser.reload();\nconsole.log(user.status());',
    options: [
      { id: 'resolved', text: "'resolved'" },
      { id: 'loading', text: "'loading'" },
      { id: 'reloading', text: "'reloading'" },
      { id: 'idle', text: "'idle'" },
    ],
    correct: 'reloading',
    explanation: "'reloading' means a fresh value is being fetched for the same params while the old value is still available. 'loading' is for the first load or new params.",
  };

  protected readonly checkItems: KnowledgeCheckItem[] = [
    {
      question: 'What makes a resource load again?',
      answer: 'A signal read inside params() changes, or you call reload(). Signals read inside the loader are not watched.',
    },
    {
      question: 'Why is it safer than loading with subscribe() and a few flags?',
      answer: 'It cancels an older request when a newer one starts, so a slow old answer cannot overwrite a newer one, and the loading and error state are always in step with the value.',
    },
    {
      question: 'When would you choose httpResource over resource?',
      answer: 'For a plain GET request. httpResource takes a URL function, uses HttpClient so interceptors still run, and needs less code.',
    },
  ];
}
