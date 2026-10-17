import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LearningFacade } from '../../core/services/learning.facade';
import { SearchPaletteService } from '../../core/services/search-palette.service';
import { IconComponent } from '../../shared/icon.component';

@Component({
  selector: 'app-sidebar-header',
  standalone: true,
  imports: [RouterLink, IconComponent],
  template: `
    <!-- Search bar -->
    <div class="border-b border-stone-800 px-3 py-2.5">
      <button
        type="button"
        (click)="searchPalette.toggle()"
        class="flex w-full items-center gap-2.5 rounded-xl border border-stone-800 bg-stone-900 px-3 py-2 text-sm text-stone-500 transition hover:border-stone-700 hover:bg-stone-800 hover:text-stone-300"
        aria-label="Search topics (⌘K)"
      >
        <app-icon name="search" class="h-4 w-4 shrink-0" />
        <span class="flex-1 text-left">Search topics…</span>
        <kbd class="shrink-0 rounded border border-stone-700 px-1.5 py-0.5 text-[10px]">⌘K</kbd>
      </button>
    </div>

    <!-- Progress summary -->
    <div class="border-b border-stone-800 p-4">
      <div class="flex items-center justify-between text-xs text-stone-400">
        <span>Progress</span>
        <span class="font-semibold text-gold-300">{{ facade.completedCount() }}/{{ facade.totalCount }} topics</span>
      </div>
      <div class="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-stone-800">
        <div class="h-full rounded-full bg-gold-500 transition-all duration-500" [style.width.%]="facade.percent()"></div>
      </div>
      <a
        [routerLink]="facade.continueTarget()"
        class="mt-3 flex items-center justify-center gap-2 rounded-xl bg-gold-500/10 px-3 py-2 text-sm font-semibold text-gold-300 transition hover:bg-gold-500/20"
      >
        {{ facade.completedCount() === 0 ? 'Start learning →' : 'Continue →' }}
      </a>
      <div class="mt-2 grid grid-cols-2 gap-2">
        <a routerLink="/dashboard"
           class="flex items-center justify-center gap-1.5 rounded-xl border border-stone-800 px-3 py-2 text-xs font-semibold text-stone-400 transition hover:bg-stone-800 hover:text-stone-200">
          📊 Dashboard
        </a>
        <a routerLink="/bookmarks"
           class="flex items-center justify-center gap-1.5 rounded-xl border border-stone-800 px-3 py-2 text-xs font-semibold text-stone-400 transition hover:bg-stone-800 hover:text-stone-200">
          🔖 Bookmarks
        </a>
      </div>
    </div>
  `,
})
export class SidebarHeaderComponent {
  readonly facade = inject(LearningFacade);
  readonly searchPalette = inject(SearchPaletteService);
}
