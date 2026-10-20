import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FlowDiagramComponent } from '../../shared/flow-diagram.component';
import { KnowledgeCheckComponent, KnowledgeCheckItem } from '../../shared/knowledge-check.component';
import { LessonCardComponent } from '../../shared/lesson-card.component';
import type { PredictChallenge } from '../../shared/predict-output.component';
import { PredictOutputComponent } from '../../shared/predict-output.component';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { TopicNavComponent } from '../../shared/topic-nav.component';
import { LessonPlayerComponent } from '../../learn/player/lesson-player.component';
import { LessonSectionDirective } from '../../learn/player/lesson-section.directive';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PredictOutputComponent, 
    FormsModule,
    FlowDiagramComponent,
    TopicNavComponent,
    PageHeaderComponent,
    LessonCardComponent,
    LessonPlayerComponent,
    LessonSectionDirective,
    KnowledgeCheckComponent,
  ],
  template: `
    <app-lesson-player [topicId]="'binding'" [section]="section()">

      <!-- ── Section 1 · Interpolation ── -->
      <ng-template appLessonSection="interpolation">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-page-header title="Data Binding" illustration="binding">
            Binding is how a component's TypeScript class and its HTML template stay in sync, without you writing
            <code class="text-gold-300">document.querySelector</code> or manual DOM updates. There are four kinds — interpolation, property
            binding, event binding, and two-way binding — each with a different direction of data flow, shown in the diagram on every card
            below. Edit this component file, save it, and watch the results update in the browser.
          </app-page-header>

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

      <app-lesson-card class="mt-5" variant="highlight" label="PREDICT THE OUTPUT" heading="Read the template, then guess what it shows">
        <app-predict-output [challenge]="interpolationChallenge" />
      </app-lesson-card>
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
                  class="rounded-xl bg-gold-500 px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:bg-stone-700"
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
                <button (click)="giveRating()" class="rounded-xl bg-gold-500 px-4 py-2 font-semibold text-white">
                  Give a star ★
                </button>
                <strong>{{ stars }} stars</strong>
              </div>
              <p class="mt-4 text-xs text-stone-500">
                Hint: <code class="text-gold-300">(click)</code>
              </p>
            </app-lesson-card>
          </div>
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

          <div class="mt-8 rounded-2xl border border-gold-400/20 bg-gold-950/30 p-6">
            <h2 class="font-bold text-gold-200">Final challenge</h2>
            <p class="mt-2 text-sm text-stone-300">
              Add a reset button that sets the title to an empty string, stars to 0, and review to an empty string.
              Use event binding and confirm all live UI values reset.
            </p>
          </div>

          <app-knowledge-check [items]="recapItems" />
          <app-topic-nav />

      <app-lesson-card class="mt-5" variant="danger" label="COMMON MISTAKES" heading="Four things that trip up every beginner">
        <ul class="mt-3 list-disc space-y-2 pl-5 text-sm text-stone-300">
          <li><strong class="text-stone-100">Using interpolation for a boolean property.</strong> <code ngNonBindable class="text-gold-300">disabled="{{ isLoading }}"</code> sets the text "false", which still disables the button. Write <code class="text-gold-300">[disabled]="isLoading"</code>.</li>
          <li><strong class="text-stone-100">Getting the banana-in-a-box backwards.</strong> It is <code class="text-gold-300">[(ngModel)]</code> — square brackets on the outside, round on the inside.</li>
          <li><strong class="text-stone-100">Forgetting FormsModule.</strong> Without it in the component's <code class="text-gold-300">imports</code>, Angular says it can't bind to <code class="text-gold-300">ngModel</code>.</li>
          <li><strong class="text-stone-100">Calling a heavy method inside interpolation.</strong> It runs on every change-detection pass. Compute it once with <code class="text-gold-300">computed()</code> or a pipe.</li>
        </ul>
      </app-lesson-card>
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
