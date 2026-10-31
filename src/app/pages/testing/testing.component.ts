import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

import { LessonPlayerComponent } from '../../learn/player/lesson-player.component';
import { LessonSectionDirective } from '../../learn/player/lesson-section.directive';
import { CodeBlockDirective } from '../../shared/code-block.directive';
import { CommonMistakeComponent } from '../../shared/common-mistake.component';
import { KnowledgeCheckComponent, KnowledgeCheckItem } from '../../shared/knowledge-check.component';
import { LessonCardComponent } from '../../shared/lesson-card.component';
import { OrderStepsComponent } from '../../shared/order-steps.component';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { PredictChallenge, PredictOutputComponent } from '../../shared/predict-output.component';
import { RecapComponent } from '../../shared/recap.component';
import { DEMO_TESTS, totalOf } from './testing-demos';

interface TestResult {
  name: string;
  passed: boolean;
  message: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CodeBlockDirective,
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
    <app-lesson-player [topicId]="'testing'" [section]="section()">
      <!-- ── Why ── -->
      <ng-template appLessonSection="why">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-page-header title="Testing" illustration="testing">
            A test is a small program that uses your code and checks the answer. When it fails it tells you exactly what broke, so you can change code with confidence.
          </app-page-header>

          <app-lesson-card class="mt-10" label="1 · THE PROBLEM" heading="Every change might break something far away">
            <p class="mt-2 text-sm text-stone-400">
              Fix a price calculation and the checkout page may stop working. Checking by hand every page after every change is slow, boring, and you will skip steps.
              Tests do the checking for you, in seconds, every time.
            </p>
          </app-lesson-card>

          <app-lesson-card class="mt-5" tone="amber" label="2 · THE MENTAL MODEL" heading="A smoke alarm for your code">
            <ul class="mt-3 list-disc space-y-2 pl-5 text-sm text-stone-300">
              <li><strong class="text-stone-100">Quiet</strong> while everything works. You do not think about it.</li>
              <li><strong class="text-stone-100">Loud</strong> the moment something breaks, and it points to the room.</li>
              <li><strong class="text-stone-100">Cheap</strong> compared to finding the fire by smell.</li>
            </ul>
          </app-lesson-card>

          <app-lesson-card class="mt-5" label="3 · WHAT TO TEST" heading="Test what the user would notice">
            <p class="mt-2 text-sm text-stone-400">
              Test behaviour: "when the button is clicked, the count goes up". Do not test how the code does it inside, such as the name of a private method.
              Behaviour tests keep passing when you tidy the code, and fail only when something real breaks.
            </p>
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="highlight" label="PREDICT" heading="Which test is better?">
            <app-predict-output [challenge]="behaviourChallenge" />
          </app-lesson-card>

          <app-recap class="mt-5" [items]="recapWhy" />
        </section>
      </ng-template>

      <!-- ── Anatomy ── -->
      <ng-template appLessonSection="anatomy">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card class="mt-10" label="THE SHAPE" heading="Arrange, act, assert">
            <div class="mt-3 grid gap-3 sm:grid-cols-3">
              @for (step of aaa; track step.name) {
                <div class="rounded-xl bg-stone-800 p-4">
                  <p class="font-mono text-sm font-bold text-gold-300">{{ step.name }}</p>
                  <p class="mt-1 text-sm text-stone-300">{{ step.text }}</p>
                </div>
              }
            </div>
            <pre class="mt-4" [appCode]="anatomyCode"></pre>
          </app-lesson-card>

          <app-lesson-card class="mt-5" label="THE WORDS" heading="describe, it and expect">
            <ul class="mt-3 list-disc space-y-2 pl-5 text-sm text-stone-300">
              <li><code class="text-gold-300">describe('name', () => {{ '{' }} ... {{ '}' }})</code> groups tests about one thing.</li>
              <li><code class="text-gold-300">it('does something', () => {{ '{' }} ... {{ '}' }})</code> is one test. Write the name as a sentence.</li>
              <li><code class="text-gold-300">expect(actual).toBe(expected)</code> checks the answer. There are others such as <code class="text-gold-300">toEqual</code> and <code class="text-gold-300">toContain</code>.</li>
            </ul>
            <p class="mt-3 max-w-[60ch] text-sm text-stone-400">
              These words are the same in the runners Angular projects use (Jasmine with Karma, or Vitest), so what you learn here carries over. Run them with <code class="text-gold-300">ng test</code>.
            </p>
          </app-lesson-card>

          <app-recap class="mt-5" [items]="recapAnatomy" />
        </section>
      </ng-template>

      <!-- ── Component ── -->
      <ng-template appLessonSection="component">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card class="mt-10" label="TESTBED" heading="Build the component in a small test workshop">
            <p class="mt-2 text-sm text-stone-400">
              <code class="text-gold-300">TestBed</code> creates a component the way Angular would, and gives you a <strong class="text-stone-200">fixture</strong>: a handle to the component and its HTML.
              Create it, change something, call <code class="text-gold-300">fixture.detectChanges()</code> so Angular updates the page, then check the page.
            </p>
            <pre class="mt-4" [appCode]="componentCode"></pre>
          </app-lesson-card>

          <app-lesson-card class="mt-5" label="SERVICES AND HTTP" heading="Fakes keep tests fast and private">
            <p class="mt-2 text-sm text-stone-400">
              A test must not call the real server. Give the component a fake instead, and for HTTP use the testing tools that answer requests from your own code.
            </p>
            <pre class="mt-3" [appCode]="httpCode"></pre>
          </app-lesson-card>

          <app-common-mistake class="mt-5" title="Forgetting detectChanges()" [wrong]="mistakeDetectWrong" [right]="mistakeDetectRight">
            Clicking a button changes the data, but the HTML only updates after Angular runs a check. Without <code class="text-gold-300">fixture.detectChanges()</code> the test reads the old page and fails.
          </app-common-mistake>

          <app-recap class="mt-5" [items]="recapComponent" />
        </section>
      </ng-template>

      <!-- ── Runner ── -->
      <ng-template appLessonSection="runner">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card class="mt-10" variant="highlight" label="TRY IT" heading="Break the code and watch the tests catch it">
            <p class="mt-2 text-sm text-stone-400">
              These four tests check a function that adds up a shopping cart. They are real functions running against real code in this page.
              Run them, then switch on the bug (the code forgets to multiply by quantity) and run them again.
            </p>
            <div class="mt-3 flex flex-wrap items-center gap-3">
              <button type="button" (click)="run()" class="min-h-11 rounded-xl bg-gold-solid px-4 text-sm font-semibold text-white hover:bg-gold-solid-hover">Run the tests</button>
              <label class="flex min-h-11 cursor-pointer items-center gap-2 text-sm text-stone-200">
                <input type="checkbox" [checked]="buggy()" (change)="buggy.set($any($event.target).checked); results.set(null)" class="h-4 w-4 accent-[rgb(var(--gold-400))]" />
                Put a bug in the code
              </label>
            </div>
            <pre class="mt-3" [appCode]="buggy() ? buggyCode : fixedCode"></pre>
            <ul class="mt-4 space-y-2" aria-live="polite" aria-label="Test results">
              @if (results(); as list) {
                @for (result of list; track result.name) {
                  <li class="rounded-xl border px-3 py-2 text-sm" [class]="result.passed ? 'border-emerald-500/40 text-emerald-300' : 'border-rose-400/50 text-rose-200'">
                    <span class="font-bold">{{ result.passed ? '✓ PASS' : '✗ FAIL' }}</span> {{ result.name }}
                    @if (!result.passed) { <span class="mt-1 block font-mono text-xs text-rose-300">{{ result.message }}</span> }
                  </li>
                }
                <li class="text-sm font-semibold" [class]="failedCount() ? 'text-rose-300' : 'text-emerald-300'">
                  {{ list.length - failedCount() }} of {{ list.length }} passed
                </li>
              } @else {
                <li class="text-sm text-stone-500">Press "Run the tests".</li>
              }
            </ul>
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="highlight" label="PUT IT IN ORDER" heading="Fix a failing test">
            <app-order-steps
              [steps]="fixSteps"
              explanation="Read the message first. It tells you what was expected and what you got. Then find the line that makes the wrong answer, fix it, and run the tests again until they pass."
            />
          </app-lesson-card>

          <app-common-mistake class="mt-5" title="Testing the inside instead of the result" [wrong]="mistakeInsideWrong" [right]="mistakeInsideRight">
            A test that knows how the code works breaks every time you tidy it, even when nothing is wrong. Check what the user would see or what the function returns.
          </app-common-mistake>

          <app-recap class="mt-5" [items]="recapRunner" />
          <app-knowledge-check [items]="checkItems" />
        </section>
      </ng-template>
    </app-lesson-player>
  `,
})
export class TestingComponent {
  readonly section = input<string>();

  protected readonly buggy = signal(false);
  protected readonly results = signal<TestResult[] | null>(null);
  protected failedCount(): number {
    return (this.results() ?? []).filter((r) => !r.passed).length;
  }

  protected run(): void {
    const total = (lines: { price: number; qty: number }[]) => totalOf(lines, this.buggy());
    this.results.set(
      DEMO_TESTS.map((test) => {
        try {
          test.run(total);
          return { name: test.name, passed: true, message: '' };
        } catch (error) {
          return { name: test.name, passed: false, message: (error as Error).message };
        }
      }),
    );
  }

  protected readonly aaa = [
    { name: 'Arrange', text: 'Set the scene: create the component or the data.' },
    { name: 'Act', text: 'Do the one thing you want to check: click, call, change.' },
    { name: 'Assert', text: 'Check the result with expect().' },
  ];

  protected readonly anatomyCode = `describe('totalOf', () => {
  it('multiplies the price by the quantity', () => {
    const lines = [{ price: 10, qty: 3 }];      // arrange
    const result = totalOf(lines);              // act
    expect(result).toBe(30);                    // assert
  });
});`;

  protected readonly componentCode = `describe('Counter', () => {
  it('adds one when the button is clicked', () => {
    const fixture = TestBed.createComponent(Counter);
    fixture.detectChanges();                                  // first render

    fixture.nativeElement.querySelector('button').click();    // act
    fixture.detectChanges();                                  // let Angular update the page

    expect(fixture.nativeElement.textContent).toContain('1');
  });
});`;

  protected readonly httpCode = `TestBed.configureTestingModule({
  providers: [provideHttpClient(), provideHttpClientTesting()],
});

const http = TestBed.inject(HttpTestingController);
service.load().subscribe(data => expect(data.length).toBe(2));

http.expectOne('/api/movies').flush([{ id: 1 }, { id: 2 }]);   // you play the server`;

  protected readonly fixedCode = `export function totalOf(lines) {
  return lines.reduce((sum, line) => sum + line.price * line.qty, 0);
}`;
  protected readonly buggyCode = `export function totalOf(lines) {
  return lines.reduce((sum, line) => sum + line.price, 0);   // forgot * line.qty
}`;

  protected readonly mistakeDetectWrong = `button.click();
expect(fixture.nativeElement.textContent).toContain('1');   // page not updated yet`;
  protected readonly mistakeDetectRight = `button.click();
fixture.detectChanges();
expect(fixture.nativeElement.textContent).toContain('1');`;
  protected readonly mistakeInsideWrong = `expect(component['calculateInternalTotal']).toHaveBeenCalled();`;
  protected readonly mistakeInsideRight = `expect(fixture.nativeElement.textContent).toContain('Total: 30');`;

  protected readonly behaviourChallenge: PredictChallenge = {
    question: 'Which test will keep passing after you rename an internal method?',
    options: [
      { id: 'a', text: 'expect(component.helper).toHaveBeenCalled()' },
      { id: 'b', text: 'expect(page.textContent).toContain("Total: 30")' },
      { id: 'c', text: 'expect(component["internalState"]).toBe(3)' },
      { id: 'd', text: 'expect(component.constructor.name).toBe("Cart")' },
    ],
    correct: 'b',
    explanation: 'Only the test that checks what the user would see is independent of how the code is built inside.',
  };

  protected readonly fixSteps = [
    'A test fails and shows a message',
    'Read what was expected and what was received',
    'Find the line of code that produces the wrong answer',
    'Fix it',
    'Run the tests again until they pass',
  ];

  protected readonly recapWhy = [
    'A test uses your code and checks the answer, so changes are safe.',
    'Test behaviour the user would notice, not private details.',
    'Tests are quiet when things work and loud when they break.',
  ];
  protected readonly recapAnatomy = [
    'Every test has three parts: arrange, act, assert.',
    'describe groups tests, it is one test, expect checks the result.',
    'ng test runs them, with Jasmine or Vitest, using the same words.',
  ];
  protected readonly recapComponent = [
    'TestBed.createComponent gives you a fixture for the component.',
    'Call fixture.detectChanges() after every change before you read the page.',
    'Use fakes and HttpTestingController so tests never hit a real server.',
  ];
  protected readonly recapRunner = [
    'A failing test shows what was expected and what was received.',
    'Fix the code, not the test, unless the test itself is wrong.',
    'Run tests often: small changes make failures easy to find.',
  ];

  protected readonly checkItems: KnowledgeCheckItem[] = [
    { question: 'What are the three parts of a test?', answer: 'Arrange (set the scene), act (do the one thing), assert (check the result).' },
    { question: 'Why call fixture.detectChanges() in a test?', answer: 'Angular only updates the HTML when it runs a check. Without it the test reads the old page.' },
    { question: 'Why avoid testing private details?', answer: 'Such tests break whenever you tidy the code, even when nothing is wrong, so they cost time and protect nothing.' },
  ];
}
