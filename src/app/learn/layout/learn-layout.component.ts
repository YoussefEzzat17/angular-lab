import { Component, HostListener, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { A11yModule } from '@angular/cdk/a11y';
import { SidebarStateService } from '../../core/services/sidebar-state.service';
import { CourseSidebarComponent } from '../sidebar/course-sidebar.component';
import { IconComponent } from '../../shared/icon.component';

@Component({
  selector: 'app-learn-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CourseSidebarComponent, IconComponent, A11yModule],
  template: `
    <div class="flex min-h-screen">

      <!-- Desktop sidebar -->
      <aside
        class="hidden lg:flex lg:flex-col lg:border-r lg:border-stone-800 lg:bg-stone-950 lg:transition-all lg:duration-300"
        [style.width]="sidebarState.collapsed() ? '72px' : '280px'"
        [class.overflow-hidden]="sidebarState.collapsed()"
      >
        @if (!sidebarState.collapsed()) {
          <app-course-sidebar class="flex h-full w-[280px] flex-col" />
        } @else {
          <!-- Rail mode: icons only -->
          <div class="flex flex-col items-center gap-1 py-4">
            <button
              type="button"
              (click)="sidebarState.toggleCollapsed()"
              aria-label="Expand sidebar"
              class="grid h-10 w-10 place-items-center rounded-xl text-stone-400 transition hover:bg-stone-800 hover:text-gold-300"
            >
              <app-icon name="menu" class="h-5 w-5" />
            </button>
          </div>
        }
      </aside>

      <!-- Main content column -->
      <div class="flex min-w-0 flex-1 flex-col">

        <!-- Mobile top bar -->
        <header class="flex items-center justify-between border-b border-stone-800 bg-stone-950/95 px-4 py-3 lg:hidden">
          <button
            type="button"
            (click)="sidebarState.openDrawer()"
            aria-label="Open course menu"
            class="grid h-10 w-10 place-items-center rounded-xl text-stone-300 transition hover:bg-stone-800"
          >
            <app-icon name="menu" class="h-5 w-5" />
          </button>
          <a routerLink="/" class="text-base font-bold text-gold-400">Angular <span class="text-stone-100">Lab</span></a>
          <div class="w-10"></div>
        </header>

        <!-- Router outlet -->
        <main class="flex-1" id="learn-main">
          <router-outlet />
        </main>
      </div>

      <!-- Mobile drawer overlay -->
      @if (sidebarState.drawerOpen()) {
        <div
          class="fixed inset-0 z-40 bg-stone-950/70 lg:hidden"
          (click)="sidebarState.closeDrawer()"
          aria-hidden="true"
        ></div>
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Course navigation"
          cdkTrapFocus
          [cdkTrapFocusAutoCapture]="true"
          class="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-stone-800 bg-stone-950 lg:hidden"
        >
          <app-course-sidebar class="flex h-full w-full flex-col" />
        </div>
      }
    </div>
  `,
})
export class LearnLayoutComponent {
  readonly sidebarState = inject(SidebarStateService);

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.sidebarState.drawerOpen()) {
      this.sidebarState.closeDrawer();
    }
  }
}
