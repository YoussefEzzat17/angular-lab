import { Component, computed, inject, signal } from '@angular/core';

import { Movie } from '../../core/models/movie.model';
import { MovieService } from '../../core/services/movie.service';
import { FlowDiagramComponent } from '../../shared/flow-diagram.component';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { RecapComponent, RecapItem } from '../../shared/recap.component';
import { TopicNavComponent } from '../../shared/topic-nav.component';

@Component({
  standalone: true,
  imports: [FlowDiagramComponent, RecapComponent, TopicNavComponent, PageHeaderComponent],
  template: `
    <section class="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <app-page-header title="Fetch API &amp; HTTP Client" pdf="services-http.pdf">
        Real apps get their data from a server, not a hardcoded array. Angular's <code class="text-gold-300">HttpClient</code> — injected
        into a service, not the component — makes that request and returns an Observable. These films come from a real public API. Type
        below to see property binding, event binding, a signal, and a computed value all working together on live data.
      </app-page-header>

      <label class="mt-8 block max-w-xl" for="movie-search">
        <span class="text-sm font-semibold text-stone-200">Filter loaded movies</span>
        <input
          id="movie-search"
          [value]="searchTerm()"
          (input)="updateSearch($event)"
          class="mt-2 w-full rounded-xl border border-stone-700 bg-stone-900 px-4 py-3 text-stone-100 outline-none placeholder:text-stone-500 focus:border-gold-400"
          placeholder="Try 'castle' or 'wind'"
        />
      </label>

      @if (isLoading()) {
        <div class="mt-8 rounded-2xl border border-gold-400/20 bg-gold-950/30 p-6 text-gold-100">
          Loading films from the API…
        </div>
      } @else if (error()) {
        <div class="mt-8 rounded-2xl border border-[rgb(var(--panel-danger-heading))]/30 bg-[rgb(var(--panel-danger-bg))] p-6">
          <p class="font-bold text-[rgb(var(--panel-danger-heading))]">The movie request did not complete.</p>
          <p class="mt-1 text-sm text-stone-300">{{ error() }}</p>
          <button (click)="loadMovies()" class="mt-4 rounded-xl bg-gold-500 px-4 py-2 font-semibold text-white hover:bg-gold-400">
            Try again
          </button>
        </div>
      } @else if (movies().length === 0) {
        <div class="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6 text-stone-300">
          No movies have been loaded yet.
        </div>
      } @else if (filteredMovies().length === 0) {
        <div class="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6 text-stone-300">
          No loaded movies match “{{ searchTerm() }}”.
        </div>
      } @else {
        <p class="mt-8 text-sm text-stone-400">Showing {{ filteredMovies().length }} of {{ movies().length }} films</p>
        <div class="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          @for (movie of filteredMovies(); track movie.id) {
            <article class="overflow-hidden rounded-2xl bg-stone-900 ring-1 ring-stone-800">
              <img [src]="movie.image" [alt]="movie.title + ' poster'" class="h-80 w-full object-cover" />
              <div class="p-5">
                <div class="flex items-start justify-between gap-3">
                  <h2 class="text-xl font-bold">{{ movie.title }}</h2>
                  <span class="shrink-0 rounded-full bg-amber-400/15 px-2.5 py-1 text-xs font-bold text-amber-300">★ {{ movie.rt_score }}</span>
                </div>
                <p class="mt-1 text-sm text-gold-300">{{ movie.release_date }} · {{ movie.director }}</p>
                <p class="mt-4 text-sm leading-6 text-stone-400">{{ movie.description }}</p>
              </div>
            </article>
          }
        </div>
      }

      <aside class="mt-10 rounded-2xl border border-gold-400/20 bg-gold-950/30 p-6 text-sm text-stone-300">
        <h2 class="font-bold text-gold-200">Follow the data flow</h2>
        <p class="mt-2">This component never calls the API directly — a service does, and hands back an Observable of values.</p>
        <div class="mt-4 flex flex-wrap items-center gap-x-3 gap-y-3">
          <app-flow-diagram from="MovieService" to="HttpClient.get()" direction="right" />
          <app-flow-diagram from="public API" to="Observable" direction="right" />
          <app-flow-diagram from=".subscribe()" to="signal.set()" direction="right" />
        </div>
        <p class="mt-4 text-xs text-stone-400">
          <code class="text-gold-300">signal.set()</code> triggers <code class="text-gold-300">computed()</code> to recalculate
          <code class="text-gold-300">filteredMovies()</code>, and Angular re-renders only the cards that actually changed.
        </p>
      </aside>

      <app-recap [items]="recapItems" />
      <app-topic-nav />
    </section>
  `,
})
export class MoviesComponent {
  private readonly movieService = inject(MovieService);

  // Signals hold state that the template reads with parentheses, for example movies().
  readonly movies = signal<Movie[]>([]);
  readonly isLoading = signal(false);
  readonly error = signal('');
  readonly searchTerm = signal('');

  // This is derived state: Angular recalculates it when movies() or searchTerm() changes.
  readonly filteredMovies = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    return this.movies().filter((movie) =>
      !term || movie.title.toLowerCase().includes(term) || movie.director.toLowerCase().includes(term),
    );
  });

  constructor() {
    this.loadMovies();
  }

  loadMovies(): void {
    this.isLoading.set(true);
    this.error.set('');

    // HttpClient returns an Observable. subscribe() starts the request and handles its events.
    this.movieService.getMovies().subscribe({
      next: (movies) => this.movies.set(movies),
      error: () => {
        this.error.set('We could not reach the public movie API. Check your connection and try again.');
      },
      complete: () => this.isLoading.set(false),
    });
  }

  updateSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  readonly recapItems: RecapItem[] = [
    {
      question: "Why does a Service's method usually return the Observable from http.get() instead of subscribing itself?",
      answer: 'So the caller controls when the request actually runs and can unsubscribe/cancel it — the Service just hands back the "recipe".',
    },
    {
      question: "What does providedIn: 'root' give you?",
      answer: 'A singleton — the Service is created once and that same instance is shared by every component that injects it.',
    },
    {
      question: 'Why use an interceptor instead of adding the auth header manually inside every Service method?',
      answer: 'One place handles it for every request automatically, instead of repeating (and risking forgetting) the same code everywhere.',
    },
  ];
}
