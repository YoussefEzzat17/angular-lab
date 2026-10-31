import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

import { LessonPlayerComponent } from '../../learn/player/lesson-player.component';
import { LessonSectionDirective } from '../../learn/player/lesson-section.directive';
import { CodeOutputComponent } from '../../shared/code-output.component';
import { CommonMistakeComponent } from '../../shared/common-mistake.component';
import { KnowledgeCheckComponent, KnowledgeCheckItem } from '../../shared/knowledge-check.component';
import { LessonCardComponent } from '../../shared/lesson-card.component';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { PredictChallenge, PredictOutputComponent } from '../../shared/predict-output.component';
import { RecapComponent } from '../../shared/recap.component';
import { ItemListDemoComponent } from './template-tools-demos';

interface CartLine {
  id: number;
  name: string;
  price: number;
  qty: number;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CodeOutputComponent,
    CommonMistakeComponent,
    ItemListDemoComponent,
    KnowledgeCheckComponent,
    LessonCardComponent,
    LessonPlayerComponent,
    LessonSectionDirective,
    NgTemplateOutlet,
    PageHeaderComponent,
    PredictOutputComponent,
    RecapComponent,
  ],
  template: `
    <app-lesson-player [topicId]="'template-tools'" [section]="section()">
      <!-- ── ng-container ── -->
      <ng-template appLessonSection="container">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-page-header title="Template Tools" illustration="template-tools">
            A few small tools make templates tidier and let you reuse markup. <code class="text-gold-300">ng-container</code> groups things without adding HTML,
            <code class="text-gold-300">ng-template</code> stores a piece of markup for later, <code class="text-gold-300">&#64;let</code> saves a value, and
            <code class="text-gold-300">ngTemplateOutlet</code> draws a stored template where you want it.
          </app-page-header>

          <app-lesson-card class="mt-10" label="1 · THE PROBLEM" heading="Extra wrapper elements change the page">
            <p class="mt-2 text-sm text-stone-400">
              Sometimes you need to group elements to apply one directive to them, but a wrapper <code class="text-gold-300">&lt;div&gt;</code> would break the layout, or is not even allowed
              there (a <code class="text-gold-300">&lt;div&gt;</code> inside a <code class="text-gold-300">&lt;ul&gt;</code> or a table is invalid HTML).
            </p>
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="highlight" label="2 · SEE IT" heading="A group with no wrapper element">
            <p class="mt-2 text-sm text-stone-400">
              The row below spaces its direct children with a gap. Flip the switch and watch B and C: inside a <code class="text-gold-300">&lt;div&gt;</code> they become one child and lose the gap.
            </p>
            <div class="mt-3 flex gap-2" role="group" aria-label="Group with">
              <button type="button" [attr.aria-pressed]="useContainer()" (click)="useContainer.set(true)"
                      class="min-h-11 rounded-xl border px-4 text-sm font-semibold transition"
                      [class]="useContainer() ? 'border-gold-400 bg-gold-500/15 text-gold-200' : 'border-stone-700 text-stone-300 hover:bg-stone-800'">ng-container</button>
              <button type="button" [attr.aria-pressed]="!useContainer()" (click)="useContainer.set(false)"
                      class="min-h-11 rounded-xl border px-4 text-sm font-semibold transition"
                      [class]="!useContainer() ? 'border-gold-400 bg-gold-500/15 text-gold-200' : 'border-stone-700 text-stone-300 hover:bg-stone-800'">div</button>
            </div>
            <app-code-output class="mt-4 block" [code]="containerCode" caption="ng-container adds nothing to the page. Its children become direct children of the row.">
              <div class="flex gap-6 rounded-lg bg-stone-900 p-3 text-sm text-stone-100">
                <span class="rounded bg-stone-700 px-2 py-1">A</span>
                @if (useContainer()) {
                  <ng-container>
                    <span class="rounded bg-gold-500/30 px-2 py-1">B</span>
                    <span class="rounded bg-gold-500/30 px-2 py-1">C</span>
                  </ng-container>
                } @else {
                  <div>
                    <span class="rounded bg-gold-500/30 px-2 py-1">B</span>
                    <span class="rounded bg-gold-500/30 px-2 py-1">C</span>
                  </div>
                }
              </div>
            </app-code-output>
          </app-lesson-card>

          <app-lesson-card class="mt-5" label="GOOD TO KNOW" heading="Do I need it with &#64;if and &#64;for?">
            <p class="mt-2 text-sm text-stone-400">
              No. The <code class="text-gold-300">&#64;if</code> and <code class="text-gold-300">&#64;for</code> blocks are not elements, so they never add a wrapper. Reach for
              <code class="text-gold-300">ng-container</code> when you need to hang a directive on a group, most often <code class="text-gold-300">ngTemplateOutlet</code>, which you will meet in a moment.
            </p>
          </app-lesson-card>

          <app-recap class="mt-5" [items]="recapContainer" />
        </section>
      </ng-template>

      <!-- ── ng-template ── -->
      <ng-template appLessonSection="template">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card class="mt-10" label="THE IDEA" heading="A template is a recipe, not a dish">
            <p class="mt-2 text-sm text-stone-400">
              Markup inside <code class="text-gold-300">&lt;ng-template&gt;</code> is not shown. Angular keeps it as a recipe until something asks for it to be drawn. Give it a name with
              <code class="text-gold-300">#greeting</code> so you can point at it later.
            </p>
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="highlight" label="SEE IT" heading="Nothing shows until you draw it">
            <div class="mt-3">
              <button type="button" (click)="drawn.set(!drawn())" class="min-h-11 rounded-xl bg-gold-solid px-4 text-sm font-semibold text-white hover:bg-gold-solid-hover">
                {{ drawn() ? 'Stop drawing it' : 'Draw the template' }}
              </button>
            </div>
            <app-code-output class="mt-4 block" [code]="templateCode" caption="The template exists from the start, but only appears where an outlet draws it.">
              <ng-template #greeting let-name><p class="rounded-lg bg-stone-800 px-3 py-2 text-stone-100">Hello, <strong class="text-gold-300">{{ name }}</strong>!</p></ng-template>
              @if (drawn()) {
                <ng-container [ngTemplateOutlet]="greeting" [ngTemplateOutletContext]="{ $implicit: 'Ada' }" />
              } @else {
                <p class="text-sm text-stone-500">The template is not drawn yet.</p>
              }
            </app-code-output>
          </app-lesson-card>

          <app-lesson-card class="mt-5" label="READ IT" heading="let-name and $implicit">
            <p class="mt-2 text-sm text-stone-400">
              A template can receive values. <code class="text-gold-300">let-name</code> takes the context's default value, called <code class="text-gold-300">$implicit</code>.
              <code class="text-gold-300">let-i="index"</code> takes a value by its key instead.
            </p>
          </app-lesson-card>

          <app-recap class="mt-5" [items]="recapTemplate" />
        </section>
      </ng-template>

      <!-- ── @let ── -->
      <ng-template appLessonSection="let">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card class="mt-10" label="THE PROBLEM" heading="The same calculation, written again and again">
            <p class="mt-2 text-sm text-stone-400">
              If a template needs <code class="text-gold-300">price() * qty()</code> in three places, you repeat it, and a small change must be made three times.
              <code class="text-gold-300">&#64;let</code> works the value out once and gives it a name.
            </p>
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="highlight" label="SEE IT" heading="Change the quantity">
            <div class="mt-3 flex items-center gap-3">
              <button type="button" aria-label="One less" (click)="qty.update(n => Math.max(1, n - 1))" class="grid h-11 w-11 place-items-center rounded-xl border border-stone-600 text-stone-100 hover:bg-stone-800">−</button>
              <strong class="min-w-8 text-center text-stone-100">{{ qty() }}</strong>
              <button type="button" aria-label="One more" (click)="qty.update(n => n + 1)" class="grid h-11 w-11 place-items-center rounded-xl border border-stone-600 text-stone-100 hover:bg-stone-800">+</button>
            </div>
            <app-code-output class="mt-4 block" [code]="letCode" caption="total is worked out once, then read twice.">
              @let total = price * qty();
              <p class="text-sm text-stone-300">Price: <strong class="text-stone-100">{{ price }}</strong> × {{ qty() }}</p>
              <p class="text-sm text-stone-300">Total: <strong class="text-gold-300">{{ total }}</strong></p>
              <p class="text-sm text-stone-400">{{ total >= 100 ? 'Free delivery' : 'Add ' + (100 - total) + ' for free delivery' }}</p>
            </app-code-output>
          </app-lesson-card>

          <app-lesson-card class="mt-5" label="RULES" heading="Where a @let variable can be used">
            <ul class="mt-3 list-disc space-y-2 pl-5 text-sm text-stone-300">
              <li>It is <strong class="text-stone-100">read-only</strong>. You cannot assign to it later.</li>
              <li>You can use it only <strong class="text-stone-100">after</strong> the line that declares it, in the same template or one nested inside.</li>
              <li>It is handy for unwrapping a signal once: <code class="text-gold-300">&#64;let user = currentUser();</code></li>
            </ul>
          </app-lesson-card>

          <app-common-mistake class="mt-5" title="Trying to change a @let variable" [wrong]="mistakeLetWrong" [right]="mistakeLetRight">
            A <code class="text-gold-300">&#64;let</code> is a name for a worked-out value, not a field. To change something, change the signal or field it came from.
          </app-common-mistake>

          <app-recap class="mt-5" [items]="recapLet" />
        </section>
      </ng-template>

      <!-- ── ngTemplateOutlet ── -->
      <ng-template appLessonSection="outlet">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card class="mt-10" label="THE TOOL" heading="Draw a template where you choose">
            <p class="mt-2 text-sm text-stone-400">
              <code class="text-gold-300">ngTemplateOutlet</code> draws a template at that spot, and <code class="text-gold-300">ngTemplateOutletContext</code> gives it values.
              The best use is a component that lets <em>its caller</em> decide how each item looks.
            </p>
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="highlight" label="SEE IT" heading="One list, two looks">
            <div class="mt-3 flex gap-2" role="group" aria-label="Item look">
              <button type="button" [attr.aria-pressed]="look() === 'plain'" (click)="look.set('plain')"
                      class="min-h-11 rounded-xl border px-4 text-sm font-semibold transition"
                      [class]="look() === 'plain' ? 'border-gold-400 bg-gold-500/15 text-gold-200' : 'border-stone-700 text-stone-300 hover:bg-stone-800'">Plain</button>
              <button type="button" [attr.aria-pressed]="look() === 'fancy'" (click)="look.set('fancy')"
                      class="min-h-11 rounded-xl border px-4 text-sm font-semibold transition"
                      [class]="look() === 'fancy' ? 'border-gold-400 bg-gold-500/15 text-gold-200' : 'border-stone-700 text-stone-300 hover:bg-stone-800'">Fancy</button>
            </div>
            <ng-template #plainItem let-item><span class="text-sm text-stone-200">{{ item }}</span></ng-template>
            <ng-template #fancyItem let-item let-i="index">
              <span class="inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-gold-500/10 px-3 py-1 text-sm text-gold-200">
                <span class="grid h-5 w-5 place-items-center rounded-full bg-gold-400 text-[11px] font-bold text-stone-950">{{ i + 1 }}</span>{{ item }}
              </span>
            </ng-template>
            <app-code-output class="mt-4 block" [code]="outletCode" caption="The list component never changes. The caller passes a different template.">
              <app-item-list-demo [items]="movies" [itemTemplate]="look() === 'fancy' ? fancyItem : plainItem" />
            </app-code-output>
          </app-lesson-card>

          <app-lesson-card class="mt-5" variant="highlight" label="PREDICT" heading="What shows?">
            <app-predict-output [challenge]="outletChallenge" />
          </app-lesson-card>

          <app-recap class="mt-5" [items]="recapOutlet" />
        </section>
      </ng-template>

      <!-- ── Try it ── -->
      <ng-template appLessonSection="try-it">
        <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <app-lesson-card class="mt-10" variant="highlight" label="TRY IT" heading="A cart table that uses all four tools">
            <p class="mt-2 text-sm text-stone-400">
              Change a quantity. Each row is drawn from one template with an outlet inside <code class="text-gold-300">ng-container</code>, so no stray element lands between the table's rows and cells.
              The grand total is a <code class="text-gold-300">&#64;let</code>.
            </p>
            <ng-template #row let-line>
              <td class="px-3 py-2 text-stone-200">{{ line.name }}</td>
              <td class="px-3 py-2 text-stone-400">{{ line.price }}</td>
              <td class="px-3 py-2">
                <label class="sr-only" [for]="'qty-' + line.id">Quantity of {{ line.name }}</label>
                <input [id]="'qty-' + line.id" type="number" min="0" [value]="line.qty" (input)="setQty(line.id, $any($event.target).valueAsNumber)"
                       class="w-16 rounded-lg border border-stone-600 bg-stone-800 px-2 py-1 text-stone-100 focus:border-gold-400 focus:outline-none" />
              </td>
              <td class="px-3 py-2 text-right text-gold-300">{{ line.price * line.qty }}</td>
            </ng-template>
            <div class="mt-4 overflow-x-auto rounded-xl border border-stone-800">
              <table class="w-full text-left text-sm">
                <thead class="bg-stone-800 text-stone-300">
                  <tr><th class="px-3 py-2 font-semibold">Item</th><th class="px-3 py-2 font-semibold">Price</th><th class="px-3 py-2 font-semibold">Qty</th><th class="px-3 py-2 text-right font-semibold">Line total</th></tr>
                </thead>
                <tbody class="divide-y divide-stone-800">
                  @for (line of cart(); track line.id) {
                    <tr><ng-container [ngTemplateOutlet]="row" [ngTemplateOutletContext]="{ $implicit: line }" /></tr>
                  }
                </tbody>
                @let total = grandTotal();
                <tfoot class="bg-stone-900">
                  <tr><td class="px-3 py-2 font-semibold text-stone-200" colspan="3">Grand total</td><td class="px-3 py-2 text-right font-bold text-gold-300">{{ total }}</td></tr>
                </tfoot>
              </table>
            </div>
          </app-lesson-card>

          <app-recap class="mt-5" [items]="recapTry" />
          <app-knowledge-check [items]="checkItems" />
        </section>
      </ng-template>
    </app-lesson-player>
  `,
})
export class TemplateToolsComponent {
  readonly section = input<string>();
  protected readonly Math = Math;

  protected readonly useContainer = signal(true);
  protected readonly drawn = signal(false);
  protected readonly look = signal<'plain' | 'fancy'>('plain');
  protected readonly price = 30;
  protected readonly qty = signal(2);
  protected readonly movies = ['Castle in the Sky', 'My Neighbor Totoro', 'Spirited Away'];

  protected readonly cart = signal<CartLine[]>([
    { id: 1, name: 'Notebook', price: 12, qty: 2 },
    { id: 2, name: 'Pen set', price: 8, qty: 1 },
    { id: 3, name: 'Backpack', price: 40, qty: 1 },
  ]);
  protected readonly grandTotal = computed(() => this.cart().reduce((sum, l) => sum + l.price * l.qty, 0));

  protected setQty(id: number, value: number): void {
    const qty = Number.isFinite(value) && value >= 0 ? value : 0;
    this.cart.update((lines) => lines.map((l) => (l.id === id ? { ...l, qty } : l)));
  }

  protected readonly containerCode = `<div class="row">
  <span>A</span>
  <ng-container>
    <span>B</span>
    <span>C</span>
  </ng-container>
</div>`;

  protected readonly templateCode = `<ng-template #greeting let-name>
  <p>Hello, {{ name }}!</p>
</ng-template>

<ng-container
  [ngTemplateOutlet]="greeting"
  [ngTemplateOutletContext]="{ $implicit: 'Ada' }" />`;

  protected readonly letCode = `@let total = price * qty();

<p>Total: {{ total }}</p>
<p>{{ total >= 100 ? 'Free delivery' : 'Add ' + (100 - total) }}</p>`;

  protected readonly mistakeLetWrong = `@let total = price * qty();
<button (click)="total = 0">Clear</button>`;
  protected readonly mistakeLetRight = `<button (click)="qty.set(0)">Clear</button>`;

  protected readonly outletCode = `// the list component
itemTemplate = input.required<TemplateRef<any>>();

<ng-container
  [ngTemplateOutlet]="itemTemplate()"
  [ngTemplateOutletContext]="{ $implicit: item }" />

// the caller
<app-item-list [items]="movies" [itemTemplate]="fancyItem" />`;

  protected readonly outletChallenge: PredictChallenge = {
    question: 'A template is declared with ng-template but nothing draws it. What does the page show?',
    code: '<ng-template #hello><p>Hello</p></ng-template>',
    options: [
      { id: 'a', text: 'Hello' },
      { id: 'b', text: 'An error' },
      { id: 'c', text: 'Nothing: the template is only a recipe' },
      { id: 'd', text: 'An empty paragraph' },
    ],
    correct: 'c',
    explanation: 'A template does nothing on its own. It appears only where an outlet, or a directive such as the old ngIf, draws it.',
  };

  protected readonly recapContainer = [
    'ng-container groups elements and leaves no HTML behind.',
    'Use it to hang a directive such as ngTemplateOutlet on a group.',
    '@if and @for add no wrapper, so they do not need it.',
  ];
  protected readonly recapTemplate = [
    'ng-template is a recipe that is not shown until something draws it.',
    'Name it with #name and read values with let-name.',
    'The default context value is called $implicit.',
  ];
  protected readonly recapLet = [
    '@let works a value out once and gives it a name.',
    'It is read-only and available only after its declaration.',
    'It is handy for unwrapping a signal once.',
  ];
  protected readonly recapOutlet = [
    'ngTemplateOutlet draws a template where you put it.',
    'ngTemplateOutletContext passes values in.',
    'Pass a template into a component to let its caller choose how items look.',
  ];
  protected readonly recapTry = [
    'One template drew every row, so the markup is written once.',
    'ng-container kept the table valid, with no extra element in a row.',
    'Next stop: component communication.',
  ];

  protected readonly checkItems: KnowledgeCheckItem[] = [
    { question: 'Why use ng-container instead of a div?', answer: 'It groups elements without adding an element to the page, so it cannot change the layout or break structures such as lists and tables.' },
    { question: 'What is the difference between ng-template and ng-container?', answer: 'ng-container is drawn right away but leaves no element. ng-template is not drawn at all until something, such as an outlet, asks for it.' },
    { question: 'What is a @let variable?', answer: 'A read-only name for a value worked out in the template. You can use it after its declaration, in the same template or a nested one.' },
  ];
}
