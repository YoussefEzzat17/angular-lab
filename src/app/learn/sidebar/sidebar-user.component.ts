import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LearningFacade } from '../../core/services/learning.facade';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-sidebar-user',
  standalone: true,
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
    </div>
  `,
})
export class SidebarUserComponent {
  readonly facade = inject(LearningFacade);
}
