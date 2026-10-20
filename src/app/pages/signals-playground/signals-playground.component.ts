import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, input, signal, untracked } from '@angular/core';

import { CodeBlockDirective } from '../../shared/code-block.directive';
import { FlowDiagramComponent } from '../../shared/flow-diagram.component';
import { LessonCardComponent } from '../../shared/lesson-card.component';
import type { PredictChallenge } from '../../shared/predict-output.component';
import { PredictOutputComponent } from '../../shared/predict-output.component';
import { TermComponent } from '../../shared/term.component';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { KnowledgeCheckComponent, KnowledgeCheckItem } from '../../shared/knowledge-check.component';
import { LessonPlayerComponent } from '../../learn/player/lesson-player.component';
import { LessonSectionDirective } from '../../learn/player/lesson-section.directive';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PredictOutputComponent, TermComponent, CurrencyPipe, FlowDiagramComponent, CodeBlockDirective, KnowledgeCheckComponent, PageHeaderComponent, LessonCardComponent, LessonPlayerComponent, LessonSectionDirective],
  template: `
    <app-lesson-player [topicId]="'signals'" [section]="section()">
      <ng-template appLessonSection="basics">
      <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <app-page-header title="Signals" illustration="signals">
        Before Signals, Angular had to check every component on every event to see what changed — reliable, but wasteful. A
        <code class="text-gold-300">signal()</code> is a value that knows exactly who's reading it, so Angular can update only what
        actually depends on it. Change the product and quantity below and watch every dependent value update automatically.
      </app-page-header>

      <app-lesson-card class="mt-10" label="THE MENTAL MODEL" heading="Signals work like spreadsheet cells" tone="amber">
        <ul class="mt-3 list-disc space-y-2 pl-5 text-sm text-stone-300">
          <li><strong class="text-stone-100">signal()</strong> is a cell that holds a value, like <code class="text-gold-300">A1 = 50</code>.</li>
          <li><strong class="text-stone-100">computed()</strong> is a formula cell, like <code class="text-gold-300">C1 = A1 * B1</code>. Change A1 and C1 fixes itself — you never update it by hand.</li>
          <li><strong class="text-stone-100">effect()</strong> is an alert that fires whenever a cell it watches changes. It is how you run a <app-term term="side-effect">side effect</app-term>: save a file, send a log, ping a server.</li>
          <li><strong class="text-stone-100">Calling <code class="text-gold-300">price()</code></strong> is like pointing at a cell inside a formula. That is how Angular learns who depends on what.</li>
        </ul>
      </app-lesson-card>

      <div class="mt-5 grid gap-5 md:grid-cols-2">
        <app-lesson-card label="1 · SIGNAL()" heading="Reactive state">
          <p class="mt-2 text-sm text-stone-400">
            <code class="text-gold-300">signal()</code> creates reactive state. Read a signal by calling it with <code class="text-gold-300">()</code>.
          </p>
          <app-flow-diagram class="mt-4 block" from="signal(50)" to="price()" direction="right" />
          <div class="mt-5 space-y-2 rounded-xl bg-stone-800 p-4">
            <p>Product: <strong>{{ productName() }}</strong></p>
            <p>Price: <strong>{{ price() | currency }}</strong></p>
            <p>Quantity: <strong>{{ quantity() }}</strong></p>
          </div>
          <div class="mt-4 flex items-center gap-3">
            <span class="text-sm text-stone-400">Try changing the price:</span>
            <button (click)="decreasePrice()" class="rounded-lg border border-stone-600 px-3 py-1 hover:bg-stone-800">− $5</button>
            <button (click)="increasePrice()" class="rounded-lg border border-stone-600 px-3 py-1 hover:bg-stone-800">+ $5</button>
          </div>
          <p class="mt-4 text-xs text-stone-500">Example: <code class="text-gold-300">this.price()</code></p>
        </app-lesson-card>

        <app-lesson-card label="2 · SET()" heading="Replace a value">
          <p class="mt-2 text-sm text-stone-400">
            <code class="text-gold-300">set()</code> replaces the current value with a new value.
          </p>
          <app-flow-diagram class="mt-4 block" from="(click)" to="productName.set()" direction="right" />
          <button (click)="changeProduct()" class="mt-5 rounded-xl bg-gold-solid px-4 py-2.5 font-semibold text-white hover:bg-gold-solid-hover">
            Change Protein to Creatine
          </button>
          <p class="mt-4 rounded-xl bg-stone-800 p-4 text-stone-300">Current product: <strong class="text-stone-100">{{ productName() }}</strong></p>
        </app-lesson-card>

        <app-lesson-card label="3 · UPDATE()" heading="Change using the current value">
          <p class="mt-2 text-sm text-stone-400">
            <code class="text-gold-300">update()</code> calculates a new value from the current value. The quantity never goes below 1.
          </p>
          <app-flow-diagram class="mt-4 block" from="(click)" to="quantity.update()" direction="right" />
          <div class="mt-5 flex items-center gap-4"><button (click)="decreaseQuantity()" class="grid h-10 w-10 place-items-center rounded-xl border border-stone-600 text-xl hover:bg-stone-800">−</button><strong class="text-2xl">{{ quantity() }}</strong><button (click)="increaseQuantity()" class="grid h-10 w-10 place-items-center rounded-xl bg-gold-solid text-xl text-white hover:bg-gold-solid-hover">+</button></div>
          <p class="mt-4 text-xs text-stone-500"><code class="text-gold-300">set(5)</code> chooses a value. <code class="text-gold-300">update(value =&gt; value + 1)</code> uses the old value.</p>
        </app-lesson-card>
      </div>
      </section>
      </ng-template>

      <ng-template appLessonSection="computed">
      <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <div class="mt-10 grid gap-5 md:grid-cols-2">
        <app-lesson-card label="4 · COMPUTED()" heading="A derived value">
          <p class="mt-2 text-sm text-stone-400"><code class="text-gold-300">computed()</code> creates a value from other Signals. It is never updated manually.</p>
          <div class="mt-5 rounded-xl bg-stone-800 p-4"><p>Price: {{ price() | currency }}</p><p>Quantity: {{ quantity() }}</p><p class="mt-2 text-lg">Total price: <strong class="text-gold-300">{{ totalPrice() | currency }}</strong></p></div>
          <pre class="mt-4 overflow-x-auto text-xs text-gold-200">price ───────┐
             ├──→ totalPrice
quantity ────┘</pre>
        </app-lesson-card>
      </div>

      <app-lesson-card class="mt-5" variant="highlight" label="5 · REACTIVE CHAIN" heading="One change, several automatic updates">
        <p class="mt-2 text-sm text-stone-400">At quantity 5 or higher, a $10 discount is applied automatically.</p>
        <div class="mt-5 grid gap-3 sm:grid-cols-4"><div class="rounded-xl bg-stone-900 p-4"><p class="text-xs text-stone-400">Price</p><strong>{{ price() | currency }}</strong></div><div class="rounded-xl bg-stone-900 p-4"><p class="text-xs text-stone-400">Quantity</p><strong>{{ quantity() }}</strong></div><div class="rounded-xl bg-stone-900 p-4"><p class="text-xs text-stone-400">Subtotal</p><strong>{{ subtotal() | currency }}</strong></div><div class="rounded-xl bg-stone-900 p-4"><p class="text-xs text-stone-400">Discount</p><strong class="text-emerald-400">−{{ discount() | currency }}</strong></div></div>
        <p class="mt-4 rounded-xl bg-gold-500/15 p-4 text-lg">Final price: <strong class="text-gold-200">{{ finalPrice() | currency }}</strong></p>
        <pre class="mt-4 overflow-x-auto text-xs text-gold-200">quantity changes
       ↓
subtotal changes → discount changes → finalPrice changes</pre>
      </app-lesson-card>

      <app-lesson-card class="mt-5" variant="highlight" label="PREDICT THE OUTPUT" heading="What does computed() give back?">
        <app-predict-output [challenge]="computedChallenge" />
      </app-lesson-card>
      </section>
      </ng-template>

      <ng-template appLessonSection="effects">
      <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <app-lesson-card class="mt-5" label="6 · EFFECT()" heading="Run code whenever a signal changes">
        <p class="mt-2 text-sm text-stone-400">
          <code class="text-gold-300">effect()</code> says: "whenever any signal I read changes, run this code again." It runs <strong class="text-stone-200">once straight away</strong>,
          then after every change. Use it for things that happen <em>outside</em> the template: logging, saving to <code class="text-gold-300">localStorage</code>, analytics, or talking to a
          non-Angular library.
        </p>
        <app-flow-diagram class="mt-4 block" from="finalPrice() changes" to="effect() re-runs" direction="right" />
        <pre class="mt-4 overflow-x-auto rounded-xl bg-stone-950 p-4 text-xs text-gold-200">constructor() &#123;
  effect(() =&gt; &#123;
    // reading finalPrice() tells Angular: "re-run me when this changes"
    console.log('Cart changed:', this.finalPrice());
  &#125;);
&#125;</pre>
      </app-lesson-card>

      <app-lesson-card class="mt-5" variant="highlight" label="TRY IT · WATCH THE EFFECT RUN" heading="Change the quantity and read the log">
        <p class="mt-2 text-sm text-stone-400">The first line appeared when the page loaded. Then every change adds a new line. Below quantity 5 there is no discount; at 5 or more there is a $10 one.</p>
        <div class="mt-4 flex flex-wrap items-center gap-3">
          <button type="button" data-testid="effect-qty-down" (click)="decreaseQuantity()" class="grid h-10 w-10 place-items-center rounded-xl border border-stone-600 text-xl hover:bg-stone-800" aria-label="Decrease quantity">−</button>
          <span class="min-w-24 text-center">Quantity: <strong data-testid="effect-qty">{{ quantity() }}</strong></span>
          <button type="button" data-testid="effect-qty-up" (click)="increaseQuantity()" class="grid h-10 w-10 place-items-center rounded-xl border border-stone-600 text-xl hover:bg-stone-800" aria-label="Increase quantity">+</button>
          <span class="text-sm text-stone-400">Final price: <strong class="text-gold-200">{{ finalPrice() | currency }}</strong></span>
        </div>
        <div class="mt-4 rounded-xl bg-stone-950 p-4">
          <div class="flex items-center justify-between">
            <p class="text-xs font-bold tracking-wider text-stone-500">EFFECT LOG</p>
            <button type="button" data-testid="effect-clear" (click)="clearEffectLog()" class="text-xs font-semibold text-stone-400 hover:text-stone-200">Clear</button>
          </div>
          <ul class="mt-2 space-y-1 text-sm text-emerald-300" data-testid="effect-log" aria-live="polite">
            @for (line of effectLog(); track $index) {
              <li>{{ line }}</li>
            } @empty {
              <li class="text-stone-600">Log cleared — change the quantity to see the effect run again.</li>
            }
          </ul>
        </div>
      </app-lesson-card>

      <app-lesson-card class="mt-5" variant="danger" label="THE #1 MISTAKE" heading="Do not use effect() to calculate a value">
        <p class="mt-2 text-sm text-stone-300">Copying one signal into another inside an effect works at first, but it is slower, easy to get stuck in loops, and a formula is clearer.</p>
        <pre class="mt-4 overflow-x-auto rounded-xl bg-stone-950 p-4 text-xs text-rose-300">// ❌ an effect used to derive a value
effect(() =&gt; this.finalPrice.set(this.price() * this.quantity()));</pre>
        <pre class="mt-3 overflow-x-auto rounded-xl bg-stone-950 p-4 text-xs text-emerald-300">// ✅ a formula cell: always correct, nothing to forget
readonly finalPrice = computed(() =&gt; this.price() * this.quantity());</pre>
        <p class="mt-4 text-sm text-stone-300">
          <strong class="text-stone-100">Rule of thumb:</strong> need a value to show in the template? Use <code class="text-gold-300">computed()</code>.
          Need to <em>do</em> something — save, log, call an API? Use <code class="text-gold-300">effect()</code>.
        </p>
      </app-lesson-card>
      </section>
      </ng-template>

      <ng-template appLessonSection="component-signals">
      <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <app-lesson-card class="mt-10" label="COMPONENT SIGNALS" heading="input() and output() as signals">
          <p class="mt-2 text-sm text-stone-400">
            Components can use signals for their API too. <code class="text-gold-300">input()</code> reads a value from the parent and
            returns a signal you read with <code class="text-gold-300">()</code>. <code class="text-gold-300">output()</code> replaces
            <code class="text-gold-300">&#64;Output()</code> and <code class="text-gold-300">EventEmitter</code>.
          </p>
          <pre class="mt-4 overflow-x-auto rounded-xl bg-stone-950 p-4 text-xs text-gold-200">readonly price = input.required&lt;number&gt;();
readonly added = output&lt;number&gt;();

// inside the component
this.added.emit(this.price() * 2);</pre>
        </app-lesson-card>
      </section>
      </ng-template>

      <ng-template appLessonSection="interop">
      <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <app-lesson-card class="mt-10" label="INTEROP" heading="Bridge Observables and signals">
          <p class="mt-2 text-sm text-stone-400">
            HttpClient and the Router return Observables. <code class="text-gold-300">toSignal()</code> subscribes for you and exposes the latest
            value as a signal, and it unsubscribes automatically when the component is destroyed.
          </p>
          <pre class="mt-4 overflow-x-auto rounded-xl bg-stone-950 p-4 text-xs text-gold-200">readonly products = toSignal(this.http.get&lt;Product[]&gt;('/api/products'), &#123; initialValue: [] &#125;);</pre>
          <p class="mt-3 text-sm text-stone-400">In the other direction, <code class="text-gold-300">toObservable()</code> turns a signal into an Observable.</p>
        </app-lesson-card>
      </section>
      </ng-template>

      <ng-template appLessonSection="try-it">
      <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <app-lesson-card class="mt-10" variant="highlight" label="TRY IT" heading="Add a signal yourself">
          <p class="mt-2 text-sm text-stone-400">
            Add a <code class="text-gold-300">shippingFee</code> signal (for example <code class="text-gold-300">signal(5)</code>) and a
            <code class="text-gold-300">total</code> computed that adds it to the subtotal. Then show it in the template with
            <code class="text-gold-300">{{ '{{ total() | currency }}' }}</code>.
          </p>
        </app-lesson-card>

      <app-knowledge-check [items]="checkItems" />
      </section>
      </ng-template>
    </app-lesson-player>
  `,
})
export class SignalsPlaygroundComponent {
  readonly section = input<string>();

  readonly computedChallenge: PredictChallenge = {
    question: 'What does this log?',
    code: 'const price = signal(10);\nconst double = computed(() => price() * 2);\nprice.set(25);\nconsole.log(double());',
    options: [
      { id: 'a', text: '20' },
      { id: 'b', text: '50' },
      { id: 'c', text: '10' },
      { id: 'd', text: 'undefined' },
    ],
    correct: 'b',
    explanation: 'A computed signal is always worked out from the current value of the signals it reads. price is 25 by the time double() is read, so the answer is 50.',
  };
  // signal() creates reactive state.
  readonly productName = signal('Protein');
  readonly price = signal(50);
  readonly quantity = signal(1);

  // computed() derives new values from Signals without manual updates.
  readonly totalPrice = computed(() => this.price() * this.quantity());
  readonly subtotal = computed(() => this.price() * this.quantity());
  readonly discount = computed(() => (this.quantity() >= 5 ? 10 : 0));
  readonly finalPrice = computed(() => this.subtotal() - this.discount());

  // Visible log of every effect run, so the lesson does not depend on the browser console.
  readonly effectLog = signal<string[]>([]);

  constructor() {
    effect(() => {
      const message = `Effect ran → final price is $${this.finalPrice()}`;
      console.log('Cart changed:', this.finalPrice());
      untracked(() => this.effectLog.update((log) => [...log, message].slice(-6)));
    });
  }

  clearEffectLog(): void {
    this.effectLog.set([]);
  }

  changeProduct(): void {
    this.productName.set('Creatine');
  }

  increaseQuantity(): void {
    this.quantity.update((value) => value + 1);
  }

  decreaseQuantity(): void {
    this.quantity.update((value) => Math.max(1, value - 1));
  }

  increasePrice(): void {
    this.price.update((value) => value + 5);
  }

  decreasePrice(): void {
    this.price.update((value) => Math.max(5, value - 5));
  }

  readonly checkItems: KnowledgeCheckItem[] = [
    {
      question: 'Why do we write count() in the template instead of count?',
      answer: 'count is the Signal itself (a function reference); count() reads its current value — and calling it registers the template as a dependent so it updates automatically.',
    },
    {
      question: 'When should you reach for computed() instead of recalculating a value manually everywhere it\'s needed?',
      answer: "Whenever a value is 100% derived from other Signals — computed() tracks the dependency and recalculates itself, so you can't forget to update one spot.",
    },
    {
      question: "What's the difference between effect() and computed()?",
      answer: 'computed() returns a derived value you read elsewhere; effect() runs a side effect (logging, localStorage) and returns nothing usable — never use effect() to derive state.',
    },
  ];
}
