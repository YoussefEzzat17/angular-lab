import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';

import { LessonPlayerComponent } from '../../learn/player/lesson-player.component';
import { LessonSectionDirective } from '../../learn/player/lesson-section.directive';
import { CodeBlockDirective } from '../../shared/code-block.directive';
import { CodeOutputComponent } from '../../shared/code-output.component';
import { CommonMistakeComponent } from '../../shared/common-mistake.component';
import { KnowledgeCheckComponent, KnowledgeCheckItem } from '../../shared/knowledge-check.component';
import { LessonCardComponent } from '../../shared/lesson-card.component';
import { LessonFigureComponent } from '../../shared/lesson-figure.component';
import { OrderStepsComponent } from '../../shared/order-steps.component';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { PredictChallenge, PredictOutputComponent } from '../../shared/predict-output.component';
import { RecapComponent } from '../../shared/recap.component';
import { ChangeDemoComponent, LifecycleLog, LifecycleProbeComponent, MeasureDemoComponent, TickerDemoComponent } from './lifecycle-demos';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ChangeDemoComponent,
    CodeBlockDirective,
    CodeOutputComponent,
    CommonMistakeComponent,
    KnowledgeCheckComponent,
    LessonCardComponent,
    LessonFigureComponent,
    LessonPlayerComponent,
    LessonSectionDirective,
    LifecycleProbeComponent,
    MeasureDemoComponent,
    OrderStepsComponent,
    PageHeaderComponent,
    PredictOutputComponent,
    RecapComponent,
    TickerDemoComponent,
  ],
  template: `
    <app-lesson-player [topicId]="'lifecycle'" [section]="section()">
      <!-- ── Overview ── -->
      <ng-template appLessonSection="overview">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-page-header title="Component Lifecycle" illustration="lifecycle">
            A component is not there forever. Angular creates it, shows it, updates it, and finally removes it. The <strong class="text-stone-200">lifecycle hooks</strong>
            are small methods Angular calls at those moments, so you can run code at the right time.
          </app-page-header>

          <app-lesson-card class="mt-10" label="1 · THE PROBLEM" heading="Some code needs to run at a particular moment">
            <p class="mt-2 text-sm text-stone-400">
              You may want to start a timer when a component appears, measure it once it is drawn, and stop the timer when it goes away.
              Without a clear moment for each, you start work too early, or forget to stop it and it keeps running for no reason.
            </p>
          </app-lesson-card>

          <app-lesson-card class="mt-5" tone="amber" label="2 · THE MENTAL MODEL" heading="A shop assistant's day">
            <ul class="mt-3 list-disc space-y-2 pl-5 text-sm text-stone-300">
              <li><strong class="text-stone-100">Hired</strong> (constructor): the person exists but has no instructions yet.</li>
              <li><strong class="text-stone-100">Briefed</strong> (ngOnInit): now they know their job, so real work can start.</li>
              <li><strong class="text-stone-100">Shop opens</strong> (afterNextRender): the shop floor exists, so they can arrange it.</li>
              <li><strong class="text-stone-100">Leaves</strong> (ngOnDestroy): they put things away before going.</li>
            </ul>
          </app-lesson-card>

          <app-lesson-figure
            class="mt-5"
            caption="The moments of a component, and the hook for each."
            description="A line with four points: created (constructor), ready (ngOnInit), drawn (afterNextRender) and removed (ngOnDestroy)."
          >
            <svg viewBox="0 0 440 120" role="presentation" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M30 50 H410" stroke="rgb(var(--stone-600))" stroke-width="2" stroke-linecap="round" />
              <g font-family="ui-monospace, monospace" font-size="11" font-weight="600" text-anchor="middle">
                <circle cx="40" cy="50" r="8" fill="rgb(var(--stone-900))" stroke="rgb(var(--gold-400))" stroke-width="2" />
                <text x="40" y="28" fill="rgb(var(--stone-300))">created</text>
                <text x="40" y="82" fill="rgb(var(--gold-300))">constructor</text>
                <circle cx="150" cy="50" r="8" fill="rgb(var(--stone-900))" stroke="rgb(var(--gold-400))" stroke-width="2" />
                <text x="150" y="28" fill="rgb(var(--stone-300))">ready</text>
                <text x="150" y="82" fill="rgb(var(--gold-300))">ngOnInit</text>
                <circle cx="280" cy="50" r="8" fill="rgb(var(--stone-900))" stroke="rgb(var(--gold-400))" stroke-width="2" />
                <text x="280" y="28" fill="rgb(var(--stone-300))">drawn</text>
                <text x="280" y="82" fill="rgb(var(--gold-300))">afterNextRender</text>
                <circle cx="400" cy="50" r="8" fill="rgb(var(--stone-900))" stroke="rgb(var(--gold-400))" stroke-width="2" />
                <text x="400" y="28" fill="rgb(var(--stone-300))">removed</text>
                <text x="394" y="82" fill="rgb(var(--gold-300))">ngOnDestroy</text>
              </g>
            </svg>
          </app-lesson-figure>

          <app-lesson-card class="mt-5" variant="highlight" label="PREDICT" heading="Which comes first?">
            <app-predict-output [challenge]="orderChallenge" />
          </app-lesson-card>

          <app-recap class="mt-5" [items]="recapOverview" />
        </section>
      </ng-template>

      <!-- ── Init and destroy ── -->
      <ng-template appLessonSection="init-destroy">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card class="mt-10" variant="highlight" label="START AND CLEAN UP" heading="Start a timer in ngOnInit, stop it when the component goes">
            <p class="mt-2 text-sm text-stone-400">
              Show the ticker, wait a few seconds, then hide it. Watch "timers running": it goes back to zero because the component stopped its own timer.
            </p>
            <div class="mt-3 flex flex-wrap items-center gap-3">
              <button type="button" (click)="showTicker.set(!showTicker())" class="min-h-11 rounded-xl bg-gold-solid px-4 text-sm font-semibold text-white hover:bg-gold-solid-hover">
                {{ showTicker() ? 'Hide the ticker' : 'Show the ticker' }}
              </button>
              <p class="text-sm text-stone-400">Timers running: <strong class="text-stone-100" aria-live="polite">{{ log.timers() }}</strong></p>
            </div>
            <app-code-output class="mt-4 block" [code]="tickerCode" caption="DestroyRef.onDestroy sits next to the code that starts the timer, so the two are never forgotten apart.">
              @if (showTicker()) {
                <app-ticker-demo />
              } @else {
                <p class="text-sm text-stone-500">The ticker is gone, and so is its timer.</p>
              }
            </app-code-output>
          </app-lesson-card>

          <app-lesson-card class="mt-5" label="WHICH ONE?" heading="ngOnDestroy or DestroyRef?">
            <p class="mt-2 text-sm text-stone-400">
              Both run just before the component is removed. <code class="text-gold-300">DestroyRef</code> lets you register clean-up right beside the code that needs it, even inside a function or a service.
              <code class="text-gold-300">ngOnDestroy</code> is a method on the class. Either is fine; keep each clean-up close to its start.
            </p>
          </app-lesson-card>

          <app-common-mistake class="mt-5" title="Starting a timer and never stopping it" [wrong]="mistakeLeakWrong" [right]="mistakeLeakRight">
            A timer keeps running even after its component is gone. Over time these leaks add up and slow the page. Always pair a start with a stop.
          </app-common-mistake>

          <app-recap class="mt-5" [items]="recapInit" />
        </section>
      </ng-template>

      <!-- ── After render ── -->
      <ng-template appLessonSection="render">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card class="mt-10" label="THE DOM" heading="Some work needs the page to be drawn first">
            <p class="mt-2 text-sm text-stone-400">
              Measuring an element, focusing an input or starting a chart library needs real HTML on the screen. In the constructor it does not exist yet.
              <code class="text-gold-300">afterNextRender()</code> runs your function once, right after Angular has drawn the page.
            </p>
            <app-code-output class="mt-4 block" [code]="measureCode" caption="The width is read after render, so it is a real number, not zero.">
              <app-measure-demo />
            </app-code-output>
          </app-lesson-card>

          <app-lesson-card class="mt-5" label="GOOD TO KNOW" heading="It only runs in the browser">
            <ul class="mt-3 list-disc space-y-2 pl-5 text-sm text-stone-300">
              <li>When an app is rendered on a server, there is no screen, so <code class="text-gold-300">afterNextRender</code> is skipped there. That makes it the right place for browser-only code.</li>
              <li><code class="text-gold-300">afterEveryRender</code> runs after every render, for code that must follow the DOM as it changes.</li>
              <li>Call these in the constructor or another injection context.</li>
            </ul>
          </app-lesson-card>

          <app-common-mistake class="mt-5" title="Reading the page in the constructor" [wrong]="mistakeDomWrong" [right]="mistakeDomRight">
            In the constructor the template has not been drawn, so the element is empty or missing. Wait for <code class="text-gold-300">afterNextRender</code>.
          </app-common-mistake>

          <app-recap class="mt-5" [items]="recapRender" />
        </section>
      </ng-template>

      <!-- ── Changes ── -->
      <ng-template appLessonSection="changes">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card class="mt-10" variant="highlight" label="REACT TO CHANGES" heading="Let signals do the watching">
            <p class="mt-2 text-sm text-stone-400">
              When an input changes you often want a new value, or a side effect. With signal inputs, <code class="text-gold-300">computed()</code> works out the new value and
              <code class="text-gold-300">effect()</code> runs the side effect. Press the button and watch both.
            </p>
            <div class="mt-3">
              <button type="button" (click)="count.update(n => n + 1)" class="min-h-11 rounded-xl bg-gold-solid px-4 text-sm font-semibold text-white hover:bg-gold-solid-hover">Add one to count</button>
            </div>
            <app-code-output class="mt-4 block" [code]="changeCode" caption="computed gives you a value. effect is for something that happens because of the value.">
              <app-change-demo [count]="count()" />
            </app-code-output>
          </app-lesson-card>

          <app-lesson-card class="mt-5" label="THE OLDER WAY" heading="ngOnChanges">
            <p class="mt-2 text-sm text-stone-400">
              Existing code uses <code class="text-gold-300">ngOnChanges(changes)</code>, which Angular calls before <code class="text-gold-300">ngOnInit</code> and again whenever a decorator <code class="text-gold-300">&#64;Input</code> changes.
              It does not run for signal inputs, so new code uses <code class="text-gold-300">computed()</code> and <code class="text-gold-300">effect()</code> instead.
            </p>
            <pre class="mt-3" [appCode]="onChangesCode"></pre>
          </app-lesson-card>

          <app-common-mistake class="mt-5" title="Using effect() to work out a value" [wrong]="mistakeEffectWrong" [right]="mistakeEffectRight">
            An effect that only sets another field is a derived value in disguise. <code class="text-gold-300">computed()</code> is simpler and never gets out of step.
          </app-common-mistake>

          <app-recap class="mt-5" [items]="recapChanges" />
        </section>
      </ng-template>

      <!-- ── Try it ── -->
      <ng-template appLessonSection="try-it">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card class="mt-10" variant="highlight" label="TRY IT" heading="Watch a component being created and destroyed">
            <p class="mt-2 text-sm text-stone-400">
              Press the button to add and remove the probe. Each press writes the hooks it ran, in order, into the log.
            </p>
            <div class="mt-3 flex flex-wrap gap-3">
              <button type="button" (click)="toggleProbe()" class="min-h-11 rounded-xl bg-gold-solid px-4 text-sm font-semibold text-white hover:bg-gold-solid-hover">
                {{ showProbe() ? 'Remove the probe' : 'Add the probe' }}
              </button>
              <button type="button" (click)="log.clear()" class="min-h-11 rounded-xl border border-stone-600 px-4 text-sm font-semibold text-stone-200 hover:bg-stone-800">Clear the log</button>
            </div>
            <div class="mt-4 min-h-14">
              @if (showProbe()) {
                <app-lifecycle-probe label="probe" />
              }
            </div>
            <ol class="mt-3 space-y-1 rounded-xl bg-stone-950 p-4 font-mono text-xs text-stone-300" aria-live="polite" aria-label="Lifecycle log">
              @for (line of log.lines(); track $index) {
                <li><span class="text-stone-500">{{ $index + 1 }}.</span> {{ line }}</li>
              } @empty {
                <li class="text-stone-500">Nothing yet. Add the probe.</li>
              }
            </ol>
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="highlight" label="PUT IT IN ORDER" heading="The life of one component">
            <app-order-steps
              [steps]="orderSteps"
              explanation="The constructor runs first, then ngOnInit once inputs are ready. After Angular draws the page, afterNextRender runs. When the component is removed, ngOnDestroy runs last."
            />
          </app-lesson-card>

          <app-recap class="mt-5" [items]="recapTry" />
          <app-knowledge-check [items]="checkItems" />
        </section>
      </ng-template>
    </app-lesson-player>
  `,
})
export class LifecycleComponent {
  readonly section = input<string>();
  protected readonly log = inject(LifecycleLog);

  protected readonly showTicker = signal(false);
  protected readonly showProbe = signal(false);
  protected readonly count = signal(1);

  protected toggleProbe(): void {
    this.showProbe.update((v) => !v);
  }

  protected readonly orderChallenge: PredictChallenge = {
    question: 'A parent passes title="Totoro" to a child. In which hook can the child first rely on title being set?',
    options: [
      { id: 'a', text: 'constructor' },
      { id: 'b', text: 'ngOnInit' },
      { id: 'c', text: 'ngOnDestroy' },
      { id: 'd', text: 'none of them' },
    ],
    correct: 'b',
    explanation: 'Angular sets the inputs after the object is built, so the constructor is too early. ngOnInit runs right after the first inputs are set.',
  };

  protected readonly tickerCode = `export class Ticker implements OnInit {
  seconds = signal(0);
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    const id = setInterval(() => this.seconds.update(n => n + 1), 1000);
    this.destroyRef.onDestroy(() => clearInterval(id));   // stop it
  }
}`;

  protected readonly mistakeLeakWrong = `ngOnInit() {
  setInterval(() => this.load(), 1000);   // never stopped
}`;
  protected readonly mistakeLeakRight = `ngOnInit() {
  const id = setInterval(() => this.load(), 1000);
  this.destroyRef.onDestroy(() => clearInterval(id));
}`;

  protected readonly measureCode = `export class Measure {
  width = signal(0);
  private el = inject(ElementRef);

  constructor() {
    afterNextRender(() => {
      this.width.set(this.el.nativeElement.getBoundingClientRect().width);
    });
  }
}`;

  protected readonly mistakeDomWrong = `constructor() {
  this.width = this.el.nativeElement.offsetWidth;   // not drawn yet
}`;
  protected readonly mistakeDomRight = `constructor() {
  afterNextRender(() => {
    this.width = this.el.nativeElement.offsetWidth;
  });
}`;

  protected readonly changeCode = `export class Change {
  count = input.required<number>();
  doubled = computed(() => this.count() * 2);

  constructor() {
    effect(() => console.log('count is now', this.count()));
  }
}`;

  protected readonly onChangesCode = `ngOnChanges(changes: SimpleChanges) {
  if (changes['title']) {
    console.log('title changed to', changes['title'].currentValue);
  }
}`;

  protected readonly mistakeEffectWrong = `constructor() {
  effect(() => this.doubled = this.count() * 2);
}`;
  protected readonly mistakeEffectRight = `doubled = computed(() => this.count() * 2);`;

  protected readonly orderSteps = [
    'The constructor runs',
    'Angular sets the inputs',
    'ngOnInit runs',
    'Angular draws the page, then afterNextRender runs',
    'The component is removed and ngOnDestroy runs',
  ];

  protected readonly recapOverview = [
    'A component is created, shown, updated and finally destroyed.',
    'Hooks are methods Angular calls at those moments.',
    'Inputs are not ready in the constructor; they are ready in ngOnInit.',
  ];
  protected readonly recapInit = [
    'Start work in ngOnInit, once the inputs are ready.',
    'Stop that work in ngOnDestroy or with DestroyRef.onDestroy.',
    'Always pair a start with a stop.',
  ];
  protected readonly recapRender = [
    'afterNextRender runs once after Angular has drawn the page.',
    'Use it for measuring, focusing and browser-only libraries.',
    'It is skipped on the server, so it is safe for code that needs a browser.',
  ];
  protected readonly recapChanges = [
    'computed() works out a value that follows an input.',
    'effect() is for side effects, such as logging or saving.',
    'ngOnChanges is the older way and does not run for signal inputs.',
  ];
  protected readonly recapTry = [
    'Each time @if brings a component back it is a brand new instance.',
    'The log shows the real order: constructor, ngOnInit, afterNextRender, ngOnDestroy.',
    'Next stop: forms and navigation.',
  ];

  protected readonly checkItems: KnowledgeCheckItem[] = [
    { question: 'Why start work in ngOnInit and not in the constructor?', answer: 'The inputs are not set in the constructor. By ngOnInit they are ready, so the work can use them.' },
    { question: 'Where do you stop a timer you started in ngOnInit?', answer: 'In ngOnDestroy, or in a callback registered with DestroyRef.onDestroy, so it stops when the component goes.' },
    { question: 'When would you use afterNextRender?', answer: 'When code needs the real DOM, for example to measure an element, or must run only in the browser.' },
  ];
}
