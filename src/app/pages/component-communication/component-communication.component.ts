import { Component } from '@angular/core';

import { FlowDiagramComponent } from '../../shared/flow-diagram.component';
import { TitlePreviewComponent } from '../../shared/title-preview.component';

@Component({
  standalone: true,
  imports: [TitlePreviewComponent, FlowDiagramComponent],
  template: `
    <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <p class="text-sm font-semibold text-gold-400">HANDS-ON WORKSHOP</p>
      <h1 class="mt-1 text-3xl font-bold sm:text-4xl">Component Communication</h1>
      <p class="mt-3 max-w-3xl text-stone-400">
        Components are meant to be small and self-contained, so they need a clean way to talk to each other.
        <code class="text-gold-300">&#64;Input()</code> lets a parent pass data down; <code class="text-gold-300">&#64;Output()</code>
        lets a child send an event back up. Below: the parent gives the child a movie title, and the child sends an event back when you
        click its button.
      </p>

      <div class="mt-8 flex flex-col gap-3 rounded-2xl border border-stone-800 bg-stone-900 p-5 sm:flex-row sm:items-center sm:justify-center sm:gap-8">
        <app-flow-diagram from="Parent" to="@Input() rawan" direction="right" />
        <app-flow-diagram from="@Output() addToWatchlist" to="Parent" direction="right" />
      </div>

      <div class="mt-6 grid gap-5 md:grid-cols-2">
        <article class="rounded-2xl border border-stone-800 bg-stone-900 p-6">
          <p class="text-xs font-bold tracking-wider text-emerald-300">PARENT COMPONENT</p>
          <label class="mt-4 block text-sm font-medium">Movie or series title</label>
          <input [(value)]="selectedTitle" (input)="selectedTitle = $any($event.target).value" class="mt-2 w-full rounded-xl border border-stone-600 bg-stone-800 px-3 py-2.5 focus:border-gold-400 focus:outline-none" />
          <p class="mt-5 text-sm text-stone-400">The parent sends this value with:</p>
          <code class="mt-2 block rounded-lg bg-stone-950 p-3 text-sm text-gold-300">[rawan]="selectedTitle"</code>
        </article>

        <app-title-preview [rawan]="selectedTitle" (addToWatchlist)="receiveTitle($event)" />
      </div>

      <div class="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-950/20 p-5">
        <p class="font-semibold text-emerald-200">Message received by parent</p>
        <p class="mt-2 text-stone-300">{{ receivedMessage || 'Click “Add to watchlist” in the child component.' }}</p>
        <code class="mt-3 block text-sm text-emerald-300">(addToWatchlist)="receiveTitle($event)"</code>
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
    </section>
  `,
})
export class ComponentCommunicationComponent {
  selectedTitle = '';
  receivedMessage = '';

  receiveTitle(title: string): void {
    this.receivedMessage = `The parent received: ${title}`;
  }
}
