import { Component, effect, HostListener, inject, OnDestroy, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, Subscription } from 'rxjs';

import { TOPICS } from '../data/topics';
import { CartService } from '../services/cart.service';
import { FavoritesService } from '../services/favorites.service';
import { ProgressService } from '../services/progress.service';
import { SearchPaletteService } from '../services/search-palette.service';
import { IconComponent } from '../../shared/icon.component';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-navbar',
  imports: [IconComponent, RouterLink, RouterLinkActive],
  template: `
    <header class="sticky top-0 z-40 border-b border-stone-800 bg-stone-950/95 pt-[env(safe-area-inset-top)] backdrop-blur">
      <nav class="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:h-[72px] sm:px-6">
        <a routerLink="/" class="shrink-0 text-lg font-bold tracking-tight text-gold-400 sm:text-xl" (click)="closeAll()">
          Angular <span class="text-stone-100">Lab</span>
        </a>

        <div class="hidden items-center gap-1 text-sm font-medium text-stone-300 lg:flex">
          <a
            routerLink="/"
            routerLinkActive="text-gold-400"
            [routerLinkActiveOptions]="{ exact: true }"
            class="rounded-lg px-3 py-2 transition hover:text-gold-400"
          >
            Home
          </a>

          <div class="relative">
            <button
              type="button"
              class="flex items-center gap-1 rounded-lg px-3 py-2 transition hover:text-gold-400"
              [class.text-gold-400]="topicsOpen() || isTopicActive()"
              (click)="toggleTopics($event)"
            >
              Topics
              <app-icon name="chevron-down" class="h-4 w-4 transition" [class.rotate-180]="topicsOpen()" />
            </button>

            @if (topicsOpen()) {
              <div
                class="absolute left-1/2 top-full mt-2 w-[800px] max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-2xl border border-stone-800 bg-stone-900 p-3 shadow-2xl shadow-black/50"
                (click)="$event.stopPropagation()"
              >
                <div class="grid grid-cols-3 gap-1">
                  @for (topic of topics; track topic.path) {
                    <a
                      [routerLink]="topic.path"
                      routerLinkActive="bg-gold-500/10 text-gold-300"
                      class="flex items-start gap-3 rounded-xl px-3 py-2.5 transition hover:bg-stone-800"
                      (click)="closeAll()"
                    >
                      <span class="mt-0.5 text-lg">{{ topic.icon }}</span>
                      <span class="min-w-0">
                        <span class="flex items-center gap-1.5">
                          <span class="block truncate font-semibold text-stone-100">{{ topic.title }}</span>
                          @if (progress.isCompleted(topic.path)) {
                            <span class="shrink-0 text-xs text-emerald-400">✓</span>
                          }
                        </span>
                        <span class="block truncate text-xs text-stone-500">{{ topic.description }}</span>
                      </span>
                    </a>
                  }
                </div>
              </div>
            }
          </div>

          <div class="relative">
            <button
              type="button"
              class="flex items-center gap-1 rounded-lg px-3 py-2 transition hover:text-gold-400"
              [class.text-gold-400]="demoOpen() || isDemoActive()"
              (click)="toggleDemo($event)"
            >
              Demo App
              <app-icon name="chevron-down" class="h-4 w-4 transition" [class.rotate-180]="demoOpen()" />
            </button>

            @if (demoOpen()) {
              <div
                class="absolute left-1/2 top-full mt-2 w-64 -translate-x-1/2 rounded-2xl border border-stone-800 bg-stone-900 p-2 shadow-2xl shadow-black/50"
                (click)="$event.stopPropagation()"
              >
                <a routerLink="/products" routerLinkActive="bg-gold-500/10 text-gold-300" class="flex items-center justify-between rounded-xl px-3 py-2.5 transition hover:bg-stone-800" (click)="closeAll()">
                  <span>Browse titles</span>
                </a>
                <a routerLink="/favorites" routerLinkActive="bg-gold-500/10 text-gold-300" class="flex items-center justify-between rounded-xl px-3 py-2.5 transition hover:bg-stone-800" (click)="closeAll()">
                  <span>My List</span>
                  <span class="rounded-full bg-stone-800 px-2 py-0.5 text-xs text-stone-400">{{ favorites.ids().length }}</span>
                </a>
              </div>
            }
          </div>

          <a
            routerLink="/feedback"
            routerLinkActive="text-gold-400"
            class="rounded-lg px-3 py-2 transition hover:text-gold-400"
          >
            Feedback
          </a>

          <button
            type="button"
            (click)="searchPalette.toggle()"
            class="ml-2 flex items-center gap-2 rounded-lg border border-stone-800 px-3 py-2 text-stone-400 transition hover:border-stone-700 hover:text-gold-300"
          >
            <app-icon name="search" class="h-4 w-4" />
            <kbd class="rounded border border-stone-700 px-1.5 py-0.5 text-[10px] text-stone-500">⌘K</kbd>
          </button>
          <button
            type="button"
            (click)="theme.toggle()"
            class="flex h-[38px] w-[38px] items-center justify-center rounded-lg border border-stone-800 text-stone-400 transition hover:border-stone-700 hover:text-gold-300"
            [attr.aria-label]="theme.theme() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
          >
            <app-icon [name]="theme.theme() === 'dark' ? 'moon' : 'sun'" class="h-4 w-4" />
          </button>
          <a routerLink="/watchlist" class="rounded-full bg-gold-500/15 px-3 py-2 text-gold-300 transition hover:bg-gold-500/25">Watchlist {{ cart.count() }}</a>
        </div>

        <div class="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            (click)="searchPalette.toggle()"
            class="grid h-11 w-11 place-items-center rounded-xl text-stone-300 transition hover:bg-stone-800"
            aria-label="Search topics"
          >
            <app-icon name="search" class="h-5 w-5" />
          </button>
          <button
            type="button"
            (click)="theme.toggle()"
            class="grid h-11 w-11 place-items-center rounded-xl text-stone-300 transition hover:bg-stone-800"
            [attr.aria-label]="theme.theme() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
          >
            <app-icon [name]="theme.theme() === 'dark' ? 'moon' : 'sun'" class="h-5 w-5" />
          </button>
          <a routerLink="/watchlist" class="rounded-full bg-gold-500/15 px-3 py-2 text-sm font-medium text-gold-300" aria-label="Watchlist, {{ cart.count() }} titles">
            {{ cart.count() }}
          </a>
          <button
            type="button"
            class="grid h-11 w-11 place-items-center rounded-xl text-stone-100 transition hover:bg-stone-800"
            [attr.aria-expanded]="menuOpen()"
            aria-controls="mobile-nav"
            [attr.aria-label]="menuOpen() ? 'Close menu' : 'Open menu'"
            (click)="toggleMenu()"
          >
            <app-icon [name]="menuOpen() ? 'close' : 'menu'" class="h-6 w-6" />
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
          class="absolute inset-x-0 top-full z-40 max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-stone-800 bg-stone-950 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2 shadow-xl shadow-black/40 lg:hidden"
        >
          <div class="mx-auto flex max-w-6xl flex-col gap-1 pb-3 text-base font-medium text-stone-200">
            <a
              routerLink="/"
              routerLinkActive="bg-gold-500/15 text-gold-300"
              [routerLinkActiveOptions]="{ exact: true }"
              class="flex min-h-11 items-center rounded-xl px-3 py-2 hover:bg-stone-800"
              (click)="closeMenu()"
            >
              Home
            </a>

            <p class="mt-3 px-3 text-xs font-bold uppercase tracking-wider text-gold-400">Topics</p>
            @for (topic of topics; track topic.path) {
              <a
                [routerLink]="topic.path"
                routerLinkActive="bg-gold-500/15 text-gold-300"
                class="flex min-h-11 items-center justify-between gap-2 rounded-xl px-3 py-2 hover:bg-stone-800"
                (click)="closeMenu()"
              >
                <span class="flex items-center gap-2">
                  <span>{{ topic.icon }}</span>
                  {{ topic.title }}
                </span>
                @if (progress.isCompleted(topic.path)) {
                  <span class="text-xs text-emerald-400">✓</span>
                }
              </a>
            }

            <p class="mt-3 px-3 text-xs font-bold uppercase tracking-wider text-gold-400">Demo App</p>
            <a routerLink="/products" routerLinkActive="bg-gold-500/15 text-gold-300" class="flex min-h-11 items-center rounded-xl px-3 py-2 hover:bg-stone-800" (click)="closeMenu()">
              Browse titles
            </a>
            <a routerLink="/favorites" routerLinkActive="bg-gold-500/15 text-gold-300" class="flex min-h-11 items-center justify-between rounded-xl px-3 py-2 hover:bg-stone-800" (click)="closeMenu()">
              My List
              <span class="rounded-full bg-stone-800 px-2 py-0.5 text-sm text-stone-400">{{ favorites.ids().length }}</span>
            </a>

            <a
              routerLink="/feedback"
              routerLinkActive="bg-gold-500/15 text-gold-300"
              class="mt-3 flex min-h-11 items-center rounded-xl border-t border-stone-800 px-3 py-2 pt-5 hover:bg-stone-800"
              (click)="closeMenu()"
            >
              Feedback
            </a>

            <a routerLink="/watchlist" (click)="closeMenu()" class="mt-3 flex min-h-11 items-center border-t border-stone-800 px-3 pt-3 text-sm text-stone-400 hover:text-gold-300">Watchlist · {{ cart.count() }} titles</a>
          </div>
        </div>
      }
    </header>
  `,
})
export class NavbarComponent implements OnDestroy {
  readonly cart = inject(CartService);
  readonly favorites = inject(FavoritesService);
  readonly progress = inject(ProgressService);
  readonly searchPalette = inject(SearchPaletteService);
  readonly theme = inject(ThemeService);
  readonly menuOpen = signal(false);
  readonly topicsOpen = signal(false);
  readonly demoOpen = signal(false);

  readonly topics = TOPICS;

  private readonly topicPaths = new Set(this.topics.map((topic) => topic.path));
  private readonly demoPaths = new Set(['/products', '/favorites']);

  private readonly router = inject(Router);
  private readonly navSub: Subscription;

  constructor() {
    this.navSub = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => this.closeAll());

    effect(() => {
      document.body.style.overflow = this.menuOpen() ? 'hidden' : '';
    });
  }

  isTopicActive(): boolean {
    return this.topicPaths.has(this.router.url.split('?')[0]);
  }

  isDemoActive(): boolean {
    const url = this.router.url.split('?')[0];
    return this.demoPaths.has(url) || url.startsWith('/products/');
  }

  toggleTopics(event: Event): void {
    event.stopPropagation();
    this.demoOpen.set(false);
    this.topicsOpen.update((open) => !open);
  }

  toggleDemo(event: Event): void {
    event.stopPropagation();
    this.topicsOpen.set(false);
    this.demoOpen.update((open) => !open);
  }

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  closeAll(): void {
    this.menuOpen.set(false);
    this.topicsOpen.set(false);
    this.demoOpen.set(false);
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.topicsOpen.set(false);
    this.demoOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeAll();
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
