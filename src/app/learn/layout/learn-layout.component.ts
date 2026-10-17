import { Component, HostListener, OnDestroy, computed, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { A11yModule } from '@angular/cdk/a11y';
import { SidebarStateService } from '../../core/services/sidebar-state.service';
import { ProfileService } from '../../core/services/profile.service';
import { OnboardingDialogComponent } from '../../core/onboarding/onboarding-dialog.component';
import { CourseSidebarComponent } from '../sidebar/course-sidebar.component';
import { IconComponent } from '../../shared/icon.component';
import { TOPICS } from '../../core/data/topics';
import { TopNavbarComponent } from './top-navbar.component';
import { LearnFooterComponent } from './learn-footer.component';

@Component({
  selector: 'app-learn-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CourseSidebarComponent, IconComponent, A11yModule, OnboardingDialogComponent, TopNavbarComponent, LearnFooterComponent],
  template: `
    @if (showOnboarding()) {
      <app-onboarding-dialog (closed)="onOnboardingClosed()" />
    }

    <div class="flex h-screen flex-col overflow-hidden">

      <!-- Top navbar — full width, always visible -->
      <app-top-navbar />

      <!-- Body row: sidebar + content -->
      <div class="flex flex-1 overflow-hidden">

      <!-- Desktop sidebar -->
      <aside
        class="hidden h-full lg:flex lg:flex-col lg:border-r lg:border-stone-800 lg:bg-stone-950 lg:transition-all lg:duration-300"
        [style.width]="sidebarState.collapsed() ? '72px' : '280px'"
        [class.overflow-hidden]="sidebarState.collapsed()"
      >
        @if (!sidebarState.collapsed()) {
          <app-course-sidebar class="flex h-full w-[280px] flex-col" />
        } @else {
          <!-- Rail mode: topic icons + tooltips -->
          <div class="flex h-full flex-col items-center gap-1 overflow-y-auto py-3">
            <!-- Expand button -->
            <button
              type="button"
              (click)="sidebarState.toggleCollapsed()"
              aria-label="Expand sidebar"
              class="mb-2 grid h-10 w-10 place-items-center rounded-xl text-stone-400 transition hover:bg-stone-800 hover:text-gold-300"
            >
              <app-icon name="menu" class="h-5 w-5" />
            </button>

            <!-- Dashboard icon -->
            <a routerLink="/dashboard"
               [class]="isActive('/dashboard') ? 'group relative grid h-10 w-10 place-items-center rounded-xl bg-gold-500/20 text-gold-400' : 'group relative grid h-10 w-10 place-items-center rounded-xl text-stone-400 transition hover:bg-stone-800 hover:text-gold-300'"
               aria-label="Dashboard"
               title="Dashboard">
              <span class="text-base">📊</span>
              <span class="pointer-events-none absolute left-full ml-2 z-50 hidden whitespace-nowrap rounded-lg bg-stone-800 px-2.5 py-1.5 text-xs font-semibold text-stone-100 shadow-lg group-hover:block">
                Dashboard
              </span>
            </a>

            <div class="my-1 h-px w-8 bg-stone-800"></div>

            <!-- Topic icons -->
            @for (topic of topics; track topic.id) {
              <a
                [routerLink]="['/learn', topic.id]"
                [attr.aria-label]="topic.title"
                [class]="isActive('/learn/' + topic.id) ? 'group relative grid h-10 w-10 place-items-center rounded-xl bg-gold-500/20 text-gold-400' : 'group relative grid h-10 w-10 place-items-center rounded-xl text-stone-400 transition hover:bg-stone-800 hover:text-gold-300'"
              >
                <span class="text-base leading-none">{{ topic.icon }}</span>
                <span class="pointer-events-none absolute left-full ml-2 z-50 hidden whitespace-nowrap rounded-lg bg-stone-800 px-2.5 py-1.5 text-xs font-semibold text-stone-100 shadow-lg group-hover:block">
                  {{ topic.title }}
                </span>
              </a>
            }

            <div class="my-1 h-px w-8 bg-stone-800"></div>

            <!-- Bookmarks icon -->
            <a routerLink="/bookmarks"
               aria-label="Bookmarks"
               class="group relative grid h-10 w-10 place-items-center rounded-xl text-stone-400 transition hover:bg-stone-800 hover:text-gold-300">
              <span class="text-base">🔖</span>
              <span class="pointer-events-none absolute left-full ml-2 z-50 hidden whitespace-nowrap rounded-lg bg-stone-800 px-2.5 py-1.5 text-xs font-semibold text-stone-100 shadow-lg group-hover:block">
                Bookmarks
              </span>
            </a>
          </div>
        }
      </aside>

      <!-- Main content column -->
      <div class="flex min-w-0 flex-1 flex-col overflow-y-auto">

        <!-- Router outlet -->
        <main class="flex-1 pb-20 lg:pb-0" id="learn-main">
          <router-outlet />
        </main>

        <app-learn-footer />

        <!-- Mobile bottom nav -->
        <nav class="lg:hidden fixed bottom-0 inset-x-0 z-30 border-t border-stone-800 bg-stone-950/95 backdrop-blur"
             style="padding-bottom: env(safe-area-inset-bottom)"
             aria-label="Main navigation">
          <div class="flex items-center justify-around px-2 py-2">

            <a routerLink="/dashboard"
               [class]="isMobileActive('/dashboard') ? 'flex flex-col items-center gap-0.5 px-3 py-1 text-gold-400' : 'flex flex-col items-center gap-0.5 px-3 py-1 text-stone-500'"
               aria-label="Dashboard">
              <span class="text-xl">📊</span>
              <span class="text-[10px] font-semibold">Home</span>
            </a>

            <button
              type="button"
              (click)="sidebarState.openDrawer()"
              [class]="sidebarState.drawerOpen() ? 'flex flex-col items-center gap-0.5 px-3 py-1 text-gold-400' : 'flex flex-col items-center gap-0.5 px-3 py-1 text-stone-500'"
              aria-label="Topics"
            >
              <span class="text-xl">📚</span>
              <span class="text-[10px] font-semibold">Topics</span>
            </button>

            <a routerLink="/bookmarks"
               [class]="isMobileActive('/bookmarks') ? 'flex flex-col items-center gap-0.5 px-3 py-1 text-gold-400' : 'flex flex-col items-center gap-0.5 px-3 py-1 text-stone-500'"
               aria-label="Bookmarks">
              <span class="text-xl">🔖</span>
              <span class="text-[10px] font-semibold">Saved</span>
            </a>

          </div>
        </nav>
      </div>

      </div>

      <!-- Mobile bottom sheet (replaces left drawer) -->
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
          <div class="flex-1 overflow-y-auto">
            <app-course-sidebar class="flex h-full w-full flex-col" />
          </div>
        </div>
      }
    </div>
  `,
})
export class LearnLayoutComponent implements OnDestroy {
  readonly sidebarState = inject(SidebarStateService);
  private readonly profile = inject(ProfileService);
  private readonly router = inject(Router);
  readonly showOnboarding = computed(() => !this.profile.onboardingDone());
  readonly topics = TOPICS;

  private readonly navSub: Subscription;

  constructor() {
    // Auto-close the mobile bottom sheet on every navigation
    this.navSub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => this.sidebarState.closeDrawer());
  }

  ngOnDestroy(): void { this.navSub.unsubscribe(); }

  onOnboardingClosed(): void {}

  isActive(path: string): boolean {
    return this.router.url === path || this.router.url.startsWith(path + '/');
  }

  isMobileActive(path: string): boolean {
    return this.router.url === path || this.router.url.startsWith(path + '/');
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.sidebarState.drawerOpen()) {
      this.sidebarState.closeDrawer();
    }
  }
}
