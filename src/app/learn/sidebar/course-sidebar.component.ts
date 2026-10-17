import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CurriculumTreeComponent } from './curriculum-tree.component';

@Component({
  selector: 'app-course-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CurriculumTreeComponent],
  host: { class: 'flex flex-col h-full' },
  template: `
    <app-curriculum-tree class="flex-1 overflow-y-auto" />

    <!-- Demo App links -->
    <div class="border-t border-stone-800 px-3 py-3">
      <p class="mb-1.5 px-2 text-[10px] font-bold uppercase tracking-wider text-stone-500">Demo App</p>
      <a routerLink="/products"
         routerLinkActive="bg-gold-500/10 text-gold-300"
         class="flex min-h-9 items-center gap-2.5 rounded-xl px-3 py-1.5 text-sm text-stone-400 transition hover:bg-stone-800 hover:text-stone-200">
        <span>🎬</span> Browse titles
      </a>
      <a routerLink="/favorites"
         routerLinkActive="bg-gold-500/10 text-gold-300"
         class="flex min-h-9 items-center gap-2.5 rounded-xl px-3 py-1.5 text-sm text-stone-400 transition hover:bg-stone-800 hover:text-stone-200">
        <span>♡</span> My List
      </a>
    </div>
  `,
})
export class CourseSidebarComponent {}
