import { Component, signal, WritableSignal } from '@angular/core';

import { FlowArrowComponent } from '../../shared/flow-arrow.component';
import { FlowDiagramComponent } from '../../shared/flow-diagram.component';
import { LessonCardComponent } from '../../shared/lesson-card.component';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { RecapComponent, RecapItem } from '../../shared/recap.component';
import { TitlePreviewComponent } from '../../shared/title-preview.component';
import { TopicNavComponent } from '../../shared/topic-nav.component';

@Component({
  standalone: true,
  imports: [TitlePreviewComponent, FlowArrowComponent, FlowDiagramComponent, RecapComponent, TopicNavComponent, PageHeaderComponent, LessonCardComponent],
  template: `
    <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <app-page-header title="Component Communication" pdf="component-communication.pdf">
        Components are meant to be small and self-contained, so they need a clean way to talk to each other.
        <code class="text-gold-300">&#64;Input()</code> lets a parent pass data down; <code class="text-gold-300">&#64;Output()</code>
        lets a child send an event back up. Below: the parent gives the child a movie title, and the child sends an event back when you
        click its button.
      </app-page-header>

      <div class="mt-8 flex flex-col gap-3 rounded-2xl border border-stone-800 bg-stone-900 p-5 sm:flex-row sm:items-center sm:justify-center sm:gap-8">
        <app-flow-diagram from="Parent" to="@Input() title" direction="right" />
        <app-flow-diagram from="@Output() addToWatchlist" to="Parent" direction="right" />
      </div>

      <div class="mt-6 grid gap-3 md:grid-cols-[1fr_auto_1fr] md:gap-x-5">
        <app-lesson-card label="PARENT COMPONENT" tone="emerald">
          <label class="mt-4 block text-sm font-medium">Movie or series title</label>
          <input [(value)]="selectedTitle" (input)="onTitleInput($any($event.target).value)" class="mt-2 w-full rounded-xl border border-stone-600 bg-stone-800 px-3 py-2.5 focus:border-gold-400 focus:outline-none" />
          <p class="mt-5 text-sm text-stone-400">The parent sends this value with:</p>
          <code class="mt-2 block rounded-lg bg-stone-950 p-3 text-sm text-gold-300">[title]="selectedTitle"</code>
        </app-lesson-card>

        <app-flow-arrow
          class="justify-self-center md:self-center"
          direction="down"
          turn
          label="@Input() title"
          caption="parent → child"
          [active]="titleFlowing()"
        />

        <div class="flex min-w-0 flex-col gap-3">
          <app-title-preview [title]="selectedTitle" (addToWatchlist)="receiveTitle($event)" />
          <app-flow-arrow
            class="justify-center"
            tone="burgundy"
            label="@Output() addToWatchlist"
            caption="child → parent"
            [active]="messageFlowing()"
          />
        </div>
      </div>

      <div class="mt-3 rounded-2xl border border-[rgb(var(--panel-danger-heading))]/30 bg-[rgb(var(--panel-danger-bg))] p-5">
        <p class="font-semibold text-[rgb(var(--panel-danger-heading))]">Message received by parent</p>
        <p class="mt-2 text-stone-300">{{ receivedMessage || 'Click “Add to watchlist” in the child component.' }}</p>
        <code class="mt-3 block text-sm text-[rgb(var(--panel-danger-heading))]">(addToWatchlist)="receiveTitle($event)"</code>
      </div>

      <div class="mt-6 rounded-2xl border border-gold-400/20 bg-gold-950/30 p-6">
        <h2 class="font-bold text-gold-200">Why not just share a service?</h2>
        <p class="mt-2 text-sm text-stone-300">
          You could — services are great for state shared across many unrelated components. But when data only
          needs to move between a direct parent and its child, <code class="text-gold-300">&#64;Input()</code>/<code class="text-gold-300">&#64;Output()</code>
          keeps the relationship explicit right there in the template, so anyone reading <code class="text-gold-300">&lt;app-title-preview [rawan] (addToWatchlist)&gt;</code>
          can see exactly what flows in and out — no hunting through a service to find who else is listening.
        </p>
      </div>

      <app-recap [items]="recapItems" />
      <app-topic-nav />
    </section>
  `,
})
export class ComponentCommunicationComponent {
  selectedTitle = '';
  receivedMessage = '';

  /** True for a moment after data moves, so the matching arrow lights up. */
  protected readonly titleFlowing = signal(false);
  protected readonly messageFlowing = signal(false);
  private readonly flashTimers = new Map<WritableSignal<boolean>, ReturnType<typeof setTimeout>>();

  onTitleInput(title: string): void {
    this.selectedTitle = title;
    this.flash(this.titleFlowing);
  }

  receiveTitle(title: string): void {
    this.receivedMessage = `The parent received: ${title}`;
    this.flash(this.messageFlowing);
  }

  private flash(flag: WritableSignal<boolean>): void {
    clearTimeout(this.flashTimers.get(flag));
    flag.set(true);
    this.flashTimers.set(flag, setTimeout(() => flag.set(false), 1400));
  }

  readonly recapItems: RecapItem[] = [
    {
      question: 'How does a Parent send data to a Child?',
      answer: "Using @Input() on the Child and property binding [prop]=\"value\" from the Parent's template.",
    },
    {
      question: 'How does a Child notify its Parent?',
      answer: 'Using @Output() with an EventEmitter, and the Parent listens with (eventName).',
    },
    {
      question: "Why shouldn't a Child mutate an @Input() value directly?",
      answer: "Data is meant to flow one direction (Parent → Child); the Parent owns that value, so changing it inside the Child breaks the single source of truth.",
    },
  ];
}
