import { CurrencyPipe, DatePipe, LowerCasePipe, PercentPipe, UpperCasePipe } from '@angular/common';
import { Component, Pipe, PipeTransform, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CodeBlockDirective } from '../../shared/code-block.directive';
import { RecapComponent, RecapItem } from '../../shared/recap.component';
import { TopicNavComponent } from '../../shared/topic-nav.component';

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
  standalone: true,
  imports: [FormsModule, CurrencyPipe, DatePipe, UpperCasePipe, LowerCasePipe, PercentPipe, TruncatePipe, CodeBlockDirective, RecapComponent, TopicNavComponent],
  template: `
    <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p class="text-sm font-semibold text-gold-400">HANDS-ON WORKSHOP</p>
          <h1 class="mt-1 text-3xl font-bold sm:text-4xl">Pipes</h1>
        </div>
        <a
          href="/pdfs/pipes.pdf"
          download="pipes.pdf"
          class="group inline-flex shrink-0 items-center gap-2 rounded-full border border-gold-400/40 bg-gold-500/10 px-4 py-2 text-sm font-semibold text-gold-300 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gold-400 hover:bg-gold-500/20 hover:shadow-lg hover:shadow-gold-500/20 active:translate-y-0 active:scale-95"
        >
          <svg class="h-4 w-4 text-gold-300 transition-transform duration-200 group-hover:translate-y-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <path d="M12 18v-6" />
            <path d="m9 15 3 3 3-3" />
          </svg>
          Download PDF Guide
        </a>
      </div>
      <p class="mt-3 max-w-3xl text-stone-400">
        A pipe transforms a value <strong class="text-gold-300">right inside the template</strong>, using the <code class="text-gold-300">|</code> symbol —
        without touching the actual value stored in your component. Format dates, prices, and text for humans, in one keyword.
      </p>

      <!-- 1 · THE PROBLEM -->
      <article class="mt-10 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <p class="text-xs font-bold tracking-wider text-gold-300">1 · The problem</p>
        <h2 class="mt-2 text-xl font-bold">Raw data doesn't always look presentable</h2>
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
      </article>

      <!-- 2 · INTERACTIVE PLAYGROUND -->
      <article class="mt-5 rounded-2xl border border-gold-400/30 bg-gold-950/20 p-6">
        <p class="text-xs font-bold tracking-wider text-gold-300">2 · Try it — pick a pipe, watch it transform live</p>
        <h2 class="mt-2 text-xl font-bold">Same raw value, five different pipes</h2>

        <div class="mt-4 flex flex-wrap gap-2">
          @for (option of pipeOptions; track option.mode) {
            <button
              type="button"
              (click)="mode.set(option.mode)"
              class="rounded-lg px-3 py-2 text-sm font-semibold transition"
              [class.bg-gold-500]="mode() === option.mode"
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
                type="number"
                step="0.01"
                [ngModel]="numberValue()"
                (ngModelChange)="numberValue.set($event)"
                class="mt-2 w-full rounded-lg border border-stone-700 bg-stone-800 px-3 py-2 text-stone-100 focus:border-gold-400 focus:outline-none"
              />
            } @else if (mode() === 'date') {
              <input
                type="date"
                [ngModel]="dateInputValue()"
                (ngModelChange)="onDateChange($event)"
                class="mt-2 w-full rounded-lg border border-stone-700 bg-stone-800 px-3 py-2 text-stone-100 focus:border-gold-400 focus:outline-none"
              />
            } @else {
              <input
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
      </article>

      <!-- 3 · CUSTOM PIPE -->
      <article class="mt-5 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <p class="text-xs font-bold tracking-wider text-gold-300">3 · Custom pipes</p>
        <h2 class="mt-2 text-xl font-bold">When built-in pipes aren't enough</h2>
        <p class="mt-2 text-sm text-stone-400">A custom pipe is a class with a <code class="text-gold-300">transform()</code> method — reusable anywhere in the app. The truncate pipe above is a real one, defined right in this page:</p>
        <pre class="mt-4 overflow-x-auto rounded-xl bg-stone-950 p-4 text-xs text-gold-200">&#64;Pipe(&#123; name: 'truncate' &#125;)
export class TruncatePipe implements PipeTransform &#123;
  transform(value: string, limit = 20) &#123;
    return value.length &gt; limit
      ? value.slice(0, limit) + '...'
      : value;
  &#125;
&#125;</pre>
      </article>

      <!-- 4 · CHEAT SHEET -->
      <article class="mt-5 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <p class="text-xs font-bold tracking-wider text-gold-300">4 · Quick cheat sheet</p>
        <h2 class="mt-2 text-xl font-bold">Built-in pipes you'll use every day</h2>
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
      </article>

      <app-recap [items]="recapItems" />
      <app-topic-nav />
    </section>
  `,
})
export class PipesComponent {
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

  readonly recapItems: RecapItem[] = [
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
  ];
}
