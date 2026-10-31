import { ChangeDetectionStrategy, Component, DestroyRef, Injectable, inject, input, signal } from '@angular/core';

import { CodeBlockDirective } from '../../shared/code-block.directive';
import { CdTreeDemoComponent } from './cd-tree-demo.component';
import { FlowDiagramComponent } from '../../shared/flow-diagram.component';
import { LessonCardComponent } from '../../shared/lesson-card.component';
import { TermComponent } from '../../shared/term.component';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { KnowledgeCheckComponent, KnowledgeCheckItem } from '../../shared/knowledge-check.component';
import { LessonPlayerComponent } from '../../learn/player/lesson-player.component';
import { LessonSectionDirective } from '../../learn/player/lesson-section.directive';
import { RecapComponent } from '../../shared/recap.component';
import { CommonMistakeComponent } from '../../shared/common-mistake.component';
import { CodeOutputComponent } from '../../shared/code-output.component';

export interface DemoUser {
  name: string;
}

// Deliberately left on the Eager strategy (the old Default): this card is the "before" in the OnPush comparison lesson.
@Component({
  selector: 'app-cd-default-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <div class="rounded-xl bg-stone-800 p-4">
      <p class="text-xs text-stone-400">Eager strategy (the old Default)</p>
      <p class="mt-1 text-lg font-semibold">{{ user().name }}</p>
    </div>
  `,
})
export class CdDefaultCardComponent {
  readonly user = input.required<DemoUser>();
}

@Component({
  selector: 'app-cd-onpush-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="rounded-xl bg-stone-800 p-4">
      <p class="text-xs text-stone-400">OnPush strategy</p>
      <p class="mt-1 text-lg font-semibold">{{ user().name }}</p>
    </div>
  `,
})
export class CdOnPushCardComponent {
  readonly user = input.required<DemoUser>();
}

@Injectable({ providedIn: 'root' })
export class TickService {
  readonly count = signal(0);
  increment(): void {
    this.count.update((value) => value + 1);
  }
}

@Component({
  selector: 'app-cd-signal-reader',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="rounded-xl bg-stone-800 p-4">
      <p class="text-xs text-stone-400">OnPush component reading a signal</p>
      <p class="mt-1 text-2xl font-bold">{{ ticks.count() }}</p>
    </div>
  `,
})
export class CdSignalReaderComponent {
  readonly ticks = inject(TickService);
}

const NAMES = ['Ada', 'Grace', 'Linus', 'Margaret', 'Alan'];

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-cd-timer-demo',
  standalone: true,
  template: `
    <div class="space-y-3 rounded-xl bg-stone-800 p-4 text-sm text-stone-200">
      <div class="flex flex-wrap items-center gap-3">
        <p class="min-w-44">Plain field: <strong class="text-gold-300" data-testid="timer-plain">{{ plainValue }}</strong></p>
        <button type="button" (click)="startPlain()" class="min-h-11 rounded-xl border border-stone-600 px-4 text-sm font-semibold text-stone-100 hover:bg-stone-700">Change it in 1 second</button>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <p class="min-w-44">Signal: <strong class="text-gold-300" data-testid="timer-signal">{{ signalValue() }}</strong></p>
        <button type="button" (click)="startSignal()" class="min-h-11 rounded-xl border border-stone-600 px-4 text-sm font-semibold text-stone-100 hover:bg-stone-700">Change it in 1 second</button>
      </div>
      <button type="button" (click)="nudge()" class="min-h-11 rounded-xl bg-gold-solid px-4 text-sm font-semibold text-white hover:bg-gold-solid-hover">Click inside the box</button>
    </div>
  `,
})
export class CdTimerDemoComponent {
  plainValue = 'not changed';
  protected readonly signalValue = signal('not changed');
  private timer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.timer));
  }

  startPlain(): void {
    clearTimeout(this.timer);
    this.plainValue = 'not changed';
    this.timer = setTimeout(() => (this.plainValue = 'changed!'), 1000);
  }

  startSignal(): void {
    clearTimeout(this.timer);
    this.signalValue.set('not changed');
    this.timer = setTimeout(() => this.signalValue.set('changed!'), 1000);
  }

  /** Any event inside the component marks it for a check, so a stale plain field finally shows. */
  nudge(): void {}
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CdTimerDemoComponent, CodeOutputComponent, CommonMistakeComponent, RecapComponent, TermComponent, CdTreeDemoComponent, CdDefaultCardComponent, CdOnPushCardComponent, CdSignalReaderComponent, FlowDiagramComponent, CodeBlockDirective, KnowledgeCheckComponent, PageHeaderComponent, LessonCardComponent, LessonPlayerComponent, LessonSectionDirective],
  template: `
    <app-lesson-player [topicId]="'change-detection'" [section]="section()">
      <ng-template appLessonSection="default">
      <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <app-page-header title="Change Detection" illustration="change-detection">
        After something happens (a click, a response, a timer), Angular walks the component tree and re-checks what each
        template shows. The older <code class="text-gold-300">Eager</code> strategy (once called Default) checks <em>every</em> component, every time. With
        <app-term term="onpush"><code class="text-gold-300">OnPush</code></app-term> a component is only re-checked when something it depends on actually changed —
        so a big app does far less work.
      </app-page-header>

      <div class="mt-10 grid gap-5 md:grid-cols-2">
        <app-lesson-card label="1 · TWO STRATEGIES" heading="Check everything vs. check what changed">
          <p class="mt-2 text-sm text-stone-400">
            <strong class="text-stone-200">Eager (the old Default):</strong> re-check this component whenever anything in the app might have changed.<br />
            <strong class="text-stone-200">OnPush (the default since Angular 22):</strong> re-check only when an <code class="text-gold-300">input()</code> gets a
            <em>new reference</em>, an event fires inside the component, or a signal it reads changes.
          </p>
          <app-flow-diagram class="mt-4 block" from="something happens" to="Angular re-checks the tree" direction="right" />
          <pre class="mt-4 overflow-x-auto rounded-xl bg-stone-950 p-4 text-xs text-gold-200">{{ onPushCode }}</pre>
        </app-lesson-card>
      </div>

      <app-lesson-card class="mt-5" label="THE MENTAL MODEL" heading="A building inspector" tone="amber">
        <ul class="mt-3 list-disc space-y-2 pl-5 text-sm text-stone-300">
          <li><strong class="text-stone-100">Change detection</strong> is an inspector who walks the building and updates the sign on every door that has changed.</li>
          <li><strong class="text-stone-100">Eager:</strong> after <em>any</em> noise, the inspector re-checks every single room — safe, but slow in a big building.</li>
          <li><strong class="text-stone-100">OnPush:</strong> the inspector only visits rooms that have a reason: someone knocked from inside, a new package arrived, or a signal rang.</li>
        </ul>
      </app-lesson-card>

      <app-lesson-card class="mt-5" label="WHAT STARTS A CHECK" heading="Angular re-checks after these things">
        <p class="mt-2 text-sm text-stone-400">
          A library called <strong class="text-stone-200">zone.js</strong> watches for work that finishes and tells Angular "something may have changed":
        </p>
        <ul class="mt-3 list-disc space-y-1 pl-5 text-sm text-stone-300">
          <li>a DOM event such as <code class="text-gold-300">(click)</code> or <code class="text-gold-300">(input)</code></li>
          <li>a timer: <code class="text-gold-300">setTimeout</code> or <code class="text-gold-300">setInterval</code></li>
          <li>an HTTP response or a resolved Promise</li>
        </ul>
        <p class="mt-3 text-sm text-stone-400">The strategy decides <em>how much</em> of the tree gets re-checked each time. That is the whole difference between Eager and OnPush.</p>
      </app-lesson-card>
      <app-recap class="mt-5" [items]="recapDefault" />
      </section>
      </ng-template>

      <ng-template appLessonSection="onpush">
      <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <app-lesson-card class="mt-10" variant="highlight" label="2 · SEE IT" heading="Which components get re-checked?">
        <ol class="mt-2 list-decimal space-y-1 pl-5 text-sm text-stone-400">
          <li>Fire <strong class="text-stone-200">Click inside Card #2</strong> while everything is Eager (the old Default) — all 5 are checked.</li>
          <li>Switch the cards and the header to <strong class="text-stone-200">OnPush</strong> and fire it again. Fewer components are checked, but Card #2 still updates.</li>
          <li>Now switch <strong class="text-stone-200">AppComponent</strong> to OnPush and fire <strong class="text-stone-200">A timer fires</strong>. What happens to the whole tree?</li>
        </ol>
        <app-cd-tree-demo />
      </app-lesson-card>

      <div class="mt-5 grid gap-5 md:grid-cols-2">
        <app-lesson-card variant="highlight" label="3 · TRY IT" heading="Mutate vs. replace">
          <p class="mt-2 text-sm text-stone-400">
            Both cards receive the same <code class="text-gold-300">user</code> object. Mutating it keeps the same reference,
            so the OnPush card does not notice. Replacing it with a new object does.
          </p>
          <div class="mt-4 grid gap-3 sm:grid-cols-2">
            <app-cd-default-card [user]="user" />
            <app-cd-onpush-card [user]="user" />
          </div>
          <div class="mt-4 flex flex-wrap gap-3">
            <button type="button" (click)="mutate()" class="min-h-11 rounded-xl border border-stone-600 px-4 text-sm font-semibold hover:bg-stone-800">Mutate name</button>
            <button type="button" (click)="replace()" class="min-h-11 rounded-xl bg-gold-solid px-4 text-sm font-semibold text-white hover:bg-gold-solid-hover">Replace user</button>
          </div>
          <p class="mt-3 text-xs text-stone-500">
            The parent now holds <strong class="text-stone-300">{{ user.name }}</strong>. If the OnPush card still shows an older name, that is the point.
          </p>
        </app-lesson-card>
      </div>

      <app-lesson-card class="mt-5" variant="danger" label="COMMON MISTAKES" heading="Why OnPush sometimes looks broken">
        <ul class="mt-3 list-disc space-y-2 pl-5 text-sm text-stone-300">
          <li><strong class="text-stone-100">Mutating an object.</strong> <code class="text-gold-300">user.name = 'x'</code> keeps the same reference, so an OnPush child sees no change. Replace the object: <code class="text-gold-300">user = &#123; ...user, name: 'x' &#125;</code>.</li>
          <li><strong class="text-stone-100">Changing a plain field from a timer or a callback.</strong> Nothing marks the component dirty, so the screen stays stale. Store the value in a <code class="text-gold-300">signal()</code> instead.</li>
          <li><strong class="text-stone-100">Reaching for <code class="text-gold-300">markForCheck()</code> everywhere.</strong> It is a sign the state should be a signal or come through an <code class="text-gold-300">async</code> pipe.</li>
        </ul>
      </app-lesson-card>
      <app-recap class="mt-5" [items]="recapOnPush" />
      </section>
      </ng-template>

      <ng-template appLessonSection="signals-cd">
      <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <div class="mt-10 grid gap-5 md:grid-cols-2">
        <app-lesson-card class="md:col-span-2" label="3 · SIGNALS FIT OnPush" heading="Reading a signal marks the component for you">
          <p class="mt-2 text-sm text-stone-400">
            This OnPush component has no inputs at all, yet it updates when you click below, because its template reads a
            signal. Angular tracks the read and re-checks exactly that component — which is why signals and OnPush are the
            recommended pair.
          </p>
          <div class="mt-4 grid items-center gap-3 sm:grid-cols-[1fr_auto]">
            <app-cd-signal-reader />
            <button type="button" (click)="ticks.increment()" class="min-h-11 rounded-xl bg-gold-solid px-4 text-sm font-semibold text-white hover:bg-gold-solid-hover">Increment the signal</button>
          </div>
        </app-lesson-card>
      </div>

      <app-recap class="mt-5" [items]="recapSignals" />
      <app-knowledge-check [items]="checkItems" />
      </section>
      </ng-template>
      <ng-template appLessonSection="zoneless">
      <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <app-lesson-card class="mt-10" label="WHO RINGS THE BELL?" heading="Angular only checks when something tells it to">
          <p class="mt-2 text-sm text-stone-400">
            Angular does not watch your data all the time. Something has to <em>wake it up</em> and say "something may have changed". For years that job belonged to
            <strong class="text-stone-200">zone.js</strong>, a library that listens to every click, timer and request. Apps can also run <strong class="text-stone-200">without zone.js</strong>
            (<code class="text-gold-300">provideZonelessChangeDetection()</code>) and rely on clear signals instead.
          </p>
        </app-lesson-card>

        <app-lesson-card class="mt-5" variant="highlight" label="TRY IT" heading="A timer changes two things. Which one shows?">
          <p class="mt-2 text-sm text-stone-400">
            This component is OnPush. Press the first button and wait: a timer sets a plain field. Press the second and wait: a timer sets a signal. Then press "Click inside the box".
          </p>
          <app-code-output class="mt-4 block" [code]="timerCode" caption="The signal tells Angular it changed, so the screen updates. The plain field changes silently, so the screen stays stale until some event inside the component wakes it up.">
            <app-cd-timer-demo />
          </app-code-output>
        </app-lesson-card>

        <app-lesson-card class="mt-5" label="THE LIST" heading="What wakes an OnPush or zoneless component">
          <ul class="mt-3 list-disc space-y-2 pl-5 text-sm text-stone-300">
            <li>An <strong class="text-stone-100">event</strong> handled in its template, such as a click.</li>
            <li>A <strong class="text-stone-100">signal</strong> read in its template changes.</li>
            <li>An <code class="text-gold-300">input()</code> receives a new value.</li>
            <li>The <code class="text-gold-300">async</code> pipe gets a new value.</li>
            <li>You call <code class="text-gold-300">markForCheck()</code> yourself, the last resort.</li>
          </ul>
        </app-lesson-card>

        <app-common-mistake class="mt-5" title="Changing a plain field from a timer or a request" [wrong]="mistakeTimerWrong" [right]="mistakeTimerRight">
          A plain field changes without telling Angular, so an OnPush or zoneless component can show old data. Keep state that the template reads in a signal.
        </app-common-mistake>

        <app-recap class="mt-5" [items]="recapZoneless" />
      </section>
      </ng-template>
    </app-lesson-player>
  `,
})
export class ChangeDetectionComponent {
  protected readonly timerCode = `plainValue = 'not changed';
signalValue = signal('not changed');

startPlain() {
  setTimeout(() => (this.plainValue = 'changed!'), 1000);       // Angular is not told
}
startSignal() {
  setTimeout(() => this.signalValue.set('changed!'), 1000);     // Angular is told
}`;
  protected readonly mistakeTimerWrong = `loaded = false;
ngOnInit() { setTimeout(() => (this.loaded = true), 500); }     // may never show`;
  protected readonly mistakeTimerRight = `loaded = signal(false);
ngOnInit() { setTimeout(() => this.loaded.set(true), 500); }`;
  protected readonly recapDefault = [
    'Angular re-checks templates after something happens: an event, a timer or a response.',
    'Eager (the old Default) checks every component; OnPush checks only those with a reason.',
    'OnPush is the default for new components in Angular 22.',
  ];
  protected readonly recapOnPush = [
    'An OnPush component is re-checked after an input gets a new reference, an event inside it, or a signal it reads.',
    'Replace objects instead of mutating them.',
    'Fewer components checked means less work on every pass.',
  ];
  protected readonly recapSignals = [
    'Reading a signal in a template marks that component for you.',
    'That is why signals and OnPush are the recommended pair.',
    'No manual markForCheck() is needed.',
  ];
  protected readonly recapZoneless = [
    'Angular only checks when something wakes it up.',
    'Events, signals, new inputs and the async pipe all wake an OnPush component.',
    'Keep state the template reads in signals, with or without zone.js.',
  ];

  readonly section = input<string>();
  readonly ticks = inject(TickService);

  user: DemoUser = { name: NAMES[0] };
  private nameIndex = 0;

  mutate(): void {
    this.user.name = this.nextName();
  }

  replace(): void {
    this.user = { name: this.nextName() };
  }

  private nextName(): string {
    this.nameIndex = (this.nameIndex + 1) % NAMES.length;
    return NAMES[this.nameIndex];
  }

  readonly onPushCode = `@Component({
  selector: 'app-user-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`{{ user().name }}\`,
})
export class UserCardComponent {
  readonly user = input.required<User>();
}`;

  readonly checkItems: KnowledgeCheckItem[] = [
    {
      question: 'When is an OnPush component re-checked?',
      answer: 'When one of its inputs receives a new reference, when an event handler fires inside it, when an async pipe emits, or when a signal read in its template changes.',
    },
    {
      question: 'Why does mutating an object passed to an OnPush child not update it?',
      answer: 'OnPush compares the input by reference. user.name = "x" keeps the same object, so Angular sees no change; passing a new object ({ ...user, name: "x" }) does.',
    },
    {
      question: 'Why do signals and OnPush work so well together?',
      answer: 'Reading a signal in a template tells Angular exactly which component depends on it, so only that component is re-checked when the signal changes — no need to pass new references around.',
    },
  ];
}
