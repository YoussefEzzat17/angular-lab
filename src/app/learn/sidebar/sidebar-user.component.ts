import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GamificationService } from '../../core/services/gamification.service';
import { LearningFacade } from '../../core/services/learning.facade';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-sidebar-user',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="flex items-center gap-3 border-t border-stone-800 px-4 py-3">
      <!-- Avatar -->
      <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-500/20 text-sm font-bold text-gold-300">
        {{ facade.initials() || '?' }}
      </div>
      <div class="min-w-0 flex-1">
        <p class="truncate text-sm font-semibold text-stone-100">{{ facade.name() || 'Learner' }}</p>
        @if (facade.streak() > 0) {
          <p class="text-xs text-stone-400">🔥 {{ facade.streak() }} day streak</p>
        }
        <a routerLink="/journey" data-testid="sidebar-level" class="mt-1 block" [attr.aria-label]="'Level ' + game.level().level.number + ', ' + game.level().level.title + '. Open your journey'">
          <span class="flex items-center justify-between text-xs text-stone-400">
            <span>Lv {{ game.level().level.number }} · {{ game.level().level.title }}</span>
            <span>{{ game.xp() }} XP</span>
          </span>
          <span class="mt-1 block h-1.5 overflow-hidden rounded-full bg-stone-800">
            <span class="block h-full rounded-full bg-gold-400" [style.width.%]="game.level().percent"></span>
          </span>
        </a>
      </div>
    </div>
  `,
})
export class SidebarUserComponent {
  readonly facade = inject(LearningFacade);
  readonly game = inject(GamificationService);
}
