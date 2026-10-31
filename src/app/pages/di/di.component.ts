import { ChangeDetectionStrategy, Component, inject, Injectable, injectAsync, input, signal } from '@angular/core';

import { CodeBlockDirective } from '../../shared/code-block.directive';
import { FlowDiagramComponent } from '../../shared/flow-diagram.component';
import { LessonCardComponent } from '../../shared/lesson-card.component';
import { DiTreeDemoComponent } from './di-tree-demo.component';
import { ProviderRecipeDemoComponent } from './provider-recipe-demo.component';
import { OrderStepsComponent } from '../../shared/order-steps.component';
import { PredictOutputComponent } from '../../shared/predict-output.component';
import type { PredictChallenge } from '../../shared/predict-output.component';
import { TermComponent } from '../../shared/term.component';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { KnowledgeCheckComponent, KnowledgeCheckItem } from '../../shared/knowledge-check.component';
import { LessonPlayerComponent } from '../../learn/player/lesson-player.component';
import { LessonSectionDirective } from '../../learn/player/lesson-section.directive';
import { RecapComponent } from '../../shared/recap.component';
import { CommonMistakeComponent } from '../../shared/common-mistake.component';
import { CodeOutputComponent } from '../../shared/code-output.component';

let nextInstanceId = 1;

/** One instance for the whole app (providedIn: 'root'). */
@Injectable({ providedIn: 'root' })
export class SharedCounter {



  readonly instanceId = nextInstanceId++;
  readonly count = signal(0);
  increment(): void {
    this.count.update((value) => value + 1);
  }
}

/** No providedIn: only exists where a component lists it in `providers`. */
@Injectable()
export class PrivateCounter {
  readonly instanceId = nextInstanceId++;
  readonly count = signal(0);
  increment(): void {
    this.count.update((value) => value + 1);
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-di-shared-counter',
  standalone: true,
  template: `
    <div class="rounded-xl bg-stone-800 p-4">
      <p class="text-xs text-stone-400">Component · service instance <strong class="text-gold-300">#{{ counter.instanceId }}</strong></p>
      <div class="mt-2 flex items-center gap-3">
        <strong class="text-2xl">{{ counter.count() }}</strong>
        <button type="button" (click)="counter.increment()" class="min-h-11 rounded-lg border border-stone-600 px-3 hover:bg-stone-700">+1</button>
      </div>
    </div>
  `,
})
export class DiSharedCounterComponent {
  readonly counter = inject(SharedCounter);
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-di-private-counter',
  standalone: true,
  providers: [PrivateCounter],
  template: `
    <div class="rounded-xl bg-stone-800 p-4">
      <p class="text-xs text-stone-400">Component · service instance <strong class="text-gold-300">#{{ counter.instanceId }}</strong></p>
      <div class="mt-2 flex items-center gap-3">
        <strong class="text-2xl">{{ counter.count() }}</strong>
        <button type="button" (click)="counter.increment()" class="min-h-11 rounded-lg border border-stone-600 px-3 hover:bg-stone-700">+1</button>
      </div>
    </div>
  `,
})
export class DiPrivateCounterComponent {
  readonly counter = inject(PrivateCounter);
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CodeOutputComponent, CommonMistakeComponent, RecapComponent, DiTreeDemoComponent, ProviderRecipeDemoComponent, OrderStepsComponent, PredictOutputComponent, TermComponent, DiSharedCounterComponent, DiPrivateCounterComponent, FlowDiagramComponent, CodeBlockDirective, KnowledgeCheckComponent, PageHeaderComponent, LessonCardComponent, LessonPlayerComponent, LessonSectionDirective],
  template: `
    <app-lesson-player [topicId]="'di'" [section]="section()">
      <ng-template appLessonSection="basics">
      <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <app-page-header title="Dependency Injection" illustration="di">
        Components should not build the things they depend on — a component that does
        <code class="text-gold-300">new CartService()</code> can never share that cart with another component, and is painful to
        test. Instead it <em>asks</em> Angular for one with <code class="text-gold-300">inject()</code>, and Angular's <app-term term="injector">injector</app-term>
        decides whether to hand over a shared instance or create a fresh one. Click the counters below to see the difference.
      </app-page-header>

      <app-lesson-card class="mt-8" variant="danger" label="THE PROBLEM" heading="If every component builds its own, nothing is shared">
        <p class="mt-2 text-sm text-stone-400">
          Two components both write <code class="text-gold-300">new CartService()</code> and now there are two carts. Adding an item in one
          never shows up in the other. And to test either component you are stuck with the real service, including its network calls.
        </p>
      </app-lesson-card>

      <app-lesson-card class="mt-5" tone="amber" label="MENTAL MODEL" heading="A hotel front desk">
        <p class="mt-2 text-sm text-stone-400">
          You do not bring your own towels, you ask the front desk. The desk (the <strong class="text-stone-200">injector</strong>) knows where
          the towels are kept, hands you the same shared stock, or brings a fresh set just for your room if that is how the hotel is set up.
          You only say <em>what</em> you need, never <em>how</em> it is made.
        </p>
      </app-lesson-card>

      <div class="mt-5 grid gap-5 md:grid-cols-2">
        <app-lesson-card label="1 · INJECT()" heading="Ask for it, don't build it">
          <p class="mt-2 text-sm text-stone-400">
            A class marked <code class="text-gold-300">&#64;Injectable</code> can be requested anywhere with
            <code class="text-gold-300">inject(Service)</code>. <code class="text-gold-300">providedIn: 'root'</code> tells Angular to create
            exactly one instance for the whole app.
          </p>
          <app-flow-diagram class="mt-4 block" from="inject(CartService)" to="the injector hands over the instance" direction="right" />
          <pre class="mt-4 overflow-x-auto rounded-xl bg-stone-950 p-4 text-xs text-gold-200">{{ rootCode }}</pre>
        </app-lesson-card>
      </div>
        <app-recap class="mt-5" [items]="recapBasics" />
      </section>
      </ng-template>

      <ng-template appLessonSection="service">
      <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <app-lesson-card class="mt-10" label="THE SERVICE" heading="A plain class that Angular can hand out">
          <p class="mt-2 text-sm text-stone-400">
            A service is an ordinary class that holds logic or data you want to share. Mark it with <code class="text-gold-300">&#64;Service()</code> and Angular makes it
            available everywhere, creating one shared instance the first time someone asks for it.
          </p>
          <pre class="mt-4" [appCode]="serviceCode"></pre>
        </app-lesson-card>

        <app-lesson-card class="mt-5" label="OLD AND NEW" heading="&#64;Service() and &#64;Injectable">
          <p class="mt-2 text-sm text-stone-400">
            For app-wide services, <code class="text-gold-300">&#64;Service()</code> is the short form in Angular 22. Most existing code, and most tutorials, use
            <code class="text-gold-300">&#64;Injectable(&#123; providedIn: 'root' &#125;)</code>. Both work, and you will see both. If you want a service you provide yourself, use
            <code class="text-gold-300">&#64;Service(&#123; autoProvided: false &#125;)</code> and list it in a <code class="text-gold-300">providers</code> array.
          </p>
        </app-lesson-card>

        <app-common-mistake class="mt-5" title="A service with no decorator" [wrong]="mistakeDecoratorWrong" [right]="mistakeDecoratorRight">
          Without a decorator Angular does not know the class is a service, so <code class="text-gold-300">inject(CartService)</code> fails with a "no provider" error.
        </app-common-mistake>

        <app-recap class="mt-5" [items]="recapService" />
      </section>
      </ng-template>

      <ng-template appLessonSection="scope">
      <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <div class="mt-10 grid gap-5 md:grid-cols-2">
        <app-lesson-card variant="highlight" label="2 · ONE SHARED INSTANCE" heading="providedIn: 'root'">
          <p class="mt-2 text-sm text-stone-400">
            Both components inject the same root service. Same instance number, same count — click either one.
          </p>
          <div class="mt-4 grid gap-3 sm:grid-cols-2">
            <app-di-shared-counter />
            <app-di-shared-counter />
          </div>
        </app-lesson-card>
        <app-lesson-card variant="highlight" class="md:col-span-2" label="3 · ONE INSTANCE EACH" heading="providers: [ … ] on the component">
          <p class="mt-2 text-sm text-stone-400">
            When a component lists the service in its own <code class="text-gold-300">providers</code>, Angular creates a new
            instance for every copy of that component. Different instance numbers, independent counts.
          </p>
          <div class="mt-4 grid gap-3 sm:grid-cols-2">
            <app-di-private-counter />
            <app-di-private-counter />
          </div>
          <pre class="mt-4 overflow-x-auto rounded-xl bg-stone-950 p-4 text-xs text-gold-200">{{ providersCode }}</pre>
        </app-lesson-card>
      </div>

      <app-lesson-card class="mt-5" variant="highlight" label="PREDICT" heading="Two copies, same service">
        <app-predict-output [challenge]="scopeChallenge" />
      </app-lesson-card>

      <app-lesson-card class="mt-5" variant="highlight" label="SEE IT · WHO GETS WHICH INSTANCE?" heading="Provide a service at different levels of the tree">
        <ol class="mt-2 list-decimal space-y-1 pl-5 text-sm text-stone-400">
          <li>Press <strong class="text-stone-200">+1 item</strong> on Card #1. Every component shows 1, because they all share the root instance.</li>
          <li>Switch on <strong class="text-stone-200">Provide here</strong> for ProductListComponent. The list and its two cards now share a new cart. The header and the app still use the root one.</li>
          <li>Also switch it on for Card #2. It leaves the list's cart and gets a cart of its own.</li>
        </ol>
        <app-di-tree-demo />
      </app-lesson-card>
        <app-recap class="mt-5" [items]="recapScope" />
      </section>
      </ng-template>

      <ng-template appLessonSection="providers">
      <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <app-lesson-card class="mt-8" tone="amber" label="MENTAL MODEL" heading="A token is a name on a menu">
        <p class="mt-2 text-sm text-stone-400">
          A class can be its own token, but sometimes there is no class to ask for: a URL, a config object, a feature flag.
          For those you make an <code class="text-gold-300">InjectionToken</code>. The provider is the kitchen's recipe for that name, and you can
          change the recipe without changing anyone who orders it.
        </p>
        <pre class="mt-4 overflow-x-auto rounded-xl bg-stone-950 p-4 text-xs text-gold-200">{{ tokenCode }}</pre>
      </app-lesson-card>

      <app-lesson-card class="mt-5" variant="highlight" label="TRY IT" heading="Change the recipe, keep the caller" headingSize="lg">
        <p class="mt-2 text-sm text-stone-400">
          The caller always writes <code class="text-gold-300">inject(GREETER)</code>. Choose a provider and see what it gets back. This runs a real Angular injector.
        </p>
        <app-provider-recipe-demo />
      </app-lesson-card>

      <div class="mt-5 grid gap-5 md:grid-cols-2">
        <app-lesson-card label="CUSTOM PROVIDERS" heading="Swap the implementation with useClass, useValue or useFactory">
          <p class="mt-2 text-sm text-stone-400">
            A provider tells the injector how to create a token. <code class="text-gold-300">useClass</code> swaps one class for another,
            <code class="text-gold-300">useValue</code> supplies a fixed value, and <code class="text-gold-300">useFactory</code> builds the instance with a function.
            Tests use the same idea to replace real services with fakes.
          </p>
          <pre class="mt-4 overflow-x-auto rounded-xl bg-stone-950 p-4 text-xs text-gold-200">providers: [
  &#123; provide: CartService, useClass: FakeCartService &#125;,
  &#123; provide: API_URL, useValue: '/api' &#125;,
]</pre>
        </app-lesson-card>
      </div>


      <app-lesson-card class="mt-5" variant="danger" label="COMMON MISTAKES" heading="Dependency injection mistakes to avoid">
        <ul class="mt-3 list-disc space-y-2 pl-5 text-sm text-stone-300">
          <li><strong class="text-stone-100">Expecting shared state but getting copies.</strong> A service listed in a component's <code class="text-gold-300">providers</code> is created again for that component. Use <code class="text-gold-300">providedIn: 'root'</code> when everyone should share one.</li>
          <li><strong class="text-stone-100">Creating a service with new.</strong> <code class="text-gold-300">new CartService()</code> skips DI, so it cannot get its own dependencies and is hard to replace in tests. Use <code class="text-gold-300">inject(CartService)</code>.</li>
          <li><strong class="text-stone-100">Two services that need each other.</strong> A circular dependency is a design smell. Move the shared part into a third service.</li>
        </ul>
      </app-lesson-card>

      <app-lesson-card class="mt-5" variant="highlight" label="PUT IT IN ORDER" heading="What inject(CartService) does">
        <p class="mt-2 text-sm text-stone-400">Put these steps in the order the injector performs them the first time something asks for a root service.</p>
        <app-order-steps
          [steps]="injectSteps"
          explanation="The component only names the token. The injector looks for a provider, walking up from the component to the root. If it has no instance yet it creates one and keeps it, so every later request gets the same object."
        />
      </app-lesson-card>

        <app-recap class="mt-5" [items]="recapProviders" />
      <app-knowledge-check [items]="checkItems" />
</section>
      </ng-template>
      <ng-template appLessonSection="lazy">
      <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <app-lesson-card class="mt-10" label="THE PROBLEM" heading="A big service you rarely use still costs every visitor">
          <p class="mt-2 text-sm text-stone-400">
            If a component imports a heavy service at the top of the file, its code is part of the first download, even if the user never presses the button that needs it.
            <code class="text-gold-300">injectAsync()</code> loads the service only when you ask for it.
          </p>
        </app-lesson-card>

        <app-lesson-card class="mt-5" variant="highlight" label="TRY IT" heading="Load the service on demand">
          <div class="mt-3 flex flex-wrap items-center gap-3">
            <button type="button" (click)="buildReport()" [disabled]="reportBusy()"
                    class="min-h-11 rounded-xl bg-gold-solid px-4 text-sm font-semibold text-white hover:bg-gold-solid-hover disabled:cursor-not-allowed disabled:opacity-50">
              {{ reportBusy() ? 'Loading…' : 'Build a report' }}
            </button>
            <p class="text-sm text-stone-400" aria-live="polite">Service state: <strong class="text-stone-100">{{ reportState() }}</strong></p>
          </div>
          <app-code-output class="mt-4 block" [code]="lazyCode" caption="The first press downloads the service. Later presses reuse the same instance.">
            <p class="text-sm text-stone-200" aria-live="polite">{{ reportText() || 'No report yet.' }}</p>
          </app-code-output>
        </app-lesson-card>

        <app-lesson-card class="mt-5" label="GOOD TO KNOW" heading="What it needs">
          <ul class="mt-3 list-disc space-y-2 pl-5 text-sm text-stone-300">
            <li>The service must provide itself (<code class="text-gold-300">&#64;Service()</code> or <code class="text-gold-300">providedIn: 'root'</code>).</li>
            <li>It returns a function. Call it and <code class="text-gold-300">await</code> the result, and you get the one shared instance.</li>
            <li>You can prefetch on idle time with <code class="text-gold-300">&#123; prefetch: onIdle &#125;</code>, so the click feels instant.</li>
          </ul>
        </app-lesson-card>

        <app-recap class="mt-5" [items]="recapLazy" />
      </section>
      </ng-template>
    </app-lesson-player>
  `,
})
export class DiComponent {
  protected readonly recapBasics = [
    'inject() asks Angular for a ready-made instance instead of building one.',
    'The injector hands out the same instance to everyone who asks.',
    'Think of it as a hotel front desk: you ask, it provides.',
  ];
  protected readonly recapScope = [
    "providedIn: 'root' gives one shared instance for the whole app.",
    'providers on a component gives that component its own copy.',
    'The injector looks for a provider starting at the component and walking up.',
  ];
  protected readonly recapProviders = [
    'A token is the name you ask for; a provider is the recipe for what you get.',
    'useClass, useValue and useFactory change the recipe, not the caller.',
    'This is how tests swap a real service for a fake.',
  ];

  readonly section = input<string>();
  protected readonly serviceCode = `@Service()
export class CartService {
  readonly items = signal<string[]>([]);
  add(item: string) { this.items.update(list => [...list, item]); }
}

// anywhere
private cart = inject(CartService);`;

  protected readonly mistakeDecoratorWrong = `export class CartService {        // no decorator
  items = signal<string[]>([]);
}`;
  protected readonly mistakeDecoratorRight = `@Service()
export class CartService {
  items = signal<string[]>([]);
}`;

  private readonly loadReport = injectAsync(() => import('./heavy-report.service').then((m) => m.HeavyReportService));
  protected readonly reportState = signal<'not loaded' | 'loading' | 'loaded'>('not loaded');
  protected readonly reportBusy = signal(false);
  protected readonly reportText = signal('');
  private reportCount = 0;

  protected async buildReport(): Promise<void> {
    this.reportBusy.set(true);
    if (this.reportState() === 'not loaded') this.reportState.set('loading');
    const service = await this.loadReport();
    this.reportState.set('loaded');
    this.reportText.set(service.build(`Report ${++this.reportCount}`));
    this.reportBusy.set(false);
  }

  protected readonly lazyCode = `private loadReport = injectAsync(() => import('./heavy-report.service')
  .then(m => m.HeavyReportService));

async buildReport() {
  const service = await this.loadReport();   // downloads the first time only
  this.text = service.build('Q3');
}`;

  protected readonly recapService = [
    'A service is a class that holds shared logic or data.',
    "@Service() is the short form in Angular 22; @Injectable({ providedIn: 'root' }) works too.",
    'Without a decorator, Angular cannot inject the class.',
  ];
  protected readonly recapLazy = [
    'injectAsync() loads a service the first time you need it.',
    'Its code goes into a separate file that is downloaded later.',
    'Prefetching on idle time makes the first use feel instant.',
  ];

  readonly rootCode = `@Injectable({ providedIn: 'root' })
export class CartService {
  readonly count = signal(0);
}

// anywhere in the app
private readonly cart = inject(CartService);`;

  readonly tokenCode = `export const API_URL = new InjectionToken<string>('API_URL');

providers: [{ provide: API_URL, useValue: '/api' }]

private readonly url = inject(API_URL);   // '/api'`;

  readonly scopeChallenge: PredictChallenge = {
    question: 'PrivateCounter is listed in the component providers. You put two <app-di-private-counter /> on the page and press +1 once on the first one. What do the two counters show?',
    options: [
      { id: 'both1', text: '1 and 1' },
      { id: 'one0', text: '1 and 0' },
      { id: 'zeroes', text: '0 and 0' },
    ],
    correct: 'one0',
    explanation: 'providers on the component creates one service instance per component copy. The two counters hold different objects, so pressing +1 on one does not touch the other. With providedIn root they would both show 1.',
  };

  readonly injectSteps = [
    'A component calls inject(CartService)',
    'The injector looks for a provider for that token, starting at the component and walking up',
    'It finds providedIn root and creates the instance because none exists yet',
    'It stores the instance and returns it, and every later inject() gets the same one',
  ];

  readonly providersCode = `@Component({
  selector: 'app-counter',
  providers: [PrivateCounter],   // a new instance per component
  template: \`...\`,
})`;

  readonly checkItems: KnowledgeCheckItem[] = [
    {
      question: 'What does providedIn: \'root\' give you?',
      answer: 'A single app-wide instance, created lazily the first time something injects it — and tree-shaken away if nothing ever does.',
    },
    {
      question: 'When would you put a service in a component\'s providers instead?',
      answer: 'When each component (or each copy of it) needs its own private state, such as per-row editing state, and the instance should be destroyed with the component.',
    },
    {
      question: 'Why is inject() better than new Service() for testing?',
      answer: 'In a test you can tell the injector to supply a fake in its place, so the component under test never touches the real service or the network.',
    },
  ];
}
