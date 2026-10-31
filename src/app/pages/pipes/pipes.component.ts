import { CurrencyPipe, DatePipe, LowerCasePipe, PercentPipe, SlicePipe, UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, Pipe, PipeTransform, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CodeBlockDirective } from '../../shared/code-block.directive';
import { LessonCardComponent } from '../../shared/lesson-card.component';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { PredictOutputComponent } from '../../shared/predict-output.component';
import { CodeOutputComponent } from '../../shared/code-output.component';
import { CommonMistakeComponent } from '../../shared/common-mistake.component';
import { RecapComponent } from '../../shared/recap.component';
import type { PredictChallenge } from '../../shared/predict-output.component';
import { CallCounterDemoComponent } from './call-counter-demo.component';
import { PipeChainDemoComponent } from './pipe-chain-demo.component';
import { KnowledgeCheckComponent, KnowledgeCheckItem } from '../../shared/knowledge-check.component';
import { LessonPlayerComponent } from '../../learn/player/lesson-player.component';
import { LessonSectionDirective } from '../../learn/player/lesson-section.directive';

@Pipe({ name: 'truncate', standalone: true })
class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 20): string {
    return value.length > limit ? value.slice(0, limit) + '...' : value;
  }
}

type PipeMode = 'currency' | 'date' | 'uppercase' | 'lowercase' | 'percent' | 'truncate';

interface PipeOption {
  mode: PipeMode;
  label: string;
  syntax: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CodeOutputComponent, CommonMistakeComponent, RecapComponent, CallCounterDemoComponent, PipeChainDemoComponent, PredictOutputComponent, FormsModule, CurrencyPipe, DatePipe, UpperCasePipe, LowerCasePipe, PercentPipe, SlicePipe, TruncatePipe, CodeBlockDirective, KnowledgeCheckComponent, LessonPlayerComponent, LessonSectionDirective, PageHeaderComponent, LessonCardComponent],
  template: `
    <app-lesson-player [topicId]="'pipes'" [section]="section()">
      <ng-template appLessonSection="builtin">
      <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <app-page-header title="Pipes" illustration="pipes">
        A pipe transforms a value <strong class="text-gold-300">right inside the template</strong>, using the <code class="text-gold-300">|</code> symbol —
        without touching the actual value stored in your component. Format dates, prices, and text for humans, in one keyword.
      </app-page-header>

      <!-- 1 · THE PROBLEM -->
      <app-lesson-card class="mt-10" label="1 · The problem" heading="Raw data doesn't always look presentable">
        <div class="mt-4 grid gap-4 sm:grid-cols-2">
          <div class="min-w-0 rounded-xl bg-stone-800 p-4">
            <p class="text-xs font-bold text-rose-300">We have</p>
            <pre class="mt-2 text-sm text-stone-300">price = 49.9;
&lt;p&gt;{{ '{{ price }}' }}&lt;/p&gt;</pre>
            <p class="mt-2 text-xs text-stone-500">renders as: <span class="text-stone-300">49.9</span></p>
          </div>
          <div class="min-w-0 rounded-xl bg-gold-950/30 p-4">
            <p class="text-xs font-bold text-emerald-300">We want</p>
            <pre class="mt-2 text-sm text-gold-100">price = 49.9;
&lt;p&gt;{{ '{{ price | currency }}' }}&lt;/p&gt;</pre>
            <p class="mt-2 text-xs text-stone-500">renders as: <span class="text-emerald-300">$49.90</span></p>
          </div>
        </div>
      </app-lesson-card>

      <app-lesson-card class="mt-5" label="2 · THE MENTAL MODEL" heading="A conveyor belt with stations" tone="amber">
        <ul class="mt-3 list-disc space-y-2 pl-5 text-sm text-stone-300">
          <li><strong class="text-stone-100">Your data</strong> sits in the warehouse (the class) and never changes.</li>
          <li><strong class="text-stone-100">A copy</strong> rides the belt to the page. Each <code class="text-gold-300">|</code> is a station that changes how the copy looks: <code class="text-gold-300">uppercase</code>, <code class="text-gold-300">currency</code>, <code class="text-gold-300">date</code>.</li>
          <li><strong class="text-stone-100">The page</strong> shows what comes off the end. The original is untouched, so the same value can look different in different places.</li>
        </ul>
      </app-lesson-card>

      <app-lesson-card class="mt-5" label="3 · ARGUMENTS" heading="Give a pipe options with a colon">
        <p class="mt-2 text-sm text-stone-400">
          Most pipes accept settings after the name, each separated by a colon. The first one is usually the most important (the format, the currency, the length).
        </p>
        <pre class="mt-4 overflow-x-auto rounded-xl bg-stone-950 p-4 text-xs text-gold-200">{{ argsCode }}</pre>
      </app-lesson-card>

      <app-lesson-card class="mt-5" label="SEE IT" heading="The same values, formatted by pipes">
        <app-code-output class="mt-4 block" [code]="builtinCode" caption="The values in the class never change. Only what the page shows does.">
          <p>{{ price | currency }}</p>
          <p>{{ today | date: 'longDate' }}</p>
          <p>{{ ratio | percent: '1.0-1' }}</p>
          <p>{{ title | slice: 0 : 6 }}</p>
        </app-code-output>
      </app-lesson-card>

      <!-- 4 · CHEAT SHEET -->
      <app-lesson-card class="mt-5" label="4 · Quick cheat sheet" heading="Built-in pipes you'll use every day">
        <div class="mt-4 overflow-x-auto rounded-xl border border-stone-800">
          <table class="w-full text-left text-sm">
            <thead class="bg-stone-800 text-stone-300">
              <tr>
                <th class="px-4 py-2 font-semibold">Pipe</th>
                <th class="px-4 py-2 font-semibold">Example</th>
                <th class="px-4 py-2 font-semibold">Result</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-stone-800 text-stone-400">
              @for (row of cheatSheet; track row.op) {
                <tr>
                  <td class="whitespace-nowrap px-4 py-2 font-mono text-gold-300">{{ row.op }}</td>
                  <td class="whitespace-nowrap px-4 py-2 font-mono text-xs text-stone-500">{{ row.use }}</td>
                  <td class="px-4 py-2">{{ row.result }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </app-lesson-card>
      <app-recap class="mt-5" [items]="recapBuiltin" />
      </section>
      </ng-template>

      <ng-template appLessonSection="chain">
      <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <app-lesson-card class="mt-10" label="CHAINING" heading="Pipes can be stacked, and the order matters">
        <p class="mt-2 text-sm text-stone-400">
          Put one pipe after another: each takes the result of the one before it. <code class="text-gold-300">title | uppercase | slice:0:8</code> first makes the text capitals, then keeps the first eight characters.
          Swap two pipes and you can get a different result.
        </p>
      </app-lesson-card>

      <app-lesson-card class="mt-5" label="SEE IT" heading="Read it from left to right">
        <app-code-output class="mt-4 block" [code]="chainCode" caption="uppercase runs first, then slice keeps the first eight characters of that result.">
          <p>{{ title }}</p>
          <p>{{ title | uppercase }}</p>
          <p>{{ title | uppercase | slice: 0 : 8 }}</p>
        </app-code-output>
      </app-lesson-card>

      <app-lesson-card class="mt-5" variant="highlight" label="TRY IT" heading="Build a chain and read it station by station">
        <ol class="mt-2 list-decimal space-y-1 pl-5 text-sm text-stone-400">
          <li>Click <strong class="text-stone-200">uppercase</strong>, then <strong class="text-stone-200">slice:0:8</strong>. See the value at every step.</li>
          <li>Click <strong class="text-stone-200">uppercase</strong> and <strong class="text-stone-200">lowercase</strong> in both orders. Which one wins?</li>
        </ol>
        <app-pipe-chain-demo />
      </app-lesson-card>

      <app-lesson-card class="mt-5" variant="highlight" label="PREDICT" heading="What does this chain show?">
        <app-predict-output [challenge]="chainChallenge" />
      </app-lesson-card>
      <app-recap class="mt-5" [items]="recapChain" />
      </section>
      </ng-template>

      <ng-template appLessonSection="custom">
      <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <!-- 3 · CUSTOM PIPE -->
      <app-lesson-card class="mt-5" label="3 · Custom pipes" heading="When built-in pipes aren't enough">
        <p class="mt-2 text-sm text-stone-400">A custom pipe is a class with a <code class="text-gold-300">transform()</code> method — reusable anywhere in the app. The truncate pipe above is a real one, defined right in this page:</p>
        <app-code-output class="mt-4 block" [code]="customCode" caption="The first argument after the colon is the limit. The default is 20.">
          <p>{{ longTitle | truncate: 14 }}</p>
          <p>{{ longTitle | truncate }}</p>
        </app-code-output>
      </app-lesson-card>
      <app-common-mistake class="mt-5" title="Forgetting to import the pipe" [wrong]="mistakeImportWrong" [right]="mistakeImportRight">
        In a standalone component a pipe is not available until you list it in <code class="text-gold-300">imports</code>. The error says the pipe could not be found.
      </app-common-mistake>
      <app-recap class="mt-5" [items]="recapCustom" />
      </section>
      </ng-template>

      <ng-template appLessonSection="pure-impure">
      <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <!-- 5 · PURE VS IMPURE -->
      <app-lesson-card class="mt-5" label="5 · Pure vs impure" heading="Angular only re-runs a pipe when it has to">
        <p class="mt-2 text-sm text-stone-400">
          A <strong class="text-gold-300">pure</strong> pipe (the default) runs only when its input or arguments change by reference.
          Primitives such as numbers and strings compare by value, so a new string re-runs the pipe. For objects and arrays,
          mutating the same reference does <em>not</em> re-run it.
        </p>
        <p class="mt-3 text-sm text-stone-400">
          An <strong class="text-gold-300">impure</strong> pipe (<code class="text-gold-300">pure: false</code>) runs on every change-detection
          cycle. It catches in-place mutations, but it costs performance, so reach for it only when you truly need it.
        </p>
        <pre class="mt-4 overflow-x-auto rounded-xl bg-stone-950 p-4 text-xs text-gold-200">&#64;Pipe(&#123; name: 'filterDone', pure: false &#125;)</pre>
      </app-lesson-card>

      <app-lesson-card class="mt-5" label="WHY NOT A METHOD?" heading="A pure pipe is skipped when nothing changed">
        <p class="mt-2 text-sm text-stone-400">
          You could format a value with a method in the template, like <code class="text-gold-300">shout(name())</code>. But Angular runs every binding in a component's template each time it
          checks that component. A pure pipe is only called again when its input changes.
        </p>
        <ol class="mt-3 list-decimal space-y-1 pl-5 text-sm text-stone-400">
          <li>Press <strong class="text-stone-200">Re-render the page</strong> five times, then <strong class="text-stone-200">Show the counts</strong>.</li>
          <li>Press <strong class="text-stone-200">Change the name</strong>, and show the counts again.</li>
        </ol>
        <app-call-counter-demo />
      </app-lesson-card>

      <app-common-mistake class="mt-5" title="Mutating an array and expecting the pipe to update" [wrong]="mistakeMutateWrong" [right]="mistakeMutateRight">
        A pure pipe re-runs only when its input <em>reference</em> changes. Pass a new array. Making the pipe impure also works, but it then runs on every check, which gets slow on big lists.
      </app-common-mistake>
      <app-recap class="mt-5" [items]="recapPure" />
      </section>
      </ng-template>

      <ng-template appLessonSection="try-it">
      <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <!-- 2 · INTERACTIVE PLAYGROUND -->
      <app-lesson-card
        class="mt-5"
        variant="highlight"
        label="2 · Try it — pick a pipe, watch it transform live"
        heading="Same raw value, five different pipes"
      >

        <div class="mt-4 flex flex-wrap gap-2">
          @for (option of pipeOptions; track option.mode) {
            <button
              type="button"
              (click)="mode.set(option.mode)"
              class="rounded-lg px-3 py-2 text-sm font-semibold transition"
              [class.bg-gold-solid]="mode() === option.mode"
              [class.text-white]="mode() === option.mode"
              [class.bg-stone-800]="mode() !== option.mode"
              [class.text-stone-300]="mode() !== option.mode"
            >
              {{ option.label }}
            </button>
          }
        </div>

        <div class="mt-5 grid gap-4 sm:grid-cols-2">
          <div class="rounded-xl bg-stone-900 p-4">
            <p class="text-xs text-stone-400">Raw value (edit it)</p>

            @if (mode() === 'currency' || mode() === 'percent') {
              <input
                aria-label="Raw number"
                type="number"
                step="0.01"
                [ngModel]="numberValue()"
                (ngModelChange)="numberValue.set($event)"
                class="mt-2 w-full rounded-lg border border-stone-700 bg-stone-800 px-3 py-2 text-stone-100 focus:border-gold-400 focus:outline-none"
              />
            } @else if (mode() === 'date') {
              <input
                aria-label="Raw date"
                type="date"
                [ngModel]="dateInputValue()"
                (ngModelChange)="onDateChange($event)"
                class="mt-2 w-full rounded-lg border border-stone-700 bg-stone-800 px-3 py-2 text-stone-100 focus:border-gold-400 focus:outline-none"
              />
            } @else {
              <input
                aria-label="Raw text"
                type="text"
                [ngModel]="textValue()"
                (ngModelChange)="textValue.set($event)"
                class="mt-2 w-full rounded-lg border border-stone-700 bg-stone-800 px-3 py-2 text-stone-100 focus:border-gold-400 focus:outline-none"
              />
            }

            @if (mode() === 'truncate') {
              <label class="mt-3 block text-xs text-stone-400">
                Limit: {{ truncateLimit() }} characters
                <input
                  type="range"
                  min="4"
                  max="40"
                  [ngModel]="truncateLimit()"
                  (ngModelChange)="truncateLimit.set($event)"
                  class="mt-1 w-full accent-gold-500"
                />
              </label>
            }

            <p class="mt-3 rounded-lg bg-stone-950 px-3 py-2 font-mono text-xs text-stone-500">
              {{ '{{ value | ' + pipeSyntax() + ' }}' }}
            </p>
          </div>

          <div class="rounded-xl bg-stone-900 p-4">
            <p class="text-xs text-stone-400">Displayed result</p>
            <div class="mt-2 flex h-[68px] items-center rounded-lg border border-gold-400/30 bg-gold-500/10 px-3 text-lg font-semibold text-gold-200">
              @switch (mode()) {
                @case ('currency') { {{ numberValue() | currency }} }
                @case ('percent') { {{ (numberValue() / 100) | percent }} }
                @case ('date') { {{ dateValue() | date: 'longDate' }} }
                @case ('uppercase') { {{ textValue() | uppercase }} }
                @case ('lowercase') { {{ textValue() | lowercase }} }
                @case ('truncate') { {{ textValue() | truncate: truncateLimit() }} }
              }
            </div>
            <p class="mt-3 text-xs text-stone-500">These are Angular's real built-in pipes running live — not a simulation.</p>
          </div>
        </div>
      </app-lesson-card>
      <app-recap class="mt-5" [items]="recapTry" />
      <app-knowledge-check [items]="checkItems" />
      </section>
      </ng-template>
    </app-lesson-player>
  `,
})
export class PipesComponent {
  readonly section = input<string>();

  protected readonly price = 49.9;
  protected readonly today = new Date();
  protected readonly ratio = 0.855;
  protected readonly title = 'Castle in the Sky';
  protected readonly longTitle = 'Castle in the Sky: the full story';

  protected readonly builtinCode = `<p>{{ price | currency }}</p>
<p>{{ today | date: 'longDate' }}</p>
<p>{{ ratio | percent: '1.0-1' }}</p>
<p>{{ title | slice: 0 : 6 }}</p>`;

  protected readonly chainCode = `<p>{{ title }}</p>
<p>{{ title | uppercase }}</p>
<p>{{ title | uppercase | slice: 0 : 8 }}</p>`;

  protected readonly customCode = `@Pipe({ name: 'truncate' })
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 20) {
    return value.length > limit ? value.slice(0, limit) + '...' : value;
  }
}

<p>{{ longTitle | truncate: 14 }}</p>
<p>{{ longTitle | truncate }}</p>`;

  protected readonly mistakeImportWrong = `@Component({
  template: '{{ name | truncate }}',
})`;
  protected readonly mistakeImportRight = `@Component({
  imports: [TruncatePipe],
  template: '{{ name | truncate }}',
})`;
  protected readonly mistakeMutateWrong = `this.items.push(newItem);
<li>{{ items | filterDone }}</li>`;
  protected readonly mistakeMutateRight = `this.items = [...this.items, newItem];
<li>{{ items | filterDone }}</li>`;

  protected readonly recapBuiltin = [
    'A pipe changes how a value looks on the page, not the value in the class.',
    'Settings go after a colon: currency:\'EUR\'.',
    'Angular ships many pipes: currency, date, percent, slice, json, async and more.',
  ];
  protected readonly recapChain = [
    'Pipes run from left to right, each one on the result of the one before.',
    'Swap two pipes and the result can change.',
  ];
  protected readonly recapCustom = [
    'A custom pipe is a class with a transform() method.',
    'Give it a name in @Pipe and list the class in imports to use it.',
    'Reach for a pipe when the same transform is needed in several templates.',
  ];
  protected readonly recapPure = [
    'Pure pipes (the default) re-run only when their input changes.',
    'Pass a new array or object instead of mutating the old one.',
    'Impure pipes run on every check, so use them rarely.',
  ];
  protected readonly recapTry = [
    'The built-in pipes you try here are the real ones.',
    'Pipes make templates shorter and keep formatting in one place.',
    'Next stop: directives, which change how elements behave.',
  ];

  readonly argsCode = `{{ price | currency:'EUR' }}                  <!-- €49.90 -->
{{ today | date:'longDate' }}                    <!-- October 20, 2026 -->
{{ ratio | percent:'1.0-1' }}                    <!-- 85.5% -->
{{ title | slice:0:5 }}                          <!-- Castl -->`;

  readonly chainChallenge: PredictChallenge = {
    question: 'What does the page show for this template, when title is "Castle"?',
    code: "<p>{{ title | uppercase | lowercase }}</p>",
    options: [
      { id: 'upper', text: 'CASTLE' },
      { id: 'mixed', text: 'CaStLe' },
      { id: 'lower', text: 'castle' },
      { id: 'orig', text: 'Castle' },
    ],
    correct: 'lower',
    explanation: 'The pipes run left to right. uppercase turns it into CASTLE, then lowercase takes that result and turns it into castle. The last pipe has the final say.',
  };

  readonly pipeOptions: PipeOption[] = [
    { mode: 'currency', label: 'currency', syntax: 'currency' },
    { mode: 'percent', label: 'percent', syntax: 'percent' },
    { mode: 'date', label: 'date', syntax: "date:'longDate'" },
    { mode: 'uppercase', label: 'uppercase', syntax: 'uppercase' },
    { mode: 'lowercase', label: 'lowercase', syntax: 'lowercase' },
    { mode: 'truncate', label: 'truncate (custom)', syntax: 'truncate:N' },
  ];

  readonly mode = signal<PipeMode>('currency');
  readonly numberValue = signal(49.9);
  readonly textValue = signal('Angular is a powerful framework');
  readonly dateValue = signal(new Date());
  readonly truncateLimit = signal(15);

  readonly pipeSyntax = computed(() => this.pipeOptions.find((o) => o.mode === this.mode())?.syntax ?? '');

  dateInputValue(): string {
    return this.dateValue().toISOString().slice(0, 10);
  }

  onDateChange(value: string): void {
    this.dateValue.set(value ? new Date(value) : new Date());
  }

  readonly cheatSheet = [
    { op: 'currency', use: "{{ 49.9 | currency }}", result: '$49.90' },
    { op: 'percent', use: "{{ 0.256 | percent }}", result: '26%' },
    { op: 'date', use: "{{ today | date:'shortDate' }}", result: '8/24/26' },
    { op: 'uppercase', use: '{{ name | uppercase }}', result: 'AHMED' },
    { op: 'lowercase', use: '{{ email | lowercase }}', result: 'ahmed@site.com' },
    { op: 'json', use: '{{ obj | json }}', result: '{ "a": 1 } — handy for debugging' },
  ];

  readonly checkItems: KnowledgeCheckItem[] = [
    {
      question: "What does a pipe change — the template's rendered output, or the component's stored value?",
      answer: 'Only what\'s rendered in the template — the underlying value in the component stays exactly as it was.',
    },
    {
      question: 'When would you write a custom pipe instead of formatting in the component class?',
      answer: 'When the same transform is needed in multiple templates — a pipe keeps the logic reusable and out of every component.',
    },
    {
      question: 'What method does every custom pipe need to implement?',
      answer: 'transform() — it receives the input value (and any pipe arguments) and returns the formatted result.',
    },
    {
      question: 'Why does a pure pipe not re-run when you mutate an array in place?',
      answer: 'A pure pipe only re-runs when the input reference changes. Mutating the same array keeps the reference, so use a new array instead.',
    },
  ];
}
