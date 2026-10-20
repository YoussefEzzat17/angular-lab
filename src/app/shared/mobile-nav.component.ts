import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LearningFacade } from '../core/services/learning.facade';
import { SidebarStateService } from '../core/services/sidebar-state.service';

const ACTIVE = 'flex flex-col items-center gap-0.5 px-2 py-1 text-gold-400';
const IDLE = 'flex flex-col items-center gap-0.5 px-2 py-1 text-stone-500';

/** The bottom bar on phones: Home, Topics (opens the sheet), Journey, Dashboard and Saved. Shared by both layouts. */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-mobile-nav',
  standalone: true,
  imports: [RouterLink],
  template: `
    <nav
      class="fixed inset-x-0 bottom-0 z-30 border-t border-stone-800 bg-stone-950/95 backdrop-blur lg:hidden"
      style="padding-bottom: env(safe-area-inset-bottom)"
      aria-label="Main navigation"
    >
      <div class="flex items-center justify-around px-2 py-2">
        <a routerLink="/" [class]="cls(isActive('/'))" aria-label="Home">
          <span class="text-xl">🏠</span>
          <span class="text-[10px] font-semibold">Home</span>
        </a>

        <button type="button" (click)="sidebarState.openDrawer()" [class]="cls(sidebarState.drawerOpen())" aria-label="Topics">
          <span class="text-xl">📚</span>
          <span class="text-[10px] font-semibold">Topics</span>
        </button>

        <a routerLink="/journey" [class]="cls(isActive('/journey'))" aria-label="Journey">
          <span class="text-xl">🗺️</span>
          <span class="text-[10px] font-semibold">Journey</span>
        </a>

        <a routerLink="/dashboard" [class]="cls(isActive('/dashboard'))" aria-label="Dashboard">
          <span class="text-xl">📊</span>
          <span class="text-[10px] font-semibold">Dashboard</span>
        </a>

        <a routerLink="/bookmarks" [class]="cls(isActive('/bookmarks'))" aria-label="Bookmarks">
          <span class="text-xl">🔖</span>
          <span class="text-[10px] font-semibold">Saved</span>
        </a>
      </div>
    </nav>
  `,
})
export class MobileNavComponent {
  private readonly facade = inject(LearningFacade);
  protected readonly sidebarState = inject(SidebarStateService);

  protected cls(active: boolean): string {
    return active ? ACTIVE : IDLE;
  }

  /** Reads the router's URL signal, so the highlight follows every navigation. */
  protected isActive(path: string): boolean {
    const url = this.facade.currentUrl().split(/[?#]/)[0];
    return path === '/' ? url === '/' : url === path || url.startsWith(path + '/');
  }
}
