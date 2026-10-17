import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LearningFacade } from '../../core/services/learning.facade';
import { ThemeService } from '../../core/services/theme.service';
import { SearchPaletteService } from '../../core/services/search-palette.service';
import { SidebarStateService } from '../../core/services/sidebar-state.service';
import { IconComponent } from '../../shared/icon.component';
import { ProgressRingComponent } from '../../shared/progress-ring.component';

@Component({
  selector: 'app-top-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, IconComponent, ProgressRingComponent],
  template: `
    <header class="flex h-14 shrink-0 items-center gap-3 border-b border-stone-800 bg-stone-950/95 px-4 backdrop-blur sm:px-6">

      <!-- Left: toggle + logo -->
      <div class="flex shrink-0 items-center gap-2">
        <button
          type="button"
          (click)="sidebarState.toggleCollapsed()"
          aria-label="Toggle sidebar"
          class="hidden lg:grid h-8 w-8 place-items-center rounded-lg text-stone-400 transition hover:bg-stone-800 hover:text-gold-300"
        >
          <app-icon name="menu" class="h-4 w-4" />
        </button>

        <!-- Animated bracket logo -->
        <a routerLink="/" aria-label="Angular Lab home" class="flex items-center font-bold">
          <svg width="10" height="18" viewBox="0 0 12 20" fill="none" aria-hidden="true" class="text-gold-400">
            <path d="M10 2L2 10L10 18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
              stroke-dasharray="24" stroke-dashoffset="24"
              style="animation: draw-bracket 0.5s ease forwards 0.1s"></path>
          </svg>
          <span class="text-base text-gold-400 sm:text-lg">Angular</span>
          <span class="text-base text-stone-100 sm:text-lg">&nbsp;Lab</span>
          <svg width="10" height="18" viewBox="0 0 12 20" fill="none" aria-hidden="true" class="text-gold-400">
            <path d="M2 2L10 10L2 18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
              stroke-dasharray="24" stroke-dashoffset="24"
              style="animation: draw-bracket 0.5s ease forwards 0.3s"></path>
          </svg>
        </a>
      </div>

      <!-- Spacer (pushes right section to the right) -->
      <div class="flex-1"></div>

      <!-- Right section: progress ring + continue + search + dashboard + bookmarks + feedback + theme + avatar -->
      <div class="flex items-center gap-2">

        <!-- Mini progress ring + count (desktop only) -->
        <div
          class="hidden items-center gap-2 lg:flex"
          [title]="'Progress: ' + facade.percent() + '% — ' + facade.completedCount() + ' of ' + facade.totalCount + ' topics complete'"
        >
          <app-progress-ring
            [percent]="facade.percent()"
            [size]="28"
            [strokeWidth]="3"
            [ariaText]="facade.completedCount() + ' of ' + facade.totalCount + ' topics complete'"
          />
          <div class="flex flex-col leading-none">
            <span class="text-xs font-semibold text-gold-300">{{ facade.completedCount() }}/{{ facade.totalCount }} topics</span>
            <span class="text-[10px] text-stone-500">{{ facade.percent() }}% done</span>
          </div>
        </div>

        <!-- Continue button (desktop only) -->
        <a
          [routerLink]="facade.continueTarget()"
          class="hidden rounded-lg bg-gold-500/15 px-3 py-1.5 text-xs font-semibold text-gold-300 transition hover:bg-gold-500/25 lg:block"
        >
          {{ facade.completedCount() === 0 ? 'Start →' : 'Continue →' }}
        </a>

        <!-- Divider (desktop only) -->
        <div class="hidden h-5 w-px bg-stone-800 lg:block"></div>

        <!-- Search button -->
        <button
          type="button"
          (click)="searchPalette.toggle()"
          class="flex flex-1 items-center gap-2 rounded-xl border border-stone-800 bg-stone-900 px-3 py-1.5 text-xs text-stone-500 transition hover:border-stone-700 hover:bg-stone-800 hover:text-stone-300 lg:max-w-xs"
          aria-label="Search topics (⌘K)"
        >
          <app-icon name="search" class="h-3.5 w-3.5 shrink-0" />
          <span class="hidden sm:inline">Search…</span>
          <kbd class="hidden rounded border border-stone-700 px-1 py-0.5 text-[10px] sm:inline">⌘K</kbd>
        </button>

        <!-- Dashboard (xl+ only) -->
        <a routerLink="/dashboard" routerLinkActive="text-gold-300 bg-gold-500/10"
           class="hidden items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-stone-400 transition hover:bg-stone-800 hover:text-stone-200 xl:flex"
           aria-label="Dashboard">
          📊
        </a>

        <!-- Bookmarks (xl+ only) -->
        <a routerLink="/bookmarks" routerLinkActive="text-gold-300 bg-gold-500/10"
           class="hidden items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-stone-400 transition hover:bg-stone-800 hover:text-stone-200 xl:flex"
           aria-label="Bookmarks">
          🔖
        </a>

        <!-- Feedback -->
        <a routerLink="/feedback" routerLinkActive="text-gold-300"
           class="hidden items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-stone-400 transition hover:bg-stone-800 hover:text-stone-200 sm:flex">
          📝 Feedback
        </a>

        <!-- Theme toggle -->
        <button type="button" (click)="theme.toggle()"
          [attr.aria-label]="theme.theme() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
          class="grid h-8 w-8 place-items-center rounded-lg text-stone-400 transition hover:bg-stone-800 hover:text-gold-300">
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
