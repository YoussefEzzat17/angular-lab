import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, signal } from '@angular/core';
import { catchError, defer, delay, of, retry, throwError, timer } from 'rxjs';

import { LessonPlayerComponent } from '../../learn/player/lesson-player.component';
import { LessonSectionDirective } from '../../learn/player/lesson-section.directive';
import { CodeBlockDirective } from '../../shared/code-block.directive';
import { CodeOutputComponent } from '../../shared/code-output.component';
import { CommonMistakeComponent } from '../../shared/common-mistake.component';
import { KnowledgeCheckComponent, KnowledgeCheckItem } from '../../shared/knowledge-check.component';
import { LessonCardComponent } from '../../shared/lesson-card.component';
import { OrderStepsComponent } from '../../shared/order-steps.component';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { PredictChallenge, PredictOutputComponent } from '../../shared/predict-output.component';
import { RecapComponent } from '../../shared/recap.component';

type Strategy = 'none' | 'fallback' | 'retry';
type LoadState = 'idle' | 'loading' | 'data' | 'error';

/** A stand-in for the global handler: it keeps what it is given so the lesson can show it. */
class DemoErrorHandler {
  readonly log = signal<string[]>([]);
  handleError(error: unknown): void {
    const message = error instanceof Error ? error.message : String(error);
    this.log.update((lines) => [...lines, `${new Date().toLocaleTimeString()}  ${message}`].slice(-5));
  }
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
    OrderStepsComponent,
    PageHeaderComponent,
    PredictOutputComponent,
    RecapComponent,
  ],
  template: `
    <app-lesson-player [topicId]="'error-handling'" [section]="section()">
      <!-- ── Why ── -->
      <ng-template appLessonSection="why">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-page-header title="Error Handling" illustration="error-handling">
            Things go wrong: the network drops, the server says no, a value is missing. You cannot stop errors, but you can decide what happens next:
            the user sees a clear message, you hear about the problem, and the rest of the app keeps working.
          </app-page-header>

          <app-lesson-card class="mt-10" label="1 · THE PROBLEM" heading="An unhandled error is silent for the user and noisy only in the console">
            <p class="mt-2 text-sm text-stone-400">
              When a request fails and nothing handles it, the loading spinner may spin forever, or the page may stay empty. The user cannot tell if they should wait, retry or leave,
              and you only find out if someone reports it.
            </p>
          </app-lesson-card>

          <app-lesson-card class="mt-5" tone="amber" label="2 · THE MENTAL MODEL" heading="Three safety nets, from close to far">
            <ol class="mt-3 list-decimal space-y-2 pl-5 text-sm text-stone-300">
              <li><strong class="text-stone-100">Close:</strong> catch the error right where it happens (<code class="text-gold-300">try/catch</code>, <code class="text-gold-300">catchError</code>) and recover.</li>
              <li><strong class="text-stone-100">Middle:</strong> show the user a clear state with a way to try again.</li>
              <li><strong class="text-stone-100">Far:</strong> one global handler that logs everything that got through.</li>
            </ol>
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="highlight" label="PREDICT" heading="What happens next?">
            <app-predict-output [challenge]="swallowChallenge" />
          </app-lesson-card>

          <app-recap class="mt-5" [items]="recapWhy" />
        </section>
      </ng-template>

      <!-- ── Local ── -->
      <ng-template appLessonSection="local">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card class="mt-10" label="PLAIN CODE" heading="try/catch for code that runs now">
            <pre class="mt-3" [appCode]="tryCatchCode"></pre>
            <p class="mt-3 max-w-[60ch] text-sm text-stone-400">
              <code class="text-gold-300">try/catch</code> works for ordinary code and for <code class="text-gold-300">await</code>. It does not catch an error inside an Observable that has not run yet, which is why RxJS has its own tool.
            </p>
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="highlight" label="TRY IT" heading="Three ways to meet a failing request">
            <p class="mt-2 text-sm text-stone-400">The pretend server is down. Pick a strategy and press load. "Retry" tries again up to 2 more times, a second apart.</p>
            <div class="mt-3 flex flex-wrap gap-2" role="group" aria-label="Strategy">
              @for (s of strategies; track s.id) {
                <button type="button" [attr.aria-pressed]="strategy() === s.id" (click)="strategy.set(s.id); loadState.set('idle')"
                        class="min-h-11 rounded-xl border px-4 text-sm font-semibold transition"
                        [class]="strategy() === s.id ? 'border-gold-400 bg-gold-500/15 text-gold-200' : 'border-stone-700 text-stone-300 hover:bg-stone-800'">{{ s.label }}</button>
              }
              <button type="button" (click)="load()" class="min-h-11 rounded-xl bg-gold-solid px-4 text-sm font-semibold text-white hover:bg-gold-solid-hover">Load the data</button>
            </div>
            <app-code-output class="mt-4 block" [code]="strategyCode()" caption="The same failing request, three different outcomes for the user.">
              <p class="text-sm" aria-live="polite" [class]="loadState() === 'error' ? 'text-rose-300' : loadState() === 'data' ? 'text-emerald-300' : 'text-stone-300'" data-testid="outcome">{{ outcome() }}</p>
              <p class="mt-1 text-xs text-stone-500">Attempts made: {{ attempts() }}</p>
            </app-code-output>
          </app-lesson-card>

          <app-common-mistake class="mt-5" title="Catching an error and doing nothing" [wrong]="mistakeSwallowWrong" [right]="mistakeSwallowRight">
            An empty <code class="text-gold-300">catch</code> hides the problem from you and the user. Always do something: recover, show a message, or pass the error on to the global handler.
          </app-common-mistake>

          <app-recap class="mt-5" [items]="recapLocal" />
        </section>
      </ng-template>

      <!-- ── Global ── -->
      <ng-template appLessonSection="global">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card class="mt-10" label="THE LAST NET" heading="ErrorHandler: one place for everything that got through">
            <p class="mt-2 text-sm text-stone-400">
              Angular gives every uncaught error to a service called <code class="text-gold-300">ErrorHandler</code>. By default it only prints to the console.
              You can replace it with your own class, to send errors to a log service, show a toast, or both.
              This app also turns on <code class="text-gold-300">provideBrowserGlobalErrorListeners()</code>, which sends errors that happen outside Angular to the same place.
            </p>
            <pre class="mt-3" [appCode]="handlerCode"></pre>
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="highlight" label="SEE IT" heading="Feed the handler some errors">
            <p class="mt-2 text-sm text-stone-400">
              This page uses its own small handler (so nothing is logged for real). Each button throws an error and passes it on, as Angular does with an uncaught one.
            </p>
            <div class="mt-3 flex flex-wrap gap-2">
              <button type="button" (click)="boom('Cannot read the user name')" class="min-h-11 rounded-xl border border-stone-600 px-4 text-sm font-semibold text-stone-100 hover:bg-stone-800">Break something</button>
              <button type="button" (click)="boom('Payment failed: card declined')" class="min-h-11 rounded-xl border border-stone-600 px-4 text-sm font-semibold text-stone-100 hover:bg-stone-800">Another error</button>
              <button type="button" (click)="handler.log.set([])" class="min-h-11 rounded-xl border border-stone-600 px-4 text-sm font-semibold text-stone-100 hover:bg-stone-800">Clear</button>
            </div>
            <ol class="mt-3 min-h-16 space-y-1 rounded-xl bg-stone-950 p-3 font-mono text-xs text-stone-300" aria-live="polite" aria-label="Errors the handler received">
              @for (line of handler.log(); track $index) { <li>{{ line }}</li> } @empty { <li class="text-stone-500">No errors yet.</li> }
            </ol>
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="highlight" label="PUT IT IN ORDER" heading="An uncaught error in a click handler">
            <app-order-steps
              [steps]="globalSteps"
              explanation="Nothing catches the error near the click, so Angular catches it, gives it to the ErrorHandler, and the rest of the page keeps running."
            />
          </app-lesson-card>

          <app-recap class="mt-5" [items]="recapGlobal" />
        </section>
      </ng-template>

      <!-- ── UI ── -->
      <ng-template appLessonSection="ui">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card class="mt-10" variant="highlight" label="TRY IT" heading="Loading, error with a retry, then data">
            <p class="mt-2 text-sm text-stone-400">Turn the server off, press load, then turn it on and press Retry.</p>
            <div class="mt-3 flex flex-wrap items-center gap-3">
              <label class="flex min-h-11 cursor-pointer items-center gap-2 text-sm text-stone-200">
                <input type="checkbox" [checked]="serverDown()" (change)="serverDown.set($any($event.target).checked)" class="h-4 w-4 accent-[rgb(var(--gold-400))]" />
                The server is down
              </label>
              <button type="button" (click)="fetchList()" class="min-h-11 rounded-xl bg-gold-solid px-4 text-sm font-semibold text-white hover:bg-gold-solid-hover">Load the list</button>
            </div>
            <div class="mt-4 min-h-24 rounded-xl border border-stone-700 bg-stone-900 p-4" aria-live="polite">
              @switch (listState()) {
                @case ('loading') { <p class="text-sm text-stone-300">Loading your list…</p> }
                @case ('error') {
                  <div role="alert">
                    <p class="font-semibold text-rose-200">We could not load your list.</p>
                    <p class="mt-1 text-sm text-stone-400">Check your connection. Nothing was lost.</p>
                    <button type="button" (click)="fetchList()" class="mt-3 min-h-11 rounded-xl border border-rose-400/60 px-4 text-sm font-semibold text-rose-200 hover:bg-stone-800">Retry</button>
                  </div>
                }
                @case ('data') {
                  <ul class="list-disc space-y-1 pl-5 text-sm text-stone-200"><li>Spirited Away</li><li>My Neighbor Totoro</li><li>Castle in the Sky</li></ul>
                }
                @default { <p class="text-sm text-stone-500">Press "Load the list".</p> }
              }
            </div>
          </app-lesson-card>

          <app-lesson-card class="mt-5" label="A GOOD ERROR MESSAGE" heading="Say what happened, what it means, what to do">
            <ul class="mt-3 list-disc space-y-2 pl-5 text-sm text-stone-300">
              <li><strong class="text-stone-100">What:</strong> "We could not load your list."</li>
              <li><strong class="text-stone-100">Reassure:</strong> "Nothing was lost."</li>
              <li><strong class="text-stone-100">What next:</strong> a Retry button, or a link to go back.</li>
              <li>Never show raw technical text, and announce it to screen readers with <code class="text-gold-300">role="alert"</code>.</li>
            </ul>
          </app-lesson-card>

          <app-common-mistake class="mt-5" title="Showing the raw error to the user" [wrong]="mistakeRawWrong" [right]="mistakeRawRight">
            Technical text such as "HttpErrorResponse 0 Unknown Error" means nothing to a user and can leak details. Log the technical error, show a friendly message.
          </app-common-mistake>

          <app-recap class="mt-5" [items]="recapUi" />
          <app-knowledge-check [items]="checkItems" />
        </section>
      </ng-template>
    </app-lesson-player>
  `,
})
export class ErrorHandlingComponent {
  readonly section = input<string>();
  private readonly destroyRef = inject(DestroyRef);
  protected readonly handler = new DemoErrorHandler();

  // ── local ──
  protected readonly strategies: { id: Strategy; label: string }[] = [
    { id: 'none', label: 'No handling' },
    { id: 'fallback', label: 'catchError with a fallback' },
    { id: 'retry', label: 'Retry, then show an error' },
  ];
  protected readonly strategy = signal<Strategy>('none');
  protected readonly loadState = signal<LoadState>('idle');
  protected readonly attempts = signal(0);

  protected outcome(): string {
    switch (this.loadState()) {
      case 'loading': return 'Loading…';
      case 'data': return 'Showing saved data from the last visit. The server could not be reached.';
      case 'error': return this.strategy() === 'none' ? 'Uncaught error. The page stays on "Loading…" forever in a real app.' : 'We could not reach the server after 3 tries. Please try again later.';
      default: return 'Press "Load the data".';
    }
  }

  protected load(): void {
    this.attempts.set(0);
    this.loadState.set('loading');
    // The pretend server answers after a short wait, and always fails. Each subscription is one attempt.
    const request$ = defer(() => {
      this.attempts.update((n) => n + 1);
      return throwError(() => new Error('Server is down')).pipe(delay(300));
    });
    const strategy = this.strategy();
    if (strategy === 'none') {
      request$.subscribe({
        error: () => this.loadState.set('error'),
      });
    } else if (strategy === 'fallback') {
      request$.pipe(catchError(() => of('saved data'))).subscribe(() => this.loadState.set('data'));
    } else {
      request$
        .pipe(
          retry({ count: 2, delay: () => timer(1000) }),
          catchError(() => throwError(() => new Error('Gave up'))),
        )
        .subscribe({ error: () => this.loadState.set('error') });
    }
  }

  protected strategyCode(): string {
    switch (this.strategy()) {
      case 'fallback':
        return `this.http.get(url).pipe(\n  catchError(() => of(savedData)),     // recover with something useful\n)`;
      case 'retry':
        return `this.http.get(url).pipe(\n  retry({ count: 2, delay: 1000 }),    // try again, a second apart\n  catchError(() => throwError(() => new Error('Gave up'))),\n)`;
      default:
        return `this.http.get(url).subscribe(data => this.data = data);   // nothing handles a failure`;
    }
  }

  // ── global ──
  protected boom(message: string): void {
    try {
      throw new Error(message);
    } catch (error) {
      this.handler.handleError(error);
    }
  }

  // ── ui ──
  protected readonly serverDown = signal(true);
  protected readonly listState = signal<LoadState>('idle');
  private listTimer: ReturnType<typeof setTimeout> | undefined;

  protected fetchList(): void {
    clearTimeout(this.listTimer);
    this.listState.set('loading');
    this.listTimer = setTimeout(() => this.listState.set(this.serverDown() ? 'error' : 'data'), 700);
  }

  constructor() {
    this.destroyRef.onDestroy(() => clearTimeout(this.listTimer));
  }

  protected readonly tryCatchCode = `try {
  const data = await this.api.loadUser(id);
  this.user.set(data);
} catch (error) {
  this.message.set('We could not load that user.');   // recover or tell the user
  this.errors.report(error);                           // and let someone know
}`;

  protected readonly handlerCode = `@Injectable()
export class AppErrorHandler implements ErrorHandler {
  handleError(error: unknown) {
    this.logger.send(error);                 // keep a record
    this.toast.show('Something went wrong.'); // and tell the user
  }
}

// app.config.ts
providers: [
  provideBrowserGlobalErrorListeners(),
  { provide: ErrorHandler, useClass: AppErrorHandler },
]`;

  protected readonly mistakeSwallowWrong = `try { this.save(); } catch { }              // hides every failure`;
  protected readonly mistakeSwallowRight = `try { this.save(); } catch (error) {
  this.message.set('Could not save. Try again.');
  this.errors.report(error);
}`;
  protected readonly mistakeRawWrong = `<p>{{ error.message }}</p>      <!-- "Http failure response for /api: 0 Unknown Error" -->`;
  protected readonly mistakeRawRight = `<p role="alert">We could not load your list. Please try again.</p>`;

  protected readonly swallowChallenge: PredictChallenge = {
    question: 'A request fails and the code is  this.http.get(url).subscribe(data => show(data)).  What does the user see?',
    options: [
      { id: 'a', text: 'A clear error message' },
      { id: 'b', text: 'Nothing changes, and the page may look stuck' },
      { id: 'c', text: 'The request is retried by Angular' },
      { id: 'd', text: 'The app restarts' },
    ],
    correct: 'b',
    explanation: 'With no error handler on the subscription, Angular does not know what to show. The loading state never ends, and the failure only reaches the console.',
  };

  protected readonly globalSteps = [
    'The user clicks a button',
    'The handler throws an error',
    'Nothing near the click catches it',
    'Angular passes the error to the ErrorHandler',
    'The page keeps running and the handler logs it',
  ];

  protected readonly recapWhy = [
    'You cannot stop errors, but you can decide what happens next.',
    'Catch close to the cause, show a clear state, and keep a global net.',
    'Never leave the user guessing.',
  ];
  protected readonly recapLocal = [
    'try/catch covers code that runs now, including await.',
    'catchError and retry cover errors inside an Observable.',
    'Never catch an error and do nothing.',
  ];
  protected readonly recapGlobal = [
    'ErrorHandler receives every uncaught error.',
    'Replace it with your own class to log and to tell the user.',
    'provideBrowserGlobalErrorListeners() sends errors outside Angular to the same place.',
  ];
  protected readonly recapUi = [
    'Show loading, error and data states for every request.',
    'A good message says what happened, reassures, and offers a next step.',
    'Use role="alert" so screen readers announce the error.',
  ];

  protected readonly checkItems: KnowledgeCheckItem[] = [
    { question: 'Where would you catch an error from an Observable?', answer: 'Inside the pipe with catchError, close to the request, so you can recover or turn it into a friendly state.' },
    { question: 'What does ErrorHandler do?', answer: 'It receives every error nothing else caught. By default it logs to the console; you can replace it to log remotely and notify the user.' },
    { question: 'Why is an empty catch block a bug?', answer: 'It hides the failure from the user and from you, so problems stay unknown and unfixed.' },
  ];
}
