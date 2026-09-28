import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SignalNetworkComponent } from './signal-network.component';

interface Topic {
  path: string;
  icon: string;
  title: string;
  description: string;
}

@Component({
  standalone: true,
  imports: [RouterLink, SignalNetworkComponent],
  template: `
    <section class="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-20">
      <div
        class="grid items-center gap-8 overflow-hidden rounded-3xl bg-gradient-to-br from-gold-950 via-stone-900 to-stone-950 px-5 py-10 text-white ring-1 ring-gold-500/30 sm:gap-10 sm:px-12 sm:py-12 lg:grid-cols-2"
      >
        <div>
          <p class="mb-3 text-sm font-semibold uppercase tracking-[.2em] text-gold-300">Angular Lab</p>
          <h1 class="text-3xl font-bold tracking-tight sm:text-5xl">Learn Angular by building.</h1>
          <p class="mt-5 max-w-lg text-lg text-stone-300">
            A hands-on playground for Angular's core concepts — data binding, component communication, directives,
            forms, Signals, HTTP, and RxJS. Every topic below is a real, interactive page you can read, click and
            edit, not just a slide.
          </p>
          <div class="mt-8 flex flex-wrap gap-3">
            <a routerLink="/binding" class="rounded-xl bg-gold-500 px-5 py-3 font-semibold text-white transition hover:bg-gold-400">
              Start with Data Binding →
            </a>
            <a routerLink="/products" class="rounded-xl border border-gold-400/40 px-5 py-3 font-semibold text-gold-200 transition hover:bg-gold-500/10">
              See the demo app
            </a>
          </div>
        </div>
        <div class="relative overflow-hidden rounded-2xl border border-gold-500/15 bg-stone-950/60 p-4">
          <app-signal-network class="block h-[280px] w-full sm:h-[340px]" />
        </div>
      </div>

      <div class="mt-16">
        <p class="text-sm font-semibold text-gold-400">TOPICS</p>
        <h2 class="mt-1 text-3xl font-bold">Pick a concept to explore</h2>
        <p class="mt-2 max-w-2xl text-stone-400">Each page explains why the concept exists, what problem it solves, and lets you try it live.</p>

        <div class="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          @for (topic of topics; track topic.path) {
            <a
              [routerLink]="topic.path"
              class="group flex flex-col gap-3 rounded-2xl border border-stone-800 bg-stone-900 p-6 transition hover:border-gold-400/50 hover:bg-stone-800"
            >
              <span class="text-3xl">{{ topic.icon }}</span>
              <span class="flex items-center justify-between text-lg font-bold text-stone-100">
                {{ topic.title }}
                <span class="text-gold-400 transition group-hover:transtone-x-1">→</span>
              </span>
              <p class="text-sm text-stone-400">{{ topic.description }}</p>
            </a>
          }
        </div>
      </div>

      <div class="mt-16 rounded-2xl border border-stone-800 bg-stone-900 p-6 sm:p-8">
        <p class="text-sm font-semibold text-gold-400">BONUS</p>
        <h2 class="mt-1 text-xl font-bold">A small demo app, built with these same concepts</h2>
        <p class="mt-2 max-w-2xl text-sm text-stone-400">
          Browse and My List are a tiny movie-store demo — not a lesson page — showing the topics above working
          together in one real feature.
        </p>
        <div class="mt-5 flex flex-wrap gap-3">
          <a routerLink="/products" class="rounded-xl bg-gold-500 px-4 py-2.5 font-semibold text-white transition hover:bg-gold-400">Browse titles →</a>
          <a routerLink="/favorites" class="rounded-xl border border-stone-700 px-4 py-2.5 font-semibold text-stone-200 transition hover:bg-stone-800">My List</a>
        </div>
      </div>
    </section>
  `,
})
export class HomeComponent {
  readonly topics: Topic[] = [
    {
      path: '/binding',
      icon: '🔗',
      title: 'Data Binding',
      description: 'Interpolation, property binding, event binding and two-way binding, side by side.',
    },
    {
      path: '/communication',
      icon: '↔️',
      title: 'Component Communication',
      description: '@Input() and @Output() — how a parent and child component talk to each other.',
    },
    {
      path: '/directives',
      icon: '⚙️',
      title: 'Directives',
      description: 'Give plain HTML extra behavior with structural and attribute directives.',
    },
    {
      path: '/forms',
      icon: '📝',
      title: 'Angular Forms',
      description: 'Template-driven and reactive forms, with validation, side by side.',
    },
    {
      path: '/signals',
      icon: '📡',
      title: 'Signals',
      description: 'signal(), computed() and effect() — Angular\'s modern reactive state.',
    },
    {
      path: '/movies',
      icon: '🌐',
      title: 'Fetch API & HTTP',
      description: 'HttpClient and services, fetching real data from a public API.',
    },
    {
      path: '/rxjs',
      icon: '🌊',
      title: 'RxJS',
      description: 'Observables, operators like switchMap and debounceTime, and the async pipe.',
    },
  ];
}
