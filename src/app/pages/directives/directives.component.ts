import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HighlightDirective } from '../../directives/highlight.directive';
import { NumbersOnlyDirective } from '../../directives/numbers-only.directive';
import { CodeBlockDirective } from '../../shared/code-block.directive';
import { CodeOutputComponent } from '../../shared/code-output.component';
import { CommonMistakeComponent } from '../../shared/common-mistake.component';
import { RecapComponent } from '../../shared/recap.component';
import { FlowDiagramComponent } from '../../shared/flow-diagram.component';
import { LessonCardComponent } from '../../shared/lesson-card.component';
import { OrderStepsComponent } from '../../shared/order-steps.component';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { PredictOutputComponent } from '../../shared/predict-output.component';
import type { PredictChallenge } from '../../shared/predict-output.component';
import { TrackDemoComponent } from './track-demo.component';
import { KnowledgeCheckComponent, KnowledgeCheckItem } from '../../shared/knowledge-check.component';
import { LessonPlayerComponent } from '../../learn/player/lesson-player.component';
import { LessonSectionDirective } from '../../learn/player/lesson-section.directive';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CodeOutputComponent, CommonMistakeComponent, RecapComponent, FormsModule, OrderStepsComponent, PredictOutputComponent, TrackDemoComponent, HighlightDirective, NumbersOnlyDirective, FlowDiagramComponent, CodeBlockDirective, KnowledgeCheckComponent, PageHeaderComponent, LessonCardComponent, LessonPlayerComponent, LessonSectionDirective],
  template: `
    <app-lesson-player [topicId]="'directives'" [section]="section()">
      <ng-template appLessonSection="structural">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <app-page-header title="Directives" illustration="directives">
        A directive is an Angular instruction attached to an element — without the overhead of writing a whole component
        for behavior you want to reuse. There are two flavors: <strong class="text-stone-200">structural</strong>
        directives (prefixed with <code class="text-gold-300">*</code>) add or remove elements from the DOM entirely;
        <strong class="text-stone-200">attribute</strong> directives change how an existing element looks or behaves
        without touching the DOM tree.
      </app-page-header>

      <app-lesson-card class="mt-8" variant="danger" label="THE PROBLEM" heading="Plain HTML cannot decide anything">
        <p class="mt-2 text-sm text-stone-400">
          HTML always shows what you wrote. It cannot say "show this only when the user is logged in", "make one card per film",
          or "turn the border gold when the mouse is over me". Directives are how a template gets those decisions.
        </p>
      </app-lesson-card>

      <app-lesson-card class="mt-5" tone="amber" label="MENTAL MODEL" heading="A directive is a sticky note on an element">
        <p class="mt-2 text-sm text-stone-400">
          Imagine a stage crew reading sticky notes. A note that says <em>"only if the guest list says so"</em> decides whether the actor
          walks on stage at all: that is a <strong class="text-stone-200">structural</strong> directive. A note that says
          <em>"wear a gold hat when the spotlight hits"</em> changes the actor who is already there: that is an
          <strong class="text-stone-200">attribute</strong> directive.
        </p>
      </app-lesson-card>

      <div class="mt-5 grid gap-5 md:grid-cols-2">
        <app-lesson-card label="STRUCTURAL · &#64;if" heading="Adds or removes the element" headingSize="lg">
          <p class="mt-2 text-sm text-stone-400">Unlike <code class="text-gold-300">display:none</code>, a false &#64;if takes the element out of the DOM completely.</p>
          <button type="button" data-testid="toggle-tips" (click)="toggleTips()" class="mt-4 min-h-11 rounded-xl bg-gold-solid px-4 py-2 font-semibold text-white hover:bg-gold-solid-hover">Toggle tips</button>

          <div class="mt-4 flex items-center gap-3 rounded-xl bg-stone-950 p-3 text-xs font-mono">
            <span class="text-stone-500">DOM:</span>
            <span class="rounded-lg border px-2 py-1" [class.border-gold-400]="showTips()" [class.text-gold-300]="showTips()" [class.border-stone-700]="!showTips()" [class.text-stone-600]="!showTips()" [class.opacity-40]="!showTips()">
              &lt;div&gt; tips &lt;/div&gt;
            </span>
            <span class="text-stone-600">{{ showTips() ? '— present' : '— removed' }}</span>
          </div>

          @if (showTips()) {
            <div class="mt-4 rounded-xl bg-stone-800 p-4 text-sm text-stone-300" data-testid="tips-block">&#64;if adds or removes this block from the page.</div>
          } @else {
            <div class="mt-4 rounded-xl border border-dashed border-stone-700 p-4 text-sm text-stone-500" data-testid="tips-else">&#64;else shows this instead, so you never need a second opposite check.</div>
          }
          <p class="mt-4 text-xs text-stone-500"><code>&#64;if (showTips()) &#123; ... &#125; &#64;else &#123; ... &#125;</code></p>
        </app-lesson-card>

        <app-lesson-card label="STRUCTURAL · &#64;for" heading="Repeats one template, many times" headingSize="lg">
          <p class="mt-2 text-sm text-stone-400">Angular renders the element once per array item. Write the template once, get N elements.</p>

          <div class="mt-4 flex items-center gap-2 rounded-xl bg-stone-950 p-3 text-xs font-mono">
            <span class="rounded-lg border border-gold-400/40 px-2 py-1 text-gold-300">&lt;li&gt; template</span>
            <span class="text-stone-600">×{{ tips.length }} →</span>
            @for (tip of tips; track tip) {
              <span class="h-2 w-2 rounded-full bg-gold-400"></span>
            }
          </div>

          <ul class="mt-4 space-y-2 text-sm text-stone-300">
            @for (tip of tips; track tip) {
              <li class="rounded-lg bg-stone-800 px-3 py-2">{{ tip }}</li>
            } @empty {
              <li class="rounded-lg bg-stone-800 px-3 py-2 text-stone-500">Nothing to show</li>
            }
          </ul>
          <p class="mt-4 text-xs text-stone-500"><code>&#64;for (tip of tips; track tip) &#123; ... &#125; &#64;empty &#123; ... &#125;</code></p>
        </app-lesson-card>
      </div>

      <app-lesson-card class="mt-5" label="STRUCTURAL · &#64;switch" heading="One of several, chosen by a value">
        <p class="mt-2 text-sm text-stone-400">
          When one value picks between more than two options, <code class="text-gold-300">&#64;switch</code> is clearer than a pile of <code class="text-gold-300">&#64;if</code> blocks.
          Only the matching <code class="text-gold-300">&#64;case</code> is added to the page. Pick a plan:
        </p>
        <div class="mt-3 flex flex-wrap gap-2" role="group" aria-label="Plan">
          @for (p of plans; track p) {
            <button type="button" (click)="plan.set(p)" [attr.aria-pressed]="plan() === p"
                    class="min-h-11 rounded-xl border px-4 text-sm font-semibold transition"
                    [class]="plan() === p ? 'border-gold-400 bg-gold-500/15 text-gold-200' : 'border-stone-700 text-stone-300 hover:bg-stone-800'">{{ p }}</button>
          }
        </div>
        <app-code-output class="mt-4 block" [code]="switchCode" caption="Change the plan: exactly one case is in the DOM at a time.">
          @switch (plan()) {
            @case ('free') { <p>Free: 3 lessons a week.</p> }
            @case ('pro') { <p>Pro: every lesson and every quiz.</p> }
            @default { <p>Team: Pro, plus a shared dashboard.</p> }
          }
        </app-code-output>
      </app-lesson-card>

      <app-recap class="mt-5" [items]="recapStructural" />
        </section>
      </ng-template>

      <ng-template appLessonSection="track">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card variant="danger" label="THE PROBLEM" heading="When the list changes, which row is which?">
            <p class="mt-2 text-sm text-stone-400">
              When the array changes, Angular must decide which existing rows to keep, which to throw away and which to build.
              The <code class="text-gold-300">track</code> expression is how you tell it who is who. Pick the wrong one and it either
              rebuilds rows it did not need to, or reuses a row for the wrong item, so what you typed ends up on a different film.
            </p>
          </app-lesson-card>

          <app-lesson-card class="mt-5" tone="amber" label="MENTAL MODEL" heading="Name tags at a conference">
            <p class="mt-2 text-sm text-stone-400">
              <code class="text-gold-300">track item.id</code> gives every person a name tag, so when the room is reshuffled everyone finds their own chair.
              <code class="text-gold-300">track $index</code> only says "chair number 2", so when someone leaves, whoever now sits on chair 2 inherits the previous person's belongings.
            </p>
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="highlight" label="TRY IT" heading="Type a note, then remove the first film" headingSize="lg">
            <p class="mt-2 text-sm text-stone-400">
              Type a note on <strong class="text-stone-200">Totoro</strong>, then press "Remove the first film". Do it with each button and watch where the note ends up.
              Then press "Reload" to see what happens when the same films arrive as new objects.
            </p>
            <app-track-demo />
          </app-lesson-card>

          <app-lesson-card class="mt-5" label="RULE OF THUMB" heading="Which one should I use?">
            <ul class="mt-3 list-disc space-y-2 pl-5 text-sm text-stone-300">
              <li>Items have a stable id (from a server, a database)? <code class="text-gold-300">track item.id</code>. This is the default choice.</li>
              <li>A static list of plain values that never reorders? <code class="text-gold-300">track $index</code> or <code class="text-gold-300">track item</code> is fine.</li>
              <li>Never track by something that changes while the user works, like a name they can edit.</li>
            </ul>
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="highlight" label="PREDICT" heading="Before you run it">
            <app-predict-output [challenge]="trackChallenge" />
          </app-lesson-card>
        <app-recap class="mt-5" [items]="recapTrack" />
        </section>
      </ng-template>

      <ng-template appLessonSection="attribute">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <div class="mt-8 grid gap-5 md:grid-cols-2">
        <app-lesson-card
          class="md:col-span-2"
          label="ATTRIBUTE · YOUR OWN DIRECTIVE"
          heading="appHighlight — same element, new behavior"
          tone="amber"
          headingSize="lg"
        >
          <p class="mt-2 text-sm text-stone-400">
            The directive uses <code class="text-gold-300">@HostListener</code> to listen for mouse events on the element it's applied to,
            and <code class="text-gold-300">@HostBinding</code> to update that same element's style — no new element is added or removed.
          </p>
          <app-flow-diagram class="mt-4 block" from="(mouseenter)/(mouseleave)" to="@HostBinding style" direction="right" />
          <app-code-output class="mt-4 block" [code]="highlightCode" caption="Move your mouse over the line. The directive listens to the element and changes its own style.">
            <p class="cursor-pointer rounded-xl border border-gold-400/30 p-4 text-stone-200" appHighlight>Hover me. <code>appHighlight</code> changes my background.</p>
          </app-code-output>
        </app-lesson-card>
      </div>
        <app-recap class="mt-5" [items]="recapAttribute" />
        </section>
      </ng-template>

      <ng-template appLessonSection="built-in">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <div class="mt-8 grid gap-5 md:grid-cols-2">
        <app-lesson-card label="BUILT-IN · REFERENCE" heading="Other directives you will meet" headingSize="lg">
          <p class="mt-2 text-sm text-stone-400">
            Angular ships with directives you can use without writing any code. New templates prefer <code class="text-gold-300">&#64;if</code> and
            <code class="text-gold-300">&#64;for</code>, but you will still see these in existing projects.
          </p>
          <ul class="mt-4 space-y-2 text-sm text-stone-300">
            <li><code class="text-gold-300">[ngClass]</code> — adds or removes CSS classes from an object or string.</li>
            <li><code class="text-gold-300">[ngStyle]</code> — sets inline styles from an object.</li>
            <li><code class="text-gold-300">*ngSwitchCase</code> / <code class="text-gold-300">*ngSwitchDefault</code> — render one of several templates.</li>
          </ul>
          <pre class="mt-4 overflow-x-auto rounded-xl bg-stone-950 p-4 text-xs text-gold-200">&lt;p [ngClass]="&#123; 'text-rose-400': isLate &#125;"&gt;Due today&lt;/p&gt;</pre>
        </app-lesson-card>
      </div>

      <app-common-mistake class="mt-5" title="Two opposite checks instead of one &#64;else" [wrong]="mistakeElseWrong" [right]="mistakeElseRight">
        Two separate blocks that mirror each other are easy to get out of sync. One <code class="text-gold-300">&#64;if</code> with an <code class="text-gold-300">&#64;else</code> always covers both cases.
      </app-common-mistake>

      <app-common-mistake class="mt-5" title="Forgetting to import your directive" [wrong]="mistakeImportWrong" [right]="mistakeImportRight">
        A plain attribute like <code class="text-gold-300">appHighlight</code> is silently ignored when the directive is not in the component's <code class="text-gold-300">imports</code>.
        Nothing breaks, nothing happens.
      </app-common-mistake>

      <app-recap class="mt-5" [items]="recapBuiltIn" />
        </section>
      </ng-template>

      <ng-template appLessonSection="try-it">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <div class="mt-8 grid gap-5 md:grid-cols-2">
        <app-lesson-card
          class="md:col-span-2"
          variant="highlight"
          label="ATTRIBUTE · A SECOND CUSTOM DIRECTIVE"
          heading="appNumbersOnly — stop the wrong keystroke before it lands"
          tone="amber"
          headingSize="lg"
        >
          <p class="mt-2 text-sm text-stone-400">
            Instead of validating <em>after</em> the user types a letter, this directive listens on
            <code class="text-gold-300">(keydown)</code> and calls <code class="text-gold-300">event.preventDefault()</code>
            before any non-digit character reaches the input — arrow keys, backspace and copy/paste of a valid number still work.
            It also sanitizes pasted text.
          </p>

          <div class="mt-5 grid gap-5 md:grid-cols-2">
            <div class="min-w-0">
              <label class="text-xs text-stone-400">Try typing letters or symbols, or paste "abc123" — only digits get through</label>
              <input
                aria-label="Phone number"
                type="text"
                inputmode="numeric"
                appNumbersOnly
                (blocked)="onBlocked($event)"
                [ngModel]="phoneValue()"
                (ngModelChange)="phoneValue.set($event)"
                placeholder="e.g. 0100 123 4567"
                class="mt-2 w-full rounded-xl border border-stone-700 bg-stone-900 px-4 py-2.5 text-stone-100 placeholder:text-stone-500 focus:border-gold-400 focus:outline-none"
              />
              <div class="mt-3 flex items-center justify-between text-xs">
                <span class="text-stone-500">
                  Value: <code class="text-gold-300">{{ phoneValue() || '—' }}</code>
                </span>
                <span [class.text-rose-400]="blockedCount() > 0" [class.text-stone-600]="blockedCount() === 0">
                  Blocked attempts: {{ blockedCount() }}
                </span>
              </div>
              @if (lastBlocked()) {
                <p class="mt-2 text-xs text-rose-300">✗ Blocked "{{ lastBlocked() }}" — not a digit.</p>
              }
            </div>
            <div class="min-w-0">
              <p class="text-xs text-stone-500">The directive</p>
              <pre class="mt-2 overflow-x-auto rounded-xl bg-stone-950 p-4 text-[11px] leading-relaxed text-gold-200">&#64;Directive(&#123; selector: '[appNumbersOnly]' &#125;)
export class NumbersOnlyDirective &#123;
  readonly blocked = output&lt;string&gt;();

  &#64;HostListener('keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) &#123;
    if (isNavigationKey(e) || e.ctrlKey) return;
    if (!/^[0-9]$/.test(e.key)) &#123;
      e.preventDefault();
      this.blocked.emit(e.key);
    &#125;
  &#125;
&#125;</pre>
              <p class="mt-3 text-xs text-stone-500"><code>&lt;input appNumbersOnly (blocked)="onBlocked($event)"&gt;</code></p>
            </div>
          </div>
        </app-lesson-card>
      </div>
      <app-lesson-card class="mt-5" variant="highlight" label="PUT IT IN ORDER" heading="What happens when you press a key in appNumbersOnly">
        <p class="mt-2 text-sm text-stone-400">Put these steps in the order Angular and the browser run them for one letter key.</p>
        <app-order-steps
          [steps]="keydownSteps"
          explanation="The browser fires keydown first. The directive's host listener runs and, for a non-digit, calls preventDefault() and emits blocked. Because the default action was cancelled, the character never reaches the input, so the value does not change."
        />
      </app-lesson-card>
      <app-recap class="mt-5" [items]="recapTry" />
      <app-knowledge-check [items]="checkItems" />
        </section>
      </ng-template>
    </app-lesson-player>
  `,
})
export class DirectivesComponent {
  readonly section = input<string>();
  readonly showTips = signal(true);
  tips = ['@if: show something conditionally', '@for: repeat a list', 'appHighlight: our custom behavior'];

  toggleTips(): void {
    this.showTips.update((v) => !v);
  }

  protected readonly plans = ['free', 'pro', 'team'] as const;
  protected readonly plan = signal<'free' | 'pro' | 'team'>('free');

  protected readonly switchCode = `@switch (plan()) {
  @case ('free') { <p>Free: 3 lessons a week.</p> }
  @case ('pro') { <p>Pro: every lesson and every quiz.</p> }
  @default { <p>Team: Pro, plus a shared dashboard.</p> }
}`;

  protected readonly highlightCode = `@Directive({ selector: '[appHighlight]' })
export class HighlightDirective {
  private el = inject(ElementRef);

  @HostListener('mouseenter')
  on() { this.el.nativeElement.style.backgroundColor = '#7c3aed'; }

  @HostListener('mouseleave')
  off() { this.el.nativeElement.style.backgroundColor = ''; }
}

<p appHighlight>Hover me</p>`;

  protected readonly mistakeElseWrong = `@if (loggedIn()) { <p>Welcome</p> }
@if (!loggedIn()) { <p>Please sign in</p> }`;
  protected readonly mistakeElseRight = `@if (loggedIn()) {
  <p>Welcome</p>
} @else {
  <p>Please sign in</p>
}`;
  protected readonly mistakeImportWrong = `@Component({
  template: '<p appHighlight>Hi</p>',
})`;
  protected readonly mistakeImportRight = `@Component({
  imports: [HighlightDirective],
  template: '<p appHighlight>Hi</p>',
})`;

  protected readonly recapStructural = [
    'Structural directives add or remove elements: @if, @for and @switch.',
    'A false @if takes the element out of the DOM; display:none only hides it.',
    '@for repeats a template once per item and needs a track expression.',
  ];
  protected readonly recapTrack = [
    'track tells Angular which row is which when the list changes.',
    'Prefer a stable id: track item.id.',
    'Never track by a value the user can edit.',
  ];
  protected readonly recapAttribute = [
    'An attribute directive changes an element that is already there.',
    '@HostListener listens to events on the host element.',
    'Use it to share one behavior across many elements.',
  ];
  protected readonly recapBuiltIn = [
    'ngClass and ngStyle still exist, but [class.x] and [style.x] usually suffice.',
    'Use one @if with @else instead of two opposite checks.',
    'Always list a directive in imports before using it.',
  ];
  protected readonly recapTry = [
    'A directive can stop a keystroke before it reaches the input.',
    'preventDefault() cancels the browser default; output() tells the parent.',
    'Next stop: component communication.',
  ];

  readonly trackChallenge: PredictChallenge = {
    question: 'The list is tracked by $index and you typed a note on row 2 (Totoro). You remove the first film. Where is the note now?',
    options: [
      { id: 'moved', text: 'On Totoro, which is now row 1' },
      { id: 'stayed', text: 'Still on row 2, which is now Spirited Away' },
      { id: 'gone', text: 'The note is deleted' },
    ],
    correct: 'stayed',
    explanation: 'With track $index, row 2 is "the same row" before and after. Angular reuses it and only updates its title, so the typed note stays on row 2, which now belongs to a different film. track item.id would have moved the whole row with Totoro.',
  };

  readonly keydownSteps = [
    'The user presses a letter key',
    'The browser fires keydown on the input',
    'The directive host listener runs and calls preventDefault()',
    'The character is never inserted and blocked is emitted',
  ];

  readonly phoneValue = signal('');
  readonly blockedCount = signal(0);
  readonly lastBlocked = signal('');

  onBlocked(char: string): void {
    this.blockedCount.update((count) => count + 1);
    this.lastBlocked.set(char);
  }

  readonly checkItems: KnowledgeCheckItem[] = [
    {
      question: "What's the key difference between a structural and an attribute directive?",
      answer: 'Structural directives (*ngIf, *ngFor, @if, @for) add or remove elements from the DOM; attribute directives (ngClass, appHighlight) change an existing element without adding or removing it.',
    },
    {
      question: 'Why does appNumbersOnly need to handle the paste event separately from keydown?',
      answer: "Pasting text doesn't fire one keydown event per character, so keydown alone wouldn't catch non-digit characters coming from a paste.",
    },
    {
      question: 'When should you write a custom directive instead of duplicating logic in each component?',
      answer: 'When the exact same small DOM behavior (hover highlight, input filtering) is needed on multiple, unrelated elements.',
    },
  ];
}
