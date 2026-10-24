import { ChangeDetectionStrategy, Component, computed, HostListener, inject, OnDestroy } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { filter, Subscription } from 'rxjs';
import { A11yModule } from '@angular/cdk/a11y';
import { SidebarStateService } from '../../core/services/sidebar-state.service';
import { ProfileService } from '../../core/services/profile.service';
import { OnboardingDialogComponent } from '../../core/onboarding/onboarding-dialog.component';
import { TourComponent } from '../../core/onboarding/tour.component';
import { MobileNavComponent } from '../../shared/mobile-nav.component';
import { CourseSidebarComponent } from '../sidebar/course-sidebar.component';
import { LearningFacade } from '../../core/services/learning.facade';
import { ProgressService } from '../../core/services/progress.service';
import { TOPICS } from '../../core/data/topics';
import type { TopicId } from '../../core/models/learning.models';
import { IconComponent } from '../../shared/icon.component';
import { GROUP_ICONS } from '../../shared/learning-icons';
import { TopNavbarComponent } from './top-navbar.component';
import { LearnFooterComponent } from './learn-footer.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-learn-layout',
  standalone: true,
  imports: [RouterOutlet, CourseSidebarComponent, IconComponent, A11yModule, OnboardingDialogComponent, TourComponent, MobileNavComponent, TopNavbarComponent, LearnFooterComponent],
  template: `
    @if (showOnboarding()) {
      <app-onboarding-dialog (closed)="onOnboardingClosed()" />
    }

    <app-tour />

    <div class="flex h-screen flex-col overflow-hidden">
      <!-- First Tab stop: jump past the header and sidebar. A plain #fragment would resolve against <base href>, so focus moves in code. -->
      <a href="#learn-main" (click)="skipToContent($event)" data-testid="skip-link"
         class="sr-only rounded-xl bg-gold-solid px-4 py-3 text-sm font-semibold text-white shadow-float focus:not-sr-only focus:fixed focus:left-4 focus:top-2 focus:z-[60]">
        Skip to content
      </a>

      <!-- Top navbar — full width, always visible -->
      <app-top-navbar />

      <!-- Body row: sidebar + content -->
      <div class="flex flex-1 overflow-hidden">

      <!-- Desktop sidebar -->
      <aside
        class="hidden h-full lg:flex lg:flex-col lg:border-r lg:border-stone-800 lg:bg-stone-950 lg:transition-all lg:duration-300"
        [style.width]="sidebarState.collapsed() ? '72px' : '280px'"
        [style.overflow]="sidebarState.collapsed() ? 'visible' : 'hidden'"
      >
        @if (!sidebarState.collapsed()) {
          <app-course-sidebar class="flex h-full w-[280px] flex-col" />
        } @else {
          <!-- Rail mode: one entry per curriculum group (icon in a ring that fills with the group's sections, topics done
               beneath). Hover or focus names it; a click opens the sidebar on that group. -->
          <nav aria-label="Collapsed sidebar" class="flex h-full flex-col items-center gap-2 py-3">
            <button
              type="button"
              (click)="sidebarState.toggleCollapsed()"
              aria-label="Expand sidebar"
              class="group relative grid h-11 w-11 shrink-0 place-items-center rounded-xl text-stone-400 transition hover:bg-stone-800 hover:text-gold-300"
            >
              <app-icon name="chevron-right" class="h-4 w-4" />
              <span aria-hidden="true" class="pointer-events-none absolute left-full top-1/2 z-50 ml-3 hidden -translate-y-1/2 whitespace-nowrap rounded-lg bg-stone-800 px-3 py-2 text-xs font-semibold text-stone-100 shadow-float group-hover:block group-focus-visible:block">
                Expand sidebar
              </span>
            </button>

            <div class="h-px w-10 shrink-0 bg-stone-800" aria-hidden="true"></div>

            <ul class="flex flex-col items-center gap-1.5">
              @for (group of facade.groups(); track group.id) {
                <li>
                  <button
                    type="button"
                    (click)="openGroup(group.id)"
                    [attr.aria-label]="group.title + ': ' + group.completedCount + ' of ' + group.topics.length + ' topics completed. Opens the sidebar.'"
                    [attr.aria-current]="currentGroup() === group.id ? 'true' : null"
                    class="group relative flex w-14 flex-col items-center gap-1 rounded-xl pb-1.5 pt-2 transition"
                    [class]="currentGroup() === group.id ? 'bg-gold-500/15 text-gold-300' : 'text-stone-400 hover:bg-stone-800 hover:text-stone-100'"
                  >
                    <span class="relative grid h-10 w-10 place-items-center" aria-hidden="true">
                      <svg class="absolute inset-0 h-10 w-10 -rotate-90" viewBox="0 0 40 40">
                        <circle cx="20" cy="20" [attr.r]="ringRadius" fill="none" stroke="rgb(var(--stone-800))" stroke-width="2.5" />
                        @if (groupSections(group.id).done > 0) {
                          <circle cx="20" cy="20" [attr.r]="ringRadius" fill="none" stroke-width="2.5" stroke-linecap="round"
                                  [attr.stroke]="group.completedCount === group.topics.length ? 'rgb(var(--status-emerald))' : 'rgb(var(--gold-400))'"
                                  [attr.stroke-dasharray]="ringCircumference"
                                  [attr.stroke-dashoffset]="ringCircumference * (1 - groupSections(group.id).done / groupSections(group.id).total)" />
                        }
                      </svg>
                      <app-icon [name]="groupIcons[group.id]" class="h-[18px] w-[18px] text-gold-400" />
                    </span>
                    <span class="text-[11px] font-semibold tabular-nums" aria-hidden="true">{{ group.completedCount }}/{{ group.topics.length }}</span>
                    <span aria-hidden="true" class="pointer-events-none absolute left-full top-1/2 z-50 ml-3 hidden -translate-y-1/2 whitespace-nowrap rounded-lg bg-stone-800 px-3 py-2 text-left shadow-float group-hover:block group-focus-visible:block">
                      <span class="block text-xs font-semibold text-stone-100">{{ group.title }}</span>
                      <span class="mt-0.5 block text-[11px] text-stone-400">
                        {{ group.completedCount }} of {{ group.topics.length }} topics done · {{ groupSections(group.id).done }}/{{ groupSections(group.id).total }} sections
                      </span>
                    </span>
                  </button>
                </li>
              }
            </ul>
          </nav>
        }
      </aside>

      <!-- Main content column -->
      <!-- Below lg this bottom padding clears the fixed phone nav: it ends the scroll after the footer, and the lesson's sticky
           section bar (bottom-0, measured inside this padding) rests right on top of the nav. -->
      <div class="flex min-w-0 flex-1 flex-col overflow-y-auto pb-[calc(4.375rem+env(safe-area-inset-bottom))] lg:pb-0">

        <!-- Router outlet -->
        <main class="flex-1 focus:outline-none" id="learn-main" tabindex="-1">
          <router-outlet />
        </main>

        <app-learn-footer />

        <app-mobile-nav />
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
              class="-mr-2 grid h-11 w-11 place-items-center rounded-xl text-stone-400 transition hover:bg-stone-800 hover:text-stone-100"
              aria-label="Close topics"
            ><app-icon name="close" class="h-5 w-5" /></button>
          </div>
          <div class="flex min-h-0 flex-1 flex-col">
            <app-course-sidebar variant="drawer" class="flex min-h-0 w-full flex-1 flex-col" />
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
  protected readonly facade = inject(LearningFacade);
  protected readonly groupIcons = GROUP_ICONS;
  private readonly progress = inject(ProgressService);
  private readonly document = inject(DOCUMENT);

  protected readonly ringRadius = 17;
  protected readonly ringCircumference = 2 * Math.PI * 17;

  /** The group of the topic on screen, highlighted in the rail. Reads the router's URL signal. */
  protected readonly currentGroup = computed(() => {
    const path = this.facade.currentUrl().split(/[?#]/)[0];
    return TOPICS.find((t) => path === t.path || path.startsWith(`${t.path}/`))?.group ?? null;
  });

  protected groupSections(groupId: string): { done: number; total: number } {
    const topics = TOPICS.filter((t) => t.group === groupId);
    return {
      done: topics.reduce((sum, t) => sum + t.sections.filter((s) => this.progress.isSectionDone(t.id as TopicId, s.id)).length, 0),
      total: topics.reduce((sum, t) => sum + t.sections.length, 0),
    };
  }

  /** Expands the sidebar with this group open, so the click lands on its topics. */
  protected openGroup(groupId: string): void {
    if (!this.sidebarState.expandedGroups().has(groupId)) this.sidebarState.toggleGroup(groupId);
    this.sidebarState.toggleCollapsed();
  }

  private readonly navSub: Subscription;

  constructor() {
    // Auto-close the mobile bottom sheet on every navigation
    this.navSub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => this.sidebarState.closeDrawer());
  }

  ngOnDestroy(): void { this.navSub.unsubscribe(); }

  onOnboardingClosed(): void {}

  skipToContent(event: Event): void {
    event.preventDefault();
    this.document.getElementById('learn-main')?.focus();
  }


  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.sidebarState.drawerOpen()) {
      this.sidebarState.closeDrawer();
    }
  }
}
