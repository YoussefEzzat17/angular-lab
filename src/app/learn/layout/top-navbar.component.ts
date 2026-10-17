import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LearningFacade } from '../../core/services/learning.facade';
import { ThemeService } from '../../core/services/theme.service';
import { SearchPaletteService } from '../../core/services/search-palette.service';
import { SidebarStateService } from '../../core/services/sidebar-state.service';
import { IconComponent } from '../../shared/icon.component';

@Component({
  selector: 'app-top-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, IconComponent],
  template: `
    <header class="flex h-14 shrink-0 items-center gap-3 border-b border-stone-800 bg-stone-950/95 px-4 backdrop-blur sm:px-6">

      <!-- Left: sidebar toggle + logo -->
      <div class="flex shrink-0 items-center gap-2">
        <button
          type="button"
          (click)="sidebarState.toggleCollapsed()"
          aria-label="Toggle sidebar"
          class="grid h-8 w-8 place-items-center rounded-lg text-stone-400 transition hover:bg-stone-800 hover:text-gold-300"
        >
          <app-icon name="menu" class="h-4 w-4" />
        </button>
        <a routerLink="/" class="text-base font-bold text-gold-400 sm:text-lg">
          Angular <span class="text-stone-100">Lab</span>
        </a>
      </div>

      <!-- Center: search + progress + continue (hidden on mobile) -->
      <div class="hidden flex-1 items-center gap-3 lg:flex">

        <!-- Search bar -->
        <button
          type="button"
          (click)="searchPalette.toggle()"
          class="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-stone-800 bg-stone-900 px-3 py-1.5 text-sm text-stone-500 transition hover:border-stone-700 hover:bg-stone-800 hover:text-stone-300"
          style="max-width: 240px"
          aria-label="Search topics (⌘K)"
        >
          <app-icon name="search" class="h-3.5 w-3.5 shrink-0" />
          <span class="flex-1 text-left text-xs">Search topics…</span>
          <kbd class="shrink-0 rounded border border-stone-700 px-1.5 py-0.5 text-[10px]">⌘K</kbd>
        </button>

        <!-- Progress -->
        <div class="flex min-w-0 flex-1 items-center gap-2" style="max-width: 200px">
          <div class="flex-1 overflow-hidden rounded-full bg-stone-800" style="height: 5px">
            <div
              class="h-full rounded-full bg-gold-500 transition-all duration-500"
              [style.width.%]="facade.percent()"
            ></div>
          </div>
          <span class="shrink-0 text-xs font-semibold text-gold-300">
            {{ facade.completedCount() }}/{{ facade.totalCount }}
          </span>
        </div>

        <!-- Continue button -->
        <a
          [routerLink]="facade.continueTarget()"
          class="shrink-0 rounded-lg bg-gold-500/15 px-3 py-1.5 text-xs font-semibold text-gold-300 transition hover:bg-gold-500/25"
        >
          {{ facade.completedCount() === 0 ? 'Start →' : 'Continue →' }}
        </a>
      </div>

      <!-- Right: dashboard + bookmarks + feedback + theme + avatar -->
      <div class="ml-auto flex shrink-0 items-center gap-1">

        <!-- Dashboard (desktop only) -->
        <a
          routerLink="/dashboard"
          routerLinkActive="text-gold-300 bg-gold-500/10"
          class="hidden items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-stone-400 transition hover:bg-stone-800 hover:text-stone-200 xl:flex"
          aria-label="Dashboard"
        >
          📊 Dashboard
        </a>

        <!-- Bookmarks (desktop only) -->
        <a
          routerLink="/bookmarks"
          routerLinkActive="text-gold-300 bg-gold-500/10"
          class="hidden items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-stone-400 transition hover:bg-stone-800 hover:text-stone-200 xl:flex"
          aria-label="Bookmarks"
        >
          🔖 Bookmarks
        </a>

        <!-- Feedback -->
        <a
          routerLink="/feedback"
          routerLinkActive="text-gold-300"
          class="hidden items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-stone-400 transition hover:bg-stone-800 hover:text-stone-200 sm:flex"
        >
          📝 Feedback
        </a>

        <!-- Theme toggle -->
        <button
          type="button"
          (click)="theme.toggle()"
          [attr.aria-label]="theme.theme() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
          class="grid h-8 w-8 place-items-center rounded-lg text-stone-400 transition hover:bg-stone-800 hover:text-gold-300"
        >
          <app-icon [name]="theme.theme() === 'dark' ? 'moon' : 'sun'" class="h-4 w-4" />
        </button>

        <!-- Avatar -->
        <div class="flex h-8 w-8 items-center justify-center rounded-full bg-gold-500/20 text-sm font-bold text-gold-300">
          {{ facade.initials() || '?' }}
        </div>
      </div>
    </header>
  `,
})
export class TopNavbarComponent {
  readonly facade = inject(LearningFacade);
  readonly theme = inject(ThemeService);
  readonly searchPalette = inject(SearchPaletteService);
  readonly sidebarState = inject(SidebarStateService);
}
