import { Component } from '@angular/core';

import { TitlePreviewComponent } from '../../shared/title-preview.component';

@Component({
  standalone: true,
  imports: [TitlePreviewComponent],
  template: `
    <section class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <p class="text-sm font-semibold text-gold-400">HANDS-ON WORKSHOP</p>
      <h1 class="mt-1 text-3xl font-bold sm:text-4xl">Component Communication</h1>
      <p class="mt-3 max-w-3xl text-stone-400">Components are meant to be small and self-contained, so they need a clean way to talk to each other. <code class="text-gold-300">&#64;Input()</code> lets a parent pass data down; <code class="text-gold-300">&#64;Output()</code> lets a child send an event back up. Below: the parent gives the child a movie title, and the child sends an event back when you click its button.</p>

      <div class="mt-8 grid gap-5 md:grid-cols-2">
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
