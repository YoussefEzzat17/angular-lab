import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CurriculumTreeComponent } from './curriculum-tree.component';
import { SidebarStateService } from '../../core/services/sidebar-state.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-course-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CurriculumTreeComponent],
  host: { class: 'flex flex-col h-full' },
  template: `
    <!-- Sidebar header: Topics label + collapse chevron -->
    <div class="flex items-center justify-between border-b border-stone-800 px-3 py-2.5">
      <span class="text-xs font-bold uppercase tracking-wider text-stone-500">Topics</span>
      <button
        type="button"
        (click)="sidebarState.toggleCollapsed()"
        aria-label="Collapse sidebar"
        class="grid h-7 w-7 place-items-center rounded-lg text-stone-400 transition hover:bg-stone-800 hover:text-gold-300"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M9 2L4 7L9 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>

    <app-curriculum-tree class="flex-1 overflow-y-auto" />

    <!-- Demo App links -->
    <div class="border-t border-stone-800 px-3 py-3">
      <p class="mb-1.5 px-2 text-[10px] font-bold uppercase tracking-wider text-stone-500">Demo App</p>
      <a routerLink="/products"
         routerLinkActive="bg-gold-500/10 text-gold-300"
         class="flex min-h-9 items-center gap-2.5 rounded-xl px-3 py-1.5 text-sm text-stone-400 transition hover:bg-stone-800 hover:text-stone-200">
        <span>🎬</span> Browse titles
      </a>
      <a routerLink="/favorites"
         routerLinkActive="bg-gold-500/10 text-gold-300"
         class="flex min-h-9 items-center gap-2.5 rounded-xl px-3 py-1.5 text-sm text-stone-400 transition hover:bg-stone-800 hover:text-stone-200">
        <span>♡</span> My List
      </a>
    </div>
  `,
})
export class CourseSidebarComponent {
  readonly sidebarState = inject(SidebarStateService);
}
