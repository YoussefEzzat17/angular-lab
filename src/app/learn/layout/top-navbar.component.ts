import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LearningFacade } from '../../core/services/learning.facade';
import { ThemeService } from '../../core/services/theme.service';
import { SearchPaletteService } from '../../core/services/search-palette.service';
import { IconComponent } from '../../shared/icon.component';
import { ProgressRingComponent } from '../../shared/progress-ring.component';

@Component({
  selector: 'app-top-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, IconComponent, ProgressRingComponent],
  template: `
    <header class="flex h-14 shrink-0 items-center gap-3 border-b border-stone-800 bg-stone-950/95 px-4 backdrop-blur sm:px-6">

      <!-- Left: logo -->
      <div class="flex shrink-0 items-center gap-2">
        <a routerLink="/" aria-label="Angular Lab home" class="flex items-center gap-2 font-bold">
          <!-- Angular shield icon SVG -->
          <svg width="22" height="22" viewBox="0 0 250 250" aria-hidden="true">
            <polygon fill="#DD0031" points="125,30 162,90 125,110 88,90"/>
            <polygon fill="#C3002F" points="125,30 125,110 162,90"/>
            <polygon fill="#ffffff" points="125,110 88,90 88,160 125,190 162,160 162,90"/>
            <polygon fill="#e0e0e0" points="125,110 125,190 162,160 162,90"/>
            <polygon fill="#ffffff" points="88,160 98,140 125,150 152,140 162,160 125,185"/>
            <polygon fill="#e0e0e0" points="125,150 152,140 162,160 125,185"/>
            <polygon fill="#DD0031" points="98,140 88,160 125,185 125,150"/>
            <polygon fill="#C3002F" points="125,150 125,185 162,160 152,140"/>
          </svg>
          <span class="text-base text-stone-100 sm:text-lg">Angular <span class="text-gold-400">Lab</span></span>
        </a>
      </div>

      <!-- Right section: progress ring + continue + search + dashboard + bookmarks + feedback + theme + avatar -->
      <div class="flex flex-1 items-center justify-end gap-4">

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
          class="flex flex-1 items-center gap-2 rounded-xl border border-stone-800 bg-stone-900 px-3 py-1.5 text-xs text-stone-500 transition hover:border-stone-700 hover:bg-stone-800 hover:text-stone-300 lg:max-w-sm"
          aria-label="Search topics (⌘K)"
        >
          <app-icon name="search" class="h-3.5 w-3.5 shrink-0" />
          <span class="hidden lg:inline">Search topics…</span>
          <kbd class="hidden rounded border border-stone-700 px-1 py-0.5 text-[10px] sm:inline">⌘K</kbd>
        </button>

        <!-- Saved Topics (xl+ only) -->
        <a routerLink="/bookmarks" routerLinkActive="text-gold-300 bg-gold-500/10"
           class="hidden items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-stone-400 transition hover:bg-stone-800 hover:text-stone-200 xl:flex"
           aria-label="Saved Topics"
           title="Saved Topics">
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
}
