import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { IconComponent } from './icon.component';

import { LearningFacade } from '../core/services/learning.facade';
import { SidebarStateService } from '../core/services/sidebar-state.service';

// Each tab fills its column, so the whole width of the bar is a target.
const ACTIVE = 'flex flex-1 flex-col items-center justify-center gap-1 rounded-xl text-gold-400';
const IDLE = 'flex flex-1 flex-col items-center justify-center gap-1 rounded-xl text-stone-400 transition hover:text-stone-200';

/** The bottom bar on phones: Home, Topics (opens the sheet), Journey, Dashboard and Saved. Shared by both layouts. */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-mobile-nav',
  standalone: true,
  imports: [RouterLink, IconComponent],
  template: `
    <nav
      class="fixed inset-x-0 bottom-0 z-30 border-t border-stone-800 bg-stone-950/95 backdrop-blur lg:hidden"
      style="padding-bottom: env(safe-area-inset-bottom)"
      aria-label="Main navigation"
    >
      <!-- Fixed height: the lesson layout reserves exactly 4.375rem (plus the safe area) for this bar, so the sticky section bar rests on top of it. -->
      <div class="flex h-[calc(4.375rem-1px)] items-stretch px-1">
        <a routerLink="/" [class]="cls(isActive('/'))" [attr.aria-current]="isActive('/') ? 'page' : null" aria-label="Home">
          <app-icon name="home" class="h-6 w-6" />
          <span class="text-xs font-semibold">Home</span>
        </a>

        <button type="button" (click)="sidebarState.openDrawer()" [class]="cls(sidebarState.drawerOpen())" aria-label="Topics"
                [attr.aria-expanded]="sidebarState.drawerOpen()">
          <app-icon name="book" class="h-6 w-6" />
          <span class="text-xs font-semibold">Topics</span>
        </button>

        <a routerLink="/journey" [class]="cls(isActive('/journey'))" [attr.aria-current]="isActive('/journey') ? 'page' : null" aria-label="Journey">
          <app-icon name="map" class="h-6 w-6" />
          <span class="text-xs font-semibold">Journey</span>
        </a>

        <a routerLink="/dashboard" [class]="cls(isActive('/dashboard'))" [attr.aria-current]="isActive('/dashboard') ? 'page' : null" aria-label="Dashboard">
          <app-icon name="grid" class="h-6 w-6" />
          <span class="text-xs font-semibold">Dashboard</span>
        </a>

        <a routerLink="/bookmarks" [class]="cls(isActive('/bookmarks'))" [attr.aria-current]="isActive('/bookmarks') ? 'page' : null" aria-label="Saved">
          <app-icon name="bookmark" class="h-6 w-6" />
          <span class="text-xs font-semibold">Saved</span>
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
