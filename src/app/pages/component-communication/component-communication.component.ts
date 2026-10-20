import { ChangeDetectionStrategy, Component, input, signal, WritableSignal } from '@angular/core';

import { LessonPlayerComponent } from '../../learn/player/lesson-player.component';
import { LessonSectionDirective } from '../../learn/player/lesson-section.directive';
import { CodeBlockDirective } from '../../shared/code-block.directive';
import { FlowArrowComponent } from '../../shared/flow-arrow.component';
import { FlowDiagramComponent } from '../../shared/flow-diagram.component';
import { KnowledgeCheckComponent, KnowledgeCheckItem } from '../../shared/knowledge-check.component';
import { LessonCardComponent } from '../../shared/lesson-card.component';
import { OrderStepsComponent } from '../../shared/order-steps.component';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { PredictOutputComponent } from '../../shared/predict-output.component';
import type { PredictChallenge } from '../../shared/predict-output.component';
import { TitlePreviewComponent } from '../../shared/title-preview.component';
import { StarRatingComponent } from './star-rating-demo.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CodeBlockDirective,
    TitlePreviewComponent,
    StarRatingComponent,
    FlowArrowComponent,
    FlowDiagramComponent,
    KnowledgeCheckComponent,
    OrderStepsComponent,
    PageHeaderComponent,
    PredictOutputComponent,
    LessonCardComponent,
    LessonPlayerComponent,
    LessonSectionDirective,
  ],
  template: `
    <app-lesson-player [topicId]="'communication'" [section]="section()">
      <ng-template appLessonSection="input">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-page-header title="Component Communication" illustration="communication">
            Components are small and self-contained, so they need a clean way to talk to each other. A parent gives a child data with
            <code class="text-gold-300">input()</code>. The child tells the parent something happened with <code class="text-gold-300">output()</code>.
            Those two cover most of what components ever need to say.
          </app-page-header>

          <app-lesson-card class="mt-10" label="1 · THE PROBLEM" heading="A child cannot see its parent's data">
            <p class="mt-2 text-sm text-stone-400">
              Each component has its own fields. A product card does not know which product to show, and the page does not know when the card's button was pressed. Angular gives them two
              explicit, one-way channels instead of letting them reach into each other.
            </p>
          </app-lesson-card>

          <app-lesson-card class="mt-5" label="2 · THE MENTAL MODEL" heading="A manager and a team member" tone="amber">
            <ul class="mt-3 list-disc space-y-2 pl-5 text-sm text-stone-300">
              <li><strong class="text-stone-100">input()</strong> is the brief the manager hands over. The team member reads it, but does not rewrite it.</li>
              <li><strong class="text-stone-100">output()</strong> is the report the team member sends back: "I finished this." The manager decides what to do about it.</li>
              <li>Data goes <strong class="text-stone-100">down</strong> through inputs. Events go <strong class="text-stone-100">up</strong> through outputs. That one-way flow is what keeps bugs easy to trace.</li>
            </ul>
          </app-lesson-card>

          <app-lesson-card class="mt-5" label="3 · input()" heading="Pass data down with a property">
            <p class="mt-2 text-sm text-stone-400">
              The child declares <code class="text-gold-300">input()</code>. It is a signal, so you read it with parentheses. The parent binds to it like any other property, and the child updates whenever the
              parent's value changes.
            </p>
            <pre class="mt-4 overflow-x-auto rounded-xl bg-stone-950 p-4 text-xs text-gold-200">{{ inputCode }}</pre>
          </app-lesson-card>

          <app-lesson-card class="mt-5" label="4 · THE FLAVOURS" heading="Required, default and transformed inputs">
            <pre class="mt-3 overflow-x-auto rounded-xl bg-stone-950 p-4 text-xs text-gold-200">{{ flavoursCode }}</pre>
            <p class="mt-3 text-sm text-stone-400">
              <code class="text-gold-300">input.required()</code> makes the build fail if a parent forgets to set it. That catches the mistake before anyone opens the page.
            </p>
          </app-lesson-card>
        </section>
      </ng-template>

      <ng-template appLessonSection="output">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card class="mt-10" label="5 · output()" heading="Emit an event, let the parent decide">
            <p class="mt-2 text-sm text-stone-400">
              The child raises an event with <code class="text-gold-300">output()</code> and <code class="text-gold-300">emit()</code>. The parent listens with
              <code class="text-gold-300">(eventName)</code> and handles it in one of its own methods. The child never needs to know who is listening.
            </p>
            <pre class="mt-4 overflow-x-auto rounded-xl bg-stone-950 p-4 text-xs text-gold-200">{{ outputCode }}</pre>
          </app-lesson-card>

          <app-lesson-card class="mt-5" label="6 · NAMING" heading="Name outputs after what happened">
            <ul class="mt-3 list-disc space-y-2 pl-5 text-sm text-stone-300">
              <li>Use a past or plain event name: <code class="text-gold-300">added</code>, <code class="text-gold-300">saved</code>, <code class="text-gold-300">selected</code>.</li>
              <li>Do not start it with <code class="text-gold-300">on</code>. The handler in the parent is the one called <code class="text-gold-300">onAdded</code>.</li>
              <li>Do not reuse the name of a browser event like <code class="text-gold-300">click</code> or <code class="text-gold-300">change</code>. Your output and the native event would both fire.</li>
            </ul>
          </app-lesson-card>

          <app-lesson-card class="mt-5" label="THE OLDER WAY" heading="You will still see decorators">
            <p class="mt-2 text-sm text-stone-400">
              Existing code uses <code class="text-gold-300">&#64;Input()</code> and <code class="text-gold-300">&#64;Output()</code> with <code class="text-gold-300">EventEmitter</code>. They work the same
              from the parent's side. New code should use <code class="text-gold-300">input()</code> and <code class="text-gold-300">output()</code>, which are typed better and work with signals.
            </p>
            <pre class="mt-4 overflow-x-auto rounded-xl bg-stone-950 p-4 text-xs text-gold-200">{{ decoratorsCode }}</pre>
          </app-lesson-card>
        </section>
      </ng-template>

      <ng-template appLessonSection="model">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card class="mt-10" label="7 · model()" heading="When parent and child edit the same value">
            <p class="mt-2 text-sm text-stone-400">
              Some children edit a value the parent owns: a rating, a toggle, a search box. <code class="text-gold-300">model()</code> is an
              <code class="text-gold-300">input()</code> and an <code class="text-gold-300">output()</code> in one. The parent uses the "banana in a box" syntax
              <code class="text-gold-300">[(rating)]</code>, and the two stay in sync both ways.
            </p>
            <pre class="mt-4 overflow-x-auto rounded-xl bg-stone-950 p-4 text-xs text-gold-200">{{ modelCode }}</pre>
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="highlight" label="8 · TRY IT" heading="Click a star, then reset from the parent">
            <ol class="mt-2 list-decimal space-y-1 pl-5 text-sm text-stone-400">
              <li>Click a star in the child. The parent's number changes.</li>
              <li>Press Reset in the parent. The child's stars follow.</li>
            </ol>
            <div class="mt-4 grid gap-3 md:grid-cols-2">
              <div class="rounded-xl bg-stone-950 p-4">
                <p class="text-xs font-bold tracking-wider text-stone-500">CHILD</p>
                <app-star-rating class="mt-2 block" [(rating)]="myRating" />
              </div>
              <div class="rounded-xl bg-stone-950 p-4">
                <p class="text-xs font-bold tracking-wider text-stone-500">PARENT</p>
                <p class="mt-2 text-sm text-stone-300">The parent holds: <strong class="text-gold-300" data-testid="parent-rating">{{ myRating() }}</strong> stars</p>
                <button
                  type="button"
                  data-testid="parent-reset"
                  (click)="myRating.set(0)"
                  class="mt-3 min-h-11 rounded-xl border border-stone-600 px-4 text-sm font-semibold text-stone-100 hover:bg-stone-800"
                >
                  Reset from the parent
                </button>
              </div>
            </div>
          </app-lesson-card>
        </section>
      </ng-template>

      <ng-template appLessonSection="when-service">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card class="mt-10" label="9 · WHICH TOOL?" heading="Match the job to the tool">
            <div class="mt-4 overflow-x-auto rounded-xl border border-stone-800">
              <table class="w-full text-left text-sm">
                <thead class="bg-stone-800 text-stone-300">
                  <tr>
                    <th class="px-4 py-2 font-semibold">Tool</th>
                    <th class="px-4 py-2 font-semibold">Use it when</th>
                    <th class="px-4 py-2 font-semibold">It looks like</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-stone-800 text-stone-400">
                  @for (row of tools; track row.tool) {
                    <tr>
                      <td class="whitespace-nowrap px-4 py-2 font-mono text-gold-300">{{ row.tool }}</td>
                      <td class="px-4 py-2">{{ row.when }}</td>
                      <td class="whitespace-nowrap px-4 py-2 font-mono text-xs">{{ row.looks }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </app-lesson-card>

          <div class="mt-5 rounded-2xl border border-gold-400/20 bg-gold-950/30 p-6">
            <h2 class="font-bold text-gold-200">Why not just share a service?</h2>
            <p class="mt-2 text-sm text-stone-300">
              You could. Services are great for state shared across many unrelated components. But when data only needs to move between a direct parent and its child,
              <code class="text-gold-300">input()</code> and <code class="text-gold-300">output()</code> keep the relationship visible right in the template, so anyone reading
              <code class="text-gold-300">&lt;app-title-preview [title] (addToWatchlist)&gt;</code> can see exactly what flows in and out. There is no hunting through a service to find who else is listening.
            </p>
          </div>

          <app-lesson-card class="mt-5" variant="highlight" label="CHOOSE" heading="Which tool fits this job?">
            <app-predict-output [challenge]="cardChallenge" />
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="highlight" label="CHOOSE AGAIN" heading="And this one?">
            <app-predict-output [challenge]="badgeChallenge" />
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="danger" label="COMMON MISTAKES" heading="Where parent and child communication goes wrong">
            <ul class="mt-3 list-disc space-y-2 pl-5 text-sm text-stone-300">
              <li><strong class="text-stone-100">A child changing an object it received.</strong> Mutating an input breaks one-way data flow and makes bugs hard to trace. Send an event up with <code class="text-gold-300">output()</code> and let the parent change its own data.</li>
              <li><strong class="text-stone-100">Passing data through four or five levels.</strong> If middle components only forward a value, that is the signal to use a shared service instead.</li>
              <li><strong class="text-stone-100">Injecting the parent to call its methods.</strong> It works, but the child can now only live inside that one parent. An output keeps it reusable.</li>
              <li><strong class="text-stone-100">Forgetting the parentheses.</strong> A signal input is read as <code class="text-gold-300">title()</code>. <code class="text-gold-300">title</code> alone is the signal itself, not its value.</li>
            </ul>
          </app-lesson-card>
        </section>
      </ng-template>

      <ng-template appLessonSection="try-it">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <div class="mt-8 flex flex-col gap-3 rounded-2xl border border-stone-800 bg-stone-900 p-5 sm:flex-row sm:items-center sm:justify-center sm:gap-8">
            <app-flow-diagram from="Parent" to="title = input()" direction="right" />
            <app-flow-diagram from="addToWatchlist = output()" to="Parent" direction="right" />
          </div>

          <div class="mt-6 grid gap-3 md:grid-cols-[1fr_auto_1fr] md:gap-x-5">
            <app-lesson-card label="PARENT COMPONENT" tone="emerald">
              <label class="mt-4 block text-sm font-medium" for="parent-title">Movie or series title</label>
              <input
                id="parent-title"
                [value]="selectedTitle()"
                (input)="onTitleInput($event)"
                class="mt-2 w-full rounded-xl border border-stone-600 bg-stone-800 px-3 py-2.5 text-stone-100 focus:border-gold-400 focus:outline-none"
                placeholder="Type a title"
              />
              <p class="mt-5 text-sm text-stone-400">The parent sends this value with:</p>
              <code class="mt-2 block rounded-lg bg-stone-950 p-3 text-sm text-gold-300">[title]="selectedTitle()"</code>
            </app-lesson-card>

            <app-flow-arrow
              class="justify-self-center md:self-center"
              direction="down"
              turn
              label="title = input()"
              caption="parent → child"
              [active]="titleFlowing()"
            />

            <div class="flex min-w-0 flex-col gap-3">
              <app-title-preview [title]="selectedTitle()" (addToWatchlist)="receiveTitle($event)" />
              <app-flow-arrow
                class="justify-center"
                tone="burgundy"
                label="addToWatchlist = output()"
                caption="child → parent"
                [active]="messageFlowing()"
              />
            </div>
          </div>

          <div class="mt-6 rounded-2xl border border-[rgb(var(--panel-danger-heading))]/30 bg-[rgb(var(--panel-danger-bg))] p-5">
            <p class="font-semibold text-[rgb(var(--panel-danger-heading))]">Message received by parent</p>
            <p class="mt-2 text-stone-300" data-testid="received-message">{{ receivedMessage() || 'Click “Add to watchlist” in the child component.' }}</p>
            <code class="mt-3 block text-sm text-[rgb(var(--panel-danger-heading))]">(addToWatchlist)="receiveTitle($event)"</code>
          </div>

          <app-lesson-card class="mt-5" label="WHAT FLOWED" heading="The last few things that moved between them">
            <ul class="mt-3 space-y-1 text-sm" data-testid="flow-log" aria-live="polite">
              @for (line of log(); track $index) {
                <li [class]="line.startsWith('↓') ? 'text-emerald-300' : 'text-rose-300'">{{ line }}</li>
              } @empty {
                <li class="text-stone-500">Type a title or press the child's button to see events here.</li>
              }
            </ul>
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="highlight" label="PUT IT IN ORDER" heading="What happens when the child's button is pressed?">
            <app-order-steps
              [steps]="flowSteps"
              explanation="The child only emits. The parent's handler runs with the value as $event, changes the parent's own data, and the template shows the new message. The child never touched the parent."
            />
          </app-lesson-card>

          <app-knowledge-check [items]="checkItems" />
        </section>
      </ng-template>
    </app-lesson-player>
  `,
})
export class ComponentCommunicationComponent {
  readonly section = input<string>();
  protected readonly selectedTitle = signal('');
  protected readonly receivedMessage = signal('');
  protected readonly myRating = signal(0);
  protected readonly log = signal<string[]>([]);

  /** True for a moment after data moves, so the matching arrow lights up. */
  protected readonly titleFlowing = signal(false);
  protected readonly messageFlowing = signal(false);
  private readonly flashTimers = new Map<WritableSignal<boolean>, ReturnType<typeof setTimeout>>();

  onTitleInput(event: Event): void {
    const title = (event.target as HTMLInputElement).value;
    this.selectedTitle.set(title);
    this.addLog(`↓ input: the parent sent "${title}" to the child`);
    this.flash(this.titleFlowing);
  }

  receiveTitle(title: string): void {
    this.receivedMessage.set(`The parent received: ${title}`);
    this.addLog(`↑ output: the child emitted "${title}" to the parent`);
    this.flash(this.messageFlowing);
  }

  private addLog(line: string): void {
    this.log.update((lines) => [...lines, line].slice(-5));
  }

  private flash(flag: WritableSignal<boolean>): void {
    clearTimeout(this.flashTimers.get(flag));
    flag.set(true);
    this.flashTimers.set(flag, setTimeout(() => flag.set(false), 1400));
  }

  protected readonly inputCode = `// child
export class TitlePreviewComponent {
  title = input.required<string>();      // a signal: read it with title()
}

// child template
<h3>{{ title() }}</h3>

// parent template
<app-title-preview [title]="selectedTitle()" />`;

  protected readonly flavoursCode = `size = input('medium');                                  // has a default
title = input.required<string>();                        // the parent must set it
disabled = input(false, { transform: booleanAttribute }); // <app-x disabled /> works
label = input('', { alias: 'buttonLabel' });             // different name outside`;

  protected readonly outputCode = `// child
export class TitlePreviewComponent {
  title = input.required<string>();
  addToWatchlist = output<string>();

  onAdd() { this.addToWatchlist.emit(this.title()); }
}

// parent template
<app-title-preview [title]="t" (addToWatchlist)="receiveTitle($event)" />`;

  protected readonly decoratorsCode = `@Input() title = '';
@Output() addToWatchlist = new EventEmitter<string>();`;

  protected readonly modelCode = `// child
export class StarRatingComponent {
  rating = model(0);                  // input + output in one
  pick(n: number) { this.rating.set(n); }
}

// parent template: the value stays in sync both ways
<app-star-rating [(rating)]="myRating" />`;

  protected readonly tools = [
    { tool: 'input()', when: 'A parent gives data to its child.', looks: '[title]="t"' },
    { tool: 'output()', when: 'A child tells its parent something happened.', looks: '(added)="onAdded($event)"' },
    { tool: 'model()', when: 'Parent and child edit the same value.', looks: '[(rating)]="r"' },
    { tool: 'a service', when: 'Unrelated components share state.', looks: 'inject(CartService)' },
    { tool: 'ng-content', when: 'A parent supplies markup, not just a value.', looks: '<app-card>…</app-card>' },
  ];

  protected readonly cardChallenge: PredictChallenge = {
    question: 'A product card must tell the page that its "Buy" button was pressed. Which tool fits?',
    options: [
      { id: 'input', text: 'input()' },
      { id: 'output', text: 'output()' },
      { id: 'model', text: 'model()' },
      { id: 'service', text: 'A shared service' },
    ],
    correct: 'output',
    explanation: 'A child telling its direct parent that something happened is exactly what output() is for. The page decides what to do about it.',
  };

  protected readonly badgeChallenge: PredictChallenge = {
    question: 'The header cart badge and a product page, far apart in the tree, must show the same cart. Which tool fits?',
    options: [
      { id: 'service', text: 'A shared service' },
      { id: 'input', text: 'input() through every component in between' },
      { id: 'output', text: 'output() through every component in between' },
      { id: 'content', text: 'ng-content' },
    ],
    correct: 'service',
    explanation: 'The two components are not parent and child. A service is the shared place both can read, instead of passing the cart through everything in between.',
  };

  protected readonly flowSteps = [
    "The user presses the button in the child",
    'The child calls addToWatchlist.emit(title())',
    "Angular runs the parent's (addToWatchlist) handler with the value as $event",
    "The parent updates its own message",
    'The template shows the new message',
  ];

  protected readonly checkItems: KnowledgeCheckItem[] = [
    {
      question: 'How does a parent send data to a child?',
      answer: 'The child declares input() (or input.required()), and the parent binds to it with [prop]="value" in its template. The child reads it with prop().',
    },
    {
      question: 'How does a child notify its parent?',
      answer: 'The child declares output() and calls emit(). The parent listens with (eventName)="handler($event)".',
    },
    {
      question: "Why shouldn't a child change an input's value directly?",
      answer: 'Data flows one way, parent to child. The parent owns the value, so changing it inside the child breaks the single source of truth. Send an event up, or use model() when the child is meant to edit the value.',
    },
    {
      question: 'When do you use model() instead of input() and output()?',
      answer: 'When the child edits a value that the parent owns, like a rating or a toggle. model() is both in one, and the parent uses [(value)].',
    },
  ];
}
