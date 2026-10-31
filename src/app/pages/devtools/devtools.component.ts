import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

import { LessonPlayerComponent } from '../../learn/player/lesson-player.component';
import { LessonSectionDirective } from '../../learn/player/lesson-section.directive';
import { CodeBlockDirective } from '../../shared/code-block.directive';
import { CommonMistakeComponent } from '../../shared/common-mistake.component';
import { KnowledgeCheckComponent, KnowledgeCheckItem } from '../../shared/knowledge-check.component';
import { LessonCardComponent } from '../../shared/lesson-card.component';
import { LessonFigureComponent } from '../../shared/lesson-figure.component';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { PredictChallenge, PredictOutputComponent } from '../../shared/predict-output.component';
import { RecapComponent } from '../../shared/recap.component';

interface Candidate {
  id: string;
  text: string;
  real: boolean;
  why: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CodeBlockDirective,
    CommonMistakeComponent,
    KnowledgeCheckComponent,
    LessonCardComponent,
    LessonFigureComponent,
    LessonPlayerComponent,
    LessonSectionDirective,
    PageHeaderComponent,
    PredictOutputComponent,
    RecapComponent,
  ],
  template: `
    <app-lesson-player [topicId]="'devtools'" [section]="section()">
      <!-- ── Why ── -->
      <ng-template appLessonSection="why">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-page-header title="DevTools and Style Guide" illustration="devtools">
            Two habits separate someone who writes Angular from someone who works well with it: being able to <em>look inside</em> a running app, and writing code the way the rest of the community does.
          </app-page-header>

          <app-lesson-card class="mt-10" label="1 · THE PROBLEM" heading="You cannot fix what you cannot see">
            <p class="mt-2 text-sm text-stone-400">
              When a value is wrong on screen, guessing is slow. And when every developer names things differently, a team spends its time decoding style instead of building features.
            </p>
          </app-lesson-card>

          <app-lesson-card class="mt-5" tone="amber" label="2 · THE MENTAL MODEL" heading="An X-ray and a shared dictionary">
            <ul class="mt-3 list-disc space-y-2 pl-5 text-sm text-stone-300">
              <li><strong class="text-stone-100">DevTools</strong> is the X-ray: it shows the components inside the page, their data, and how long checks take.</li>
              <li><strong class="text-stone-100">The style guide</strong> is the shared dictionary: the same words and shapes everywhere, so anyone can read anyone's code.</li>
            </ul>
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="highlight" label="PREDICT" heading="Where does it work?">
            <app-predict-output [challenge]="devChallenge" />
          </app-lesson-card>

          <app-recap class="mt-5" [items]="recapWhy" />
        </section>
      </ng-template>

      <!-- ── DevTools ── -->
      <ng-template appLessonSection="devtools">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card class="mt-10" label="THE EXTENSION" heading="Angular DevTools adds an Angular tab to your browser">
            <p class="mt-2 text-sm text-stone-400">
              Angular DevTools is a free browser extension for Chrome and Firefox. Open your browser's developer tools on a page that runs Angular in development mode and you get an <strong class="text-stone-200">Angular</strong> tab with two panels.
            </p>
          </app-lesson-card>

          <app-lesson-figure
            class="mt-5"
            caption="The Components panel: the tree on the left, the selected component's data on the right."
            description="Two columns. On the left a tree of components: app-root contains app-list, which contains app-card, which is highlighted. On the right the properties of app-card: title is Ada, count is 3."
          >
            <svg viewBox="0 0 440 190" role="presentation" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="6" y="6" width="428" height="178" rx="10" fill="rgb(var(--stone-900))" stroke="rgb(var(--stone-700))" stroke-width="1.5" />
              <path d="M200 6 V184" stroke="rgb(var(--stone-700))" stroke-width="1.5" />
              <g font-family="ui-monospace, monospace" font-size="12" font-weight="600">
                <text x="20" y="34" fill="rgb(var(--stone-400))">&lt;app-root&gt;</text>
                <text x="34" y="60" fill="rgb(var(--stone-400))">&lt;app-list&gt;</text>
                <rect x="40" y="72" width="140" height="26" rx="6" fill="rgb(var(--gold-500) / 0.18)" />
                <text x="50" y="90" fill="rgb(var(--gold-300))">&lt;app-card&gt;</text>
                <text x="34" y="124" fill="rgb(var(--stone-400))">&lt;app-footer&gt;</text>
                <text x="216" y="34" fill="rgb(var(--gold-300))">app-card</text>
                <text x="216" y="64" fill="rgb(var(--stone-300))">title: "Ada"</text>
                <text x="216" y="88" fill="rgb(var(--stone-300))">count: 3</text>
                <text x="216" y="112" fill="rgb(var(--stone-300))">OnPush</text>
              </g>
            </svg>
          </app-lesson-figure>

          <app-lesson-card class="mt-5" label="THE TWO PANELS" heading="What each one is for">
            <div class="mt-3 grid gap-4 sm:grid-cols-2">
              <div class="rounded-xl bg-stone-800 p-4">
                <p class="font-bold text-gold-300">Components</p>
                <ul class="mt-2 list-disc space-y-1 pl-5 text-sm text-stone-300">
                  <li>See the tree of components and directives.</li>
                  <li>Click one to read its inputs, outputs and state.</li>
                  <li>Edit a value and watch the page change.</li>
                  <li>Jump to the element in the Elements tab.</li>
                </ul>
              </div>
              <div class="rounded-xl bg-stone-800 p-4">
                <p class="font-bold text-gold-300">Profiler</p>
                <ul class="mt-2 list-disc space-y-1 pl-5 text-sm text-stone-300">
                  <li>Record while you click around.</li>
                  <li>See each change detection run and how long it took.</li>
                  <li>Find the component that is checked too often.</li>
                  <li>Pair it with OnPush and signals to fix it.</li>
                </ul>
              </div>
            </div>
          </app-lesson-card>

          <app-lesson-card class="mt-5" label="THE CONSOLE" heading="A few helpers in development mode">
            <p class="mt-2 text-sm text-stone-400">
              In a development build, Angular exposes helpers on a global called <code class="text-gold-300">ng</code>. Select an element in the Elements tab (it becomes <code class="text-gold-300">$0</code>) and try:
            </p>
            <pre class="mt-3" [appCode]="consoleCode"></pre>
            <p class="mt-3 max-w-[60ch] text-sm text-stone-400">
              These helpers are removed from production builds. Do not rely on them in code you ship.
            </p>
          </app-lesson-card>

          <app-common-mistake class="mt-5" title="Profiling a production build" [wrong]="mistakeProdWrong" [right]="mistakeProdRight">
            DevTools needs a development build to see components and their data. Production builds are minified and stripped, so the extension shows little. Profile with <code class="text-gold-300">ng serve</code>.
          </app-common-mistake>

          <app-recap class="mt-5" [items]="recapDevtools" />
        </section>
      </ng-template>

      <!-- ── Style review ── -->
      <ng-template appLessonSection="style">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card class="mt-10" variant="highlight" label="TRY IT" heading="Review this component against the style guide">
            <p class="mt-2 text-sm text-stone-400">
              Read the code, then tick everything that goes against the Angular style guide. Two of the choices are fine. Then press "Check my review".
            </p>
            <pre class="mt-3" [appCode]="reviewCode"></pre>
            <fieldset class="mt-4">
              <legend class="text-sm font-semibold text-stone-100">What is wrong?</legend>
              <ul class="mt-2 space-y-2">
                @for (c of candidates; track c.id) {
                  <li>
                    <label class="flex min-h-11 cursor-pointer items-start gap-2 rounded-xl border border-stone-700 px-3 py-2 text-sm text-stone-200 hover:bg-stone-800">
                      <input type="checkbox" [checked]="ticked().has(c.id)" (change)="toggle(c.id)" class="mt-0.5 h-4 w-4 accent-[rgb(var(--gold-400))]" />
                      <span>{{ c.text }}</span>
                    </label>
                  </li>
                }
              </ul>
            </fieldset>
            <div class="mt-3 flex flex-wrap items-center gap-3">
              <button type="button" (click)="checked.set(true)" class="min-h-11 rounded-xl bg-gold-solid px-4 text-sm font-semibold text-white hover:bg-gold-solid-hover">Check my review</button>
              <button type="button" (click)="reset()" class="min-h-11 rounded-xl border border-stone-600 px-4 text-sm font-semibold text-stone-200 hover:bg-stone-800">Start again</button>
            </div>
            @if (checked()) {
              <div class="mt-4 rounded-xl border border-stone-700 bg-stone-900 p-4" aria-live="polite" data-testid="feedback">
                <p class="font-semibold text-stone-100">You found {{ score().found }} of {{ score().total }} real problems.</p>
                @if (score().falseAlarms > 0) { <p class="mt-1 text-sm text-amber-300">{{ score().falseAlarms }} of your ticks were not problems.</p> }
                <ul class="mt-3 space-y-2 text-sm">
                  @for (c of candidates; track c.id) {
                    <li [class]="c.real ? (ticked().has(c.id) ? 'text-emerald-300' : 'text-rose-300') : (ticked().has(c.id) ? 'text-amber-300' : 'text-stone-400')">
                      {{ c.real ? (ticked().has(c.id) ? '✓ Found:' : '✕ Missed:') : (ticked().has(c.id) ? '! Not a problem:' : 'Fine:') }} {{ c.why }}
                    </li>
                  }
                </ul>
              </div>
            }
          </app-lesson-card>

          <app-lesson-card class="mt-5" label="AFTER" heading="The same component, in the recommended style">
            <pre class="mt-3" [appCode]="fixedCode"></pre>
          </app-lesson-card>

          <app-recap class="mt-5" [items]="recapStyle" />
        </section>
      </ng-template>

      <!-- ── Naming ── -->
      <ng-template appLessonSection="naming">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card class="mt-10" label="NAMES" heading="Files, classes and selectors">
            <div class="mt-3 overflow-x-auto rounded-xl border border-stone-800">
              <table class="w-full text-left text-sm">
                <thead class="bg-stone-800 text-stone-300">
                  <tr><th class="px-4 py-2 font-semibold">Thing</th><th class="px-4 py-2 font-semibold">Recommended</th><th class="px-4 py-2 font-semibold">Older habit</th></tr>
                </thead>
                <tbody class="divide-y divide-stone-800 text-stone-400">
                  @for (row of naming; track row.thing) {
                    <tr>
                      <td class="px-4 py-2 text-stone-200">{{ row.thing }}</td>
                      <td class="whitespace-nowrap px-4 py-2 font-mono text-xs text-gold-300">{{ row.good }}</td>
                      <td class="whitespace-nowrap px-4 py-2 font-mono text-xs">{{ row.old }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
            <p class="mt-3 max-w-[60ch] text-sm text-stone-400">
              Existing projects often keep the older names, such as <code class="text-gold-300">UserCardComponent</code> in <code class="text-gold-300">user-card.component.ts</code>. Both are valid; be consistent inside one project.
              Newer CLI versions generate the shorter names.
            </p>
          </app-lesson-card>

          <app-lesson-card class="mt-5" label="STRUCTURE" heading="Habits that keep a project readable">
            <ul class="mt-3 list-disc space-y-2 pl-5 text-sm text-stone-300">
              <li>One concept per file, and keep files small.</li>
              <li>Group by feature (<code class="text-gold-300">cart/</code>, <code class="text-gold-300">checkout/</code>), not by type (<code class="text-gold-300">components/</code>, <code class="text-gold-300">services/</code>).</li>
              <li>Put things used only by the template as <code class="text-gold-300">protected</code>, and mark inputs, outputs and queries <code class="text-gold-300">readonly</code>.</li>
              <li>Use <code class="text-gold-300">inject()</code> instead of constructor parameters, and the <code class="text-gold-300">host</code> object instead of <code class="text-gold-300">&#64;HostBinding</code> and <code class="text-gold-300">&#64;HostListener</code>.</li>
              <li>Name a handler for what it does (<code class="text-gold-300">saveUser()</code>), not for the event (<code class="text-gold-300">onClick()</code>).</li>
              <li>Avoid <code class="text-gold-300">any</code>. Give things a real type.</li>
            </ul>
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="highlight" label="PREDICT" heading="Which name is better?">
            <app-predict-output [challenge]="nameChallenge" />
          </app-lesson-card>

          <app-recap class="mt-5" [items]="recapNaming" />
          <app-knowledge-check [items]="checkItems" />
        </section>
      </ng-template>
    </app-lesson-player>
  `,
})
export class DevtoolsComponent {
  readonly section = input<string>();

  protected readonly candidates: Candidate[] = [
    { id: 'selector', real: true, text: "The selector 'userCard' is not kebab-case with a prefix", why: "Selectors should be kebab-case with a prefix, such as 'app-user-card'." },
    { id: 'input', real: true, text: '@Input() is used instead of input()', why: 'Signal inputs with input() are the modern, typed way.' },
    { id: 'output', real: true, text: '@Output() with an untyped EventEmitter', why: 'Use output<string>() so listeners know what they receive.' },
    { id: 'any', real: true, text: "The type 'any' on name", why: 'Give name a real type, such as string.' },
    { id: 'ctor', real: true, text: 'The service is injected through the constructor', why: 'Prefer inject(), which is shorter and works with inheritance and functions.' },
    { id: 'handler', real: true, text: "The method is called 'handleClick'", why: 'Name a handler for what it does, such as selectUser().' },
    { id: 'templateurl', real: false, text: 'The template is in a separate HTML file (templateUrl)', why: 'A separate file is fine, and common for bigger templates.' },
    { id: 'standalone', real: false, text: 'The component uses an imports array and no NgModule', why: 'Standalone components are the modern default.' },
  ];
  protected readonly ticked = signal<ReadonlySet<string>>(new Set());
  protected readonly checked = signal(false);
  protected readonly score = computed(() => {
    const real = this.candidates.filter((c) => c.real);
    const found = real.filter((c) => this.ticked().has(c.id)).length;
    const falseAlarms = this.candidates.filter((c) => !c.real && this.ticked().has(c.id)).length;
    return { found, total: real.length, falseAlarms };
  });

  protected toggle(id: string): void {
    this.ticked.update((set) => {
      const next = new Set(set);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    this.checked.set(false);
  }

  protected reset(): void {
    this.ticked.set(new Set());
    this.checked.set(false);
  }

  protected readonly reviewCode = `@Component({
  selector: 'userCard',
  templateUrl: './user-card.component.html',
  imports: [CommonModule],
})
export class UserCardComponent {
  @Input() name: any;
  @Output() clicked = new EventEmitter();

  constructor(private http: HttpClient) {}

  handleClick() {
    this.clicked.emit();
  }
}`;

  protected readonly fixedCode = `@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.html',
  imports: [],
})
export class UserCard {
  readonly name = input.required<string>();
  readonly selected = output<string>();

  private readonly http = inject(HttpClient);

  protected selectUser(): void {
    this.selected.emit(this.name());
  }
}`;

  protected readonly consoleCode = `ng.getComponent($0)          // the component instance of the selected element
ng.getOwningComponent($0)    // the component whose template contains it
ng.applyChanges($0)          // run a check on that component after you edit a value`;

  protected readonly mistakeProdWrong = `ng build        # then open the site and profile it`;
  protected readonly mistakeProdRight = `ng serve        # development build: components, data and timings are visible`;

  protected readonly naming = [
    { thing: 'Component file', good: 'user-card.ts', old: 'user-card.component.ts' },
    { thing: 'Component class', good: 'UserCard', old: 'UserCardComponent' },
    { thing: 'Selector', good: 'app-user-card', old: 'userCard' },
    { thing: 'Directive class', good: 'Highlight', old: 'HighlightDirective' },
    { thing: 'Handler', good: 'selectUser()', old: 'handleClick()' },
  ];

  protected readonly devChallenge: PredictChallenge = {
    question: 'You open Angular DevTools on a production site and see little. Why?',
    options: [
      { id: 'a', text: 'The extension is broken' },
      { id: 'b', text: 'Production builds are minified and stripped of the development information it needs' },
      { id: 'c', text: 'The page is not using Angular' },
      { id: 'd', text: 'Your browser blocks it' },
    ],
    correct: 'b',
    explanation: 'DevTools reads information that only exists in development builds. Run ng serve to inspect components and their data.',
  };

  protected readonly nameChallenge: PredictChallenge = {
    question: 'Which method name follows the style guide?',
    options: [
      { id: 'a', text: 'handleClick()' },
      { id: 'b', text: 'onButtonClicked()' },
      { id: 'c', text: 'saveDraft()' },
      { id: 'd', text: 'doStuff()' },
    ],
    correct: 'c',
    explanation: 'A handler should say what it does, not which event triggered it. Then it still makes sense when another event, such as a key press, calls it.',
  };

  protected readonly recapWhy = [
    'DevTools lets you look inside a running app.',
    'The style guide gives a team one shared way to write Angular.',
    'Both save time: fewer guesses and less decoding.',
  ];
  protected readonly recapDevtools = [
    'Angular DevTools adds an Angular tab with a Components panel and a Profiler.',
    'It works on development builds, so use ng serve.',
    'The ng helpers in the console, such as ng.getComponent($0), are development only.',
  ];
  protected readonly recapStyle = [
    'Use kebab-case selectors with a prefix, input() and output(), inject(), and real types.',
    'Name a handler for what it does, not for the event.',
    'A templateUrl and the imports array are fine.',
  ];
  protected readonly recapNaming = [
    'Newer CLI versions generate short names such as user-card.ts and UserCard.',
    'Older names with the Component suffix are still valid; stay consistent in a project.',
    'Group by feature, keep files small, mark template-only members protected.',
  ];

  protected readonly checkItems: KnowledgeCheckItem[] = [
    { question: 'What does the Profiler panel show?', answer: 'Each change detection run and how long it took, so you can find a component that is checked too often.' },
    { question: 'Why name a method saveDraft() and not onClick()?', answer: 'A name that says what the code does still makes sense when another event calls it, and reads better in the template.' },
    { question: 'Why does DevTools need a development build?', answer: 'It reads component information that production builds remove when they minify and strip the code.' },
  ];
}
