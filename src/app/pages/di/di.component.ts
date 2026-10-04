import { Component, Injectable, inject, signal } from '@angular/core';

import { CodeBlockDirective } from '../../shared/code-block.directive';
import { FlowDiagramComponent } from '../../shared/flow-diagram.component';
import { LessonCardComponent } from '../../shared/lesson-card.component';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { RecapComponent, RecapItem } from '../../shared/recap.component';
import { TopicNavComponent } from '../../shared/topic-nav.component';

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
  standalone: true,
  imports: [DiSharedCounterComponent, DiPrivateCounterComponent, FlowDiagramComponent, CodeBlockDirective, RecapComponent, TopicNavComponent, PageHeaderComponent, LessonCardComponent],
  template: `
    <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <app-page-header title="Dependency Injection" illustration="di" pdf="di.pdf">
        Components should not build the things they depend on — a component that does
        <code class="text-gold-300">new CartService()</code> can never share that cart with another component, and is painful to
        test. Instead it <em>asks</em> Angular for one with <code class="text-gold-300">inject()</code>, and Angular's injector
        decides whether to hand over a shared instance or create a fresh one. Click the counters below to see the difference.
      </app-page-header>

      <div class="mt-10 grid gap-5 md:grid-cols-2">
        <app-lesson-card label="1 · INJECT()" heading="Ask for it, don't build it">
          <p class="mt-2 text-sm text-stone-400">
            A class marked <code class="text-gold-300">&#64;Injectable</code> can be requested anywhere with
            <code class="text-gold-300">inject(Service)</code>. <code class="text-gold-300">providedIn: 'root'</code> tells Angular to create
            exactly one instance for the whole app.
          </p>
          <app-flow-diagram class="mt-4 block" from="inject(CartService)" to="the injector hands over the instance" direction="right" />
          <pre class="mt-4 overflow-x-auto rounded-xl bg-stone-950 p-4 text-xs text-gold-200">{{ rootCode }}</pre>
        </app-lesson-card>

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

      <app-recap [items]="recapItems" />
      <app-topic-nav />
    </section>
  `,
})
export class DiComponent {
  readonly rootCode = `@Injectable({ providedIn: 'root' })
export class CartService {
  readonly count = signal(0);
}

// anywhere in the app
private readonly cart = inject(CartService);`;

  readonly providersCode = `@Component({
  selector: 'app-counter',
  providers: [PrivateCounter],   // a new instance per component
  template: \`...\`,
})`;

  readonly recapItems: RecapItem[] = [
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
