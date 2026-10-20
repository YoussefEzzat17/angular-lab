import { ChangeDetectionStrategy, Component, HostListener, inject, OnDestroy } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { A11yModule } from '@angular/cdk/a11y';
import { TopNavbarComponent } from '../../learn/layout/top-navbar.component';
import { LearnFooterComponent } from '../../learn/layout/learn-footer.component';
import { CourseSidebarComponent } from '../../learn/sidebar/course-sidebar.component';
import { MobileNavComponent } from '../../shared/mobile-nav.component';
import { SidebarStateService } from '../services/sidebar-state.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-site-layout',
  standalone: true,
  imports: [RouterOutlet, MobileNavComponent, TopNavbarComponent, LearnFooterComponent, CourseSidebarComponent, A11yModule],
  template: `
    <div class="flex min-h-screen flex-col">
      <app-top-navbar />
      <main class="flex-1 pb-20 lg:pb-0">
        <router-outlet />
      </main>
      <app-learn-footer />

      <app-mobile-nav />

      <!-- Mobile bottom sheet drawer (same as learn-layout) -->
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
          class="fixed inset-x-0 bottom-0 z-50 flex max-h-[80vh] flex-col rounded-t-2xl border-t border-stone-800 bg-stone-950 lg:hidden"
          style="padding-bottom: env(safe-area-inset-bottom)"
        >
          <!-- Sheet handle -->
          <div class="flex items-center justify-between border-b border-stone-800 px-4 py-3">
            <p class="font-bold text-stone-100">Course Topics</p>
            <button
              type="button"
              (click)="sidebarState.closeDrawer()"
              class="grid h-8 w-8 place-items-center rounded-lg text-stone-400 hover:bg-stone-800"
              aria-label="Close"
            >✕</button>
          </div>
          <div class="flex min-h-0 flex-1 flex-col">
            <app-course-sidebar class="flex min-h-0 w-full flex-1 flex-col" />
          </div>
        </div>
      }
    </div>
  `,
})
export class SiteLayoutComponent implements OnDestroy {
  readonly sidebarState = inject(SidebarStateService);
  private readonly router = inject(Router);
  private readonly navSub: Subscription;

  constructor() {
    // Auto-close the drawer on every navigation (same as learn-layout)
    this.navSub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => this.sidebarState.closeDrawer());
  }

  ngOnDestroy(): void {
    this.navSub.unsubscribe();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.sidebarState.drawerOpen()) {
      this.sidebarState.closeDrawer();
    }
  }
}
