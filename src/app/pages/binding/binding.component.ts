import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FlowDiagramComponent } from '../../shared/flow-diagram.component';
import { KnowledgeCheckComponent, KnowledgeCheckItem } from '../../shared/knowledge-check.component';
import { LessonCardComponent } from '../../shared/lesson-card.component';
import type { PredictChallenge } from '../../shared/predict-output.component';
import { PredictOutputComponent } from '../../shared/predict-output.component';
import { OrderStepsComponent } from '../../shared/order-steps.component';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { AttributePropertyDemoComponent } from './attribute-property-demo.component';
import { BindingDecoderDemoComponent } from './binding-decoder-demo.component';
import { LessonPlayerComponent } from '../../learn/player/lesson-player.component';
import { LessonSectionDirective } from '../../learn/player/lesson-section.directive';
import { CodeOutputComponent } from '../../shared/code-output.component';
import { CommonMistakeComponent } from '../../shared/common-mistake.component';
import { RecapComponent } from '../../shared/recap.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CodeOutputComponent, CommonMistakeComponent, RecapComponent, AttributePropertyDemoComponent, BindingDecoderDemoComponent, OrderStepsComponent, PredictOutputComponent,
    FormsModule,
    FlowDiagramComponent,
    PageHeaderComponent,
    LessonCardComponent,
    LessonPlayerComponent,
    LessonSectionDirective,
    KnowledgeCheckComponent,
  ],
  template: `
    <app-lesson-player [topicId]="'binding'" [section]="section()">

      <!-- ── Section 0 · Overview ── -->
      <ng-template appLessonSection="overview">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-page-header title="Data Binding" illustration="binding">
            Binding is how a component's TypeScript class and its HTML template stay in sync, without you writing
            <code class="text-gold-300">document.querySelector</code> or manual DOM updates. There are four kinds — interpolation, property
            binding, event binding, and two-way binding — each with a different direction of data flow, shown in the diagram on every card
            below. Edit this component file, save it, and watch the results update in the browser.
          </app-page-header>

          <app-lesson-card class="mt-10" label="1 · THE PROBLEM" heading="Keeping the screen and the data in step">
            <p class="mt-2 text-sm text-stone-400">
              Your component holds data: a title, a count, whether a button is available. The page has to show it, and has to tell the component when the user does something. Doing that by hand
              means finding elements, copying values in, and copying them back out, every single time anything changes. Binding is Angular doing that for you.
            </p>
          </app-lesson-card>

          <app-lesson-card class="mt-5" label="2 · THE MENTAL MODEL" heading="A TV and its remote" tone="amber">
            <ul class="mt-3 list-disc space-y-2 pl-5 text-sm text-stone-300">
              <li><strong class="text-stone-100">The screen</strong> shows whatever the component knows. That is interpolation and property binding: data flows <strong class="text-stone-100">down</strong>, from the class to the template.</li>
              <li><strong class="text-stone-100">The remote</strong> tells the component what the user did. That is event binding: events flow <strong class="text-stone-100">up</strong>, from the template to the class.</li>
              <li><strong class="text-stone-100">A shared whiteboard</strong> is two-way binding: either side can write on it, and both always see the same thing.</li>
            </ul>
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="highlight" label="3 · TRY IT" heading="Read the four kinds of binding">
            <p class="mt-2 text-sm text-stone-400">Press each syntax and watch which way the arrow points.</p>
            <app-binding-decoder-demo />
          </app-lesson-card>
          <app-recap class="mt-5" [items]="recap0" />
        </section>
      </ng-template>

      <!-- ── Section 1 · Interpolation ── -->
      <ng-template appLessonSection="interpolation">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">

          <!-- 01 · INTERPOLATION -->
          <div class="mt-10 grid gap-5 md:grid-cols-2">
            <app-lesson-card label="01 · INTERPOLATION" heading="Show a title">
              <p class="mt-2 text-sm text-stone-400">
                The simplest binding: drop a class property into text with double curly braces. Angular re-renders it
                automatically every time the property changes — no manual DOM update needed.
              </p>
              <app-flow-diagram class="mt-4 block" from="practiceTitle" to="{{ '{{ practiceTitle }}' }}" direction="right" />
              <p class="mt-2 text-xs text-stone-400">
                Change <code class="text-gold-300">practiceTitle</code> below to your favorite movie or series.
              </p>
              <div class="mt-5 rounded-xl bg-stone-800 p-4">
                <span class="text-stone-400">Your pick:</span>
                <strong>{{ practiceTitle }}</strong>
              </div>
              <p class="mt-4 text-xs text-stone-500">Hint: {{ '{{ practiceTitle }}' }}</p>
            </app-lesson-card>
          </div>

      <app-lesson-card class="mt-5" label="WHAT GOES INSIDE" heading="Any expression, never a statement">
        <p class="mt-2 text-sm text-stone-400">
          Between the braces you can write anything that <em>produces a value</em>: a property, a calculation, a method call, a condition.
          You cannot write statements such as <code class="text-gold-300">let x = 1</code> or an <code class="text-gold-300">if</code> block.
        </p>
        <app-code-output class="mt-4 block" [code]="expressionCode" caption="Each line is an expression. Angular works out its value and prints it.">
          <p>{{ movie.title }}</p>
          <p>{{ movie.title.toUpperCase() }}</p>
          <p>{{ movie.rating * 10 }}%</p>
          <p>{{ movie.year >= 1990 ? 'Modern' : 'Classic' }}</p>
        </app-code-output>
      </app-lesson-card>

      <app-lesson-card class="mt-5" variant="highlight" label="PREDICT THE OUTPUT" heading="Read the template, then guess what it shows">
        <app-predict-output [challenge]="interpolationChallenge" />
      </app-lesson-card>
          <app-recap class="mt-5" [items]="recap1" />
        </section>
      </ng-template>

      <!-- ── Section 2 · Property binding ── -->
      <ng-template appLessonSection="property-binding">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <div class="grid gap-5 md:grid-cols-2">
            <!-- 02 · PROPERTY BINDING -->
            <app-lesson-card label="02 · PROPERTY BINDING" heading="Control a button">
              <p class="mt-2 text-sm text-stone-400">
                Square brackets bind a class property to an actual DOM property (not an HTML attribute), so booleans,
                objects and arrays pass through as real JavaScript values instead of strings.
              </p>
              <app-flow-diagram class="mt-4 block" from="isNotAvailable" to="[disabled]" direction="right" />
              <p class="mt-2 text-xs text-stone-400">Toggle availability, then inspect the bound button property.</p>
              <div class="mt-5 flex items-center gap-3">
                <button
                  [disabled]="isNotAvailable"
                  class="rounded-xl bg-gold-solid px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:bg-stone-700"
                >
                  Play episode
                </button>
                <button
                  type="button"
                  (click)="isNotAvailable = !isNotAvailable"
                  class="rounded-xl border border-stone-700 px-3 py-2 text-xs font-semibold text-stone-300 hover:bg-stone-800"
                >
                  Toggle isNotAvailable
                </button>
              </div>
              <p class="mt-4 text-xs text-stone-500">
                Hint: <code class="text-gold-300">[disabled]</code>
              </p>
            </app-lesson-card>
          </div>

          <app-lesson-card class="mt-5" label="MORE THAN PROPERTIES" heading="Bind a class, a style or an attribute">
            <p class="mt-2 text-sm text-stone-400">
              The same square brackets can switch one CSS class on or off, set one style, or set an HTML attribute that has no property
              (such as <code class="text-gold-300">aria-label</code>, which uses the <code class="text-gold-300">attr.</code> prefix).
            </p>
            <app-code-output class="mt-4 block" [code]="styleCode" caption="Move the slider: the bar width and the message follow it.">
              <div class="h-3 overflow-hidden rounded-full bg-stone-800"><div class="h-full rounded-full bg-gold-400" [style.width.%]="progress"></div></div>
              <p class="mt-3 text-sm" [class.text-gold-300]="progress >= 70" [class.text-stone-400]="progress < 70">
                {{ progress >= 70 ? 'Almost done' : 'Keep going' }} ({{ progress }}%)
              </p>
              <input type="range" min="0" max="100" [value]="progress" (input)="setProgress($event)" aria-label="Progress" class="mt-3 w-full accent-[rgb(var(--gold-400))]" />
            </app-code-output>
          </app-lesson-card>

          <app-lesson-card class="mt-5" label="WHY PROPERTY, NOT ATTRIBUTE" heading="The attribute is the start, the property is the live value">
            <p class="mt-2 text-sm text-stone-400">
              In HTML, <code class="text-gold-300">value="Castle in the Sky"</code> is an <strong class="text-stone-200">attribute</strong>: the starting value written in the markup.
              The element also has a <strong class="text-stone-200">property</strong>, <code class="text-gold-300">input.value</code>, which changes as the user types. Property binding sets the live one.
            </p>
            <app-attribute-property-demo />
          </app-lesson-card>
          <app-recap class="mt-5" [items]="recap2" />
        </section>
      </ng-template>

      <!-- ── Section 3 · Event binding ── -->
      <ng-template appLessonSection="event-binding">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <div class="grid gap-5 md:grid-cols-2">
            <!-- 03 · EVENT BINDING -->
            <app-lesson-card label="03 · EVENT BINDING" heading="Rate a title">
              <p class="mt-2 text-sm text-stone-400">
                Parentheses bind a DOM event to a class method. Data now flows the other way — from the template back
                into the class — every time the user interacts with the page.
              </p>
              <app-flow-diagram class="mt-4 block" from="(click)" to="giveRating()" direction="right" />
              <p class="mt-2 text-xs text-stone-400">
                Click the button, then change the points added in <code class="text-gold-300">giveRating()</code>.
              </p>
              <div class="mt-5 flex items-center gap-4">
                <button (click)="giveRating()" class="rounded-xl bg-gold-solid px-4 py-2 font-semibold text-white">
                  Give a star ★
                </button>
                <strong>{{ stars }} stars</strong>
              </div>
              <p class="mt-4 text-xs text-stone-500">
                Hint: <code class="text-gold-300">(click)</code>
              </p>
            </app-lesson-card>
          </div>

          <app-lesson-card class="mt-5" label="THE EVENT OBJECT" heading="$event carries the details">
            <p class="mt-2 text-sm text-stone-400">
              Inside an event binding, <code class="text-gold-300">$event</code> is what the browser sent: for a click, the mouse details; for typing, the input element.
              You can also bind to one specific key.
            </p>
            <app-code-output class="mt-4 block" [code]="eventCode" caption="Type something, then press Enter. Two different events feed two different methods.">
              <input aria-label="Type, then press Enter" (input)="onType($event)" (keyup.enter)="submit()" placeholder="Type here…"
                     class="w-full rounded-xl border border-stone-600 bg-stone-800 px-3 py-2 text-stone-100 focus:border-gold-400 focus:outline-none" />
              <p class="mt-3 text-sm text-stone-400">Typing: <strong class="text-stone-100">{{ typed || '—' }}</strong></p>
              <p class="mt-1 text-sm text-stone-400">Submitted: <strong class="text-stone-100">{{ submitted || '—' }}</strong></p>
            </app-code-output>
          </app-lesson-card>
          <app-recap class="mt-5" [items]="recap3" />
        </section>
      </ng-template>

      <!-- ── Section 4 · Two-way binding ── -->
      <ng-template appLessonSection="two-way">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <div class="grid gap-5 md:grid-cols-2">
            <!-- 04 · TWO-WAY BINDING -->
            <app-lesson-card label="04 · TWO-WAY BINDING" heading="Write a review">
              <p class="mt-2 text-sm text-stone-400">
                Banana-in-a-box syntax combines property and event binding into one: the input shows the class value,
                and every keystroke writes straight back into it — both directions, at once.
              </p>
              <app-flow-diagram class="mt-4 block" from="[(ngModel)]" to="review" direction="both" />
              <p class="mt-2 text-xs text-stone-400">Type a review and see it update without pressing a button.</p>
              <input
                aria-label="Your review"
                [(ngModel)]="review"
                class="mt-5 w-full rounded-xl border border-stone-600 bg-stone-800 px-3 py-2.5 text-stone-100 focus:border-gold-400 focus:outline-none"
                placeholder="This title is..."
              />
              <p class="mt-4 rounded-xl bg-stone-800 p-4 text-stone-200">
                {{ review || 'Your live review will appear here.' }}
              </p>
              <p class="mt-4 text-xs text-stone-500">
                Hint: <code class="text-gold-300">[(ngModel)]</code>
              </p>
            </app-lesson-card>
          </div>

          <app-lesson-card class="mt-5" label="UNDER THE HOOD" heading="Two-way binding is two bindings in one">
            <p class="mt-2 text-sm text-stone-400">
              <code class="text-gold-300">[(ngModel)]</code> is a shortcut. Written out, it is a property binding that shows the value, plus an event binding that writes changes back.
              Both fields below behave the same.
            </p>
            <app-code-output class="mt-4 block" [code]="twoWayCode" caption="The long form does exactly what the banana-in-a-box does.">
              <input aria-label="Long form" [ngModel]="longForm" (ngModelChange)="longForm = $event"
                     class="w-full rounded-xl border border-stone-600 bg-stone-800 px-3 py-2 text-stone-100 focus:border-gold-400 focus:outline-none" />
              <p class="mt-3 text-sm text-stone-400">The class holds: <strong class="text-stone-100">{{ longForm || '—' }}</strong></p>
            </app-code-output>
          </app-lesson-card>

          <div class="mt-8 rounded-2xl border border-gold-400/20 bg-gold-950/30 p-6">
            <h2 class="font-bold text-gold-200">Final challenge</h2>
            <p class="mt-2 text-sm text-stone-300">
              Add a reset button that sets the title to an empty string, stars to 0, and review to an empty string.
              Use event binding and confirm all live UI values reset.
            </p>
          </div>
          <app-recap class="mt-5" [items]="recap4" />
        </section>
      </ng-template>

          <!-- ── Section 5 · Practice ── -->
      <ng-template appLessonSection="practice">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card class="mt-10" variant="highlight" label="CHOOSE" heading="Which binding does this job?">
            <app-predict-output [challenge]="showChallenge" />
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="highlight" label="CHOOSE AGAIN" heading="And this one?">
            <app-predict-output [challenge]="reactChallenge" />
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="highlight" label="PUT IT IN ORDER" heading="What happens when you type in a two-way bound field?">
            <app-order-steps
              [steps]="typingSteps"
              explanation="The event goes up into the class, then the new value goes back down into the page. Two-way binding is just those two trips wired together."
            />
          </app-lesson-card>

      <app-common-mistake class="mt-5" title="Using interpolation for a boolean" [wrong]="mistakeBoolWrong" [right]="mistakeBoolRight">
        Interpolation always makes text. The text "false" is still a non-empty value, so the attribute is present and the button stays disabled.
        Square brackets pass the real boolean.
      </app-common-mistake>

      <app-common-mistake class="mt-5" title="Running heavy work inside the braces" [wrong]="mistakeCostWrong" [right]="mistakeCostRight">
        A method in a template runs on every change-detection pass, even when nothing it uses has changed. Compute the value once with
        <code class="text-gold-300">computed()</code>, and the template just reads it.
      </app-common-mistake>

      <app-lesson-card class="mt-5" label="TWO MORE TO WATCH FOR" heading="Syntax slips that stop the page compiling">
        <ul class="mt-3 list-disc space-y-2 pl-5 text-sm text-stone-300">
          <li><strong class="text-stone-100">Banana-in-a-box backwards.</strong> It is <code class="text-gold-300">[(ngModel)]</code>: square brackets outside, round inside.</li>
          <li><strong class="text-stone-100">Forgetting FormsModule.</strong> Without it in the component's <code class="text-gold-300">imports</code>, Angular says it can't bind to <code class="text-gold-300">ngModel</code>.</li>
        </ul>
      </app-lesson-card>

          <app-knowledge-check [items]="recapItems" />
        </section>
      </ng-template>
    </app-lesson-player>
  `,
})
export class BindingComponent {
  /** Set by the router from the :section URL param (withComponentInputBinding). */
  readonly section = input<string>();

  readonly interpolationChallenge: PredictChallenge = {
    question: 'What does this template show on the page?',
    code: "<p>{{ '2' + 3 }}</p>\n<p>{{ 2 + 3 }}</p>",
    options: [
      { id: 'b', text: '5 and 5' },
      { id: 'd', text: 'An error, because you cannot mix text and numbers' },
      { id: 'a', text: '23 and 5' },
      { id: 'c', text: '23 and 23' },
    ],
    correct: 'a',
    explanation: "Template expressions follow JavaScript rules. '2' + 3 joins text, so it shows 23. 2 + 3 adds numbers, so it shows 5.",
  };

  protected readonly eventCode = `<input (input)="onType($event)" />
<input (keyup.enter)="submit()" />

onType(event: Event) {
  this.typed = (event.target as HTMLInputElement).value;
}
submit() { this.submitted = this.typed; }`;

  protected readonly recap0 = ['Binding keeps the class and the page in sync for you.', 'Data flows down (class to page) and events flow up (page to class).', 'Two-way binding is both at once.'];
  protected readonly recap1 = ['{{ }} turns any expression into text.', 'Expressions produce a value; statements like let or if are not allowed.', 'Angular updates the text whenever the property changes.'];
  protected readonly recap2 = ['[ ] sets a real DOM property, so booleans and objects pass through as they are.', '[class.x], [style.x] and [attr.x] cover classes, styles and attributes.', 'The attribute is the starting value, the property is the live one.'];
  protected readonly recap3 = ['( ) listens for an event and runs a method.', '$event holds what the browser sent.', 'keyup.enter and similar filters react to one key only.'];
  protected readonly recap4 = ['[(ngModel)] is [ngModel] plus (ngModelChange).', "It needs FormsModule in the component's imports.", 'Use it for form fields; use input() and output() between components.'];

  protected readonly movie = { title: 'Castle in the Sky', year: 1986, rating: 8 };
  protected readonly expressionCode = `<p>{{ movie.title }}</p>
<p>{{ movie.title.toUpperCase() }}</p>
<p>{{ movie.rating * 10 }}%</p>
<p>{{ movie.year >= 1990 ? 'Modern' : 'Classic' }}</p>`;

  protected progress = 40;
  protected readonly styleCode = `<div [style.width.%]="progress"></div>
<p [class.text-gold]="progress >= 70">...</p>
<button [attr.aria-label]="label">Play</button>`;

  protected typed = '';
  protected submitted = '';
  protected longForm = '';
  protected readonly twoWayCode = `<!-- the shortcut -->
<input [(ngModel)]="review" />

<!-- the same thing, written out -->
<input [ngModel]="review" (ngModelChange)="review = $event" />`;

  protected readonly mistakeBoolWrong = '<button disabled="{{ isLoading }}">Save</button>';
  protected readonly mistakeBoolRight = '<button [disabled]="isLoading">Save</button>';
  protected readonly mistakeCostWrong = `<p>{{ expensiveTotal() }}</p>
<!-- runs on every check -->`;
  protected readonly mistakeCostRight = `total = computed(() => this.price() * this.qty());

<p>{{ total() }}</p>`;

  protected setProgress(event: Event): void {
    this.progress = Number((event.target as HTMLInputElement).value);
  }

  protected onType(event: Event): void {
    this.typed = (event.target as HTMLInputElement).value;
  }

  protected submit(): void {
    this.submitted = this.typed;
  }


  protected readonly showChallenge: PredictChallenge = {
    question: "A page must show the user's name inside a heading. Which binding fits?",
    options: [
      { id: 'event', text: '(click)="..."' },
      { id: 'two-way', text: '[(ngModel)]="name"' },
      { id: 'interp', text: '{{ name }}' },
      { id: 'prop', text: '[disabled]="name"' },
    ],
    correct: 'interp',
    explanation: 'Showing a value as text is exactly what interpolation is for. Data goes down from the class to the template, and nothing needs to come back.',
  };

  protected readonly reactChallenge: PredictChallenge = {
    question: 'A "Save" button must run a method when it is pressed. Which binding fits?',
    options: [
      { id: 'interp', text: '{{ save() }}' },
      { id: 'prop', text: '[click]="save()"' },
      { id: 'two-way', text: '[(ngModel)]="save"' },
      { id: 'event', text: '(click)="save()"' },
    ],
    correct: 'event',
    explanation: 'Reacting to the user is event binding. Parentheses mean "listen for this event", and the method runs when it fires.',
  };

  protected readonly typingSteps = [
    'The user types a character in the field',
    'The browser fires an input event',
    'ngModel writes the new text into the class property',
    'Angular checks the template again',
    'The paragraph below the field shows the new text',
  ];

  // Student task: replace this starter value with a title you enjoy.
  practiceTitle = 'The Last Horizon';
  isNotAvailable = true;
  stars = 0;
  review = '';

  giveRating(): void {
    // Student task: change the number and test the button again.
    this.stars += 1;
  }

  readonly recapItems: KnowledgeCheckItem[] = [
    {
      question: 'If data flows from the component out to the template, which binding do you use?',
      answer: 'Interpolation {{ }} or property binding [ ] — both display a value, they just target different places (text vs. an element property).',
    },
    {
      question: "What's different about [(ngModel)] compared to [ ] and ( ) used separately?",
      answer: "It's both combined — it reads the value in and writes user changes back, keeping the component and the input in sync automatically.",
    },
    {
      question: 'Why use [src] instead of src="{{ imageUrl }}"?',
      answer: '[src] reads imageUrl as an actual JavaScript value (property binding) — the idiomatic, safer way to bind non-text values like images or booleans.',
    },
  ];
}
