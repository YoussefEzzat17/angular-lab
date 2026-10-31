import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ComponentRef, DestroyRef, inject, input, signal, Type, viewChild, ViewContainerRef } from '@angular/core';

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
import { ChartWidgetComponent, NoteWidgetComponent, TableWidgetComponent } from './widgets';

interface WidgetChoice {
  id: string;
  label: string;
  component: Type<{ title: () => string }>;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CodeBlockDirective,
    CodeOutputComponent,
    CommonMistakeComponent,
    KnowledgeCheckComponent,
    LessonCardComponent,
    LessonPlayerComponent,
    LessonSectionDirective,
    NgComponentOutlet,
    PageHeaderComponent,
    PredictOutputComponent,
    RecapComponent,
  ],
  template: `
    <app-lesson-player [topicId]="'dynamic-components'" [section]="section()">
      <!-- ── Why ── -->
      <ng-template appLessonSection="why">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-page-header title="Dynamic Components" illustration="dynamic-components">
            Usually you write the tag of a component in a template, so it is fixed when you build the app. A <strong class="text-stone-200">dynamic component</strong> is one you pick
            <em>while the app is running</em>: a dashboard where the user chooses widgets, or a form built from a list of settings.
          </app-page-header>

          <app-lesson-card class="mt-10" label="1 · THE PROBLEM" heading="The component is not known until later">
            <p class="mt-2 text-sm text-stone-400">
              Imagine a dashboard where each user saves their own widgets: a chart, a table, a note. You cannot write one fixed template for every possible mix.
              You need a way to say "put <em>this</em> component here", where "this" is a value you hold in a variable.
            </p>
          </app-lesson-card>

          <app-lesson-card class="mt-5" tone="amber" label="2 · THE MENTAL MODEL" heading="An empty picture frame and a stack of pictures">
            <ul class="mt-3 list-disc space-y-2 pl-5 text-sm text-stone-300">
              <li><strong class="text-stone-100">The frame</strong> is the spot in your template (an outlet or a container).</li>
              <li><strong class="text-stone-100">The pictures</strong> are component classes you already wrote.</li>
              <li><strong class="text-stone-100">You choose</strong> which picture goes in the frame at run time, and you can hand it its inputs.</li>
            </ul>
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="highlight" label="PREDICT" heading="Is this a dynamic component?">
            <app-predict-output [challenge]="dynamicChallenge" />
          </app-lesson-card>

          <app-recap class="mt-5" [items]="recapWhy" />
        </section>
      </ng-template>

      <!-- ── Outlet ── -->
      <ng-template appLessonSection="outlet">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card class="mt-10" variant="highlight" label="TRY IT" heading="One outlet, three components">
            <div class="mt-3 flex flex-wrap gap-2" role="group" aria-label="Widget">
              @for (w of widgets; track w.id) {
                <button type="button" [attr.aria-pressed]="choice().id === w.id" (click)="choice.set(w)"
                        class="min-h-11 rounded-xl border px-4 text-sm font-semibold transition"
                        [class]="choice().id === w.id ? 'border-gold-400 bg-gold-500/15 text-gold-200' : 'border-stone-700 text-stone-300 hover:bg-stone-800'">{{ w.label }}</button>
              }
            </div>
            <label class="mt-3 block text-xs text-stone-400" for="dyn-title">Title (an input of the widget)</label>
            <input id="dyn-title" type="text" [value]="title()" (input)="title.set($any($event.target).value)"
                   class="mt-1 w-full rounded-xl border border-stone-600 bg-stone-800 px-3 py-2 text-sm text-stone-100 focus:border-gold-400 focus:outline-none sm:max-w-sm" />
            <app-code-output class="mt-4 block" [code]="outletCode" caption="The same line of template shows a different component whenever the variable changes. The inputs follow too.">
              <ng-container [ngComponentOutlet]="choice().component" [ngComponentOutletInputs]="{ title: title() }" />
            </app-code-output>
          </app-lesson-card>

          <app-common-mistake class="mt-5" title="Passing the name of the component as text" [wrong]="mistakeNameWrong" [right]="mistakeNameRight">
            The outlet needs the component <em>class</em> itself, not a string. Keep a map from your own names to classes, such as <code class="text-gold-300">&#123; chart: ChartWidget &#125;</code>, and look the class up.
          </app-common-mistake>

          <app-recap class="mt-5" [items]="recapOutlet" />
        </section>
      </ng-template>

      <!-- ── Create ── -->
      <ng-template appLessonSection="create">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card class="mt-10" label="IN CODE" heading="createComponent when you need full control">
            <p class="mt-2 text-sm text-stone-400">
              The outlet is enough for "show this one". When you add and remove several, keep a handle on each one, or react to events, use a
              <code class="text-gold-300">ViewContainerRef</code>: an empty spot you can fill from your class. <code class="text-gold-300">createComponent</code> returns a
              <code class="text-gold-300">ComponentRef</code> with <code class="text-gold-300">setInput()</code> and <code class="text-gold-300">destroy()</code>.
            </p>
            <pre class="mt-3" [appCode]="createCode"></pre>
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="highlight" label="TRY IT" heading="Add widgets, then remove the last one">
            <div class="mt-3 flex flex-wrap items-center gap-2">
              <button type="button" (click)="addWidget(0)" class="min-h-11 rounded-xl bg-gold-solid px-4 text-sm font-semibold text-white hover:bg-gold-solid-hover">Add a chart</button>
              <button type="button" (click)="addWidget(1)" class="min-h-11 rounded-xl bg-gold-solid px-4 text-sm font-semibold text-white hover:bg-gold-solid-hover">Add a table</button>
              <button type="button" (click)="addWidget(2)" class="min-h-11 rounded-xl bg-gold-solid px-4 text-sm font-semibold text-white hover:bg-gold-solid-hover">Add a note</button>
              <button type="button" (click)="removeLast()" class="min-h-11 rounded-xl border border-stone-600 px-4 text-sm font-semibold text-stone-200 hover:bg-stone-800">Remove the last</button>
              <p class="text-sm text-stone-300" aria-live="polite">Widgets: <strong class="text-gold-300" data-testid="count">{{ count() }}</strong></p>
            </div>
            <div class="mt-4 min-h-16 space-y-2 rounded-xl border border-dashed border-stone-700 p-3">
              <ng-container #host />
              @if (count() === 0) { <p class="text-sm text-stone-500">Nothing here yet.</p> }
            </div>
          </app-lesson-card>

          <app-common-mistake class="mt-5" title="Forgetting to destroy what you created" [wrong]="mistakeLeakWrong" [right]="mistakeLeakRight">
            A component made in code is not removed with the template. Call <code class="text-gold-300">destroy()</code> (or clear the container) when you are done, or it keeps working in the background.
          </app-common-mistake>

          <app-recap class="mt-5" [items]="recapCreate" />
        </section>
      </ng-template>

      <!-- ── When ── -->
      <ng-template appLessonSection="when">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card class="mt-10" label="CHOOSE" heading="Often you do not need a dynamic component">
            <div class="mt-3 overflow-x-auto rounded-xl border border-stone-800">
              <table class="w-full text-left text-sm">
                <thead class="bg-stone-800 text-stone-300">
                  <tr><th class="px-4 py-2 font-semibold">Situation</th><th class="px-4 py-2 font-semibold">Use</th></tr>
                </thead>
                <tbody class="divide-y divide-stone-800 text-stone-400">
                  @for (row of choices; track row.situation) {
                    <tr><td class="px-4 py-2 text-stone-200">{{ row.situation }}</td><td class="px-4 py-2 font-mono text-xs text-gold-300">{{ row.use }}</td></tr>
                  }
                </tbody>
              </table>
            </div>
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="highlight" label="PREDICT" heading="Pick the simplest tool">
            <app-predict-output [challenge]="toolChallenge" />
          </app-lesson-card>

          <app-recap class="mt-5" [items]="recapWhen" />
          <app-knowledge-check [items]="checkItems" />
        </section>
      </ng-template>
    </app-lesson-player>
  `,
})
export class DynamicComponentsComponent {
  readonly section = input<string>();

  protected readonly widgets: WidgetChoice[] = [
    { id: 'chart', label: 'Chart', component: ChartWidgetComponent },
    { id: 'table', label: 'Table', component: TableWidgetComponent },
    { id: 'note', label: 'Note', component: NoteWidgetComponent },
  ];
  protected readonly choice = signal(this.widgets[0]);
  protected readonly title = signal('Weekly progress');

  private readonly host = viewChild('host', { read: ViewContainerRef });
  private readonly created: ComponentRef<unknown>[] = [];
  protected readonly count = signal(0);

  constructor() {
    inject(DestroyRef).onDestroy(() => this.created.forEach((ref) => ref.destroy()));
  }

  protected addWidget(index: number): void {
    const container = this.host();
    if (!container) return;
    const ref = container.createComponent(this.widgets[index].component);
    ref.setInput('title', `${this.widgets[index].label} #${this.created.length + 1}`);
    this.created.push(ref);
    this.count.set(this.created.length);
  }

  protected removeLast(): void {
    this.created.pop()?.destroy();
    this.count.set(this.created.length);
  }

  protected readonly dynamicChallenge: PredictChallenge = {
    question: 'Which of these picks the component at run time?',
    options: [
      { id: 'a', text: '<app-chart-widget />' },
      { id: 'b', text: '<ng-container [ngComponentOutlet]="widgetType()" />' },
      { id: 'c', text: '<app-card><p>Hello</p></app-card>' },
      { id: 'd', text: '<router-outlet />' },
    ],
    correct: 'b',
    explanation: 'Only the outlet takes the component class from a variable. The first is fixed when you build, the third is content projection, and the router outlet picks by URL.',
  };

  protected readonly toolChallenge: PredictChallenge = {
    question: 'A card shows one of two layouts, chosen by a boolean you already have. What is the simplest tool?',
    options: [
      { id: 'a', text: 'createComponent' },
      { id: 'b', text: 'ngComponentOutlet' },
      { id: 'c', text: '@if with @else' },
      { id: 'd', text: 'A custom injector' },
    ],
    correct: 'c',
    explanation: 'For a fixed small set of choices, an @if or @switch is simpler and easier to read. Use a dynamic component only when the set is open-ended or comes from data.',
  };

  protected readonly outletCode = `widget = signal(ChartWidget);       // the class, not a string

<ng-container
  [ngComponentOutlet]="widget()"
  [ngComponentOutletInputs]="{ title: 'Weekly progress' }" />`;

  protected readonly createCode = `private host = viewChild('host', { read: ViewContainerRef });
private refs: ComponentRef<unknown>[] = [];

add() {
  const ref = this.host()!.createComponent(ChartWidget);
  ref.setInput('title', 'Sales');
  this.refs.push(ref);
}

removeLast() {
  this.refs.pop()?.destroy();
}`;

  protected readonly mistakeNameWrong = `<ng-container [ngComponentOutlet]="'ChartWidget'" />`;
  protected readonly mistakeNameRight = `registry = { chart: ChartWidget, table: TableWidget };

<ng-container [ngComponentOutlet]="registry[kind()]" />`;
  protected readonly mistakeLeakWrong = `this.host.createComponent(Widget);       // never destroyed`;
  protected readonly mistakeLeakRight = `const ref = this.host.createComponent(Widget);
this.destroyRef.onDestroy(() => ref.destroy());`;

  protected readonly choices = [
    { situation: 'Two or three known layouts', use: '@if or @switch' },
    { situation: 'A page for each URL', use: 'the router' },
    { situation: 'Wrap whatever the parent writes', use: 'ng-content' },
    { situation: 'A user-built or data-driven set of components', use: 'ngComponentOutlet' },
    { situation: 'Add, remove and control many in code', use: 'ViewContainerRef.createComponent' },
  ];

  protected readonly recapWhy = [
    'A dynamic component is chosen while the app runs.',
    'It is useful when the set of components comes from data or the user.',
    'You hold the component class in a variable, and show it in an outlet.',
  ];
  protected readonly recapOutlet = [
    'ngComponentOutlet shows the component class you give it.',
    'ngComponentOutletInputs passes values to its inputs.',
    'Pass the class, never a string.',
  ];
  protected readonly recapCreate = [
    'ViewContainerRef.createComponent builds a component in code.',
    'The ComponentRef has setInput() and destroy().',
    'Destroy what you create when you are done.',
  ];
  protected readonly recapWhen = [
    'For a small fixed set, use @if or @switch.',
    'Use the router for pages, ng-content for wrappers.',
    'Reach for a dynamic component when the set is open-ended.',
  ];

  protected readonly checkItems: KnowledgeCheckItem[] = [
    { question: 'What does ngComponentOutlet need?', answer: 'The component class itself, held in a variable. You can pass inputs with ngComponentOutletInputs.' },
    { question: 'When would you use createComponent instead of an outlet?', answer: 'When you add and remove several components in code and need a handle on each one.' },
    { question: 'Why is @if often better than a dynamic component?', answer: 'For a few known choices it is simpler and easier to read, and the compiler checks everything at build time.' },
  ];
}
