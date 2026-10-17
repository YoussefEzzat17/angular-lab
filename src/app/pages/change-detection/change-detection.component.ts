import { ChangeDetectionStrategy, Component, Injectable, inject, input, signal } from '@angular/core';

import { CodeBlockDirective } from '../../shared/code-block.directive';
import { FlowDiagramComponent } from '../../shared/flow-diagram.component';
import { LessonCardComponent } from '../../shared/lesson-card.component';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { RecapComponent, RecapItem } from '../../shared/recap.component';
import { TopicNavComponent } from '../../shared/topic-nav.component';

export interface DemoUser {
  name: string;
}

@Component({
  selector: 'app-cd-default-card',
  standalone: true,
  template: `
    <div class="rounded-xl bg-stone-800 p-4">
      <p class="text-xs text-stone-400">Default strategy</p>
      <p class="mt-1 text-lg font-semibold">{{ user().name }}</p>
    </div>
  `,
})
export class CdDefaultCardComponent {
  readonly user = input.required<DemoUser>();
}

@Component({
  selector: 'app-cd-onpush-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="rounded-xl bg-stone-800 p-4">
      <p class="text-xs text-stone-400">OnPush strategy</p>
      <p class="mt-1 text-lg font-semibold">{{ user().name }}</p>
    </div>
  `,
})
export class CdOnPushCardComponent {
  readonly user = input.required<DemoUser>();
}

@Injectable({ providedIn: 'root' })
export class TickService {
  readonly count = signal(0);
  increment(): void {
    this.count.update((value) => value + 1);
  }
}

@Component({
  selector: 'app-cd-signal-reader',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="rounded-xl bg-stone-800 p-4">
      <p class="text-xs text-stone-400">OnPush component reading a signal</p>
      <p class="mt-1 text-2xl font-bold">{{ ticks.count() }}</p>
    </div>
  `,
})
export class CdSignalReaderComponent {
  readonly ticks = inject(TickService);
}

const NAMES = ['Ada', 'Grace', 'Linus', 'Margaret', 'Alan'];

@Component({
  standalone: true,
  imports: [CdDefaultCardComponent, CdOnPushCardComponent, CdSignalReaderComponent, FlowDiagramComponent, CodeBlockDirective, RecapComponent, TopicNavComponent, PageHeaderComponent, LessonCardComponent],
  template: `
    <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <app-page-header title="Change Detection" illustration="change-detection">
        After something happens (a click, a response, a timer), Angular walks the component tree and re-checks what each
        template shows. By default it checks <em>every</em> component, every time. With
        <code class="text-gold-300">OnPush</code> a component is only re-checked when something it depends on actually changed —
        so a big app does far less work.
      </app-page-header>

      <div class="mt-10 grid gap-5 md:grid-cols-2">
        <app-lesson-card label="1 · TWO STRATEGIES" heading="Check everything vs. check what changed">
          <p class="mt-2 text-sm text-stone-400">
            <strong class="text-stone-200">Default:</strong> re-check this component whenever anything in the app might have changed.<br />
            <strong class="text-stone-200">OnPush:</strong> re-check only when an <code class="text-gold-300">input()</code> gets a
            <em>new reference</em>, an event fires inside the component, or a signal it reads changes.
          </p>
          <app-flow-diagram class="mt-4 block" from="something happens" to="Angular re-checks the tree" direction="right" />
          <pre class="mt-4 overflow-x-auto rounded-xl bg-stone-950 p-4 text-xs text-gold-200">{{ onPushCode }}</pre>
        </app-lesson-card>

        <app-lesson-card variant="highlight" label="2 · TRY IT" heading="Mutate vs. replace">
          <p class="mt-2 text-sm text-stone-400">
            Both cards receive the same <code class="text-gold-300">user</code> object. Mutating it keeps the same reference,
            so the OnPush card does not notice. Replacing it with a new object does.
          </p>
          <div class="mt-4 grid gap-3 sm:grid-cols-2">
            <app-cd-default-card [user]="user" />
            <app-cd-onpush-card [user]="user" />
          </div>
          <div class="mt-4 flex flex-wrap gap-3">
            <button type="button" (click)="mutate()" class="min-h-11 rounded-xl border border-stone-600 px-4 text-sm font-semibold hover:bg-stone-800">Mutate name</button>
            <button type="button" (click)="replace()" class="min-h-11 rounded-xl bg-gold-500 px-4 text-sm font-semibold text-white hover:bg-gold-400">Replace user</button>
          </div>
          <p class="mt-3 text-xs text-stone-500">
            The parent now holds <strong class="text-stone-300">{{ user.name }}</strong>. If the OnPush card still shows an older name, that is the point.
          </p>
        </app-lesson-card>

        <app-lesson-card class="md:col-span-2" label="3 · SIGNALS FIT OnPush" heading="Reading a signal marks the component for you">
          <p class="mt-2 text-sm text-stone-400">
            This OnPush component has no inputs at all, yet it updates when you click below, because its template reads a
            signal. Angular tracks the read and re-checks exactly that component — which is why signals and OnPush are the
            recommended pair.
          </p>
          <div class="mt-4 grid items-center gap-3 sm:grid-cols-[1fr_auto]">
            <app-cd-signal-reader />
            <button type="button" (click)="ticks.increment()" class="min-h-11 rounded-xl bg-gold-500 px-4 text-sm font-semibold text-white hover:bg-gold-400">Increment the signal</button>
          </div>
        </app-lesson-card>
      </div>

      <app-recap [items]="recapItems" />
      <app-topic-nav />
    </section>
  `,
})
export class ChangeDetectionComponent {
  readonly ticks = inject(TickService);

  user: DemoUser = { name: NAMES[0] };
  private nameIndex = 0;

  mutate(): void {
    this.user.name = this.nextName();
  }

  replace(): void {
    this.user = { name: this.nextName() };
  }

  private nextName(): string {
    this.nameIndex = (this.nameIndex + 1) % NAMES.length;
    return NAMES[this.nameIndex];
  }

  readonly onPushCode = `@Component({
  selector: 'app-user-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`{{ user().name }}\`,
})
export class UserCardComponent {
  readonly user = input.required<User>();
}`;

  readonly recapItems: RecapItem[] = [
    {
      question: 'When is an OnPush component re-checked?',
      answer: 'When one of its inputs receives a new reference, when an event handler fires inside it, when an async pipe emits, or when a signal read in its template changes.',
    },
    {
      question: 'Why does mutating an object passed to an OnPush child not update it?',
      answer: 'OnPush compares the input by reference. user.name = "x" keeps the same object, so Angular sees no change; passing a new object ({ ...user, name: "x" }) does.',
    },
    {
      question: 'Why do signals and OnPush work so well together?',
      answer: 'Reading a signal in a template tells Angular exactly which component depends on it, so only that component is re-checked when the signal changes — no need to pass new references around.',
    },
  ];
}
