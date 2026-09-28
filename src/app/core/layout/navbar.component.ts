import { Component, HostListener, OnDestroy, effect, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription, filter } from 'rxjs';

import { CartService } from '../services/cart.service';
import { FavoritesService } from '../services/favorites.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="sticky top-0 z-40 border-b border-stone-800 bg-stone-950/95 pt-[env(safe-area-inset-top)] backdrop-blur">
      <nav class="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:h-[72px] sm:px-6">
        <a routerLink="/" class="shrink-0 text-lg font-bold tracking-tight text-gold-400 sm:text-xl">
          Angular <span class="text-stone-100">Lab</span>
        </a>

        <div class="hidden items-center gap-1 text-sm font-medium text-stone-300 lg:flex">
          @for (link of navLinks; track link.path) {
            <a
              [routerLink]="link.path"
              routerLinkActive="text-gold-400"
              [routerLinkActiveOptions]="{ exact: link.exact === true }"
              class="rounded-lg px-2 py-2 hover:text-gold-400"
            >
              {{ link.label }}
              @if (link.count === 'favorites') {
                {{ favorites.ids().length }}
              }
            </a>
          }
          <span class="rounded-full bg-gold-500/15 px-3 py-2 text-gold-300">Watchlist {{ cart.count() }}</span>
        </div>

        <div class="flex items-center gap-2 lg:hidden">
          <span class="rounded-full bg-gold-500/15 px-3 py-2 text-sm font-medium text-gold-300" aria-label="Watchlist {{ cart.count() }}">
            {{ cart.count() }}
          </span>
          <button
            type="button"
            class="grid h-11 w-11 place-items-center rounded-xl text-stone-100 transition hover:bg-stone-800"
            [attr.aria-expanded]="menuOpen()"
            aria-controls="mobile-nav"
            [attr.aria-label]="menuOpen() ? 'Close menu' : 'Open menu'"
            (click)="toggleMenu()"
          >
            @if (menuOpen()) {
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-6 w-6" aria-hidden="true">
                <path stroke-linecap="round" d="M6 6l12 12M18 6L6 18" />
              </svg>
            } @else {
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-6 w-6" aria-hidden="true">
                <path stroke-linecap="round" d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            }
          </button>
        </div>
      </nav>

      @if (menuOpen()) {
        <button
          type="button"
          class="fixed inset-0 top-[calc(4rem+env(safe-area-inset-top))] z-30 bg-stone-950/70 sm:top-[calc(4.5rem+env(safe-area-inset-top))]"
          aria-label="Close menu"
          (click)="closeMenu()"
        ></button>
        <div
          id="mobile-nav"
          class="absolute inset-x-0 top-full z-40 border-b border-stone-800 bg-stone-950 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2 shadow-xl shadow-black/40 lg:hidden"
        >
          <div class="mx-auto flex max-w-6xl flex-col gap-1 pb-3 text-base font-medium text-stone-200">
            @for (link of navLinks; track link.path) {
              <a
                [routerLink]="link.path"
                routerLinkActive="bg-gold-500/15 text-gold-300"
                [routerLinkActiveOptions]="{ exact: link.exact === true }"
                class="flex min-h-11 items-center rounded-xl px-3 py-2 hover:bg-stone-800"
                (click)="closeMenu()"
              >
                {{ link.label }}
                @if (link.count === 'favorites') {
                  <span class="ml-2 rounded-full bg-gold-500/15 px-2 py-0.5 text-sm text-gold-300">
                    {{ favorites.ids().length }}
                  </span>
                }
              </a>
            }
            <p class="mt-3 border-t border-stone-800 px-3 pt-3 text-sm text-stone-400">Watchlist · {{ cart.count() }} titles</p>
          </div>
        </div>
      }
    </header>
  `,
})
export class NavbarComponent implements OnDestroy {
  readonly cart = inject(CartService);
  readonly favorites = inject(FavoritesService);
  readonly menuOpen = signal(false);

  readonly navLinks = [
    { path: '/', label: 'Home', exact: true },
    { path: '/movies', label: 'Fetch API & HTTP' },
    { path: '/binding', label: 'Data Binding' },
    { path: '/communication', label: 'Component Communication' },
    { path: '/directives', label: 'Directives' },
    { path: '/forms', label: 'Angular Forms' },
    { path: '/signals', label: 'Signals' },
    { path: '/rxjs', label: 'RxJS' },
    { path: '/products', label: 'Demo: Browse' },
    { path: '/favorites', label: 'Demo: My List', count: 'favorites' as const },
  ];

  private readonly router = inject(Router);
  private readonly navSub: Subscription;

  constructor() {
    this.navSub = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => this.closeMenu());

    effect(() => {
      document.body.style.overflow = this.menuOpen() ? 'hidden' : '';
    });
  }

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeMenu();
  }

  @HostListener('window:resize')
  onResize(): void {
    if (window.innerWidth >= 1024) {
      this.closeMenu();
    }
  }

  ngOnDestroy(): void {
    this.navSub.unsubscribe();
    document.body.style.overflow = '';
  }
}
