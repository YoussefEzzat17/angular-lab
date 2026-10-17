import { Component } from '@angular/core';
import { SidebarHeaderComponent } from './sidebar-header.component';
import { CurriculumTreeComponent } from './curriculum-tree.component';
import { SidebarUserComponent } from './sidebar-user.component';

@Component({
  selector: 'app-course-sidebar',
  standalone: true,
  imports: [SidebarHeaderComponent, CurriculumTreeComponent, SidebarUserComponent],
  host: { class: 'flex flex-col h-full' },
  template: `
    <app-sidebar-header />
    <app-curriculum-tree class="flex-1 overflow-hidden" />
    <app-sidebar-user />
  `,
})
export class CourseSidebarComponent {}
