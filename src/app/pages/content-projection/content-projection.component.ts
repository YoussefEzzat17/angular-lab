import { ChangeDetectionStrategy, Component, ElementRef, input, signal, viewChild } from '@angular/core';

import { LessonPlayerComponent } from '../../learn/player/lesson-player.component';
import { LessonSectionDirective } from '../../learn/player/lesson-section.directive';
import { CodeBlockDirective } from '../../shared/code-block.directive';
import { KnowledgeCheckComponent, KnowledgeCheckItem } from '../../shared/knowledge-check.component';
import { LessonCardComponent } from '../../shared/lesson-card.component';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { PredictOutputComponent } from '../../shared/predict-output.component';
import type { PredictChallenge } from '../../shared/predict-output.component';
import { CounterDemoComponent, FancyCardComponent, SlotCardComponent, TabPanelComponent, TabsComponent } from './content-projection-demos';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CodeBlockDirective,
    CounterDemoComponent,
    FancyCardComponent,
    KnowledgeCheckComponent,
    LessonCardComponent,
    LessonPlayerComponent,
    LessonSectionDirective,
    PageHeaderComponent,
    PredictOutputComponent,
    SlotCardComponent,
    TabPanelComponent,
    TabsComponent,
  ],
  template: `
    <app-lesson-player [topicId]="'content-projection'" [section]="section()">
      <ng-template appLessonSection="ng-content">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-page-header title="Content Projection & Queries">
            An <code class="text-gold-300">input()</code> can pass a string or an object into a component, but not a piece of HTML. When you want a reusable wrapper, such as a card,
            a dialog or a panel, that shows <em>whatever the parent writes inside it</em>, you use <strong class="text-stone-200">content projection</strong>.
          </app-page-header>

          <app-lesson-card class="mt-10" label="1 · THE IDEA" heading="The component leaves a hole, the parent fills it">
            <p class="mt-2 text-sm text-stone-400">
              Inside the wrapper's template you write <code class="text-gold-300">&lt;ng-content /&gt;</code>. Anything the parent puts between the wrapper's tags is moved to that spot.
            </p>
            <pre class="mt-4 overflow-x-auto rounded-xl bg-stone-950 p-4 text-xs text-gold-200">{{ wrapperCode }}</pre>
            <pre class="mt-3 overflow-x-auto rounded-xl bg-stone-950 p-4 text-xs text-gold-200">{{ parentCode }}</pre>
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="highlight" label="2 · TRY IT" heading="Same card, different content">
            <p class="mt-2 text-sm text-stone-400">Pick what goes inside. The card component never changes.</p>
            <div class="mt-3 flex flex-wrap gap-2" role="group" aria-label="Content inside the card">
              @for (option of cardOptions; track option.id) {
                <button
                  type="button"
                  [attr.data-testid]="'card-option-' + option.id"
                  [attr.aria-pressed]="cardContent() === option.id"
                  (click)="cardContent.set(option.id)"
                  class="min-h-11 rounded-xl border px-4 text-sm font-semibold transition"
                  [class]="cardContent() === option.id ? 'border-gold-400 bg-gold-500/15 text-gold-300' : 'border-stone-700 text-stone-300 hover:bg-stone-800'"
                >
                  {{ option.label }}
                </button>
              }
            </div>
            <div class="mt-4">
              <app-fancy-card>
                @switch (cardContent()) {
                  @case ('text') {
                    <p class="text-sm text-stone-200">Just a sentence of text.</p>
                  }
                  @case ('list') {
                    <ul class="list-disc space-y-1 pl-5 text-sm text-stone-200">
                      <li>A list</li>
                      <li>of three</li>
                      <li>items</li>
                    </ul>
                  }
                  @default {
                    <button type="button" class="min-h-11 rounded-xl bg-gold-solid px-4 text-sm font-semibold text-white">A real button</button>
                  }
                }
              </app-fancy-card>
            </div>
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="danger" label="GOTCHA" heading="Projected content is created even if it is hidden">
            <p class="mt-2 text-sm text-stone-300">
              The parent creates everything between the tags straight away. If the wrapper puts <code class="text-gold-300">&lt;ng-content /&gt;</code> inside an
              <code class="text-gold-300">&#64;if</code> that is false, the content is not shown, but its components were still built. For content that should only be created when shown, pass a
              template instead.
            </p>
          </app-lesson-card>
        </section>
      </ng-template>

      <ng-template appLessonSection="slots">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card class="mt-10" label="3 · NAMED SLOTS" heading="Use select to send content to different places">
            <p class="mt-2 text-sm text-stone-400">
              Give <code class="text-gold-300">&lt;ng-content&gt;</code> a <code class="text-gold-300">select</code> and only matching content goes there. It takes a CSS selector: an
              attribute, a class or an element name. Everything that matches no slot goes to the plain <code class="text-gold-300">&lt;ng-content /&gt;</code>.
            </p>
            <pre class="mt-4 overflow-x-auto rounded-xl bg-stone-950 p-4 text-xs text-gold-200">{{ slotsCode }}</pre>
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="highlight" label="4 · SEE IT" heading="Title, body and footer slots">
            <div class="mt-3">
              <app-slot-card>
                <span card-title>Order #1042</span>
                <p>Two items are on their way. You will get an email when they arrive.</p>
                <span card-footer>Placed today</span>
              </app-slot-card>
            </div>
            <p class="mt-3 text-sm text-stone-400">
              The order of the tags in the parent does not matter. <code class="text-gold-300">card-title</code> always lands in the header and
              <code class="text-gold-300">card-footer</code> in the footer.
            </p>
          </app-lesson-card>

          <app-lesson-card class="mt-5" label="GOOD TO KNOW" heading="Two small rules">
            <ul class="mt-3 list-disc space-y-2 pl-5 text-sm text-stone-300">
              <li>Content that matches no slot, and there is no plain <code class="text-gold-300">&lt;ng-content /&gt;</code>, is simply not shown. No error is raised.</li>
              <li>You can move content to a slot it does not match by hand with <code class="text-gold-300">ngProjectAs</code>, for example on an <code class="text-gold-300">&lt;ng-container&gt;</code>.</li>
            </ul>
          </app-lesson-card>
        </section>
      </ng-template>

      <ng-template appLessonSection="queries">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card class="mt-10" label="5 · QUERIES" heading="Reach what is inside: view or content">
            <p class="mt-2 text-sm text-stone-400">A query gives a component a signal that points at something inside it. There are two places to look:</p>
            <div class="mt-3 grid gap-3 sm:grid-cols-2">
              <div class="rounded-xl bg-stone-950 p-4">
                <p class="font-mono text-sm font-bold text-gold-300">viewChild / viewChildren</p>
                <p class="mt-1 text-sm text-stone-300">Things in <strong class="text-stone-100">my own template</strong>: my children, my elements with a <code class="text-gold-300">#ref</code>.</p>
              </div>
              <div class="rounded-xl bg-stone-950 p-4">
                <p class="font-mono text-sm font-bold text-gold-300">contentChild / contentChildren</p>
                <p class="mt-1 text-sm text-stone-300">Things my <strong class="text-stone-100">parent put inside me</strong> through projection.</p>
              </div>
            </div>
            <pre class="mt-4 overflow-x-auto rounded-xl bg-stone-950 p-4 text-xs text-gold-200">{{ queriesCode }}</pre>
            <p class="mt-3 text-sm text-stone-400">
              Each query is a signal. It holds <code class="text-gold-300">undefined</code> until the thing exists; use <code class="text-gold-300">viewChild.required</code> if it must always be there.
            </p>
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="highlight" label="6 · viewChild" heading="Call a method on a child, and focus an element">
            <app-counter-demo class="mt-3 block" />
            <div class="mt-3 flex flex-wrap items-center gap-3">
              <button type="button" data-testid="reset-child" (click)="resetCounter()" class="min-h-11 rounded-xl bg-gold-solid px-4 text-sm font-semibold text-white hover:bg-gold-solid-hover">Reset the child from the parent</button>
            </div>
            <div class="mt-4 flex flex-wrap items-center gap-3">
              <input #nameInput type="text" placeholder="Type here" aria-label="Demo field" class="min-h-11 rounded-xl border border-stone-700 bg-stone-900 px-3 text-sm text-stone-100 focus:border-gold-400 focus:outline-none" />
              <button type="button" data-testid="focus-input" (click)="focusInput()" class="min-h-11 rounded-xl border border-stone-600 px-4 text-sm font-semibold text-stone-100 hover:bg-stone-800">Focus the field</button>
            </div>
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="highlight" label="7 · contentChildren" heading="Tabs that build themselves from their children">
            <p class="mt-2 text-sm text-stone-400">
              The tabs component never lists its tabs. It asks for every <code class="text-gold-300">app-tab-panel</code> placed inside it and draws one button for each.
              Add or remove a panel and the buttons follow.
            </p>
            <div class="mt-3">
              <button type="button" data-testid="toggle-reviews" (click)="showReviews.set(!showReviews())" class="min-h-11 rounded-xl border border-stone-600 px-4 text-sm font-semibold text-stone-100 hover:bg-stone-800">
                {{ showReviews() ? 'Remove the Reviews tab' : 'Add a Reviews tab' }}
              </button>
            </div>
            <div class="mt-4 rounded-2xl border border-stone-800 bg-stone-900 p-4">
              <app-tabs>
                <app-tab-panel title="Details"><p>A sturdy backpack with two pockets.</p></app-tab-panel>
                <app-tab-panel title="Shipping"><p>Ships in two days.</p></app-tab-panel>
                @if (showReviews()) {
                  <app-tab-panel title="Reviews"><p>4.8 out of 5 from 212 reviews.</p></app-tab-panel>
                }
              </app-tabs>
            </div>
          </app-lesson-card>
        </section>
      </ng-template>

      <ng-template appLessonSection="try-it">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card class="mt-10" variant="highlight" label="PREDICT" heading="Where does the paragraph go?">
            <app-predict-output [challenge]="projectionChallenge" />
          </app-lesson-card>

          <app-knowledge-check [items]="checkItems" />
        </section>
      </ng-template>
    </app-lesson-player>
  `,
})
export class ContentProjectionComponent {
  readonly section = input<string>();

  protected readonly cardContent = signal<'text' | 'list' | 'button'>('text');
  protected readonly showReviews = signal(false);

  protected readonly cardOptions = [
    { id: 'text' as const, label: 'Text' },
    { id: 'list' as const, label: 'A list' },
    { id: 'button' as const, label: 'A button' },
  ];

  // Queries: the page reaches a child component and one of its own elements.
  private readonly counter = viewChild(CounterDemoComponent);
  private readonly nameInput = viewChild.required<ElementRef<HTMLInputElement>>('nameInput');

  protected resetCounter(): void {
    this.counter()?.reset();
  }

  protected focusInput(): void {
    this.nameInput().nativeElement.focus();
  }

  protected readonly wrapperCode = `@Component({
  selector: 'app-fancy-card',
  template: \`
    <div class="card">
      <ng-content />
    </div>
  \`,
})
export class FancyCardComponent {}`;

  protected readonly parentCode = `<app-fancy-card>
  <h3>Hello</h3>
  <p>Anything can go in here.</p>
</app-fancy-card>`;

  protected readonly slotsCode = `<!-- the card's template -->
<header><ng-content select="[card-title]" /></header>
<div><ng-content /></div>
<footer><ng-content select="[card-footer]" /></footer>

<!-- the parent -->
<app-slot-card>
  <span card-title>Order #1042</span>
  <p>Two items are on their way.</p>
  <span card-footer>Placed today</span>
</app-slot-card>`;

  protected readonly queriesCode = `export class PageComponent {
  // in my own template
  counter = viewChild(CounterComponent);                 // Signal<CounterComponent | undefined>
  nameInput = viewChild.required<ElementRef>('nameInput'); // <input #nameInput>

  reset() { this.counter()?.reset(); }
  focus() { this.nameInput().nativeElement.focus(); }
}

export class TabsComponent {
  // what the parent put inside me
  panels = contentChildren(TabPanelComponent);           // Signal<readonly TabPanelComponent[]>
}`;

  protected readonly projectionChallenge: PredictChallenge = {
    question: 'The card component has no <ng-content> in its template. What happens to the paragraph?',
    code: '<!-- app-card template: <div class="card"></div> -->\n<app-card>\n  <p>Hello</p>\n</app-card>',
    options: [
      { id: 'inside', text: 'Hello appears inside the card' },
      { id: 'error', text: 'The build fails with an error' },
      { id: 'nothing', text: 'Nothing: the paragraph has nowhere to go' },
      { id: 'after', text: 'Hello appears after the card' },
    ],
    correct: 'nothing',
    explanation: 'Projected content only appears where an ng-content is. With no ng-content, Angular quietly leaves the content out. There is no error.',
  };

  protected readonly checkItems: KnowledgeCheckItem[] = [
    {
      question: 'When do you reach for content projection instead of an input()?',
      answer: 'When the parent should supply markup, not just a value: a card, dialog or panel that wraps whatever the parent writes inside it.',
    },
    {
      question: 'What is the difference between viewChild and contentChild?',
      answer: 'viewChild looks in the component\'s own template. contentChild looks at what the parent projected into the component between its tags.',
    },
    {
      question: 'Why is a query a signal?',
      answer: 'The thing may not exist yet, or may come and go. As a signal it holds undefined until it is found, and effects or computed values update when it changes.',
    },
  ];
}
