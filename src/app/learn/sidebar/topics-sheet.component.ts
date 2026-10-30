import { ChangeDetectionStrategy, Component, DestroyRef, HostListener, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { A11yModule } from '@angular/cdk/a11y';
import { filter } from 'rxjs';
import { SidebarStateService } from '../../core/services/sidebar-state.service';
import { IconComponent } from '../../shared/icon.component';
import { CourseSidebarComponent } from './course-sidebar.component';

/** Pull-down distance (px) that dismisses the sheet, or a shorter but quick flick. */
const DISMISS_DISTANCE = 100;
const FLICK_DISTANCE = 40;
const FLICK_SPEED = 0.5; // px per ms

/**
 * The phone's "Course Topics" bottom sheet. One component, used by every layout, so the topics list looks and
 * behaves the same wherever it is opened from. It closes on Escape, on a tap outside, and on every navigation.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-topics-sheet',
  standalone: true,
  imports: [A11yModule, CourseSidebarComponent, IconComponent],
  template: `
    @if (sidebarState.drawerOpen()) {
      <div class="fixed inset-0 z-40 bg-black/65 lg:hidden" [style.opacity]="scrimOpacity()" (click)="sidebarState.closeDrawer()" aria-hidden="true"></div>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Course navigation"
        cdkTrapFocus
        [cdkTrapFocusAutoCapture]="true"
        class="fixed inset-x-0 bottom-0 z-50 flex max-h-[80vh] flex-col rounded-t-3xl border-t-2 border-gold-400 bg-stone-900 shadow-[0_-10px_32px_rgb(var(--gold-400)/0.22)] lg:hidden"
        [class]="dragging() ? '' : 'transition-transform duration-200 motion-reduce:transition-none'"
        [style.transform]="dragY() ? 'translateY(' + dragY() + 'px)' : null"
        style="padding-bottom: env(safe-area-inset-bottom)"
      >
        <!-- Drag zone: the grip and the title bar. Pulling it down dismisses the sheet; the list below keeps its own scroll.
             Escape and the close button remain for keyboard and screen-reader users. -->
        <div
          class="shrink-0 cursor-grab touch-none select-none"
          (pointerdown)="onDragStart($event)"
          (pointermove)="onDragMove($event)"
          (pointerup)="onDragEnd($event)"
          (pointercancel)="onDragCancel()"
        >
        <!-- A brass grip marks this as a sheet lifted above the page -->
        <div aria-hidden="true" class="mx-auto h-1 w-9 rounded-full bg-gold-400 mt-3"></div>
        <div class="flex items-center justify-between border-b border-stone-800 px-4 py-3">
          <p class="font-bold text-stone-100">Course Topics</p>
          <button
            type="button"
            (click)="sidebarState.closeDrawer()"
            class="-mr-2 grid h-11 w-11 place-items-center rounded-xl text-stone-400 transition hover:bg-stone-800 hover:text-stone-100"
            aria-label="Close topics"
          ><app-icon name="close" class="h-5 w-5" /></button>
        </div>
        </div>
        <div class="flex min-h-0 flex-1 flex-col">
          <app-course-sidebar variant="drawer" class="flex min-h-0 w-full flex-1 flex-col" />
        </div>
      </div>
    }
  `,
})
export class TopicsSheetComponent {
  protected readonly sidebarState = inject(SidebarStateService);
  protected readonly dragY = signal(0);
  protected readonly dragging = signal(false);
  private startY = 0;
  private startTime = 0;

  constructor() {
    inject(Router).events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd), takeUntilDestroyed(inject(DestroyRef)))
      .subscribe(() => this.sidebarState.closeDrawer());
  }

  protected scrimOpacity(): number {
    return 1 - Math.min(this.dragY() / 300, 0.6);
  }

  protected onDragStart(event: PointerEvent): void {
    if ((event.target as HTMLElement).closest('button')) return; // the close button keeps its own click
    this.startY = event.clientY;
    this.startTime = event.timeStamp;
    this.dragging.set(true);
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  }

  protected onDragMove(event: PointerEvent): void {
    if (this.dragging()) this.dragY.set(Math.max(0, event.clientY - this.startY));
  }

  protected onDragEnd(event: PointerEvent): void {
    if (!this.dragging()) return;
    const distance = event.clientY - this.startY;
    const speed = distance / Math.max(1, event.timeStamp - this.startTime);
    this.onDragCancel();
    if (distance > DISMISS_DISTANCE || (distance > FLICK_DISTANCE && speed > FLICK_SPEED)) this.sidebarState.closeDrawer();
  }

  protected onDragCancel(): void {
    this.dragging.set(false);
    this.dragY.set(0);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.sidebarState.drawerOpen()) this.sidebarState.closeDrawer();
  }
}
