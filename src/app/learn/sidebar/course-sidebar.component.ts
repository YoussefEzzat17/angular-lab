import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CurriculumTreeComponent } from './curriculum-tree.component';
import { SidebarUserComponent } from './sidebar-user.component';
import { SidebarStateService } from '../../core/services/sidebar-state.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-course-sidebar',
  standalone: true,
  imports: [CurriculumTreeComponent, SidebarUserComponent],
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

    <app-curriculum-tree class="min-h-0 flex-1 overflow-y-auto" />

    <!-- You: name, streak, level and XP -->
    <app-sidebar-user />
  `,
})
export class CourseSidebarComponent {
  readonly sidebarState = inject(SidebarStateService);
}
