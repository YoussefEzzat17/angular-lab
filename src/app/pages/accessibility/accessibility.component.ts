import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AccordionContent, AccordionGroup, AccordionPanel, AccordionTrigger } from '@angular/aria/accordion';
import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';

import { LessonPlayerComponent } from '../../learn/player/lesson-player.component';
import { LessonSectionDirective } from '../../learn/player/lesson-section.directive';
import { CodeBlockDirective } from '../../shared/code-block.directive';
import { CodeOutputComponent } from '../../shared/code-output.component';
import { CommonMistakeComponent } from '../../shared/common-mistake.component';
import { KnowledgeCheckComponent, KnowledgeCheckItem } from '../../shared/knowledge-check.component';
import { LessonCardComponent } from '../../shared/lesson-card.component';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { PredictChallenge, PredictOutputComponent } from '../../shared/predict-output.component';
import { RecapComponent } from '../../shared/recap.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AccordionContent,
    AccordionGroup,
    AccordionPanel,
    AccordionTrigger,
    CodeBlockDirective,
    CodeOutputComponent,
    CommonMistakeComponent,
    KnowledgeCheckComponent,
    LessonCardComponent,
    LessonPlayerComponent,
    LessonSectionDirective,
    PageHeaderComponent,
    PredictOutputComponent,
    RecapComponent,
  ],
  template: `
    <app-lesson-player [topicId]="'accessibility'" [section]="section()">
      <!-- ── Why ── -->
      <ng-template appLessonSection="why">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-page-header title="Accessibility" illustration="accessibility">
            Accessibility means people can use your app however they work: with a keyboard instead of a mouse, with a screen reader, with bad eyesight, or one-handed on a phone.
            It is also a legal requirement in many places, and it makes your app better for everyone.
          </app-page-header>

          <app-lesson-card class="mt-10" label="1 · THE PROBLEM" heading="A page can look right and still be unusable">
            <p class="mt-2 text-sm text-stone-400">
              If a button is a styled <code class="text-gold-300">&lt;div&gt;</code>, a mouse user sees a button. A keyboard user cannot reach it, and a screen reader says nothing about it.
              The page looks the same, but it is broken for them.
            </p>
          </app-lesson-card>

          <app-lesson-card class="mt-5" tone="amber" label="2 · THE MENTAL MODEL" heading="Two audiences read your page">
            <ul class="mt-3 list-disc space-y-2 pl-5 text-sm text-stone-300">
              <li><strong class="text-stone-100">Eyes</strong> read the pixels: colours, size, layout.</li>
              <li><strong class="text-stone-100">Software</strong> reads the structure: which element is a button, a heading, a list, what each is called. Screen readers and the keyboard rely on it.</li>
              <li>Good HTML serves both at once. Most accessibility is simply using the right element.</li>
            </ul>
          </app-lesson-card>

          <app-lesson-card class="mt-5" label="3 · THE BASICS" heading="Five habits that cover most of it">
            <ol class="mt-3 list-decimal space-y-1 pl-5 text-sm text-stone-300">
              <li>Use the right HTML element for the job.</li>
              <li>Everything clickable must work with the keyboard.</li>
              <li>Every image, button and field needs a name.</li>
              <li>Text must have enough contrast against its background.</li>
              <li>Tell the user when something changes without a page load.</li>
            </ol>
          </app-lesson-card>

          <app-recap class="mt-5" [items]="recapWhy" />
        </section>
      </ng-template>

      <!-- ── Semantic ── -->
      <ng-template appLessonSection="semantic">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card class="mt-10" variant="highlight" label="TRY IT" heading="A div that looks like a button, and a real button">
            <p class="mt-2 text-sm text-stone-400">
              Click both with the mouse: they work. Now press <kbd class="rounded border border-stone-600 px-1.5 text-xs">Tab</kbd> until one is focused and press
              <kbd class="rounded border border-stone-600 px-1.5 text-xs">Enter</kbd>. Only one of them answers.
            </p>
            <app-code-output class="mt-4 block" [code]="semanticCode" caption="The real button gets focus, Enter and Space, and a role, with no extra code.">
              <div class="flex flex-wrap items-center gap-4">
                <div (click)="fakeCount.update(n => n + 1)" class="cursor-pointer rounded-xl bg-stone-700 px-4 py-2 text-sm font-semibold text-stone-100">A div: {{ fakeCount() }}</div>
                <button type="button" (click)="realCount.update(n => n + 1)" class="rounded-xl bg-gold-solid px-4 py-2 text-sm font-semibold text-white hover:bg-gold-solid-hover">A button: {{ realCount() }}</button>
              </div>
            </app-code-output>
          </app-lesson-card>

          <app-lesson-card class="mt-5" label="CHOOSE" heading="The right element for the job">
            <div class="mt-3 overflow-x-auto rounded-xl border border-stone-800">
              <table class="w-full text-left text-sm">
                <thead class="bg-stone-800 text-stone-300">
                  <tr><th class="px-4 py-2 font-semibold">You want</th><th class="px-4 py-2 font-semibold">Use</th><th class="px-4 py-2 font-semibold">Not</th></tr>
                </thead>
                <tbody class="divide-y divide-stone-800 text-stone-400">
                  @for (row of elements; track row.want) {
                    <tr>
                      <td class="px-4 py-2 text-stone-200">{{ row.want }}</td>
                      <td class="whitespace-nowrap px-4 py-2 font-mono text-xs text-gold-300">{{ row.use }}</td>
                      <td class="whitespace-nowrap px-4 py-2 font-mono text-xs">{{ row.not }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="highlight" label="PREDICT" heading="Which one is accessible?">
            <app-predict-output [challenge]="elementChallenge" />
          </app-lesson-card>

          <app-common-mistake class="mt-5" title="An image or icon button with no name" [wrong]="mistakeNameWrong" [right]="mistakeNameRight">
            A screen reader reads a button by its name. An icon alone has none, so it says just "button". Add text or an <code class="text-gold-300">aria-label</code>. Pictures need
            <code class="text-gold-300">alt</code> text, and purely decorative ones get an empty <code class="text-gold-300">alt=""</code>.
          </app-common-mistake>

          <app-recap class="mt-5" [items]="recapSemantic" />
        </section>
      </ng-template>

      <!-- ── Keyboard ── -->
      <ng-template appLessonSection="keyboard">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card class="mt-10" variant="highlight" label="TRY IT" heading="Move through a page with Tab">
            <p class="mt-2 text-sm text-stone-400">
              Click once in the empty space inside the box, then press <kbd class="rounded border border-stone-600 px-1.5 text-xs">Tab</kbd> and
              <kbd class="rounded border border-stone-600 px-1.5 text-xs">Shift</kbd>+<kbd class="rounded border border-stone-600 px-1.5 text-xs">Tab</kbd>. The page says where focus is.
            </p>
            <div class="mt-4 rounded-xl border border-stone-700 p-4" (focusin)="onFocus($event)" (focusout)="focusName.set('nothing')">
              <div class="flex flex-wrap gap-3">
                <button type="button" data-name="Save" class="rounded-xl bg-gold-solid px-4 py-2 text-sm font-semibold text-white">Save</button>
                <button type="button" data-name="Cancel" class="rounded-xl border border-stone-600 px-4 py-2 text-sm font-semibold text-stone-100">Cancel</button>
                <label class="flex items-center gap-2 text-sm text-stone-200"><input type="checkbox" data-name="Subscribe checkbox" class="h-4 w-4" /> Subscribe</label>
                <a href="#keyboard" data-name="Link" (click)="$event.preventDefault()" class="text-sm font-semibold text-gold-300 underline">A link</a>
              </div>
              <p class="mt-3 text-sm text-stone-400" aria-live="polite">Focus is on: <strong class="text-gold-300">{{ focusName() }}</strong></p>
            </div>
          </app-lesson-card>

          <app-lesson-card class="mt-5" label="RULES" heading="What a keyboard user needs">
            <ul class="mt-3 list-disc space-y-2 pl-5 text-sm text-stone-300">
              <li><strong class="text-stone-100">A visible focus ring.</strong> Never remove it with <code class="text-gold-300">outline: none</code> unless you draw a better one.</li>
              <li><strong class="text-stone-100">A sensible order.</strong> Tab follows the HTML order. Do not fight it with <code class="text-gold-300">tabindex="5"</code>; use only <code class="text-gold-300">0</code> or <code class="text-gold-300">-1</code>.</li>
              <li><strong class="text-stone-100">No traps.</strong> A dialog may hold focus inside, but Escape must close it and return focus to where the user was.</li>
              <li><strong class="text-stone-100">A way to skip.</strong> A "Skip to content" link first on the page saves a lot of Tab presses.</li>
            </ul>
          </app-lesson-card>

          <app-common-mistake class="mt-5" title="Removing the focus outline" [wrong]="mistakeFocusWrong" [right]="mistakeFocusRight">
            Without a focus ring a keyboard user cannot tell where they are. Replace the default with your own clear ring, never with nothing.
          </app-common-mistake>

          <app-recap class="mt-5" [items]="recapKeyboard" />
        </section>
      </ng-template>

      <!-- ── Announcing and Aria ── -->
      <ng-template appLessonSection="aria">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card class="mt-10" variant="highlight" label="ANNOUNCE" heading="Tell a screen reader about a change">
            <p class="mt-2 text-sm text-stone-400">
              When something changes without a page load, such as "Saved", a screen reader will not notice by itself. The CDK's <code class="text-gold-300">LiveAnnouncer</code> speaks the message
              (the box below shows what it was asked to say).
            </p>
            <div class="mt-3 flex flex-wrap items-center gap-3">
              <button type="button" (click)="save()" class="min-h-11 rounded-xl bg-gold-solid px-4 text-sm font-semibold text-white hover:bg-gold-solid-hover">Save the note</button>
              <p class="text-sm text-stone-300" data-testid="announced">Announced: <strong class="text-gold-300">{{ announced() || 'nothing yet' }}</strong></p>
            </div>
            <pre class="mt-4" [appCode]="announceCode"></pre>
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="highlight" label="ANGULAR ARIA" heading="Accessible components, ready to style">
            <p class="mt-2 text-sm text-stone-400">
              <code class="text-gold-300">&#64;angular/aria</code> (stable in Angular 22) is a set of <em>headless</em> directives: they add the keyboard behaviour, the roles and the
              <code class="text-gold-300">aria-*</code> attributes of patterns such as accordion, tabs, menu, listbox, combobox, tree and grid. You bring the HTML and the CSS.
              Try the accordion with the mouse and with the arrow keys, Home, End and Enter.
            </p>
            <app-code-output class="mt-4 block" [code]="ariaCode" caption="Inspect the buttons: aria-expanded and aria-controls are added for you.">
              <div ngAccordionGroup [multiExpandable]="false" class="divide-y divide-stone-700 rounded-xl border border-stone-700">
                @for (item of faq; track item.id; let i = $index) {
                  <div>
                    <h3>
                      <button ngAccordionTrigger [panel]="panel" type="button"
                              class="flex min-h-11 w-full items-center justify-between px-3 py-2 text-left text-sm font-semibold text-stone-100 hover:bg-stone-800">
                        {{ item.question }}
                      </button>
                    </h3>
                    <div ngAccordionPanel #panel="ngAccordionPanel">
                      <ng-template ngAccordionContent>
                        <p class="px-3 pb-3 text-sm text-stone-400">{{ item.answer }}</p>
                      </ng-template>
                    </div>
                  </div>
                }
              </div>
            </app-code-output>
          </app-lesson-card>

          <app-lesson-card class="mt-5" label="THE RULE OF ARIA" heading="No ARIA is better than bad ARIA">
            <p class="mt-2 max-w-[60ch] text-sm text-stone-400">
              ARIA attributes only change what assistive software is told, never what the browser does. A <code class="text-gold-300">role="button"</code> on a div says it is a button
              but does not make it focusable or answer Enter. Use the real element first, ARIA second.
            </p>
          </app-lesson-card>

          <app-recap class="mt-5" [items]="recapAria" />
          <app-knowledge-check [items]="checkItems" />
        </section>
      </ng-template>
    </app-lesson-player>
  `,
})
export class AccessibilityComponent {
  readonly section = input<string>();
  private readonly announcer = inject(LiveAnnouncer);

  protected readonly fakeCount = signal(0);
  protected readonly realCount = signal(0);
  protected readonly focusName = signal('nothing');
  protected readonly announced = signal('');

  protected onFocus(event: FocusEvent): void {
    const name = (event.target as HTMLElement).dataset['name'];
    this.focusName.set(name ?? 'nothing');
  }

  protected save(): void {
    const message = 'Note saved';
    this.announced.set(message);
    void this.announcer.announce(message, 'polite');
  }

  protected readonly faq = [
    { id: 1, question: 'What is a headless component?', answer: 'It brings behaviour and accessibility, with no styles. You choose how it looks.' },
    { id: 2, question: 'Which keys does it support?', answer: 'Arrow keys move between items, Home and End jump to the first and last, and Enter or Space opens one.' },
    { id: 3, question: 'Do I still need to test it?', answer: 'Yes. Check your own labels and content with a keyboard and a screen reader.' },
  ];

  protected readonly elements = [
    { want: 'Something to press', use: '<button>', not: '<div (click)>' },
    { want: 'A link to another page', use: '<a href>', not: '<span (click)>' },
    { want: 'A page title and sections', use: '<h1> to <h3>', not: '<div class="big">' },
    { want: 'A list of items', use: '<ul> and <li>', not: 'several <div>' },
    { want: 'A text field with a name', use: '<label for> and <input>', not: 'placeholder only' },
  ];

  protected readonly elementChallenge: PredictChallenge = {
    question: 'You need a control that deletes a file. Which is accessible by default?',
    options: [
      { id: 'a', text: '<div class="btn" (click)="remove()">Delete</div>' },
      { id: 'b', text: '<span role="button" (click)="remove()">Delete</span>' },
      { id: 'c', text: '<button type="button" (click)="remove()">Delete</button>' },
      { id: 'd', text: '<img src="trash.svg" (click)="remove()">' },
    ],
    correct: 'c',
    explanation: 'A real button is focusable, answers Enter and Space, and is announced as a button. The others need extra work, and the image has no name.',
  };

  protected readonly semanticCode = `<!-- avoid -->
<div class="btn" (click)="add()">Add</div>

<!-- prefer -->
<button type="button" (click)="add()">Add</button>`;

  protected readonly mistakeNameWrong = '<button (click)="close()"><svg>…</svg></button>';
  protected readonly mistakeNameRight = '<button type="button" aria-label="Close dialog" (click)="close()"><svg aria-hidden="true">…</svg></button>';
  protected readonly mistakeFocusWrong = 'button:focus { outline: none; }';
  protected readonly mistakeFocusRight = 'button:focus-visible { outline: 2px solid gold; outline-offset: 2px; }';

  protected readonly announceCode = `private announcer = inject(LiveAnnouncer);

save() {
  this.notes.save();
  this.announcer.announce('Note saved', 'polite');   // read out without moving focus
}`;

  protected readonly ariaCode = `import { AccordionGroup, AccordionTrigger, AccordionPanel, AccordionContent } from '@angular/aria/accordion';

<div ngAccordionGroup>
  <h3><button ngAccordionTrigger [panel]="panel">Question</button></h3>
  <div ngAccordionPanel #panel="ngAccordionPanel">
    <ng-template ngAccordionContent><p>Answer</p></ng-template>
  </div>
</div>`;

  protected readonly recapWhy = [
    'Accessibility lets people use your app with a keyboard, a screen reader or low vision.',
    'The browser and assistive software read the structure, not just the pixels.',
    'Most of it is simply using the right element.',
  ];
  protected readonly recapSemantic = [
    'Use button for actions, a for links, h1 to h3 for headings, ul for lists.',
    'Every control needs a name: text, a label or aria-label.',
    'Pictures need alt text; decorative ones get alt="".',
  ];
  protected readonly recapKeyboard = [
    'Everything must work with Tab, Shift+Tab, Enter, Space and Escape.',
    'Keep a clear focus ring; never remove it.',
    'Use tabindex only as 0 or -1, and add a skip link.',
  ];
  protected readonly recapAria = [
    'LiveAnnouncer tells a screen reader about changes that have no page load.',
    '@angular/aria gives accessible behaviour for accordion, tabs, menu and more, with no styles.',
    'ARIA changes what is announced, not what the browser does: use real elements first.',
  ];

  protected readonly checkItems: KnowledgeCheckItem[] = [
    { question: 'Why is a styled div a poor button?', answer: 'It cannot be reached with Tab, ignores Enter and Space, and a screen reader does not know it is a button.' },
    { question: 'When do you need aria-label?', answer: 'When a control has no visible text, such as an icon-only button, so a screen reader still has a name to read.' },
    { question: 'What does LiveAnnouncer do?', answer: 'It makes a screen reader speak a message, such as "Note saved", when something changes without a page load.' },
  ];
}
