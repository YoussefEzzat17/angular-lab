import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { CurriculumTreeComponent } from './curriculum-tree.component';
import { SidebarUserComponent } from './sidebar-user.component';
import { SidebarStateService } from '../../core/services/sidebar-state.service';
import { IconComponent } from '../../shared/icon.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-course-sidebar',
  standalone: true,
  imports: [CurriculumTreeComponent, SidebarUserComponent, IconComponent],
  host: { class: 'flex flex-col h-full' },
  template: `
    <!-- Curriculum heading + collapse. The phone drawer is titled by its own dialog header, so it skips this row. -->
    @if (variant() === 'desktop') {
      <div class="flex items-center justify-between pb-1 pl-4 pr-3 pt-3">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-stone-500">Topics</h2>
        <button
          type="button"
          (click)="sidebarState.toggleCollapsed()"
          aria-label="Collapse sidebar"
          title="Collapse sidebar"
          class="grid h-11 w-11 place-items-center rounded-xl text-stone-400 transition hover:bg-stone-800 hover:text-gold-300"
        >
          <app-icon name="chevron-left" class="h-4 w-4" />
        </button>
      </div>
    }

    <app-curriculum-tree class="min-h-0 flex-1 overflow-y-auto" />

    <!-- You: name, streak, level and XP -->
    <app-sidebar-user />
  `,
})
export class CourseSidebarComponent {
  readonly sidebarState = inject(SidebarStateService);
  readonly variant = input<'desktop' | 'drawer'>('desktop');
}
