import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

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
import { GreetingDemoComponent, HostDemoComponent, ProfileCardComponent, ScopedDemoComponent } from './components-demos';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CodeBlockDirective,
    CodeOutputComponent,
    CommonMistakeComponent,
    GreetingDemoComponent,
    HostDemoComponent,
    KnowledgeCheckComponent,
    LessonCardComponent,
    LessonPlayerComponent,
    LessonSectionDirective,
    PageHeaderComponent,
    PredictOutputComponent,
    ProfileCardComponent,
    RecapComponent,
    ScopedDemoComponent,
  ],
  template: `
    <app-lesson-player [topicId]="'components'" [section]="section()">
      <!-- ── Anatomy ── -->
      <ng-template appLessonSection="anatomy">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-page-header title="Component Essentials" illustration="components">
            A component is the piece you build everything from. It has <strong class="text-stone-200">a class</strong> for its data and behaviour,
            <strong class="text-stone-200">a template</strong> for what it shows, and <strong class="text-stone-200">styles</strong> for how it looks.
          </app-page-header>

          <app-lesson-card class="mt-10" label="1 · THE PROBLEM" heading="One big page is hard to change">
            <p class="mt-2 text-sm text-stone-400">
              If a whole screen is one huge file, a small change can break something far away, and you copy the same card or button again and again.
              Splitting the screen into components gives each piece one job and one place to live.
            </p>
          </app-lesson-card>

          <app-lesson-card class="mt-5" tone="amber" label="2 · THE MENTAL MODEL" heading="A custom HTML tag you design yourself">
            <p class="mt-2 text-sm text-stone-400">
              HTML has tags such as <code class="text-gold-300">&lt;button&gt;</code> and <code class="text-gold-300">&lt;input&gt;</code>. A component lets you invent your own,
              like <code class="text-gold-300">&lt;app-greeting /&gt;</code>, and decide what it shows and does. Once it exists you use it as many times as you like.
            </p>
          </app-lesson-card>

          <app-lesson-card class="mt-5" label="3 · THE THREE PARTS" heading="Class, template and styles">
            <app-code-output class="mt-4 block" [code]="anatomyCode" caption="One definition, used twice with different data. Each use is its own copy.">
              <div class="space-y-2">
                <app-greeting-demo name="Ada" />
                <app-greeting-demo name="Grace" />
              </div>
            </app-code-output>
            <ul class="mt-4 list-disc space-y-1 pl-5 text-sm text-stone-300">
              <li><strong class="text-stone-100">The class</strong> holds the data, here an input called name.</li>
              <li><strong class="text-stone-100">The template</strong> is the HTML that uses that data.</li>
              <li><strong class="text-stone-100">The decorator</strong>, <code class="text-gold-300">&#64;Component</code>, ties them together and gives the component its tag.</li>
            </ul>
          </app-lesson-card>

          <app-common-mistake class="mt-5" title="Using a component without importing it" [wrong]="mistakeImportWrong" [right]="mistakeImportRight">
            A standalone component only knows the components listed in its own <code class="text-gold-300">imports</code>. Without the import Angular says the element is not a known element.
          </app-common-mistake>

          <app-recap class="mt-5" [items]="recapAnatomy" />
        </section>
      </ng-template>

      <!-- ── Selector ── -->
      <ng-template appLessonSection="selector">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card class="mt-10" label="THE TAG NAME" heading="The selector decides how you write the component">
            <p class="mt-2 text-sm text-stone-400">
              <code class="text-gold-300">selector: 'app-greeting'</code> means you write <code class="text-gold-300">&lt;app-greeting /&gt;</code> wherever you want it.
              The prefix, <code class="text-gold-300">app-</code> by default, keeps your tags from clashing with real HTML elements.
            </p>
            <pre class="mt-4" [appCode]="selectorCode"></pre>
          </app-lesson-card>

          <app-lesson-card class="mt-5" label="GOOD TO KNOW" heading="Selectors follow CSS rules">
            <div class="mt-3 overflow-x-auto rounded-xl border border-stone-800">
              <table class="w-full text-left text-sm">
                <thead class="bg-stone-800 text-stone-300">
                  <tr><th class="px-4 py-2 font-semibold">Selector</th><th class="px-4 py-2 font-semibold">You write</th><th class="px-4 py-2 font-semibold">Use</th></tr>
                </thead>
                <tbody class="divide-y divide-stone-800 text-stone-400">
                  @for (row of selectorRows; track row.selector) {
                    <tr>
                      <td class="whitespace-nowrap px-4 py-2 font-mono text-gold-300">{{ row.selector }}</td>
                      <td class="whitespace-nowrap px-4 py-2 font-mono text-xs">{{ row.usage }}</td>
                      <td class="px-4 py-2">{{ row.note }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="highlight" label="PREDICT" heading="Which tag shows this component?">
            <app-predict-output [challenge]="selectorChallenge" />
          </app-lesson-card>

          <app-recap class="mt-5" [items]="recapSelector" />
        </section>
      </ng-template>

      <!-- ── Styling ── -->
      <ng-template appLessonSection="styling">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card class="mt-10" label="THE PROBLEM" heading="CSS is global, so one rule can change the whole page">
            <p class="mt-2 text-sm text-stone-400">
              In plain CSS a rule such as <code class="text-gold-300">.tag</code> applies to every element with that class, anywhere. Angular avoids this by default:
              the styles you write in a component only apply to that component's own template. This is called <strong class="text-stone-200">view encapsulation</strong>.
            </p>
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="highlight" label="SEE IT" heading="Same class name, only one is styled">
            <app-code-output class="mt-4 block" [code]="scopedCode" caption="Both elements have class tag. Only the one inside the component gets the gold pill, because the rule belongs to that component.">
              <div class="flex flex-wrap items-center gap-3">
                <app-scoped-demo />
                <span class="tag">tag outside</span>
              </div>
            </app-code-output>
          </app-lesson-card>

          <app-lesson-card class="mt-5" label=":host" heading="Style the component's own tag from the inside">
            <p class="mt-2 text-sm text-stone-400">
              A component's tag is its <em>host</em>. Inside a component's styles, <code class="text-gold-300">:host</code> targets that tag.
              Add <code class="text-gold-300">display: block</code> there, because custom tags are inline by default.
            </p>
            <app-code-output class="mt-4 block" [code]="hostCode" caption="The dashed border belongs to the host element, <app-host-demo>.">
              <app-host-demo><p class="text-sm text-stone-300">Content inside the host.</p></app-host-demo>
            </app-code-output>
          </app-lesson-card>

          <app-lesson-card class="mt-5" label="THE SWITCH" heading="Encapsulation modes">
            <pre class="mt-3" [appCode]="encapsulationCode"></pre>
            <ul class="mt-3 list-disc space-y-1 pl-5 text-sm text-stone-300">
              <li><code class="text-gold-300">Emulated</code> (default): Angular adds attributes so styles stay inside.</li>
              <li><code class="text-gold-300">None</code>: the styles become global. Use rarely.</li>
              <li><code class="text-gold-300">ShadowDom</code>: the browser's own isolation.</li>
            </ul>
          </app-lesson-card>

          <app-common-mistake class="mt-5" title="Styling a child's inner elements from the parent" [wrong]="mistakeStyleWrong" [right]="mistakeStyleRight">
            A parent's styles stop at the child's tag. To change how a child looks, let the child accept an input or a CSS custom property, instead of reaching inside it.
          </app-common-mistake>

          <app-recap class="mt-5" [items]="recapStyling" />
        </section>
      </ng-template>

      <!-- ── Try it ── -->
      <ng-template appLessonSection="try-it">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card class="mt-10" variant="highlight" label="TRY IT" heading="Use one component many times">
            <p class="mt-2 text-sm text-stone-400">
              Fill in a name and a role, then add the person. Each card is a separate use of the same component.
            </p>
            <div class="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
              <label class="block text-xs text-stone-400">Name
                <input type="text" [value]="name()" (input)="name.set($any($event.target).value)"
                       class="mt-1 w-full rounded-xl border border-stone-600 bg-stone-800 px-3 py-2 text-sm text-stone-100 focus:border-gold-400 focus:outline-none" />
              </label>
              <label class="block text-xs text-stone-400">Role
                <input type="text" [value]="role()" (input)="role.set($any($event.target).value)"
                       class="mt-1 w-full rounded-xl border border-stone-600 bg-stone-800 px-3 py-2 text-sm text-stone-100 focus:border-gold-400 focus:outline-none" />
              </label>
              <button type="button" (click)="add()" class="min-h-11 rounded-xl bg-gold-solid px-4 text-sm font-semibold text-white hover:bg-gold-solid-hover">Add person</button>
            </div>
            @if (emptyName()) {
              <p class="mt-2 text-sm text-rose-300">Enter a name first.</p>
            }
            <app-code-output class="mt-4 block" [code]="tryCode" caption="The people list lives in the parent. The loop makes one card per item.">
              <div class="space-y-2">
                @for (person of people(); track person.id) {
                  <app-profile-card [name]="person.name" [role]="person.role" />
                } @empty {
                  <p class="text-sm text-stone-500">No people yet.</p>
                }
              </div>
            </app-code-output>
          </app-lesson-card>

          <app-recap class="mt-5" [items]="recapTry" />
          <app-knowledge-check [items]="checkItems" />
        </section>
      </ng-template>
    </app-lesson-player>
  `,
})
export class ComponentsComponent {
  readonly section = input<string>();

  protected readonly name = signal('');
  protected readonly role = signal('');
  protected readonly emptyName = signal(false);
  protected readonly people = signal([
    { id: 1, name: 'Ada', role: 'Engineer' },
    { id: 2, name: 'Grace', role: 'Admiral' },
  ]);
  private nextId = 3;

  protected add(): void {
    const name = this.name().trim();
    this.emptyName.set(!name);
    if (!name) return;
    this.people.update((list) => [...list, { id: this.nextId++, name, role: this.role().trim() || 'Learner' }]);
    this.name.set('');
    this.role.set('');
  }

  protected readonly anatomyCode = `@Component({
  selector: 'app-greeting',
  template: '<p>Hello, {{ name() }}!</p>',
})
export class Greeting {
  name = input('friend');
}

<app-greeting name="Ada" />
<app-greeting name="Grace" />`;

  protected readonly mistakeImportWrong = `@Component({
  selector: 'app-page',
  template: '<app-greeting name="Ada" />',
})`;
  protected readonly mistakeImportRight = `@Component({
  selector: 'app-page',
  imports: [Greeting],
  template: '<app-greeting name="Ada" />',
})`;

  protected readonly selectorCode = `@Component({
  selector: 'app-greeting',   // use it as <app-greeting />
  template: '...',
})`;

  protected readonly selectorRows = [
    { selector: 'app-card', usage: '<app-card />', note: 'An element. The normal choice for a component.' },
    { selector: '[appHighlight]', usage: '<p appHighlight>', note: 'An attribute. Used for directives, not components.' },
    { selector: '.app-card', usage: '<div class="app-card">', note: 'A class. Works, but rarely used.' },
  ];

  protected readonly selectorChallenge: PredictChallenge = {
    question: 'A component has selector: \'app-badge\'. Which line shows it?',
    options: [
      { id: 'a', text: '<badge />' },
      { id: 'b', text: '<div app-badge></div>' },
      { id: 'c', text: '<app-badge />' },
      { id: 'd', text: '<AppBadge />' },
    ],
    correct: 'c',
    explanation: 'An element selector is the tag name exactly as written. Remember to list the component in imports, too.',
  };

  protected readonly scopedCode = `@Component({
  selector: 'app-scoped-demo',
  template: '<span class="tag">tag inside the component</span>',
  styles: '.tag { color: gold; border: 1px solid gold; }',
})

<app-scoped-demo />
<span class="tag">tag outside</span>`;

  protected readonly hostCode = `@Component({
  selector: 'app-host-demo',
  template: '<ng-content />',
  styles: ':host { display: block; border: 1px dashed gold; }',
})`;

  protected readonly encapsulationCode = `@Component({
  encapsulation: ViewEncapsulation.Emulated,   // the default
  styles: '...',
})`;

  protected readonly mistakeStyleWrong = `/* in the parent's styles */
.title { color: red; }          /* the child's <h2 class="title"> is not affected */`;
  protected readonly mistakeStyleRight = `// the child exposes a choice
tone = input<'normal' | 'warning'>('normal');

<h2 [class.warning]="tone() === 'warning'">...</h2>`;

  protected readonly tryCode = `people = signal([{ id: 1, name: 'Ada', role: 'Engineer' }]);

@for (person of people(); track person.id) {
  <app-profile-card [name]="person.name" [role]="person.role" />
}`;

  protected readonly recapAnatomy = [
    'A component is a class, a template and styles, tied together by @Component.',
    'The selector is the custom tag you write to use it.',
    'List a component in imports before using its tag.',
  ];
  protected readonly recapSelector = [
    'Element selectors such as app-card are the normal choice for components.',
    'Use a prefix like app- so your tags never clash with real HTML.',
    'Attribute selectors belong to directives.',
  ];
  protected readonly recapStyling = [
    'A component\'s styles apply only to its own template by default.',
    ':host styles the component\'s own tag, and often needs display: block.',
    'Encapsulation can be changed, but Emulated is the right default.',
  ];
  protected readonly recapTry = [
    'One component can be used as many times as you like.',
    'The parent owns the data and passes it down with inputs.',
    'Next stop: data binding, how the template shows that data.',
  ];

  protected readonly checkItems: KnowledgeCheckItem[] = [
    { question: 'What are the three parts of a component?', answer: 'A class for data and behaviour, a template for the HTML, and styles for the look. The @Component decorator ties them together.' },
    { question: 'Why do styles in a component not affect other components?', answer: 'View encapsulation: by default Angular scopes a component\'s styles to its own template.' },
    { question: 'What does :host target?', answer: 'The component\'s own tag, for example <app-card>. Add display: block there because custom tags are inline by default.' },
  ];
}
