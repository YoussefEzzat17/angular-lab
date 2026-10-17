import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SidebarStateService } from '../../core/services/sidebar-state.service';
import { LearningFacade } from '../../core/services/learning.facade';
import { IconComponent } from '../../shared/icon.component';

@Component({
  selector: 'app-sidebar-header',
  standalone: true,
  imports: [RouterLink, IconComponent],
  template: `
    <div class="flex items-center justify-between border-b border-stone-800 px-4 py-3">
      <a routerLink="/" class="text-lg font-bold text-gold-400">
        Angular <span class="text-stone-100">Lab</span>
      </a>
      <button
        type="button"
        (click)="sidebarState.toggleCollapsed()"
        [attr.aria-label]="sidebarState.collapsed() ? 'Expand sidebar' : 'Collapse sidebar'"
        class="grid h-8 w-8 place-items-center rounded-lg text-stone-400 transition hover:bg-stone-800 hover:text-gold-300"
      >
        <app-icon name="menu" class="h-4 w-4" />
      </button>
    </div>

    <!-- Progress summary -->
    <div class="border-b border-stone-800 p-4">
      <div class="flex items-center gap-3">
        <div class="flex-1">
          <div class="flex items-center justify-between text-xs text-stone-400">
            <span>Progress</span>
            <span class="font-semibold text-gold-300">{{ facade.completedCount() }}/{{ facade.totalCount }} topics</span>
          </div>
          <div class="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-stone-800">
            <div class="h-full rounded-full bg-gold-500 transition-all duration-500" [style.width.%]="facade.percent()"></div>
          </div>
        </div>
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
  readonly sidebarState = inject(SidebarStateService);
  readonly facade = inject(LearningFacade);
}
