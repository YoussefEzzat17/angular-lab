import { Component, inject } from '@angular/core';
import { LearningFacade } from '../../core/services/learning.facade';
import { ThemeService } from '../../core/services/theme.service';
import { IconComponent } from '../../shared/icon.component';

@Component({
  selector: 'app-sidebar-user',
  standalone: true,
  imports: [IconComponent],
  template: `
    <div class="flex items-center gap-3 border-t border-stone-800 p-4">
      <!-- Avatar -->
      <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-500/20 text-sm font-bold text-gold-300">
        {{ facade.initials() || '?' }}
      </div>
      <div class="min-w-0 flex-1">
        <p class="truncate text-sm font-semibold text-stone-100">{{ facade.name() || 'Learner' }}</p>
        @if (facade.streak() > 0) {
          <p class="text-xs text-stone-400">🔥 {{ facade.streak() }} day streak</p>
        }
      </div>
      <button
        type="button"
        (click)="theme.toggle()"
        [attr.aria-label]="theme.theme() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
        class="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-stone-400 transition hover:bg-stone-800 hover:text-gold-300"
      >
        <app-icon [name]="theme.theme() === 'dark' ? 'moon' : 'sun'" class="h-4 w-4" />
      </button>
    </div>
  `,
})
export class SidebarUserComponent {
  readonly facade = inject(LearningFacade);
  readonly theme = inject(ThemeService);
}
