import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { RecapComponent, RecapItem } from '../../shared/recap.component';
import { FlowDiagramComponent } from '../../shared/flow-diagram.component';
import { TopicNavComponent } from '../../shared/topic-nav.component';

@Component({
  standalone: true,
  imports: [FormsModule, FlowDiagramComponent, RecapComponent, TopicNavComponent],
  template: `
    <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p class="text-sm font-semibold text-gold-400">HANDS-ON WORKSHOP</p>
          <h1 class="mt-1 text-3xl font-bold sm:text-4xl">Data Binding</h1>
        </div>
        <a
          href="/pdfs/data-binding.pdf"
          download="data-binding.pdf"
          class="group inline-flex shrink-0 items-center gap-2 rounded-full border border-gold-400/40 bg-gold-500/10 px-4 py-2 text-sm font-semibold text-gold-300 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gold-400 hover:bg-gold-500/20 hover:shadow-lg hover:shadow-gold-500/20 active:translate-y-0 active:scale-95"
        >
          <svg
            class="h-4 w-4 text-gold-300 transition-transform duration-200 group-hover:translate-y-0.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <path d="M12 18v-6" />
            <path d="m9 15 3 3 3-3" />
          </svg>
          Download PDF Guide
        </a>
      </div>
      <p class="mt-3 max-w-2xl text-stone-400">
        Binding is how a component's TypeScript class and its HTML template stay in sync, without you writing
        <code class="text-gold-300">document.querySelector</code> or manual DOM updates. There are four kinds — interpolation, property
        binding, event binding, and two-way binding — each with a different direction of data flow, shown in the diagram on every card
        below. Edit this component file, save it, and watch the results update in the browser.
      </p>

      <!-- 01 · INTERPOLATION -->
      <div class="mt-10 grid gap-5 md:grid-cols-2">
        <article class="rounded-2xl border border-stone-800 bg-stone-900 p-6">
          <p class="text-xs font-bold tracking-wider text-gold-300">01 · INTERPOLATION</p>
          <h2 class="mt-2 text-xl font-bold">Show a title</h2>
          <p class="mt-2 text-sm text-stone-400">
            The simplest binding: drop a class property into text with double curly braces. Angular re-renders it
            automatically every time the property changes — no manual DOM update needed.
          </p>
          <app-flow-diagram class="mt-4 block" from="practiceTitle" to="{{ '{{ practiceTitle }}' }}" direction="right" />
          <p class="mt-2 text-xs text-stone-400">
            Change <code class="text-gold-300">practiceTitle</code> below to your favorite movie or series.
          </p>
          <div class="mt-5 rounded-xl bg-stone-800 p-4">
            <span class="text-stone-400">Your pick:</span>
            <strong>{{ practiceTitle }}</strong>
          </div>
          <p class="mt-4 text-xs text-stone-500">Hint: {{ '{{ practiceTitle }}' }}</p>
        </article>

        <!-- 02 · PROPERTY BINDING -->
        <article class="rounded-2xl border border-stone-800 bg-stone-900 p-6">
          <p class="text-xs font-bold tracking-wider text-gold-300">02 · PROPERTY BINDING</p>
          <h2 class="mt-2 text-xl font-bold">Control a button</h2>
          <p class="mt-2 text-sm text-stone-400">
            Square brackets bind a class property to an actual DOM property (not an HTML attribute), so booleans,
            objects and arrays pass through as real JavaScript values instead of strings.
          </p>
          <app-flow-diagram class="mt-4 block" from="isNotAvailable" to="[disabled]" direction="right" />
          <p class="mt-2 text-xs text-stone-400">Toggle availability, then inspect the bound button property.</p>
          <div class="mt-5 flex items-center gap-3">
            <button
              [disabled]="isNotAvailable"
              class="rounded-xl bg-gold-500 px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:bg-stone-700"
            >
              Play episode
            </button>
            <button
              type="button"
              (click)="isNotAvailable = !isNotAvailable"
              class="rounded-xl border border-stone-700 px-3 py-2 text-xs font-semibold text-stone-300 hover:bg-stone-800"
            >
              Toggle isNotAvailable
            </button>
          </div>
          <p class="mt-4 text-xs text-stone-500">
            Hint: <code class="text-gold-300">[disabled]</code>
          </p>
        </article>

        <!-- 03 · EVENT BINDING -->
        <article class="rounded-2xl border border-stone-800 bg-stone-900 p-6">
          <p class="text-xs font-bold tracking-wider text-gold-300">03 · EVENT BINDING</p>
          <h2 class="mt-2 text-xl font-bold">Rate a title</h2>
          <p class="mt-2 text-sm text-stone-400">
            Parentheses bind a DOM event to a class method. Data now flows the other way — from the template back
            into the class — every time the user interacts with the page.
          </p>
          <app-flow-diagram class="mt-4 block" from="(click)" to="giveRating()" direction="right" />
          <p class="mt-2 text-xs text-stone-400">
            Click the button, then change the points added in <code class="text-gold-300">giveRating()</code>.
          </p>
          <div class="mt-5 flex items-center gap-4">
            <button (click)="giveRating()" class="rounded-xl bg-gold-500 px-4 py-2 font-semibold text-white">
              Give a star ★
            </button>
            <strong>{{ stars }} stars</strong>
          </div>
          <p class="mt-4 text-xs text-stone-500">
            Hint: <code class="text-gold-300">(click)</code>
          </p>
        </article>

        <!-- 04 · TWO-WAY BINDING -->
        <article class="rounded-2xl border border-stone-800 bg-stone-900 p-6">
          <p class="text-xs font-bold tracking-wider text-gold-300">04 · TWO-WAY BINDING</p>
          <h2 class="mt-2 text-xl font-bold">Write a review</h2>
          <p class="mt-2 text-sm text-stone-400">
            Banana-in-a-box syntax combines property and event binding into one: the input shows the class value,
            and every keystroke writes straight back into it — both directions, at once.
          </p>
          <app-flow-diagram class="mt-4 block" from="[(ngModel)]" to="review" direction="both" />
          <p class="mt-2 text-xs text-stone-400">Type a review and see it update without pressing a button.</p>
          <input
            [(ngModel)]="review"
            class="mt-5 w-full rounded-xl border border-stone-600 bg-stone-800 px-3 py-2.5 text-stone-100 focus:border-gold-400 focus:outline-none"
            placeholder="This title is..."
          />
          <p class="mt-4 rounded-xl bg-stone-800 p-4 text-stone-200">
            {{ review || 'Your live review will appear here.' }}
          </p>
          <p class="mt-4 text-xs text-stone-500">
            Hint: <code class="text-gold-300">[(ngModel)]</code>
          </p>
        </article>
      </div>

      <div class="mt-8 rounded-2xl border border-gold-400/20 bg-gold-950/30 p-6">
        <h2 class="font-bold text-gold-200">Final challenge</h2>
        <p class="mt-2 text-sm text-stone-300">
          Add a reset button that sets the title to an empty string, stars to 0, and review to an empty string.
          Use event binding and confirm all live UI values reset.
        </p>
      </div>

      <app-recap [items]="recapItems" />
      <app-topic-nav />
    </section>
  `,
})
export class BindingComponent {
  // Student task: replace this starter value with a title you enjoy.
  practiceTitle = 'The Last Horizon';
  isNotAvailable = true;
  stars = 0;
  review = '';

  giveRating(): void {
    // Student task: change the number and test the button again.
    this.stars += 1;
  }

  readonly recapItems: RecapItem[] = [
    {
      question: 'If data flows from the component out to the template, which binding do you use?',
      answer: 'Interpolation {{ }} or property binding [ ] — both display a value, they just target different places (text vs. an element property).',
    },
    {
      question: "What's different about [(ngModel)] compared to [ ] and ( ) used separately?",
      answer: "It's both combined — it reads the value in and writes user changes back, keeping the component and the input in sync automatically.",
    },
    {
      question: 'Why use [src] instead of src="{{ imageUrl }}"?',
      answer: '[src] reads imageUrl as an actual JavaScript value (property binding) — the idiomatic, safer way to bind non-text values like images or booleans.',
    },
  ];
}
