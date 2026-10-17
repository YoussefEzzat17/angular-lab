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
    <header class="flex h-14 shrink-0 items-center justify-between border-b border-stone-800 bg-stone-950/95 px-4 backdrop-blur sm:px-6">

      <!-- Left: logo + sidebar toggle -->
      <div class="flex items-center gap-3">
        <button
          type="button"
          (click)="sidebarState.toggleCollapsed()"
          aria-label="Toggle sidebar"
          class="hidden lg:grid h-8 w-8 place-items-center rounded-lg text-stone-400 transition hover:bg-stone-800 hover:text-gold-300"
        >
          <app-icon name="menu" class="h-4 w-4" />
        </button>
        <a routerLink="/" class="text-lg font-bold text-gold-400">
          Angular <span class="text-stone-100">Lab</span>
        </a>
      </div>

      <!-- Right: feedback + theme + avatar -->
      <div class="flex items-center gap-2">
        <a
          routerLink="/feedback"
          routerLinkActive="text-gold-300"
          class="hidden items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-stone-400 transition hover:bg-stone-800 hover:text-stone-200 sm:flex"
        >
          📝 Feedback
        </a>

        <button
          type="button"
          (click)="theme.toggle()"
          [attr.aria-label]="theme.theme() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
          class="grid h-8 w-8 place-items-center rounded-lg text-stone-400 transition hover:bg-stone-800 hover:text-gold-300"
        >
          <app-icon [name]="theme.theme() === 'dark' ? 'moon' : 'sun'" class="h-4 w-4" />
        </button>

        <!-- Avatar / name -->
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
