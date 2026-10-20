import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';

import { LessonPlayerComponent } from '../../learn/player/lesson-player.component';
import { LessonSectionDirective } from '../../learn/player/lesson-section.directive';
import { CodeBlockDirective } from '../../shared/code-block.directive';
import { KnowledgeCheckComponent, KnowledgeCheckItem } from '../../shared/knowledge-check.component';
import { LessonCardComponent } from '../../shared/lesson-card.component';
import { OrderStepsComponent } from '../../shared/order-steps.component';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { PredictOutputComponent } from '../../shared/predict-output.component';
import type { PredictChallenge } from '../../shared/predict-output.component';
import { DeferHeavyWidgetComponent } from './defer-heavy-widget.component';
import { DeferStatsService } from './defer-stats.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    DeferHeavyWidgetComponent,
    CodeBlockDirective,
    KnowledgeCheckComponent,
    LessonCardComponent,
    LessonPlayerComponent,
    LessonSectionDirective,
    OrderStepsComponent,
    PageHeaderComponent,
    PredictOutputComponent,
  ],
  template: `
    <app-lesson-player [topicId]="'defer'" [section]="section()">
      <ng-template appLessonSection="basics">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-page-header title="@defer Blocks">
            Some parts of a page are heavy and not needed straight away: a chart far down the page, an editor behind a button, a comments
            section. <code class="text-gold-300">&#64;defer</code> tells Angular to leave that part out of the first download and fetch it later.
            Your template stays one piece of HTML; Angular does the splitting.
          </app-page-header>

          <app-lesson-card class="mt-10" label="1 · THE IDEA" heading="Wrap the heavy part in @defer">
            <p class="mt-2 text-sm text-stone-400">
              The content inside <code class="text-gold-300">&#64;defer</code> is downloaded only when its <strong class="text-stone-200">trigger</strong> fires.
              Until then you show a <code class="text-gold-300">&#64;placeholder</code>. While it downloads you can show <code class="text-gold-300">&#64;loading</code>,
              and if the download fails, <code class="text-gold-300">&#64;error</code>.
            </p>
            <pre class="mt-4 overflow-x-auto rounded-xl bg-stone-950 p-4 text-xs text-gold-200">{{ basicsCode }}</pre>
          </app-lesson-card>

          <app-lesson-card class="mt-5" label="2 · THE FOUR BLOCKS" heading="What each block is for">
            <div class="mt-3 grid gap-3 sm:grid-cols-2">
              <div class="rounded-xl bg-stone-950 p-4">
                <p class="font-mono text-sm font-bold text-gold-300">&#64;defer</p>
                <p class="mt-1 text-sm text-stone-300">The real content. Its components, directives and pipes are fetched when the trigger fires.</p>
              </div>
              <div class="rounded-xl bg-stone-950 p-4">
                <p class="font-mono text-sm font-bold text-gold-300">&#64;placeholder</p>
                <p class="mt-1 text-sm text-stone-300">Shown before the trigger. It ships with the page, so keep it small and give it the same size as the real content.</p>
              </div>
              <div class="rounded-xl bg-stone-950 p-4">
                <p class="font-mono text-sm font-bold text-gold-300">&#64;loading</p>
                <p class="mt-1 text-sm text-stone-300">Shown while the download runs. <code class="text-gold-300">after 100ms; minimum 1s</code> stops a spinner from flashing for a blink.</p>
              </div>
              <div class="rounded-xl bg-stone-950 p-4">
                <p class="font-mono text-sm font-bold text-gold-300">&#64;error</p>
                <p class="mt-1 text-sm text-stone-300">Shown if the download fails, for example when the connection drops.</p>
              </div>
            </div>
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="highlight" label="3 · TRY IT" heading="Load it on demand with a condition">
            <p class="mt-2 text-sm text-stone-400">
              This block uses <code class="text-gold-300">&#64;defer (when loadIt())</code>. Nothing is created until you press the button.
              The counter shows how many times the widget has really been created.
            </p>
            <div class="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                data-testid="defer-load"
                (click)="loadIt.set(true)"
                class="min-h-11 rounded-xl bg-gold-solid px-4 text-sm font-semibold text-white transition hover:bg-gold-solid-hover"
              >
                Load the widget
              </button>
              <p class="text-sm text-stone-300">Widgets created so far: <strong class="text-gold-300" data-testid="defer-count">{{ stats.created() }}</strong></p>
            </div>
            <div class="mt-4">
              @defer (when loadIt()) {
                <app-defer-heavy-widget />
              } @placeholder {
                <div class="rounded-xl border border-dashed border-stone-700 p-4 text-sm text-stone-500" data-testid="defer-placeholder">Placeholder: the widget is not loaded yet.</div>
              } @loading (minimum 500ms) {
                <div class="rounded-xl border border-gold-500/40 p-4 text-sm text-gold-300">Loading…</div>
              }
            </div>
            <p class="mt-3 text-xs text-stone-500">A deferred block loads once. Leave this section and come back to try it again.</p>
          </app-lesson-card>
        </section>
      </ng-template>

      <ng-template appLessonSection="triggers">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card class="mt-10" label="TRIGGERS" heading="When should the download start?">
            <p class="mt-2 text-sm text-stone-400">Put the trigger in brackets after <code class="text-gold-300">&#64;defer</code>. Without one, Angular waits for the browser to be idle.</p>
            <div class="mt-4 overflow-x-auto rounded-xl border border-stone-800">
              <table class="w-full text-left text-sm">
                <thead class="bg-stone-800 text-stone-300">
                  <tr><th class="px-4 py-2 font-semibold">Trigger</th><th class="px-4 py-2 font-semibold">Loads when</th></tr>
                </thead>
                <tbody class="divide-y divide-stone-800 text-stone-400">
                  @for (row of triggers; track row.trigger) {
                    <tr>
                      <td class="whitespace-nowrap px-4 py-2 font-mono text-gold-300">{{ row.trigger }}</td>
                      <td class="px-4 py-2">{{ row.when }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
            <pre class="mt-4 overflow-x-auto rounded-xl bg-stone-950 p-4 text-xs text-gold-200">{{ triggersCode }}</pre>
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="highlight" label="TRY IT · on interaction" heading="Loads when the placeholder is clicked">
            <p class="mt-2 text-sm text-stone-400">The placeholder is a single button, so Angular uses it as the trigger.</p>
            <div class="mt-4">
              @defer (on interaction) {
                <app-defer-heavy-widget />
              } @placeholder {
                <button type="button" data-testid="defer-interaction" class="min-h-11 rounded-xl border border-stone-600 px-4 text-sm font-semibold text-stone-100 hover:bg-stone-800">Click to load the widget</button>
              } @loading (minimum 500ms) {
                <div class="rounded-xl border border-gold-500/40 p-4 text-sm text-gold-300">Loading…</div>
              }
            </div>
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="highlight" label="TRY IT · on timer" heading="Loads on its own after a few seconds">
            <p class="mt-2 text-sm text-stone-400">This one uses <code class="text-gold-300">on timer(4s)</code>. Wait and watch the placeholder turn into the widget.</p>
            <div class="mt-4">
              @defer (on timer(4s)) {
                <app-defer-heavy-widget />
              } @placeholder {
                <div class="rounded-xl border border-dashed border-stone-700 p-4 text-sm text-stone-500">Placeholder: arriving in about 4 seconds…</div>
              } @loading (minimum 500ms) {
                <div class="rounded-xl border border-gold-500/40 p-4 text-sm text-gold-300">Loading…</div>
              }
            </div>
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="highlight" label="TRY IT · on viewport" heading="Loads when it scrolls into view">
            <p class="mt-2 text-sm text-stone-400">The box below is the placeholder. Scroll until it is on screen and the widget replaces it.</p>
            <div class="h-40" aria-hidden="true"></div>
            @defer (on viewport) {
              <app-defer-heavy-widget />
            } @placeholder {
              <div class="grid h-24 place-items-center rounded-xl border border-dashed border-stone-700 text-sm text-stone-500">Placeholder: scroll me into view</div>
            } @loading (minimum 500ms) {
              <div class="rounded-xl border border-gold-500/40 p-4 text-sm text-gold-300">Loading…</div>
            }
          </app-lesson-card>
        </section>
      </ng-template>

      <ng-template appLessonSection="prefetch">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card class="mt-10" label="PREFETCH" heading="Download early, show later">
            <p class="mt-2 text-sm text-stone-400">
              <code class="text-gold-300">prefetch</code> takes the same triggers, but only downloads the code. The content still appears at the main trigger.
              That makes the click feel instant: start the download on hover, show the content on click.
            </p>
            <pre class="mt-4 overflow-x-auto rounded-xl bg-stone-950 p-4 text-xs text-gold-200">{{ prefetchCode }}</pre>
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="danger" label="PITFALLS" heading="When @defer hurts instead of helps">
            <ul class="mt-3 list-disc space-y-2 pl-5 text-sm text-stone-300">
              <li><strong class="text-stone-100">Deferring what people see first.</strong> Content at the top of the page should be in the first download. Deferring it makes the main content arrive later, not sooner.</li>
              <li><strong class="text-stone-100">A placeholder of the wrong size.</strong> If the real content is taller, the page jumps when it arrives. Give the placeholder the same height.</li>
              <li><strong class="text-stone-100">Using the component somewhere else in the same file.</strong> A component used inside and outside <code class="text-gold-300">&#64;defer</code>, or read with <code class="text-gold-300">viewChild</code>, is bundled eagerly again.</li>
              <li><strong class="text-stone-100">Deferring non-standalone code.</strong> Only standalone components, directives and pipes can be deferred.</li>
            </ul>
          </app-lesson-card>

          <app-lesson-card class="mt-5" label="@defer vs. lazy-loaded routes" heading="Which one do I use?">
            <p class="mt-2 text-sm text-stone-400">
              Lazy loading splits by <strong class="text-stone-200">page</strong>: the route's code arrives when someone navigates. <code class="text-gold-300">&#64;defer</code> splits by
              <strong class="text-stone-200">piece of a page</strong>: a section arrives when a trigger fires. Use both: routes for pages, <code class="text-gold-300">&#64;defer</code> for heavy parts inside them.
            </p>
          </app-lesson-card>
        </section>
      </ng-template>

      <ng-template appLessonSection="try-it">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card class="mt-10" variant="highlight" label="PREDICT" heading="Pick the right trigger">
            <app-predict-output [challenge]="triggerChallenge" />
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="highlight" label="PUT IT IN ORDER" heading="The life of a deferred block">
            <p class="mt-2 text-sm text-stone-400">Put these five steps in the order they happen on a page with an <code class="text-gold-300">on viewport</code> block.</p>
            <app-order-steps
              [steps]="lifeSteps"
              explanation="The placeholder ships with the page. When the trigger fires Angular shows the loading block, downloads the chunk, and swaps in the real content."
            />
          </app-lesson-card>

          <app-knowledge-check [items]="checkItems" />
        </section>
      </ng-template>
    </app-lesson-player>
  `,
})
export class DeferComponent {
  readonly section = input<string>();
  protected readonly stats = inject(DeferStatsService);
  protected readonly loadIt = signal(false);

  protected readonly triggers = [
    { trigger: 'on idle', when: 'The browser has nothing else to do. This is the default.' },
    { trigger: 'on immediate', when: 'As soon as the page renders. Still a separate chunk, just not blocking.' },
    { trigger: 'on timer(5s)', when: 'After a fixed time, for example 5 seconds.' },
    { trigger: 'on viewport', when: 'The placeholder scrolls into view.' },
    { trigger: 'on interaction', when: 'The user clicks or presses a key on the placeholder.' },
    { trigger: 'on hover', when: 'The pointer or keyboard focus lands on the placeholder.' },
    { trigger: 'when condition', when: 'An expression, such as user().isPremium, becomes true. It fires once.' },
  ];

  protected readonly basicsCode = `@defer {
  <app-heavy-chart />
} @placeholder {
  <p>The chart will appear here.</p>
} @loading (after 100ms; minimum 1s) {
  <p>Loading the chart…</p>
} @error {
  <p>Sorry, the chart could not be loaded.</p>
}`;

  protected readonly triggersCode = `@defer (on viewport) { <app-comments /> } @placeholder { <div class="h-40">Comments</div> }

@defer (on interaction) { <app-editor /> } @placeholder { <button>Open the editor</button> }

@defer (on timer(5s)) { <app-promo /> }

@defer (when user().isPremium) { <app-premium-tools /> }`;

  protected readonly prefetchCode = `@defer (on interaction; prefetch on hover) {
  <app-checkout />
} @placeholder {
  <button>Checkout</button>
}`;

  protected readonly triggerChallenge: PredictChallenge = {
    question: 'Which trigger loads the comments only once the reader scrolls down to them?',
    code: '@defer (___) {\n  <app-comments />\n} @placeholder {\n  <div class="h-40">Comments</div>\n}',
    options: [
      { id: 'idle', text: 'on idle' },
      { id: 'timer', text: 'on timer(5s)' },
      { id: 'viewport', text: 'on viewport' },
      { id: 'immediate', text: 'on immediate' },
    ],
    correct: 'viewport',
    explanation: 'on viewport watches the placeholder and starts loading when it scrolls into view. The others load whether or not the reader ever gets there.',
  };

  protected readonly lifeSteps = [
    'The page renders the @placeholder',
    'The trigger fires, for example the placeholder scrolls into view',
    'Angular shows the @loading block while the code downloads',
    'The downloaded code arrives',
    'The real @defer content replaces the loading block',
  ];

  protected readonly checkItems: KnowledgeCheckItem[] = [
    {
      question: 'What is the difference between @defer and a lazy-loaded route?',
      answer: 'A lazy route splits by page and loads when someone navigates. @defer splits by a piece of a page and loads when its trigger fires. They work well together.',
    },
    {
      question: 'Why should the @placeholder be the same size as the real content?',
      answer: 'When the content replaces the placeholder, a different size pushes everything around and makes the page jump.',
    },
    {
      question: 'What does prefetch do?',
      answer: 'It downloads the deferred code at its own trigger, such as hover, but shows nothing yet. The content still appears at the main trigger, so it shows up instantly.',
    },
  ];
}
