import { CurrencyPipe } from '@angular/common';
import { Component, computed, effect, signal } from '@angular/core';

import { CodeBlockDirective } from '../../shared/code-block.directive';
import { FlowDiagramComponent } from '../../shared/flow-diagram.component';
import { LessonCardComponent } from '../../shared/lesson-card.component';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { RecapComponent, RecapItem } from '../../shared/recap.component';
import { TopicNavComponent } from '../../shared/topic-nav.component';

@Component({
  standalone: true,
  imports: [CurrencyPipe, FlowDiagramComponent, CodeBlockDirective, RecapComponent, TopicNavComponent, PageHeaderComponent, LessonCardComponent],
  template: `
    <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <app-page-header title="Signals" pdf="signals.pdf">
        Before Signals, Angular had to check every component on every event to see what changed — reliable, but wasteful. A
        <code class="text-gold-300">signal()</code> is a value that knows exactly who's reading it, so Angular can update only what
        actually depends on it. Change the product and quantity below and watch every dependent value update automatically.
      </app-page-header>

      <div class="mt-10 grid gap-5 md:grid-cols-2">
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
          <button (click)="changeProduct()" class="mt-5 rounded-xl bg-gold-500 px-4 py-2.5 font-semibold text-white hover:bg-gold-400">
            Change Protein to Creatine
          </button>
          <p class="mt-4 rounded-xl bg-stone-800 p-4 text-stone-300">Current product: <strong class="text-stone-100">{{ productName() }}</strong></p>
        </app-lesson-card>

        <app-lesson-card label="3 · UPDATE()" heading="Change using the current value">
          <p class="mt-2 text-sm text-stone-400">
            <code class="text-gold-300">update()</code> calculates a new value from the current value. The quantity never goes below 1.
          </p>
          <app-flow-diagram class="mt-4 block" from="(click)" to="quantity.update()" direction="right" />
          <div class="mt-5 flex items-center gap-4"><button (click)="decreaseQuantity()" class="grid h-10 w-10 place-items-center rounded-xl border border-stone-600 text-xl hover:bg-stone-800">−</button><strong class="text-2xl">{{ quantity() }}</strong><button (click)="increaseQuantity()" class="grid h-10 w-10 place-items-center rounded-xl bg-gold-500 text-xl hover:bg-gold-400">+</button></div>
          <p class="mt-4 text-xs text-stone-500"><code class="text-gold-300">set(5)</code> chooses a value. <code class="text-gold-300">update(value =&gt; value + 1)</code> uses the old value.</p>
        </app-lesson-card>

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

      <app-lesson-card class="mt-5" label="6 · EFFECT()" heading="Run a side effect">
        <p class="mt-2 text-sm text-stone-400"><code class="text-gold-300">effect()</code> runs side effects when the Signals it reads change. Open the browser console and change quantity to see <code class="text-gold-300">Cart changed:</code>.</p>
        <app-flow-diagram class="mt-4 block" from="finalPrice() changes" to="effect() re-runs" direction="right" />
        <p class="mt-4 text-sm text-stone-300"><strong>Remember:</strong> <code class="text-gold-300">computed()</code> derives data for the UI; <code class="text-gold-300">effect()</code> performs a side effect such as logging.</p>
      </app-lesson-card>

      <app-recap [items]="recapItems" />
      <app-topic-nav />
    </section>
  `,
})
export class SignalsPlaygroundComponent {
  // signal() creates reactive state.
  readonly productName = signal('Protein');
  readonly price = signal(50);
  readonly quantity = signal(1);

  // computed() derives new values from Signals without manual updates.
  readonly totalPrice = computed(() => this.price() * this.quantity());
  readonly subtotal = computed(() => this.price() * this.quantity());
  readonly discount = computed(() => (this.quantity() >= 5 ? 10 : 0));
  readonly finalPrice = computed(() => this.subtotal() - this.discount());

  constructor() {
    effect(() => {
      console.log('Cart changed:', this.finalPrice());
    });
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

  readonly recapItems: RecapItem[] = [
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
