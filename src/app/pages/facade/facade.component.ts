import { Component, computed, inject, signal } from '@angular/core';

import { CodeBlockDirective } from '../../shared/code-block.directive';
import { LessonCardComponent } from '../../shared/lesson-card.component';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { RecapComponent, RecapItem } from '../../shared/recap.component';
import { TopicNavComponent } from '../../shared/topic-nav.component';
import { CartApi, CheckoutFacade, CheckoutStatus, DemoSettings, LogLine, PaymentApi, ReceiptApi, StockApi } from './checkout-demo';

type Mode = 'without' | 'with';

const SERVICES: LogLine['service'][] = ['CartApi', 'StockApi', 'PaymentApi', 'ReceiptApi'];

const WITHOUT_CODE = `// The component knows ALL four services, their order, and the undo logic.
private readonly cart = inject(CartApi);
private readonly stock = inject(StockApi);
private readonly payment = inject(PaymentApi);
private readonly receipt = inject(ReceiptApi);

async placeOrder() {
  let reservationId: string | undefined;
  try {
    const items = await this.cart.getItems();
    reservationId = await this.stock.reserve(items);
    const total = items.reduce((sum, i) => sum + i.price, 0);
    const ref = await this.payment.charge(total);
    await this.receipt.send(ref);
    this.message = 'Order placed!';
  } catch (error) {
    if (reservationId) await this.stock.release(reservationId);
    this.message = 'Order failed';
  }
}`;

const WITH_CODE = `// The component knows ONE thing: the facade.
private readonly checkout = inject(CheckoutFacade);

placeOrder() {
  this.checkout.placeOrder();
}

// the template just reads checkout.status(), checkout.log(), checkout.message()`;

@Component({
  standalone: true,
  imports: [CodeBlockDirective, RecapComponent, TopicNavComponent, PageHeaderComponent, LessonCardComponent],
  template: `
    <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <app-page-header title="Facade Pattern" illustration="facade" pdf="facade.pdf">
        A <strong class="text-stone-200">facade</strong> is one simple front door in front of a messy set of services. Instead of
        every component learning how the cart, the stock, the payment and the email services fit together, they ask a single
        class — <code class="text-gold-300">CheckoutFacade</code> — to "place the order". The facade knows the steps, the order,
        and what to undo when something fails. Try both versions below and compare what the component has to know.
      </app-page-header>

      <div class="mt-10 grid gap-5 md:grid-cols-2">
        <app-lesson-card label="1 · THE PROBLEM" heading="A component that has to be a project manager">
          <p class="mt-2 text-sm text-stone-400">
            Placing an order needs <b class="text-stone-200">four services</b>, called in the <b class="text-stone-200">right order</b>,
            with an <b class="text-stone-200">undo</b> if the payment fails. If the component does all of that:
          </p>
          <ul class="mt-3 space-y-1.5 text-sm text-stone-400">
            <li>• it injects four services it should not care about;</li>
            <li>• the same steps get copy-pasted into every component that checks out;</li>
            <li>• fixing the order or the rollback means editing every copy;</li>
            <li>• testing the component means faking four services.</li>
          </ul>
        </app-lesson-card>

        <app-lesson-card label="2 · THE IDEA" heading="Ask the waiter, not the kitchen">
          <p class="mt-2 text-sm text-stone-400">
            In a restaurant you do not walk into the kitchen to tell the chef, the barista and the cashier what to do. You tell the
            <b class="text-stone-200">waiter</b> "I'll have the set menu" and the waiter coordinates everyone. The Facade pattern
            (from the classic <i>Gang of Four</i> design patterns) is the waiter:
          </p>
          <p class="mt-3 rounded-xl bg-stone-800 p-3 text-sm text-stone-300">
            <b class="text-gold-300">Facade</b> = a class that gives a <b>simple, unified interface</b> to a complicated subsystem.
          </p>
        </app-lesson-card>

        <app-lesson-card class="md:col-span-2" label="3 · BEFORE AND AFTER" heading="Same four services, very different component">
          <div class="mt-4 grid gap-4 md:grid-cols-2">
            <figure class="rounded-xl bg-stone-800 p-4">
              <figcaption class="text-xs font-bold uppercase tracking-wider text-[rgb(var(--panel-danger-heading))]">Without a facade</figcaption>
              <svg viewBox="0 0 270 190" class="mt-2 h-auto w-full" role="img" aria-label="A component connected directly to four services" fill="none">
                <rect class="box" x="8" y="68" width="74" height="54" rx="10" />
                <text class="t" x="45" y="99" text-anchor="middle">Component</text>
                @for (s of services; track s; let i = $index) {
                  <rect class="box" x="168" [attr.y]="8 + i * 48" width="94" height="30" rx="8" />
                  <text class="t small" x="215" [attr.y]="28 + i * 48" text-anchor="middle">{{ s }}</text>
                  <path class="line bad" [attr.d]="'M82 95 L168 ' + (23 + i * 48)" />
                }
              </svg>
              <p class="mt-2 text-sm text-stone-400"><b class="text-stone-200">4</b> dependencies · <b class="text-stone-200">4</b> calls to get in the right order</p>
            </figure>
            <figure class="rounded-xl bg-stone-800 p-4">
              <figcaption class="text-xs font-bold uppercase tracking-wider text-emerald-400">With a facade</figcaption>
              <svg viewBox="0 0 270 190" class="mt-2 h-auto w-full" role="img" aria-label="A component connected to one facade that coordinates four services" fill="none">
                <rect class="box" x="4" y="68" width="62" height="54" rx="10" />
                <text class="t" x="35" y="99" text-anchor="middle">Component</text>
                <rect class="box gold" x="92" y="40" width="62" height="110" rx="10" />
                <text class="t gold-t" x="123" y="92" text-anchor="middle">Checkout</text>
                <text class="t gold-t" x="123" y="106" text-anchor="middle">Facade</text>
                <path class="line good" d="M66 95 L92 95" />
                @for (s of services; track s; let i = $index) {
                  <rect class="box" x="176" [attr.y]="8 + i * 48" width="86" height="30" rx="8" />
                  <text class="t small" x="219" [attr.y]="28 + i * 48" text-anchor="middle">{{ s }}</text>
                  <path class="line" [attr.d]="'M154 95 L176 ' + (23 + i * 48)" />
                }
              </svg>
              <p class="mt-2 text-sm text-stone-400"><b class="text-stone-200">1</b> dependency · <b class="text-stone-200">1</b> call: <code class="text-gold-300">placeOrder()</code></p>
            </figure>
          </div>
        </app-lesson-card>

        <app-lesson-card variant="highlight" class="md:col-span-2" label="4 · TRY IT" heading="Place the same order both ways">
          <p class="mt-2 text-sm text-stone-400">
            Both versions do <b class="text-stone-200">exactly the same work</b> and produce the same log. The difference is where the
            knowledge lives. Turn on "decline the card" to watch the rollback.
          </p>

          <div class="mt-4 flex flex-wrap items-center gap-3">
            <div class="inline-flex rounded-xl border border-stone-700 p-1" role="radiogroup" aria-label="Which version to run">
              <button type="button" role="radio" [attr.aria-checked]="mode() === 'without'" (click)="setMode('without')" class="min-h-11 rounded-lg px-4 text-sm font-semibold transition" [class]="mode() === 'without' ? 'bg-gold-500 text-white' : 'text-stone-300 hover:bg-stone-800'">Without a facade</button>
              <button type="button" role="radio" [attr.aria-checked]="mode() === 'with'" (click)="setMode('with')" class="min-h-11 rounded-lg px-4 text-sm font-semibold transition" [class]="mode() === 'with' ? 'bg-gold-500 text-white' : 'text-stone-300 hover:bg-stone-800'">With a facade</button>
            </div>
            <label class="flex min-h-11 cursor-pointer items-center gap-2 text-sm text-stone-300">
              <input type="checkbox" class="h-4 w-4 accent-[rgb(var(--gold-500))]" [checked]="settings.declineCard()" (change)="settings.declineCard.set(!settings.declineCard())" />
              Decline the card
            </label>
          </div>

          <div class="mt-4 grid gap-4 lg:grid-cols-2">
            <div class="min-w-0">
              <p class="text-xs font-bold uppercase tracking-wider text-gold-300">What the component contains</p>
              <!-- Two separate <pre>s (not one with changing text): the code-block directive highlights a <pre> once when it appears. -->
              @if (mode() === 'with') {
                <pre class="mt-2 max-h-80 overflow-auto rounded-xl bg-stone-950 p-4 text-xs text-gold-200">{{ withCode }}</pre>
              } @else {
                <pre class="mt-2 max-h-80 overflow-auto rounded-xl bg-stone-950 p-4 text-xs text-gold-200">{{ withoutCode }}</pre>
              }
              <div class="mt-3 flex flex-wrap gap-2 text-xs">
                <span class="rounded-full bg-stone-800 px-3 py-1 text-stone-300">Services it knows: <b class="text-gold-300">{{ mode() === 'with' ? 1 : 4 }}</b></span>
                <span class="rounded-full bg-stone-800 px-3 py-1 text-stone-300">Handler lines: <b class="text-gold-300">{{ handlerLines() }}</b></span>
              </div>
            </div>

            <div class="min-w-0">
              <p class="text-xs font-bold uppercase tracking-wider text-gold-300">What happens</p>
              <div class="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4" aria-hidden="true">
                @for (s of services; track s) {
                  <span class="rounded-lg border px-2 py-1.5 text-center font-mono text-[11px] transition" [class]="chipClass(s)">{{ s }}</span>
                }
              </div>
              <ol class="mt-3 min-h-[8.5rem] space-y-1.5 rounded-xl bg-stone-950 p-3 text-sm" aria-live="polite">
                @for (line of log(); track $index) {
                  <li class="flex items-start gap-2">
                    <span [class]="line.status === 'ok' ? 'text-emerald-400' : line.status === 'fail' ? 'text-[rgb(var(--panel-danger-heading))]' : 'text-gold-300'">{{ line.status === 'ok' ? '✓' : line.status === 'fail' ? '✗' : '↩' }}</span>
                    <span class="text-stone-300"><b class="font-mono text-xs text-stone-400">{{ line.service }}</b> {{ line.text }}</span>
                  </li>
                } @empty {
                  <li class="text-stone-500">Press “Place order” to start.</li>
                }
              </ol>
              @if (message()) {
                <p role="status" class="mt-3 rounded-xl p-3 text-sm font-semibold" [class]="status() === 'success' ? 'bg-[rgb(var(--panel-success-bg))] text-[rgb(var(--panel-success-heading))]' : 'bg-[rgb(var(--panel-danger-bg))] text-[rgb(var(--panel-danger-heading))]'">{{ message() }}</p>
              }
              <div class="mt-3 flex gap-3">
                <button type="button" (click)="place()" [disabled]="status() === 'working'" class="min-h-11 rounded-xl bg-gold-500 px-5 text-sm font-semibold text-white hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-60">{{ status() === 'working' ? 'Working…' : 'Place order' }}</button>
                <button type="button" (click)="reset()" [disabled]="status() === 'working'" class="min-h-11 rounded-xl border border-stone-700 px-4 text-sm font-semibold hover:bg-stone-800 disabled:opacity-60">Reset</button>
              </div>
            </div>
          </div>
        </app-lesson-card>

        <app-lesson-card class="md:col-span-2" label="5 · BUILD ONE" heading="Five steps to your own facade">
          <ol class="mt-4 grid gap-3 md:grid-cols-5">
            @for (step of buildSteps; track step.title; let i = $index) {
              <li class="rounded-xl bg-stone-800 p-4">
                <span class="grid h-7 w-7 place-items-center rounded-full bg-gold-500/20 text-sm font-bold text-gold-300">{{ i + 1 }}</span>
                <p class="mt-2 font-semibold text-stone-100">{{ step.title }}</p>
                <p class="mt-1 text-xs text-stone-400">{{ step.text }}</p>
              </li>
            }
          </ol>
          <pre class="mt-4 overflow-x-auto rounded-xl bg-stone-950 p-4 text-xs text-gold-200">{{ facadeCode }}</pre>
        </app-lesson-card>

        <app-lesson-card label="6 · USING IT" heading="The component gets tiny">
          <p class="mt-2 text-sm text-stone-400">
            Components inject only the facade and read its signals. They never import the subsystem services, so those can change
            freely behind the facade.
          </p>
          <pre class="mt-3 overflow-x-auto rounded-xl bg-stone-950 p-4 text-xs text-gold-200">{{ usageCode }}</pre>
        </app-lesson-card>

        <app-lesson-card label="7 · WHERE IT LIVES" heading="Folder and naming">
          <pre class="mt-3 overflow-x-auto rounded-xl bg-stone-950 p-4 text-xs text-gold-200">{{ folderCode }}</pre>
          <ul class="mt-3 space-y-1.5 text-sm text-stone-400">
            <li>• One facade per <b class="text-stone-200">feature</b> (checkout, products, auth) — not one for the whole app.</li>
            <li>• Name it <code class="text-gold-300">XxxFacade</code> so people recognise the role.</li>
            <li>• Provide it with <code class="text-gold-300">providedIn: 'root'</code>, or in the feature's route <code class="text-gold-300">providers</code>.</li>
          </ul>
        </app-lesson-card>

        <app-lesson-card class="md:col-span-2" label="8 · TWO COMMON FLAVOURS" heading="Which kind of facade do you need?">
          <div class="mt-3 overflow-x-auto">
            <table class="w-full min-w-[34rem] text-left text-sm">
              <thead>
                <tr class="text-xs uppercase tracking-wider text-gold-300">
                  <th class="py-2 pr-4">Flavour</th>
                  <th class="py-2 pr-4">What it hides</th>
                  <th class="py-2">Example</th>
                </tr>
              </thead>
              <tbody class="text-stone-300">
                @for (row of flavours; track row.name) {
                  <tr class="border-t border-stone-800 align-top">
                    <td class="py-2 pr-4 font-semibold text-stone-100">{{ row.name }}</td>
                    <td class="py-2 pr-4 text-stone-400">{{ row.hides }}</td>
                    <td class="py-2 text-stone-400">{{ row.example }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </app-lesson-card>

        <app-lesson-card variant="success" label="9 · USE IT WHEN" heading="Good reasons">
          <ul class="mt-3 space-y-1.5 text-sm text-stone-300">
            <li>✓ One action needs <b>several services</b> in a fixed order.</li>
            <li>✓ The same steps appear in <b>more than one component</b>.</li>
            <li>✓ You want components that only <b>show and click</b>.</li>
            <li>✓ You want to <b>swap or change</b> a subsystem without touching the UI.</li>
            <li>✓ A feature is hard to test because of its many dependencies.</li>
          </ul>
        </app-lesson-card>

        <app-lesson-card variant="danger" label="10 · SKIP IT WHEN" heading="Bad reasons">
          <ul class="mt-3 space-y-1.5 text-sm text-stone-300">
            <li>✗ The component uses <b>one</b> service with one call — a facade would just be a pass-through.</li>
            <li>✗ It would become a <b>"god class"</b> that does everything for the whole app.</li>
            <li>✗ You are putting <b>UI work</b> (templates, DOM) in it — that belongs to the component.</li>
            <li>✗ You hide a subsystem that components genuinely need full control of.</li>
          </ul>
        </app-lesson-card>

        <app-lesson-card class="md:col-span-2" label="11 · NOT TO BE CONFUSED WITH" heading="Facade vs. its look-alikes">
          <div class="mt-3 overflow-x-auto">
            <table class="w-full min-w-[34rem] text-left text-sm">
              <thead>
                <tr class="text-xs uppercase tracking-wider text-gold-300">
                  <th class="py-2 pr-4">Pattern</th>
                  <th class="py-2 pr-4">Purpose</th>
                  <th class="py-2">In one line</th>
                </tr>
              </thead>
              <tbody class="text-stone-300">
                @for (row of lookalikes; track row.name) {
                  <tr class="border-t border-stone-800 align-top">
                    <td class="py-2 pr-4 font-semibold text-stone-100">{{ row.name }}</td>
                    <td class="py-2 pr-4 text-stone-400">{{ row.purpose }}</td>
                    <td class="py-2 text-stone-400">{{ row.line }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </app-lesson-card>

        <app-lesson-card class="md:col-span-2" label="12 · TESTING" heading="Two small kinds of test">
          <pre class="mt-3 overflow-x-auto rounded-xl bg-stone-950 p-4 text-xs text-gold-200">{{ testCode }}</pre>
        </app-lesson-card>
      </div>

      <app-recap [items]="recapItems" />
      <app-topic-nav />
    </section>
  `,
  styles: `
    .box {
      fill: rgb(var(--stone-900));
      stroke: rgb(var(--stone-700));
      stroke-width: 1.5;
    }
    .box.gold {
      stroke: rgb(var(--gold-400));
    }
    .t {
      font: 600 11px ui-monospace, SFMono-Regular, Menlo, monospace;
      fill: rgb(var(--stone-200));
    }
    .t.small {
      font-size: 10px;
    }
    .t.gold-t {
      fill: rgb(var(--gold-300));
    }
    .line {
      stroke: rgb(var(--stone-600));
      stroke-width: 1.5;
    }
    .line.bad {
      stroke: rgb(var(--panel-danger-heading));
      opacity: 0.7;
    }
    .line.good {
      stroke: rgb(var(--gold-400));
      stroke-width: 2.5;
    }
  `,
})
export class FacadeComponent {
  readonly settings = inject(DemoSettings);
  private readonly facade = inject(CheckoutFacade);
  private readonly cart = inject(CartApi);
  private readonly stock = inject(StockApi);
  private readonly payment = inject(PaymentApi);
  private readonly receipt = inject(ReceiptApi);

  readonly services = SERVICES;
  readonly mode = signal<Mode>('without');

  // The "without a facade" run keeps its own state, exactly as a component doing all the work would.
  private readonly manualLog = signal<LogLine[]>([]);
  private readonly manualStatus = signal<CheckoutStatus>('idle');
  private readonly manualMessage = signal('');

  readonly log = computed(() => (this.mode() === 'with' ? this.facade.log() : this.manualLog()));
  readonly status = computed(() => (this.mode() === 'with' ? this.facade.status() : this.manualStatus()));
  readonly message = computed(() => (this.mode() === 'with' ? this.facade.message() : this.manualMessage()));
  readonly withCode = WITH_CODE;
  readonly withoutCode = WITHOUT_CODE;
  readonly handlerLines = computed(() => {
    const body = this.mode() === 'with' ? 'placeOrder() {\n  this.checkout.placeOrder();\n}' : WITHOUT_CODE.slice(WITHOUT_CODE.indexOf('async placeOrder()'));
    return body.split('\n').length;
  });

  setMode(mode: Mode): void {
    if (this.status() === 'working') return;
    this.mode.set(mode);
  }

  chipClass(service: LogLine['service']): string {
    const last = [...this.log()].reverse().find((line) => line.service === service);
    if (!last) return 'border-stone-700 text-stone-500';
    if (last.status === 'ok') return 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400';
    if (last.status === 'fail') return 'border-[rgb(var(--panel-danger-heading))]/50 bg-[rgb(var(--panel-danger-bg))] text-[rgb(var(--panel-danger-heading))]';
    return 'border-gold-400/50 bg-gold-500/10 text-gold-300';
  }

  place(): void {
    if (this.mode() === 'with') {
      void this.facade.placeOrder();
    } else {
      void this.placeManually();
    }
  }

  reset(): void {
    this.facade.reset();
    this.manualLog.set([]);
    this.manualStatus.set('idle');
    this.manualMessage.set('');
  }

  /** What a component has to do on its own when there is no facade (mirrors WITHOUT_CODE). */
  private async placeManually(): Promise<void> {
    if (this.manualStatus() === 'working') return;
    this.manualLog.set([]);
    this.manualMessage.set('');
    this.manualStatus.set('working');
    const add = (service: LogLine['service'], text: string, status: LogLine['status']) => this.manualLog.update((lines) => [...lines, { service, text, status }]);

    let reservationId: string | undefined;
    let step: LogLine['service'] = 'CartApi';
    try {
      const items = await this.cart.getItems();
      add('CartApi', `Loaded ${items.length} items`, 'ok');
      step = 'StockApi';
      reservationId = await this.stock.reserve(items);
      add('StockApi', `Reserved stock (${reservationId})`, 'ok');
      step = 'PaymentApi';
      const total = items.reduce((sum, item) => sum + item.price, 0);
      const ref = await this.payment.charge(total);
      add('PaymentApi', `Charged $${total} (${ref})`, 'ok');
      step = 'ReceiptApi';
      await this.receipt.send(ref);
      add('ReceiptApi', 'Receipt emailed', 'ok');
      this.manualMessage.set('Order placed!');
      this.manualStatus.set('success');
    } catch (error) {
      add(step, (error as Error).message, 'fail');
      if (reservationId) {
        await this.stock.release(reservationId);
        add('StockApi', `Released stock (${reservationId}) — rolled back`, 'undo');
      }
      this.manualMessage.set(step === 'PaymentApi' ? 'Order failed — nothing was charged.' : 'Order failed.');
      this.manualStatus.set('failed');
    }
  }

  readonly buildSteps = [
    { title: 'List the subsystems', text: 'Which services does one user action touch? Write them down in order.' },
    { title: 'Create the class', text: '@Injectable() named XxxFacade, one per feature.' },
    { title: 'Inject the services', text: 'Use inject() — the facade is the only place that knows them.' },
    { title: 'Expose a small API', text: 'A few methods named after user intentions, plus signals for state.' },
    { title: 'Switch the components', text: 'Components inject only the facade and delete their old service calls.' },
  ];

  readonly facadeCode = `@Injectable({ providedIn: 'root' })
export class CheckoutFacade {
  // 1-3: the facade is the only class that knows the subsystems
  private readonly cart = inject(CartApi);
  private readonly stock = inject(StockApi);
  private readonly payment = inject(PaymentApi);
  private readonly receipt = inject(ReceiptApi);

  // 4: a small, UI-friendly surface — state as read-only signals ...
  readonly status = signal<'idle' | 'working' | 'success' | 'failed'>('idle');
  readonly message = signal('');

  // ... and methods named after what the user wants
  async placeOrder(): Promise<void> {
    this.status.set('working');
    let reservationId: string | undefined;
    try {
      const items = await this.cart.getItems();
      reservationId = await this.stock.reserve(items);
      await this.payment.charge(total(items));
      await this.receipt.send(reservationId);
      this.status.set('success');
    } catch {
      if (reservationId) await this.stock.release(reservationId);   // the undo lives here
      this.status.set('failed');
    }
  }
}`;

  readonly usageCode = `@Component({
  selector: 'app-checkout',
  template: \`
    <button (click)="checkout.placeOrder()" [disabled]="checkout.status() === 'working'">
      Place order
    </button>
    <p>{{ checkout.message() }}</p>
  \`,
})
export class CheckoutComponent {
  protected readonly checkout = inject(CheckoutFacade);   // the only dependency
}`;

  readonly folderCode = `src/app/features/checkout/
├── checkout.facade.ts        ← the facade
├── checkout.component.ts     ← talks only to the facade
└── data/
    ├── cart.api.ts           ← subsystems
    ├── stock.api.ts
    ├── payment.api.ts
    └── receipt.api.ts`;

  readonly flavours = [
    { name: 'Service facade', hides: 'Several services that must be called in order', example: 'CheckoutFacade (this lesson)' },
    { name: 'State facade', hides: 'The state library (NgRx store, selectors, actions)', example: 'ProductsFacade.products() and .load() instead of store.select / dispatch' },
    { name: 'API facade', hides: 'Several HTTP endpoints behind one friendly method', example: 'ProfileFacade.load() calls /user, /settings and /avatar together' },
  ];

  readonly lookalikes = [
    { name: 'Facade', purpose: 'Simplify a complicated subsystem', line: 'One easy front door to many classes.' },
    { name: 'Adapter', purpose: 'Make an incompatible interface fit', line: 'Converts one interface into the one you expect.' },
    { name: 'Mediator', purpose: 'Let components talk without knowing each other', line: 'A traffic controller between peers; the facade only talks one way (down).' },
    { name: 'Plain service', purpose: 'Hold one piece of logic or data', line: 'A single worker; a facade coordinates several workers.' },
  ];

  readonly testCode = `// 1. Test the facade: fake the four subsystems and check the sequence and the rollback.
TestBed.configureTestingModule({
  providers: [{ provide: PaymentApi, useValue: { charge: () => Promise.reject(new Error('declined')) } }],
});
const facade = TestBed.inject(CheckoutFacade);
await facade.placeOrder();
expect(facade.status()).toBe('failed');       // and stock.release() was called

// 2. Test the component: fake only the facade — nothing else.
TestBed.configureTestingModule({
  providers: [{ provide: CheckoutFacade, useValue: { placeOrder: jasmine.createSpy(), status: signal('idle'), message: signal('') } }],
});`;

  readonly recapItems: RecapItem[] = [
    {
      question: 'What problem does a facade solve?',
      answer: 'A component would otherwise have to know several services, the order to call them in, and how to undo a failure. The facade owns that knowledge, so the component asks for one simple action.',
    },
    {
      question: 'Does a facade replace the subsystem services?',
      answer: 'No. It sits in front of them and calls them. The services stay small and focused; the facade only coordinates them.',
    },
    {
      question: 'How is a facade different from an adapter?',
      answer: 'An adapter converts one interface into another that already exists. A facade creates a new, simpler interface over many classes.',
    },
    {
      question: 'What are the warning signs that a facade has become a problem?',
      answer: 'It is a pass-through for a single call, it grows into a "god class" for the whole app, or it contains UI/template logic that belongs in a component.',
    },
  ];
}
